using Castle.ActiveRecord.Queries;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OA_WX_GPS.Entity;
using OA_WX_GPS.Util;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;

namespace OA_WX_GPS.Controllers
{
    /// <summary>
    /// RouteEnd2 的摘要说明
    /// </summary>
    public class RouteEnd2 : IHttpHandler
    {
        public log4net.ILog Log = log4net.LogManager.GetLogger(typeof(RouteEnd2));
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            HttpRequest req = HttpContext.Current.Request;
            string appid = System.Configuration.ConfigurationManager.AppSettings["appid"];
            string connStr = System.Configuration.ConfigurationManager.AppSettings["connStr"];
            JObject msg = new JObject();
            if (!Lw_Utils.WeChartCertify(appid, req))
            {
                msg.Add("msg", "APPIDERROR");
                context.Response.Write(msg.ToString());
                context.Response.End();
            }
            else {
                #region 数据获取
                string pid = req.Form["pid"];
                string rid = req.Form["rid"];
                string openid = req.Form["oid"];
                string ccqsrq = req.Form["ccqsrq"];
                string ccqssj = req.Form["ccqssj"];
                string ccjzrq = req.Form["ccjzrq"];
                string ccjzsj = req.Form["ccjzsj"];
                string ccdd = req.Form["ccdd"];

                //string pid = "72989";
                //string rid = "775339";
                //string openid = "oCR784ifSEK2HuSltES5qObVVO_k";
                //string ccqsrq = "2020 - 04 - 01";
                //string ccqssj = "15:02";
                //string ccjzrq = "2020 - 04 - 19";
                //string ccjzsj = "15:37";
                //string ccdd = "出差程序员测试";


                if (string.IsNullOrEmpty("rid") || req.Files.Count == 0 || string.IsNullOrEmpty(pid) || string.IsNullOrEmpty(openid))
                {//没有传入必要参数 
                    msg.Add("msg", "NOPIDOROPENID");
                    context.Response.Write(msg.ToString());
                    context.Response.End();
                    return;
                }

                #endregion

                #region 数据查询
                // step 1:查询视图 获得流程
                string hql = "SELECT NEW V_CarGPS_WFInfo(a.requestId,a.lastname,a.sqr,a.ccqsrq,a.ccqssj,a.ccjzrq,a.ccjzsj,a.ccdd,a.sqgs,a.sqbm)FROM V_CarGPS_WFInfo a WHERE a.requestId=?";
                SimpleQuery<V_CarGPS_WFInfo> SQuery = new SimpleQuery<V_CarGPS_WFInfo>(hql, rid);
                V_CarGPS_WFInfo[] Beans = SQuery.Execute();
                if (Beans.Length == 0)
                {//不存在流程
                    msg.Add("msg", "RIDERROR");
                    context.Response.Write(msg.ToString());
                    context.Response.End();
                    return;
                }
                //查询流程的具体信息
                //select c.tablename from workflow_base a, Workflow_requestbase b,workflow_bill c where a.id=b.workflowid and b.requestid=166058 and a.formid=c.id
                hql = "SELECT NEW workflow_bill(c.tablename)FROM workflow_base a,Workflow_requestbase b,workflow_bill c WHERE a.id=b.workflowid and b.requestid=? and a.formid=c.id";
                SimpleQuery<workflow_bill> tbQuery = new SimpleQuery<workflow_bill>(hql, rid);
                workflow_bill[] tbBeans = tbQuery.Execute();
                if (tbBeans.Length == 0)
                {
                    msg.Add("msg", "TABLENOTFOUNT");
                    context.Response.Write(msg.ToString());
                    context.Response.End();
                    return;
                }
                List<List<Locate>> paths = new List<List<Locate>>();
                
                int pc = 0;
                double DisCount = 0;
                foreach (string key in req.Files.AllKeys) {
                    HttpPostedFile file = req.Files[key];
                    byte[] buf = new byte[file.ContentLength];
                    file.InputStream.Read(buf, 0, file.ContentLength);
                    string str = Encoding.UTF8.GetString(buf);
                    str = str.Insert(0,"[");
                    str = str.Insert(str.Length,"]");
                    JArray Points = (JArray)JsonConvert.DeserializeObject(str);
                    /**
                     * [
                     *  {},
                     *  {
                     *   la:x,纬度
                     *   lo:x,经度
                     *   s:x 速度
                     *   a:x 精度
                     *   t:x 只有首尾的点会有
                     *   d:x 只有首尾的点会有d d=1表示开始 d=2表示路段结束
                     *  }
                     * ]
                     * 
                     */
                    var i = 0;
                    //List<Locate> 
                    List<Locate> path = new List<Locate>();
                    var flg = false;
                    
                    foreach (JToken jt in Points) {
                        if (i==0) {
                            i++;
                            continue;
                        }
                        pc++;
                        JObject point = (JObject)jt;
                        Locate lo = new Locate();
                        var tt = point["d"];
                        int d = 0;
                        if (point.ContainsKey("d") == true) {
                            d = (int)point["d"];
                        }
                        switch (d) {
                            case 1://开始点
                                lo.lat = (decimal)point["la"];
                                lo.lng = (decimal)point["lo"];
                                lo.speed = (decimal)point["s"];
                                lo.accuracy = (decimal)point["a"];
                                lo.StrT1 = point["t"].ToString();
                                path.Add(lo);
                                flg = true;
                                break;
                            case 2://结束点
                                lo.lat = (decimal)point["la"];
                                lo.lng = (decimal)point["lo"];
                                lo.speed = (decimal)point["s"];
                                lo.accuracy = (decimal)point["a"];
                                lo.StrT1 = point["t"].ToString();
                                path.Add(lo);
                                double dis = Lw_Utils.GetDistance(path);
                                path[0].dis = (decimal)dis;
                                DisCount += dis;
                                paths.Add(path);
                                path = new List<Locate>();
                                flg = false;
                                break;
                            case 0:
                                lo.lat = (decimal)point["la"];
                                lo.lng = (decimal)point["lo"];
                                lo.speed = (decimal)point["s"];
                                lo.accuracy = (decimal)point["a"];
                                if (point.ContainsKey("t")==true) { 
                                    lo.StrT1 = point["t"].ToString();
                                }
                                path.Add(lo);
                                flg = true;
                                break;
                        }
                    }
                    if (flg) {
                        double dis = Lw_Utils.GetDistance(path);
                        path[0].dis = (decimal)dis;
                        DisCount += dis;
                        paths.Add(path);
                    }
                    
                }
                
                #endregion
                //pc 点个数 disCount 距离
                //保存 路线总表
                uf_CarGPS_WFRange range = new uf_CarGPS_WFRange();
                range.formmodeid = 136;
                range.Range = (decimal)DisCount;
                range.RangeCount = pc;
                range.CreateTime = DateTime.Now.ToString();
                range.LastUpdateTime = DateTime.Now.ToString();
                range.sqr = Int32.Parse(pid);
                range.ccqsrq = ccqsrq;
                range.ccqssj = ccqssj;
                range.ccjzrq = ccjzrq;
                range.ccjzsj = ccjzsj;
                range.ccdd = ccdd;
                range.WxOpenid = openid;
                range.wfRequestId = Int32.Parse(rid);
                range.Save();
                //
                SqlConnection conn = null;
                SqlTransaction tr = null;
                conn = new SqlConnection(connStr);
                conn.Open();
                string sql;
                sql = string.Format("SELECT id,requestId,IsFinish,sqr FROM {0} WHERE requestId = {1} ", tbBeans[0].tablename, rid);
                SqlCommand sqm = new SqlCommand(sql, conn);
                SqlDataReader dr = sqm.ExecuteReader();
                formtable_main fbean = new formtable_main();
                if (dr.FieldCount == 0)
                {
                    msg.Add("msg", "TABLENOTFOUNT");
                    context.Response.Write(msg.ToString());
                    context.Response.End();
                    return;
                }
                while (dr.Read())
                {
                    fbean.id = (int)dr["id"];
                    fbean.requestId = (int)dr["requestId"];
                    fbean.sqr = (int)dr["sqr"];
                    if (dr["IsFinish"] == System.DBNull.Value)
                    {
                        fbean.isFinish = 0;
                    }
                    else
                    {
                        fbean.isFinish = (int)dr["IsFinish"];
                    }
                }
                dr.Close();
                try
                {
                    tr = conn.BeginTransaction();
                    SqlCommand scmd = new SqlCommand();
                    scmd.Connection = conn;
                    scmd.Transaction = tr;
                    //开始执行sql语句
                    int i = 0;
                    foreach (List<Locate> los in paths)
                    {
                        uf_CarGPS_WFRoute bean = new uf_CarGPS_WFRoute();
                        bean.WFRangeID = range.id;
                        JArray ja = new JArray();
                        int j = 0;
                        foreach (Locate lo in los) {
                            JObject jo = new JObject();
                            if (j==0 || j==los.Count-1) {
                                jo.Add("d",0);
                            }
                            if (!string.IsNullOrEmpty(lo.StrT1)) {
                                jo.Add("t", lo.StrT1);
                            }
                            jo.Add("la",lo.lat);
                            jo.Add("lo",lo.lng);
                            ja.Add(jo);
                            j++;
                        }
                        sql = "INSERT INTO uf_CarGPS_WFRoute(PointsCount,RouteRange,WFRangeID,Points) VALUES ({0},{1},{2},'{3}')";
                        sql = string.Format(sql, los.Count, los[0].dis, range.id, ja.ToString().Replace(" ", ""));
                        scmd.CommandText = sql;
                        i = scmd.ExecuteNonQuery();
                        if (i != 1)
                        {
                            throw new Exception("没有插入线路表");
                        }
                    }
                    sql = string.Format("UPDATE {0} SET IsFinish=1,lcs = {1} where  requestId={2}", tbBeans[0].tablename, Math.Round(range.Range / 1000, 2), rid);
                    scmd.CommandText = sql;
                    i = scmd.ExecuteNonQuery();
                    if (i != 1)
                    {
                        throw new Exception("更新了多个流程的结束字段");
                    }
                    sql = string.Format("UPDATE uf_CarGPS_WFRange SET sqbm={0},sqgs={1} WHERE id={2}", Beans[0].sqbm, Beans[0].sqgs, range.id);
                    scmd.CommandText = sql;
                    i = scmd.ExecuteNonQuery();
                    if (i != 1)
                    {
                        throw new Exception("更新了多个路程表");
                    }
                    tr.Commit();
                }
                catch (Exception _e1)
                {
                    Log.Error("RouteEnd SQL Exception:", _e1);
                    if (tr != null)
                    {
                        tr.Rollback();//回滚语句
                    }
                    throw;
                }
                finally
                {

                    if (conn != null && conn.State == System.Data.ConnectionState.Open)
                    {
                        conn.Close();
                    }
                }
                #region 返回数据
                modeDataShare_136 ms = new modeDataShare_136(0, range.id);
                modeDataShare_136_set mss = new modeDataShare_136_set(0, range.id);
                ms.Save();
                mss.Save();
                msg.Add("msg", "OK");
                context.Response.Write(msg.ToString());
                context.Response.End();
                #endregion
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}
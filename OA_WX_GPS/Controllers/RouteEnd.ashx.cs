using Castle.ActiveRecord.Queries;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OA_WX_GPS.Entity;
using OA_WX_GPS.Util;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;

namespace OA_WX_GPS.Controllers
{
    /// <summary>
    /// 在结束行程时需要执行的代码
    /// 在点击结束行程时传递这里
    /// 必传参数
    /// 1.appid 
    /// 2.rid 流程id
    /// 3.pid 用户表的id
    /// 4.FileList 文件参数
    /// 5.oid openid
    /// 选传参数
    /// 1.ccqsrq 起始日期
    /// 2.ccqssj 起始时间
    /// 3.ccjzrq 截至日期
    /// 4.ccjzsj 截至时间
    /// 5.ccdd 目的地
    /// 操作内容
    /// 1.创建此流程的路线表数据
    /// 2.读取文件的json创建路线表下的线路
    /// 返回：
    /// 1.APPIDERROR app验证失败
    /// 2.FILEERROR 文件中存在 错误信息 
    /// 3.RIDERROR 不存在此流程
    /// 4.NOPIDOROPENID 没有传必要参数 或者 一个文件行程都没有传入
    /// 5.TABLENOTFOUNT 没有找到对应的信息表
    /// 6.OK
    /// </summary>
    public class RouteEnd : IHttpHandler
    {
        public log4net.ILog Log = log4net.LogManager.GetLogger(typeof(RouteEnd));
        public void ProcessRequest(HttpContext context)
        {
            try
            {
                context.Response.ContentType = "text/plain";
                HttpRequest req = HttpContext.Current.Request;
                string appid = System.Configuration.ConfigurationManager.AppSettings["appid"];
                string connStr = System.Configuration.ConfigurationManager.AppSettings["connStr"];
                JObject msg = new JObject();
                if (!Lw_Utils.WeChartCertify(appid, req))
                //if (!true)
                {
                    msg.Add("msg", "APPIDERROR");
                    context.Response.Write(msg.ToString());
                    context.Response.End();
                }
                else
                {
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
                    //aid wx18f0c07ca226079c
                    //rid "775339"
                    //pid "72989"
                    //oid "oCR784ifSEK2HuSltES5qObVVO_k"
                    //ccqsrq "2020-04-01"
                    //ccqssj 15:02
                    //ccjzrq 2020-04-19
                    //ccjzsj 15:37
                    //ccdd 出差程序员测试

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
                    string hql = "SELECT NEW V_CarGPS_WFInfo(a.requestId,a.lastname,a.sqr,a.ccqsrq,a.ccqssj,a.ccjzrq,a.ccjzsj,a.ccdd)FROM V_CarGPS_WFInfo a WHERE a.requestId=?";
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

                    Log.Error("RouteEnd 7");
                    #endregion

                    #region 存储数据 

                    // 读取文件
                    /**
                     * 1.将点位的信息组合在一起
                     * 1.1 读取总路线情况
                     * 分多个文件
                     * 1.1.1 第一次读取的信息
                     * 1.创建日期 d1
                     * 2.更新时间 d2
                     * 3.距离 dis=0
                     * 4.pc 总点个数
                     * 5.flg 是否发送服务器
                     * 6.idx=0 说明是第一个文件，需要进行读取。
                     * 
                     * 1.2 读取路线详细情况
                     * 
                     */
                    //处理文件 将文件的point全部整合
                    //JObject filejson = new JObject();
                    JArray pointsJarray = new JArray();
                    //bool flg = true;
                    int i = 0;
                    foreach (string key in req.Files.AllKeys)
                    {
                        HttpPostedFile file = req.Files[key];
                        byte[] buf = new byte[file.ContentLength];
                        file.InputStream.Read(buf, 0, file.ContentLength);
                        string str = Encoding.UTF8.GetString(buf);
                        JObject jo = (JObject)JsonConvert.DeserializeObject(str);
                        JArray points = (JArray)jo["points"];
                        if (points != null && points.Count > 0)
                        {
                            foreach (JToken jt in points)
                            {
                                JObject point = (JObject)jt;
                                pointsJarray.Insert(i, point);
                                i++;
                            }
                        }
                    }
                    //路程实体类
                    uf_CarGPS_WFRange range = new uf_CarGPS_WFRange();
                    //路线List表
                    List<uf_CarGPS_WFRoute> Routes = new List<uf_CarGPS_WFRoute>();
                    //单个路线表
                    uf_CarGPS_WFRoute Route = new uf_CarGPS_WFRoute();
                    //开始处理所有的点位信息
                    i = 0;
                    JArray ja_points = new JArray();
                    foreach (JToken jt in pointsJarray)
                    {
                        JObject point = (JObject)jt;
                        if (i != 0 && (int)point["d"] == 0)
                        {
                            Route.Points = ja_points.ToString();
                            Routes.Add(Route);
                            range.RangeCount++;//线路数+1
                            range.Range += Route.RouteRange;
                            Route = new uf_CarGPS_WFRoute();
                            Route.PointsCount = 0;
                            Route.RouteRange = 0;
                            ja_points = new JArray();
                        }
                        Route.PointsCount += 1;
                        Route.RouteRange += (decimal)point["d"];
                        ja_points.Add(point);
                        i++;
                        if (i == pointsJarray.Count)
                        {
                            Route.Points = ja_points.ToString();

                            Routes.Add(Route);
                            range.Range += Route.RouteRange;

                            range.RangeCount++;//线路数+1
                            range.CreateTime = DateTime.Now.ToString();
                            range.LastUpdateTime = DateTime.Now.ToString();
                            //range.sqbm = fBeans[0].sqbm;
                            //range.sqgs = fBeans[0].sqgs;
                            range.sqr = Int32.Parse(pid);
                            range.ccqsrq = ccqsrq;
                            range.ccqssj = ccqssj;
                            range.ccjzrq = ccjzrq;
                            range.ccjzsj = ccjzsj;
                            range.ccdd = ccdd;
                            range.WxOpenid = openid;
                            //range.formmodeid = 136;
                            //range.modedatacreater = 1;
                            //range.modedatacreatertype = 0;
                            //range.modedatacreatetime = DateTime.Now.ToString("HH:mm:ss");
                            //range.modedatacreatedate = DateTime.Now.ToString("yyyy-MM-dd");
                            range.wfRequestId = Int32.Parse(rid);

                            range.Save();//保存路程表
                        }
                    }
                    //接下来将数据库中汇总的数据插入
                    SqlConnection conn = null;
                    SqlTransaction tr = null;//conn.BeginTransaction();

                    conn = new SqlConnection(connStr);
                    conn.Open();
                    string sql;
                    sql = string.Format("SELECT id,requestId,sqgs,sqbm,sqr,IsFinish FROM {0} WHERE requestId = {1} ", tbBeans[0].tablename, rid);
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
                        fbean.sqgs = (int)dr["sqgs"];
                        fbean.sqr = (int)dr["sqr"];
                        fbean.sqbm = (int)dr["sqbm"];
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
                        i = 0;
                        foreach (uf_CarGPS_WFRoute bean in Routes)
                        {
                            bean.WFRangeID = range.id;
                            sql = "INSERT INTO uf_CarGPS_WFRoute(PointsCount,RouteRange,WFRangeID,Points) VALUES ({0},{1},{2},'{3}')";
                            sql = string.Format(sql, bean.PointsCount+"", bean.RouteRange, range.id, bean.Points.Replace(" ",""));
                            scmd.CommandText = sql;
                            i = scmd.ExecuteNonQuery();
                            if (i != 1)
                            {
                                throw new Exception("没有插入线路表");
                            }
                        }
                        //finish
                        sql = string.Format("UPDATE {0} SET IsFinish=1,lcs = {1} where  requestId={2}", tbBeans[0].tablename, Math.Round(range.Range / 1000, 2) , rid);
                        scmd.CommandText = sql;
                        i = scmd.ExecuteNonQuery();
                        if (i != 1)
                        {
                            throw new Exception("更新了多个流程的结束字段");
                        }
                        //range.sqbm = fBeans[0].sqbm;
                        //range.sqgs = fBeans[0].sqgs;
                        //uf_CarGPS_WFRange
                        sql = string.Format("UPDATE uf_CarGPS_WFRange SET sqbm={0},sqgs={1} WHERE id={2}", fbean.sqbm, fbean.sqgs, range.id);
                        scmd.CommandText = sql;
                        i = scmd.ExecuteNonQuery();
                        if (i != 1)
                        {
                            throw new Exception("更新了多个路程表");
                        }
                        //提交事务
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

                    #endregion

                    #region 返回数据
                    //uf_CarGPS_WFRange 保存其他数据
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
            catch (Exception _e)
            {
                Log.Error("RouteEnd:", _e);
                throw;
            }
            context.Response.Write("Hello World");
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
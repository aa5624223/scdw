using Castle.ActiveRecord.Queries;
using Newtonsoft.Json.Linq;
using OA_WX_GPS.Entity;
using OA_WX_GPS.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OA_WX_GPS.Controllers
{
    /// <summary>
    /// 用户的操作记录 
    /// 记录用户的操作记录
    /// 1.appid appid
    /// 2.uid 用户id
    /// 3.rid 流程id
    /// 4.detial 操作记录
    /// 5.otype 操作类型
    /// 返回：
    /// 1.APPIDERROR app验证失败
    /// 2.NOPARAM 没有传关键参数
    /// 
    /// </summary>
    public class OperateRecord : IHttpHandler
    {
        public log4net.ILog Log = log4net.LogManager.GetLogger(typeof(OperateRecord));

        ///
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

                    #region 数据获取 和 验证
                    string uid = req.Form["uid"];
                    string rid = req.Form["rid"];
                    //string detial = req.Form["detial"];
                    string otype = req.Form["otype"];
                    string speed = req.Form["speed"];
                    string accuracy = req.Form["accuracy"];
                    string dis = req.Form["dis"];
                    string point = req.Form["point"];
                    string detial = req.Form["detial"];
                    if (string.IsNullOrEmpty(uid) || string.IsNullOrEmpty(rid)  || string.IsNullOrEmpty(otype))
                    {
                        msg.Add("msg", "NOPARAM");
                        context.Response.Write(msg.ToString());
                        context.Response.End();
                        return;
                    }
                    #endregion

                    #region 查询数据

                    string hql = "SELECT NEW uf_CarGPS_WFRangeOperateRecord(a.id,a.sqr,a.wfRequestId,a.Rid,a.RNumber,a.OpTime,a.OpType,a.OpDetails,a.Distance,a.Speed,a.Accuracy,a.Points) FROM uf_CarGPS_WFRangeOperateRecord a WHERE a.wfRequestId=?";
                    SimpleQuery<uf_CarGPS_WFRangeOperateRecord> SQuery = new SimpleQuery<uf_CarGPS_WFRangeOperateRecord>(hql, rid);
                    uf_CarGPS_WFRangeOperateRecord[] Beans = SQuery.Execute();
                    uf_CarGPS_WFRangeOperateRecord bean = new uf_CarGPS_WFRangeOperateRecord();

                    #endregion

                    #region 处理数据

                    bool flg = true;
                    switch (otype)
                    {
                        case "开始":
                            if (Beans.Length > 0)
                            {
                                //删除无效的操作记录
                                foreach (uf_CarGPS_WFRangeOperateRecord bean1 in Beans)
                                {
                                    bean1.Delete();
                                }
                            }
                            //添加开始的记录
                            bean.RNumber = 1;
                            bean.OpType = "开始";
                            break;
                        case "暂停":
                            if (Beans.Length >= 1)
                            {
                                bean.RNumber = Beans[Beans.Length - 1].RNumber;
                            }
                            else {
                                bean.RNumber = 1;
                            }
                            bean.OpType = "暂停";
                            break;
                        case "继续":
                            if (Beans.Length >= 1)
                            {
                                bean.RNumber = Beans[Beans.Length - 1].RNumber+1;
                            }
                            else
                            {
                                bean.RNumber = 1;
                            }
                            bean.OpType = "继续";
                            bean.OpTime = DateTime.Now;
                            break;
                        case "结束":
                            if (Beans.Length >= 1)
                            {
                                bean.RNumber = Beans[Beans.Length - 1].RNumber;
                            }
                            else
                            {
                                bean.RNumber = 1;
                            }
                            bean.OpType = "结束";
                            break;
                        case "关闭":
                            if (Beans.Length >= 1)
                            {
                                bean.RNumber = Beans[Beans.Length - 1].RNumber;
                            }
                            else
                            {
                                bean.RNumber = 1;
                            }
                            bean.OpType = "关闭";
                            break;
                        case "异常":
                            if (Beans.Length >= 1)
                            {
                                bean.RNumber = Beans[Beans.Length - 1].RNumber;
                            }
                            else
                            {
                                bean.RNumber = 1;
                            }
                            bean.OpType = "异常";
                            break;
                        default:
                            flg = false;
                            break;
                    }
                    if (flg)
                    {
                        bean.wfRequestId = int.Parse(rid);
                        bean.sqr = int.Parse(uid);
                        bean.OpTime = DateTime.Now;
                        bean.Speed = int.Parse(speed);
                        bean.Accuracy = int.Parse(accuracy);
                        bean.Distance = decimal.Parse(dis);
                        bean.Points = point;
                        bean.OpDetails = detial;
                        bean.Save();
                        msg.Add("msg", "OK");
                        context.Response.Write(msg.ToString());
                        context.Response.End();
                    }
                    else {
                        msg.Add("msg", "ERROR");
                        context.Response.Write(msg.ToString());
                        context.Response.End();
                    }
                    #endregion;

                }
            }
            catch (Exception _e)
            {
                Log.Error("OperateRecord ERROR", _e);
                throw;
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
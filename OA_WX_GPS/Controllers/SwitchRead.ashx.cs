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
    /// 获取员工的流程
    /// 需要传值
    /// 1.appid
    /// 2.员工的oa Id
    /// 返回值：
    /// 1.
    /// OK
    /// 
    /// 1.流程List
    /// Demo:
    /// {
    ///     msg:OK
    ///     d:[
    ///      {
    ///        data.Add("requestId",bean.requestId);
    ///        data.Add("sqr",bean.sqr);//人员id
    ///        data.Add("lastname",bean.lastname);//人员名字 
    ///        data.Add("ccqsrq",bean.ccqsrq);//起始日期
    ///        data.Add("ccqssj", bean.ccqssj);//开始时间
    ///        data.Add("ccjzrq", bean.ccjzrq);//截至日期
    ///        data.Add("ccjzsj", bean.ccjzsj);//截至时间
    ///        data.Add("ccdd", bean.ccdd);//出行的地方
    ///      },
    ///      {},
    ///      ...
    ///     ]
    /// }
    /// </summary>
    public class SwitchRead : IHttpHandler
    {
        public log4net.ILog Log = log4net.LogManager.GetLogger(typeof(SwitchRead));
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            HttpRequest req = HttpContext.Current.Request;
            string appid = System.Configuration.ConfigurationManager.AppSettings["appid"];
            JObject msg = new JObject();
            if (!Lw_Utils.WeChartCertify(appid, req))
            {
                msg.Add("msg", "APPIDERROR");
                context.Response.Write(msg.ToString());
                context.Response.End();
            }
            else { //验证成功
                
                #region 数据获取 

                string pid = req.Form["pid"];

                #endregion
                /**
                 * 找到此员工的所有流程 requestId
                 * 1. SELECT requestId FROM V_CarGPS_WFInfo where sqr = 56218(员工id) 
                 * 通过 in requestId 找到其所在的所有表名 一个requestid 对应一个表
                 * 
                 * 反写的时候用
                 * 2. select a.tablename,c.requestid from workflow_bill a,workflow_base b,Workflow_requestbase c where a.id=b.formid and b.id = c.workflowid  and c.requestid in (587200,761508,763660)
                 * 
                 * 3.利用2查出来的 tablename 和 requestid 循环 出下面的语句 查出 所有的isFinish 只有isFinish = 1 才行
                 * 这里只能用sql语句查询了
                 * select requestId,IsFinish from formtable_main_318[tablename] where requestId=587200 and IsFinish = 1
                 * union all 
                 * select requestId,IsFinish from formtable_main_664[tablename] where requestId=587200 and IsFinish = 1
                 * ...
                 */
                #region 数据查询

                string hql = "SELECT NEW V_CarGPS_WFInfo(a.requestId,a.lastname,a.sqr,a.ccqsrq,a.ccqssj,a.ccjzrq,a.ccjzsj,a.ccdd)FROM V_CarGPS_WFInfo a WHERE a.sqr=?";
                SimpleQuery<V_CarGPS_WFInfo> SQuery = new SimpleQuery<V_CarGPS_WFInfo>(hql,pid);
                V_CarGPS_WFInfo[] Beans = SQuery.Execute();
                #endregion

                #region 数据封装
                JArray DataList = new JArray();
                foreach (V_CarGPS_WFInfo bean in Beans) {
                    JObject data = new JObject();
                    data.Add("requestId",bean.requestId);
                    data.Add("sqr",bean.sqr);//人员id
                    data.Add("lastname",bean.lastname);//人员名字 
                    data.Add("ccqsrq",bean.ccqsrq);//起始日期
                    data.Add("ccqssj", bean.ccqssj);//开始时间
                    data.Add("ccjzrq", bean.ccjzrq);//截至日期
                    data.Add("ccjzsj", bean.ccjzsj);//截至时间
                    data.Add("ccdd", bean.ccdd);//出行的地方
                    DataList.Add(data);
                }
                msg.Add("msg", "OK");
                msg.Add("d", DataList);
                #endregion

                #region 数据发送

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
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
    /// Login 的摘要说明
    /// 登录的验证
    /// 1.如果登录成功 直接进入流程界面
    /// 2.登录失败进入 验证界面
    /// 需要传的参数 
    /// appid 认证的appid
    /// openid 微信id
    /// 返回值
    /// msg
    /// 1.APPIDERROR app验证失败
    /// 2.NOPIDOROPENID 没有传入必要参数
    /// 3.NOTFOUNT 微信绑定表没有此人信息 需要进行微信绑定操作
    /// 4.OK
    /// 
    /// id 用于查询微信绑定表
    /// pid 员工id 用于查询oa表
    /// wxName 微信名字
    /// </summary>
    public class Login : IHttpHandler
    {
        public log4net.ILog Log = log4net.LogManager.GetLogger(typeof(Login_Certify));

        public void ProcessRequest(HttpContext context)
        {
            try
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
                else
                {
                    string openid1 = req.Form["openid"];
                    if (string.IsNullOrEmpty(openid1))
                    {
                        msg.Add("msg", "NOPIDOROPENID ");
                        context.Response.Write(msg.ToString());
                        context.Response.End();
                        return;
                    }
                    //UBeans[0].id
                    string hql = "SELECT NEW uf_CarGPS_OAWX(a.id,a.requestId,a.WxName,a.WxOpenid,a.OAAccount)FROM uf_CarGPS_OAWX a WHERE a.WxOpenid=?"; ;
                    SimpleQuery<uf_CarGPS_OAWX> CQuery = new SimpleQuery<uf_CarGPS_OAWX>(hql, openid1);
                    uf_CarGPS_OAWX[] CBeans = CQuery.Execute();
                    if (CBeans.Length == 0)
                    {
                        msg.Add("msg", "NOTFOUNT");
                        context.Response.Write(msg.ToString());
                        context.Response.End();
                        return;
                    }
                    //查询

                    msg.Add("id", CBeans[0].id);//用于查询人员表 和路线图的
                    msg.Add("pid", CBeans[0].OAAccount);//用于查询流程的
                    msg.Add("wxName", CBeans[0].WxName);
                    msg.Add("msg", "OK");

                    context.Response.Write(msg.ToString());
                    context.Response.End();
                }
            }
            catch (Exception _e)
            {
                Log.Error("Login :", _e);
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
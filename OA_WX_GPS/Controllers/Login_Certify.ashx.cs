using Castle.ActiveRecord.Queries;
using Newtonsoft.Json.Linq;
using OA_WX_GPS.Entity;
using OA_WX_GPS.Util;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace OA_WX_GPS.Controllers
{
    /// <summary>
    /// Login_Certify 的摘要说明
    /// 微信的授权
    /// 需要传的参数
    /// appid 认证的appid
    /// pid 员工输入的员工工号
    /// uName 员工姓名
    /// openid 员工微信id
    /// wxName 员工微信名
    /// 返回值:
    /// msg
    /// 1.APPIDERROR app验证失败
    /// 2.NOPIDOROPENID 没有传入必要参数
    /// 3.NOTFOUNT 没有在oa表中找到这个员工
    /// 4.EXIST 此员工已经绑定了员工信息
    /// 5.OK 在表中添加了记录
    /// 并返回
    /// id: 用于查询微信绑定表
    /// pid: 员工id 用于查询oa表
    /// wxName: 微信名字
    /// 
    /// </summary>
    public class Login_Certify : IHttpHandler
    {
        public log4net.ILog Log = log4net.LogManager.GetLogger(typeof(Login_Certify));
        public void ProcessRequest(HttpContext context)
        {
            try
            {
                context.Response.ContentType = "text/plain";
                HttpRequest req = HttpContext.Current.Request;
                //获取app序列号
                string appid = System.Configuration.ConfigurationManager.AppSettings["appid"];
                string connStr = System.Configuration.ConfigurationManager.AppSettings["connStr"];
                JObject msg = new JObject();
                //没有权限的
                if (!Lw_Utils.WeChartCertify(appid, req))
                {
                    msg.Add("msg", "APPIDERROR");
                    context.Response.Write(msg.ToString());
                    context.Response.End();
                }
                else
                {//验证成功
                    #region 接收数据
                    string pid1 = req.Form["pid"];
                    string uName = req.Form["uName"];
                    string openid1 = req.Form["openid"];
                    string wxName1 = req.Form["wxName"];
                    //没有传入必传参数
                    if (string.IsNullOrEmpty(pid1) || string.IsNullOrEmpty(openid1))
                    {
                        msg.Add("msg", "NOPIDOROPENID");
                        context.Response.Write(msg.ToString());
                        context.Response.End();
                        return;
                    }

                    #endregion

                    #region 数据查询
                    //查询人员
                    //password

                    /**
                     * 
                     * string hql = "";
                     * 
                     */
                    // string hql = "";
                    // string sql = "";
                    // 
                    SqlConnection conn = null;
                    SqlTransaction tr = null;
                    HrmResource UBean = new HrmResource();
                    try
                    {
                        conn = new SqlConnection(connStr);
                        conn.Open();
                        string sql = "SELECT id,loginid,lastname,password FROM HrmResource WHERE loginid='{0}' AND password=UPPER(substring(sys.fn_sqlvarbasetostr(HashBytes('MD5','{1}')),3,32))";
                        sql = string.Format(sql, pid1, uName);
                        SqlCommand sqm = new SqlCommand(sql, conn);
                        SqlDataReader dr = sqm.ExecuteReader();
                        if (!dr.HasRows)
                        {
                            msg.Add("msg", "NOTFOUNT");
                            context.Response.Write(msg.ToString());
                            context.Response.End();
                            return;
                        }
                        else
                        {
                            while (dr.Read())
                            {
                                UBean.id = (int)dr["id"];
                                if (dr["loginid"] != null)
                                {
                                    UBean.loginid = dr["loginid"].ToString();
                                }
                                if (dr["lastname"] != null)
                                {
                                    UBean.lastname = dr["lastname"].ToString();
                                }
                                if (dr["password"] != null)
                                {
                                    UBean.password = dr["password"].ToString();
                                }
                            }
                            
                            dr.Close();
                        }
                    }
                    catch (Exception _e1)
                    {
                        Log.Error("Login_Certify Error", _e1);
                    }
                    finally {
                        if (conn!=null && conn.State==System.Data.ConnectionState.Open) {
                            conn.Close();
                        }
                    }
                    


                    string hql="";
                    //查找对应的绑定表
                    //原则 一个微信、一个员工 只能绑定一次
                    hql = "SELECT NEW uf_CarGPS_OAWX(a.id,a.requestId,a.WxName,a.WxOpenid,"+ UBean.id+ ")FROM uf_CarGPS_OAWX a WHERE a.OAAccount=? or a.WxOpenid=?";
                    SimpleQuery<uf_CarGPS_OAWX> CQuery = new SimpleQuery<uf_CarGPS_OAWX>(hql, UBean.loginid, openid1);
                    uf_CarGPS_OAWX[] CBeans = CQuery.Execute();
                    //如果找到说明之前已经绑定过 返回错误信息 一个人只能绑定一次
                    if (CBeans.Length > 0)
                    {
                        msg.Add("msg", "EXIST");
                        context.Response.Write(msg.ToString());
                        context.Response.End();
                        return;
                    }
                    //否则说明没有绑定过 为这个员工添加绑定的信息 
                    uf_CarGPS_OAWX bean = new uf_CarGPS_OAWX();
                    bean.OAAccount = UBean.id;
                    bean.WxOpenid = openid1;
                    bean.WxName = wxName1;
                    bean.formmodeid = 135;
                    bean.modedatacreater = 1;
                    bean.modedatacreatertype = 0;
                    bean.modedatacreatedate = DateTime.Now.ToString("yyyy-MM-dd");
                    bean.modedatacreatetime = DateTime.Now.ToString("HH:mm:ss");
                    bean.SaveAndFlush();
                    //保存其绑定表
                    modeDataShare_135 ms = new modeDataShare_135(0,bean.id);
                    modeDataShare_135_set mss = new modeDataShare_135_set(0,bean.id);
                    ms.Save();
                    mss.Save();
                    #endregion

                    #region 数据封装

                    msg.Add("id", bean.id);//用于查询人员表 和路线图的
                    msg.Add("pid",bean.OAAccount);//用于查询 人员表
                    msg.Add("wxName", bean.WxName);//此人的微信名字
                    msg.Add("msg", "OK");

                    #endregion

                    #region 参数返回

                    context.Response.Write(msg.ToString());
                    context.Response.End();

                    #endregion
                }
            }
            catch (Exception _e)
            {
                Log.Error("Login_Certify :", _e);
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
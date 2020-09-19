using Castle.ActiveRecord.Queries;
using Newtonsoft.Json.Linq;
using OA_WX_GPS.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace OA_WX_GPS
{
    public partial class MapSearch2 : System.Web.UI.Page
    {
        public log4net.ILog Log = log4net.LogManager.GetLogger(typeof(MapSearch2));
        public JObject Range;
        public JArray points;
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                string rid = Context.Request.Params["rid"];
                string method = Context.Request.Params["method"];
                //rid = 782512 + "";
                Range = new JObject();
                points = new JArray();
                if (string.IsNullOrEmpty(rid))
                {
                    Range = new JObject();
                    points = new JArray();
                    return;
                }
                else
                {
                    #region 查询数据
                    //查询线路信息
                    string hql;
                    if (string.IsNullOrEmpty(method)) {//method=NULL 查微信
                        hql = "SELECT NEW uf_CarGPS_WFRange(a.id,a.wfRequestId,a.sqr,a.ccqsrq,a.ccqssj,a.ccjzrq,a.ccjzsj,a.ccdd,a.Range,a.RangeCount,a.sqgs,a.sqbm,a.LastUpdateTime,a.WxOpenid)FROM uf_CarGPS_WFRange a WHERE wfRequestId=?";
                    }
                    else//method!=NULL GPS
                    {
                        hql = "SELECT NEW uf_CarGPS_WFRange(a.id,a.wfRequestId,a.sqr,a.ccqsrq,a.ccqssj,a.ccjzrq,a.ccjzsj,a.ccdd,a.Range,a.RangeCount,a.sqgs,a.sqbm,a.LastUpdateTime,a.WxOpenid)FROM uf_CarGPS_WFRange a WHERE wfRequestId=? and WxOpenid is null";
                    }
                    SimpleQuery<uf_CarGPS_WFRange> GQuery = new SimpleQuery<uf_CarGPS_WFRange>(hql, Int32.Parse(rid));
                    uf_CarGPS_WFRange[] GBeans = GQuery.Execute();
                    if (GBeans.Length < 1)
                    {
                        Range = new JObject();
                        points = new JArray();
                        return;
                    }
                    uf_CarGPS_WFRange GBean = GBeans[0];
                    //查询人员信息
                    hql = "SELECT NEW HrmResource(a.id,a.loginid,a.lastname)FROM HrmResource a WHERE a.id=?";
                    SimpleQuery<HrmResource> SQuery = new SimpleQuery<HrmResource>(hql, GBean.sqr);
                    HrmResource[] UBeans = SQuery.Execute();
                    if (UBeans.Length == 0)
                    {
                        Range = new JObject();
                        points = new JArray();
                        return;
                    }
                    //查询出线路信息
                    hql = "SELECT NEW uf_CarGPS_WFRoute(a.id,a.PointsCount,a.CreateTime,a.RouteRange,a.WFRangeID,a.Points,a.LastUpdateTime)FROM uf_CarGPS_WFRoute a WHERE a.WFRangeID = ?";
                    SimpleQuery<uf_CarGPS_WFRoute> RQuery = new SimpleQuery<uf_CarGPS_WFRoute>(hql, GBean.id);
                    uf_CarGPS_WFRoute[] RBeans = RQuery.Execute();

                    #endregion
                    #region 封装数据
                    Range.Add("id", GBean.id);
                    Range.Add("rid", GBean.wfRequestId);
                    Range.Add("uName", UBeans[0].lastname);
                    Range.Add("sqr", GBean.sqr);
                    Range.Add("ccqsrq", GBean.ccqsrq);
                    Range.Add("ccqssj", GBean.ccqssj);
                    Range.Add("ccdd", GBean.ccdd);
                    Range.Add("Range", GBean.Range);
                    Range.Add("RangeCount", GBean.RangeCount);
                    Range.Add("sqgs", GBean.sqgs);
                    Range.Add("sqbm", GBean.sqbm);
                    Range.Add("LastUpdateTime", GBean.LastUpdateTime);
                    Range.Add("WxOpenid", GBean.WxOpenid);
                    if (RBeans.Length > 0)
                    {
                        foreach (uf_CarGPS_WFRoute bean in RBeans)
                        {
                            JObject jo = new JObject();
                            jo.Add("id", bean.id);
                            jo.Add("PointsCount", bean.PointsCount);
                            jo.Add("CreateTime", bean.CreateTime);
                            jo.Add("RouteRange", bean.RouteRange);
                            jo.Add("WFRangeID", bean.WFRangeID);
                            jo.Add("Points", bean.Points);
                            if (bean.LastUpdateTime != null && bean.LastUpdateTime.Length > 12)
                            {
                                DateTime dt = DateTime.ParseExact(bean.LastUpdateTime, "yyyy/MM/dd", System.Globalization.CultureInfo.CurrentCulture);
                                jo.Add("LastUpdateTime", dt.ToString("yyyy/MM/dd HH:mm:ss"));
                            } else if (bean.LastUpdateTime!=null) {
                                jo.Add("LastUpdateTime", bean.LastUpdateTime);
                            }
                            else {
                                jo.Add("LastUpdateTime", "");
                            }
                            
                            points.Add(jo);
                        }
                    }
                    #endregion
                    #region 返回数据

                    //已经放在参数内 不需要返回

                    #endregion
                }

            }
            catch (Exception _e)
            {
                Log.Error("MapSearch2:", _e);
                throw;
            }
            //根据流程id查询 uf_CarGPS_WFRange 和 uf_CarGPS_WFRange的明细 uf_CarGPS_WFRoute、


        } 

    }
}
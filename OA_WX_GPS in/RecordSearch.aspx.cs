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
    /// <summary>
    /// 操作记录查询
    /// </summary>
    public partial class RecordSearch : System.Web.UI.Page
    {
        public log4net.ILog Log = log4net.LogManager.GetLogger(typeof(RecordSearch));
        public string DataList = "[]";
        /// <summary>
        /// 参数:
        /// rid 流程id
        /// 返回值:
        /// NORECORD 没有操作记录
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void Page_Load(object sender, EventArgs e)
        {
            string rid = Context.Request.Params["rid"];

            if (string.IsNullOrEmpty(rid))
            {
                return;
            }

            try
            {
                #region 数据查询

                string hql = "SELECT NEW uf_CarGPS_WFRangeOperateRecord(a.id,a.sqr,a.wfRequestId,a.Rid,a.RNumber,a.OpTime,a.OpType,a.OpDetails,a.Distance,a.Speed,a.Accuracy,a.Points) FROM uf_CarGPS_WFRangeOperateRecord a WHERE a.wfRequestId=?";
                SimpleQuery<uf_CarGPS_WFRangeOperateRecord> SQuery = new SimpleQuery<uf_CarGPS_WFRangeOperateRecord>(hql, rid);
                uf_CarGPS_WFRangeOperateRecord[] Beans = SQuery.Execute();
                JObject msg = new JObject();

                #endregion

                #region 封装数据 和 校验
                if (Beans.Length == 0) {
                    
                    return;
                }else
                {
                    JArray ja = new JArray();
                    foreach (uf_CarGPS_WFRangeOperateRecord bean in Beans)
                    {
                        JObject jo = new JObject();
                        jo.Add("RNumber", bean.RNumber);
                        jo.Add("OpType", bean.OpType);
                        jo.Add("OpDetails", bean.OpDetails);
                        jo.Add("wfRequestId", bean.wfRequestId);
                        jo.Add("sqr", bean.sqr);
                        jo.Add("OpTime", DateTime.Parse(bean.OpTime.ToString()).ToString("yyyy-MM-dd HH:mm:ss"));
                        jo.Add("Speed", bean.Speed);
                        jo.Add("Accuracy", bean.Accuracy);
                        jo.Add("Distance", bean.Distance);
                        jo.Add("Points", bean.Points);
                        ja.Add(jo);
                    }
                    DataList = ja.ToString();
                }

                #endregion
            }
            catch (Exception _e)
            {
                Log.Error("RecordSearch ",_e);
                throw;
            }
        }
    }
}
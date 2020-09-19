using Castle.ActiveRecord;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OA_WX_GPS.Entity
{
    /// <summary>
    /// 整个路程的表 
    /// 记录路程情况
    /// </summary>
    [ActiveRecord("uf_CarGPS_WFRange", DynamicInsert = true, DynamicUpdate = true)]
    public class uf_CarGPS_WFRange : ActiveRecordBase
    {
        #region 构造方法

        public uf_CarGPS_WFRange() { 
            
        }

        public uf_CarGPS_WFRange(int id) {
            this.id = id;
        }

        public uf_CarGPS_WFRange(int id,int wfRequestId,int sqr,string ccqsrq,string ccqssj,string ccjzrq,string ccjzsj,string ccdd,decimal Range,int RangeCount,int sqgs,int sqbm)
        {
            this.id = id;
            this.wfRequestId = wfRequestId;
            this.sqr = sqr;
            this.ccqsrq = ccqsrq;
            this.ccqssj = ccqssj;
            this.ccjzrq = ccjzrq;
            this.ccjzsj = ccjzsj;
            this.ccdd = ccdd;
            this.Range = Range;
            this.RangeCount = RangeCount;
            this.sqgs = sqgs;
            this.sqbm = sqbm;
        }

        #endregion

        #region 属性

        /// <summary>
        ///主键
        /// </summary>
        [PrimaryKey(PrimaryKeyType.Native)]
        public int id { get; set; }

        /// <summary>
        /// 流程id
        /// </summary>
        [Property()]
        public int? requestId { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int formmodeid { get; set; }

        /// <summary>
        ///
        /// </summary>
        [Property()]
        public int modedatacreater { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int modedatacreatertype { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public string modedatacreatedate { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public string modedatacreatetime { get; set; }

        /// <summary>
        /// 流程id
        /// </summary>
        [Property()]
        public int wfRequestId { get; set; }

        /// <summary>
        /// 人员
        /// </summary>
        [Property()]
        public int sqr { get; set; }
        /// <summary>
        /// 申请公司
        /// </summary>
        [Property()]
        public int sqgs { get; set; }
        /// <summary>
        /// 申请部门
        /// </summary>
        [Property()]
        public int sqbm { get; set; }

        /// <summary>
        /// 起始日期
        /// </summary>
        [Property()]
        public string ccqsrq { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public string ccqssj { get; set; }

        /// <summary>
        /// 截至日期
        /// </summary>
        [Property()]
        public string ccjzrq { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public string ccjzsj { get; set; }

        /// <summary>
        /// 目的地
        /// </summary>
        [Property()]
        public string ccdd { get; set; }

        /// <summary>
        /// 距离
        /// </summary>
        [Property()]
        public decimal Range { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        [Property()]
        public string CreateTime { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public string LastUpdateTime { get; set; }

        /// <summary>
        /// 更新次数
        /// </summary>
        [Property()]
        public int UpdateTimes { get; set; }

        /// <summary>
        /// 路线个数
        /// </summary>
        [Property()]
        public int RangeCount { get; set; }

        /// <summary>
        /// 用户openid
        /// </summary>
        [Property()]
        public string WxOpenid { get; set; }

        #endregion
        #region 继承属性

        public static void DeleteAll()
        {
            ActiveRecordBase.DeleteAll(typeof(uf_CarGPS_WFRange));
        }

        public static uf_CarGPS_WFRange[] FindAll()
        {
            return ((uf_CarGPS_WFRange[])(ActiveRecordBase.FindAll(typeof(uf_CarGPS_WFRange))));
        }

        public static uf_CarGPS_WFRange Find(int id)
        {
            return ((uf_CarGPS_WFRange)(ActiveRecordBase.FindByPrimaryKey(typeof(uf_CarGPS_WFRange), id)));
        }

        #endregion
    }
}
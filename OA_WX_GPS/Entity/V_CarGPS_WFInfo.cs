using Castle.ActiveRecord;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OA_WX_GPS.Entity
{
    [ActiveRecord("V_CarGPS_WFInfo", DynamicInsert = true, DynamicUpdate = true)]
    public class V_CarGPS_WFInfo : ActiveRecordBase
    {
        #region 构造函数

        public V_CarGPS_WFInfo()
        {
        }
        public V_CarGPS_WFInfo(int requestId,string lastname,int sqr,string ccqsrq,string ccqssj,string ccjzrq,string ccjzsj,string ccdd)
        {
            this.requestId = requestId;
            this.lastname = lastname;
            this.sqr = sqr;
            this.ccqsrq = ccqsrq;
            this.ccqssj = ccqssj;
            this.ccjzrq = ccjzrq;
            this.ccjzsj = ccjzsj;
            this.ccdd = ccdd;
        }

        public V_CarGPS_WFInfo(int requestId, string lastname, int sqr, string ccqsrq, string ccqssj, string ccjzrq, string ccjzsj, string ccdd, string tablename)
        {
            this.requestId = requestId;
            this.lastname = lastname;
            this.sqr = sqr;
            this.ccqsrq = ccqsrq;
            this.ccqssj = ccqssj;
            this.ccjzrq = ccjzrq;
            this.ccjzsj = ccjzsj;
            this.ccdd = ccdd;
            this.tablename = tablename;
        }

        public V_CarGPS_WFInfo(int requestId, string lastname, int sqr, string ccqsrq, string ccqssj, string ccjzrq, string ccjzsj, string ccdd,int sqgs,int sqbm)
        {
            this.requestId = requestId;
            this.lastname = lastname;
            this.sqr = sqr;
            this.ccqsrq = ccqsrq;
            this.ccqssj = ccqssj;
            this.ccjzrq = ccjzrq;
            this.ccjzsj = ccjzsj;
            this.ccdd = ccdd;
            this.sqgs = sqgs;
            this.sqbm = sqbm;
        }

        #endregion

        #region 属性

        /// <summary>
        /// 流程id
        /// </summary>
        [PrimaryKey(PrimaryKeyType.Native)]
        public int requestId { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public string lastname { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int sqr { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public string ccqsrq { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public string ccqssj { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public string ccjzrq { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public string ccjzsj { get; set; }


        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public string ccdd { get; set; }
        /// <summary>
        /// 公司id
        /// </summary>
        [Property()]
        public int sqgs { get; set; }
        /// <summary>
        /// 部门
        /// </summary>
        [Property()]
        public int sqbm { get; set; }


        /// <summary>
        /// 
        /// </summary>
        public string tablename { get; set; }

        #endregion

        #region 继承方法

        public static void DeleteAll()
        {
            ActiveRecordBase.DeleteAll(typeof(V_CarGPS_WFInfo));
        }

        public static V_CarGPS_WFInfo[] FindAll()
        {
            return ((V_CarGPS_WFInfo[])(ActiveRecordBase.FindAll(typeof(V_CarGPS_WFInfo))));
        }

        public static V_CarGPS_WFInfo Find(int id)
        {
            return ((V_CarGPS_WFInfo)(ActiveRecordBase.FindByPrimaryKey(typeof(V_CarGPS_WFInfo), id)));
        }

        #endregion

    }
}
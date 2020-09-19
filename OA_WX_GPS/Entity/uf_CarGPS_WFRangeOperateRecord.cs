using Castle.ActiveRecord;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OA_WX_GPS.Entity
{
    [ActiveRecord("uf_CarGPS_WFRangeOperateRecord", DynamicInsert = true, DynamicUpdate = true)]
    public class uf_CarGPS_WFRangeOperateRecord : ActiveRecordBase
    {
        #region 构造函数
        public uf_CarGPS_WFRangeOperateRecord() { 
        
        }

        public uf_CarGPS_WFRangeOperateRecord(int id) {
            this.id = id;
        }
        /// <summary>
        /// hql = "SELECT NEW uf_CarGPS_WFRangeOperateRecord(a.id,a.sqr,a.wfRequestId,a.Rid,a.RNumber,a.OpTime,a.OpType,a.OpDetails,a.Distance,a.Speed,a.Accuracy) FROM uf_CarGPS_WFRangeOperateRecord a WHERE a.RID=?";
        /// </summary>
        /// <param name="id"></param>
        /// <param name="sqr"></param>
        /// <param name="wfRequestId"></param>
        /// <param name="Rid"></param>
        /// <param name="RNumber"></param>
        /// <param name="OpTime"></param>
        /// <param name="OpType"></param>
        /// <param name="OpDetails"></param>
        /// <param name="Distance"></param>
        /// <param name="Speed"></param>
        /// <param name="Accuracy"></param>
        public uf_CarGPS_WFRangeOperateRecord(int id,int sqr,int wfRequestId,int Rid,int RNumber,DateTime OpTime,string OpType,string OpDetails,decimal Distance,decimal Speed,decimal Accuracy,string Points) {
            this.id = id;
            this.sqr = sqr;
            this.wfRequestId = wfRequestId;
            this.Rid = Rid;
            this.RNumber = RNumber;
            this.OpTime = OpTime;
            this.OpType = OpType;
            this.OpDetails = OpDetails;
            this.Distance = Distance;
            this.Speed = Speed;
            this.Accuracy = Accuracy;
            this.Points = Points;
        }

        #endregion

        #region 属性

        /// <summary>
        ///主键
        /// </summary>
        [PrimaryKey(PrimaryKeyType.Native)]
        public int id { get; set; }
        /// <summary>
        /// 申请人
        /// </summary>
        [Property()]
        public int sqr { get; set; }

        /// <summary>
        /// 流程id
        /// </summary>
        [Property()]
        public int wfRequestId { get; set; }

        /// <summary>
        /// 线路的id
        /// </summary>
        [Property()]
        public int? Rid { get; set; }

        /// <summary>
        /// 路线号
        /// </summary>
        [Property()]
        public int RNumber { get; set; }

        /// <summary>
        /// 操作时间
        /// </summary>
        [Property()]
        public DateTime? OpTime { get; set; }

        /// <summary>
        /// 操作类型
        /// </summary>
        [Property()]
        public string OpType { get; set; }

        /// <summary>
        /// 操作内容
        /// </summary>
        [Property()]
        public string OpDetails { get; set; }

        /// <summary>
        /// 距离上一个点的距离
        /// </summary>
        [Property()]
        public decimal Distance { get; set; }

        /// <summary>
        /// 位置
        /// </summary>
        [Property()]
        public string Points { get; set; }

        /// <summary>
        /// 速度
        /// </summary>
        [Property()]
        public decimal Speed { get; set; }

        /// <summary>
        /// 精度
        /// </summary>
        [Property()]
        public decimal Accuracy { get; set;}



        #endregion

        #region 重写方法

        public static void DeleteAll()
        {
            ActiveRecordBase.DeleteAll(typeof(uf_CarGPS_WFRangeOperateRecord));
        }

        public static uf_CarGPS_WFRangeOperateRecord[] FindAll()
        {
            return ((uf_CarGPS_WFRangeOperateRecord[])(ActiveRecordBase.FindAll(typeof(uf_CarGPS_WFRangeOperateRecord))));
        }

        public static uf_CarGPS_WFRangeOperateRecord Find(int id)
        {
            return ((uf_CarGPS_WFRangeOperateRecord)(ActiveRecordBase.FindByPrimaryKey(typeof(uf_CarGPS_WFRangeOperateRecord), id)));
        }

        #endregion
    }
}
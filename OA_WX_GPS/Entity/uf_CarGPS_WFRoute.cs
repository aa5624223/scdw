using Castle.ActiveRecord;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OA_WX_GPS.Entity
{
    /// <summary>
    /// 路程的详细表
    /// 一条记录 一个线路
    /// </summary>
    [ActiveRecord("uf_CarGPS_WFRoute", DynamicInsert = true, DynamicUpdate = true)]
    public class uf_CarGPS_WFRoute : ActiveRecordBase
    {
        #region 构造方法

        public uf_CarGPS_WFRoute() { 
        
        }

        public uf_CarGPS_WFRoute(int id) {
            this.id = id;
        }

        public uf_CarGPS_WFRoute(int id,int PointsCount,string CreateTime,decimal RouteRange,int WFRangeID,string Points)
        {
            this.id = id;
            this.PointsCount = PointsCount;
            this.CreateTime = CreateTime;
            this.RouteRange = RouteRange;
            this.WFRangeID = WFRangeID;
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
        /// 
        /// </summary>
        [Property()]
        public int requestId { get; set; }

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
        /// 点总数
        /// </summary>
        [Property()]
        public int PointsCount { get; set; }

        /// <summary>
        /// 创建时间
        /// </summary>
        [Property()]
        public string CreateTime { get; set; }

        /// <summary>
        /// 最新更新时间
        /// </summary>
        [Property()]
        public string LastUpdateTime { get; set; }

        /// <summary>
        /// 此线路的距离
        /// </summary>
        [Property()]
        public decimal RouteRange { get; set; }

        /// <summary>
        /// 路程id
        /// </summary>
        [Property()]
        public int WFRangeID { get; set; }

        /// <summary>
        /// 点位json
        /// </summary>
        [Property()]
        public string Points { get; set; }
        /// <summary>
        /// 用于做某种判断
        /// </summary>
        public bool flg { get; set; }

        #endregion

        #region 继承属性

        public static void DeleteAll()
        {
            ActiveRecordBase.DeleteAll(typeof(uf_CarGPS_WFRoute));

        }

        public static uf_CarGPS_WFRoute[] FindAll()
        {
            return ((uf_CarGPS_WFRoute[])(ActiveRecordBase.FindAll(typeof(uf_CarGPS_WFRoute))));
        }

        public static uf_CarGPS_WFRoute Find(int id)
        {
            return ((uf_CarGPS_WFRoute)(ActiveRecordBase.FindByPrimaryKey(typeof(uf_CarGPS_WFRoute), id)));
        }
        

        #endregion
    }
}
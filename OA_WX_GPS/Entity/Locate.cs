using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OA_WX_GPS.Entity
{
    public class Locate
    {
        /// <summary>
        /// 纬度
        /// </summary>
        public decimal lat;
        /// <summary>
        /// 经度
        /// </summary>
        public decimal lng;
        /// <summary>
        /// 速度
        /// </summary>
        public decimal speed;
        /// <summary>
        /// 距离
        /// </summary>
        public decimal dis;
        /// <summary>
        /// 精度
        /// </summary>
        public decimal accuracy;
        /// <summary>
        /// 时间
        /// </summary>
        public DateTime t1;
        /// <summary>
        /// 时间的日期形式
        /// </summary>
        public string StrT1;
        /// <summary>
        /// 点类型
        /// 0.普通点
        /// 1.开始点
        /// </summary>
        public int isBreak;
    }
}
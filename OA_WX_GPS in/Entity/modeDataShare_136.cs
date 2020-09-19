using Castle.ActiveRecord;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OA_WX_GPS.Entity
{
    [ActiveRecord("modeDataShare_136", DynamicInsert = true, DynamicUpdate = true)]
    public class modeDataShare_136 : ActiveRecordBase
    {
        #region 构造函数

        public modeDataShare_136()
        {

        }
        public modeDataShare_136(int id)
        {
            this.id = id;
        }

        public modeDataShare_136(int id, int sourceid)
        {
            this.id = id;
            this.sourceid = sourceid;
            this.type = 4;
            this.content = 22;
            this.seclevel = 10;
            this.sharelevel = 3;
            this.srcfrom = 4;
            this.opuser = 2;
            this.isDefault = 1;
            this.layoutid = 0;
            this.layoutid1 = 0;
            this.layoutorder = 0;
            this.sharesetid = null;
            this.higherlevel = null;
            //this.setid = 2;
            this.rightid = 2049;
            this.requestid = null;
            this.showlevel2 = 100;
            this.joblevel = 0;
            this.jobleveltext = "";
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
        public int sourceid { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int type { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int content { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int seclevel { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int sharelevel { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int srcfrom { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int opuser { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int isDefault { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int layoutid { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int layoutid1 { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int layoutorder { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int? sharesetid { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int? higherlevel { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int setid { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int rightid { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int? requestid { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int showlevel2 { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int joblevel { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public string jobleveltext { get; set; }

        #endregion

        #region 继承方法 

        public static void DeleteAll()
        {
            ActiveRecordBase.DeleteAll(typeof(modeDataShare_136));
        }

        public static modeDataShare_136[] FindAll()
        {
            return ((modeDataShare_136[])(ActiveRecordBase.FindAll(typeof(modeDataShare_136))));
        }

        public static modeDataShare_136 Find(int id)
        {
            return ((modeDataShare_136)(ActiveRecordBase.FindByPrimaryKey(typeof(modeDataShare_136), id)));
        }

        #endregion
    }
}
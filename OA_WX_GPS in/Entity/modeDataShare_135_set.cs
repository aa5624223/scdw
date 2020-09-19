using Castle.ActiveRecord;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OA_WX_GPS.Entity
{
    [ActiveRecord("modeDataShare_135_set", DynamicInsert = true, DynamicUpdate = true)]
    public class modeDataShare_135_set : ActiveRecordBase
    {
        #region 构造函数

        public modeDataShare_135_set()
        {

        }
        public modeDataShare_135_set(int id)
        {
            this.id = id;
        }

        public modeDataShare_135_set(int id,int sourceid)
        {
            this.id = id;
            this.sourceid = sourceid;
            this.righttype = 3;
            this.sharetype = 4;
            this.relatedid = 2;
            this.rolelevel = 2;
            this.showlevel = 10;
            this.isdefault = 1;
            this.layoutid = 0;
            this.layoutid1 = 0;
            this.layoutorder = 0;
            this.isrolelimited = 0;
            this.rolefieldtype = 0;
            this.rolefield = 0;
            this.higherlevel = 0;
            this.rightid = 2049;
            this.requestid = 0;
            this.showlevel2 = 100;
            this.hrmCompanyVirtualType = 0;
            this.orgrelation = 0;
            this.joblevel = 0;
            this.jobleveltext = "";
            this.SETUUID = "";
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
        public int righttype { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int sharetype { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int relatedid { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int rolelevel { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int showlevel { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int isdefault { get; set; }

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
        public int isrolelimited { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int rolefieldtype { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int rolefield { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int higherlevel { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int rightid { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int requestid { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int showlevel2 { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int hrmCompanyVirtualType { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public int orgrelation { get; set; }

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

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public string SETUUID { get; set; }


        #endregion

        #region 继承方法 

        public static void DeleteAll()
        {
            ActiveRecordBase.DeleteAll(typeof(modeDataShare_135_set));
        }

        public static modeDataShare_135_set[] FindAll()
        {
            return ((modeDataShare_135_set[])(ActiveRecordBase.FindAll(typeof(modeDataShare_135_set))));
        }

        public static modeDataShare_135_set Find(int id)
        {
            return ((modeDataShare_135_set)(ActiveRecordBase.FindByPrimaryKey(typeof(modeDataShare_135_set), id)));
        }

        #endregion
    }
}
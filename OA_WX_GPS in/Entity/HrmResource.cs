using Castle.ActiveRecord;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OA_WX_GPS.Entity
{
    [ActiveRecord("HrmResource", DynamicInsert = true, DynamicUpdate = true)]
    public class HrmResource : ActiveRecordBase
    {
        #region 构造函数

        public HrmResource() { 
            
        }
        public HrmResource(int id) {
            this.id = id;
        }
        /// <summary>
        /// "SELECT NEW HrmResource(a.id,a.loginid,a.lastname)FROM HrmResource a ";
        /// </summary>
        /// <param name="id"></param>
        /// <param name="loginid"></param>
        /// <param name="lastname"></param>
        public HrmResource(int id,string loginid, string lastname) {
            this.id = id;
            this.loginid = loginid;
            this.lastname = lastname;
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
        public string loginid { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public string lastname { get; set; }

        #endregion

        #region 继承方法

        public static void DeleteAll()
        {
            ActiveRecordBase.DeleteAll(typeof(HrmResource));
        }

        public static HrmResource[] FindAll()
        {
            return ((HrmResource[])(ActiveRecordBase.FindAll(typeof(HrmResource))));
        }

        public static HrmResource Find(int id)
        {
            return ((HrmResource)(ActiveRecordBase.FindByPrimaryKey(typeof(HrmResource), id)));
        }

        #endregion
    }
}
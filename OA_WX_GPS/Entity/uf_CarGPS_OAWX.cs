using Castle.ActiveRecord;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OA_WX_GPS.Entity
{
    [ActiveRecord("uf_CarGPS_OAWX", DynamicInsert = true, DynamicUpdate = true)]
    public class uf_CarGPS_OAWX : ActiveRecordBase
    {
        #region 构造函数
        public uf_CarGPS_OAWX() { 
        
        }
        public uf_CarGPS_OAWX(int id) {
            this.id = id;
        }
        /// <summary>
        ///  hql = "SELECT NEW uf_CarGPS_OAWX(a.id,a.requestId,a.WxName,a.WxOpenid,"+UBeans[0].id+")FROM uf_CarGPS_OAWX a WHERE a.requestId=? or a.WxOpenid=?";
        /// </summary>
        /// <param name="id"></param>
        /// <param name="requestId"></param>
        /// <param name="WxName"></param>
        /// <param name="WxOpenid"></param>
        /// <param name="rid"></param>
        public uf_CarGPS_OAWX(int id,string requestId,string WxName, string WxOpenid,int rid)
        {
            this.id = id;
            this.requestId = requestId;
            this.WxName = WxName;
            this.WxOpenid = WxOpenid;
            this.rid = rid;
            this.OAAccount = rid;
        }

        #endregion

        #region 属性

        /// <summary>
        ///主键
        /// </summary>
        [PrimaryKey(PrimaryKeyType.Native)]
        public int id { get; set; }

        /// <summary>
        /// 员工编号
        /// </summary>
        [Property()]
        public string requestId { get; set; }

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
        /// 
        /// </summary>
        [Property()]
        public int OAAccount { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]

        public string WxOpenid { get; set; }

        /// <summary>
        /// 
        /// </summary>
        [Property()]
        public string WxName { get; set; }
        /// <summary>
        /// 员工表的id
        /// </summary>
        public int rid { get; set; }

        #endregion

        #region 继承方法

        public static void DeleteAll()
        {
            ActiveRecordBase.DeleteAll(typeof(uf_CarGPS_OAWX));
        }

        public static uf_CarGPS_OAWX[] FindAll()
        {
            return ((uf_CarGPS_OAWX[])(ActiveRecordBase.FindAll(typeof(uf_CarGPS_OAWX))));
        }

        public static uf_CarGPS_OAWX Find(int id)
        {
            return ((uf_CarGPS_OAWX)(ActiveRecordBase.FindByPrimaryKey(typeof(uf_CarGPS_OAWX), id)));
        }

        #endregion

    }
}
using Castle.ActiveRecord;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OA_WX_GPS.Entity
{
    [ActiveRecord("formtable_main_318", DynamicInsert = true, DynamicUpdate = true)]
    public class formtable_main : ActiveRecordBase
    {
        #region 构造函数

        public formtable_main()
        {

        }

        public formtable_main(int id)
        {
            this.id = id;
        }

        public formtable_main(int id,int requestId,int sqgs,int sqbm,int sqr,int isFinish)
        {
            this.id = id;
            this.requestId = requestId;
            this.sqgs = sqgs;
            this.sqbm = sqbm;
            this.sqr = sqr;
            this.isFinish = isFinish;
        }

        #endregion

        #region 属性

        /// <summary>
        ///主键
        /// </summary>
        /// 
        [PrimaryKey(PrimaryKeyType.Native)]
        public int id { get; set; }

        [Property()]
        public int requestId { get; set; }

        [Property()]
        public int isFinish { get; set; }
        [Property()]
        public int sqgs { get; set; }
        [Property()]
        public int sqbm { get; set; }
        [Property()]
        public int sqr { get; set; }

        #endregion

        #region 继承方法

        public static void DeleteAll()
        {
            ActiveRecordBase.DeleteAll(typeof(formtable_main));
        }

        public static formtable_main[] FindAll()
        {
            return ((formtable_main[])(ActiveRecordBase.FindAll(typeof(formtable_main))));
        }

        public static formtable_main Find(int id)
        {
            return ((formtable_main)(ActiveRecordBase.FindByPrimaryKey(typeof(formtable_main), id)));
        }

        #endregion
    }
}
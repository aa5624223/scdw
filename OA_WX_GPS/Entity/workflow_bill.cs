using Castle.ActiveRecord;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OA_WX_GPS.Entity
{
    [ActiveRecord("workflow_bill", DynamicInsert = true, DynamicUpdate = true)]
    public class workflow_bill : ActiveRecordBase
    {
        public workflow_bill()
        {

        }

        public workflow_bill(int id)
        {
            this.id = id;
        }

        public workflow_bill(string tablename)
        {
            this.tablename = tablename;
        }

        /// <summary>
        ///主键
        /// </summary>
        [PrimaryKey(PrimaryKeyType.Native)]
        public int id { get; set; }

        /// <summary>
        /// 查询流程要用到的表
        /// </summary>
        [Property()]
        public string tablename { get; set; }

        #region 继承属性

        public static void DeleteAll()
        {
            ActiveRecordBase.DeleteAll(typeof(workflow_bill));
        }

        public static workflow_bill[] FindAll()
        {
            return ((workflow_bill[])(ActiveRecordBase.FindAll(typeof(workflow_bill))));
        }

        public static workflow_bill Find(int id)
        {
            return ((workflow_bill)(ActiveRecordBase.FindByPrimaryKey(typeof(workflow_bill), id)));
        }

        #endregion
    }
}
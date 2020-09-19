using Castle.ActiveRecord;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OA_WX_GPS.Entity
{
    [ActiveRecord("workflow_base", DynamicInsert = true, DynamicUpdate = true)]
    public class workflow_base : ActiveRecordBase
    {
        #region 构造函数
        public workflow_base()
        {

        }
        public workflow_base(int id)
        {
            this.id = id;
        }
        #endregion

        #region 属性
        /// <summary>
        ///主键
        /// </summary>
        [PrimaryKey(PrimaryKeyType.Native)]
        public int id { get; set; }

        [Property()]
        public int formid { get; set; }

        #endregion

        #region 继承方法

        public static void DeleteAll()
        {
            ActiveRecordBase.DeleteAll(typeof(workflow_base));
        }

        public static workflow_base[] FindAll()
        {
            return ((workflow_base[])(ActiveRecordBase.FindAll(typeof(workflow_base))));
        }

        public static workflow_base Find(int id)
        {
            return ((workflow_base)(ActiveRecordBase.FindByPrimaryKey(typeof(workflow_base), id)));
        }

        #endregion

    }
}
using Castle.ActiveRecord;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OA_WX_GPS.Entity
{
    [ActiveRecord("Workflow_requestbase", DynamicInsert = true, DynamicUpdate = true)]
    public class Workflow_requestbase : ActiveRecordBase
    {
        #region 构造函数
        public Workflow_requestbase()
        {

        }
        public Workflow_requestbase(int id)
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
        public int workflowid { get; set; }

        [Property()]
        public int requestid { get; set; }

        #endregion

        #region 继承方法

        public static void DeleteAll()
        {
            ActiveRecordBase.DeleteAll(typeof(Workflow_requestbase));
        }

        public static Workflow_requestbase[] FindAll()
        {
            return ((Workflow_requestbase[])(ActiveRecordBase.FindAll(typeof(Workflow_requestbase))));
        }

        public static Workflow_requestbase Find(int id)
        {
            return ((Workflow_requestbase)(ActiveRecordBase.FindByPrimaryKey(typeof(Workflow_requestbase), id)));
        }

        #endregion
    }
}
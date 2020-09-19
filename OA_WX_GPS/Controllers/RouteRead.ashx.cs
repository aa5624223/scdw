using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OA_WX_GPS.Controllers
{
    /// <summary>
    ///  路程的查询 将查询结果返回给客户端
    /// </summary>
    public class RouteRead : IHttpHandler
    {
        public log4net.ILog Log = log4net.LogManager.GetLogger(typeof(RouteRead));
        public void ProcessRequest(HttpContext context)
        {
            
            try
            {
                context.Response.ContentType = "text/plain";
                HttpRequest req = HttpContext.Current.Request;
                JObject msg = new JObject();
                string rid = req.Form["rid"];
                string ccqsrq = req.Form["ccqsrq"];
                string ccqssj = req.Form["ccqssj"];
                string ccjzrq = req.Form["ccjzrq"];
                string ccjzsj = req.Form["ccjzsj"];

            }
            catch (Exception _e)
            {
                Log.Error("RouteRead ERROR", _e);
                throw;
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}
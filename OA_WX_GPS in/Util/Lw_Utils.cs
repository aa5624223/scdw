using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OA_WX_GPS.Util
{
    public static class Lw_Utils
    {
        #region 验证相关

        /// <summary>
        ///  验证微信小程序的appid
        ///  req 里面必须有 post提交的aid
        /// </summary>
        /// <param name="appid"></param>
        /// <param name="req"></param>
        /// <returns></returns>
        public static bool WeChartCertify(string appid,HttpRequest req) {
            //没有权限的
            
            if (string.IsNullOrEmpty(req.Form["aid"]) || appid != req.Form["aid"])
            {
                return false;
            }
            else if(appid.Equals(req.Form["aid"]))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        #endregion
    }
}
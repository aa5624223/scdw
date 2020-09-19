using Newtonsoft.Json.Linq;
using OA_WX_GPS.Entity;
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
        public static bool WeChartCertify(string appid, HttpRequest req)
        {
            //没有权限的

            if (string.IsNullOrEmpty(req.Form["aid"]) || appid != req.Form["aid"])
            {
                return false;
            }
            else if (appid.Equals(req.Form["aid"]))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        #endregion

        #region 地图相关
        private const double EARTH_RADIUS = 6378.137;//地球半径
        /// <summary>
        /// 计算整个路 每个路段的距离
        /// 单位 米
        /// </summary>
        /// <param name="paths"></param>
        /// <returns></returns>
        public static double GetDistance(List<List<Locate>> paths)
        {
            /**
             * double radLat1 = rad(lat1);
             * double radLat2 = rad(lat2);
             * double a = radLat1 - radLat2;
             * double b = rad(lng1) - rad(lng2);
             * double s = 2 * Math.Asin(Math.Sqrt(Math.Pow(Math.Sin(a / 2), 2) +
             * Math.Cos(radLat1) * Math.Cos(radLat2) * Math.Pow(Math.Sin(b / 2), 2)));
             * s = s * EARTH_RADIUS;
             * s = Math.Round(s * 10000) / 10000;
             * double c = 0.0;
             */
            //路径
            double disCount = 0;
            for (var i=0;i<paths.Count;i++) {
                if (paths[i].Count==1) {
                    continue;
                }
                double dis = 0;
                for (var j=0;j<paths[i].Count-1;j++) {
                    double radLat1 = rad((double)paths[i][j].lat);
                    double radLat2 = rad((double)paths[i][j+1].lat);
                    double radlng1 = rad((double)paths[i][j].lng);
                    double radlng2 = rad((double)paths[i][j+1].lng);
                    double a = radLat1 - radLat2;
                    double b = radlng1 - radlng2;
                    double c = 2 * Math.Asin(Math.Sqrt(Math.Pow(Math.Sin(a / 2), 2) +
                    Math.Cos(radLat1) * Math.Cos(radLat2) * Math.Pow(Math.Sin(b / 2), 2)));
                    c = c * EARTH_RADIUS;
                    c = Math.Round(c * 10000) / 10000;
                    dis += c;
                }
                disCount += dis;
                dis = 0;
            }
            return disCount*1000;
        }
        /// <summary>
        /// 获取一段路的距离
        /// 单位 米
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public static double GetDistance(List<Locate> path)
        {
            /**
             * double radLat1 = rad(lat1);
             * double radLat2 = rad(lat2);
             * double a = radLat1 - radLat2;
             * double b = rad(lng1) - rad(lng2);
             * double s = 2 * Math.Asin(Math.Sqrt(Math.Pow(Math.Sin(a / 2), 2) +
             * Math.Cos(radLat1) * Math.Cos(radLat2) * Math.Pow(Math.Sin(b / 2), 2)));
             * s = s * EARTH_RADIUS;
             * s = Math.Round(s * 10000) / 10000;
             * double c = 0.0;
             */
            //路径
            double disCount = 0;
            if (path.Count<=1 ) {
                return 0;
            }
            for (var i = 0; i < path.Count-1; i++)
            {
                double radLat1 = rad((double)path[i].lat);
                double radLat2 = rad((double)path[i+1].lat);
                double radlng1 = rad((double)path[i].lng);
                double radlng2 = rad((double)path[i+1].lng);
                double a = radLat1 - radLat2;
                double b = radlng1 - radlng2;
                double c = 2 * Math.Asin(Math.Sqrt(Math.Pow(Math.Sin(a / 2), 2) +
                Math.Cos(radLat1) * Math.Cos(radLat2) * Math.Pow(Math.Sin(b / 2), 2)));
                c = c * EARTH_RADIUS;
                c = Math.Round(c * 10000) / 10000;
                disCount += c;
            }
            return disCount*1000;
        }
        private static double rad(double d)
        {
            return d * Math.PI / 180.0;
        }

        #endregion
    }
}
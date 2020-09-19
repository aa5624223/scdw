<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Test.aspx.cs" Inherits="OA_WX_GPS.Test" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.15&key=ddcc9d005206d406cc7546a9669c746c"></script>
    <script src="Scripts/jquery-3.4.1.min.js"></script>
    <script>
        var map;
        $(document).ready({
            map = new AMap.Map('container', {
                resizeEnable: true, //是否监控地图容器尺寸变化
                zoom: 16, //初始化地图层级 31.696372,119.952902
                center: [result.body.result[0].lng, result.body.result[0].lat] //定位到常发集团
            });
        });
    </script>
</head>
<body>
    <div id="container">
    </div>
</body>
</html>

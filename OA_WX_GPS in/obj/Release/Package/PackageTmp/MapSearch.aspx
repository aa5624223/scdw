<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="MapSearch.aspx.cs" Inherits="OA_WX_GPS.MapSearch" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link href="Content/bootstrap.min.css" rel="stylesheet" />
    <script charset="utf-8" src="https://map.qq.com/api/js?v=2.exp&key=RWXBZ-5HQ64-2GHUL-DKL6D-F7ZFO-B2B6T"></script>
    <script src="Scripts/jquery-3.4.1.min.js"></script>
    <script src="Scripts/vue.js"></script>
    <script>
        var range = <%=Range.ToString()%>;
        var points = <%=points.ToString()%>;
    </script>
    <script src="Scripts/MapSearch.js"></script>
</head>
<body>
    <!-- 腾讯 -->
    <div id="app">
        <!--
        <div class="col-11 offset-1" style="text-align:left;line-height:50px;font-size:20px;font-weight:600">
            流程编号：{{range.rid}} 申请人：{{range.uName}}，出发时间：{{range.ccqsrq}}&nbsp;{{range.ccqssj}} 
            <br/>中止日期：{{range.ccjzrq}}&emsp;{{range.ccjzsj}}出差地点：{{range.ccdd}}
            <br />总距离：{{range.Range}} 线路个数：{{range.RangeCount}}
        </div>
        -->
        <div style="position:fixed;height:100%;width:100%">
            <div id="container" style="height:100%"></div>
        </div>
    </div>
</body>
</html>

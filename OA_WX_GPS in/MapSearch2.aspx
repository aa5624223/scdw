<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="MapSearch2.aspx.cs" Inherits="OA_WX_GPS.MapSearch2" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <!-- 高德 -->
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <style>
        html,body{
          width: 100%;
          height: 100%;
        }
        #container {
            width:70%;
            height:100%;
            float:left;
        }
        #container_Left {
            width:29%;
            float:left;
            background-color:rgb(198, 203, 209);
            height:100%;
            border-right:2px solid black;
            overflow-y:auto
        }
        .alert {
            color: #155724;
            background-color: none;
            border-color: #c3e6cb;
            border: 1px solid !important;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            color: azure;
            font-size: 18px;
            font-weight: 600;
        }
    </style>
    <link href="Content/bootstrap.min.css" rel="stylesheet" />
    <script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.15&key=ddcc9d005206d406cc7546a9669c746c"></script>
    <script src="Scripts/jquery-3.4.1.min.js"></script>
    <script src="Scripts/vue.js"></script>
    <script>
        var range = <%=Range.ToString()%>;
        var points = <%=points.ToString()%>;
    </script>
    <script src="Scripts/MapSearch2.js"></script>
</head>
<body>
    <div id="container_Left">
        <div v-if="points.length>0" style="font-size:18px;font-weight:600;margin-top:20px;padding-left:40px">
            <p>出差地点：{{range.ccdd}}</p>
            <p>申请人：{{range.uName}}总距离：{{range.Range/1000}}公里</p>
        </div>
        <div v-else style="font-size:150%;margin-left:10%;margin-top:40%">
            没有路径数据,请提示该员工上传路程数据<br />（微信小程序->选择流程->结束行程）
        </div>
        <div class="alert active" v-for="(item,index) in paths" :style="{backgroundColor:MyColor[index]}" @click="PathShow($event,index)" >
            {{item.Title}},距离:{{item.RouteRange/1000}}公里
            <br />开始时间:{{item.t}} 结束时间:{{item.t2}} 
        </div>
    </div>
    <div id="container"></div>
</body>
</html>

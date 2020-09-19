<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RecordSearch.aspx.cs" Inherits="OA_WX_GPS.RecordSearch" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>操作记录查询</title>
    <link href="Content/bootstrap.min.css" rel="stylesheet" />
    <style>
        html, body {
            width: 100%;
            height: 100%;
        }

        #container {
            width: 70%;
            height: 100%;
            float: left;
        }

        #container_Left {
            width: 29%;
            float: left;
            background-color: rgb(198, 203, 209);
            height: 100%;
            border-right: 2px solid black;
            overflow-y: auto
        }

        .info {
            position: relative;
            top: 0;
            right: 0;
            min-width: 0;
            font-size: 140%;
            line-height: 150%;
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
    
    <script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.15&key=ddcc9d005206d406cc7546a9669c746c"></script>
    <script src="Scripts/jquery-3.4.1.min.js"></script>
    <script src="Scripts/vue.js"></script>
    <script>
        var DataList = <%=DataList%>
    </script>
    <script src="Scripts/RecordSearch.js"></script>
</head>
<body>
    <div id="container_Left">
        <div v-if="DataList.length>0" class="alert active" v-for="(item,index) in DataList" :style="{backgroundColor:MyColor[item.ColorIdx],border:index==borderIdx?'4px solid red!important':''}" @click="PointShow($event,index)" >
            <p>操作类型:{{item.OpType}},路线:{{item.RNumber}}</p>
            <p>操作时间:{{item.OpTime}}</p>
            <p>操作描述:{{item.OpDetails}}</p>
            <p>精度:{{item.Accuracy}},速度:{{item.Speed}}</p>
        </div>
    </div>
    <div id="container">
    </div>
</body>
</html>

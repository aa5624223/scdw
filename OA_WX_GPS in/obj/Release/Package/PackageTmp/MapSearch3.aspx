<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="MapSearch3.aspx.cs" Inherits="OA_WX_GPS.MapSearch3" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
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

</head>
<body>
    <form id="form1" runat="server">
        <div>
        </div>
    </form>
</body>
</html>

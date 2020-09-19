<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="T1.aspx.cs" Inherits="OA_WX_GPS.T1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <style>
        html, body {
            width: 100%;
            height: 100%;
        }
        #container {
            width: 100%;
            height: 70%;
        }
        #discontainer{
            margin-top:5%;
            width:100%;
            height:19%;
        }
    </style>
    <script>
        var result = {
            "head": {
                "isSuccess": true,
                "code": "200",
                "message": "成功"
            },
            "body": {
                "imei": "869075033757057",
                "status": null,
                "result": [{
                    "lng": "120.016140",
                    "lat": "31.622783",
                    "tripid": "5107c74d-e5c7-4faa-b87c-5bd4a95d2ba8",
                    "taskTime": "2020-05-15 07:45:27",
                    "taskAddress": null
                }, {
                    "lng": "120.014475",
                    "lat": "31.623005",
                    "tripid": "5107c74d-e5c7-4faa-b87c-5bd4a95d2ba8",
                    "taskTime": "2020-05-15 07:46:04",
                    "taskAddress": null
                }, {
                    "lng": "120.010577",
                    "lat": "31.623113",
                    "tripid": "5107c74d-e5c7-4faa-b87c-5bd4a95d2ba8",
                    "taskTime": "2020-05-15 07:47:16",
                    "taskAddress": null
                }, {
                    "lng": "120.010388",
                    "lat": "31.623260",
                    "tripid": "5107c74d-e5c7-4faa-b87c-5bd4a95d2ba8",
                    "taskTime": "2020-05-15 07:47:42",
                    "taskAddress": null
                }, {
                    "lng": "120.010100",
                    "lat": "31.623257",
                    "tripid": "5107c74d-e5c7-4faa-b87c-5bd4a95d2ba8",
                    "taskTime": "2020-05-15 07:48:12",
                    "taskAddress": null
                }, {
                    "lng": "120.010262",
                    "lat": "31.623102",
                    "tripid": "5107c74d-e5c7-4faa-b87c-5bd4a95d2ba8",
                    "taskTime": "2020-05-15 07:49:16",
                    "taskAddress": null
                }]
            },
            "errorList": null
        };
    </script>
    <script type="text/javascript" src="https://webapi.amap.com/maps?v=1.4.15&key=ddcc9d005206d406cc7546a9669c746c"></script>
    <script src="Scripts/jquery-3.4.1.min.js"></script>
    <script>
        var map;
        $(document).ready(function () {
            map = new AMap.Map('container', {
                resizeEnable: true, //是否监控地图容器尺寸变化
                zoom: 16, //初始化地图层级 31.696372,119.952902
                center: [result.body.result[0].lng, result.body.result[0].lat] //定位到常发集团
            });
            var items = result.body.result;
            var line = [];
            for (var i = 0; i < items.length; i++) {
                line.push([items[i].lng,items[i].lat]);
            }
            var polyline = new AMap.Polyline({
                path: line,
                isOutline: false,
                outlineColor: '#A020F0',
                borderWeight: 4,
                strokeColor: '#000099',
                strokeOpacity: 0.8,
                strokeWeight: 8,
                // 折线样式还支持 'dashed'
                strokeStyle: "solid",
                // strokeStyle是dashed时有效
                strokeDasharray: [10, 5],
                lineJoin: 'round',
                lineCap: 'round',
                showDir: true,
                zIndex: 50,
            });
            polyline.setMap(map);
            var dis = AMap.GeometryUtil.distanceOfLine(line);
            $('#distant').text(dis);
            AMap.convertFrom(line, 'gps', function (status, result) {
                if (result.info === 'ok') {
                    var path2 = result.locations;
                    polyline2 = new AMap.Polyline({
                        path: path2,
                        borderWeight: 2, // 线条宽度，默认为 1
                        strokeColor: 'blue', // 线条颜色
                        lineJoin: 'round' // 折线拐点连接处样式
                    });
                    map.add(polyline2);
                    //text2 = new AMap.Text({
                    //    position: result.locations[0],
                    //    text: '高德坐标',
                    //    offset: new AMap.Pixel(-20, -20)
                    //})
                    //map.add(text2);

                }
            });

        })
    </script>
</head>
<body>
    
    <div id="container">
    </div>
    <div id="discontainer">
        距离是:<a id="distant"></a>
    </div>
</body>
</html>

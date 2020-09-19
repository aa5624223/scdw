var Vue;
var map;
var MyColor = [
    "#000099",
    "#EE0000",
    "#B23AEE",
    "#8B0000",
    "#663333",
    "#000099",
    "#FFA07A",
    "#FF3E96",
    "#FF0000",
    "#DC143C",
    "#CD3700",
    "#B03060",
    "#A0522D",
    "#0A0A0A",
    "#00CDCD",
    "#0000AA",
    "#EE8262",
    "#9932CC"
]
var isGps = false;
$(document).ready(function () {
    points.forEach(function (item) {
        item.Points = JSON.parse(item.Points);
    })
    if (range.WxOpenid == null || range.WxOpenid == true) {
        isGps = true;
    }
    Vue = new Vue({
        el: '#container_Left',
        data: {
            range: range,
            points: points,
            paths: [],
            MyColor: MyColor,
            lines: [],
            Colors:[],
        },
        methods: {
            PathShow: function (e, idx) {
                if ($(e.target).hasClass("active")) {
                    this.lines[idx].hide();
                    //this.paths[idx].line.hide();
                    $(e.target).removeAttr("style");
                    
                    
                } else {
                    this.lines[idx].show();
                    //this.paths[idx].line.show();
                    $(e.target).css("background-color", MyColor[idx]);
                    
                }
                $(e.target).toggleClass("active");
                
                
            }
        }
    });
    if (points.length == 0) {
        map = new AMap.Map('container', {
            resizeEnable: true, //是否监控地图容器尺寸变化
            zoom: 16, //初始化地图层级 31.696372,119.952902
            center: [119.952902,31.696372 ] //定位到常发集团
        });
    } else {
        init(points[0].Points[0].la, points[0].Points[0].lo, points);
    }
    
});
function init(la,lo,pcs) {
    map = new AMap.Map('container', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 13, //初始化地图层级
        center: [lo, la] //初始化地图中心点
    });
    //读取路径
    var paths = [];
    for (var i = 0; i < pcs.length; i++) {
        if (pcs[i].RouteRange == 0) {
            continue;
        }
        var Route = [];
        
        for (var j = 0; j < pcs[i].Points.length; j++) {
            Route.push([pcs[i].Points[j].lo, pcs[i].Points[j].la]);
        }
        paths.push(Route);
        var path;
        var newStr = pcs[i].Points[0].t.slice(0, 10) + ' ' + pcs[i].Points[0].t.slice(10)
        if (i == pcs.length - 1) {
            path = { t: newStr, t2: pcs[i].LastUpdateTime, line: {}, Title: "", RouteRange: pcs[i].RouteRange };
        } else if (pcs[i].Points.length > 1) {
            var newStr2 = "";
            if (pcs[i].Points[pcs[i].Points.length - 1].t != null || pcs[i].Points[pcs[i].Points.length - 1].t != undefined) {
                newStr2 = pcs[i].Points[pcs[i].Points.length - 1].t.slice(0, 10) + ' ' + pcs[i].Points[pcs[i].Points.length - 1].t.slice(10);
            }

            path = { t: newStr, t2: newStr2, line: {}, Title: "", RouteRange: pcs[i].RouteRange };
        } else {
            path = { t: newStr, line: {}, Title: "", RouteRange: pcs[i].RouteRange };
        }
        Vue._data.paths.push(path);
    }
    if (Vue._data.paths.length >= 1) {
        if (Vue._data.paths[Vue._data.paths.length - 1].t2 == "") {
            Vue._data.paths[Vue._data.paths.length - 1].t2 = range.LastUpdateTime;
        }
    }
    var MyPoints = pcs[pcs.length - 1].Points;
    if (MyPoints[MyPoints.length - 1].t != "" && MyPoints[MyPoints.length - 1].t != undefined) {
        
        Vue._data.paths[Vue._data.paths.length - 1].t2 = MyPoints[MyPoints.length - 1].t;
    }
    //Vue._data.paths[Vue._data.paths.length - 1].t2 = pcs[pcs.length-1]
    // 创建纯文本标记
    var textStart;
    AMap.convertFrom(paths[0][0], 'gps', function (status, result) {
        if (result.info === 'ok') {
            var lnglats = result.locations; // Array.<LngLat>
            var pot = [];
            pot.push(lnglats[0].lng);
            pot.push(lnglats[0].lat);
            textStart = new AMap.Text({
                text: '起点',
                anchor: 'center', // 设置文本标记锚点
                draggable: true,
                cursor: 'pointer',
                style: {
                    'margin-bottom': '1rem',
                    'border-radius': '.25rem',
                    'background-color': 'white',
                    'border-width': 0,
                    'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
                    'text-align': 'center',
                    'font-size': '16px',
                    'color': 'blue'
                },
                position: pot
            });
            textStart.setMap(map);
        }
    });
    var textEnd;
    AMap.convertFrom(paths[paths.length - 1][paths[paths.length - 1].length - 1], 'gps', function (status, result) {
        if (result.info === 'ok') {
            var lnglats = result.locations; // Array.<LngLat>
            var pot = [];
            pot.push(lnglats[0].lng);
            pot.push(lnglats[0].lat);
            textEnd = new AMap.Text({
                text: '终点',
                anchor: 'center', // 设置文本标记锚点
                draggable: true,
                cursor: 'pointer',
                style: {
                    'margin-bottom': '1rem',
                    'border-radius': '.25rem',
                    'background-color': 'white',

                    'border-width': 0,
                    'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
                    'text-align': 'center',
                    'font-size': '16px',
                    'color': 'blue'
                },
                position: pot
            });
            textEnd.setMap(map);
        }
    })
    
    var ColorIdx = 0;
    for (var i = 0; i < paths.length; i++) {
        if (ColorIdx >= MyColor.length) {
            ColorIdx = 0;
        }
        //isGps
        var polyline;
        if (isGps==false) {
            polyline = new AMap.Polyline({
                path: paths[i],
                isOutline: false,
                outlineColor: '#A020F0',
                borderWeight: 4,
                strokeColor: MyColor[ColorIdx],
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
            Vue._data.lines.push(polyline);
            //Colors
            Vue._data.Colors.push(ColorIdx);
            //Vue._data.paths[i].line = polyline;
            //var k = i + 1;
            //Vue._data.paths[i].Title = "线路" + k;
            //Vue._data.paths[i].s = false;
            //Vue._data.paths[i].ColorIdx = ColorIdx;
            ColorIdx++;
        } else{
            AMap.convertFrom(paths[i], 'gps', function (status, result) {
                if (result.info === 'ok') {
                    var path2 = result.locations;
                    polyline = new AMap.Polyline({
                        path: path2,
                        isOutline: false,
                        outlineColor: '#A020F0',
                        borderWeight: 4,
                        strokeColor: MyColor[ColorIdx],
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
                    Vue._data.lines.push(polyline);
                    //Colors
                    Vue._data.Colors.push(ColorIdx);

                    //Vue._data.paths[i].Title = "线路" + k;
                    //Vue._data.paths[i].s = false;
                    //Vue._data.paths[i].ColorIdx = ColorIdx;
                    ColorIdx++;
                }
            })
        }
        
        

    }
}
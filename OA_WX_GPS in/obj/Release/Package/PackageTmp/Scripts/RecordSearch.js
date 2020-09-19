var Vue;
var map;
var marker = undefined;
var MyColor = [
    "#3A5FCD",
    "#9400D3",
    "#00EE00",
    "#EE0000",
    "#87CEFF",
    "#2B2B2B",
]
$(document).ready(function () {
    Vue = new Vue({
        el: '#container_Left',
        data: {
            DataList: DataList,
            MyColor: MyColor,
            borderIdx:0,
        },
        methods: {
            PointShow: function (e, idx) {
                var item = this.DataList[idx];
                if (marker != undefined) {
                    map.remove(marker);
                    marker = undefined;
                }
                this.DataList[idx].border = "4px solid red!important";
                if (DataList[idx].Points.lo == 0) {
                    return;
                }
                marker = new AMap.Marker({
                    position: [this.DataList[idx].Points.lo, this.DataList[idx].Points.la],
                    icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
                    offset: new AMap.Pixel(-13, -30)
                });
                marker.setMap(map);
                map.setCenter([this.DataList[idx].Points.lo, this.DataList[idx].Points.la]);
                this.borderIdx = idx;
            }
        },
        created: function () {
            for (var i = 0; i < DataList.length; i++) {
                if (i == 0) {
                    DataList[i].border = "4px solid red!important";
                }
                switch (DataList[i].OpType) {
                    case "开始":
                        DataList[i].ColorIdx = 0;
                        break;
                    case "暂停":
                        DataList[i].ColorIdx = 1;
                        break;
                    case "继续":
                        DataList[i].ColorIdx = 2;
                        break;
                    case "结束":
                        DataList[i].ColorIdx = 3;
                        break;
                    case "关闭":
                        DataList[i].ColorIdx = 4;
                        break;
                    case "异常":
                        DataList[i].ColorIdx = 5;
                        break;
                }
            }
        }
    });
    if (DataList.length == 0) {
        map = new AMap.Map('container', {
            resizeEnable: true, //是否监控地图容器尺寸变化
            zoom: 16, //初始化地图层级 31.696372,119.952902
            center: [119.952902, 31.696372] //定位到常发集团
        });
    } else {
        for (var i = 0; i < DataList.length; i++) {
            DataList[i].Points = JSON.parse(DataList[i].Points);
        }
        init(DataList[0].Points.la, DataList[0].Points.lo, DataList);
    }
});
function init(la, lo, DataList) {
    map = new AMap.Map('container', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 13, //初始化地图层级
        center: [lo, la] //初始化地图中心点
    });
    if (Vue._data.DataList.length == 0 || Vue._data.DataList[0].Points.la == 0) {
        return;
    }
    marker = new AMap.Marker({
        position: [Vue._data.DataList[0].Points.lo, Vue._data.DataList[0].Points.la],
        icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
        offset: new AMap.Pixel(-13, -30)
    });
    marker.setMap(map);
    map.setCenter([Vue._data.DataList[0].Points.lo, Vue._data.DataList[0].Points.la]);
    //var points = [];
    //for (var i = 0; i < DataList.length; i++) {
    //    var marker = new AMap.Marker({
    //        position: [DataList[i].Points.lo, DataList[i].Points.la],
    //        icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
    //        offset: new AMap.Pixel(-13, -30)
    //    });
    //    marker.setMap(map);
    //}
}
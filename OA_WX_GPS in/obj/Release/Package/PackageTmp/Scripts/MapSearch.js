var app;
$(document).ready(function () {
    app = new Vue({
        el: '#app',
        data: {
            range: range,
            points: points,
        },
        mounted() {
            this.points.forEach(function (item) {
                item.Points = JSON.parse(item.Points);
            })
            init(this.points[0].Points[0].la, this.points[0].Points[0].lo, this.points);
        }
    });
});

function init(la, lo,pcs) {
    var map = new qq.maps.Map(document.getElementById("container"), {
        // 地图的中心地理坐标。
        center: new qq.maps.LatLng(la, lo),
        zoom: 13,
        height: '100%',
        width: '100%',
        height:'100%'
    });
    //读取路径
    var paths = [];
    for (var i = 0; i < pcs.length; i++) {
        var Route = [];
        for (var j = 0; j < pcs[i].Points.length; j++) {
            var p = new qq.maps.LatLng(pcs[i].Points[j].la, pcs[i].Points[j].lo);
            Route.push(p);
        }
        paths.push(Route);
    }
    var lines=[];
    for (var i=0; i < paths.length; i++) {
        var polyline = new qq.maps.Polyline({
            path: paths[i],
            strokeColor: '#8A2BE2',
            strokeWeight: 3,
            editable: false,
            map: map
        });
        polyline.setVisible(true);
        polyline.setMap(map);
    }

}
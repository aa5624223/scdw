var util = require('../../utils/util.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const app = getApp();
// pages/mapBegin4/mapBegin4.js
//全局使用
var _this;
var qqmapsdk;
//ajax控制
var btn_Begin_Flg = false;
var btn_Continue_Flg = false;
var btn_Stop_Flg = false;
var btn_End_Flg = false;
var isBack = false;//用来判断当前是前台 还是 后台状态
var i = 0;
var task = 0;
var timestamp1 = new Date().getTime()/1000;
var timestamp2 = timestamp1;
var waiteRequestFlg = false;
function waiteRequest(){
  if (waiteRequestFlg && !(timestamp1 - timestamp2 >10)){
    timestamp1 = new Date().getTime() / 1000;
    return;
  }
  if (timestamp1 - timestamp2 > 10){
    task.abort();
    timestamp2 = new Date().getTime() / 1000;
  }
  if (_this.data.StopFlg == true){
    waiteRequestFlg = true;
    task = wx.request({
      timeout: 5000,
      url: app.data.sa + '/Controllers/WaitRequest.ashx?t=' + timestamp1,
      success:function(){
        // var test = task;
        // if (_this.data.StopFlg == true){
        //   wx.startLocationUpdateBackground({});
        //   _this.setData({
        //     FileTest1: ++j
        //   });
        //   timestamp2 = new Date().getTime() / 1000;
        //   waiteRequestFlg = false;
        //   waiteRequest();
        // }
      },
      error:function(error){
        // if (_this.data.StopFlg == true) {
        //   wx.startLocationUpdateBackground({});
        //   _this.setData({
        //     FileTest1: ++j
        //   });
        //   timestamp2 = new Date().getTime() / 1000;
        //   waiteRequestFlg = false;
        //   waiteRequest();
        // } 
      },
      complete:function(){
        waiteRequestFlg = false;
        if (_this.data.StopFlg == true) {
          wx.startLocationUpdateBackground({});
          _this.setData({
            FileTest1: ++j
          });
          timestamp2 = new Date().getTime() / 1000;
          waiteRequestFlg = false;
          waiteRequest();
        }
      }
    })
  }else{
    return;
  }
}
var i=0;
var j=0;
//线程
const _locationChangeFn = function (res) {
  var la = parseFloat(res.latitude).toFixed(8);
  var lo = parseFloat(res.longitude).toFixed(8);
  var accuracy = parseFloat(res.accuracy).toFixed(2)
  var speed = parseFloat(res.speed).toFixed(2);
  _this.setData({
    FileTest:++i
  });
  if (accuracy < _this.data.MinAccuracy) {
    var time1 = util.formatTime(new Date());
    _this.data.MinPoint = { la: la, lo: lo, s: speed, a: accuracy, t: time1};
    _this.data.MinAccuracy = accuracy;
    _this.data.TimeNow++;
  }
  if (0 < speed < 50) {
    _this.data.TimeNow++;
  }
  //到达临界值时写入
  if (_this.data.TimeNow >= _this.data.MinTime) {
    if (_this.data.MinPoint.length == 0) {
      //var time1 = util.formatTime(new Date());
      //_this.data.MinPoint = { la: la, lo: lo, s: speed, a: accuracy, t: time1};
      return;
    }
    if (isBack) {
      //在后台
      if (_this.data.MinPoint.la != 0 && _this.data.MinPoint.lo != 0){
        _this.data.backTemp.push(_this.data.MinPoint);
        if (_this.data.backTemp.length >= 300) {//后台只有内存较大时才做写入文件操作
          _this.FileAppend(_this.data.RequestId + '.json', _this.data.backTemp);
          _this.data.backTemp = [];
        }
        _this.data.MinPoint = [];
        _this.data.MinAccuracy = 99999;
        _this.data.TimeNow = 0;
      }
    } else {
      //在前台
      if (_this.data.MinPoint.la != 0 && _this.data.MinPoint.lo != 0) {
        _this.data.backTemp.push(_this.data.MinPoint);
        _this.FileAppend(_this.data.RequestId + '.json', _this.data.backTemp);
      }
      _this.data.backTemp = [];
      _this.data.MinPoint = [];
      _this.data.MinAccuracy = 99999;
      _this.data.TimeNow = 0;
    }
  }
  if (_this.data.StopFlg == true ){
    _this.data.Interval = 0;
    waiteRequest();
  }
  
};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    /**
     * 控制界面的变量
     */
    BeginFlg: false,
    ContinueFlg: false,
    StopFlg: false,
    EndFlg: false,
    
    /**
     * 其他页面传过来的变量
     */
    RequestId: 0, //流程号
    PersionId: 0, //用户id
    ccqsrq: '',
    ccqssj: '',
    ccjzrq: '',
    ccjzsj: '',
    /**
     * 测试专用参数
     */
    FileTest:0,
    FileTest1:0,
    task:0,
    /**
     * 点位读取配置
     */
    disMin:80,//超过*米记录
    accuracyMin:800,//低于*精度才会记录
    MinTime:10,//*秒记录一次
    /**
     * 点位监听相关变量
     */
    MinAccuracy:99999,
    //当前读取到第几个
    TimeNow:0,
    //当前精度最小的点存放
    MinPoint:[],
    //在后台时缓存的数据
    backTemp:[],
    //定时器1
    Interval:undefined,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //0.测试数据
    // options.id = 775378;
    // options.pid = 72989;
    // options.ccqsrq = "ccqsrq";
    // options.ccqssj = "ccqssj";
    // options.ccjzrq = "ccjzrq";
    // options.ccjzsj = "ccjzsj";
    // options.ccdd = "ccdd";
    //1.初始化变量
    _this = this;
    qqmapsdk = new QQMapWX({
      key: app.data.mapKey
    });
    
    //2.接收参数
    _this.setData({
      RequestId: options.id,
      PersonId: options.pid,
      ccqsrq: options.ccqsrq,
      ccqssj: options.ccqssj,
      ccjzrq: options.ccjzrq,
      ccjzsj: options.ccjzsj,
      ccdd: options.ccdd
    });
    //3.读取状态
    if (_this.FileIsExist(_this.data.RequestId)) {//继续状态
      _this.setData({
        BeginFlg: false,
        ContinueFlg: true,
        StopFlg: false,
        EndFlg: true
      });
    } else {//开始状态
      _this.setData({
        BeginFlg: true,
        ContinueFlg: false,
        StopFlg: false,
        EndFlg: false
      });
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   * 前台状态 切换
   */
  onShow: function() {
    console.log("前台显示了!");
    isBack = false;
    
    if (_this.data.backTemp.length > 0) {
      _this.FileAppend(_this.data.RequestId + '.json', _this.data.backTemp);
      _this.data.backTemp = [];
    }
    wx.hideLoading({});

  },

  /**
   * 生命周期函数--监听页面隐藏
   * 后台状态 切换
   */
  onHide: function() {
    console.log("隐藏了!");
    isBack = true;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    if (_this.data.backTemp.length>0){
      _this.FileAppend(_this.data.RequestId + '.json', _this.data.backTemp);
      _this.data.backTemp = [];
    }
    var time1 = util.formatTime(new Date());
    var json = [{ type: '关闭', t: time1, detial: '小程序被关闭' }];
    _this.FileAppend(_this.data.RequestId + '_log.json', json);
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  btn_Begin: function() {
    if (btn_Begin_Flg) {
      return;
    }
    btn_Begin_Flg = true;
    _this.FileIsExistAndCreate(_this.data.RequestId);
    wx.showLoading({
      title:'勿切换小程序。',
      mask:true
    });
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      highAccuracyExpireTime: 5000,
      success: function(res) {
        var la = parseFloat(res.latitude).toFixed(8);
        var lo = parseFloat(res.longitude).toFixed(8);
        var speed = res.speed;
        var accuracy = res.accuracy;
        var time1 = util.formatTime(new Date());
        var json = [{la:la,lo:lo,s:speed,a:accuracy,t:time1,d:1}];
        var Log1 = [{ type: '开始', t: time1, detial: '点击了开始' }];
        //写入点位信息
        _this.FileAppend(_this.data.RequestId+'.json', json);
        _this.FileAppend(_this.data.RequestId + '_log.json', Log1);
        //开启后台监听
        _this.LocateListen();
        
      },
      fail:function(res){
        wx.showModal({
          title: '提示',
          content: "未开启定位功能,或网络",
        });
        //日志写入
        var time1 = util.formatTime(new Date());
        var json = [{type: '异常', t: time1, detial:'开始时,未开启GPS,或网络'}];
        _this.FileAppend(_this.data.RequestId + '_log.json', json);
      },
      complete:function(){
        btn_Begin_Flg = false;
        wx.hideLoading({});
      }
    })
  },
  btn_Continue: function() {
    if (btn_Continue_Flg) {
      return;
    }
    btn_Continue_Flg = true;
    wx.showLoading({
      title: '勿切换小程序。',
      mask: true
    });
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      highAccuracyExpireTime: 5000,
      success: function (res) {
        var la = parseFloat(res.latitude).toFixed(8);
        var lo = parseFloat(res.longitude).toFixed(8);
        var speed = res.speed;
        var accuracy = res.accuracy;
        var time1 = util.formatTime(new Date());
        var json = [{ la: la, lo: lo, s: speed, a: accuracy, t: time1, d: 1 }];
        var Log1 = [{ type: '继续', t: time1, detial: '点击了继续' }];
        //写入点位信息
        _this.FileAppend(_this.data.RequestId + '.json', json);
        _this.FileAppend(_this.data.RequestId + '_log.json', Log1);
        //开启后台监听
        _this.LocateListen();
      },
      fail:function(error){
        wx.showModal({
          title: '提示',
          content: "未开启定位功能,或网络",
        });
        //日志写入
        var time1 = util.formatTime(new Date());
        var json = [{ type: '异常', t: time1, detial: '继续时，未开启GPS或网络' }];
        _this.FileAppend(_this.data.RequestId + '_log.json', json);
      },
      complete:function(){
        btn_Continue_Flg = false;
        wx.hideLoading({});
      }
    })
  },
  btn_Stop: function() {
    if (btn_Stop_Flg) {
      return;
    }
    btn_Stop_Flg = true;
    wx.offLocationChange(_locationChangeFn);//停止位置监听
    wx.showLoading({
      title: '勿切换小程序。',
      mask: true
    });
    //插入尾部位置
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      highAccuracyExpireTime: 5000,
      success: function (res) {
        var la = parseFloat(res.latitude).toFixed(8);
        var lo = parseFloat(res.longitude).toFixed(8);
        var speed = res.speed;
        var accuracy = res.accuracy;
        var time1 = util.formatTime(new Date());
        var json = [{ la: la, lo: lo, s: speed, a: accuracy, t: time1,d:2}];
        var Log1 = [{ type: '暂停', t: time1, detial: '点击了暂停' }];
        _this.FileAppend(_this.data.RequestId + '.json', json);
        _this.FileAppend(_this.data.RequestId + '_log.json', Log1);
        //设置按钮状态

        _this.setData({
          BeginFlg: false,
          ContinueFlg: true,
          StopFlg: false,
          EndFlg: true
        });
        _this.data.Interval = undefined;
        wx.stopLocationUpdate({
          success: function (res) {
            console.log("停时位置记录");
            clearInterval(_this.data.Interval);
            _this.setData({
              Interval:undefined
            })
          },
          fail: function (res) {
            
          }
        });

      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: "未开启定位功能,或网络",
        });
        //日志写入
        var time1 = util.formatTime(new Date());
        var json = [{ type: '异常', t: time1, detial: '暂停时，未开启GPS或网络' }];
        _this.FileAppend(_this.data.RequestId + '_log.json', json);
      },
      complete: function () {
        btn_Stop_Flg = false;
        wx.hideLoading({});
      }
    });
  },
  btn_End: function() {
    if (btn_End_Flg) {
      return;
    }
    var FileSystemManager = wx.getFileSystemManager();
    btn_End_Flg = true;
    
    //将文件发送给服务端
    wx.showModal({
      title: '提示',
      content: '点击确定后，该流程将结束',
      success:function(res){
        if(res.confirm){
          var time1 = util.formatTime(new Date());
          var json = [{ type: '结束', t: time1, detial: '点击了结束' }];
          _this.FileAppend(_this.data.RequestId + '_log.json', json);
          wx.showLoading({
            title: '勿切换小程序。',
            mask: true
          });
          wx.uploadFile({
            url: app.data.sa + '/Controllers/RouteEnd2.ashx',
            //url: 'https://localhost:44325/Controllers/RouteEnd2.ashx',
            filePath: `${wx.env.USER_DATA_PATH}/` + _this.data.RequestId+'.json',
            name: 'file',
            formData: {
              'aid': app.data.appid,
              'rid': _this.data.RequestId,
              'pid': _this.data.PersonId,
              'oid': app.data.openid,
              'ccqsrq': _this.data.ccqsrq,
              'ccqssj': _this.data.ccqssj,
              'ccjzrq': _this.data.ccjzrq,
              'ccjzsj': _this.data.ccjzsj,
              'ccdd': _this.data.ccdd,
            },
            success:function(res){
              if (JSON.parse(res.data).msg == 'OK') {
                // FileSystemManager.removeSavedFile({
                //   filePath: `${wx.env.USER_DATA_PATH}/` + _this.data.RequestId + '.json'
                // });
                wx.offLocationChange(_locationChangeFn);
                var json = [{ type: '结束', t: time1, detial: '结束,并上传了路线'}];
                _this.FileAppend(_this.data.RequestId + '_log.json', json);
                wx.showModal({
                  title: '提示',
                  content: '移动轨迹已上传成功,请关闭小程序',
                  success(res) {
                    wx.redirectTo({
                      url: '../Msg/Msg?msg=移动轨迹已上传成功,请关闭小程序'
                    })
                  }
                })
              }else if(JSON.parse(res.data).msg == 'RIDERROR' ){//行程已结束，请勿重复提交
                wx.offLocationChange(_locationChangeFn);
                var json = [{ type: '结束', t: time1, detial: '行程已结束，重复提交。'}];
                _this.FileAppend(_this.data.RequestId + '_log.json', json);
                wx.showModal({
                  title: '提示',
                  content: '行程已结束，请勿重复提交',
                  success(res) {
                    wx.redirectTo({
                      url: '../Msg/Msg?msg=行程已结束，请勿重复提交'
                    })
                  }
                })
                return;
              }
            },
            fail:function(error){
              wx.showModal({
                title: '提示',
                content: "服务器未响应",
              });
              var json = [{ type: '异常', t: time1, detial: '发送路径给服务器失败' }];
              _this.FileAppend(_this.data.RequestId + '_log.json', json);
            },
            complete:function(res){
              wx.hideLoading({});
            }
          })
        }
      },
      complete:function(){
        btn_End_Flg=false;
      }
    })
  },
  //读取文件内容
  btn_Read:function(){
    var FileSystemManager = wx.getFileSystemManager();
    var text = FileSystemManager.readFileSync(`${wx.env.USER_DATA_PATH}/` + _this.data.RequestId+".json", 'utf-8');
    _this.setData({
      FileTest:text
    });
  },
  /**
   * 监听位置
   */
  LocateListen: function() {
    //startLocationUpdate
    //wx.startLocationUpdate({
    wx.startLocationUpdateBackground({
      success:function(res){
        wx.onLocationChange(_locationChangeFn);
        //设置按钮状态
        _this.setData({
          BeginFlg: false,
          ContinueFlg: false,
          StopFlg: true,
          EndFlg: true
        });
      },
      fail:function(res){
        wx.showModal({
          title: '提示',
          content: "请先在设置中开启 位置信息->使用小程序和离开小程序 ",
        });
        var time1 = util.formatTime(new Date());
        var json = [{ type: '异常', t: time1, detial: '未开启后台定位功能'+res }];
        _this.FileAppend(_this.data.RequestId + '_log.json', json);
      }
    })
  },
  LocateListen1:function(){
    wx.startLocationUpdateBackground({
      success: function (res) {
        wx.onLocationChange(_locationChangeFn);
      },
      fail: function (res) {
        
      }
    })
  },
  /**
   * 点位插入
   */
  PointPush: function() {

  },
  /**
   * 清理缓存,将数据存入文件
   * 1.日志缓存
   * 2.点位缓存
   */
  CacheSave: function() {
    var FileSystemManager = wx.getFileSystemManager();
  },
  //判断文件是否存在
  FileIsExist: function (RequestId){
    var FileSystemManager = wx.getFileSystemManager();
    try{
      FileSystemManager.accessSync(`${wx.env.USER_DATA_PATH}/` + RequestId + ".json");
      return true;
    } catch (error){
      return false;
    }
  },
  /**
   * 判断文件是否存在 不存在就创建
   */
  FileIsExistAndCreate: function(RequestId) {
    var FileSystemManager = wx.getFileSystemManager();
    try {
      FileSystemManager.accessSync(`${wx.env.USER_DATA_PATH}/` + RequestId + ".json");
      FileSystemManager.accessSync(`${wx.env.USER_DATA_PATH}/` + RequestId + "_log.json");
    } catch (error) {
      //_this.data.RequestId
      //_this.data.PersonId
      //time1,
      var time1 = util.formatTime(new Date());
      var json = {id: _this.data.RequestId, pid: _this.data.PersonId,d1:time1};
      //文件不存在 创建这个文件
      FileSystemManager.writeFileSync(`${wx.env.USER_DATA_PATH}/` + RequestId + ".json", JSON.stringify(json).trim() , 'utf-8');
      FileSystemManager.writeFileSync(`${wx.env.USER_DATA_PATH}/` + RequestId + "_log.json", JSON.stringify(json).trim() , 'utf-8');
    }
  },
  /**
   * 向文件尾部追加内容
   *  纬度，经度，速度，精度
   * 头部/尾部点
   * {la:x,lo:x,s:x,a:x,t:x}
   * 中间点：
   * {la:x,lo:x,s:x,a:x}
   */
  FileAppend: function (FileName,json){
    var FileSystemManager = wx.getFileSystemManager();
    var text = JSON.stringify(json).trim();
    var newText = ',' + text.substring(1, text.length-1);
    FileSystemManager.appendFileSync(`${wx.env.USER_DATA_PATH}/` + FileName, newText, 'utf-8');
  }
})
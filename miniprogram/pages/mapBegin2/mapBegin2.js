var util = require('../../utils/util.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const app = getApp();
// pages/mapBegin2/mapBegin2.js

var locateTime = 0;
var FileSystemManager;
var _this;
var _locationChangeFn;
var qqmapsdk;
var btn_Begin_Flg = false;;
var btn_Stop_Flg = false;
var btn_Continue_Flg = false;
var btn_End_Flg = false;
var absFlg = false;
Page({
  /**
   * 页面的初始数据
   * 1.文件存储逻辑
   * 流程Id_idx.json
   * 
   * 
   */
  data: {
    //本地需要的变量
    MinPoint: { la: 0, lo: 0 },//存储当前最小的
    MinAccuracy: 99999,
    MinTime: 15,//10次一个记录
    TimeTemp: 0,
    points: {},//存放应该写入文件的数据
    FileName: null,//当前要写入数据的文件名
    FileNameIdex: 0,
    FilePointLimit: 300,//一个文件最多允许存400个点
    disMin: 70,//两点距离超过*才会被记录
    accuracyMin: 800,//精度*以下才会记录
    //需要传给服务器的变量
    RequestId: -1,
    PersonId: -1,
    ccqsrq: '',
    ccqssj: '',
    ccjzrq: '',
    ccjzsj: '',
    ccdd: '',
    //显示按钮的flg
    btn_BeginFlg: false,
    btn_ContinueFlg: false,
    btn_StopFlg: false,
    btn_EndFlg: true,
    //控制台输出
    PontLog: [{ msg: 111 }],
  },
  /**
   * 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocationBackground'] || res.authSetting['scope.userLocationBackground'] == undefined) {
          wx.authorize({
            scope: 'scope.userLocationBackground',
            success() {
              wx.startLocationUpdateBackground({
                success: function (res) {
                  console.log("授权位置监听");
                },
                fail: function (res) {
                  console.log("授权失败");
                }
              })
            }, fail(error) {
              wx.showModal({
                title: '提示',
                content: "请先在设置中开启 位置信息->使用小程序和离开小程序 ",
              });
            }
          })
        }
      },
      fail(error) {
        console.log(error);
      }
    })
    /**
     * 测试时输入的数据
     * 
     */
    // options.Id = 53;
    // options.pid = 1;
    // options.ccqsrq = "ccqsrq";
    // options.ccqssj = "ccqssj";
    // options.ccjzrq = "ccjzrq";
    // options.ccjzsj = "ccjzsj";
    // options.ccdd = "ccdd";
    /**
         * 初始化必要数据
         */
    _this = this;
    _this.setData({
      RequestId: options.id,
      PersonId: options.pid,
      ccqsrq: options.ccqsrq,
      ccqssj: options.ccqssj,
      ccjzrq: options.ccjzrq,
      ccjzsj: options.ccjzsj,
      ccdd: options.ccdd
    });

    FileSystemManager = wx.getFileSystemManager();
    qqmapsdk = new QQMapWX({
      key: app.data.mapKey
    });
    /**
     * 计算出需要的数据
     */
    //1.读取是否存在文件，
    // 文件不存在 页面显示 开始行程
    // 如果存在返回文件名 true 返回文件名 页面显示 继续行程

    // 命名规则 流程Id_idx.json 直
    // 直接将文件名写入 this.data.FileName里面
    var FileName = _this.GetFileName(_this.data.RequestId);
    if (FileName == false) {
      _this.setData({
        btn_BeginFlg: true
      });
    } else {
      _this.setData({
        btn_ContinueFlg: true,
        btn_EndFlg: true,
        FileName: FileName
      })
      //读取出文件
      _this.points = _this.ReadFilePoints(_this.data.RequestId);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   * wx.startLocationUpdateBackground({
      success(res) {
        console.log('开启后台定位', res)
      },
      fail(res) {
        console.log('开启后台定位失败', res)
      }
    });
   * 
   * 
   */
  onReady: function () {


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.btn_Stop(true);
    _this.SendLog("关闭", 0, 0, 0, { la: _this.data.points.points[_this.data.points.points.length - 1].la, lo: _this.data.points.points[_this.data.points.points.length - 1].lo },"关闭了页面");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //点击开始行程时 触发的事件
  btn_Begin: function () {
    //看用户是否有设置相关权限 提示用户开启
    if (_this.GetAuthor() == false) {
      return;
    }
    /**
     * 1.用高精度获取当前位置
     * 2.创建文件,写入初始化 当前位置的信息
     * 3.开始 changelocation
     */
    if (btn_Begin_Flg) {
      return;
    }
    btn_Begin_Flg = true;
    wx.getLocation({
      type: 'gcj02',
      //isHighAccuracy: true,
      //highAccuracyExpireTime: 4000,
      success: function (res) {
        var la = parseFloat(res.latitude).toFixed(10);
        var lo = parseFloat(res.longitude).toFixed(10);
        var speed = res.speed;
        var accuracy = res.accuracy;
        var time1 = util.formatTime(new Date());
        _this.SendLog("开始",speed,accuracy,0,{la:la,lo:lo},"点击了开始");
        if (la == 0 && lo == 0) {
          _this.data.points = {
            id: _this.data.RequestId,
            pid: _this.data.PersonId,
            d1: time1,
            d2: time1,
            dis: 0,
            pc: 1,
            idx: 0,
            points: []
          }
        } else {
          _this.data.points = {
            id: _this.data.RequestId,
            pid: _this.data.PersonId,
            d1: time1,
            d2: time1,
            dis: 0,
            pc: 1,
            idx: 0,
            points: [
              {
                la: la,
                lo: lo,
                t: time1,
                d: 0
              }
            ]
          }
        }

        _this.data.FileName = _this.data.RequestId + "_0.json";
        _this.WritePointFile(_this.data.FileName, _this.data.points);
        //_this.LogInsert("行程开始 插入点:" + la + "," + lo + "，时间:" + time1);
        _this.setData({
          btn_StopFlg: true,
          btn_EndFlg: true,
          btn_BeginFlg: false
        })
        //开启记录路程的控制
        _this.LocateListenBegin();
      },
      complete: function () {
        btn_Begin_Flg = false;
      }, fail(error) {
        wx.showModal({
          title: '提示',
          content: "请先在设置中开启 位置信息->使用小程序和离开小程序 ",
        });
        _this.SendLog("异常", 0, 0, 0, { la: 0, lo: 0 }, "开始按钮获取定位失败");
        return;
      }
    })
  },
  LocateListenBegin: function () {
    //_locationChangeFn
    _locationChangeFn = function (res) {
      if (_this.data.MinAccuracy > res.accuracy && la != 0 && lo != 0) {
        var la = parseFloat(res.latitude).toFixed(8);
        var lo = parseFloat(res.longitude).toFixed(8);
        var ac = res.accuracy;
        var speed = res.speed;
        if (la <= 18 || la >= 54 || lo <= 74 || lo >= 135 || speed == 0) {
          return;
        }
        // if (speed == 0 && _this.data.TimeTemp >= _this.data.MinTime){
        //   _this.data.TimeTemp--;
        // }
        _this.data.MinPoint = { la: la, lo: lo };
        _this.data.MinAccuracy = res.accuracy;
      }
      //_this.data.TimeTemp
      if (_this.data.TimeTemp >= _this.data.MinTime) {
        //插入点的方法 1.计算两点间的距离
        var la0;
        var lo0;
        if (_this.data.points.points.length == 0) {
          la0 = la;
          lo0 = lo;
        } else {
          la0 = _this.data.points.points[_this.data.points.points.length - 1].la;
          lo0 = _this.data.points.points[_this.data.points.points.length - 1].lo;
        }
        qqmapsdk.calculateDistance({
          mode: 'straight',
          from: {
            latitude: _this.data.MinPoint.la,
            longitude: _this.data.MinPoint.lo,
          },
          to: [{
            latitude: la0,
            longitude: lo0
          }],
          success: function (res1) {
            var time = util.formatTime(new Date());
            var dis = res1.result.elements[0].distance;
            //精度 和 距离的限制
            if (dis >= _this.data.disMin && _this.data.MinAccuracy < _this.data.accuracyMin && (dis < 650 || absFlg == true)) {
              // PointPush:function(la,lo,dis,time,AddType){
              _this.PointPush(_this.data.MinPoint.la, _this.data.MinPoint.lo, dis, time, 0);
              //_this.LogInsert("插入点:" + _this.data.MinPoint.la + "," + _this.data.MinPoint.lo+" 距离:"+dis+" 时间:"+time);
              _this.data.TimeTemp = 0;
              console.log(_this.data.points, "_this.data.TimeTemp:" + _this.data.TimeTemp);
              _this.data.MinPoint = { la: 0, lo: 0 }
              _this.data.MinAccuracy = 99999;
              _this.data.TimeTemp = 0;
              absFlg = false;
            } else {
              if (dis <= _this.data.disMin) {
                //_this.LogInsert("距离不足,距离为:" + dis + "次数：" + _this.data.TimeTemp );
                
              } else {
                //_this.LogInsert("精度不足,精度为:" + _this.data.MinAccuracy);
                _this.SendLog("异常", speed, accuracy, 0, { la: _this.data.MinPoint.la, lo: _this.data.MinPoint.lo }, "精度不足");
              }
              if (dis >= 600) {
                absFlg = true;
              }
              _this.data.TimeTemp = 5;
              //修改这里
              _this.data.MinAccuracy = 700;
              _this.data.MinPoint = { la: _this.data.MinPoint.la, lo: _this.data.MinPoint.lo };
            }
          },
          fail: function (error) {
            _this.data.TimeTemp = 5;
            //修改这里 9999 la 0 lo 0
            _this.data.MinAccuracy = 700;
            _this.data.MinPoint = { la: _this.data.MinPoint.la, lo: _this.data.MinPoint.lo };
            _this.SendLog("异常", 0, 0, 0, { la: 0, lo: 0 }, "网络断开");
          }
        })
      }
      if (speed <= 20) {
        _this.data.TimeTemp += 2.5;
      } else {
        _this.data.TimeTemp++;
      }
    }
    wx.startLocationUpdateBackground({
      success: function (res) {
        wx.onLocationChange(_locationChangeFn);
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: "请先在设置中开启 位置信息->使用小程序和离开小程序 ",
        });
        _this.SendLog("异常", 0, 0, 0, { la: 0, lo: 0 }, "后台获取路径设置未开,或者网络断开");
      }
    })
  },
  btn_Stop: function (end_Flg) {

    if (_this.GetAuthor() == false) {
      return;
    }

    if (btn_Stop_Flg) {
      return;
    }
    btn_Stop_Flg = true;
    wx.offLocationChange(_locationChangeFn);//暂停路程的监听
    //获取当前位置写入
    wx.getLocation({
      type: 'gcj02',
      //isHighAccuracy: true,
      //highAccuracyExpireTime: 4000,
      success: function (res) {
        var la = parseFloat(res.latitude).toFixed(8);
        var lo = parseFloat(res.longitude).toFixed(8);
        var la0 = _this.data.points.points[_this.data.points.points.length - 1].la;
        var lo0 = _this.data.points.points[_this.data.points.points.length - 1].lo;
        var speed = res.speed;
        var accuracy = res.accuracy;
        
        //将暂停的位置存入
        qqmapsdk.calculateDistance({
          mode: 'straight',
          from: {
            latitude: la,
            longitude: lo,
          },
          to: [{
            latitude: la0,
            longitude: lo0
          }],
          success: function (res1) {
            var time = util.formatTime(new Date());
            var dis = res1.result.elements[0].distance;
            
            if (la != 0 || lo != 0) {
              _this.PointPush(la, lo, dis, time, 1);
            }
            if (end_Flg!=true){
              _this.SendLog("暂停", speed, accuracy, dis, { la: la, lo: lo }, "点击了暂停");
            }
            //_this.LogInsert("行程暂停 插入点:" + la + "," + lo + " 距离:" + dis + " 时间:" + time);
            _this.setData({
              btn_StopFlg: false,
              btn_ContinueFlg: true,
              btn_EndFlg: true
            });
          }
        })
      },
      fail(error) {
        wx.showModal({
          title: '提示',
          content: "请先在设置中开启 位置信息->使用小程序和离开小程序 ",
        });
        _this.SendLog("异常", 0, 0, 0, { la: 0, lo: 0 }, "暂停获取路径失败");
      },
      complete: function () {
        btn_Stop_Flg = false;
      }
    })
  },
  btn_Continue: function () {

    if(_this.GetAuthor()==false){
      return;
    }

    if (JSON.stringify(_this.data.points) == "{}") {
      //从文件内读取
      _this.data.points = JSON.parse(_this.ReadFilePoints(_this.data.RequestId));
    }
    if (btn_Continue_Flg) {
      return;
    }
    btn_Continue_Flg = true;
    //得到当前的点
    wx.getLocation({
      type: 'gcj02',
      //isHighAccuracy: true,
      //highAccuracyExpireTime: 4000,
      success: function (res) {
        var la = parseFloat(res.latitude).toFixed(8);
        var lo = parseFloat(res.longitude).toFixed(8);
        var speed = res.speed;
        var accuracy = res.accuracy;
        var time1 = util.formatTime(new Date());
        _this.SendLog("继续", speed, accuracy, 0, { la: la, lo: lo },"点击了继续");
        var point = { la: la, lo: lo, d: 0, t: time1 }
        if (la != 0 || lo != 0) {
          _this.data.points.points.push(point);
          _this.WritePointFile(_this.data.FileName, _this.data.points);
        }
        //_this.LogInsert("行程继续 插入点:" + la + "," + lo + "，时间:" + time1);
        _this.setData({
          btn_ContinueFlg: false,
          btn_StopFlg: true,
          btn_EndFlg: true,
          btn_BeginFlg: false
        })
        //开启记录路程的控制
        _this.LocateListenBegin();
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: "请先在设置中开启 位置信息->使用小程序和离开小程序 ",
        });
        wx.openSetting({
          success(res){
            console.log(res.authSetting);
          }
        });
        _this.SendLog("异常", 0, 0, 0, { la: 0, lo: 0 }, "继续获取路径失败");
      },
      complete: function () {
        btn_Continue_Flg = false;
      }
    })
  },
  btn_End: function () {
    
    btn_End_Flg = true;
    wx.showModal({
      title: '提示',
      content: '点击确定后，该流程将结束',
      success: function (res) {
        if (res.confirm) {
          FileSystemManager.readdir({
            dirPath: `${wx.env.USER_DATA_PATH}/`,
            success: function (res) {
              //_this.btn_Stop();
              var CompondText = "";
              var files = res.files;
              var FindFile = _this.data.RequestId + '_';
              var SendJson;
              var FileList = [];
              for (var i = 0; i < files.length; i++) {
                var FileTemp = files[i];
                var idx = FileTemp.indexOf(FindFile);
                if (idx >= 0) {
                  FileList.push(FileTemp);
                  var txt = FileSystemManager.readFileSync(`${wx.env.USER_DATA_PATH}/` + FileTemp, 'utf-8');
                  if (SendJson == undefined) {
                    SendJson = JSON.parse(txt);
                  } else {
                    var JsonTxt = JSON.parse(txt);
                    SendJson.dis += JsonTxt.dis;
                    SendJson.pc += JsonTxt.pc;
                    SendJson.d2 = JsonTxt.d2;
                    SendJson.points = SendJson.points.concat(JsonTxt.points);
                  }
                }
              }
              _this.SendLog("结束", 0, 0, 0, { la: _this.data.points.points[_this.data.points.points.length - 1].la, lo: _this.data.points.points[_this.data.points.points.length - 1].lo},"点击了结束");
              FileSystemManager.writeFileSync(`${wx.env.USER_DATA_PATH}/` + _this.data.RequestId + 'final.json', JSON.stringify(SendJson), 'utf-8');
              _this.Sent_Route(_this.data.RequestId + 'final.json', FileList);
            },
            fail:function(error){
              _this.SendLog("异常", 0, 0, 0, { la: 0, lo: 0 }, "读取文件失败");
            }
          })
        } else {
          btn_End_Flg = false;
        }
      }
    })
  },
  //开始行程,继续行程 不用这个方法
  PointPush: function (la, lo, dis, time, AddType) {
    la = parseFloat(la).toFixed(8);
    lo = parseFloat(lo).toFixed(8);
    _this.data.points.d2 = time;
    _this.data.points.dis += dis;
    var newJson = {};
    var newPoint = {};
    //超过文件大小 创建新的文件写入
    if (_this.data.points.pc >= _this.data.FilePointLimit) {
      newJson = {
        id: _this.data.RequestId,
        pid: _this.data.PersonId,
        d1: _this.data.json.d1,
        d2: time,
        dis: _this.data.points.dis + dis,
        pc: 1,
        idx: _this.data.FileNameIdex++,
        points: []
      }
      if (AddType == 1) {
        newJson.points.push({ la: la, lo: lo, d: dis, t: time })
      } else {
        newJson.points.push({ la: la, lo: lo, d: dis });
      }
      //写入新文件
      _this.WritePointFile(_this.data.RequestId + "_" + _this.data.FileNameIdex + ".json", newJson);
      _this.data.FileName = _this.data.RequestId + "_" + _this.data.FileNameIdex + ".json";
      _this.data.points = newJson;
    } else {
      _this.data.points.pc++;

      if (AddType == 1) {
        newPoint = { la: la, lo: lo, d: dis, t: time };
      } else {
        newPoint = { la: la, lo: lo, d: dis };
      }
      _this.data.points.points.push(newPoint);
      _this.WritePointFile(_this.data.FileName, _this.data.points);
    }
  },
  WritePointFile: function (FileName, json) {
    try {

      FileSystemManager.writeFileSync(`${wx.env.USER_DATA_PATH}/` + FileName, JSON.stringify(json), 'utf-8');
      return true;
    } catch (error) {
      wx.showModal({
        title: '异常',
        content: "写入文件错误",
      });
      _this.SendLog("异常", 0, 0, 0, { la: 0, lo: 0 }, "点位插入时，文件写入错误");
      return false;
    }
  },
  //获取文件下是否存在 该文件命名规则的文件，并且返回idx最大的文件名
  GetFileName: function (RequestId) {
    try {
      var FileList = FileSystemManager.readdirSync(`${wx.env.USER_DATA_PATH}`);
      var idx = -1;
      var FindFileName;
      for (var i = 0; i < FileList.length; i++) {
        if (FileList[i].indexOf(RequestId + "_") >= 0) {
          idx++;
        }
      }
      //没有文件 返回false
      if (idx == -1) {
        return false;
      } else {
        _this.data.FileNameIdex = idx;
        return RequestId  + ".json";
      }
    } catch (error) {
      wx.showModal({
        title: '异常',
        content: "获取文件列表错误",
      });
    }
  },
  //从当前文件中读取出内容存入
  ReadFilePoints: function (RequestId) {
    var FileName = _this.GetFileName(RequestId);
    try {
      var text = FileSystemManager.readFileSync(`${wx.env.USER_DATA_PATH}/` + FileName, 'utf-8');
      _this.data.FileName = FileName;
      return text;
    } catch (error) {
      wx.showModal({
        title: '异常',
        content: "文件读取异常",
      });
    }
  },
  //发送路线文件
  Sent_Route: function (FileName, FileList) {
    wx.uploadFile({
      //https://localhost:44325/
      //url: 'https://localhost:44325/Controllers/RouteEnd.ashx',
      url: app.data.sa + '/Controllers/RouteEnd.ashx',
      filePath: `${wx.env.USER_DATA_PATH}/` + FileName,
      //filePath: `${wx.env.USER_DATA_PATH}/`+'1.json',
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
      success: function (res) {
        if (JSON.parse(res.data).msg == 'OK') {
          for (var j = 0; j < FileList.length; j++) {
            FileSystemManager.unlinkSync(`${wx.env.USER_DATA_PATH}/` + FileList[j])
          }
          FileSystemManager.unlinkSync(`${wx.env.USER_DATA_PATH}/` + FileName);
          wx.offLocationChange(_locationChangeFn);
          wx.showModal({
            title: '提示',
            content: '移动轨迹已上传成功,请关闭小程序',
            success(res) {
              wx.redirectTo({
                url: '../Msg/Msg?msg=移动轨迹已上传成功,请关闭小程序'
              })
            }
          })
        }
      },
      fail: function (res) {
        console.log(res);
        _this.SendLog("异常", 0, 0, 0, { la: 0, lo: 0 }, "发送路径给服务端时，失败。");
      },

      complete: function (res) {
        btn_End_Flg = false;
      }
    })
  },
  LogInsert: function (msg) {
    _this.data.PontLog.unshift({ msg: msg });
    _this.setData({
      PontLog: _this.data.PontLog
    })
  },
  GetAuthor:function(){
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocationBackground'] || res.authSetting['scope.userLocationBackground'] == undefined) {
          wx.authorize({
            scope: 'scope.userLocationBackground',
            success() {
              wx.startLocationUpdateBackground({
                success: function (res) {
                  console.log("授权位置监听");
                },
                fail: function (res) {
                  console.log("授权失败");
                }
              })
            }, fail(error) {
              wx.showModal({
                title: '提示',
                content: "请先在设置中开启 位置信息->使用小程序和离开小程序 ",
              });
              
              return false;
            }
          })
        }
      },
      fail(error) {
        console.log(error);
        return false;
      }
    });
  },
  //发送日志
  SendLog: function (otype, speed, accuracy,dis,point,detial){
    wx.request({
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' //修改此处即可
      },
      //url:'https://localhost:44325/Controllers/OperateRecord.ashx',
      url: app.data.sa + '/Controllers/OperateRecord.ashx',
      data: {
        aid: app.data.appid,
        uid: _this.data.PersonId,
        rid: _this.data.RequestId,
        otype: otype,
        speed: speed,
        accuracy: accuracy,
        dis: dis,
        detial: detial,
        point: JSON.stringify(point),
      },
      success:function(res){
        console.log(res);
      },
      fail:function(error){
        console.log(error);
        _this.SendLog("异常", 0, 0, 0, { la: 0, lo: 0 }, "发送日志给服务端时，失败。");
      }
    });
  }
})
// pages/mapBegin1/mapBegin1.js
const app = getApp();
var util = require('../../utils/util.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var FileSystemManager; //文件管理器
var MsgIndex = 1;
var DebugIndex = 1;
var LogBegin_0_Flg = false;//保证一次不执行多个线程 
var LogStop_0_Flg = false;
var LogContinue_Flg = false;
var Route_End_Flg = false;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    flg: true, //判断页面是否有错误信息
    timeServerl: 0.2, //定义3分钟保存一次
    timeFile: 60,
    distanceMini: 100, //只有*米以外的点才会被记录
    accuracyMax: 700,//精度在*以下才记录
    method: 0, //判断是哪一种方式传递过来的 0.第一次流程 1.继续流程
    distance: 0,
    id: 0, //传递过来的流程id
    pid: 0,//人员表的id
    ccqsrq: '',
    ccqssj: '',
    ccjzrq: '',
    ccjzsj: '',
    ccdd: '',
    LocalName: '', //保存本地的文件名字
    LocalIdx: 0, //当前文件的序号
    json: [], //从头到尾要记录的数据 点的个数不允许超过100个
    LogList: [], //页面的行程记录 这里也要清除
    DebugList: [],
    Latitude_pre: 0, //清缓存前 先纪录一下 上一个点位的信息
    longitude_pre: 0,
    btn1: 0, //开始行程按钮的状态 0：为开始行程状态 1：为不可点击状态
    IntervalId: 0, //当前监听事件的id
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 0.配置必要参数
     * 1.获取传递的参数
     * 2.根据传递参数的method做不同的判断
     */
    //0.设置api
    //页面变量
    var _this = this;
    //地图
    qqmapsdk = new QQMapWX({
      key: app.data.mapKey
    });
    //文件管理器
    FileSystemManager = wx.getFileSystemManager();
    //用于测试用
    //options.id = 10;
    //options.method = 0; //第一个文件 显示开始行程
    //判断文件是否存在 ${'wx.env.USER_DATA_PATH}/` + _this.data.LocalName
    //_this.getFileIdx();
    _this.setData({
      id: options.id,
      pid: options.pid,
      ccqsrq: options.ccqsrq,
      ccqssj: options.ccqssj,
      ccjzrq: options.ccjzrq,
      ccjzsj: options.ccjzsj,
      ccdd: options.ccdd
    });
    if (_this.getFileIdx() == true) {
      options.method = 1;
      _this.setData({
        method: 1,
        id: options.id,
      })
    } else {
      _this.setData({
        method: 0,
        id: options.id,
      })
    }

    if (options.method == 1) {
      _this.setData({
        btn1: 2
      });
    }
    //1.获取传递的参数
    _this.setData({
      method: options.method,
    });
    //根据传递的参数显示不同的按钮
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
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
    if (this.data.json.length == 0) {
      return;
    }
    this.LogStop_0();
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
  //第一次的行程记录
  LogBegin_0: function () {
    var _this = this;
    var time1 = util.formatTime(new Date());
    if (LogBegin_0_Flg) {
      return;
    }
    LogBegin_0_Flg = true;
    //1.获取位置
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        var speed = res.speed;
        var accuracy = res.accuracy;
        //添加数据
        var json = {
          id: _this.data.id,
          pid: app.data.openid,
          d1: time1,
          d2: time1,
          dis: 0,
          pc: 1,
          flg: 0,
          idx: 0,
          points: [{
            la: latitude.toFixed(7),
            lo: longitude.toFixed(7),
            t: time1,
            d: 0
          }]
        }
        //因为是第一次 所有文件索引一定是0
        _this.setData({
          json: json,
          LocalIdx: 0, //文件编号是0
          LocalName: 'local_' + _this.data.id + '_' + 0,
        })
        //将数据写入本地文件
        _this.WriteFileInfo();
        _this.LogInsert('点位记录开始,经度:' + longitude + ",纬度:" + latitude + ",精度：" + accuracy, time1);
        //开启线路监听
        //setInterval(_this.LogLisen_0, _this.data.timeServerl * 60 * 1000);
        //只能执行一个监听 这里要做一个控制
        var IntervalId = setInterval(_this.LogLisen_0, _this.data.timeServerl * 60 * 1000);
        _this.setData({ //设置开始行程按钮不可点击
          btn1: 1,
          IntervalId: IntervalId
        });
      },
      fail(res) { //获取位置失败
        wx.showModal({
          title: '异常',
          content: '获取位置信息失败,信息:' + res.errMsg,
        });
        _this.LogInsert('获取位置信息失败,信息:' + res.errMsg, time1);
        _this.setData({
          flg: 1
        })
      },
      complete(res) {
        LogBegin_0_Flg = false;
      }
    })
  },
  //行程暂停
  LogStop_0: function () {
    //插入断点 
    //获取当前位置
    var _this = this;
    if (LogStop_0_Flg) {
      return;
    }
    LogStop_0_Flg = true;
    clearInterval(_this.data.IntervalId);
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        var la0;
        var lo0;
        if (_this.data.json.points.length == 0) {
          la0 = _this.data.Latitude_pre;
          lo0 = _this.data.longitude_pre;
        } else {
          la0 = _this.data.json.points[_this.data.json.points.length - 1].la;
          lo0 = _this.data.json.points[_this.data.json.points.length - 1].lo;
        }
        var speed = res.speed;
        var accuracy = res.accuracy;
        var time1 = util.formatTime(new Date());
        //获取两点间的距离
        qqmapsdk.calculateDistance({
          mode: 'straight',
          from: {
            latitude: latitude,
            longitude: longitude
          },
          to: [{
            latitude: la0,
            longitude: lo0,
          }],
          success: function (res) {
            var dis = res.result.elements[0].distance;
            _this.PointPush(latitude, longitude, dis, time1, 1);
            //_this.WriteFileInfo();
            _this.LogInsert('行程暂停,经度:' + longitude + ",纬度:" + latitude + "，精度：" + accuracy, time1);
            // _this.DebugLogInsert(_this.ReadFileInfo(), 0);
            _this.setData({
              btn1: 2
            });
          }
        })
      },
      complete(res) {
        LogStop_0_Flg = false;
      }
    })
  },
  //行程继续
  LogContinue: function () {
    //1.读取文件 若文件不存在 提示用户错误信息
    var _this = this;
    if (LogContinue_Flg) {
      return;
    }
    LogContinue_Flg = true;
    //获取当前的文件名
    var flg = _this.getFileIdx();
    var temp;

    if (flg) {
      temp = _this.ReadFileInfo();
    }
    //没有读取到文件
    if (flg == false) {
      //重新创建 点
      wx.getLocation({
        type: 'gcj02',
        success(res) {
          var latitude = res.latitude
          var longitude = res.longitude
          var speed = res.speed
          var accuracy = res.accuracy
          var time1 = util.formatTime(new Date());
          //添加数据
          var json = {
            id: _this.data.id,
            pid: app.data.openid,
            d1: time1,
            d2: time1,
            dis: 0,
            pc: 1,
            flg: 0,
            points: [{
              la: latitude,
              lo: longitude,
              t: time1,
              d: 0
            }]
          }
          //重新设置文件名字
          _this.setData({
            json: json,
            LocalName: 'local_' + _this.data.id + '_' + 0,
            LocalIdx: 0,
            distance: 0
          });
          _this.WriteFileInfo();
          //继续进行监控
          var IntervalId = setInterval(_this.LogLisen_0, 60 * 1000);
          _this.setData({ //设置开始行程按钮不可点击
            btn1: 1,
            IntervalId: IntervalId
          });
        },
        complete(res) {
          LogContinue_Flg = false;
        }
      }
      );
    } else {
      //有文件
      _this.setData({
        json: JSON.parse(temp)
      });
      _this.LogLisen_1();
      //继续进行监控
      var IntervalId = setInterval(_this.LogLisen_0, 60 * 1000);

      _this.setData({ //设置开始行程按钮不可点击
        btn1: 1,
        IntervalId: IntervalId
      });
      LogContinue_Flg = false;
    }
  },
  //线路监听函数 method = 0 时的线路监听
  LogLisen_0: function () {
    var _this = this;
    //获取当前位置
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        var speed = res.speed;
        var accuracy = res.accuracy;
        var la0;
        var lo0;
        // _this.LogInsert('新的位置已记录,经度:' + longitude + ",纬度:" + latitude + "速度:" + speed + "米,精度:" + accuracy, time1);
        //限制范围在中国内
        if (la <= 18 || la >= 54 || lo <= 74 || lo >= 135 || speed == 0) {
          return;
        }

        if (_this.data.json.points.length == 0) { //有可能存在是新文件 一个点都不存在的清空
          la0 = _this.data.Latitude_pre;
          lo0 = _this.data.longitude_pre;
        } else {
          //最近的一个点位
          la0 = _this.data.json.points[_this.data.json.points.length - 1].la;
          lo0 = _this.data.json.points[_this.data.json.points.length - 1].lo;
        }
        var time1 = util.formatTime(new Date());
        //获取两点距离
        qqmapsdk.calculateDistance({
          mode: 'straight',
          from: {
            latitude: latitude,
            longitude: longitude,
          },
          to: [{
            latitude: la0,
            longitude: lo0
          }],
          success: function (res) {
            var dis = res.result.elements[0].distance;
            if (dis > _this.data.distanceMini && accuracy < _this.data.accuracyMax) { //只有两点距离在200米以内才会记录
              //插入点
              _this.PointPush(latitude, longitude, dis, time1, 1);
              //页面显示插入
              _this.LogInsert('新的位置已记录,经度:' + longitude + ",纬度:" + latitude + "距离上个点:" + dis + "米,精度:" + accuracy, time1);
            } else {
              if (accuracy > _this.data.accuracyMax) {
                _this.LogInsert('当前精度不足，精度：' + accuracy, time1);
              } else {
                _this.LogInsert('距离小于' + _this.data.distanceMini + "米,不记录。精度：" + accuracy, time1);
              }

            }
          },
          fail: function (res) {
            _this.LogInsert('计算位置失败,信息:' + JSON.stringify(res), 0);
          }

        })
      }

    })
    //读取文件内容 写到页面上
    //_this.DebugLogInsert(_this.ReadFileInfo(), 0);
  },
  //继续行程的监听
  LogLisen_1: function () {
    var _this = this;
    //获取当前位置
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        var speed = res.speed;
        var accuracy = res.accuracy;
        var la0;
        var lo0;
        //最近的一个点位
        if (_this.data.json.points.length == 0) { //有可能存在是清除了缓存 没有点存在的情况
          la0 = latitude;
          lo0 = longitude;
        } else {
          la0 = _this.data.json.points[_this.data.json.points.length - 1].la;
          lo0 = _this.data.json.points[_this.data.json.points.length - 1].lo;
        }
        var time1 = util.formatTime(new Date());
        var dis = 0; //这是一个新的路
        _this.LogInsert('行程继续记录,经度:' + longitude + ",纬度:" + latitude, time1);
        _this.setData({
          distance: 0
        });
        //插入断点
        _this.PointPush(latitude, longitude, dis, time1, 1);
      }
    })
    //读取文件内容 写到页面上
    //_this.DebugLogInsert(_this.ReadFileInfo(), 0);
  },
  /**
   * 点位插入的方法  
   * AddType
   * 0 不需要插入time   
   * 1 需要插入time
   */
  PointPush: function (la, lo, dis, time, AddType) {
    la = la.toFixed(7);
    lo = lo.toFixed(7);
    var _this = this;
    _this.data.json.d2 = time;
    _this.data.json.pc++;
    _this.data.json.dis += dis;
    if (AddType == 0) {
      _this.data.json.points.push({
        la: la,
        lo: lo,
        d: dis,
        t: time
      });
    } else {
      _this.data.json.points.push({
        la: la,
        lo: lo,
        d: dis,
      });
    }
    var flg = 0;
    //将新点位写入文件
    _this.WriteFileInfo();
    //如果pc>100 将内容写入文件，创建新的文件 清空缓存
    if (_this.data.json.pc >= _this.data.timeFile) {
      var json = {
        id: _this.data.id,
        pid: app.data.openid,
        d1: _this.data.json.d1,
        d2: _this.data.json.d1,
        dis: 0,
        pc: 0,
        flg: 0,
        idx: _this.data.LocalIdx + 1,
        points: []
      }
      //记录下上个点位的信息
      _this.data.Latitude_pre = _this.data.json.points[_this.data.json.points.length - 1].la;
      _this.data.longitude_pre = _this.data.json.points[_this.data.json.points.length - 1].lo;
      //重新命名文件
      _this.setData({
        json: json,
        LocalName: 'local_' + _this.data.id + '_' + (_this.data.LocalIdx + 1),
        LocalIdx: _this.data.LocalIdx + 1,
        distance: _this.data.distance + dis
      });
      flg = 1;
      //将新的文件写入
      _this.WriteFileInfo();
    }
    if (!flg) {
      _this.setData({
        json: _this.data.json,
        distance: _this.data.distance + dis
      });
    }
  },
  LogInsert: function (text, time) { //点位记录操作结果显示到页面上
    var _this = this;
    var LogList = _this.data.LogList;
    //消息记录大于200 就清空缓存
    if (LogList.length > _this.data.timeFile) {//timeFile
      LogList = [];
    }
    LogList.unshift({
      idx: MsgIndex,
      t: time,
      text: text,
    });
    _this.setData({
      LogList: LogList
    });
    MsgIndex++;
  },
  //debug数据调试显示的信息
  DebugLogInsert: function (text, time) {
    var _this = this;
    var DebugList = _this.data.DebugList;
    if (DebugList.length > 100) { //debug记录大于100就清空缓存
      DebugList = [];
    }
    DebugList.unshift({
      idx: DebugIndex,
      t: time,
      text: text,
    });
    _this.setData({
      DebugList: DebugList
    });
    DebugIndex++;
  },
  //文件写入函数
  WriteFileInfo: function () {
    var _this = this;
    try {
      FileSystemManager.writeFileSync(`${wx.env.USER_DATA_PATH}/` + _this.data.LocalName + ".json", JSON.stringify(_this.data.json), 'utf-8');
    } catch (error) {
      if (error.message.indexOf('fail permission') >= 0) {
        //文件写入失败
        wx.showModal({
          title: '异常',
          content: '没有设置写文件的权限，请设置手机权限。',
        });
        _this.setData({
          flg: 1
        });
        var time1 = util.formatTime(new Date());
        _this.LogInsert('没有设置写文件的权限，请设置手机权限。', time1);
        return false;
      }
    }
  },
  //读取文件 返回文件
  ReadFileInfo: function () {
    var _this = this;
    //读文件
    try {
      var text = FileSystemManager.readFileSync(`${wx.env.USER_DATA_PATH}/` + _this.data.LocalName + ".json", 'utf-8');
    } catch (error) {
      if (error.message.indexOf('not found') >= 0) {
        _this.DebugLogInsert("文件可能被您清除，这将会导致数据记录不准确。", 0);
      } else {
        _this.DebugLogInsert("没有读取文件的权限", 0);
      }
      wx.showModal({
        title: '异常',
        content: "文件可能被您清除，这将会导致数据记录不准确。",
      });
      _this.setData({
        flg: 1
      });
      return false;
    }
    //返回读取的内容
    return text;
  },
  //获得文件所在的序号 
  getFileIdx: function () {
    var _this = this;
    try {
      //获取路径下所有的文件
      var FileList = FileSystemManager.readdirSync(`${wx.env.USER_DATA_PATH}`);
      var idx = -1;
      for (var i = 0; i < FileList.length; i++) {
        if (FileList[i].indexOf('local_' + _this.data.id + '_') >= 0) {
          idx++;
        }
      }
      var flg = true; //是否存在文件
      if (idx == -1) {
        idx = 0;
        flg = false;
      }
      //设置文件的名称
      _this.setData({
        LocalName: 'local_' + _this.data.id + '_' + idx,
        LocalIdx: idx,
      });
      return flg;
    } catch (error) {
      wx.showModal({
        title: '异常',
        content: "获取文件列表错误",
      });
      _this.LogInsert(error.message, 0);
    }
  },
  //将当前的所有文件整合成一个 然后发送给服务端
  Send_Route: function (FileName, FileList) {
    //
    // formData.append("aid", );
    // formData.append("rid", 766915);
    // formData.append("pid", 72989);
    // formData.append("oid", "o5kg15hyta5I2938-Qsahwcr81-I");
    // formData.append("ccqsrq", "2020-04-10");
    // formData.append("ccqssj", "16:42");
    // formData.append("ccjzrq", "2020-04-11");
    // formData.append("ccjzsj", "16:42");
    // formData.append("ccdd", "无锡");
    var _this = this;
    wx.uploadFile({
      url: app.data.sa + '/Controllers/RouteEnd.ashx',
      filePath: `${wx.env.USER_DATA_PATH}/` + FileName,
      name: 'file',
      formData: {
        'aid': app.data.appid,
        'rid': _this.data.id,
        'pid': _this.data.pid,
        'oid': app.data.openid,
        'ccqsrq': _this.data.ccqsrq,
        'ccqssj': _this.data.ccqssj,
        'ccjzrq': _this.data.ccjzrq,
        'ccjzsj': _this.data.ccjzsj,
        'ccdd': _this.data.ccdd,
      },
      success: function (res) {
        if (JSON.parse(res.data).msg == 'OK') {
          
          //删除文件 `${wx.env.USER_DATA_PATH}/` FileList
          //wx.removeSavedFile(Object object)
          for (var j = 0; j < FileList.length; j++) {
            FileSystemManager.removeSavedFile({
              filePath: `${wx.env.USER_DATA_PATH}/` + FileList[j],
            })
          }
          Route_End_Flg = true;
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
        wx.showModal({
          title: '异常',
          content: '发送定位信息错误,信息:' + res.errMsg,
        });
      }
    });
  },
  Route_End: function () {
    var _this = this;
    if (Route_End_Flg) {
      return;
    }
    if (this.data.btn1 == 0) {
      //当前没有创建路线 无法结束行程
      wx.showModal({
        title: '提示',
        content: '没有路径信息无法上传行程',
      });
      return;
    }
    wx.showModal({
      title: '提示',
      content: '点击确定后行程将结束',
      success(res) {
        if (res.confirm) {
          Route_End_Flg = true;
          FileSystemManager.readdir({
            dirPath: `${wx.env.USER_DATA_PATH}/`,
            success: function (res) {
              var CompondText = "";
              var files = res.files;
              //'local_' + _this.data.id + '_'
              var FindFile = 'local_' + _this.data.id + '_';
              var SendJson;
              var FileList = [];
              for (var i = 0; i < files.length; i++) {
                var FileTemp = files[i];
                var idx = FileTemp.indexOf(FindFile);
                if (idx >= 0) {
                  //
                  FileList.push(FileTemp);
                  var txt = FileSystemManager.readFileSync(`${wx.env.USER_DATA_PATH}/` + FileTemp, 'utf-8');
                  //JSON.parse(txt);
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
              FileSystemManager.writeFileSync(`${wx.env.USER_DATA_PATH}/` + 'local_' + _this.data.id + 'final.json', JSON.stringify(SendJson), 'utf-8');
              _this.Send_Route('local_' + _this.data.id + 'final.json', FileList);

            },
            fail: function (res) {
              wx.showModal({
                title: '异常',
                content: '合并文件错误,信息:' + res.errMsg,
              });
            },
            complete: function (res) {
              Route_End_Flg = false;
            }
          });
        } else if (res.cancel) {

        }
      }
    })
  }
})
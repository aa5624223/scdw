// pages/flowChose/flowChose.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Flow1: [],
    Flow1_1: [],
    Flow2: [],
    Flow2_1: [],
    Flow3: [],
    Flow3_1: [],
    pid: 0,
    ContinueFlow:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    
    this.setData({
      pid: options.uid
    });
    //options.uid
    wx.request({//获取流程的信息
      method: 'POST',
      url: app.data.sa + '/Controllers/SwitchRead.ashx',
      data: {
        aid: app.data.appid,
        pid: options.uid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' //修改此处即可
      },
      success: function (res) {
        if (res.data.msg == "OK") { 
          _this.setData({
            Flow1: res.data.d
          });
          _this.setData({
            Flow1_1: _this.data.Flow1
          });
          _this.setData({
            search: _this.search.bind(_this)
          })
          //查找本地文件
          _this.getFileIdx();
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '服务器错误！'
        });
      }
    })
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
  /**
   * 用户单击流程时触发的事件
   * 转向地图界面 第一次流程
   */
  tapMessage: function (e) {
    //e.currentTarget.dataset.index;//获得当前数组的下标
    var _this = this;
    var idx = e.currentTarget.dataset.index;
    if (_this.data.ContinueFlow == true && _this.data.Flow1_1[idx].IsContinue==undefined){
      wx.showModal({
        title: '提示',
        content: "请先结束进行中的流程",
      });
      return;
    }
    var FlowIteam = this.data.Flow1[idx];//把FlowIteam.id传给另一个页面即可

    // if (_this.data.pid == 72989 || _this.data.pid == 39537){
    //   wx.redirectTo({
    //     //method = 1 为继续 method = 0 为初始
    //     url: '../mapBegin4/mapBegin4?id=' + FlowIteam.requestId + "&method=0&pid=" + _this.data.pid + "&ccqsrq=" + FlowIteam.ccqsrq + "&ccqssj=" + FlowIteam.ccqssj + "&ccjzrq=" + FlowIteam.ccjzrq + "&ccjzsj=" + FlowIteam.ccjzsj + "&ccdd=" + FlowIteam.ccdd
    //   });
    //   return;
    // }
    // wx.redirectTo({
    //   //method = 1 为继续 method = 0 为初始
    //   url: '../mapBegin4/mapBegin4?id=' + FlowIteam.requestId + "&method=0&pid=" + _this.data.pid + "&ccqsrq=" + FlowIteam.ccqsrq + "&ccqssj=" + FlowIteam.ccqssj + "&ccjzrq=" + FlowIteam.ccjzrq + "&ccjzsj=" + FlowIteam.ccjzsj + "&ccdd=" + FlowIteam.ccdd
    // });
    
    wx.redirectTo({
      //method = 1 为继续 method = 0 为初始
      url: '../mapBegin4/mapBegin4?id=' + FlowIteam.requestId + "&method=0&pid=" + _this.data.pid + "&ccqsrq=" + FlowIteam.ccqsrq + "&ccqssj=" + FlowIteam.ccqssj + "&ccjzrq=" + FlowIteam.ccjzrq + "&ccjzsj=" + FlowIteam.ccjzsj + "&ccdd=" + FlowIteam.ccdd
    });
    
  },
  /**
   * 流程查询
   */
  search: function (value) {
    // //用setdata 更新下面的流程列表 sName
    // var temp = this.data.Flow1.filter(function (iteam) {
    //   if (iteam.sName.indexOf(value) >= 0 || value.trim() == "") {
    //     return true;
    //   }

    // });
    // this.setData({
    //   Flow1_1: temp
    // });
    // temp = this.data.Flow2.filter(function (iteam) {
    //   if (iteam.sName.indexOf(value) >= 0 || value.trim() == "") {
    //     return true;
    //   }
    // });
    // this.setData({
    //   Flow2_1: temp
    // });
    // temp = this.data.Flow3.filter(function (iteam) {
    //   if (iteam.sName.indexOf(value) >= 0 || value.trim() == "") {
    //     return true;
    //   }
    // });
    // this.setData({
    //   Flow3_1: temp
    // });

    // //这里写时为了不出错
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve()
    //   }, 200)
    // });
  },
  btn_help: function () {
    //读取文件放到页面上 跳转到帮助页面
    wx.redirectTo({
      url: '../help/help?method=0'
    });
  },
  getFileIdx: function () {
    var _this = this;
    var FileSystemManager = wx.getFileSystemManager();
    try {
      //获取路径下所有的文件
      var FileList = FileSystemManager.readdirSync(`${wx.env.USER_DATA_PATH}`);
      var idx = -1;
      for (var i = 0; i < FileList.length; i++) {
        for (var j = 0; j < _this.data.Flow1_1.length;j++){
          if (FileList[i].indexOf(_this.data.Flow1_1[j].requestId)>=0){
            _this.data.Flow1_1[j].IsContinue = true;
            _this.setData({
              ContinueFlow:true,
              Flow1_1: _this.data.Flow1_1
            });
            return;
          }
        }
        //Flow1_1[j].requestId

      }
      
    } catch (error) {
      wx.showModal({
        title: '异常',
        content: "获取文件列表错误",
      });
    }
  }
  // selectResult: function (e) {
  //   console.log('select result', e.detail)
  // },
})
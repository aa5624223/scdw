// pages/login/login.js
const app = getApp()
var Confirm_Flg = false;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: app.data.userInfo,
    openid: app.data.opneid,
    userId: 0,
    uName: '',
    aid: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '信息认证'
    })
    this.setData({
      aid: app.data.appid,
      userInfo: app.data.userInfo,
      openid: app.data.openid,
    });
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
  btn_Confirm: function (e) {
    //openid
    //userInfo.nickName
    //$("#UserId")
    //this.data.openid
    //this.data.userInfo.nickName
    //this.data.userId
    if (Confirm_Flg) {
      return;
    }
    Confirm_Flg = true;
    var appid = app.data.appid;
    var formData = e.detail.value;
    wx.request({
      method: 'POST',
      //app.data.sa + '/Controllers/Login_Certify.ashx'
      url: app.data.sa + '/Controllers/Login_Certify.ashx',
      data: formData,
      header: {
        'content-type': 'application/x-www-form-urlencoded' //修改此处即可
      },
      success: function (res) {
        var i = 0;
        if (res.data.msg == "EXIST") {
          wx.showModal({
            title: '提示',
            content: '您已经验证过，不需要再验证了'
          });
        } else if (res.data.msg == 'OK') {
          wx.redirectTo({
            url: '../flowChose/flowChose?uid=' + res.data.pid,
          });
        } else if (res.data.msg = 'NOTFOUNT') {
          wx.showModal({
            title: '提示',
            content: '请核对账号，密码是否输入正确'
          });
        } else if (res.data.msg = 'APPIDERROR') {
          wx.showModal({
            title: '提示',
            content: '此小程序未认证！'
          });
        } else {
          wx.showModal({
            title: '验证失败',
            content: '请联系管理员!'
          });
        }

      },
      fail: function (res) {
        var i = 0;
      },
      complete: function (res) {
        Confirm_Flg = false;
      }
    });
  }
})
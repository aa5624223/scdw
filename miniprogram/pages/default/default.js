// pages/login/login.js
const app = getApp();
var Confirm_Flg = false;
var _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btn:-1,
    openid:'',
    authFlg:true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    /**
     * 1.判断本地是否有openid
     * 1.1 无openid 获取用户授权状态
     * 1.1.1 没有授权
     * 显示授权按钮，让用户点击授权
     * 1.1.1.1 用户拒绝授权
     * 显示拒绝授权按钮
     * 1.1.1.2 用户允许授权 进入1.1.2
     * 1.1.2 有授权
     * 获取openid，进入1.2
     * 1.2 有openid
     * 通过openid查询此人
     * 1.2.1 没有查询到这个人
     * 进入用户验证界面
     * 1.2.1 查询到这个人了
     * 进入流程查询界面
     */
    _this = this;
    app.data.openid = wx.getStorageSync("openid");
    app.data.userInfo = wx.getStorageSync("userInfo");
    //1
    if(app.data.openid == "" || app.data.userInfo==""){
      wx.getSetting({
        success:function(res){
          var i = 0;
          if (res.authSetting["scope.userInfo"]==undefined){
          //没有授权状态
            _this.setData({
              btn:0
            });

          } else if (res.authSetting["scope.userInfo"]==false){
          //拒绝获取信息
            _this.setData({
              btn:1
            });
          } else{
          //允许获取信息
            _this.setData({
              btn:2
            });

          }
        }
      })
    }else{
      _this.setData({
        openid: app.data.openid,
        userInfo: app.data.userInfo
      })
      _this.getCompanyInfo();
    }
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
  //单击登录按钮 
  btn_login:function(){
    var _this = this;
    wx.getSetting({
      success: function (res) {
        var i = 0;
        if (res.authSetting["scope.userInfo"] == undefined) {
          //没有授权状态
          wx.showModal({
            title: '提示',
            content: '请先点击授权按钮,获取获取用户信息权限'
          });
        } else if (res.authSetting["scope.userInfo"] == false) {
          //拒绝获取信息
          wx.showModal({
            title: '提示',
            content: '请点击右上角左边的图标,在设置中允许获取用户信息'
          });
        } else {
          //允许获取信息
          _this.getOpenid();
        }
      }
    })
  },
  //获取openid 到这里用户已经允许获取用户信息了！
  getOpenid:function(){
    var _this = this;
    //1.获取用户信息
    wx.getUserInfo({
      success:function(res){
        app.data.userInfo = res.userInfo;
        wx.setStorageSync('userInfo', res.userInfo);
      }
    });
    //2.获取code
    wx.login({
      success:function(res){
        if(res.code){
          //通过code获取openid
          wx.request({
            url: app.data.sa + '/Controllers/getSecret.ashx',
            header: {
              'content-type': 'application/x-www-form-urlencoded' //修改此处即可
            },
            data: {
              'code': res.code
            },
            method:'POST',
            success:function(res1){
              var result = res1.data;
              app.data.openid = result.openid;
              wx.setStorageSync("openid", result.openid);
              _this.getCompanyInfo();
            },
            fail:function(error){
              console.log(error);
            }
          })
        }
      }
    })
  },
  //获取用户的公司信息 在这之前必须已经获取到openid了！
  getCompanyInfo:function(){
    var _this = this;
    wx.request({
      url: app.data.sa + '/Controllers/Login.ashx',
      data:{
        'aid': app.data.appid,
        'openid':app.data.openid,
        userInfo:'',
      },
      //timeout:10000,
      header: {
        'content-type': 'application/x-www-form-urlencoded' //修改此处即可
      },
      method:'POST',
      success:function(res){
        if(res.data.msg=="OK"){//获取到公司用户信息了
          wx.redirectTo({
            url: '../flowChose/flowChose?uid=' + res.data.pid,
          });
        } else if (res.data.msg == "NOTFOUNT"){
          // _this.setData({
          //   openid: app.data.openid,
          //   userInfo: app.data.userInfo,
          //   btn:-1
          // })
          wx.redirectTo({
            url: '../login/login'
          });
        } else if (res.data.msg == "APPIDERROR"){
          wx.showModal({
            title: '提示',
            content: '此小程序未认证！'
          });
        }
      },fail:function(res){
        wx.showModal({
          title: '提示',
          content: '服务器未响应！'
        });
      }
    })
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
          wx.showModal({
            title: '提示',
            content: ''
          });
          wx.showModal({
            title: '提示',
            content: '验证成功,请重新打开小程序',
            success(res) {
              wx.redirectTo({
                url: '../Msg/Msg?msg=验证成功,请重新打开小程序'
              });
            }
          })

        } else if (res.data.msg = 'NOTFOUNT') {
          wx.showModal({
            title: '提示',
            content: '请核对员工号，员工姓名是否输入正确'
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
  },
  btn_auth:function(){
    this.setData({
      authFlg:false
    });
  },
  btn_help:function(){
    //读取文件放到页面上 跳转到帮助页面
    wx.redirectTo({
      url: '../help/help?method=0'
    });
  }
})
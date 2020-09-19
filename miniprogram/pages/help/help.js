// pages/help/help.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    dialogShow0: false,
    dialogShow1: false,
    TitleList1:[
      {id:1,
      text:'第一步：获取微信信息',
      imgList:[
        app.data.ImgSrc +'/Step1_1.jpg',
        app.data.ImgSrc +'/Step1_2.jpg',
      ]
      },
      {id:2,
      text:'第二步：获取位置权限',
      imgList: [
          app.data.ImgSrc + '/step2_1.jpg',
          app.data.ImgSrc + '/Step2_2.jpg',
          app.data.ImgSrc + '/Step2_3.jpg',
          app.data.ImgSrc + '/Step2_4.jpg',
        ]
      },
      {id:3,
      text:'第三步：OA登录',
      imgList: [
          app.data.ImgSrc + '/Step3_1.jpg',
          app.data.ImgSrc + '/Step3_2.jpg',
        ]
      },
      
    ],
    TitleList2:[
      {id:4,
      text:'1.行程选择',
      imgList: [
        app.data.ImgSrc + '/View_Flow_1.jpg',
        ]
      }
    ],
    TitleList3: [
      { id: 5,
      text: '1.开始行程',
        imgList: [
          app.data.ImgSrc + '/MapBegin_1.jpg',
        ]
      },
      {id: 6,
      text: '2.暂停行程',
        imgList: [
          app.data.ImgSrc + '/MapBegin_2.jpg',
        ]
      },
      { id: 7,
      text: '3.继续行程',
      imgList: [
        app.data.ImgSrc + '/MapBegin_3.jpg',
      ]
      },
      { id: 8,
      text: '4.结束行程',
        imgList: [
          app.data.ImgSrc + '/MapBegin_4.jpg',
        ]
      },
    ],
    TitleList4:[
      { id: 9, text: '1.出差/公出申请变化' },
      {id:10,text:'2.部分机型无法在后台定位'}
    ]
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
  ShowHelp:function(e){
    var item = e.currentTarget.dataset.item;
    var link = item.imgList[0];
    wx.previewImage({
      urls: item.imgList,
    })
  },
  open: function () {
    this.setData({
      show: true
    })
  },
  open0: function () {
    this.setData({
      dialogShow0: true
    })
  },
  open1: function () {
    this.setData({
      dialogShow1: true
    })
  },
  btn_back:function(){
    wx.redirectTo({
      url: '../default/default?method=0'
    });
  }
})
//app.js
App({
  data: {
    appid: 'wx18f0c07ca226079c',
    mapKey: 'RWXBZ-5HQ64-2GHUL-DKL6D-F7ZFO-B2B6T',
    secret: '0a4b32637395a997c263592f3dbab0f0',
    userInfo: "",
    opneid: "",
    //sa:"https://localhost:44325",
    sa: "https://api.changfa.net/OA_WX_GPS",
    ImgSrc: "https://api.changfa.net/OA_WX_GPS/HelpImg",
    LocateFile: "Locate_"
  },
  onLaunch: function () {
    
  },
  globalData: {
    userInfo: null
  }
})
/* Credit page of the app */
const { modal, toast, format } = require('../../utils/util');

// 连接云数据库
const db = wx.cloud.database();
// 数据库操作符
const _ = db.command;
// 用户
const users = db.collection('users');
// 积分
const creditList = db.collection('credit');

Page({

    mixins: [require('../../mixin/common')],
    /**
     * 页面的初始数据
     */
    data: {
        creditA: 666,
        creditB: 666,
        userA: '大强子',
        userB: '小小付',
    },

    /**
   * 页面数据初始化完成
   */
  onLoad: function () {
    this.loadDeployCredits();
  },

  /**
   * 下拉刷新页面
   */
  onPullDownRefresh: function () {
    this.loadDeployCredits();
    setTimeout(() => {
      //0.5秒后停止下拉
      wx.stopPullDownRefresh({
        success: (res) => {},
      })
    }, 500);
  },

  /**
   * 加载积分
   */
  loadDeployCredits(reload = true) {
    let _this = this;
    let _loversList = [{}, {}];
    users.where({
      auth_deploy: true
    }).limit(2)
    .field({
      avatar: true,
      nickname: true,
      phone: true,
      _openid: true,
      alias: true
    })
    .orderBy('create_time', 'asc')
    .get().then(res=>{
      if (res.data.length == 2) {
        _loversList[0] = res.data[0],
        _loversList[1] = res.data[1]
        creditList.where({
        }).limit(2)
        .field({
          credit: true
        })
        .get().then(res=>{
          if (res.data.length == 2) {
            console.log({_loversList})
            if (res.data[0]._openid == _loversList[0]._openid) {
              _this.setData({
                creditA: res.data[0].credit,
                userA: _loversList[0].nickname,
                creditB: res.data[1].credit,
                userB: _loversList[1].nickname,
              })
            }else{
              _this.setData({
                creditA: res.data[1].credit,
                userA: _loversList[1].nickname,
                creditB: res.data[0].credit,
                userB: _loversList[0].nickname,
              })
            }
          } 
        })
      } else {
        console.error('当前拥有发布权限的人数不足2人，首页顶部情侣专属内容将不显示，如有需要，请邀请你的另一半加入');
      }
    })
  },


})
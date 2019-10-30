import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index?v=20190617112'
import './app.css?v=20190629112'

//引用字体适配问题文件
import './utils/init.js?v=20190629112'

import Netservice from './netservice';
import Common from './common';
import { getUrlParam } from './utils/utils';

import 'taro-ui/dist/style/index.scss' // 全局引入一次即可


// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5') {
//   require('nerv-devtools')
// }

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/home_components/package_or_buy/package_or_buy',
      'pages/index/summer_topic/summer_topic',

      'pages/points/points',
      'pages/points/citys/citys',

      'pages/booking/booking',

      'pages/wish/wish',
      'pages/wish/messages/messages',

      'pages/wish/car/car',
      'pages/wish/car/partTimeMakeMoney/partTimeMakeMoney',
      'pages/wish/car/myMessage/myMessage',
      'pages/wish/car/caocao/caocao',
      'pages/wish/car/caocao/caocao_apply',
      'pages/wish/car/shouqi/shouqi',
      'pages/wish/car/yadi/yadi',

      'pages/wish/lend/lend',
      'pages/wish/rent/rent',
      'pages/wish/rent2/rent2',
      'pages/wish/earn/earn',
      'pages/wish/apply_success/apply_success',

      'pages/wish/assistant/assistant',
      'pages/wish/assistant/assistantDetails/assistantDetails',

      // 'pages/take_meals/take_meals',
      'pages/take_meals/select_coupon/select_coupon',

      'pages/my/my',
      'pages/my/order_history/order_history',
      'pages/my/order_history/the_order_details/the_order_details',
      'pages/my/couponList/couponList',
      'pages/my/choice_motorman_type/choice_motorman_type',
      'pages/my/service/service',
      'pages/my/service/apply_for_after_sales/apply_for_after_sales',

      'pages/my/apply/apply',
      'pages/my/apply_detail/apply_detail',

      'pages/my/invite_friends/invite_friends',
      'pages/my/invite_friends/activityRules/activityRules',
      'pages/my/invite_friends/hasActivationList/hasActivationList',
      'pages/login/login',
    ],
    permission: {
      'scope.userLocation': {
        desc: '您的位置将用于匹配附近的取餐点'
      },
      'scope.snsapi_base': {
        desc: '获取进入页面的用户的openId'
      }
    },
    "tabBar": {
      'color': '#2F2F30',  //D6BC98
      'selectedColor': '#2F2F30',   //FF7A5A
      'backgroundColor': '#2F2F30',  //2F2F30
      'borderStyle': 'black',  //white
      "list": [{
        "pagePath": "pages/index/index",
        // "text": "首页",
        'iconPath': './images/tab/tab1_normal.png',
        'selectedIconPath': './images/tab/tab1_select.png',
        'selectedColor': '#222224'
      },
      {
        "pagePath": "pages/wish/wish",
        // "text": "取餐",
        'iconPath': './images/tab/tab2_normal.png',
        'selectedIconPath': './images/tab/tab2_select.png',
        'selectedColor': '#222224'
      },
      {
        "pagePath": "pages/my/my",
        // "text": "我的",
        'iconPath': './images/tab/tab3_normal.png',
        'selectedIconPath': './images/tab/tab3_select.png',
        'selectedColor': '#222224'
      }
      ]
    },
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#2F2F30',
      navigationBarTitleText: '禾师傅',
      navigationBarTextStyle: 'black',
    }
  }

  componentWillMount() {
    this.getWxgzhCode();
  }

  componentDidMount() { }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }


  // 微信公众号获取code
  getWxgzhCode() {
    const code = getUrlParam('code')  // 截取路径中的code
    if (code == null || code === '') {
      // window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxed1d300ad50d204f&redirect_uri=' + encodeURIComponent('http://wxgzh.hequecheguanjia.com') + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect';
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?&appid=wxed1d300ad50d204f&redirect_uri=' + encodeURIComponent('http://wxgzhtest.hequecheguanjia.com') + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect';
      // window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxed1d300ad50d204f&redirect_uri=' + encodeURIComponent('http://wxgzhtest.hequecheguanjia.com?pid=36') + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect';
    } else {
      this.getOpenId(code) //把code传给后台获取用户信息
    }
  }

  //获取openId
  getOpenId(code) {
    let that = this;
    Netservice.request({
      url: 'heque-eat/we_chat_public_number/get_wechat_user_openid',
      method: 'GET',
      data: { code: code },
      success: (res) => {
        if (res && res.code == Common.NetCode_NoError && res.data && res.data.openId && res.data.openId.length > 10) {
          window.localStorage.setItem('openId', res.data.openId);
          that.getUserId(res.data.openId);
        }
      }
    })
  }

  //获取userId
  getUserId(openId) {
    Netservice.request({
      url: 'heque-user/user/open_id_get_user_info',
      method: 'GET',
      data: {
        weChatPublicNumberOpenId: openId,
        type: 1
      },
      success: (res) => {
        if (res && (res.code == Common.NetCode_NoError) && res.data) {
          const user = res.data;
          window.localStorage.setItem('token', user.token);
          window.localStorage.setItem('userId', user.userId);
          window.localStorage.setItem('phone', user.phoneNo);
        }
      }
    })
  }




  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
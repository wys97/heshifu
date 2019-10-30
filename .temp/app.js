import Taro, { Component } from "@tarojs/taro-h5";

import './app.css?v=20190629112';

//引用字体适配问题文件
import './utils/init.js?v=20190629112';

import Netservice from './netservice';
import Common from './common';
import { getUrlParam } from './utils/utils';

import 'taro-ui/dist/style/index.scss'; // 全局引入一次即可


// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5') {
//   require('nerv-devtools')
// }

import Nerv from 'nervjs';
import { View, Tabbar, TabbarContainer, TabbarPanel } from '@tarojs/components';
import { Router, createHistory, mountApis } from '@tarojs/router';
Taro.initPxTransform({
  "designWidth": 750,
  "deviceRatio": {
    "640": 1.17,
    "750": 1,
    "828": 0.905
  }
});

const _taroHistory = createHistory({
  mode: "hash",
  basename: "/",
  customRoutes: {},
  firstPagePath: "/pages/index/index"
});

mountApis({
  "basename": "/",
  "customRoutes": {}
}, _taroHistory);
class App extends Component {
  state = {
    __tabs: {
      'color': '#2F2F30', //D6BC98
      'selectedColor': '#2F2F30', //FF7A5A
      'backgroundColor': '#2F2F30', //2F2F30
      'borderStyle': 'black', //white
      "list": [{
        "pagePath": "/pages/index/index",
        // "text": "首页",
        'iconPath': require("././images/tab/tab1_normal.png"),
        'selectedIconPath': require("././images/tab/tab1_select.png"),
        'selectedColor': '#222224'
      }, {
        "pagePath": "/pages/wish/wish",
        // "text": "取餐",
        'iconPath': require("././images/tab/tab2_normal.png"),
        'selectedIconPath': require("././images/tab/tab2_select.png"),
        'selectedColor': '#222224'
      }, {
        "pagePath": "/pages/my/my",
        // "text": "我的",
        'iconPath': require("././images/tab/tab3_normal.png"),
        'selectedIconPath': require("././images/tab/tab3_select.png"),
        'selectedColor': '#222224'
      }],
      mode: "hash",
      basename: "/",
      customRoutes: {}
    }
  };


  config = {
    pages: ["/pages/index/index", "/pages/home_components/package_or_buy/package_or_buy", "/pages/index/summer_topic/summer_topic", "/pages/points/points", "/pages/points/citys/citys", "/pages/booking/booking", "/pages/wish/wish", "/pages/wish/messages/messages", "/pages/wish/car/car", "/pages/wish/car/partTimeMakeMoney/partTimeMakeMoney", "/pages/wish/car/myMessage/myMessage", "/pages/wish/car/caocao/caocao", "/pages/wish/car/caocao/caocao_apply", "/pages/wish/car/shouqi/shouqi", "/pages/wish/car/yadi/yadi", "/pages/wish/lend/lend", "/pages/wish/rent/rent", "/pages/wish/rent2/rent2", "/pages/wish/earn/earn", "/pages/wish/apply_success/apply_success", "/pages/wish/assistant/assistant", "/pages/wish/assistant/assistantDetails/assistantDetails",

    // 'pages/take_meals/take_meals',
    "/pages/take_meals/select_coupon/select_coupon", "/pages/my/my", "/pages/my/order_history/order_history", "/pages/my/order_history/the_order_details/the_order_details", "/pages/my/couponList/couponList", "/pages/my/choice_motorman_type/choice_motorman_type", "/pages/my/service/service", "/pages/my/service/apply_for_after_sales/apply_for_after_sales", "/pages/my/apply/apply", "/pages/my/apply_detail/apply_detail", "/pages/my/invite_friends/invite_friends", "/pages/my/invite_friends/activityRules/activityRules", "/pages/my/invite_friends/hasActivationList/hasActivationList", "/pages/login/login"],
    permission: {
      'scope.userLocation': {
        desc: '您的位置将用于匹配附近的取餐点'
      },
      'scope.snsapi_base': {
        desc: '获取进入页面的用户的openId'
      }
    },
    "tabBar": { 'color': '#2F2F30', 'selectedColor': '#2F2F30', 'backgroundColor': '#2F2F30', 'borderStyle': 'black', "list": [{ "pagePath": "/pages/index/index", 'iconPath': require("././images/tab/tab1_normal.png"), 'selectedIconPath': require("././images/tab/tab1_select.png"), 'selectedColor': '#222224' }, { "pagePath": "/pages/wish/wish", 'iconPath': require("././images/tab/tab2_normal.png"), 'selectedIconPath': require("././images/tab/tab2_select.png"), 'selectedColor': '#222224' }, { "pagePath": "/pages/my/my", 'iconPath': require("././images/tab/tab3_normal.png"), 'selectedIconPath': require("././images/tab/tab3_select.png"), 'selectedColor': '#222224' }], mode: "hash",
      basename: "/",
      customRoutes: {}
    },
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#2F2F30',
      navigationBarTitleText: '禾师傅',
      navigationBarTextStyle: 'black'
    }
  };

  componentWillMount() {
    this.getWxgzhCode();
  }

  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 微信公众号获取code
  getWxgzhCode() {
    const code = getUrlParam('code'); // 截取路径中的code
    if (code == null || code === '') {
      // window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxed1d300ad50d204f&redirect_uri=' + encodeURIComponent('http://wxgzh.hequecheguanjia.com') + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect';
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?&appid=wxed1d300ad50d204f&redirect_uri=' + encodeURIComponent('http://wxgzhtest.hequecheguanjia.com') + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect';
      // window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxed1d300ad50d204f&redirect_uri=' + encodeURIComponent('http://wxgzhtest.hequecheguanjia.com?pid=36') + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect';
    } else {
      this.getOpenId(code); //把code传给后台获取用户信息
    }
  }

  //获取openId
  getOpenId(code) {
    let that = this;
    Netservice.request({
      url: 'heque-eat/we_chat_public_number/get_wechat_user_openid',
      method: 'GET',
      data: { code: code },
      success: res => {
        if (res && res.code == Common.NetCode_NoError && res.data && res.data.openId && res.data.openId.length > 10) {
          window.localStorage.setItem('openId', res.data.openId);
          that.getUserId(res.data.openId);
        }
      }
    });
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
      success: res => {
        if (res && res.code == Common.NetCode_NoError && res.data) {
          const user = res.data;
          window.localStorage.setItem('token', user.token);
          window.localStorage.setItem('userId', user.userId);
          window.localStorage.setItem('phone', user.phoneNo);
        }
      }
    });
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <TabbarContainer>
          
        <TabbarPanel>
          
                <Router mode={"hash"} history={_taroHistory} routes={[{
          path: '/pages/index/index',
          componentLoader: () => import( /* webpackChunkName: "index_index" */'./pages/index/index'),
          isIndex: true
        }, {
          path: '/pages/home_components/package_or_buy/package_or_buy',
          componentLoader: () => import( /* webpackChunkName: "home_components_package_or_buy_package_or_buy" */'./pages/home_components/package_or_buy/package_or_buy'),
          isIndex: false
        }, {
          path: '/pages/index/summer_topic/summer_topic',
          componentLoader: () => import( /* webpackChunkName: "index_summer_topic_summer_topic" */'./pages/index/summer_topic/summer_topic'),
          isIndex: false
        }, {
          path: '/pages/points/points',
          componentLoader: () => import( /* webpackChunkName: "points_points" */'./pages/points/points'),
          isIndex: false
        }, {
          path: '/pages/points/citys/citys',
          componentLoader: () => import( /* webpackChunkName: "points_citys_citys" */'./pages/points/citys/citys'),
          isIndex: false
        }, {
          path: '/pages/booking/booking',
          componentLoader: () => import( /* webpackChunkName: "booking_booking" */'./pages/booking/booking'),
          isIndex: false
        }, {
          path: '/pages/wish/wish',
          componentLoader: () => import('./pages/wish/wish'),
          isIndex: false
        }, {
          path: '/pages/wish/messages/messages',
          componentLoader: () => import( /* webpackChunkName: "wish_messages_messages" */'./pages/wish/messages/messages'),
          isIndex: false
        }, {
          path: '/pages/wish/car/car',
          componentLoader: () => import( /* webpackChunkName: "wish_car_car" */'./pages/wish/car/car'),
          isIndex: false
        }, {
          path: '/pages/wish/car/partTimeMakeMoney/partTimeMakeMoney',
          componentLoader: () => import( /* webpackChunkName: "wish_car_partTimeMakeMoney_partTimeMakeMoney" */'./pages/wish/car/partTimeMakeMoney/partTimeMakeMoney'),
          isIndex: false
        }, {
          path: '/pages/wish/car/myMessage/myMessage',
          componentLoader: () => import( /* webpackChunkName: "wish_car_myMessage_myMessage" */'./pages/wish/car/myMessage/myMessage'),
          isIndex: false
        }, {
          path: '/pages/wish/car/caocao/caocao',
          componentLoader: () => import( /* webpackChunkName: "wish_car_caocao_caocao" */'./pages/wish/car/caocao/caocao'),
          isIndex: false
        }, {
          path: '/pages/wish/car/caocao/caocao_apply',
          componentLoader: () => import( /* webpackChunkName: "wish_car_caocao_caocao_apply" */'./pages/wish/car/caocao/caocao_apply'),
          isIndex: false
        }, {
          path: '/pages/wish/car/shouqi/shouqi',
          componentLoader: () => import( /* webpackChunkName: "wish_car_shouqi_shouqi" */'./pages/wish/car/shouqi/shouqi'),
          isIndex: false
        }, {
          path: '/pages/wish/car/yadi/yadi',
          componentLoader: () => import( /* webpackChunkName: "wish_car_yadi_yadi" */'./pages/wish/car/yadi/yadi'),
          isIndex: false
        }, {
          path: '/pages/wish/lend/lend',
          componentLoader: () => import( /* webpackChunkName: "wish_lend_lend" */'./pages/wish/lend/lend'),
          isIndex: false
        }, {
          path: '/pages/wish/rent/rent',
          componentLoader: () => import( /* webpackChunkName: "wish_rent_rent" */'./pages/wish/rent/rent'),
          isIndex: false
        }, {
          path: '/pages/wish/rent2/rent2',
          componentLoader: () => import( /* webpackChunkName: "wish_rent2_rent2" */'./pages/wish/rent2/rent2'),
          isIndex: false
        }, {
          path: '/pages/wish/earn/earn',
          componentLoader: () => import( /* webpackChunkName: "wish_earn_earn" */'./pages/wish/earn/earn'),
          isIndex: false
        }, {
          path: '/pages/wish/apply_success/apply_success',
          componentLoader: () => import( /* webpackChunkName: "wish_apply_success_apply_success" */'./pages/wish/apply_success/apply_success'),
          isIndex: false
        }, {
          path: '/pages/wish/assistant/assistant',
          componentLoader: () => import( /* webpackChunkName: "wish_assistant_assistant" */'./pages/wish/assistant/assistant'),
          isIndex: false
        }, {
          path: '/pages/wish/assistant/assistantDetails/assistantDetails',
          componentLoader: () => import( /* webpackChunkName: "wish_assistant_assistantDetails_assistantDetails" */'./pages/wish/assistant/assistantDetails/assistantDetails'),
          isIndex: false
        }, {
          path: '/pages/take_meals/select_coupon/select_coupon',
          componentLoader: () => import( /* webpackChunkName: "take_meals_select_coupon_select_coupon" */'./pages/take_meals/select_coupon/select_coupon'),
          isIndex: false
        }, {
          path: '/pages/my/my',
          componentLoader: () => import( /* webpackChunkName: "my_my" */'./pages/my/my'),
          isIndex: false
        }, {
          path: '/pages/my/order_history/order_history',
          componentLoader: () => import( /* webpackChunkName: "my_order_history_order_history" */'./pages/my/order_history/order_history'),
          isIndex: false
        }, {
          path: '/pages/my/order_history/the_order_details/the_order_details',
          componentLoader: () => import( /* webpackChunkName: "my_order_history_the_order_details_the_order_details" */'./pages/my/order_history/the_order_details/the_order_details'),
          isIndex: false
        }, {
          path: '/pages/my/couponList/couponList',
          componentLoader: () => import( /* webpackChunkName: "my_couponList_couponList" */'./pages/my/couponList/couponList'),
          isIndex: false
        }, {
          path: '/pages/my/choice_motorman_type/choice_motorman_type',
          componentLoader: () => import( /* webpackChunkName: "my_choice_motorman_type_choice_motorman_type" */'./pages/my/choice_motorman_type/choice_motorman_type'),
          isIndex: false
        }, {
          path: '/pages/my/service/service',
          componentLoader: () => import( /* webpackChunkName: "my_service_service" */'./pages/my/service/service'),
          isIndex: false
        }, {
          path: '/pages/my/service/apply_for_after_sales/apply_for_after_sales',
          componentLoader: () => import( /* webpackChunkName: "my_service_apply_for_after_sales_apply_for_after_sales" */'./pages/my/service/apply_for_after_sales/apply_for_after_sales'),
          isIndex: false
        }, {
          path: '/pages/my/apply/apply',
          componentLoader: () => import( /* webpackChunkName: "my_apply_apply" */'./pages/my/apply/apply'),
          isIndex: false
        }, {
          path: '/pages/my/apply_detail/apply_detail',
          componentLoader: () => import( /* webpackChunkName: "my_apply_detail_apply_detail" */'./pages/my/apply_detail/apply_detail'),
          isIndex: false
        }, {
          path: '/pages/my/invite_friends/invite_friends',
          componentLoader: () => import( /* webpackChunkName: "my_invite_friends_invite_friends" */'./pages/my/invite_friends/invite_friends'),
          isIndex: false
        }, {
          path: '/pages/my/invite_friends/activityRules/activityRules',
          componentLoader: () => import( /* webpackChunkName: "my_invite_friends_activityRules_activityRules" */'./pages/my/invite_friends/activityRules/activityRules'),
          isIndex: false
        }, {
          path: '/pages/my/invite_friends/hasActivationList/hasActivationList',
          componentLoader: () => import( /* webpackChunkName: "my_invite_friends_hasActivationList_hasActivationList" */'./pages/my/invite_friends/hasActivationList/hasActivationList'),
          isIndex: false
        }, {
          path: '/pages/login/login',
          componentLoader: () => import( /* webpackChunkName: "login_login" */'./pages/login/login'),
          isIndex: false
        }]} customRoutes={{}} />
                
        </TabbarPanel>
        <Tabbar conf={this.state.__tabs} homePage="pages/index/index" />
        </TabbarContainer>;
  }

  componentWillUnmount() {
    this.componentDidHide();
  }

  constructor(props, context) {
    super(props, context);
    Taro._$app = this;
  }

}

Nerv.render(<App />, document.getElementById('app'));
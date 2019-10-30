import Nerv from "nervjs";
import './my.css?v=2019071107';
import Taro, { showModal as _showModal, showLoading as _showLoading, hideLoading as _hideLoading, removeStorageSync as _removeStorageSync, switchTab as _switchTab } from "@tarojs/taro-h5";
import { View, Text, Image } from '@tarojs/components';

import Common from "../../common";
import Netservice from "../../netservice";

import JSWX from "../../libs/jweixin-1.4.0";

import arrow from '../../images/my/arrow.png';
import discount from '../../images/my/discount.png';
import friend from '../../images/my/friend.png';
import indent from '../../images/my/indent.png';
import icon_apply from '../../images/my/icon_apply.png';

import portrait from '../../images/my/portrait.png';
import defaultPortrait from '../../images/my/default_portrait.png';

export default class My extends Taro.Component {

  config = {
    navigationBarTitleText: '我的'

  };

  state = {
    userId: '', //用户Id
    phone: '', //电话
    petName: '', //昵称
    portraitFid: '' //头像
  };

  componentWillMount() {

    //获取微信JS接口参数
    this.getWeChatJSApiParam();
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {
    let cachephone = localStorage.getItem('phone');
    let userId = localStorage.getItem('userId');
    if (userId) {
      if (userId !== null || userId !== '') {
        Netservice.request({
          url: 'heque-user/user/getUserPortraitAndPetName',
          method: 'POST',
          data: {
            id: userId
          },
          success: res => {
            let petName = res.data.petName;
            let portraitFid = res.data.portraitFid;
            this.setState({
              petName: petName,
              portraitFid: portraitFid
            });
          }
        });
        let initioNumber = cachephone.substr(0, 3);
        let endingNumber = cachephone.substr(7, 4);
        let phone = initioNumber + '****' + endingNumber;
        this.setState({
          userId: userId,
          phone: phone
        });
      }
    }
  }

  componentDidHide() {}

  render() {
    const { userId, phone, petName, portraitFid } = this.state;
    return <View className="My">
        {userId === null || userId === '' ? <View className="myMessage" onClick={this.goLogin}>
            <Image src={defaultPortrait} className="portrait" />
            <View className="namePhone">
              <Text className="name">未登录</Text>
            </View>
          </View> : <View className="myMessage">
            <Image src={portraitFid === '' || portraitFid === null ? portrait : portraitFid} className="portrait" />
            <View className="namePhone">
              <Text className="name">{petName}</Text>
              <Text className="phone">{phone}</Text>
            </View>
          </View>}

        <View className="option" onClick={this.toCouponsList.bind(this)}>
          <Image src={discount} className="icon_img" />
          <View className="flex border_bot">
            <View className="option_name">我的优惠券</View>
            <Image src={arrow} className="arrow_img" />
          </View>
        </View>
        <View className="option" onClick={this.toOrderHistory.bind(this)}>
          <Image src={indent} className="icon_img" />
          <View className="flex border_bot">
            <View className="option_name">我的订单</View>
            <Image src={arrow} className="arrow_img" />
          </View>
        </View>
        <View className="option" onClick={this.toApplyList.bind(this)}>
          <Image src={icon_apply} className="icon_img" />
          <View className="flex">
            <View className="option_name">我的申请</View>
            <Image src={arrow} className="arrow_img" />
          </View>
        </View>

        <View className="option margin_20" onClick={this.inviteFriends.bind(this)}>
          <Image src={friend} className="icon_img" />
          <View className="flex">
            <View className="option_name">邀请好友</View>
            <Image src={arrow} className="arrow_img" />
          </View>
        </View>

        {userId === null || userId === '' ? '' : <View className="out_btn" onClick={this.outLogin.bind(this)}>退出登录</View>}
      </View>;
  }

  //点头像或未登录，去登陆
  goLogin() {
    Taro.navigateTo({
      url: "/pages/login/login?v=" + new Date().getTime()
    });
  }

  //去历史订单
  toOrderHistory(e) {
    let userId = localStorage.getItem('userId');
    console.log(userId);

    if (userId === '' || userId === null) {
      Taro.navigateTo({
        url: "/pages/login/login?v=" + new Date().getTime()
      });
    } else {
      Taro.navigateTo({
        url: "/pages/my/order_history/order_history?v=" + new Date().getTime()
      });
    }
  }

  //优惠券列表
  toCouponsList(e) {
    let userId = localStorage.getItem('userId');
    if (userId == '' || userId == null) {
      Taro.navigateTo({
        url: "/pages/login/login?v=" + new Date().getTime()
      });
    } else {

      Taro.navigateTo({
        url: "/pages/my/couponList/couponList?v=" + new Date().getTime()
      });
    }
  }

  //我的申请
  toApplyList(e) {
    let userId = this.state.userId;
    if (userId) Taro.navigateTo({ url: "/pages/my/apply/apply?v=" + new Date().getTime() });else Taro.navigateTo({ url: "/pages/login/login?v=" + new Date().getTime() });
  }

  //邀请好友
  inviteFriends(e) {
    let userId = localStorage.getItem('userId');
    if (userId) {
      Taro.navigateTo({ url: "/pages/my/invite_friends/invite_friends?v=" + new Date().getTime() });
    } else {
      Taro.navigateTo({ url: "/pages/login/login?v=" + new Date().getTime() });
    }
  }

  //退出登录
  outLogin(e) {
    let that = this;
    _showModal({
      title: '提示',
      content: '是否退出登录',
      success: function (res) {
        if (res.confirm) {
          that.logOut();
        }
      }
    });
  }

  logOut() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    _showLoading({ title: '正在退出…' });
    const token = localStorage.getItem('token');
    Netservice.request({
      url: '/heque-user/user/out_login?userId=' + userId + '&type=1&token=' + token,
      method: 'GET',
      success: res => {
        _hideLoading();

        //清除用户信息
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('phone');

        _removeStorageSync('dishesList');
        _removeStorageSync('orderId');
        _removeStorageSync('listDataState');
        _removeStorageSync('orderState');

        _switchTab({ url: '/pages/index/index' });
      }
    });
  }

  //获取微信JS接口参数 
  getWeChatJSApiParam() {
    Netservice.request({
      url: 'heque-eat/we_chat_public_number/get_signature?url=' + encodeURIComponent(location.href.split('#')[0]),
      method: 'GET',
      success: res => {

        JSWX.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: 'wxed1d300ad50d204f', // 必填，企业号的唯一标识，此处填写企业号corpid
          timestamp: res.data.timestamp, // 必填，生成签名的时间戳（10位）
          nonceStr: res.data.nonceStr, // 必填，生成签名的随机串,注意大小写
          signature: res.data.signature, // 必填，签名，
          jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'] // 必填，需要使用的JS接口列表，
        });

        JSWX.ready(function () {
          //需在用户可能点击分享按钮前就先调用

          //分享给好友
          JSWX.updateAppMessageShareData({
            title: Common.ShareTitle, // 分享标题
            desc: Common.ShareDesc, // 分享描述
            link: Common.ShareWebsite, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: Common.ShareImgUrl, // 分享图标
            // type: '', // 分享类型,music、video或link，不填默认为link
            // dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {}
          });

          //分享到朋友圈
          JSWX.updateTimelineShareData({
            title: Common.ShareTitle, // 分享标题
            link: Common.ShareWebsite, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: Common.ShareImgUrl, // 分享图标
            success: function () {}
          });
        });
      }
    });
  }

}
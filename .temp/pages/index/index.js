import Nerv from "nervjs";

import './index.css?v=201907017111';
import Taro, { getSystemInfo as _getSystemInfo, showLoading as _showLoading, hideLoading as _hideLoading, showModal as _showModal, switchTab as _switchTab } from "@tarojs/taro-h5";
import { View, Text, Image } from '@tarojs/components';

import Netservice from "../../netservice";
import Common from "../../common";

import { setGlobalData, getGlobalData } from '../../utils/global_data';
import { getUrlParam } from '../../utils/utils';

import iconNopay from '../../images/home/icon_nopay.png';
import iconClose from '../../images/home/icon_close.png';

import close_btn from '../../images/home/newEdition/close_btn.png';
import goEarn_btn from '../../images/home/newEdition/goEarn_btn.png';
import new_edition_bg from '../../images/home/newEdition/new_edition_bg.png';

//城市门店列表
import HomePoints from '../home_components/home_points/home_points.js?v=2019072411';
//门店菜品列表   
import PointPackage from '../home_components/point_package/point_package.js?v=2019072411';
//输入金额下单 
import PointBuy from '../home_components/point_buy/point_buy.js?v=2019072411';

//优惠券弹框
import TooltipCoupon from '../tooltipCoupon/tooltipCoupon.js?v=2019072411';

// 引入微信js-sdk
import JSWX from '../../libs/jweixin-1.4.0';

export default class Index extends Taro.Component {

  config = {
    navigationBarTitleText: '点餐'
  };

  state = {
    enterType: 0, //进店方式： 1 公众号进入   2 扫描店铺二维码进入

    pointType: 0, //店铺类型，1：选菜下单，2：输入金额下单

    currentPoint: {}, //当前所选取餐点
    nearestId: 0, //最近的门店id

    hasNoPaidOrder: false, //有尚未支付的订单

    showCoupon: false, //是否显示未领取的优惠券弹框
    couponList: [],

    cityCode: '',
    city: '',
    ordersId: '', //订单id

    showNewEdition: false //新版本弹框

  };

  componentWillMount() {
    const enterType = getGlobalData('enterType') || 0;
    if (enterType != 0) this.setState({ enterType: enterType });

    const cityCode = getGlobalData('cityCode') || '';
    const city = getGlobalData('city') || '';

    if (cityCode.length < 2) {
      //默认用深圳
      setGlobalData('cityCode', '440300');
      setGlobalData('city', '深圳');
      setGlobalData('latitude', 22.53332);
      setGlobalData('longitude', 113.93041);

      localStorage.setItem('cityCode', '440300');
      localStorage.setItem('city', '深圳');
      localStorage.setItem('latitude', 22.53332);
      localStorage.setItem('longitude', 113.93041);
    }

    //使用历史选择
    if (enterType == 1 && cityCode.length > 0) {
      this.setState({ cityCode: cityCode, city: city });
    } else if (enterType == 2) {
      const currentPoint = getGlobalData('currentPoint') || {};
      if (currentPoint.name) {
        this.setState({ currentPoint: currentPoint, pointType: currentPoint.feeType, enterType: 2 });
      } else {
        //扫码直接到店
        const pointId = getUrlParam('pid');
        if (pointId) {
          this.getThePoint(pointId);
        } else {
          this.setState({ enterType: 1 });
          setGlobalData('enterType', 1);
        }
      }
    } else if (enterType == 0) {
      //扫码直接到店
      const pointId = getUrlParam('pid');
      if (pointId) {
        this.getThePoint(pointId);
      } else {
        this.setState({ enterType: 1 });
        setGlobalData('enterType', 1);
      }
    }
    // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxed1d300ad50d204f&redirect_uri=http%3A%2F%2Fwxgzhtest.hequecheguanjia.com%3Fpid%3D36&response_type=code&scope=snsapi_base&state=1&connect_redirect=1#wechat_redirect
    //   let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxed1d300ad50d204f&redirect_uri=' + encodeURIComponent('http://wxgzhtest.hequecheguanjia.com?pid=36') + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect';

    //手动初始化
    setGlobalData('currentCoupon', {});
    setGlobalData('notUseCoupon', false);

    //授权定位
    this.getWeChatJSApiParam();

    //查询进行中的订单和优惠券
    let userId = localStorage.getItem('userId');
    if (userId) {
      this.getGoingOrders();
      this.getCoupons();
    }

    _getSystemInfo({
      success: res => {
        localStorage.setItem('systemInfo', JSON.stringify(res));
      }
    });
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {

    //查询进行中的订单和优惠券
    let userId = localStorage.getItem('userId');
    if (userId) {
      this.getGoingOrders();
      this.getCoupons();
    }

    let showNewEdition = localStorage.getItem('showNewEdition');
    let that = this;
    if (userId !== null) {
      //新版本弹框
      Netservice.request({
        url: 'heque-backend/collect/queryIsPop',
        method: 'GET',
        data: {
          userId: userId
        },
        success: res => {
          if (res.data == 0 && showNewEdition == null) {
            that.setState({
              showNewEdition: true
            });
          } else {
            that.setState({
              showNewEdition: false
            });
          }
        }
      });
    } else {
      if (userId == null && showNewEdition == 1) {
        that.setState({
          showNewEdition: false
        });
      } else {
        that.setState({
          showNewEdition: true
        });
      }
    }

    //切换城市
    const cityChanged = getGlobalData('cityChanged') || false;
    if (cityChanged) {
      setGlobalData('cityChanged', false);

      const cityCode = getGlobalData('cityCode1');
      const city = getGlobalData('city1');
      this.setState({
        enterType: 1,
        cityCode,
        city
      });
      setGlobalData('enterType', 1);
      setGlobalData('cityCode', cityCode);
      setGlobalData('city', city);
    }

    //切换门店
    const pointChanged = getGlobalData('pointChanged') || false;
    if (pointChanged) {
      setGlobalData('pointChanged', false);

      const currentPoint = getGlobalData('currentPoint');
      this.setState({
        enterType: 2,
        currentPoint: currentPoint,
        pointType: currentPoint.feeType
      });
      setGlobalData('enterType', 2);
    }

    //切换优惠券
    const couponChanged = getGlobalData('couponChanged') || false;
    if (couponChanged) {
      setGlobalData('couponChanged', false);

      const currentCoupon = getGlobalData('currentCoupon') || {};
      this.setState({ currentCoupon: currentCoupon });
    }
  }

  componentDidHide() {}

  //用ID直接获取门店信息
  getThePoint(pId) {
    _showLoading({ title: '努力加载中…' });
    let that = this;
    const latitude = getGlobalData('latitude') || 0;
    const longitude = getGlobalData('longitude') || 0;

    Netservice.request({
      url: 'heque-eat/eat/queryDetailByStoreId',
      method: 'GET',
      data: {
        storeId: pId,
        longitude: longitude,
        latitude: latitude
      },
      success: function (res) {
        _hideLoading();

        if (res.code == Common.NetCode_NoError) {
          let point = res.data;

          setGlobalData('currentPoint', point);
          that.setState({
            nearestId: point.id,
            enterType: 2,
            currentPoint: point,
            pointType: point.feeType
          });
          setGlobalData('enterType', 2);
        } else {
          that.setState({ enterType: 1 });
          setGlobalData('enterType', 1);

          //授权定位
          that.getWeChatJSApiParam();
        }
      },
      error: function (err) {
        _hideLoading();

        that.setState({ enterType: 1 });
        setGlobalData('enterType', 1);
        //授权定位
        that.getWeChatJSApiParam();
      }
    });
  }

  //获取未取餐订单列表
  getGoingOrders() {
    let userId = localStorage.getItem('userId');
    Netservice.request({
      url: 'heque-eat/eat/no_meal_order_info?userId=' + userId,
      method: 'GET',
      success: res => {
        let orders = res.data;

        let hasNoPaidOrder = false;
        orders.map(item => {
          //hasNoPaidOrder == true, 有未支付的订单
          if (item.state === 1 || item.state === 2) hasNoPaidOrder = true;
          this.setState({
            ordersId: item.id
          });
        });

        this.setState({ hasNoPaidOrder });
      }
    });
  }

  //获取未领取的优惠券
  getCoupons() {
    let userId = localStorage.getItem('userId');
    Netservice.request({
      url: 'heque-coupon/discount_coupon/get_not_read?userId=' + userId,
      method: 'GET',
      success: res => {
        let results = res.data;
        let coupons = results.filter(function (ele) {
          return ele.faceValue > 0;
        });

        this.setState({
          showCoupon: coupons.length > 0,
          couponList: coupons
        });
      }
    });
  }

  //获取微信JS接口参数 
  getWeChatJSApiParam() {

    let that = this;
    Netservice.request({
      url: 'heque-eat/we_chat_public_number/get_signature?url=' + encodeURIComponent(location.href.split('#')[0]),
      method: 'GET',
      success: res => {
        JSWX.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: Common.AppId, // 必填，企业号的唯一标识，此处填写企业号corpid
          timestamp: res.data.timestamp, // 必填，生成签名的时间戳（10位）
          nonceStr: res.data.nonceStr, // 必填，生成签名的随机串,注意大小写
          signature: res.data.signature, // 必填，签名，
          jsApiList: ['getLocation', 'updateAppMessageShareData', 'updateTimelineShareData', 'chooseWXPay'] // 必填，需要使用的JS接口列表，
        });

        JSWX.ready(function () {
          JSWX.error(function (err) {
            console.log("config信息验证失败,err=" + JSON.stringify(err));
            that.locationFailed();
          });

          JSWX.getLocation({
            type: 'gcj02', //火星坐标：中国国内使用的被强制加密后的坐标体系，高德坐标就属于该种坐标体系。
            success: function (res1) {

              localStorage.setItem('latitude', res1.latitude);
              localStorage.setItem('longitude', res1.longitude);
              setGlobalData('latitude', res1.latitude);
              setGlobalData('longitude', res1.longitude);

              Netservice.request({
                url: 'heque-eat/eat/get_city_code_and_city?latitude=' + res1.latitude + '&longitude=' + res1.longitude,
                method: 'GET',
                success: res2 => {

                  let cityCode1 = res2.data.cityCode || '440300';
                  let city1 = res2.data.city || '深圳市';
                  setGlobalData('cityCode', cityCode1);
                  setGlobalData('city', city1);
                  setGlobalData('locationCity', city1);

                  let { enterType, cityCode } = that.state;
                  if (enterType == 1 && cityCode.length < 2 || enterType == 0) that.setState({ cityCode: cityCode1, city: city1 });
                },
                error: function (err) {
                  console.log('获取城市失败');
                  that.locationFailed();
                }
              });
            },
            cancel: function (res3) {
              console.log('用户拒绝授权获取位置');
              that.locationFailed();
            },
            error: function (res4) {
              console.log('定位出错了');
              that.locationFailed();
            },
            fail: function (res5) {
              console.log('定位失败了');
              that.locationFailed();
            }
          });

          //分享给好友
          JSWX.updateAppMessageShareData({
            title: Common.ShareTitle, // 分享标题
            desc: Common.ShareDesc, // 分享描述
            link: Common.ShareWebsite, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: Common.ShareImgUrl, // 分享图标 
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

  locationFailed() {

    let that = this;

    const enterType = getGlobalData('enterType') || 0;
    const cityCode = getGlobalData('cityCode') || '';
    const currentPoint = getGlobalData('currentPoint') || {};

    if (enterType == 0 || enterType == 1 && cityCode.length < 2 || enterType == 2 && !currentPoint.name) {
      _showModal({
        title: '请选择城市',
        content: '获取定位失败，请手动选择城市',
        confirmText: '去选择',
        showCancel: false,
        success(res) {
          if (res.confirm) that.goSelectCity();
        }
      });
    }
  }

  goSelectCity() {
    Taro.navigateTo({ url: "/pages/points/citys/citys?v=" + new Date().getTime() });
  }

  render() {
    let { enterType, pointType, currentPoint, hasNoPaidOrder, showCoupon, couponList, currentCoupon, cityCode, city, showNewEdition } = this.state;
    //有没支付订单
    const noPayView = <View className="nopay-view">
      <View className="npv-content">
        <Image className="npvc_img" mode="aspectFill" src={iconNopay} style="pointer-events: none" />
        <Text className="npvc_info">当前存在未支付订单</Text>
        <Text className="npvc_todo">请先完成支付</Text>
        <Text className="npvc_gopay" onClick={this.goToPay.bind(this)}>去支付</Text>
      </View>
      <Image className="npvc_close" mode="aspectFill" src={iconClose} onClick={this.closeNoPayView.bind(this)} />
    </View>;

    //新版本弹框
    const newEdition = <View className="newEdition">
      <View className="newEdition_content">
        <Image src={new_edition_bg} className="newEdition_conetent_bg" style="pointer-events: none" />
        <View className="newEdition_goEarn_btn_wrap" onClick={this.goEarnBtn.bind(this)}>
          <Image src={goEarn_btn} className="newEdition_goEarn_btn_img" style="pointer-events: none" />
        </View>
        <View className="newEdition_close_btn_wrap" onClick={this.closeBtn.bind(this)}>
          <Image src={close_btn} className="newEdition_close_btn_img" style="pointer-events: none" />
        </View>
      </View>

    </View>;

    {
      showNewEdition && newEdition;
    }
    return <View className="container-index">

        {enterType == 1 && cityCode.length > 0 && <HomePoints cityCode={cityCode} city={city} />}

        {enterType == 2 && <View className="index_component_wrap">
          {pointType == 1 && currentPoint.name && <PointPackage className="PointPackage" currentPoint={currentPoint} />}
          {pointType == 2 && currentPoint.name && <PointBuy className="PointBuy" currentPoint={currentPoint} currentCoupon={currentCoupon} />}
        </View>}

        {hasNoPaidOrder && !showNewEdition && noPayView}

        {showCoupon && !showNewEdition && <TooltipCoupon couponsData={couponList} afterClose={0} onCloseCouponView={this.closeCouponView.bind(this)} />}

      </View>;
  }

  closeNoPayView(e) {
    e.stopPropagation();
    this.setState({ hasNoPaidOrder: false });
  }

  closeCouponView(e) {
    this.setState({
      showCoupon: false
    });
  }

  goPackageBuy(item, e) {
    e.stopPropagation();

    let price = item.specialOffer || item.originalPrice;
    let priceType = price === item.specialOffer ? 2 : 1;

    let dishInfo = encodeURIComponent(JSON.stringify({ dishUrl: item.dishesUrl, dishName: item.dishName, dishPricee: price, priceType: priceType, dishId: item.dishId, eatEverydayDishesDishesId: item.eatEverydayDishesDishesId }));
    Taro.navigateTo({ url: '/pages/booking/booking?dishInfo=' + dishInfo + '&v=' + new Date().getTime() });
  }

  goToPay(e) {
    e.stopPropagation();
    let orderId = this.state.ordersId;
    Taro.navigateTo({ url: '/pages/my/order_history/the_order_details/the_order_details?orderId=' + orderId + '&v=' + new Date().getTime() });
  }

  goToPoints(e) {
    e.stopPropagation();

    // Taro.navigateTo({ url: '/pages/points/points' + '?v=' + new Date().getTime() })
  }

  //新版本弹框  去赚钱页
  goEarnBtn(e) {
    e.stopPropagation();

    this.setState({
      showNewEdition: false
    });
    localStorage.setItem('showNewEdition', 1);

    _switchTab({
      url: '/pages/wish/wish'
    });
  }

  //新版本弹框  关闭按钮
  closeBtn(e) {
    e.stopPropagation();
    this.setState({
      showNewEdition: false
    });
    localStorage.setItem('showNewEdition', 1);
  }

}
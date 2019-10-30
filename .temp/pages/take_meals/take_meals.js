import Nerv from "nervjs";
import './take_meals.css?v=20190717110';
import Taro, { showLoading as _showLoading, hideLoading as _hideLoading, switchTab as _switchTab, makePhoneCall as _makePhoneCall, showToast as _showToast, showModal as _showModal } from "@tarojs/taro-h5";
import { View, Text, Swiper, SwiperItem, Image, ScrollView } from '@tarojs/components';

import Netservice from "../../netservice";

import Common from "../../common";

import { getGlobalData, setGlobalData } from '../../utils/global_data';
import { calculateDistance } from '../../utils/utils';

import iconPhone from '../../images/common/icon_phone_point.png';
import navigatImg from "../../images/common/navigat_img.png";
import arrowRight from "../../images/common/arrow_right.png";
import wepayIcon from "../../images/common/wepay_icon.png";

import noMeal from "../../images/take/no_meal.png";
import spacing from "../../images/take/divider_line.png";
import btnLeft from "../../images/take/btn_left.png";
import btnRight from "../../images/take/btn_right.png";
import iconSelect from "../../images/take/icon_select.png";

import Prize from '../prize/prize.js?v=20190717110';
import NoPrize from '../noprize/noprize.js?v=20190717110';
import TooltipCoupon from '../tooltipCoupon/tooltipCoupon.js?v=20190626110';

// 引入微信js-sdk
import JSWX from '../../libs/jweixin-1.4.0';

export default class TakeMeals extends Taro.Component {

  config = {
    navigationBarTitleText: '取餐'
  };

  constructor() {
    super();

    this.canPayClick = true; //支付按钮防止连续点击 
  }

  state = {
    meals: [], //待取餐订单列表
    orderIndex: 0, //当前所在订单index
    couponIndex: 0, //当前使用优惠券的index

    //支付后 红包/优惠券
    couponList: [],
    zeroCouponIds: [], //零元优惠券，用来置为已读
    showPrize: false, //是否显示抽奖/开奖弹框
    showCoupon: false, //是否显示优惠券弹框
    showNoPrize: false, //是否显示没奖弹框
    tapThePrize: false //是否点击抽奖/开奖弹框
  };

  componentWillMount() {

    this.getWeChatJSApiParam();

    //手动初始化
    setGlobalData('currentCoupon', {});
    setGlobalData('notUseCoupon', false);
    this.setState({
      meals: [],
      orderIndex: 0,
      couponIndex: 0
    });
  }

  componentDidMount() {}

  componentDidShow() {

    this.getMeals();

    const couponChanged = getGlobalData('couponChanged') || false;
    if (couponChanged) {
      setGlobalData('couponChanged', false);

      let { orderIndex } = this.state;
      this.setState({ couponIndex: orderIndex });
    }
  }

  componentDidHide() {}

  //获取未取餐订单列表
  getMeals() {
    let userId = localStorage.getItem('userId');
    if (!userId) return;

    let that = this;
    _showLoading({ title: '努力加载中…' });
    Netservice.request({
      url: 'heque-eat/eat/no_meal_order_info?userId=' + userId,
      method: 'GET',
      success: res => {
        _hideLoading();

        if (res.code !== Common.NetCode_NoError) {
          that.setState({ meals: [] });
          return;
        }

        let meals = res.data;

        const latitude = getGlobalData('latitude') || 0;
        const longitude = getGlobalData('longitude') || 0;

        // 修改时间格式
        for (let meal of meals) {
          let { foodTime1, foodTime2, foodTime3, foodTime4 } = meal;
          let timeArray = [foodTime1, foodTime2, foodTime3, foodTime4];
          let times = [];
          for (let time of timeArray) {
            if (time && time.length > 5) {
              let aTime = time.slice(0, 5) + '-' + time.slice(11, 16);
              times.push(aTime);
            }
          }
          meal.times = times;

          meal.distance = calculateDistance({ latitude: meal.latitude, longitude: meal.longitude }, { latitude: latitude, longitude: longitude });
        }

        let { orderIndex } = that.state,
            length;
        meals.length ? length = meals.length - 1 : length = 0;
        if (orderIndex > length) {
          that.setState({
            meals,
            orderIndex: length,
            couponIndex: length
          });
        } else {
          that.setState({
            meals
          });
        }

        // 没选优惠券的自动选一个
        const notUseCoupon = getGlobalData('notUseCoupon') || false;
        if (!notUseCoupon) {
          const currentCoupon = getGlobalData('currentCoupon') || {};
          if (!currentCoupon.faceValue) {
            for (var i = 0; i < meals.length; i++) {
              const meal = meals[i];

              // 未支付订单
              if (meal.state === 1 || meal.state === 2) {
                that.getTheCoupon(meal.id, i);
                break;
              }
            }
          }
        }

        setTimeout(that.getCoupons(), 2000);
      },
      fail: function (error) {
        _hideLoading();
        this.setState({ meals: [] });

        setTimeout(that.getCoupons(), 2000);
      }
    });
  }

  //查找最大可用优惠券
  getTheCoupon(orderId, orderIndex) {
    let that = this;
    Netservice.request({
      url: 'heque-coupon/discount_coupon/queryIsUseCoupon',
      method: 'GET',
      data: { orderId: orderId },
      success: function (res) {
        let coupons = res.data;
        var okCoupons = coupons.filter(function (item) {
          return item.type == 2;
        });

        if (okCoupons.length > 0) {
          okCoupons.sort(function (item1, item2) {
            return item2.faceValue - item1.faceValue;
          });

          const targetCoupon = okCoupons[0];
          setGlobalData('currentCoupon', targetCoupon);

          that.setState({ couponIndex: orderIndex });
        }
      },
      error: function (err) {}
    });
  }

  render() {

    let that = this;
    let { meals, orderIndex, couponIndex, couponList, showPrize, showCoupon, showNoPrize, tapThePrize } = this.state;

    const currentCoupon = getGlobalData('currentCoupon') || {};
    let cValue = currentCoupon.faceValue ? currentCoupon.faceValue : 0;
    let couponStr = cValue > 0 ? '-￥' + cValue : '请选择优惠券';

    let mealList = meals.map(function (item, index) {

      let totalStr = couponIndex == index ? new Number(item.paymentPrice - cValue >= 0 ? item.paymentPrice - cValue : 0).toFixed(2) : new Number(item.paymentPrice).toFixed(2);

      let mealsInfo = item.list.map(function (meal) {
        return <View className="meal-info" taroKey={meal.id}>
          <Text className="meal-name">{meal.dishesName}</Text>
          <Text className="meal-num">x {meal.number}</Text>
          <Text className="meal-num">¥ {meal.paymentPrice}</Text>
        </View>;
      });

      return <SwiperItem taroKey={item.id}>
        <ScrollView className="meals-item" scrollY>

          {/*待支付*/}
          {(item.state === 1 || item.state === 2) && <View className="status-view">
            <Text className="status-title">待支付</Text>
            <View className="status-content">
              <Text>30分钟内未支付成功，订单将自动</Text>
              <Text className="svc-btn" onClick={that.toCancle.bind(that)}>取消</Text>
            </View>}
          </View>}

          {/*取餐码*/}
          {(item.state === 3 || item.state === 6 || item.state === 8 || item.state === 9) && <View className="status-view">
            <Text className="code-title">取餐码</Text>
            <Text className="code-code">{item.takeMealCode}</Text>
          </View>}

          <Image src={spacing} className="space-img" style="pointer-events: none" />

          {/*取餐点*/}
          <View className="point-take">

            <View className="pt-first">
              <Text className="pt-name">{item.storeName}</Text>
              <View className="pt-navigator">
                <View onClick={that.goLocation.bind(that)}>
                  <Image className="ptn-navigat" src={navigatImg} style="pointer-events: none" />
                </View>
                <View onClick={that.contactPoint.bind(that)}>
                  <Image className="ptn_phone" src={iconPhone} style="pointer-events: none" />
                </View>
              </View>
            </View>

            <View className="pti-supply">
              {item.times.length == 1 && <Text className="supply-time">供餐时间 {item.times[0]}</Text>}
              {item.times.length == 2 && <Text className="supply-time">供餐时间 {item.times[0]} / {item.times[1]}</Text>}
              {item.times.length >= 3 && <View className="ptis-ver">
                <Text className="supply-time">供餐时间</Text>
                {item.times.length == 3 && <Text className="supply-time"> {item.times[0]} / {item.times[1]} / {item.times[2]} </Text>}
                {item.times.length == 4 && <Text className="supply-time"> {item.times[0]} / {item.times[1]} / {item.times[2]} / {item.times[3]}</Text>}
              </View>}

              <Text className="supply-addr" space>距您{item.distance} | {item.storeAddress}</Text>
            </View>

          </View>

          <Image src={spacing} className="space-img" style="pointer-events: none" />

          {/*餐品信息（列表）*/}
          {mealsInfo}

          {/*优惠券信息  */}
          {(item.state === 1 || item.state === 2) && <View className="take-coupon">
            <Text className="take-coupon-title">优惠券</Text>
            <View className="slec-coupon" onClick={that.selectCoupon.bind(that)}>
              <Text className="coupon-name">{couponIndex == index ? couponStr : '请选择优惠券'}</Text>
              <Image src={arrowRight} className="arrow-right" style="pointer-events: none" />
            </View>
          </View>}
          {item.state === 3 && item.discountPrice > 0 && <View className="take-coupon">
            <Text className="take-coupon-title">优惠券</Text>
            <Text className="coupon-name">-￥{item.discountPrice}</Text>
          </View>}


          <View className="total-view">
            <Text>合计</Text>
            <View className="price-icon">¥<Text className="price-total">{totalStr}</Text></View>
          </View>

          <Image src={spacing} className="space-img" style="pointer-events: none" />

          {/*支付*/}
          {(item.state === 1 || item.state === 2) && <View className="pay">
            <View className="pay-channel">
              <View className="channel">
                <Image src={wepayIcon} className="channel-icon" style="pointer-events: none" />
                <View className="channel-info">
                  <Text className="channel-name">微信支付</Text>
                  <Text className="channel-desc">亿万用户的选择，更快更安全</Text>
                </View>
              </View>
              <Image src={iconSelect} className="sleced-btn" style="pointer-events: none" />
            </View>

            <Image src={spacing} className="space-img" style="pointer-events: none" />
          </View>}

          {/*订单信息（判断） */}
          <View className="order-info-list" style={item.state === 1 || item.state === 2 ? 'margin-bottom: 60px;' : 'margin-bottom: 10px;'}>
            <Text className="oil-text">下单时间：{item.createTime} </Text>
            <Text className="oil-text">订单编号：{item.orderNo} </Text>
          </View>
        </ScrollView>

        {/*底部固定的按钮  订单未支付 */}
        {(item.state === 1 || item.state === 2) && <View className="bottom-btn">
          <View className="pay-btn" onClick={that.checkPay.bind(that)}>去支付</View>
        </View>}

      </SwiperItem>;
    });

    {/* 左右滑动按钮 */}
    let leftBtn = <View className="pages-left-btn" onClick={that.goPrevious.bind(that)}>
      <Image src={btnLeft} className="pb-left" style="pointer-events: none" />
    </View>;

    let rightBtn = <View className="pages-right-btn" onClick={this.goNext.bind(this)}>
      <Image src={btnRight} className="pb-left" style="pointer-events: none" />
    </View>;

    let mealSwiper = <Swiper className="meals-swiper" indicatorDots indicatorColor={'rgb(114,114,114)'} indicatorActiveColor={'#727272'} onChange={this.swiperChange.bind(this)} current={orderIndex}>
      {mealList}
    </Swiper>;

    {/* 默认页（无订单） */}
    const defaultPage = <View className="default-page">
      <Image src={noMeal} className="no-meal" style="pointer-events: none" />
      <Text className="order-btn" onClick={this.goIndex}>去点餐</Text>
      <View className="go-history-order" onClick={this.goHistoryOrder}>
        <Text className="history-order-text">历史订单</Text>
        <Image src={arrowRight} className="arrow-right" style="pointer-events: none" />
      </View>
    </View>;

    return <View className="container-take">
        {meals[0] ? mealSwiper : defaultPage}

        {orderIndex > 0 && leftBtn}
        {orderIndex < meals.length - 1 && rightBtn}

        {showPrize && <Prize onTapThePrize={this.tapThePrize.bind(this)} />}
        {showCoupon && tapThePrize && <TooltipCoupon couponsData={couponList} notScroll={0} afterClose={0} />}
        {showNoPrize && tapThePrize && <NoPrize onTapNoPrize={this.closeNoPrize.bind(this)} onTapClose={this.closeNoPrize.bind(this)} />}

      </View>;
  }

  // 滑块改变
  swiperChange(e) {
    let orderIndex = e.detail.current;
    this.setState({ orderIndex });
  }

  // 返回首页点餐
  goIndex() {
    _switchTab({ url: "/pages/index/index?v=" + new Date().getTime() });
  }

  //历史订单
  goHistoryOrder() {
    let userId = localStorage.getItem('userId');
    if (userId) Taro.navigateTo({ url: "/pages/my/order_history/order_history?v=" + new Date().getTime() });else Taro.navigateTo({ url: "/pages/login/login?v=" + new Date().getTime() });
  }

  //导航去门店
  goLocation() {
    let { meals, orderIndex } = this.state;
    let order = meals[orderIndex];
    JSWX.openLocation({
      latitude: order.latitude,
      longitude: order.longitude,
      name: order.storeName,
      address: order.storeAddress
    });
  }

  //电话联系门店
  contactPoint(e) {
    e.stopPropagation();

    let { meals, orderIndex } = this.state;
    let order = meals[orderIndex];
    _makePhoneCall({ phoneNumber: order.storePhoneNumber + '' });
  }

  selectCoupon() {
    let { meals, orderIndex } = this.state;
    let order = meals[orderIndex];
    Taro.navigateTo({ url: '/pages/take_meals/select_coupon/select_coupon?orderId=' + order.id + '&v=' + new Date().getTime() });
  }

  //左右滑动按钮
  goPrevious(e) {
    e.stopPropagation();

    let { orderIndex } = this.state;
    if (orderIndex > 0) orderIndex--;
    this.setState({ orderIndex });
  }

  goNext(e) {
    e.stopPropagation();

    let { meals, orderIndex } = this.state;
    if (orderIndex < meals.length - 1) orderIndex++;
    this.setState({ orderIndex });
  }

  //获取微信JS接口参数 
  getWeChatJSApiParam() {
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
          jsApiList: ['chooseWXPay', 'openLocation', 'updateAppMessageShareData', 'updateTimelineShareData'] // 必填，需要使用的JS接口列表，
        });

        JSWX.ready(function () {
          JSWX.error(function (err) {
            console.log("config信息验证失败,err=" + JSON.stringify(err));
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

  //查订单支付金额
  checkPay() {
    if (!this.canPayClick) return;

    this.canPayClick = false;
    setTimeout(() => {
      this.canPayClick = true;
    }, 1500);

    _showLoading({ title: '努力加载中…' });

    let { meals, orderIndex } = this.state;
    let order = meals[orderIndex];

    let userCardMedalId = {};
    const currentCoupon = getGlobalData('currentCoupon') || {};
    const couponId = currentCoupon.id;

    if (couponId) {
      userCardMedalId = { userCardMedalId: couponId };
    }

    let that = this;

    //查订单支付金额
    Netservice.request({
      url: 'heque-coupon/discount_coupon/query_real_pay_price',
      method: 'GET',
      data: {
        ...userCardMedalId,
        orderId: order.id
      },
      success: function (res) {

        _hideLoading();

        if (res.code !== Common.NetCode_NoError) {
          _showToast({ title: res.message, icon: 'none', duration: 2000 });
          return;
        }

        let totalPrice = res.data.totalPrice;
        if (parseInt(parseFloat(totalPrice) * 100) > parseInt(0)) that.goWechatPay(totalPrice);else that.zeroPay(totalPrice);
      },
      error: function (err) {
        _hideLoading();
        _showToast({ title: '查询支付金额失败', icon: 'none', duration: 2000 });
      }
    });
  }
  //微信支付
  goWechatPay(price) {
    _showLoading({ title: '努力加载中…' });

    let { meals, orderIndex } = this.state;
    let order = meals[orderIndex];
    const openId = localStorage.getItem('openId');

    let userCardMedalId = {};
    const currentCoupon = getGlobalData('currentCoupon') || {};
    const couponId = currentCoupon.id;
    if (couponId) {
      userCardMedalId = { userCardMedalId: couponId };
    }

    let that = this;
    Netservice.request({
      url: 'heque-eat/wechat_pay/hsf_user_payment',
      method: 'POST',
      data: {
        ...userCardMedalId,
        id: order.id,
        paymentPrice: price,
        channel: 'h5',
        openId: openId
      },
      success: function (res) {
        _hideLoading();

        if (res.code !== Common.NetCode_NoError) {
          _showToast({ title: res.message, icon: 'none', duration: 2000 });
          return;
        }

        let params = res.data;

        JSWX.chooseWXPay({
          timestamp: params.timeStamp,
          nonceStr: params.nonceStr,
          package: params.package,
          signType: params.signType,
          paySign: params.sign,
          success: function (res1) {
            // 支付成功后的回调函数
            setGlobalData('currentCoupon', {});

            that.getMeals();
          },
          cancel: function (res2) {
            _showToast({ title: '支付取消', icon: 'none', duration: 2000 });
          },
          fail: function (res3) {
            console.log('-->chooseWXPay, fail:' + JSON.stringify(res3));
            _showToast({ title: '支付失败', icon: 'none', duration: 2000 });
          }
        });
      },
      error: function (err) {
        _hideLoading();
        _showToast({ title: '支付失败', icon: 'none', duration: 2000 });
      }
    });
  }

  //零元支付
  zeroPay(price) {

    _showLoading({ title: '努力加载中…' });

    let { meals, orderIndex } = this.state;
    let order = meals[orderIndex];

    let userCardMedalId = {};
    const currentCoupon = getGlobalData('currentCoupon') || {};
    const couponId = currentCoupon.id;
    if (couponId) {
      userCardMedalId = { userCardMedalId: couponId };
    }

    let that = this;
    Netservice.request({
      url: 'heque-eat/wechat_pay/zero_element_pay',
      method: 'POST',
      data: {
        ...userCardMedalId,
        id: order.id,
        paymentPrice: price,
        channel: 'h5'
      },
      success: function (res) {
        _hideLoading();

        if (res.code !== Common.NetCode_NoError) {
          _showToast({ title: res.message, icon: 'none', duration: 2000 });
          return;
        }

        setGlobalData('currentCoupon', {});

        that.getMeals();
      },
      error: function (err) {
        _hideLoading();
        _showToast({ title: '支付失败', icon: 'none', duration: 2000 });
      }
    });
  }

  //查询未领取的优惠券
  getCoupons() {
    let userId = localStorage.getItem('userId');
    if (!userId) return;

    let that = this;
    Netservice.request({
      url: 'heque-coupon/discount_coupon/get_not_read?userId=' + userId,
      method: 'GET',
      success: res => {
        if (res.code == Common.NetCode_NoError) {
          let coupons = res.data;
          let prizes = coupons.filter(function (ele) {
            return ele.receiveType == 3;
          });

          let prizeValue = 0;
          if (prizes.length > 0) {
            let prize = prizes[0];
            prizeValue = prize.faceValue;
          }

          let zeroCouponIds = [];
          prizes.map((item, index) => {
            // if (item.faceValue <= 0) //零元券 
            zeroCouponIds.push(item.id); //自动领取
          });
          if (zeroCouponIds.length > 0) that.readCoupons(zeroCouponIds);

          that.setState({
            couponList: prizes,
            zeroCouponIds: zeroCouponIds,
            showPrize: prizes.length > 0,
            // showPrize: true,
            showCoupon: prizes.length > 0 && prizeValue > 0, //是否显示优惠券弹框
            showNoPrize: prizes.length > 0 && prizeValue <= 0
          });
        }
      }
    });
  }

  //修改已读优惠券
  readCoupons(ids) {
    let cardIds = ids.join(',');
    Netservice.request({
      url: 'heque-coupon/discount_coupon/user_has_read',
      method: 'GET',
      data: { userCardMedalId: cardIds },
      success: res => {}
    });
  }

  tapThePrize(e) {
    this.setState({ tapThePrize: true });

    setTimeout(() => {
      this.setState({ showPrize: false });
    }, 2200);

    // const { couponList } = this.state;
    // let couponIds = [];
    // couponList.map((item, index) => {
    //   couponIds.push(item.id)
    // })

    // //自动领取
    // if (couponIds.length > 0)
    //   this.readCoupons(couponIds);
  }

  closeNoPrize(e) {
    this.setState({
      showNoPrize: false
    });
  }

  // 取消订单弹窗
  toCancle(e) {
    e.stopPropagation();

    let that = this;
    _showModal({
      content: '确定取消订餐？',
      success(res) {
        if (res.confirm) {
          that.cancleOrder();
        }
      }
    });
  }

  // 取消订单
  cancleOrder() {
    _showLoading({ title: '努力加载中…' });
    const { orderIndex, meals } = this.state;
    const id = meals[orderIndex].id;
    Netservice.request({
      url: 'heque-eat/eat/delete_order?id=' + id,
      method: 'GET',
      success: res => {
        _hideLoading();

        if (res.code == Common.NetCode_NoError) this.getMeals();else _showToast({ title: res.message, icon: 'none', duration: 2000 });
      },
      fail: function (error) {
        _hideLoading();
        _showToast({ title: '取消订单失败', icon: 'none', duration: 2000 });
      }
    });
  }

}
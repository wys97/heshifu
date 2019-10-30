import Nerv from "nervjs";
import Taro, { getSystemInfo as _getSystemInfo, makePhoneCall as _makePhoneCall, showLoading as _showLoading, hideLoading as _hideLoading, showToast as _showToast } from "@tarojs/taro-h5";
import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components';
import { AtInput } from 'taro-ui';

import './point_buy.css';

import banner1 from '../../../images/home/banner1.png';
import banner2 from '../../../images/home/banner2.png';
import banner3 from '../../../images/home/banner3.png';
import banner4 from '../../../images/home/banner4.png';

import arrowRight1 from '../../../images/common/arrow_right.png';
import paymentBtn2 from '../../../images/common/payment_btn2.png';
import closeBtn from '../../../images/common/close_btn.png';
import inRestImg from '../../../images/home/in_rest.png';

import Netservice from "../../../netservice";
import Common from "../../../common";
import { payment, zeroPayment } from "../../../utils/payment";

// 引入微信js-sdk


import { setGlobalData } from "../../../utils/global_data";

// 输入金额买单
export default class PointBuy extends Taro.Component {
  constructor(props) {
    super(props);

    this.canPayClick = true; //支付按钮防止连续点击 
  }

  state = {
    storesDetails: {}, //门店信息

    packageList: [], //套餐、菜品列表

    paymentState: false, //支付状态  input聚焦时为true 显示支付时的样式

    amount: '', //输入金额
    paymentBtnStyle: false, //确定付款按钮样式  false未输入金额前  true输入金额后  

    currentCoupon: {}, //优惠券

    dishId: 0, //默认菜品id

    alterStyle: false, //过渡效果

    inRest: false, //店铺休息状态  true为休息状态

    system: 'iOS', //获取手机系统

    closePaymentState: false //点击关闭按钮
  };

  componentWillMount() {

    if (this.props.currentPoint) {
      //获取门店信息
      let storesDetails = this.props.currentPoint;
      this.setState({ storesDetails });

      //判断是否在休息时间
      if (storesDetails.state) {
        //获取门店菜品
        this.getPointPackage(storesDetails.id);
      } else {
        this.setState({ inRest: true });
      }
    }

    _getSystemInfo({
      success: res => {
        this.setState({ system: res.system });
      }
    });
  }
  //实时监听父组件传过来的值的变化
  componentWillReceiveProps(nextProps) {

    if (nextProps.currentPoint && nextProps.currentPoint.id != this.props.currentPoint.id) {
      let storesDetails = nextProps.currentPoint;

      this.setState({ storesDetails });

      //判断是否在休息时间
      if (storesDetails.state) this.getPointPackage(storesDetails.id);else this.setState({ inRest: true });
    }

    if (nextProps.currentCoupon) {
      let currentCoupon = nextProps.currentCoupon;
      this.setState({
        currentCoupon
      });
    }
  }

  componentDidShow() {
    this.getTheCoupon();
  }

  //查找最大可用优惠券
  getTheCoupon() {

    let userId = localStorage.getItem('userId');
    if (!userId) return;

    let { amount, storesDetails, dishId } = this.state;

    let that = this;
    Netservice.request({
      url: 'heque-coupon/discount_coupon/orderInfoGetCoupon',
      method: 'GET',
      data: {
        userId: userId,
        totalPrice: amount,
        dishId: dishId,
        storeId: storesDetails.id
      },
      success: function (res) {
        let coupons = res.data;
        var okCoupons = coupons.filter(function (item) {
          return item.type == '2';
        });

        if (okCoupons.length > 0) {
          okCoupons.sort(function (item1, item2) {
            return item2.faceValue - item1.faceValue;
          });

          const targetCoupon = okCoupons[0];
          if (targetCoupon.type == '2') {
            setGlobalData('currentCoupon', targetCoupon);
            that.setState({ currentCoupon: targetCoupon });
          }
        } else {
          setGlobalData('currentCoupon', {});
          that.setState({ currentCoupon: {} });
        }
      },
      error: function (err) {}
    });
  }

  // 查询门店菜品
  getPointPackage(stroeId) {

    let that = this;
    Netservice.request({
      url: 'heque-eat/eat/storeEatInfo',
      method: 'POST',
      data: { stroeId: stroeId },
      success: function (res) {
        if (res.code == '300030') {
          that.setState({
            inRest: true
          });
        } else {
          let packageList = res.data;

          const first = packageList[0] || {};
          const dishId = first.dishId || 0;

          that.setState({
            packageList: packageList,
            dishId: dishId,
            inRest: false

          });
        }
      },
      error: function (err) {}
    });
  }

  render() {
    const { storesDetails, paymentState, amount, paymentBtnStyle, currentCoupon, inRest, alterStyle, closePaymentState } = this.state;

    let { foodTime1, foodTime2, foodTime3, foodTime4 } = storesDetails;
    let timeArray = [foodTime1, foodTime2, foodTime3, foodTime4];
    let times = [];
    for (let time of timeArray) {
      if (time && time.length > 5) {
        let aTime = time.slice(0, 5) + '-' + time.slice(11, 16);
        times.push(aTime);
      }
    }
    storesDetails.times = times;

    let cValue = currentCoupon.faceValue ? currentCoupon.faceValue : 0;
    let couponStr = cValue > 0 ? '-￥' + cValue : '请选择优惠券';

    {/* 支付状态*/}
    const affirmPaymentState = <View className={!alterStyle ? 'pt2-order2' : 'pt2-order2_true'}>
            <View className="pt2-order2-closeBtn-wrap">
                <View className="pt2ol-title2">请输入金额</View>
                {closePaymentState && <Image src={closeBtn} className="pt2_closeBtn" onClick={this.shutPaymentState.bind(this)} />}
            </View>
            <View className="pt2o-line2">
                <View className="pt2o-line_rmb2">￥</View>
                <AtInput className="pt2ol-amount2" type="digit" placeholder="请输入金额" border={false} maxLength={6} onFocus={this.onAmountFocus.bind(this)} onBlur={this.onAmountBlur.bind(this)} value={amount} onChange={this.onAmountChange.bind(this)} />
            </View>
            {paymentState && <View className="pt2ol_coupon2" onClick={this.selectCoupon.bind(this)}>
                <Text className="pt2ol_coupon_title2">优惠券</Text>
                <View className="pt2ol_coupon_right_wrap">
                    <Text className={cValue > 0 ? 'pt2ol_coupon_price2' : 'pt2ol_coupon_price3'}>{couponStr}</Text>
                    <Image src={arrowRight1} className="pt2ol-arrow-right2" style="pointer-events: none" />
                </View>
            </View>}
            {paymentState && <View className="pt2ol_price_amount2">
                <Text className="pt2ol_amount_title2">实付 :</Text>
                <Text className="pt2ol_amount_price2">￥{this.formatAmount1(amount - cValue)}</Text>
            </View>}
            {!paymentBtnStyle ? <View className="po2ol_payment_btn">确认付款</View> : <View onClick={this.bookingMeal.bind(this)} className="po2ol_payment_btn2">
                    <Image className="po2ol_payment_btn2_img" src={paymentBtn2} style="pointer-events: none" />
                </View>}
        </View>;

    return <View className="Dierct">
                <View className="pt2-point" onClick={this.goSlecPoint}>
                    <View className="pt2pt_head">
                        <View className="pt2pt_head_title" onClick={this.goToPoints.bind(this)}>
                            <Text>{storesDetails.name}</Text>
                            <Image src={arrowRight1} className="pt2ol-arrow-right" style="pointer-events: none" />
                        </View>
                        <View className="pt2pt_head_distance">距您
                            {storesDetails.number >= 1000 ? <Text className="pt2pt_head_number">
                                    {(storesDetails.number / 1000).toFixed(1)}<Text className="pt2pt_distance_unit"> km</Text>
                                </Text> : <Text className="pt2pt_head_number">{storesDetails.number}<Text className="pt2pt_distance_unit"> m</Text></Text>}
                            <Text className="pt2pt_head_placeholder">|</Text>
                            <Text className="pt2pt_head_adds">{storesDetails.adds}</Text>
                        </View>
                        {storesDetails.suppleTime1 !== undefined ? <View className="pt2pt_head_time">
                                <Text>营业时间：</Text>
                                <Text>{storesDetails.suppleTime1}{storesDetails.suppleTime2}{storesDetails.suppleTime3}{storesDetails.suppleTime4}</Text>
                            </View> : <View className="pt2pt_head_time">
                                <Text>营业时间：</Text>
                                {storesDetails.times.length == 1 && <Text>{storesDetails.times[0]}</Text>}
                                {storesDetails.times.length == 2 && <Text>{storesDetails.times[0]} / {storesDetails.times[1]}</Text>}
                                {storesDetails.times.length == 3 && <Text>{storesDetails.times[0]} / {storesDetails.times[1]} / {storesDetails.times[2]}</Text>}
                                {storesDetails.times.length == 4 && <Text>{storesDetails.times[0]} / {storesDetails.times[1]} / {storesDetails.times[2]} / {storesDetails.times[3]}</Text>}
                            </View>}
                    </View>
                    {/*<View className='pt2ol-phonePoint' onClick={this.contactUs.bind(this)}>
                        <Image src={phonePoint} className='pt2ol-phonePoint-img' style='pointer-events: none' />
                     </View>*/}
                </View>
                <Swiper className="pt2-swiper" circular autoplay interval={3000}>
                    <SwiperItem className="pt2_SwiperItem">
                        <Image className="pt2_swiper_image" src={banner1} onClick={this.goEarn.bind(this)} />
                    </SwiperItem>
                    <SwiperItem className="pt2_SwiperItem">
                        <Image className="pt2_swiper_image" src={banner2} onClick={this.goLend.bind(this)} />
                    </SwiperItem>
                    <SwiperItem className="pt2_SwiperItem">
                        <Image className="pt2_swiper_image" src={banner3} onClick={this.goPartTimeMakeMoney.bind(this)} />
                    </SwiperItem>
                    <SwiperItem className="pt2_SwiperItem">
                        <Image className="pt2_swiper_image" src={banner4} onClick={this.goAssistant.bind(this)} />
                    </SwiperItem>
                </Swiper>
                {!inRest ? <View>
                        {/* <View className='Dierct_tabbar'>
                            <View className='Dierct_tabbar_payment'>买单</View>
                            <View className='Dierct_tabbar_evaluate'>评价</View>
                         </View>*/}
                        {/*支付模块*/}
                        {affirmPaymentState}
                    </View> : <View className="inRest_img_wrap2" onClick={this.goToPoints.bind(this)}>
                        <Image className="inRest_img2" src={inRestImg} style="pointer-events: none" />
                    </View>}

            </View>;
  }

  //去门店列表    
  goToPoints(e) {
    e.stopPropagation();
    Taro.navigateTo({
      url: "/pages/points/points?v=" + new Date().getTime()
    });
  }

  //联系商家
  contactUs(e) {
    e.stopPropagation();
    _makePhoneCall({
      phoneNumber: String(this.state.storesDetails.storePhoneNumber)
    });
  }

  //金额输入框
  onAmountChange(value) {
    this.setState({ amount: this.formatAmount(value) }, () => {
      if (parseFloat(value) > 0) this.getTheCoupon();
    });

    if (value !== '' && value !== null) {
      this.setState({
        paymentBtnStyle: true,
        paymentState: true
      });
    } else {
      this.setState({
        paymentState: false,
        paymentBtnStyle: false,
        currentCoupon: {}
      });
    }

    return this.formatAmount(value);
  }
  //计算金额
  formatAmount(value) {

    if (parseFloat(value) < 0) value = 0;else if (parseFloat(value) > 1000) value = 1000;

    let xiao = value.toString().split(".")[1];
    let xiaoLength = xiao ? xiao.length : 0;
    if (xiaoLength > 2) return parseFloat(parseInt(value * 100) / 100).toFixed(2);else return value;
  }
  //计算总金额
  formatAmount1(value) {
    if (parseFloat(value) < 0) value = 0;else if (parseFloat(value) > 1000) value = 1000;

    let xiao = value.toString().split(".")[1];
    let first = xiao ? xiao.charAt(0) : '';
    let second = xiao ? xiao.charAt(1) : '';
    if (first == '0' && second == '') return parseFloat(value).toFixed(1);

    let xiaoLength = xiao ? xiao.length : 0;
    if (xiaoLength <= 0) return parseFloat(value);else if (xiaoLength == 1) return (Math.round(value * Math.pow(10, 1)) / Math.pow(10, 1)).toFixed(2);else return (Math.round(value * Math.pow(10, 2)) / Math.pow(10, 2)).toFixed(2);
  }

  //键盘兼容样式
  onAmountFocus() {

    this.setState({
      alterStyle: true,
      closePaymentState: true
    });

    let { system } = this.state;
    if (system.startsWith('iOS') || system.startsWith('ios')) {

      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 200);
    }
  }

  //键盘兼容样式    
  onAmountBlur() {}

  //点击关闭按钮
  shutPaymentState(e) {
    e.stopPropagation();
    this.setState({
      alterStyle: false,
      // paymentState: false,
      closePaymentState: false
    });
  }

  //选择优惠券
  selectCoupon() {
    let userId = localStorage.getItem('userId');
    if (userId) {
      let { amount, storesDetails, dishId } = this.state;

      Taro.navigateTo({ url: '/pages/take_meals/select_coupon/select_coupon?userId=' + userId + '&storeId=' + storesDetails.id + '&dishId=' + dishId + '&totalPrice=' + amount + '&v=' + new Date().getTime() });
    } else {
      Taro.navigateTo({ url: "/pages/login/login?v=" + new Date().getTime() });
    }
  }

  //确定支付
  bookingMeal() {

    let userId = localStorage.getItem('userId');
    if (userId) {
      let that = this;

      let { amount, dishId } = this.state;

      if (!parseFloat(amount) || parseFloat(amount) <= 0) return;

      if (!this.canPayClick) return;
      this.canPayClick = false;
      setTimeout(() => {
        this.canPayClick = true;
      }, 2000);

      _showLoading({ title: '努力加载中…' });

      const currentPoint = this.state.storesDetails;
      const cityCode = localStorage.getItem('cityCode');
      const latitude = localStorage.getItem('latitude');
      const longitude = localStorage.getItem('longitude');

      Netservice.request({
        url: 'heque-eat/order_info/input_amount_order_info',
        data: {
          appType: 'h5',
          codeC: cityCode,
          longitude: longitude,
          latitude: latitude,
          dishId: dishId,
          storeId: currentPoint.id,
          totalPrice: amount,
          userId: userId
        },
        success: res => {

          _hideLoading();
          if (res.code !== Common.NetCode_NoError) {
            _showToast({ title: res.message, icon: 'none', duration: 2000 });
            return;
          }

          _showToast({ title: '下单成功', icon: 'success', duration: 2000 });

          that.checkPay(res.data.orderId);
        }
      });
    } else {
      Taro.navigateTo({ url: "/pages/login/login?v=" + new Date().getTime() });
    }
  }

  checkPay(orderId) {

    _showLoading({ title: '努力加载中…' });

    let { currentCoupon } = this.state;
    let userCardMedalId = {};
    const couponId = currentCoupon.id;
    if (couponId) {
      userCardMedalId = { userCardMedalId: couponId };
    }

    let that = this;

    //查订单支付金额
    Netservice.request({
      url: 'heque-coupon/discount_coupon/queryRealPayMoney',
      method: 'GET',
      data: {
        ...userCardMedalId,
        orderId: orderId
      },
      success: function (res) {
        _hideLoading();

        if (res.code !== Common.NetCode_NoError) {
          _showToast({ title: res.message, icon: 'none', duration: 2000 });
          return;
        }

        let totalPrice = res.data.totalPrice;

        if (parseInt(parseFloat(totalPrice) * 100) > parseInt(0)) that.goWechatPay(totalPrice, orderId);else that.zeroPay(totalPrice, orderId);
      },
      error: function (err) {
        _hideLoading();
        _showToast({ title: '查询支付金额失败', icon: 'none', duration: 2000 });
      }
    });
  }
  //微信支付
  goWechatPay(totalPrice, orderId) {
    _showLoading({ title: '努力加载中…' });

    let { currentCoupon } = this.state;
    const openId = localStorage.getItem('openId');

    let userCardMedalId = {};
    const couponId = currentCoupon.id;
    if (couponId) {
      userCardMedalId = { userCardMedalId: couponId };
    }

    payment(userCardMedalId, orderId, totalPrice, openId, () => {

      //支付成功
      setGlobalData('currentCoupon', {});
      this.setState({ currentCoupon: {}, amount: '', paymentState: false, alterStyle: false });
      Taro.navigateTo({ url: '/pages/my/order_history/the_order_details/the_order_details?orderId=' + orderId });
    }, () => {

      //支付取消
      setGlobalData('currentCoupon', {});
      this.setState({ currentCoupon: {}, amount: '', paymentState: false, alterStyle: false });
      _showToast({ title: '支付取消', icon: 'none', duration: 2000 });
      Taro.navigateTo({ url: '/pages/my/order_history/the_order_details/the_order_details?orderId=' + orderId });
    }, () => {

      //支付失败
      setGlobalData('currentCoupon', {});
      this.setState({ currentCoupon: {}, amount: '', paymentState: false, alterStyle: false });
      _showToast({ title: '支付失败', icon: 'none', duration: 2000 });
      Taro.navigateTo({ url: '/pages/my/order_history/the_order_details/the_order_details?orderId=' + orderId });
    });
  }

  //零元支付
  zeroPay(price, orderId) {

    _showLoading({ title: '努力加载中…' });
    let that = this;
    let { currentCoupon } = this.state;

    let userCardMedalId = {};
    const couponId = currentCoupon.id;
    if (couponId) {
      userCardMedalId = { userCardMedalId: couponId };
    }

    that.setState({ currentCoupon: {}, amount: '', paymentState: false, alterStyle: false });

    zeroPayment(userCardMedalId, price, orderId);
  }

  //外快
  goEarn(e) {

    e.stopPropagation();

    let userId = localStorage.getItem('userId');
    if (userId) {
      Taro.navigateTo({ url: "/pages/wish/earn/earn?v=" + new Date().getTime() });
    } else {
      Taro.navigateTo({ url: "/pages/login/login?v=" + new Date().getTime() });
    }
  }

  //周转
  goLend(e) {

    e.stopPropagation();

    let userId = localStorage.getItem('userId');
    if (userId) {
      Taro.navigateTo({ url: "/pages/wish/lend/lend?v=" + new Date().getTime() });
    } else {
      Taro.navigateTo({ url: "/pages/login/login?v=" + new Date().getTime() });
    }
  }

  //当副班
  goPartTimeMakeMoney(e) {
    e.stopPropagation();

    let userId = localStorage.getItem('userId');
    if (userId) {
      Taro.navigateTo({ url: "/pages/wish/car/car?v=" + new Date().getTime() });
    } else {
      Taro.navigateTo({ url: "/pages/login/login?v=" + new Date().getTime() });
    }
  }
  //招副班
  goAssistant(e) {

    let userId = localStorage.getItem('userId');
    if (userId) {
      Taro.navigateTo({ url: "/pages/wish/assistant/assistant?v=" + new Date().getTime() });
    } else {
      Taro.navigateTo({ url: "/pages/login/login?v=" + new Date().getTime() });
    }
  }

}
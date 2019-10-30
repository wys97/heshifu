import Nerv from "nervjs";
import './booking.css?v=201906107';
import Taro, { showLoading as _showLoading, hideLoading as _hideLoading, showToast as _showToast } from "@tarojs/taro-h5";
import { View, Text, Image } from '@tarojs/components';

import Netservice from "../../netservice";
import Common from "../../common";
import { payment, zeroPayment } from "../../utils/payment";

import { getGlobalData, setGlobalData } from '../../utils/global_data';

import subBtn from '../../images/common/sub_btn.png';
import addBtn from '../../images/common/add_btn.png';
import navigatImg from '../../images/common/navigat_img.png';
import arrowRight from "../../images/common/arrow_right.png";
import paymentBtn from "../../images/common/payment_btn.png";

// 引入微信js-sdk
import JSWX from '../../libs/jweixin-1.4.0';

export default class Booking extends Taro.Component {

  config = {
    navigationBarTitleText: '确认点餐'
  };

  constructor() {
    super();

    this.canPayClick = true; //支付按钮防止连续点击 
  }

  state = {
    currentPoint: {}, //当前取餐点信息

    orderInfo: null, //订单信息
    priceTotal: 0, //总金额
    count: 1, //菜品数量
    couponStr: '', //优惠券的金额
    cValue: '', // 用于计算的优惠券的金额
    couponStyle: false, // 优惠券的样式
    currentCoupon: {}, //优惠券信息
    businessHours1: '', //营业时间
    businessHours2: '', //营业时间
    businessHours3: '', //营业时间
    businessHours4: '' //营业时间
  };

  componentWillMount() {

    //手动初始化
    setGlobalData('currentCoupon', {});
    setGlobalData('notUseCoupon', false);

    let { dishInfo } = this.$router.params;
    let orderInfo = JSON.parse(decodeURIComponent(dishInfo));

    const currentPoint = orderInfo.storesDetails;

    let priceTotal = parseFloat(orderInfo.dishPricee);

    this.setState({
      currentPoint,
      orderInfo,
      priceTotal,
      businessHours1: orderInfo.storesDetails.suppleTime1,
      businessHours2: orderInfo.storesDetails.suppleTime2,
      businessHours3: orderInfo.storesDetails.suppleTime3,
      businessHours4: orderInfo.storesDetails.suppleTime4
    });

    //查优惠券
    this.getCouponList(orderInfo, priceTotal);

    this.getWeChatJSApiParam();
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {

    let { dishInfo } = this.$router.params;
    let orderInfo1 = JSON.parse(decodeURIComponent(dishInfo));

    let priceTotal = parseFloat(orderInfo1.dishPricee);

    const couponChanged = getGlobalData('couponChanged') || false;

    if (couponChanged) {

      setGlobalData('couponChanged', false);
      //获取选择的优惠券
      const currentCoupon = getGlobalData('currentCoupon') || {};
      this.setState({ currentCoupon });

      let cValue = currentCoupon.faceValue ? currentCoupon.faceValue : 0;

      let couponStr = cValue > 0 && currentCoupon.type == '2' ? '- ¥' + cValue : '请选择优惠券';

      let orderInfo = this.state.orderInfo;

      if (cValue > 0) {
        this.setState({
          couponStyle: true
        });
      } else {
        this.setState({
          couponStyle: false
        });
      }

      //数量>=1时，显示
      if (this.state.count >= 1 && cValue == 0) {
        //总价 = 数量 * 菜品金额
        let totalValue = Number(this.state.count * orderInfo.dishPricee);

        this.setState({
          priceTotal: totalValue,
          couponStr,
          cValue: cValue
        });
      } else {

        //总价 = 数量 * 菜品金额 - 优惠券  
        let totalValue = Number(this.state.count * orderInfo.dishPricee - cValue);

        if (totalValue > 0) {
          this.setState({
            priceTotal: totalValue,
            couponStr
          });
        } else {
          this.setState({
            priceTotal: 0,
            couponStr
          });
        }
      }
    } else {
      let notUseCoupon = getGlobalData('notUseCoupon');

      if (!notUseCoupon) {
        //查优惠券
        this.getCouponList(orderInfo1, priceTotal);
      }
    }
  }

  componentDidHide() {}

  //计算金额的函数
  calculate(cValue) {
    //菜品的价格
    let dishPricee = this.state.orderInfo.dishPricee;
    //总价格 = 菜品的价格 - 优惠券的金额
    let Pricee = dishPricee - cValue;
    //总价格 < 0 时
    if (Pricee < 0) {

      this.setState({
        priceTotal: 0
      });
    } else {

      this.setState({
        priceTotal: Pricee
      });
    }
  }

  render() {
    let { currentPoint, orderInfo, count, priceTotal, couponStr, couponStyle, businessHours1, businessHours2, businessHours3, businessHours4 } = this.state;

    return <View className="container-book">

      {/*取餐点信息*/}
      <View className="book-point">

        <View className="bp-info">
          <View className="bpi_name">
            <Text className="bpin-name">{currentPoint.name}</Text>
          </View>
          <View className="bpi-address">距您
          {currentPoint.number >= 1000 ? <Text className="bpi-address-distance">
                {(currentPoint.number / 1000).toFixed(1)} <Text className="booking_unit">km</Text>
              </Text> : <Text className="bpi-address-distance">{currentPoint.number}<Text className="booking_unit">m</Text>
              </Text>}
            <Text className="margin_10">|</Text>  {currentPoint.adds}
          </View>
          {businessHours1 !== undefined ? <View className="bpi_businessHours">
              <Text className="margin-r-18">营业时间 : </Text>
              <Text>{businessHours1} {businessHours2} {businessHours3} {businessHours4}</Text>
            </View> : <View className="bpi_businessHours">
              <Text>营业时间：</Text>
              {currentPoint.times.length == 1 && <Text>{currentPoint.times[0]}</Text>}
              {currentPoint.times.length == 2 && <Text>{currentPoint.times[0]} / {currentPoint.times[1]}</Text>}
              {currentPoint.times.length == 3 && <Text>{currentPoint.times[0]} / {currentPoint.times[1]} / {currentPoint.times[2]}</Text>}
              {currentPoint.times.length == 4 && <Text>{currentPoint.times[0]} / {currentPoint.times[1]} / {currentPoint.times[2]} / {currentPoint.times[3]}</Text>}
            </View>}

        </View>

        <View className="bp-navigator" onClick={this.goLocation.bind(this)}>
          <Image className="bpn-img" src={navigatImg} style="pointer-events: none"></Image>

        </View>

      </View>


      {/*餐品信息*/}
      <View className="order-detail">

        <View className="order-meal">
          <Image className="order-icon" src={orderInfo.dishUrl} mode="aspectFill" />
          <View className="order-info">
            <View className="order-title">{orderInfo.dishName}</View>
            <View className="order-subheading">{orderInfo.dishesRemake}</View>
            <View className="price-count">
              <Text className="order-price">¥{orderInfo.dishPricee}</Text>
              <View className="order-count">
                <View onClick={this.subNum.bind(this)}>
                  <Image src={subBtn} className="count-btn" style="pointer-events: none" />
                </View>
                <Text className="count">{count}</Text>
                <View onClick={this.addNum.bind(this)}>
                  <Image src={addBtn} className="count-addBtn" style="pointer-events: none" />
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className="meal-line"></View>

        <View className="order_meal_coupons" onClick={this.toCouponsList.bind(this)}>
          <View className="order_meal_coupons_title">优惠券</View>
          <View className="order_meal_coupons_right">
            <Text className={couponStyle ? 'order_meal_coupons_price2' : 'order_meal_coupons_price'}>{couponStr}</Text>
            <Image className="order_meal_coupons_img" src={arrowRight} style="pointer-events: none" />
          </View>
        </View>

        <View className="meal-line"></View>
        <View className="fee-view">
          <View className="fee-content">
            <Text className="fc-total">合计</Text>
            <View className="fc-flag">¥<Text className="fc-num">{priceTotal.toFixed(2)}</Text></View>
          </View>
        </View>

      </View>

      {/*底部按钮*/}
      <View className="btn-view" onClick={this.bookingMeals.bind(this)}>
        <Image src={paymentBtn} className="booking-btn" style="pointer-events: none" />
      </View>

    </View>;
  }

  goBack() {
    Taro.navigateBack();
  }

  // 减少数量
  subNum() {
    let { count, orderInfo } = this.state;

    if (count > 1) {
      count--;
      //总价 = 金额 * 数量
      let priceTotal = Number(parseFloat(orderInfo.dishPricee) * count);
      this.setState({
        count,
        priceTotal
      });
      //请求的优惠券数据
      this.getUsableCoupons(priceTotal, orderInfo, count);
    }
  }

  // 添加数量
  addNum() {
    let { count, orderInfo } = this.state;
    count++;
    //总价 = 金额 * 数量
    let priceTotal = Number(parseFloat(orderInfo.dishPricee) * count);
    this.setState({
      count,
      priceTotal
    });
    //请求的优惠券数据
    this.getUsableCoupons(priceTotal, orderInfo, count);
  }

  //增加，减少 数量时请求的优惠券数据
  getUsableCoupons(priceTotal, orderInfo, count) {
    let that = this;
    let userId = localStorage.getItem('userId');
    //查可用的优惠券
    Netservice.request({
      url: 'heque-coupon/discount_coupon/order_info_get_coupon',
      method: 'GET',
      data: {
        userId: userId,
        totalPrice: priceTotal,
        dishId: orderInfo.dishId,
        storeId: orderInfo.storesDetails.id
      },
      success: res => {

        //有优惠券
        if (res.data.length > 0) {
          //过滤 可使用的优惠券  2=可使用
          var okCoupons = res.data.filter(function (item) {
            return item.type == 2;
          });
          //可使用的优惠券> 0
          if (okCoupons.length > 0) {
            //排序 可使用的优惠券
            okCoupons.sort(function (item1, item2) {
              return item2.faceValue - item1.faceValue;
            });
            //设置第一个值
            const targetCoupon = okCoupons[0];

            setGlobalData('currentCoupon', targetCoupon);
            that.setState({ currentCoupon: targetCoupon });
            //优惠券设置值
            let cValue = targetCoupon.faceValue ? targetCoupon.faceValue : 0;
            //优惠券大于0时
            let couponStr = cValue > 0 && targetCoupon.type == '2' ? '- ¥' + cValue : '请选择优惠券';
            //是否选择优惠券
            let notUseCoupon = getGlobalData('notUseCoupon') || false;
            //优惠券大于0时  &&  选择了优惠券
            if (cValue > 0 && !notUseCoupon) {
              //总价 = 金额 * 数量
              let priceTotal = Number(parseFloat(orderInfo.dishPricee) * count - cValue);
              //小于0 显示0 
              let priceTotal2 = priceTotal > 0 ? priceTotal : 0;
              that.setState({
                priceTotal: priceTotal2,
                couponStr,
                cValue: cValue,
                couponStyle: true
              });
              // 没有选择优惠券
            } else {
              //清空优惠券
              setGlobalData('currentCoupon', {});
              that.setState({
                couponStr: '请选择优惠券',
                couponStyle: false,
                currentCoupon: {}
              });
            }
            //没有优惠券
          } else {
            that.setState({
              couponStr: '请选择优惠券',
              couponStyle: false
            });
          }
        }
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
          jsApiList: ['openLocation', 'getLocation', 'chooseWXPay'] // 必填，需要使用的JS接口列表，
        });

        JSWX.ready(function () {
          JSWX.error(function (err) {
            console.log("config信息验证失败,err=" + JSON.stringify(err));
          });
        });
      }
    });
  }

  // 去导航
  goLocation() {
    const currentPoint = this.state.currentPoint;
    JSWX.openLocation({
      latitude: currentPoint.latitude,
      longitude: currentPoint.longitude,
      name: currentPoint.name,
      address: currentPoint.adds
    });
  }

  // 查可用的优惠券
  getCouponList(orderInfo, dishPricee) {

    let that = this;
    let userId = localStorage.getItem('userId');

    let currentPoint = orderInfo.storesDetails;

    // let orderInfo = this.state.orderInfo;

    if (userId) {

      //查可用的优惠券
      Netservice.request({
        url: 'heque-coupon/discount_coupon/order_info_get_coupon',
        method: 'GET',
        data: {
          userId: userId,
          totalPrice: dishPricee,
          dishId: orderInfo.dishId,
          storeId: currentPoint.id
        },
        success: res => {
          if (res.data.length > 0) {
            //过滤 可使用的优惠券  2=可使用
            var okCoupons = res.data.filter(function (item) {
              return item.type == 2;
            });
            //可使用的优惠券> 0
            if (okCoupons.length > 0) {
              //排序 可使用的优惠券
              okCoupons.sort(function (item1, item2) {
                return item2.faceValue - item1.faceValue;
              });

              const targetCoupon = okCoupons[0];

              setGlobalData('currentCoupon', targetCoupon);
              that.setState({ currentCoupon: targetCoupon });

              let cValue = targetCoupon.faceValue ? targetCoupon.faceValue : 0;

              let couponStr = cValue > 0 && targetCoupon.type == '2' ? '- ¥' + cValue : '请选择优惠券';

              that.setState({
                couponStr,
                cValue: cValue,
                couponStyle: true
              });
              //计算金额
              that.calculate(targetCoupon.faceValue);
            } else {
              that.setState({
                couponStr: '请选择优惠券',
                couponStyle: false
              });
            }
          } else {
            that.setState({
              couponStr: '请选择优惠券',
              couponStyle: false
            });
          }
        }
      });
    }
  }

  //去支付按钮
  bookingMeals() {
    //防重复点击
    if (!this.canPayClick) return;

    this.canPayClick = false;
    setTimeout(() => {
      this.canPayClick = true;
    }, 3000);

    let userId = localStorage.getItem('userId');

    if (userId) {
      let that = this;

      _showLoading({ title: '努力加载中…' });

      let { orderInfo, count, priceTotal } = this.state;
      const currentPoint = this.state.currentPoint;

      //计算总价
      let totalPrice = Number(count * orderInfo.dishPricee);

      //保存订单
      Netservice.request({
        url: 'heque-eat/eat/save_order',
        method: 'POST',
        data: {
          dishId: orderInfo.dishId,
          storeId: currentPoint.id,
          num: count,
          userId: userId,
          priceType: orderInfo.priceType,
          longitude: currentPoint.longitude,
          latitude: currentPoint.latitude,
          codeC: currentPoint.cityCode,
          totalPrice: totalPrice,
          appType: 'h5'
        },
        success: res => {
          let orderId = res.data;

          _hideLoading();
          if (res.code !== Common.NetCode_NoError) {
            _showToast({ title: res.message, icon: 'none', duration: 2000 });
            return;
          }

          //调起支付
          that.checkPay(orderId);

          // Taro.showToast({ title: '点餐成功', icon: 'success', duration: 2000 });
          // Taro.switchTab({ url: '/pages/take_meals/take_meals' })
        }
      });
    } else {
      Taro.navigateTo({ url: "/pages/login/login?v=" + new Date().getTime() });
    }
  }

  //去选择优惠券
  toCouponsList(e) {

    let userId = localStorage.getItem('userId');
    let currentPoint = this.state.currentPoint;
    let orderInfo = this.state.orderInfo;
    let count = this.state.count;

    //计算总价
    let totalPrice = Number(count * orderInfo.dishPricee);

    if (userId) {
      Taro.navigateTo({
        url: '/pages/take_meals/select_coupon/select_coupon?userId=' + userId + '&storeId=' + currentPoint.id + '&dishId=' + orderInfo.dishId + '&totalPrice=' + totalPrice + '&v=' + new Date().getTime()
      });
    } else {
      Taro.navigateTo({
        url: '/pages/login/login'
      });
    }
  }

  //查要支付的实际金额
  checkPay(orderId) {
    let userCardMedalId = {};

    const currentCoupon = this.state.currentCoupon || {};

    const couponId = currentCoupon.id;
    if (couponId) {
      userCardMedalId = { userCardMedalId: couponId };
    }

    let that = this;
    Netservice.request({
      url: 'heque-coupon/discount_coupon/query_real_pay_price',
      method: 'GET',
      data: {
        ...userCardMedalId,
        orderId: orderId
      },
      success: function (res) {

        let totalPrice = res.data.totalPrice;
        if (parseInt(parseFloat(totalPrice) * 100) > parseInt(0)) that.goWechatPay(totalPrice, orderId); //调起微信支付
        else that.zeroPay(totalPrice, orderId); // ；零元支付
      },
      error: function (err) {
        _hideLoading();
        _showToast({ title: '支付失败', icon: 'none', duration: 2000 });

        Taro.navigateTo({ url: '/pages/my/order_history/the_order_details/the_order_details?orderId=' + orderId + '&=' + new Date().getTime() });
      }

    });
  }
  //调起支付
  goWechatPay(totalPrice, orderId) {

    const currentCoupon = this.state.currentCoupon || {};
    let openId = localStorage.getItem('openId');

    let userCardMedalId = {};
    const couponId = currentCoupon.id;

    if (couponId) {
      userCardMedalId = { userCardMedalId: couponId };
    }
    let that = this;

    // //支付接口

    payment(userCardMedalId, orderId, totalPrice, openId, () => {
      //支付成功

      that.setState({ count: 1 });
      Taro.navigateTo({ url: '/pages/my/order_history/the_order_details/the_order_details?orderId=' + orderId + '&v=' + new Date().getTime() });
    }, () => {
      //支付取消

      that.setState({ count: 1 });
      _showToast({ title: '支付取消', icon: 'none', duration: 2000 });
      Taro.navigateTo({ url: '/pages/my/order_history/the_order_details/the_order_details?orderId=' + orderId + '&v=' + new Date().getTime() });
    }, () => {
      //支付失败
      that.setState({ count: 1 });
      _showToast({ title: '支付失败', icon: 'none', duration: 2000 });
      Taro.navigateTo({ url: '/pages/my/order_history/the_order_details/the_order_details?orderId=' + orderId + '&v=' + new Date().getTime() });
    });
  }

  //零元支付
  zeroPay(price, orderId) {

    _showLoading({ title: '努力加载中…' });

    let userCardMedalId = {};
    const currentCoupon = this.state.currentCoupon || {};
    const couponId = currentCoupon.id;
    if (couponId) {
      userCardMedalId = { userCardMedalId: couponId };
    }
    this.setState({ count: 1 });

    //支付
    zeroPayment(userCardMedalId, price, orderId);
  }
}
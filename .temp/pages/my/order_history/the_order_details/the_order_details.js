import Nerv from "nervjs";
import Taro, { showLoading as _showLoading, hideLoading as _hideLoading, showModal as _showModal, showToast as _showToast, makePhoneCall as _makePhoneCall } from "@tarojs/taro-h5";
import { View, Text, Image } from '@tarojs/components';
import './the_order_details.css?v=20190627107';

import iconNavgation from '../../../../images/common/navigat_img.png';

import spacing from '../../../../images/take/divider_line.png';
import refundDispose from '../../../../images/my/refundDispose.png';
import revocationBtn from '../../../../images/my/revocation_btn.png';
import serviceBotton from '../../../../images/my/service_botton.png';
import payment_btn from '../../../../images/my/payment_btn.png';

import { calculateDistance } from '../../../../utils/utils';
import Netservice from "../../../../netservice";
import Common from "../../../../common";
import { payment } from "../../../../utils/payment";

//优惠券组件
import Prize from '../../../prize/prize.js?v=20190717110';
import NoPrize from '../../../noprize/noprize.js?v=20190717110';
import TooltipCoupon from '../../../tooltipCoupon/tooltipCoupon.js?v=20190626110';

import { setGlobalData } from '../../../../utils/global_data';

// 引入微信js-sdk
import JSWX from '../../../../libs/jweixin-1.4.0';

export default class TheOrderDetails extends Taro.Component {

  config = {
    navigationBarTitleText: '订单详情',
    navigationBarTextStyle: 'white',
    navigationBarBackgroundColor: '#FF7400'
  };
  state = {
    listData: {}, //订单详情信息
    orderState: [{ id: 1, state: '待支付' }, { id: 2, state: '支付失败' }, { id: 3, state: '已支付' }, { id: 4, state: '已取消' }, { id: 5, state: '退款处理中' }, { id: 6, state: '退款申请失败' }, { id: 7, state: '退款成功' }, { id: 8, state: '拒绝退款' }, { id: 9, state: '取消退款' }],
    orderStatelist: '',
    orderId: '', //订单Id
    dishesList: [], //菜品列表
    paymentPrice: '', //支付的金额
    discountPrice: '', //优惠券金额
    foodTime1: '',
    foodTime2: '', //供餐时间
    foodTime3: '',
    foodTime4: '',
    distance: '', //距离

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
    _showLoading({ title: '努力加载中…' });

    let orderId = this.$router.params.orderId;

    this.setState({
      orderId: orderId
    });
  }

  componentDidShow() {
    _hideLoading();
    this.getOrderDetails();
  }

  render() {

    let { listData, orderState, dishesList, foodTime1, foodTime2, foodTime3, foodTime4, distance, couponList, showPrize, showCoupon, showNoPrize, tapThePrize } = this.state;

    let takeMealsState = <View className="top_message">
      {/*5为申请退款处理中*/}
      {listData.state !== 5 ? <View className="padding_18">
        {/*订单状态*/}
        {orderState.map((item, index) => {
          return <View className="details_state_of_payment" key={index}>
            {listData.state === item.id ? item.state : ''}
          </View>;
        })}
        <View className="thank">感谢您使用禾师傅</View>
      </View> : <View className="padding_18">
          <View className="refundDispose_titl">
            {listData.state == 5 && '退款处理中'}
          </View>
          <Image src={refundDispose} className="refundDispose_img" style="pointer-events: none" />
          <View className="revocation_btn" onClick={this.refundDispose.bind(this)}>
            <Image src={revocationBtn} className="revocation_btn_img" />
          </View>
        </View>}
    </View>;

    let TakeFoodCode = <View className="top_message">

      {listData.state == 4 && <View className="padding_18">
        <View className="details_state_of_payment">已取消</View>
        <View className="thank">感谢您使用禾师傅</View>
      </View>}

      {listData.state === 3 && <View>
          {/*是否完成取餐  0未完成 1完成 */}
          {listData.istakemeal == 0 ? <View className="padding_18">
            <View className="TakeFoodCode">取餐码</View>
            <View className="details_state_of_payment">{listData.takeMealCode}</View>
            <View className="thank">感谢您使用禾师傅</View>
          </View> : <View className="padding_18">
              <View className="details_state_of_payment">已取餐</View>
              <View className="thank">取餐码：{listData.takeMealCode}</View>
              <View className="thank">感谢您使用禾师傅</View>
            </View>}
        </View>}

      {listData.state == 2 && <View className="padding_18">
        <View className="details_state_of_payment">支付失败</View>
        <View className="thank">感谢您使用禾师傅</View>
      </View>}

      {listData.state == 1 && <View className="padding_18">
        <View className="details_state_unpaid_title">待支付</View>
        <View className="details_state_unpaid_hint">
          <Text>30分钟内未支付成功，订单将自动</Text>
          <Text className="details_state_unpaid_cancel_btn" onClick={this.toCancle.bind(this)}>取消</Text>
        </View>
        <View className="details_state_unpaid_payment_btn" onClick={this.goWechatPay2.bind(this)}>
          <Image src={payment_btn} className="details_state_unpaid_payment_btn_img" />
        </View>
      </View>}


    </View>;

    //菜品数据
    let dishes = dishesList.map((item, index) => {
      return <View className="classify" key={index}>
        <View className="dish_name">
          <View className="title_name">{item.dishesName}</View>
        </View>
        <View className="classify_number">X{item.number}</View>
        <View className="classify_price">¥ {item.paymentPrice}</View>
      </View>;
    });

    return <View className="TheOrderDetails_hTML">
        <View className="TheOrderDetails">
          {listData.state <= 4 ? TakeFoodCode : takeMealsState}
          <Image src={spacing} className="spacing_img" style="pointer-events: none" />
          <View className="location">
            <View className="rade_name_wrap">
              <View className="rede_name">{listData.storeName}</View>
              <View className="location_right">
                {/*<View className='location_img_wrap margin-l_18' onClick={this.contactUs.bind(this)}>
                  <Image className='location_img' src={iconPhone} style='pointer-events: none' />
                 </View>*/}
                <View className="location_img_wrap" onClick={this.navigate.bind(this)}>
                  <Image className="location_img" src={iconNavgation} style="pointer-events: none" />
                </View>
              </View>
            </View>
            <View className="site"> <Text className="rade_distance">距您{distance}</Text>  {listData.storeAddress}</View>
            <View className="rade_time">
              <View>供餐时间：</View>
              <View className="rade_time_content">{foodTime1} {foodTime2} {foodTime3} {foodTime4}</View>
            </View>

          </View>

          <Image src={spacing} className="spacing_img" style="pointer-events: none" />
          <View className="commodityList">
            {dishes}
            <View className="discount_coupon">
              <View className="discount_coupon_title">优惠券</View>
              <View className="subtract">- ¥{listData.discountPrice}</View>
            </View>
            <View className="total">
              <View className="total_title">合计</View>
              <View className="total_price"><Text className="total_symbol">¥ </Text>{listData.paymentPrice}</View>
            </View>
          </View>
          <Image src={spacing} className="spacing_img" style="pointer-events: none" />
          <View className="createTime_orderNo">
            <View className="createTime">下单时间：{listData.createTime}</View>
            <View className="orderNo">订单编号：{listData.orderNo}</View>
            {listData.channelType == 1 && <View className="orderNo">下单方式：APP </View>}
            {listData.channelType == 2 && <View className="orderNo">下单方式：公众号 </View>}
            {listData.channelType == 3 && <View className="orderNo">下单方式：web </View>}
            {listData.channelType == 4 && <View className="orderNo">下单方式：小程序 </View>}
            {listData.state >= 3 && listData.state !== 4 ? <View className="orderNo">支付方式：微信支付</View> : ''}
          </View>
        </View>
        <View className="service_botton" onClick={this.myService.bind(this)}>
          <Image src={serviceBotton} className="service_botton_img" />
        </View>
        <View className="service_hint">客服工作时间 09:00-18:00</View>


        {showPrize && <Prize onTapThePrize={this.tapThePrize.bind(this)} />}
        {showCoupon && tapThePrize && <TooltipCoupon couponsData={couponList} notScroll={0} afterClose={0} />}
        {showNoPrize && tapThePrize && <NoPrize onTapNoPrize={this.closeNoPrize.bind(this)} onTapClose={this.closeNoPrize.bind(this)} />}


      </View>;
  }

  //当为退款状态是调用的 撤销退款申请
  refundDispose(e) {
    let orderId = this.state.orderId;
    let that = this;
    _showModal({
      title: '确定撤销？',
      content: '撤销后无法再次申请',
      success: function (res) {
        if (res.confirm) {

          //  发起取消撤销退款申请
          Netservice.request({
            url: 'heque-eat/wechat_pay/wechat_pay_revoke_refund',
            method: 'GET',
            data: {
              id: orderId
            },
            success: res => {
              if (res.code === Common.NetCode_NoError) {
                that.getOrderDetails();
              }
            }
          });
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
          jsApiList: ['chooseWXPay', 'openLocation', 'getLocation'] // 必填，需要使用的JS接口列表，
        });

        JSWX.ready(function () {
          JSWX.error(function (err) {
            console.log("config信息验证失败,err=" + JSON.stringify(err));
          });
        });
      }
    });
  }

  //微信支付
  goWechatPay2(e) {
    e.stopPropagation();
    // Taro.showLoading({ title: '努力加载中…' });
    let that = this;
    let orderData = this.state.listData;
    let dishesList = this.state.dishesList[0];
    const openId = localStorage.getItem('openId');

    //支付接口
    payment({}, orderData.id, dishesList.paymentPrice, openId, () => {
      //支付成功时，刷新页面
      that.getOrderDetails();
    }, () => {
      //支付取消
      _showToast({ title: '支付取消', icon: 'none', duration: 2000 });
      that.getOrderDetails();
    }, () => {
      //支付失败
      _showToast({ title: '支付失败', icon: 'none', duration: 2000 });
      that.getOrderDetails();
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
    let that = this;
    _showLoading({ title: '努力加载中…' });
    let orderData = this.state.listData;
    Netservice.request({
      url: 'heque-eat/eat/delete_order?id=' + orderData.id,
      method: 'GET',
      success: res => {
        _hideLoading();

        if (res.code == Common.NetCode_NoError) that.getOrderDetails();else _showToast({ title: res.message, icon: 'none', duration: 2000 });
      },
      fail: function (error) {
        _hideLoading();
        _showToast({ title: '取消订单失败', icon: 'none', duration: 2000 });
      }
    });
  }

  //导航
  navigate(e) {
    const currentPoint = this.state.listData;
    JSWX.openLocation({
      latitude: currentPoint.latitude,
      longitude: currentPoint.longitude,
      name: currentPoint.name,
      address: currentPoint.adds
    });
  }

  //联系商家
  contactUs(e) {
    e.stopPropagation();

    _makePhoneCall({
      phoneNumber: String(this.state.listData.storePhoneNumber)
    });
  }

  //去客服
  myService(e) {
    let listDataState = this.state.listData.state;
    let paymentPrice = this.state.paymentPrice;
    let discountPrice = this.state.discountPrice;
    let dishesList = JSON.stringify(this.state.dishesList);
    let orderId = this.state.orderId;

    localStorage.setItem('listDataState', listDataState);
    localStorage.setItem('dishesList', dishesList);

    Taro.navigateTo({
      url: '/pages/my/service/service?dishesList=' + dishesList + '&listDataState=' + listDataState + '&orderId=' + orderId + '&paymentPrice=' + paymentPrice + '&discountPrice=' + discountPrice + '&v=' + new Date().getTime()
    });
  }

  //获取订单详情
  getOrderDetails() {

    let that = this;

    Netservice.request({
      url: 'heque-eat/eat/user_order_details_info',
      method: 'GET',
      data: {
        id: that.state.orderId
      },
      success: function (res) {
        let listData = res.data;

        //截取时间
        let foodTime1 = listData.foodTime1 ? listData.foodTime1.slice(0, 5) + '-' + listData.foodTime1.slice(11, 16) : '';
        let foodTime2 = listData.foodTime2 ? '/ ' + (listData.foodTime2.slice(0, 5) + '-' + listData.foodTime2.slice(11, 16)) : '';
        let foodTime3 = listData.foodTime3 ? '/ ' + (listData.foodTime3.slice(0, 5) + '-' + listData.foodTime3.slice(11, 16)) : '';
        let foodTime4 = listData.foodTime4 ? '/ ' + (listData.foodTime4.slice(0, 5) + '-' + listData.foodTime4.slice(11, 16)) : '';
        //订单状态
        let orderState = localStorage.getItem('orderState');

        const latitude = localStorage.getItem('latitude');
        const longitude = localStorage.getItem('longitude');

        listData.number = calculateDistance({ latitude: res.data.latitude, longitude: res.data.longitude }, { latitude: latitude, longitude: longitude });

        that.setState({
          listData: listData,
          dishesList: res.data.list,
          paymentPrice: listData.paymentPrice,
          discountPrice: listData.discountPrice,
          foodTime1,
          foodTime2,
          foodTime3,
          foodTime4,
          distance: listData.number
        });
        //判断订单列表是否刷新  true刷新  false不刷新
        if (Number(orderState) !== Number(listData.state)) {
          setGlobalData('orderStateChanged', true);
        }

        if (listData.state == 3) {
          //查优惠券
          that.getCoupons();
        }
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

  //点击开红包
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

  //没中奖
  closeNoPrize(e) {
    this.setState({
      showNoPrize: false
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

  componentDidMount() {
    super.componentDidMount && super.componentDidMount();
  }

  componentDidHide() {
    super.componentDidHide && super.componentDidHide();
  }

}
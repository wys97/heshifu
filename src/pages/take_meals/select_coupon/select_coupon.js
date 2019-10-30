import './select_coupon.css?v=20190703108';
import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import Netservice from '../../../netservice.js';
import Common from '../../../common.js';
import { setGlobalData, getGlobalData } from '../../../utils/global_data'

import selected from '../../../images/take/icon_select.png';
import notselected from '../../../images/take/icon_notselect.png';
import gapLine from '../../../images/take/divider_line.png';
import warning from '../../../images/take/icon_warning.png';
import noneCoupon from '../../../images/take/no_coupon.png';


export default class SelectCoupon extends Component {

  config = {
    navigationBarTitleText: '选择优惠券',
  }

  state = {
    coupons: [],
    couponId: 0,
  }

  componentWillMount() {
    const { orderId, storeId, dishId, totalPrice } = this.$router.params;
    if (orderId)
      this.getCoupons('heque-coupon/discount_coupon/queryIsUseCoupon', { orderId: orderId });
    else {
      let userId = localStorage.getItem('userId');
      this.getCoupons('heque-coupon/discount_coupon/order_info_get_coupon', {
        userId: userId,
        totalPrice: totalPrice,
        dishId: dishId,
        storeId: storeId,
      });
    }

    const currentCoupon = getGlobalData('currentCoupon') || {};
    const couponId = currentCoupon.id;
    this.setState({ couponId });
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }


  getCoupons(url, params) {
    Taro.showLoading({ title: '努力加载中…' });
    let that = this;
    Netservice.request({
      url: url,
      method: 'GET',
      data: params,
      success: function (res) {
        Taro.hideLoading();

        if (res.code !== Common.NetCode_NoError) {
          Taro.showToast({ title: res.message, icon: 'none', duration: 2000 });
          return;
        }

        let coupons = res.data;

        var okCoupons = coupons.filter(function (item) {
          return item.type == 2;
        });
        var notCoupons = coupons.filter(function (item) {
          return item.type == 1;
        });

        // coupons.sort(function (item1, item2) {
        //   return item2.faceValue - item1.faceValue
        // });

        that.setState({
          coupons: okCoupons.concat(notCoupons)
        })

      },
      error: function (err) {
        Taro.hideLoading();
      }
    })
  }


  render() {
    let { coupons, couponId } = this.state;

    const coupon = coupons.map((item, index) => {

      const reasons = item.reason.slice(1, -1).split(',');
      const reasonsView = reasons.map((reasonItem, index) => {
        return <Text className='ibc-text'>{reasonItem}</Text>
      })

      return <View className='coupon-item' key={index} onClick={this.onTapItem.bind(this, item)}>

        <View className='item-top'>
          <View className='it-left'>
            <View className='itl-top'>
              <Text className='itlt-flag'>￥</Text>
              <Text className='itlt-amount'>{item.faceValue}</Text>
            </View>
            {item.useType == 2 && <Text className='itlt-limit'>满<Text className='itlt-orange'>{item.consumptionMoney}</Text>元可用</Text>}
          </View>

          <View className='it-middle'>
            <View className='im-title'>{item.name}</View>
            {item.applyType == 2 && <Text className='im-type'>仅限菜品</Text>}
            {item.applyType == 3 && <Text className='im-type'>仅限商品</Text>}
            <Text className='im-type'>{item.receiveTime.slice(0, 10).replace(/-/g, '.')}-{item.expireTime.slice(0, 10).replace(/-/g, '.')}</Text>
          </View>

          {item.type == 2 && <Image class='it-right' src={couponId == item.id ? selected : notselected} style='pointer-events: none'></Image>}

        </View>

        <Image class='item-middle' src={gapLine} mode='widthFix' style='pointer-events: none'></Image>

        <View className='item-bottom'>
          {item.type == 2 ?
            <View className='ib-content'>
              {item.storeId !== '0' ? <Text className='ibc-text'>限{item.storeName}使用</Text> : <Text className='ibc-text'>不限门店</Text>}
            </View>
            :
            <View className='ib-content'>
              <View className='ibc-title'>
                <Image class='ibct-img' src={warning} mode='widthFix' style='pointer-events: none' />
                <Text className='ibct-text'>不可用原因</Text>
              </View>
              {reasonsView}
              {/* <Text className='ibc-text'>{item.reason.slice(1, -1)}</Text> */}
            </View>
          }

        </View>

        {item.type == 1 && <View className='item-cover' />}

      </View>
    })


    const noCoupon = <View className='no-coupon'>
      <Image className='nc-img' src={noneCoupon} style='pointer-events: none' />
    </View>;

    const couponList = <View className='coupon-list'>

      <View className='not-use' onClick={this.notUseCoupon}>
        <Text className='nu-text'>不使用优惠券</Text>
        <Image class='nu-img' src={couponId == 0 ? selected : notselected} style='pointer-events: none'></Image>
      </View>

      <View className='coupon-list'>
        {coupon}
      </View>
    </View>;

    return (
      <View className='container-coupons'>
        {coupons.length > 0 ? couponList : noCoupon}
      </View>
    )
  }


  notUseCoupon(e) {

    setGlobalData('currentCoupon', {});
    setGlobalData('notUseCoupon', true);
    setGlobalData('couponChanged', true);

    Taro.navigateBack();
  }

  onTapItem(coupon, e) {
    // 1不可使用 2可使用
    if (coupon.type == 2) {
      setGlobalData('currentCoupon', coupon);
      setGlobalData('notUseCoupon', false);
      setGlobalData('couponChanged', true);

      Taro.navigateBack();
    }
  }

}
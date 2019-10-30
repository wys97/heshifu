import Nerv from "nervjs";
import './couponList.css?v=201907051107';
import Taro, { showLoading as _showLoading, hideLoading as _hideLoading, switchTab as _switchTab } from "@tarojs/taro-h5";
import { View, Text, Image } from '@tarojs/components';
import Netservice from "../../../netservice";


import Common from "../../../common";

import gapLine from '../../../images/common/gap_line.png';
import coupon from '../../../images/common/coupon.png';
import useBtn from '../../../images/common/use_btn.png';

export default class CouponList extends Taro.Component {
  config = {
    navigationBarTitleText: '优惠券列表'
  };

  state = {
    couponData: [], //优惠券数据
    applyType: [{ type: 1, astrict: '' }, { type: 2, astrict: '仅限菜品' }, { type: 3, astrict: '仅限商品' }],
    defaultState: false //加载中的显示状态
  };

  componentDidMount() {

    let that = this;
    let userId = localStorage.getItem('userId');

    if (userId) {

      _showLoading({ title: '努力加载中…' });

      Netservice.request({
        url: 'heque-coupon/discount_coupon/get_discount_coupon',
        method: 'GET',
        data: {
          userId: userId
        },
        success: res => {
          console.log(res);
          _hideLoading();
          if (res.code === Common.NetCode_NoError) {
            if (res.data.length === 0) {

              that.setState({
                defaultState: true
              });
            } else {
              that.setState({
                couponData: res.data,
                defaultState: false
              });
            }
          }
        }
      });
    }
  }

  render() {
    let that = this;
    const { couponData, applyType, defaultState } = this.state;
    const DataRender = <View className="CouponCouponList">
            {couponData.map((item, index) => {
        return <View className="couponList_wrap" key={index}>
                    <View className="couponList_title">
                        <View className="flex_column coupon_priceList">
                            <Text className="coupon_price">￥<Text className="font_68">{item.faceValue}</Text></Text>
                            {item.useType === 1 ? "" : <Text className="coupon_scope">满<Text className="coupon_price_color">{item.useType === 2 ? item.consumptionMoney : ''}</Text>元可用</Text>}
                        </View>
                        <View className="flex_column coupon_nameList">
                            <Text className="coupon_name">{item.name}</Text>
                            {applyType.map(item2 => {
                return <Text className="coupon_astrict">{item.applyType === item2.type ? item2.astrict : ''}</Text>;
              })}
                            <Text className="coupon_time">{item.receiveTime.substring(0, 10)} / {item.expireTime.substring(0, 10)}</Text>
                        </View>
                        <View className="useBtn" onClick={item.state === 1 && this.goIndex.bind(that, item.state)}>
                            <Image src={useBtn} className="useBtn_img" />
                        </View>
                    </View>
                    <Image src={gapLine} className="coupon_gapLine_img" style="pointer-events: none" />
                    <View className="coupon_shop_astrict">{item.storeInfoName == null ? <Text>不限门店</Text> : <Text>限 {item.storeName} 使用</Text>}</View>
                </View>;
      })}
        </View>;

    const noCouponData = <View className="noCouponData">
            {defaultState && <Image src={coupon} className="noCoupon_img" style="pointer-events: none" />}
        </View>;

    return <View className="CouponList">
                {couponData.length === 0 ? noCouponData : DataRender}
            </View>;
  }
  //到点餐
  goIndex(state, e) {

    _switchTab({
      url: "/pages/index/index?v=" + new Date().getTime()
    });
  }

  componentDidShow() {
    super.componentDidShow && super.componentDidShow();
  }

  componentDidHide() {
    super.componentDidHide && super.componentDidHide();
  }

}
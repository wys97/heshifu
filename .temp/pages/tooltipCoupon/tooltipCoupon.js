import Nerv from "nervjs";
import Taro from "@tarojs/taro-h5";
import { View, Text, Image } from '@tarojs/components';
import './tooltipCoupon.css?v=20190710108';

import CouponImg from '../../images/coupons/more_coupon_bg_img.png';
import commonCouponImg from '../../images/coupons/common_coupon_bg_img.png';
import confirmBtn from '../../images/coupons/confirm_btn.png';
import fork from '../../images/coupons/coupon_fork.png';

import Netservice from "../../netservice";

//优惠券组件
export default class TooltipCoupon extends Taro.Component {

  state = {
    couponsTitle: [{ id: 1, title: '新人礼券' }, { id: 2, title: '邀请有礼' }, { id: 3, title: '下单有礼' }],
    couponState: false, //优惠券显示状态 false为不显示
    receiveType: [], //券的类型
    afterClose: 0, //0 不跳转 ， 1跳转
    faceValueThanZero: [],
    notScroll: 0
  };

  componentWillMount() {

    let couponsData = this.props.couponsData; //获取优惠券的信息
    let notScroll = this.props.notScroll; //获取优惠券的信息
    let afterClose = this.props.afterClose; //用于是否返回首页的判断， 1.返回;    0.关闭当前弹框,不返回；（支付成功的时候）

    let userId = localStorage.getItem('userId');

    if (!userId || couponsData == '' || couponsData.length <= 0) {
      this.setState({
        couponState: false //不显示券 
      });
    } else {
      //过滤金额大于0 的券
      var okCoupons = couponsData.filter(function (item) {
        return item.faceValue > 0;
      });

      let showCoupon = okCoupons;
      //如果数据大于2， 只选前两个
      if (okCoupons.length > 2) showCoupon = okCoupons.slice(0, 2);

      // 如果数据大于0， 显示优惠券
      if (showCoupon.length > 0) {
        this.setState({
          couponState: true //显示券
        });
      }

      let receiveTypes = [];
      //获取优惠券的类型
      showCoupon.map(item => {
        receiveTypes.push(item.receiveType);
      });

      this.setState({
        faceValueThanZero: showCoupon, //券的数据
        receiveType: receiveTypes, //券的类型
        afterClose: afterClose, //跳转
        notScroll: notScroll
      });

      let couponIds = [];
      couponsData.map(item => {
        couponIds.push(item.id);
      });
      let cardIdsStr = couponIds.join(',');
      this.amendState(cardIdsStr);
    }
  }

  render() {
    const { couponState, receiveType, couponsTitle, faceValueThanZero, notScroll } = this.state;

    //下单有礼，新人礼券，邀请有礼共用组件
    let commonListStyle = faceValueThanZero.map((item, index) => {
      return <View className="coupon_content2" key={index}>
                <View className="coupon_content_top">
                    <Text className="coupon_content_money2">{item.faceValue}元</Text>
                </View>
                <View className="coupon_content_bottom">
                    <View className="coupon_content_name">禾师傅优惠券</View>
                    <View className="coupon_content_time">{item.receiveTime.substr(0, 10)}-{item.expireTime.substr(0, 10)}</View>
                </View>
            </View>;
    });

    //大礼包组件
    let giftPacksListStyle = <View className="coupon_list">
            {faceValueThanZero.map((item, index) => {
        return <View className="coupon_content" key={index}>
                    <View className="coupon_content_left">
                        <Text className="coupon_content_money">{item.faceValue}</Text>
                        <Text className="coupon_content_unit">元</Text>
                    </View>
                    <View className="coupon_content_right2">
                        <View className="coupon_content_name2">禾师傅优惠券</View>
                        <View className="coupon_content_time2">{item.receiveTime.substr(0, 10)}-{item.expireTime.substr(0, 10)}</View>
                    </View>
                </View>;
      })}
        </View>;

    return <View>
                {couponState && <View className={notScroll == 1 ? 'TooltipCoupon2' : 'TooltipCoupon'}>
                        <View className={notScroll == 1 ? 'TooltipCoupon_bg2' : 'TooltipCoupon_bg'}>
                            <View className="CouponImg_wrap">
                                <View className="CouponImg_wrap_content" onClick={this.closeTooltip.bind(this)}>
                                    {faceValueThanZero.length >= 2 ? <Image src={CouponImg} className="CouponImg" style="pointer-events: none" /> : <Image src={commonCouponImg} className="CouponImg" style="pointer-events: none" />}
                                    <View className="confirm" onClick={this.closeTooltip.bind(this)}>
                                        <Image src={confirmBtn} className="confirmBtn" style="pointer-events: none" />
                                    </View>
                                    {couponsTitle.map((item, index) => {
                return <View className="coupon_title" key={index}>
                                            {faceValueThanZero.length >= 2 ? <Text>恭喜获得大礼包</Text> : <Text>{item.id === receiveType[0] ? <Text>{item.title}</Text> : ''}</Text>}
                                        </View>;
              })}
                                    {faceValueThanZero.length >= 2 ? giftPacksListStyle : commonListStyle}
                                    <View onClick={this.closeTooltip.bind(this)} className="fork_btn">
                                        <Image src={fork} className="coupon_fork_img" style="pointer-events: none" />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>}
            </View>;
  }

  //点击关闭和知道了按钮的事件   
  closeTooltip(e) {
    // 阻止默认事件
    e.stopPropagation();

    this.setState({ couponState: false });

    if (this.state.afterClose == 1) Taro.navigateBack();

    if (this.props.onCloseCouponView) this.props.onCloseCouponView();
  }

  //修改优惠券为已读
  amendState(cardIdsStr) {
    Netservice.request({
      url: 'heque-coupon/discount_coupon/user_has_read',
      method: 'GET',
      data: { userCardMedalId: cardIdsStr },
      success: res => {}
    });
  }

}
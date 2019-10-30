import Nerv from "nervjs";
import Taro from "@tarojs/taro-h5";
import { View, Image } from '@tarojs/components';
import './choice_motorman_type.css?v=201906261107';

import a_default from '../../../images/motormanType/a_default.png';
import b_default from '../../../images/motormanType/b_default.png';
import c_default from '../../../images/motormanType/c_default.png';
import a_slct from '../../../images/motormanType/a_slct.png';
import b_slct from '../../../images/motormanType/b_slct.png';
import c_slct from '../../../images/motormanType/c_slct.png';
import a_unslct from '../../../images/motormanType/a_unslct.png';
import b_unslct from '../../../images/motormanType/b_unslct.png';
import c_unslct from '../../../images/motormanType/c_unslct.png';
import btn_next from '../../../images/motormanType/btn_next.png';
import btn_unavailable from '../../../images/motormanType/btn_unavailable.png';

import Netservice from "../../../netservice";
import TooltipCoupon from "../../tooltipCoupon/tooltipCoupon";

export default class ChoiceMotormanType extends Taro.Component {

  config = {
    navigationBarTitleText: '选择司机类型'

  };
  state = {
    whetherDefaultState: 0, //司机类型参数 出租车司机1、网约车司机2、普通司机3
    couponsData: [], //传到优惠券组件的数据
    showBounced: false, //优惠券弹框
    defaultState: true //默认的图
  };

  render() {
    const { whetherDefaultState, showBounced, couponsData, defaultState } = this.state;
    return <View className="ChoiceMotormanType">
                <View className="Motorman_title">请选择司机类型</View>
                <View className="MotormanType_wrap" onClick={() => {
        this.ChangeState(1);
      }}>
                    {!defaultState ? <Image src={whetherDefaultState === 1 ? a_slct : a_unslct} className="MotormanType_defaultBgImg" /> : <Image src={a_default} className="MotormanType_defaultBgImg" />}
                </View>
                <View className="MotormanType_wrap" onClick={() => {
        this.ChangeState(2);
      }}>
                    {!defaultState ? <Image src={whetherDefaultState === 2 ? b_slct : b_unslct} className="MotormanType_defaultBgImg" /> : <Image src={b_default} className="MotormanType_defaultBgImg" />}
                </View>
                <View className="MotormanType_wrap" onClick={() => {
        this.ChangeState(3);
      }}>
                    {!defaultState ? <Image src={whetherDefaultState === 3 ? c_slct : c_unslct} className="MotormanType_defaultBgImg" /> : <Image src={c_default} className="MotormanType_defaultBgImg" />}
                </View>
                <View className="Motorman_btn" onClick={this.completeChoice.bind(this)}>
                    {!whetherDefaultState == 0 ? <Image src={btn_next} className="Motorman_btn_img" /> : <Image src={btn_unavailable} className="Motorman_btn_img" />}
                </View>
                {showBounced && <TooltipCoupon couponsData={couponsData} afterClose={1} notScroll={0}></TooltipCoupon>}
            </View>;
  }

  //选择类型时，修改样式的函数
  ChangeState(type) {
    this.setState({
      whetherDefaultState: type,
      defaultState: false
    });
  }

  //选择完成，进行跳转
  completeChoice() {
    let that = this;
    if (that.state.whetherDefaultState === '' || that.state.whetherDefaultState === undefined) {
      return;
    } else {
      let businessType = that.state.whetherDefaultState;
      let userId = localStorage.getItem('userId');

      Netservice.request({
        url: 'heque-user/user/addBusinessType',
        method: 'POST',
        data: {
          id: userId,
          businessType: businessType
        },
        success: res => {
          that.getCouponsMessage(userId);
        }
      });
    }
  }

  //查优惠券
  getCouponsMessage(userId) {
    let that = this;
    Netservice.request({
      'url': 'heque-coupon/discount_coupon/getNotRead',
      method: 'GET',
      data: {
        userId: userId
      },
      success: res => {
        console.log(res);
        let results = res.data;
        let coupons = results.filter(function (ele) {
          return ele.faceValue > 0;
        });

        if (coupons.length === 0 || coupons === '') {
          that.setState({
            showBounced: false
          });
          Taro.navigateBack();
        } else {
          that.setState({
            showBounced: true,
            couponsData: coupons
          });
        }
      }
    });
  }

  componentDidMount() {
    super.componentDidMount && super.componentDidMount();
  }

  componentDidShow() {
    super.componentDidShow && super.componentDidShow();
  }

  componentDidHide() {
    super.componentDidHide && super.componentDidHide();
  }

}
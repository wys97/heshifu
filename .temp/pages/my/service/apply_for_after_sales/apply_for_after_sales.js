import Nerv from "nervjs";
import Taro, { getSystemInfo as _getSystemInfo, showToast as _showToast } from "@tarojs/taro-h5";
import { View, Text, Image, Textarea } from '@tarojs/components';
import './apply_for_after_sales.css?v=201906141107';

import Netservice from "../../../../netservice";
import Common from "../../../../common";

import checked from '../../../../images/service/checked.png';
import checkedNo from '../../../../images/service/checkedNo.png';
import success from '../../../../images/service/success.png';
import return_btn from '../../../../images/service/return_btn.png';
import submit_btn from '../../../../images/service/submit_btn.png';
import arrow from '../../../../images/my/arrow.png';

export default class ApplyForAfterSales extends Taro.Component {
  config = {
    navigationBarTitleText: '申请售后',
    navigationBarTextStyle: 'white',
    navigationBarBackgroundColor: '#31B1B0'
  };

  state = {
    dishesList: [], //菜品数据
    paymentPrice: '', //退款总金额
    discountPrice: '', //优惠券金额
    value: '', //输入框的值
    showOption: false, // 显示退款原因
    reasonList: [], //原因列表
    checkedId: '', //选中的原因 
    checkedContent: '',
    submitSuccessState: false, //提交后的显示页面，true显示
    orderId: '', //订单ID 
    system: 'android' //系统

  };
  componentWillMount() {
    Netservice.request({
      url: 'heque-eat/complaint_details/complaint_or_refund_options',
      method: 'GET',
      data: {
        type: 2
      },
      success: res => {
        let reasonList = res.data;

        //显示弹出层数据
        this.setState({
          reasonList: reasonList
        });
      }
    });
    let dishesList = JSON.parse(localStorage.getItem('dishesList'));
    let paymentPrice = this.$router.params.paymentPrice;
    let orderId = this.$router.params.orderId;
    let discountPrice = this.$router.params.discountPrice;
    this.setState({
      dishesList: dishesList,
      orderId: orderId,
      paymentPrice: paymentPrice,
      discountPrice: discountPrice
    });

    _getSystemInfo({
      success: res => {
        this.setState({ system: res.system });
      }
    });
  }
  componentDidMount() {}

  render() {
    let that = this;
    const { dishesList, paymentPrice, showOption, reasonList, submitSuccessState, checkedId, checkedContent, discountPrice } = this.state;

    //退款原因组件
    let reasonOption = <View className="reasonOption">
            <View className="reasonOption_wrap">
                <View className="reasonOption_title_hint">为了便于客服处理，请填写真实原因</View>
                <View className="reasonOption_contnet_list">
                    {reasonList.map((item, index) => {
            return <View className="reasonOption_list_message" key={index} onClick={this.reasonOptionContent.bind(that, item)}>
                            <Text className="reasonOption_list_title">{item.content}</Text>
                            {checkedId === item.id ? <Image className="reasonOption_icon" src={checked} style="pointer-events: none" /> : <Image className="reasonOption_icon" src={checkedNo} style="pointer-events: none" />}
                        </View>;
          })}
                </View>
                <View className="reasonOption_button" onClick={this.offRefundReason.bind(this)}>取消</View>
            </View>
        </View>;

    //提交成功的显示页面
    let submitSuccess = <View className="submitSuccess">
            <View className="submitSuccess_wrap">
                <Image src={success} className="submitSuccess_img" style="pointer-events: none" />
                <View className="submitSuccess_content">退款申请提交成功</View>
                <View className="submitSuccess_botton" onClick={this.goTheOrderDetails.bind(this)}>
                    <Image src={return_btn} className="submitSuccess_botton_img" style="pointer-events: none" />
                </View>
            </View>
        </View>;

    return <View className="ApplyForAfterSales">
                <View className="ApplyForAfterSales_content">
                    <View className="checked_number">
                        <Image src={checked} className="checked_img" style="pointer-events: none" />
                        <Text className="checked_title_text">退全部商品</Text>
                    </View>
                    {dishesList.map((item, index) => {
          return <View key={index}>
                            <View className="checked_dishesList">
                                <Text className="checked_dishesList_name">{item.dishesName}</Text>
                                <Text className="checked_dishesList_number">x {item.number}</Text>
                                <Text className="checked_dishesList_price">¥ {item.paymentPrice}</Text>
                            </View>
                            <View className="checked_dishesList2">
                                <Text className="checked_dishesList_name">优惠券金额</Text>
                                <Text className="checked_dishesList_price">￥{discountPrice}</Text>
                            </View>
                        </View>;
        })}
                    <View className="refund_reason_wrap">
                        <View className="refund_reason" onClick={this.refundReason.bind(this)}>
                            <View className="refund_reason_text">退款原因</View>
                            <View className="refund_reason_type">
                                <Text className="refund_reason_checked">{checkedContent === null || checkedContent === '' ? '请选择(必选)' : <Text>{checkedContent}</Text>}</Text>
                                <Image src={arrow} className="refund_reason_arrow" style="pointer-events: none" />
                            </View>
                        </View>
                        <View className="refund_reason_replenish">
                            <Textarea type="text" placeholder="补充详细信息以便客服更快帮您处理( 选填 ),最多140字" maxLength="140" className="refund_reason_input" onBlur={this.getInputValue.bind(that)} />
                        </View>
                    </View>
                </View>
                <View className="refund_reason_confirm_button">
                    <View className="confirm_button_left">
                        <View className="refund_price">¥ <Text className="refund_price_size">{paymentPrice}</Text></View>
                        <View className="refund_reminder">
                            <View className="refund_reminder_all_costs">已包含快送费</View>
                            <View className="refund_path">退款将按原路返回</View>
                        </View>
                    </View>
                    <View className="confirm_button_right" onClick={this.submitBotton.bind(this)}>
                        <Image src={submit_btn} className="submit_btn_img" />
                    </View>
                </View>
                {showOption && reasonOption}
                {submitSuccessState && submitSuccess}
            </View>;
  }

  //显示退款原因弹框
  refundReason(e) {

    //显示弹出层
    this.setState({
      showOption: true

    });
  }
  //选择退款原因
  reasonOptionContent(item, e) {
    e.stopPropagation();
    let reasonList = this.state.reasonList;
    //选中的原因
    for (let i = 0; i < reasonList.length; i++) {
      //相等就选中
      if (item.id === reasonList[i].id) {
        this.setState({
          checkedId: reasonList[i].id,
          checkedContent: reasonList[i].content,
          showOption: false
        });
      }
    }
  }

  //关闭退款原因弹窗
  offRefundReason(e) {
    e.stopPropagation();
    this.setState({
      showOption: false
    });
  }

  //输入框失焦时获取输入补充的内容
  getInputValue(e) {
    let value = e.detail.value;

    this.setState({
      value: value
    });

    let { system } = this.state;
    if (system.startsWith('iOS') || system.startsWith('ios')) window.scroll(0, 0);
  }

  //提交按钮
  submitBotton(e) {
    e.stopPropagation();
    let orderId = this.state.orderId;
    let checkedId = this.state.checkedId;
    let value = this.state.value;
    if (checkedId === null || checkedId === '') {
      _showToast({
        title: '请选择退款原因',
        icon: 'none',
        duration: 2000
      });
    } else {
      Netservice.request({
        url: 'heque-eat/wechat_pay/wechat_pay_refund',
        data: {
          id: orderId,
          complaintsTypeId: checkedId,
          remark: value,
          fileInfoUrl: ''
        },
        success: res => {

          if (res.code === Common.NetCode_NoError) {
            this.setState({
              submitSuccessState: true
            });
          }
        }
      });
    }
  }

  //返回订单详情
  goTheOrderDetails(e) {
    e.stopPropagation();
    Taro.navigateBack({
      delta: 2
    });
  }

  componentDidShow() {
    super.componentDidShow && super.componentDidShow();
  }

  componentDidHide() {
    super.componentDidHide && super.componentDidHide();
  }

}
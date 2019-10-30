import Nerv from "nervjs";
import Taro, { makePhoneCall as _makePhoneCall } from "@tarojs/taro-h5";
import { View, Image } from '@tarojs/components';
import './service.css?v=201906107';

import applyFor from '../../../images/service/apply_for.png';
// import orderComplaints from '../../../images/service/order_complaints.png'
import servicePortrait from '../../../images/service/service_portrait.png';
import service_botton from '../../../images/my/service_botton.png';

export default class AfterService extends Taro.Component {
  config = {
    navigationBarTitleText: '我的客服',
    navigationBarTextStyle: 'white',
    navigationBarBackgroundColor: '#31B1B0'
  };

  state = {
    orderId: '', //订单ID
    orderListData: '', //订单信息
    dishesList: '' //菜品信息
  };

  componentDidShow() {
    //获取路由传过来的数据
    let orderId = this.$router.params.orderId;
    let dishesList = localStorage.getItem('dishesList');
    let listDataState = localStorage.getItem('listDataState');

    this.setState({
      orderListData: listDataState,
      dishesList: dishesList,
      orderId: orderId
    });
  }
  render() {
    const { orderListData } = this.state;
    return <View className="AfterService_content">

                <View className="service_card">
                    <View className="top_remind">
                        <Image src={servicePortrait} className="Imgsize" style="pointer-events: none" />
                        <View>
                            <View className="f-34">您好，请自助选择服务</View>
                            <View className="f-24">若自助不能满足您的需求，请电话客服</View>
                        </View>
                    </View>
                    <View className="self-help">自助客服</View>

                    {orderListData !== '3' ? <View></View> : <View className="self_help_list">
                            <View className="service_option" onClick={this.applyForAfterSales.bind(this)}>
                                <Image src={applyFor} className="Imgsize2" style="pointer-events: none" />
                                <View className="f-28">申请售后</View>
                            </View>
                            <View className="">
                                {/*<Image src={orderComplaints} className='Imgsize2' />
                                    <View className='f-28'>订单投诉</View>*/}
                            </View>
                            <View className="">

                            </View>
                            <View className="">

                            </View>
                            <View className="">

                            </View>
                        </View>}

                </View>
                <View onClick={this.servicePhone.bind(this)} className="phoneService">
                    <Image src={service_botton} className="phoneService_img" style="pointer-events: none" />
                </View>
            </View>;
  }

  applyForAfterSales(e) {
    let dishesList = JSON.stringify(this.state.dishesList);
    let paymentPrice = this.$router.params.paymentPrice;
    let discountPrice = this.$router.params.discountPrice;
    let orderId = this.state.orderId;
    Taro.navigateTo({
      url: '/pages/my/service/apply_for_after_sales/apply_for_after_sales?dishesList=' + dishesList + '&orderId=' + orderId + '&paymentPrice=' + paymentPrice + '&discountPrice=' + discountPrice + '&v=' + new Date().getTime()
    });
  }

  servicePhone(e) {
    _makePhoneCall({
      phoneNumber: '4001686655'
    });
  }

  componentDidMount() {
    super.componentDidMount && super.componentDidMount();
  }

  componentDidHide() {
    super.componentDidHide && super.componentDidHide();
  }

}
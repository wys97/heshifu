import Nerv from "nervjs";
import './earn.css?v=20190703108';
import Taro from "@tarojs/taro-h5";
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components';


import { reporteUerBehavior } from '../../../utils/utils';

import banner1 from '../../../images/wish/earn/banner1.png';

import partner1 from '../../../images/wish/earn/partner1.png';
import partner2 from '../../../images/wish/earn/partner2.png';
import partner3 from '../../../images/wish/earn/partner3.png';
import partner4 from '../../../images/wish/earn/partner4.png';
import partner5 from '../../../images/wish/earn/partner5.png';

export default class Earn extends Taro.Component {

  config = {
    navigationBarTitleText: '外快'
  };

  state = {
    phoneNumber: ''
  };

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {

    return <View className="container-earn">

        <Swiper className="earn-swiper">
          <SwiperItem>
            <Image className="es_image" src={banner1} style="pointer-events: none" />
          </SwiperItem>
        </Swiper>

        <View className="earn-amount-view">
          <Text className="eav-title">派单收入</Text>

          <View className="eav-content">

            <View className="eavc-item">
              <Text className="eavci-title">订单收入(元)</Text>
              <Text className="eavci-detail">0.0</Text>
            </View>

            <View className="eavc-line" />

            <View className="eavc-item">
              <Text className="eavci-title">接单数</Text>
              <Text className="eavci-detail">0</Text>
            </View>

          </View>

        </View>


        <View className="earn-partner-view">
          <Text className="epv-title">聚合接单</Text>

          <View className="epv-content">
            <View className="epvc-partner_wrap" onClick={this.goCaocao.bind(this)}>
              <Image className="epvc-partner" src={partner1} style="pointer-events: none" />
            </View>
            <View className="epvc-partner_wrap" onClick={this.goShouqi.bind(this)}>
              <Image className="epvc-partner" src={partner2} style="pointer-events: none" />
            </View>
            <View className="epvc-partner_wrap" onClick={this.goShuangchuang.bind(this)}>
              <Image className="epvc-partner" src={partner3} style="pointer-events: none" />
            </View>
            <View className="epvc-partner_wrap" onClick={this.goQuanmin.bind(this)}>
              <Image className="epvc-partner" src={partner4} style="pointer-events: none" />
            </View>
            <View className="epvc-partner_wrap" onClick={this.goShansong.bind(this)}>
              <Image className="epvc-partner" src={partner5} style="pointer-events: none" />
            </View>
          </View>

        </View>


      </View>;
  }

  //曹操下载
  goCaocao(e) {
    e.stopPropagation();
    reporteUerBehavior('赚钱|外快|曹操出行', 1, res => {
      Taro.navigateTo({
        url: 'https://mobile.caocaokeji.cn/driver-outside/download/app'
      });
    });
  }
  //首汽下载
  goShouqi(e) {
    e.stopPropagation();
    reporteUerBehavior('赚钱|外快|首汽约车', 1, res => {
      Taro.navigateTo({
        url: 'https://monline.01zhuanche.com/appDownload/driverAppDownload.html'
      });
    });
  }
  //双创下载
  goShuangchuang(e) {
    e.stopPropagation();
    reporteUerBehavior('赚钱|外快|双创便民', 1, res => {
      Taro.navigateTo({
        url: 'http://appurl.me/79814328146'
      });
    });
  }
  //全民
  goQuanmin(e) {
    e.stopPropagation();
    reporteUerBehavior('赚钱|外快|全民用车', 1, res => {
      Taro.navigateTo({
        url: 'https://a.app.qq.com/o/simple.jsp?pkgname=com.zingfon.taxi'
      });
    });
  }

  //闪送
  goShansong(e) {
    e.stopPropagation();
    reporteUerBehavior('赚钱|外快|闪送', 1, res => {
      Taro.navigateTo({
        url: 'http://m.ishansong.com/activity/down-ssy.html'
      });
    });
    Taro.navigateTo({
      url: 'http://m.ishansong.com/activity/down-ssy.html'
    });
  }

}
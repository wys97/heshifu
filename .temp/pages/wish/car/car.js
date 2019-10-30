import Nerv from "nervjs";
import Taro from "@tarojs/taro-h5";
import { View, Image, Swiper, SwiperItem } from '@tarojs/components';
import './car.css?v=20190809110';

import { reporteUerBehavior } from '../../../utils/utils';

import car_home_banner from '../../../images/wish/car/car_home_banner_rent.png';

import area_fuban from '../../../images/wish/car/area_fuban.png';
import area_zuche from '../../../images/wish/car/area_zuche.png';
import area_caocao from '../../../images/wish/car/area_caocao.png';
import area_shouqi from '../../../images/wish/car/area_shouqi.png';
import area_yadi from '../../../images/wish/car/area_yadi.png';
import area_huolala from '../../../images/wish/car/area_huolala.png';
import area_kuaigou from '../../../images/wish/car/area_kuaigou.png';
import area_shenzhou from '../../../images/wish/car/area_shenzhou.png';

export default class Car extends Taro.Component {

  config = {
    'navigationBarTitleText': '找车'
  };

  render() {
    return <View className="content_car">
        <Swiper className="content_car_swiper" circular autoplay={false} interval={3000} style="width:100%">
          <SwiperItem className="content_car_SwiperItem" style="width:100%">
            <Image className="content_car_swiper_image" src={car_home_banner} style="pointer-events: none; width:100%" />
          </SwiperItem>
          {/* <SwiperItem className='pt2_SwiperItem' onClick={this.inviteFriends.bind(this)} >
              <Image className='pt2_swiper_image' src={banner2} onClick={this.inviteFriends.bind(this)} />
           </SwiperItem>
           <SwiperItem className='pt2_SwiperItem' onClick={this.summerTopic.bind(this)}>
              <Image className='pt2_swiper_image' src={banner3} onClick={this.summerTopic.bind(this)} />
           </SwiperItem>*/}
        </Swiper>
        <View className="car_title">禾师傅金牌服务</View>
        <View className="car_service_delivery">
          <View className="area_fuban_wrap" onClick={this.PartTimeMakeMoney.bind(this)}>
            <Image src={area_fuban} className="area_fuban_img" style="pointer-events: none" />
          </View>
          <View className="car_service_delivery_placeholder"></View>
          <View className="area_zuche_wrap" onClick={this.toCarRental.bind(this)}>
            <Image src={area_zuche} className="area_zuche_img" style="pointer-events: none" />
          </View>
        </View>
        <View className="car_title">网约车合作专区</View>
        <View className="car_cooperation_wrap">
          <View className="car_cooperation_content" onClick={this.goCaocao.bind(this)}>
            <Image src={area_caocao} className="car_cooperation_content_img" style="pointer-events: none" />
          </View>
          <View className="car_cooperation_content" onClick={this.goShouqi.bind(this)}>
            <Image src={area_shouqi} className="car_cooperation_content_img" style="pointer-events: none" />
          </View>
          <View className="car_cooperation_content" onClick={this.goYadi.bind(this)}>
            <Image src={area_yadi} className="car_cooperation_content_img" style="pointer-events: none" />
          </View>
          <View className="car_cooperation_content" onClick={this.goShenzhou.bind(this)}>
            <Image src={area_shenzhou} className="car_cooperation_content_img" style="pointer-events: none" />
          </View>
          <View className="car_cooperation_content" onClick={this.goHuolala.bind(this)}>
            <Image src={area_huolala} className="car_cooperation_content_img" style="pointer-events: none" />
          </View>
          <View className="car_cooperation_content" onClick={this.goKuaigou.bind(this)}>
            <Image src={area_kuaigou} className="car_cooperation_content_img" style="pointer-events: none" />
          </View>

        </View>
      </View>;
  }

  //到副班赚钱页
  PartTimeMakeMoney(e) {
    e.stopPropagation();
    Taro.navigateTo({ url: '/pages/wish/car/partTimeMakeMoney/partTimeMakeMoney?v=' + new Date().getTime() });
  }

  //到租车页
  toCarRental(e) {
    e.stopPropagation();

    Taro.navigateTo({ url: '/pages/wish/rent/rent' });
  }

  //曹操出行页
  goCaocao(e) {
    e.stopPropagation();

    Taro.navigateTo({ url: '/pages/wish/car/caocao/caocao' });
  }

  //首汽出行
  goShouqi(e) {
    e.stopPropagation();
    Taro.navigateTo({
      url: '/pages/wish/car/shouqi/shouqi'
    });
  }
  //亚嘀出租
  goYadi(e) {
    e.stopPropagation();
    Taro.navigateTo({
      url: '/pages/wish/car/yadi/yadi'
    });
  }

  //到神州
  goShenzhou(e) {
    e.stopPropagation();

    reporteUerBehavior('赚钱|找车|神州专车', 1, res => {
      Taro.navigateTo({ url: 'https://recruit.10101111.com/#/?ucarfrom=guanwangQRcode' });
    });
  }

  //到货拉拉
  goHuolala(e) {
    e.stopPropagation();

    reporteUerBehavior('赚钱|找车|货拉拉', 1, res => {
      Taro.navigateTo({ url: 'https://www.huolala.cn/m/driver.html' });
    });
  }

  //跳转到快狗
  goKuaigou(e) {
    e.stopPropagation();

    reporteUerBehavior('赚钱|找车|快狗打车', 1, res => {
      Taro.navigateTo({ url: 'https://huoyun.daojia.com/driver-register/index.html#/newindex?hmsr=web_kuaigoudache_join_qr_code' });
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
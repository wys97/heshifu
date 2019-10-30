import Nerv from "nervjs";
import './summer_topic.css';
import Taro from "@tarojs/taro-h5";
import { View, Text, Image } from '@tarojs/components';

import summer_top_img from '../../../images/home/summer_top.png';
import summer_bottom_img from '../../../images/home/summer_bottom.png';

export default class SummerTopic extends Taro.Component {

  config = {
    navigationBarTitleText: '入夏上新 禾家丰盛'
  };

  state = {
    showCoupon: false, //是否显示优惠券弹框
    couponList: []
  };

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {

    return <View className="container-summer">

      <Image className="summer-top-img" src={summer_top_img} mode="widthFix" style="pointer-events: none" />

      <View className="summer-middle-view">
        <Text className="smmv-text">    清脆的蝉鸣，此起彼伏的蛙声，田间绿色的麦田，满天星光萤火虫......这是自然给予我们夏天独有的馈赠。万物生长是夏天的篇章，也是禾师傅发展的主旋律。</Text>
        <Text className="smmv-text">    今夏，禾师傅带着“司机工作餐”在广州、深圳、杭州、无锡四大城市相继亮相。本着“更快捷、更实惠、更健康”的发展宗旨，禾师傅打开了司机餐饮发展新方向，通过大数据智能餐饮系统，科学合理的健康饮食搭配，有效缓解司机就餐停车难、就餐环境差、饮食不规律、营养不均衡等问题。“让每一位司机拥有健康轻松车生活”是禾师傅发展愿景。未来，禾师傅在提供司机工作餐服务基础上，将不断扩大自身服务范围，丰富自身业务版块，为司机群体建立一站式综合服务智能生态圈。</Text>
        <Text className="smmv-text">    以夏立新，以餐饮立足司机服务，禾师傅将如花繁叶茂的夏天般欣欣向荣。</Text>
      </View>

      <Image className="summer-bottom-img" src={summer_bottom_img} mode="widthFix" style="pointer-events: none" />

    </View>;
  }

  goBack() {
    Taro.navigateBack();
  }

}
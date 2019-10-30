import Nerv from "nervjs";
import './wish.css?v=20190717110';
import Taro, { getSystemInfo as _getSystemInfo } from "@tarojs/taro-h5";
import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components';

import Netservice from "../../netservice";

import Common from "../../common";

import banner1 from '../../images/wish/banner_index01.png';
import banner2 from '../../images/wish/banner_index02.png';
import banner3 from '../../images/wish/banner_index03.png';
import banner4 from '../../images/wish/banner_index04.png';

import icon_wish1 from '../../images/wish/icon_wish1.png';
import icon_wish2 from '../../images/wish/icon_wish2.png';
import icon_wish3 from '../../images/wish/icon_wish3.png';
import icon_wish4 from '../../images/wish/icon_wish4.png';

import icon_message from '../../images/wish/icon_message.png';

export default class Wish extends Taro.Component {

  config = {
    navigationBarTitleText: '赚钱'
  };

  state = {
    messages: [], //消息

    system: 'ios'
  };

  componentWillMount() {
    _getSystemInfo({
      success: res => {
        this.setState({ system: res.system });
      }
    });
  }

  componentDidMount() {}

  componentDidShow() {
    this.getMessages();
  }

  componentDidHide() {}

  getMessages() {
    let userId = localStorage.getItem('userId');
    if (!userId) return;

    let that = this;
    Netservice.request({
      url: 'heque-backend/collect/queryRecentlyMessage?userId=' + userId,
      method: 'GET',
      success: res => {
        if (res.code == Common.NetCode_NoError) that.setState({ messages: res.data });
      }
    });
  }

  render() {

    let { messages, system } = this.state;

    return <View className="container-wish">

        <Swiper className="wish-swiper" autoplay interval={3000} circular>
          <SwiperItem>
            <Image className="ws_image" src={banner1} onClick={this.goAssistant.bind(this)} />
          </SwiperItem>
          <SwiperItem>
            <Image className="ws_image" src={banner2} onClick={this.goPartTimeMakeMoney.bind(this)} />
          </SwiperItem>
          <SwiperItem>
            <Image className="ws_image" src={banner3} onClick={this.goLend.bind(this)} />
          </SwiperItem>
          <SwiperItem>
            <Image className="ws_image" src={banner4} onClick={this.goEarn.bind(this)} />
          </SwiperItem>
        </Swiper>

        <Text className="wish-title">快捷服务</Text>

        <View className="wish_content">
          <Image className="wc_image" src={icon_wish1} onClick={this.toAssistantPage.bind(this)} />
          <Image className="wc_image" src={icon_wish2} onClick={this.toCarPage.bind(this)} />
        </View>

        <View className="wish_content">
          <Image className="wc_image" src={icon_wish3} onClick={this.goToGetMoney.bind(this)} />
          <Image className="wc_image" src={icon_wish4} onClick={this.goToEarnMoney.bind(this)} />
        </View>

        <View className="wish_msg_content">
          <Image className="wmc_icon" src={icon_message} />
          <Text className="wmc_text">{(messages[0] || {}).showText || '暂无消息'}</Text>
          <Text className="wmc_line" />
          <Text className="wmc_more" onClick={this.goToMessageCenter.bind(this)}>查看</Text>
        </View>

        <View className="wish_msg_gap" />
        {/* {(system.startsWith('iOS') || system.startsWith('ios')) && <View className='wish_msg_gap' />} */}

      </View>;
  }

  //到找车当副班页
  toCarPage(e) {

    let userId = localStorage.getItem('userId');
    if (userId) {
      Taro.navigateTo({ url: "/pages/wish/car/car?v=" + new Date().getTime() });
    } else {
      Taro.navigateTo({ url: "/pages/login/login?v=" + new Date().getTime() });
    }
  }

  //到找副班页
  toAssistantPage(e) {
    let userId = localStorage.getItem('userId');
    if (userId) {
      Taro.navigateTo({ url: "/pages/wish/assistant/assistant?v=" + new Date().getTime() });
    } else {
      Taro.navigateTo({ url: "/pages/login/login?v=" + new Date().getTime() });
    }
  }

  goToMessageCenter(e) {
    e.stopPropagation();

    let userId = localStorage.getItem('userId');
    if (userId) Taro.navigateTo({ url: "/pages/wish/messages/messages?v=" + new Date().getTime() });else Taro.navigateTo({ url: "/pages/login/login?v=" + new Date().getTime() });
  }

  goToGetMoney(e) {
    e.stopPropagation();

    let userId = localStorage.getItem('userId');
    if (userId) Taro.navigateTo({ url: "/pages/wish/lend/lend?v=" + new Date().getTime() });else Taro.navigateTo({ url: "/pages/login/login?v=" + new Date().getTime() });
  }

  goToEarnMoney(e) {
    e.stopPropagation();

    const userId = localStorage.getItem('userId');
    if (userId) Taro.navigateTo({ url: "/pages/wish/earn/earn?v=" + new Date().getTime() });else Taro.navigateTo({ url: "/pages/login/login?v=" + new Date().getTime() });
  }

  //外快
  goEarn(e) {
    e.stopPropagation();

    const userId = localStorage.getItem('userId');
    if (userId) Taro.navigateTo({ url: "/pages/wish/earn/earn?v=" + new Date().getTime() });else Taro.navigateTo({ url: "/pages/login/login?v=" + new Date().getTime() });
  }

  //周转
  goLend(e) {

    e.stopPropagation();

    let userId = localStorage.getItem('userId');
    if (userId) {
      Taro.navigateTo({ url: "/pages/wish/lend/lend?v=" + new Date().getTime() });
    } else {
      Taro.navigateTo({ url: "/pages/login/login?v=" + new Date().getTime() });
    }
  }

  //当副班
  goPartTimeMakeMoney(e) {
    e.stopPropagation();

    let userId = localStorage.getItem('userId');
    if (userId) {
      Taro.navigateTo({ url: "/pages/wish/car/car?v=" + new Date().getTime() });
    } else {
      Taro.navigateTo({ url: "/pages/login/login?v=" + new Date().getTime() });
    }
  }
  //招副班
  goAssistant(e) {

    let userId = localStorage.getItem('userId');
    if (userId) {
      Taro.navigateTo({ url: "/pages/wish/assistant/assistant?v=" + new Date().getTime() });
    } else {
      Taro.navigateTo({ url: "/pages/login/login?v=" + new Date().getTime() });
    }
  }

}
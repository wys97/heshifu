import Nerv from "nervjs";
import './lend.css?v=20190703108';
import Taro, { getSystemInfo as _getSystemInfo, showToast as _showToast, showLoading as _showLoading, hideLoading as _hideLoading } from "@tarojs/taro-h5";
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components';
import Netservice from "../../../netservice";
import Common from "../../../common";


import { AtInput } from 'taro-ui';

import banner1 from '../../../images/wish/lend/banner1.png';

import icon_normal from '../../../images/wish/radio_normal.png';
import icon_select from '../../../images/wish/radio_select.png';

export default class Lend extends Taro.Component {

  config = {
    navigationBarTitleText: '周转'
  };

  constructor() {
    super();

    this.canSubmitClick = true; //支付按钮防止连续点击 
  }

  state = {
    times: [{ value: 1, text: '1~30天' }, { value: 2, text: '30天~1年' }, { value: 3, text: '1年以上' }],
    timesIndex: -1,

    amounts: [{ value: 1, text: '1000 ~ 1万' }, { value: 2, text: '1万 ~ 5万' }, { value: 3, text: '5万以上' }],
    amountsIndex: -1,

    preferences: [{ value: 1, text: '纯信用借款产品' }, { value: 2, text: '抵押借款产品（汽车、房产）' }],
    preferencesIndex: -1,

    repayments: [{ value: 1, text: '按日计息，随借随还' }, { value: 2, text: '按月等额，长期超划算' }, { value: 3, text: '按月付息，到期还本' }, { value: 4, text: '一次性还本付息' }],
    repaymentsIndex: -1,

    works: [{ value: 1, text: '出租车司机' }, { value: 2, text: '网约车司机' }],
    worksIndex: -1,

    earnings: [{ value: 1, text: '5000~8000元' }, { value: 2, text: '8000~12000元' }, { value: 3, text: '12000~15000元' }, { value: 4, text: '15000元以上' }],
    earningsIndex: -1,

    emergencys: [{ value: 1, text: '越快越好，即刻需求' }, { value: 2, text: '近期有可能需要' }, { value: 3, text: '暂时不需要' }],
    emergencysIndex: -1,

    name: '',
    phoneNumber: '',

    system: 'android'
  };

  componentWillMount() {
    let phone = localStorage.getItem('phone') || '';
    this.setState({ phoneNumber: phone });

    _getSystemInfo({
      success: res => {
        this.setState({ system: res.system });
      }
    });
  }

  componentDidMount() {
    var h = document.body.scrollHeight;
    window.onresize = function () {
      if (document.body.scrollHeight < h) document.getElementsByClassName("money-submit")[0].style.display = "none";else document.getElementsByClassName("money-submit")[0].style.display = "block";
    };
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    let { times, timesIndex, amounts, amountsIndex, preferences, preferencesIndex, repayments, repaymentsIndex, works, worksIndex, earnings, earningsIndex,
      emergencys, emergencysIndex, name, phoneNumber, system } = this.state;
    console.log(system == 'iOS');
    return <View className="container-money  bottom-gap">

        <Swiper className="money-swiper">
          <SwiperItem>
            <Image className="ms_image" src={banner1} style="pointer-events: none" />
          </SwiperItem>
        </Swiper>

        <View className="time-view">
          <Text className="tv-title">周转周期</Text>

          <View className="tv-content">
            {times.map((item, index) => {
            return <View className="tvc-view" key={index} onClick={this.onTimeChange.bind(this, index)}>
                <Image className="tvcv_image" src={timesIndex == index ? icon_select : icon_normal} style="pointer-events: none" />
                <Text className="tvcv-text">{item.text}</Text>
              </View>;
          })}
          </View>

          <View className="tv-line" />
        </View>

        <View className="time-view">
          <Text className="tv-title">周转金额(元)</Text>

          <View className="tv-content">
            {amounts.map((item, index) => {
            return <View className="tvc-view" key={index} onClick={this.onAmountChange.bind(this, index)}>
                <Image className="tvcv_image" src={amountsIndex == index ? icon_select : icon_normal} style="pointer-events: none" />
                <Text className="tvcv-text">{item.text}</Text>
              </View>;
          })}
          </View>

          <View className="tv-line" />
        </View>

        <View className="time-view">
          <Text className="tv-title">产品偏好</Text>

          <View className="tv-content">
            {preferences.map((item, index) => {
            return <View className="tvc-view" key={index} onClick={this.onPreferenceChange.bind(this, index)}>
                <Image className="tvcv_image" src={preferencesIndex == index ? icon_select : icon_normal} style="pointer-events: none" />
                <Text className="tvcv-text">{item.text}</Text>
              </View>;
          })}
          </View>

          <View className="tv-line" />
        </View>

        <View className="time-view">
          <Text className="tv-title">还款方式偏好</Text>

          <View className="tv-content">
            {repayments.map((item, index) => {
            return <View className="tvc-view" key={index} onClick={this.onRepaymentChange.bind(this, index)}>
                <Image className="tvcv_image" src={repaymentsIndex == index ? icon_select : icon_normal} style="pointer-events: none" />
                <Text className="tvcv-text">{item.text}</Text>
              </View>;
          })}
          </View>

          <View className="tv-line" />
        </View>

        <View className="time-view">
          <Text className="tv-title">您的工作</Text>

          <View className="tv-content">
            {works.map((item, index) => {
            return <View className="tvc-view" key={index} onClick={this.onWorkChange.bind(this, index)}>
                <Image className="tvcv_image" src={worksIndex == index ? icon_select : icon_normal} style="pointer-events: none" />
                <Text className="tvcv-text">{item.text}</Text>
              </View>;
          })}
          </View>

          <View className="tv-line" />
        </View>

        <View className="time-view">
          <Text className="tv-title">您的月收入范围</Text>

          <View className="tv-content">
            {earnings.map((item, index) => {
            return <View className="tvc-view" key={index} onClick={this.onEarningChange.bind(this, index)}>
                <Image className="tvcv_image" src={earningsIndex == index ? icon_select : icon_normal} style="pointer-events: none" />
                <Text className="tvcv-text">{item.text}</Text>
              </View>;
          })}
          </View>

          <View className="tv-line" />
        </View>

        <View className="time-view">
          <Text className="tv-title">您周转需求的紧急程度</Text>

          <View className="tv-content">
            {emergencys.map((item, index) => {
            return <View className="tvc-view" key={index} onClick={this.onEmergencyChange.bind(this, index)}>
                <Image className="tvcv_image" src={emergencysIndex == index ? icon_select : icon_normal} style="pointer-events: none" />
                <Text className="tvcv-text">{item.text}</Text>
              </View>;
          })}
          </View>

          <View className="tv-line" />
        </View>


        <View className="lend-name-view">
          <Text className="nv-title">您的称呼方式</Text>
          <AtInput className="nv-name-input" type="text" placeholder="请输入真实姓名" border={false} maxLength={10} adjustPosition={false} onBlur={this.onInputBlur.bind(this)} value={name} onChange={this.onNameChange.bind(this)} />

          <View className="tv-line" />
        </View>

        <View className="lend-name-view">
          <Text className="nv-title finally_title">请确认您的联系方式。人工客服会在60分钟内联系您，提供优选服务！</Text>
          <AtInput className="nv-name-input " type="phone" placeholder="请输入联系方式" placeholderStyle="color:#F2D3AB" border={false} maxLength={11} adjustPosition={false} onBlur={this.onInputBlur.bind(this)} value={phoneNumber} onChange={this.onPhoneNumberChange.bind(this)} />

          <View className="tv-line" />
        </View>

        {system == 'iOS' && <View className="tv-gap"></View>}
      
        <View className="money-submit" onClick={this.onSubmit.bind(this)}>提交</View>

      </View>;
  }

  onInputBlur() {
    let { system } = this.state;
    if (system.startsWith('iOS') || system.startsWith('ios')) window.scroll(0, 0);
  }

  onTimeChange(index) {
    this.setState({ timesIndex: index });
  }

  onAmountChange(index) {
    this.setState({ amountsIndex: index });
  }

  onPreferenceChange(index) {
    this.setState({ preferencesIndex: index });
  }

  onRepaymentChange(index) {
    this.setState({ repaymentsIndex: index });
  }

  onWorkChange(index) {
    this.setState({ worksIndex: index });
  }

  onEarningChange(index) {
    this.setState({ earningsIndex: index });
  }

  onEmergencyChange(index) {
    this.setState({ emergencysIndex: index });
  }

  onNameChange(value) {
    this.setState({ name: value.replace(/ /g, '') });
    return value;
  }

  onPhoneNumberChange(value) {
    this.setState({ phoneNumber: value });
    return value;
  }

  onSubmit(value) {
    let { times, timesIndex, amounts, amountsIndex, preferences, preferencesIndex, repayments, repaymentsIndex, works, worksIndex, earnings, earningsIndex, emergencys, emergencysIndex, name, phoneNumber } = this.state;

    if (timesIndex < 0) {
      _showToast({ title: '请选择周转周期', icon: 'none', duration: 2000 });
      return;
    }
    if (amountsIndex < 0) {
      _showToast({ title: '请选择周转金额', icon: 'none', duration: 2000 });
      return;
    }
    if (preferencesIndex < 0) {
      _showToast({ title: '请选择产品偏好', icon: 'none', duration: 2000 });
      return;
    }
    if (repaymentsIndex < 0) {
      _showToast({ title: '请选择还款方式偏好', icon: 'none', duration: 2000 });
      return;
    }
    if (worksIndex < 0) {
      _showToast({ title: '请选择您的工作', icon: 'none', duration: 2000 });
      return;
    }
    if (earningsIndex < 0) {
      _showToast({ title: '请选择您的月收入范围', icon: 'none', duration: 2000 });
      return;
    }
    if (emergencysIndex < 0) {
      _showToast({ title: '请选择您周转需求的紧急程度', icon: 'none', duration: 2000 });
      return;
    }

    if (name.length < 1) {
      _showToast({ title: '请输入称呼', icon: 'none', duration: 2000 });
      return;
    }
    if (phoneNumber.length < 1) {
      _showToast({ title: '请输入您的联系方式', icon: 'none', duration: 2000 });
      return;
    }

    let userId = localStorage.getItem('userId');
    if (userId) {
      if (!this.canSubmitClick) return;
      this.canSubmitClick = false;
      setTimeout(() => {
        this.canSubmitClick = true;
      }, 1500);

      _showLoading({ title: '正在提交中…' });
      Netservice.request({
        url: 'heque-backend/collect/saveLoanInfo',
        data: {
          userId: userId,
          phoneNum: phoneNumber,
          userName: name,
          money: amounts[amountsIndex].value,
          cycle: times[timesIndex].value,
          special: preferences[preferencesIndex].value,
          repayment: repayments[repaymentsIndex].value,
          job: works[worksIndex].value,
          salary: earnings[earningsIndex].value,
          emergent: emergencys[emergencysIndex].value
        },
        success: res => {
          _hideLoading();
          if (res.code !== Common.NetCode_NoError) {
            _showToast({ title: res.message, icon: 'none', duration: 2000 });
            return;
          }

          _showToast({ title: '提交成功', icon: 'success', duration: 2000 });
          Taro.navigateTo({ url: '/pages/wish/apply_success/apply_success?type=' + res.data.type + '&id=' + res.data.id + '&v=' + new Date().getTime() });
        },
        error: function (err) {
          _hideLoading();
          _showToast({ title: '提交失败', icon: 'none', duration: 2000 });
        }
      });
    } else {
      Taro.navigateTo({ url: "/pages/login/login?v=" + new Date().getTime() });
    }
  }

}
import './rent.css?v=20190703108';
import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components';
import Netservice from '../../../netservice.js';
import Common from '../../../common.js';

import { AtInput } from 'taro-ui'

import banner1 from '../../../images/wish/rent/banner1.png';

import icon_normal from '../../../images/wish/checkbox_normal.png';
import icon_select from '../../../images/wish/checkbox_select.png';

import rent_more from '../../../images/wish/rent/rent_more.png';


export default class Rent extends Component {

  config = {
    navigationBarTitleText: '定制租车',
  }

  constructor() {
    super();

    this.canSubmitClick = true; //按钮防止连续点击 
  }

  state = {
    preferences: [{ value: 1, text: '燃油车', checked: false, more: '' },
    { value: 2, text: '新能源车', checked: false, more: '' },
    { value: 3, text: '短租期', checked: false, more: '(3个月)' },
    { value: 4, text: '租车跑快车', checked: false, more: '(注重车辆性价比)' },
    { value: 5, text: '租车跑专车', checked: false, more: '(注重车辆品牌性能)' }],

    name: '',
    phoneNumber: '',

    system: 'android',
  }

  componentWillMount() {
    let phone = localStorage.getItem('phone') || '';
    this.setState({ phoneNumber: phone })

    Taro.getSystemInfo({
      success: res => { this.setState({ system: res.system }); }
    });

  }

  componentDidMount() {
    var h = document.body.scrollHeight;
    window.onresize = function () {
      if (document.body.scrollHeight < h) {
        document.getElementsByClassName("rent-submit")[0].style.display = "none";

        // setTimeout(() => {
        //   // document.body.scrollHeight = 1500;
        //   // window.scrollTo({ top: 1500, behavior: "smooth" });
        //   // window.scroll(0, 800);
        //   // document.body && (document.body.scrollTop = 500);
        // }, 500);

      } else
        document.getElementsByClassName("rent-submit")[0].style.display = "block";

    };
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    let { preferences, name, phoneNumber } = this.state;

    return (
      <View className='container-rent'>

        <Swiper className='rent-swiper'>
          <SwiperItem>
            <Image className='rs_image' src={banner1} style='pointer-events: none' />
          </SwiperItem>
        </Swiper>

        <View className='rent-time-view'>
          <Text className='rent-tv-title'>请勾选符合您要求的出行方案内容</Text>

          <View className='rent-tv-content'>
            {preferences.map((item, index) => {
              return (<View className='rent-tvc-view' key={index} onClick={this.onPreferenceChange.bind(this, index)}>
                <Image className='rent-tvcv_image' src={item.checked ? icon_select : icon_normal} style='pointer-events: none' />
                <Text className='rent-tvcv-text'>{item.text}</Text>
                <Text className='rent-tvcv-more'>{item.more}</Text>
              </View>)
            })}
          </View>

          <View className='rent-tv-line' />
        </View>

        <View className='rent-name-view'>
          <Text className='rnv-title'>您的称呼方式</Text>
          <AtInput className='rent-name-input' type='text' placeholder='请输入真实姓名' border={false} maxLength={10}
            onFocus={this.onInputFocus.bind(this)} onBlur={this.onInputBlur.bind(this)}
            value={name} onChange={this.onNameChange.bind(this)} />

          <View className='rent-tv-line' />
        </View>

        <View className='rent-name-view'>
          <Text className='rnv-title'>请确认您的联系方式</Text>
          <AtInput className='rent-name-input' type='phone' placeholder='请输入联系方式' border={false} maxLength={11}
            onFocus={this.onInputFocus.bind(this)} onBlur={this.onInputBlur.bind(this)}
            value={phoneNumber} onChange={this.onPhoneNumberChange.bind(this)} />

          <View className='rent-tv-line' />
        </View>

        <View className='rent-more-view'>
          <Image className='rent-more-image' src={rent_more} onClick={this.goToRent2.bind(this)} />
        </View>

        <View className='rent-submit' onClick={this.onSubmit.bind(this)} >提交</View>

      </View>
    )
  }



  onPreferenceChange(index) {
    let { preferences, } = this.state;
    let item = preferences[index];
    item.checked = !item.checked;
    preferences.splice(index, 1, item);

    this.setState({ preferences: preferences })
  }


  onInputFocus() {
    let { system } = this.state;
    if (system.startsWith('android') || system.startsWith('Android')) {

      setTimeout(() => {
        window.scrollTo({ top: 500, behavior: "smooth" });
        window.scroll(0, 500);
      }, 500);
    }
  }

  onInputBlur() {
    let { system } = this.state;
    if (system.startsWith('android') || system.startsWith('Android')) {

      // setTimeout(() => {
      //   this.setState({ showSubmit: true });
      // }, 1000);
    }

    if (system.startsWith('iOS') || system.startsWith('ios'))
      window.scroll(0, 0);
  }


  onNameChange(value) {
    this.setState({ name: value.replace(/ /g, '') })
    return value;
  }

  onPhoneNumberChange(value) {
    this.setState({ phoneNumber: value })
    return value;
  }


  onSubmit(value) {
    let { preferences, name, phoneNumber } = this.state;

    let list = preferences.filter(function (item) {
      return item.checked;
    });
    let valueArray = [];
    list.map(function (item) {
      valueArray.push(item.value);
    });

    if (valueArray.length <= 0) {
      Taro.showToast({ title: '请勾选出行方案内容', icon: 'none', duration: 2000 });
      return;
    }
    if (name.length < 1) {
      Taro.showToast({ title: '请输入您的称呼方式', icon: 'none', duration: 2000 });
      return;
    }
    if (phoneNumber.length < 1) {
      Taro.showToast({ title: '请输入您的联系方式', icon: 'none', duration: 2000 });
      return;
    }

    let userId = localStorage.getItem('userId');
    if (userId) {
      if (!this.canSubmitClick)
        return;
      this.canSubmitClick = false;
      setTimeout(() => {
        this.canSubmitClick = true
      }, 1500);

      Taro.showLoading({ title: '正在提交中…' });
      Netservice.request({
        url: 'heque-backend/collectCarInfo/add',
        data: {
          userId: userId,
          phoneNum: phoneNumber,
          userName: name,
          carType: valueArray.join(','),
        },
        success: res => {
          Taro.hideLoading();
          if (res.code !== Common.NetCode_NoError) {
            Taro.showToast({ title: res.message, icon: 'none', duration: 2000 });
            return;
          }

          Taro.showToast({ title: '提交成功', icon: 'success', duration: 2000 });

          Taro.navigateTo({ url: '/pages/wish/apply_success/apply_success?type=' + res.data.type + '&id=' + res.data.id + '&v=' + new Date().getTime() })
        },
        error: function (err) {
          Taro.hideLoading();
          Taro.showToast({ title: '提交失败', icon: 'none', duration: 2000 });
        }
      })
    }
    else {
      Taro.navigateTo({ url: '/pages/login/login' + '?v=' + new Date().getTime() })
    }
  }


  goToRent2(e) {
    e.stopPropagation();

    Taro.navigateTo({ url: '/pages/wish/rent2/rent2' });
  }

}
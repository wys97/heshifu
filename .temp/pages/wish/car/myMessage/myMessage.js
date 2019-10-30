import Nerv from "nervjs";
import Taro, { getSystemInfo as _getSystemInfo, showToast as _showToast } from "@tarojs/taro-h5";
import { View, Input, Image, Picker, Swiper, SwiperItem } from '@tarojs/components';
import './myMessage.css';
import { AtInput } from 'taro-ui';

import Netservice from "../../../../netservice";
import { getGlobalData } from '../../../../utils/global_data';
import Common from "../../../../common";

import my_information from '../../../../images/wish/car/my_information.png';
import btn_submit from '../../../../images/wish/car/btn_submit.png';
import arrow_right from '../../../../images/common/arrow_right.png';

import banner_rent from '../../../../images/wish/car/banner_rent.png';
import default_btn_next from '../../../../images/wish/car/default_btn_next.png';

export default class MyMessage extends Taro.Component {

  constructor(props) {
    super(props);

    //防重复点击
    this.preventRepeat = true;
  }

  config = {
    'navigationBarTitleText': '当副班赚钱'
  };

  state = {
    nameValue: '', //名字
    numberValue: '', //手机号
    ageValue: '', //年龄
    nativePlaceValue: [], //籍贯省份
    nativePlace: '请选择您的籍贯', //默认的籍贯提示
    showNativePlaceStyle: true, //籍贯的样式
    provinceData: [], //省份列表
    nativePlaceValueId: 1, //籍贯id

    showHighLight: false, //按钮高亮

    system: 'android' //系统

  };
  componentWillMount() {

    let numberValue = localStorage.getItem('phone');

    if (numberValue !== '' && numberValue !== null) this.setState({ numberValue, showHighLight: true });

    _getSystemInfo({
      success: res => {
        this.setState({ system: res.system });
      }
    });
  }

  componentDidMount() {
    let provinceName = [];
    let that = this;
    Netservice.request({
      url: 'heque-backend/work_driver/getProvinceAndCityList',
      method: 'GET',
      success: res => {
        let data = res.data;
        data.map(item => {
          provinceName.push(item.privinceName);
        });

        that.setState({
          provinceData: data,
          nativePlaceValue: provinceName
        });
      }
    });

    var h = document.body.scrollHeight;
    window.onresize = function () {
      if (document.body.scrollHeight < h) {
        document.getElementsByClassName("btn_submit_wrap")[0].style.display = "none";

        setTimeout(() => {
          window.scrollTo({ top: 500, behavior: "smooth" });
          // window.scroll(0, 500);
          // document.body && (document.body.scrollTop = 500);
        }, 300);
      } else {
        document.getElementsByClassName("btn_submit_wrap")[0].style.display = "block";
      }
    };
  }
  render() {
    let { nameValue, numberValue, ageValue, nativePlaceValue, nativePlace, showNativePlaceStyle, showHighLight } = this.state;

    return <View className="MyMessage">
                <Swiper className="MyMessage_swiper" circular autoplay={false} interval={3000} style="width:84%">
                    <SwiperItem className="MyMessage_SwiperItem" style="width:100%">
                        <Image className="MyMessage_swiper_image" src={banner_rent} style="pointer-events: none; width:100%" />
                    </SwiperItem>
                    {/* <SwiperItem className='pt2_SwiperItem' onClick={this.inviteFriends.bind(this)} >
                        <Image className='pt2_swiper_image' src={banner2} onClick={this.inviteFriends.bind(this)} />
                     </SwiperItem>
                     <SwiperItem className='pt2_SwiperItem' onClick={this.summerTopic.bind(this)}>
                        <Image className='pt2_swiper_image' src={banner3} onClick={this.summerTopic.bind(this)} />
                     </SwiperItem>*/}
                </Swiper>

                <Image src={my_information} className="MyMessage_head_img" style="pointer-events: none" />
                <View className="MyMessage_body_content">
                    <View className="MyMessage_content_type_wrap">
                        <View className="MyMessage_type_title">姓名</View>
                        <AtInput type="text" value={nameValue} className="MyMessage_content_input" placeholder="请输入您的姓名" maxLength="7" onChange={value => this.getNameValue(value)} onBlur={this.onInputBlur.bind(this)} />
                    </View>
                    <View className="MyMessage_content_type_wrap">
                        <View className="MyMessage_type_title">手机（必填）</View>
                        <Input type="number" value={numberValue} className="MyMessage_content_input" maxLength="11" placeholder="请输入您的联系号码" onChange={value => this.getNumberValue(value)} onBlur={this.onInputBlur.bind(this)} />
                    </View>
                    <View className="MyMessage_content_type_wrap">
                        <View className="MyMessage_type_title">年龄</View>
                        <Input type="number" value={ageValue} className="MyMessage_content_input" maxLength="2" placeholder="请输入你的年龄" onChange={value => this.getAgeValue(value)} onBlur={this.onInputBlur.bind(this)} />
                    </View>
                    <View className="MyMessage_content_type_wrap">
                        <View className="MyMessage_type_title">籍贯</View>
                        <Picker mode="nativePlaceValue" range={nativePlaceValue} onChange={this.Change.bind(this)} className="MyMessage_type_nativePlace_wrap">
                            <View className={showNativePlaceStyle ? 'MyMessage_nativePlace_title' : 'MyMessage_nativePlace_title2'}>
                                {nativePlace}
                                <Image src={arrow_right} className="MyMessage_arrow_right" style="pointer-events: none" />
                            </View>
                        </Picker>
                    </View>
                </View>
                <View className="btn_submit_wrap" onClick={this.submitBtn.bind(this)}>
                    <Image src={showHighLight ? btn_submit : default_btn_next} className="btn_submit_img" style="pointer-events: none" />
                </View>
            </View>;
  }

  //输入框失去焦点时
  onInputBlur() {
    let { system } = this.state;
    if (system.startsWith('iOS') || system.startsWith('ios')) window.scroll(0, 0);
  }

  //获取姓名
  getNameValue(value) {
    this.setState({
      nameValue: value.replace(/\s+/g, "")
    });
  }
  //获取手机
  getNumberValue(e) {
    this.setState({
      numberValue: e.detail.value
    });
    this.showHighLight(e.detail.value);
  }

  //获取年龄
  getAgeValue(e) {
    this.setState({
      ageValue: e.detail.value
    });
  }

  //选择籍贯
  Change(e) {

    let nativePlaceValue = this.state.nativePlaceValue;
    let provinceData = this.state.provinceData;

    if (this.state.nativePlace == '请选择您的籍贯') {
      this.setState({
        showNativePlaceStyle: true
      });
    } else {
      this.setState({
        showNativePlaceStyle: false
      });
    }

    if (typeof e.detail.value == 'number') {
      this.setState({
        nativePlace: nativePlaceValue[e.detail.value],
        showNativePlaceStyle: false
      });
    }

    if (typeof e.detail.value == 'object') {
      this.setState({
        nativePlace: nativePlaceValue[e.detail.value[0]],
        nativePlaceValueId: provinceData[e.detail.value[0]].id,
        showNativePlaceStyle: false

      });
    }
  }

  //必填项已选择，下一步按钮显示高亮
  showHighLight(phoneNumber) {
    if (phoneNumber == '' || phoneNumber.length !== 11) {

      this.setState({
        showHighLight: false
      });
    } else {
      this.setState({
        showHighLight: true
      });
    }
  }

  //提交按钮
  submitBtn(e) {
    e.stopPropagation();
    let { nameValue, numberValue, ageValue, nativePlace, showHighLight } = this.state;

    //防重复点击
    if (!this.preventRepeat) return;

    this.preventRepeat = false;

    setTimeout(() => {
      this.preventRepeat = true;
    }, 3000);

    if (numberValue == '' || numberValue == null) {
      _showToast({
        title: '请输入您的联系方式',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    if (numberValue.length < 11) {
      _showToast({
        title: '请输入正确的联系方式',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    if (!showHighLight) return;

    let nameValue2 = nameValue == '' ? '' : nameValue; //名字
    let ageValue2 = ageValue == '' ? '' : ageValue; //年龄
    let nativePlace2 = nativePlace == '请选择您的籍贯' ? '' : nativePlace; //籍贯

    let userId = localStorage.getItem('userId');
    let type = getGlobalData('type2');
    let pId = getGlobalData('pId2');
    let cId = getGlobalData('cId2');
    let provinceName = getGlobalData('provinceName2');
    let cityName = getGlobalData('cityName2');
    let driverTime = getGlobalData('driverTime2');
    let areaIds1 = getGlobalData('areaIds2');
    let areasName1 = getGlobalData('areasName2');

    //数组转字符串
    let areasName = areasName1.join(',');
    let areaIds = areaIds1.join(',');

    Netservice.request({
      url: 'heque-backend/work_driver/addDriver',
      method: 'POST',
      data: {
        userId: userId,
        type: type,
        pId: pId,
        cId: cId,
        areaIds: areaIds,
        provinceName: provinceName,
        cityName: cityName,
        areasName: areasName,
        driverTime: driverTime,
        userName: nameValue2,
        phoneNumber: numberValue,
        nativeName: nativePlace2,
        age: ageValue2
      },
      success: res => {
        if (res.code !== Common.NetCode_NoError) {
          _showToast({
            title: res.message,
            icon: 'none',
            duration: 1500
          });
        } else {

          Taro.redirectTo({ url: '/pages/wish/apply_success/apply_success?type=' + res.data.collectType + '&id=' + res.data.id + '&v=' + new Date().getTime() });
        }
      }
    });
  }

  componentDidShow() {
    super.componentDidShow && super.componentDidShow();
  }

  componentDidHide() {
    super.componentDidHide && super.componentDidHide();
  }

}
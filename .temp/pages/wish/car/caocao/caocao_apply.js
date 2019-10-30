import Nerv from "nervjs";
import Taro, { getSystemInfo as _getSystemInfo, showToast as _showToast, showLoading as _showLoading, hideLoading as _hideLoading } from "@tarojs/taro-h5";
import { View, Text, Image, Input, Swiper, SwiperItem, Picker } from '@tarojs/components';
import './caocao_apply.css';

import Netservice from "../../../../netservice";
import Common from "../../../../common";

import banner_rent1 from '../../../../images/wish/car/caocao/banner_rent.png';
import btn_submit from '../../../../images/wish/car/btn_submit.png';
import arrow_right from '../../../../images/common/arrow_right.png';

export default class CaocaoApply extends Taro.Component {

  config = {
    navigationBarTitleText: '曹操出行'
  };

  constructor() {
    super();
    this.canSubmitClick = true; //按钮防止连续点击 
  }

  state = {
    genderList: ['男', '女'],
    gender: '',
    genderValue: -1,

    ageList: ['1年', '2年', '3年', '3年以上'],
    driveAge: '', //驾龄
    ageValue: -1,

    provinces: [], //全部省份列表
    citys: [], //当前省份下的城市列表

    cityList: [], //全部城市列表，保存，备份
    city: '', //所选城市
    cityId: 0,

    name: '', //姓名
    IdCodeValue: '', //身份证号
    phoneNumber: '', //手机号

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
      if (document.body.scrollHeight < h) document.getElementsByClassName("ApplyDetails_btn_submit_wrap")[0].style.display = "none";else document.getElementsByClassName("ApplyDetails_btn_submit_wrap")[0].style.display = "block";
    };
  }

  componentDidShow() {
    this.getCitys();
  }

  getCitys() {
    let that = this;
    Netservice.request({
      url: 'heque-backend/work_driver/getProvinceAndCityList',
      method: 'GET',
      success: res => {
        if (res.code == Common.NetCode_NoError) {

          let provinces = [];
          res.data.map(item => {
            provinces.push(item.privinceName);
          });
          let citys = [];
          res.data[0].cityList.map(item => {
            citys.push(item.cityName);
          });

          that.setState({
            provinces, citys,
            cityList: res.data
          });
        }
      }
    });
  }

  render() {

    let { genderList, gender, ageList, driveAge, provinces, citys, city, name, IdCodeValue, phoneNumber } = this.state;

    return <View className="applyDetails">
                <Swiper className="ApplyDetails_swiper">
                    <SwiperItem className="ApplyDetails_SwiperItem" style="width:100%">
                        <Image className="ApplyDetails_swiper_image" src={banner_rent1} style="pointer-events: none; width:100%" />
                    </SwiperItem>
                </Swiper>

                <View className="ApplyDetails_content_wrap">
                    <View className="ApplyDetails_type_title">姓名</View>
                    <Input className="ApplyDetails_input" type="text" placeholder="请输入真实姓名" maxLength="7" onChange={this.setNameValue.bind(this)} onBlur={this.onInputBlur.bind(this)} />

                    <View className="ApplyDetails_type_title">性别</View>
                    <Picker mode="genderList" range={genderList} onChange={this.setChangeGender.bind(this)}>
                        <View className={gender.length > 0 ? 'ApplyDetails_select_type_wrap' : 'ApplyDetails_select_type_wrap2'}>
                            <Text>{gender.length > 0 ? gender : '请选择性别'}</Text>
                            <Image src={arrow_right} className="ApplyDetails_arrow_right_img" />
                        </View>
                    </Picker>

                    <View className="ApplyDetails_type_title">身份证</View>
                    <Input className="ApplyDetails_input" value={IdCodeValue} type="number" maxLength="18" placeholder="请输入您的身份证号" onChange={this.setIdCodeValue.bind(this)} onBlur={this.onInputBlur.bind(this)} />

                    <View className="ApplyDetails_type_title">驾龄</View>
                    <Picker mode="driveAgeValue" range={ageList} onChange={this.setChangedriveAgeValue.bind(this)}>
                        <View className={driveAge.length > 0 ? 'ApplyDetails_select_type_wrap' : 'ApplyDetails_select_type_wrap2'}>
                            <Text>{driveAge.length > 0 ? driveAge : '请选择驾龄'}</Text>
                            <Image src={arrow_right} className="ApplyDetails_arrow_right_img" />
                        </View>
                    </Picker>

                    <View className="ApplyDetails_type_title">城市</View>
                    <Picker mode="multiSelector" range={[provinces, citys]} onChange={this.onChange.bind(this)} onCancel={this.onCancel.bind(this)} onColumnChange={this.onColumnChange.bind(this)}>
                        <View className={city.length > 0 ? 'ApplyDetails_select_type_wrap' : 'ApplyDetails_select_type_wrap2'}>
                            <Text>{city.length > 0 ? city : '请选择您所在的城市'}</Text>
                            <Image src={arrow_right} className="ApplyDetails_arrow_right_img" />
                        </View>
                    </Picker>

                    <View className="ApplyDetails_type_title">手机号码</View>
                    <Input className="ApplyDetails_input" value={phoneNumber} type="number" maxLength="11" placeholder="请输入手机号码" onChange={this.setPhoneNumber.bind(this)} onBlur={this.onInputBlur.bind(this)} />
                </View>

                <View className="ApplyDetails_btn_submit_wrap" onClick={this.submitBtn.bind(this)}>
                    <Image src={btn_submit} className="ApplyDetails_btn_submit_img" />
                </View>

            </View>;
  }

  onInputBlur() {
    let { system } = this.state;
    if (system.startsWith('iOS') || system.startsWith('ios')) window.scroll(0, 0);
  }

  //选择性别
  setChangeGender(e) {
    let genderList = this.state.genderList;
    this.setState({
      gender: genderList[e.detail.value[0]],
      genderValue: e.detail.value[0]
    });
  }

  //选择驾龄
  setChangedriveAgeValue(e) {
    let ageList = this.state.ageList;
    this.setState({
      driveAge: ageList[e.detail.value[0]],
      ageValue: Number(e.detail.value[0]) + 1
    });
  }

  //城市列表
  onChange(e) {
    let { provinces, cityList } = this.state;

    const columns = e.detail.value;

    const province = provinces[columns[0]];
    let list = cityList.filter(function (item) {
      return item.privinceName == province;
    });
    const currentCitys = list[0].cityList;
    const currentCity = currentCitys[columns[1]];

    //init
    let citys = [];
    cityList[0].cityList.map(item => {
      citys.push(item.cityName);
    });

    this.setState({ city: currentCity.cityName, cityId: currentCity.id, citys });
  }

  onCancel(e) {
    let { cityList } = this.state;

    //init
    let citys = [];
    cityList[0].cityList.map(item => {
      citys.push(item.cityName);
    });

    this.setState({ citys });
  }

  onColumnChange(e) {
    let { provinces, cityList } = this.state;

    const column = e.detail.column;
    const value = e.detail.value;
    if (column == 0) {
      const province = provinces[value];

      let list = cityList.filter(function (item) {
        return item.privinceName == province;
      });
      const currentCitys = list[0].cityList;
      let citys = [];
      currentCitys.map(item => {
        citys.push(item.cityName);
      });

      this.setState({ citys });
    }
  }

  //姓名
  setNameValue(e) {
    this.setState({ name: e.detail.value.replace(/ /g, '') });
  }
  //身份证
  setIdCodeValue(e) {
    this.setState({ IdCodeValue: e.detail.value });
  }
  //手机号
  setPhoneNumber(e) {
    this.setState({ phoneNumber: e.detail.value });
  }

  //提交按钮
  submitBtn(e) {
    e.stopPropagation();

    let { name, genderValue, IdCodeValue, phoneNumber, cityId, ageValue } = this.state;

    if (name.length < 1) {
      _showToast({ title: '请输入你的姓名', icon: 'none', duration: 1500 });
      return;
    }
    if (genderValue < 0) {
      _showToast({ title: '请选择性别', icon: 'none', duration: 1500 });
      return;
    }
    if (IdCodeValue.length < 18) {
      _showToast({ title: '请输入正确的身份证号', icon: 'none', duration: 1500 });
      return;
    }
    if (ageValue < 0) {
      _showToast({ title: '请选择驾龄', icon: 'none', duration: 1500 });
      return;
    }
    if (cityId < 1) {
      _showToast({ title: '请选择城市', icon: 'none', duration: 1500 });
      return;
    }
    if (phoneNumber.length < 11) {
      _showToast({ title: '请输入正确的手机号', icon: 'none', duration: 1500 });
      return;
    }

    let userId = localStorage.getItem('userId');
    if (userId) {
      this.canSubmitClick = false;
      setTimeout(() => {
        this.canSubmitClick = true;
      }, 1500);

      _showLoading({ title: '正在提交中…' });
      Netservice.request({
        url: 'heque-backend/collectCaoCaoInfo/add',
        data: {
          userId: userId,
          phoneNum: phoneNumber,
          userName: name,
          city: cityId,
          speakAddress: '',
          sex: genderValue,
          identityCard: IdCodeValue,
          driveAge: ageValue
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

  componentDidHide() {
    super.componentDidHide && super.componentDidHide();
  }

}
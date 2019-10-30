import Nerv from "nervjs";
import Taro, { getSystemInfo as _getSystemInfo, showToast as _showToast, showLoading as _showLoading, hideLoading as _hideLoading } from "@tarojs/taro-h5";
import { View, Swiper, SwiperItem, Picker, Image, Input, Text } from '@tarojs/components';
import './yadi.css';
import { AtInput } from 'taro-ui';

import Netservice from "../../../../netservice";
import Common from "../../../../common";

import banner_rent1 from '../../../../images/wish/car/yadi/banner_yadi.png';

import card_yadi01 from '../../../../images/wish/car/yadi/card_yadi01.png';
import card_yadi03 from '../../../../images/wish/car/yadi/card_yadi02.png';
import card_yadi04 from '../../../../images/wish/car/yadi/card_yadi03.png';
import card_yadi02 from '../../../../images/wish/car/yadi/card_yadi04.png';
import radio_normal from '../../../../images/wish/radio_normal.png';
import radio_select from '../../../../images/wish/radio_select.png';

import btn_submit from '../../../../images/wish/car/btn_submit.png';
import arrow_right from '../../../../images/common/arrow_right.png';

export default class Yadi extends Taro.Component {

  config = {
    navigationBarTitleText: '亚滴租车'
  };

  constructor() {
    super();

    this.canSubmitClick = true; //按钮防止连续点击 
  }

  state = {
    name: '',
    phoneNumber: '',

    provinces: [], //全部省份列表
    citys: [], //当前省份下的城市列表

    cityList: [], //全部城市列表，保存，备份
    city: '', //所选城市
    cityId: 0,

    carType: 1,

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
      if (document.body.scrollHeight < h) document.getElementsByClassName("Yadi_btn_submit_wrap")[0].style.display = "none";else {
        document.getElementsByClassName("Yadi_btn_submit_wrap")[0].style.display = "block";
      }
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

    let { name, phoneNumber, provinces, citys, city, carType } = this.state;

    return <View className="Yadi">
                <Swiper className="Yadi_swiper">
                    <SwiperItem className="Yadi_SwiperItem" style="width:100%">
                        <Image className="Yadi_swiper_image" src={banner_rent1} style="pointer-events: none; width:100%" />
                    </SwiperItem>
                </Swiper>

                <View className="Yadi_introduce_module_title">车型可选</View>
                <View className="Yadi_car_type_wrap">
                    {carType == 1 && <Image className="Yadi_car_type_img" src={card_yadi01} />}
                    {carType == 2 && <Image className="Yadi_car_type_img" src={card_yadi02} />}
                    {carType == 3 && <Image className="Yadi_car_type_img" src={card_yadi03} />}
                    {carType == 4 && <Image className="Yadi_car_type_img" src={card_yadi04} />}
                </View>
                <View className="Yadi_car_select_type_wrap">
                    <View className="Yadi_car_type" onClick={() => this.SwitchoverCarType(1)}>
                        <Image className="Yadi_car_type_img_icon" src={carType == 1 ? radio_select : radio_normal} />
                        <Text className="Yadi_car_type_name">比亚迪秦</Text>
                    </View>
                    <View className="Yadi_car_type" onClick={() => this.SwitchoverCarType(2)}>
                        <Image className="Yadi_car_type_img_icon" src={carType == 2 ? radio_select : radio_normal} />
                        <Text className="Yadi_car_type_name">比亚迪e5-450</Text>
                    </View>
                    <View className="Yadi_car_type" onClick={() => this.SwitchoverCarType(3)}>
                        <Image className="Yadi_car_type_img_icon" src={carType == 3 ? radio_select : radio_normal} />
                        <Text className="Yadi_car_type_name">比亚迪 宋MAX</Text>
                    </View>
                    <View className="Yadi_car_type" onClick={() => this.SwitchoverCarType(4)}>
                        <Image className="Yadi_car_type_img_icon" src={carType == 4 ? radio_select : radio_normal} />
                        <Text className="Yadi_car_type_name">腾势</Text>
                    </View>

                </View>

                <View className="Yadi_content_wrap">
                    <View className="Yadi_type_title">姓名</View>
                    <AtInput className="" value={name} type="text" placeholder="请输入真实姓名" maxLength="7" onBlur={this.onInputBlur.bind(this)} onChange={this.setNameValue.bind(this)} />

                    <View className="Yadi_type_title">手机</View>
                    <Input className="Yadi_input" value={phoneNumber} type="number" maxLength="11" placeholder="请输入手机号码" onBlur={this.onInputBlur.bind(this)} onChange={this.setPhoneNumber.bind(this)} />

                    <View className="Yadi_type_title">城市</View>
                    <Picker mode="multiSelector" range={[provinces, citys]} onChange={this.onChange.bind(this)} onCancel={this.onCancel.bind(this)} onColumnChange={this.onColumnChange.bind(this)}>
                        <View className={city.length > 0 ? 'Yadi_select_type_wrap' : 'Yadi_select_type_wrap2'}>
                            <Text>{city.length > 0 ? city : '请选择您所在的城市'}</Text>
                            <Image src={arrow_right} className="Yadi_arrow_right_img" />
                        </View>
                    </Picker>

                </View>

                <View className="Yadi_btn_submit_wrap" onClick={this.submitBtn.bind(this)}>
                    <Image src={btn_submit} className="Yadi_btn_submit_img" />
                </View>
            </View>;
  }

  onInputBlur() {
    let { system } = this.state;
    if (system.startsWith('iOS') || system.startsWith('ios')) {
      window.scroll(0, 0);
    }
  }

  //切换车的类型
  SwitchoverCarType(type) {
    this.setState({ carType: type });
  }

  setNameValue(value) {
    this.setState({ name: value.replace(/\s+/g, "") });
  }

  setPhoneNumber(e) {
    this.setState({ phoneNumber: e.detail.value });
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

    // this.setState({ city: currentCity.cityName, cityId: currentCity.id, citys });
    //选择省，没选市时，默认选第一个市
    if (currentCity == undefined) {
      let defaultCurrentCitys = currentCitys[0];
      this.setState({ city: defaultCurrentCitys.cityName, cityId: defaultCurrentCitys.id, citys });
    } else {

      this.setState({ city: currentCity.cityName, cityId: currentCity.id, citys });
    }
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

  submitBtn(e) {
    e.stopPropagation();

    let { name, phoneNumber, cityId, carType } = this.state;

    if (name.length < 1) {
      _showToast({ title: '请输入您的姓名', icon: 'none', duration: 3000 });
      return;
    }
    if (phoneNumber.length < 11) {
      _showToast({ title: '请输入正确的手机号', icon: 'none', duration: 3000 });
      return;
    }
    if (cityId <= 0) {
      _showToast({ title: '请选择您所在的城市', icon: 'none', duration: 2000 });
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
        url: 'heque-backend/collectYaDiInfo/add',
        data: {
          userId: userId,
          phoneNum: phoneNumber,
          userName: name,
          city: cityId,
          carType: carType
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
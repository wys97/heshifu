import Nerv from "nervjs";
import './rent2.css?v=20190703108';
import Taro, { getSystemInfo as _getSystemInfo, showToast as _showToast, showLoading as _showLoading, hideLoading as _hideLoading } from "@tarojs/taro-h5";
import { View, Text, Image, Swiper, SwiperItem, Picker } from '@tarojs/components';
import Netservice from "../../../netservice";
import Common from "../../../common";

import { AtInput } from 'taro-ui';

import banner1 from '../../../images/wish/rent/banner1.png';

import icon_normal from '../../../images/wish/checkbox_normal.png';
import icon_select from '../../../images/wish/checkbox_select.png';

import arrow_right from '../../../images/common/arrow_right.png';

export default class Rent extends Taro.Component {

  config = {
    navigationBarTitleText: '精准选车'
  };

  constructor() {
    super();

    this.canSubmitClick = true; //按钮防止连续点击 
  }

  state = {
    brands: [{ value: 1, text: '比亚迪', checked: false }, { value: 2, text: '本田', checked: false }, { value: 3, text: '日产', checked: false }, { value: 4, text: '雪铁龙', checked: false }, { value: 5, text: '荣威', checked: false }, { value: 6, text: '大众', checked: false }],
    otherBrandChecked: false,
    otherBrand: '',

    dynamics: [{ value: 0, text: '不限' }, { value: 1, text: '汽油' }, { value: 2, text: '纯电动' }, { value: 3, text: '油电混合' }, { value: 4, text: '油气混合' }],
    dynamicIndex: 0,

    gearboxes: [{ value: 0, text: '不限' }, { value: 1, text: '自动挡' }, { value: 2, text: '手动挡' }],
    gearboxIndex: 0,

    displacements: [{ value: 0, text: '不限' }, { value: 1, text: '1-2L' }, { value: 2, text: '2-3L' }, { value: 3, text: '3L以上' }],
    displacementIndex: 0,

    ages: [{ value: 0, text: '不限' }, { value: 1, text: '新车' }, { value: 2, text: '6个月以下' }, { value: 3, text: '6-12个月' }, { value: 4, text: '1-2年' }, { value: 5, text: '2-3年' }, { value: 6, text: '3年以上' }],
    ageIndex: 0,

    features: [{ value: 1, text: '操控好', checked: false }, { value: 2, text: '油耗低', checked: false }, { value: 3, text: '故障少', checked: false }, { value: 4, text: '空间大', checked: false }],

    monies: [{ value: 0, text: '不限', checked: false }, { value: 1, text: '2000~4000元', checked: false }, { value: 2, text: '4000~6000元', checked: false }, { value: 3, text: '6000元以上', checked: false }],
    moneyIndex: 0,

    times: [{ value: 0, text: '不限', checked: false }, { value: 1, text: '3个月以下', checked: false }, { value: 2, text: '3~6个月', checked: false }, { value: 3, text: '6~12个月', checked: false }, { value: 4, text: '12~24个月', checked: false }, { value: 5, text: '24个月以上', checked: false }],
    timeIndex: 0,

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
      if (document.body.scrollHeight < h) document.getElementsByClassName("rent2-submit")[0].style.display = "none";else document.getElementsByClassName("rent2-submit")[0].style.display = "block";
    };
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    let { brands, otherBrandChecked, otherBrand, dynamics, dynamicIndex, gearboxes, gearboxIndex, displacements, displacementIndex, ages, ageIndex,
      features, monies, moneyIndex, times, timeIndex, name, phoneNumber, system } = this.state;

    return <View className="container-rent2">

        <Swiper className="rent2-swiper">
          <SwiperItem>
            <Image className="r2s_image" src={banner1} style="pointer-events: none" />
          </SwiperItem>
        </Swiper>

        <Text className="rent2-title">您对车有什么要求？</Text>

        <View className="rent2-time-view">
          <Text className="rent2-tv-title">品牌偏好</Text>

          <View className="rent2-tv-content">
            {brands.map((item, index) => {
            return <View className="rent2-tvc-view" key={index} onClick={this.onBrandChange.bind(this, index)}>
                <Image className="rent2-tvcv_image" src={item.checked ? icon_select : icon_normal} style="pointer-events: none" />
                <Text className="rent2-tvcv-text">{item.text}</Text>
              </View>;
          })}

            <View className="rent2-other-view">
              <View className="rent2-tvc-view2" onClick={this.onOtherBrandChecked.bind(this)}>
                <Image className="rent2-tvcv_image" src={otherBrandChecked ? icon_select : icon_normal} style="pointer-events: none" />
                <Text className="rent2-tvcv-text">其他品牌</Text>
              </View>

              <View className="rent2_other-input-view">
                <AtInput className="rent2-tvcv-input" type="text" placeholder="请输入品牌名称" border={false} maxLength={15} onFocus={this.onInputFocus.bind(this)} onBlur={this.onInputBlur.bind(this)} value={otherBrand} onChange={this.onOtherBrandChange.bind(this)} />
                <View className="other-input-line" />
              </View>
            </View>

          </View>

        </View>


        <View className="rent2-picker-view">
          <View className="rent2-pv-top">
            <Text className="rent2-pvt-title">动力类型</Text>
            <Picker className="rent2-pvt-picker" range={dynamics} rangeKey="text" onChange={this.onDynamicChange.bind(this)}>
              <View className="rent2-pvt-right">
                <Text className="rent2-pvt-content"> {dynamics[dynamicIndex].text}</Text>
                <Image className="rent2-pvt-image" src={arrow_right} style="pointer-events: none" />
              </View>
            </Picker>
          </View>

          <View className="rent2-pv-line" />
        </View>

        <View className="rent2-picker-view">
          <View className="rent2-pv-top">
            <Text className="rent2-pvt-title">变速箱</Text>
            <Picker className="rent2-pvt-picker" range={gearboxes} rangeKey="text" onChange={this.onGearboxChange.bind(this)}>
              <View className="rent2-pvt-right">
                <Text className="rent2-pvt-content"> {gearboxes[gearboxIndex].text}</Text>
                <Image className="rent2-pvt-image" src={arrow_right} style="pointer-events: none" />
              </View>
            </Picker>
          </View>

          <View className="rent2-pv-line" />
        </View>

        <View className="rent2-picker-view">
          <View className="rent2-pv-top">
            <Text className="rent2-pvt-title">排量</Text>
            <Picker className="rent2-pvt-picker" range={displacements} rangeKey="text" onChange={this.onDisplacementChange.bind(this)}>
              <View className="rent2-pvt-right">
                <Text className="rent2-pvt-content"> {displacements[displacementIndex].text}</Text>
                <Image className="rent2-pvt-image" src={arrow_right} style="pointer-events: none" />
              </View>
            </Picker>
          </View>

          <View className="rent2-pv-line" />
        </View>

        <View className="rent2-picker-view">
          <View className="rent2-pv-top">
            <Text className="rent2-pvt-title">车龄</Text>
            <Picker className="rent2-pvt-picker" range={ages} rangeKey="text" onChange={this.onAgeChange.bind(this)}>
              <View className="rent2-pvt-right">
                <Text className="rent2-pvt-content"> {ages[ageIndex].text}</Text>
                <Image className="rent2-pvt-image" src={arrow_right} style="pointer-events: none" />
              </View>
            </Picker>
          </View>

          <View className="rent2-pv-line" />
        </View>

        <View className="rent2-time-view">
          <Text className="rent2-tv-title">车款亮点</Text>

          <View className="rent2-tv-content">
            {features.map((item, index) => {
            return <View className="rent2-tvc-view" key={index} onClick={this.onFeatureChange.bind(this, index)}>
                <Image className="rent2-tvcv_image" src={item.checked ? icon_select : icon_normal} style="pointer-events: none" />
                <Text className="rent2-tvcv-text">{item.text}</Text>
              </View>;
          })}
          </View>

          <View className="rent2-tv-line" />
        </View>


        <Text className="rent2-title">您对租赁方案的要求？</Text>

        <View className="rent2-picker-view">
          <View className="rent2-pv-top">
            <Text className="rent2-pvt-title">租金</Text>
            <Picker className="rent2-pvt-picker" range={monies} rangeKey="text" onChange={this.onMoneyChange.bind(this)}>
              <View className="rent2-pvt-right">
                <Text className="rent2-pvt-content"> {monies[moneyIndex].text}</Text>
                <Image className="rent2-pvt-image" src={arrow_right} style="pointer-events: none" />
              </View>
            </Picker>
          </View>

          <View className="rent2-pv-line" />
        </View>

        <View className="rent2-picker-view">
          <View className="rent2-pv-top">
            <Text className="rent2-pvt-title">租期</Text>
            <Picker className="rent2-pvt-picker" range={times} rangeKey="text" onChange={this.onTimeChange.bind(this)}>
              <View className="rent2-pvt-right">
                <Text className="rent2-pvt-content"> {times[timeIndex].text}</Text>
                <Image className="rent2-pvt-image" src={arrow_right} style="pointer-events: none" />
              </View>
            </Picker>
          </View>

          <View className="rent2-pv-line" />
        </View>



        <View className="rent2-name-view">
          <Text className="rent2-nv-title">您的称呼方式</Text>
          <AtInput className="rent2-nv-name-input" type="text" placeholder="请输入您称呼" border={false} maxLength={10} onFocus={this.onInputFocus.bind(this)} onBlur={this.onInputBlur.bind(this)} value={name} onChange={this.onNameChange.bind(this)} />

          <View className="rent2-tv-line" />
        </View>

        <View className="rent2-name-view bottom-gap">
          <Text className="rent2-nv-title">请确认您的联系方式</Text>
          <AtInput className="rent2-nv-name-input" type="phone" placeholder="请输入联系方式" border={false} maxLength={11} onFocus={this.onInputFocus.bind(this)} onBlur={this.onInputBlur.bind(this)} value={phoneNumber} onChange={this.onPhoneNumberChange.bind(this)} />

          <View className="rent2-tv-line" />
        </View>
        {system == 'iOS' && <View className="rent2-line"></View>}

        <View className="rent2-submit" onClick={this.onSubmit.bind(this)}>提交</View>

      </View>;
  }

  onBrandChange(index) {
    let { brands } = this.state;
    let item = brands[index];
    item.checked = !item.checked;
    brands.splice(index, 1, item);

    this.setState({ brands: brands });
  }

  onOtherBrandChecked() {
    let { otherBrandChecked } = this.state;
    otherBrandChecked = !otherBrandChecked;
    this.setState({ otherBrandChecked: otherBrandChecked });
  }

  onOtherBrandChange(value) {
    this.setState({ otherBrand: value.replace(/ /g, '') });
    return value;
  }

  onDynamicChange(e) {
    if (typeof e.detail.value == 'number') this.setState({ dynamicIndex: e.detail.value });else if (typeof e.detail.value == 'object') this.setState({ dynamicIndex: e.detail.value[0] });
  }

  onGearboxChange(e) {
    if (typeof e.detail.value == 'number') this.setState({ gearboxIndex: e.detail.value });else if (typeof e.detail.value == 'object') this.setState({ gearboxIndex: e.detail.value[0] });
  }

  onDisplacementChange(e) {
    if (typeof e.detail.value == 'number') this.setState({ displacementIndex: e.detail.value });else if (typeof e.detail.value == 'object') this.setState({ displacementIndex: e.detail.value[0] });
  }

  onAgeChange(e) {
    if (typeof e.detail.value == 'number') this.setState({ ageIndex: e.detail.value });else if (typeof e.detail.value == 'object') this.setState({ ageIndex: e.detail.value[0] });
  }

  onFeatureChange(index) {
    let { features } = this.state;
    let item = features[index];
    item.checked = !item.checked;
    features.splice(index, 1, item);

    this.setState({ features: features });
  }

  onMoneyChange(e) {
    if (typeof e.detail.value == 'number') this.setState({ moneyIndex: e.detail.value });else if (typeof e.detail.value == 'object') this.setState({ moneyIndex: e.detail.value[0] });
  }

  onTimeChange(e) {
    if (typeof e.detail.value == 'number') this.setState({ timeIndex: e.detail.value });else if (typeof e.detail.value == 'object') this.setState({ timeIndex: e.detail.value[0] });
  }

  onInputFocus() {
    // let { system } = this.state;
    // if (system.startsWith('android') || system.startsWith('Android')) {

    //   setTimeout(() => {
    //     window.scrollTo({ top: 500, behavior: "smooth" });
    //     window.scroll(0, 500);
    //   }, 500);
    // }
  }

  onInputBlur() {
    let { system } = this.state;
    if (system.startsWith('iOS') || system.startsWith('ios')) window.scroll(0, 0);
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
    let { brands, otherBrandChecked, otherBrand, dynamics, dynamicIndex, gearboxes, gearboxIndex, displacements, displacementIndex, ages, ageIndex,
      features, monies, moneyIndex, times, timeIndex, name, phoneNumber } = this.state;

    let bList = brands.filter(function (item) {
      return item.checked;
    });
    let brandArray = [];
    bList.map(function (item) {
      brandArray.push(item.text);
    });
    if (otherBrandChecked) brandArray.push(otherBrand);

    if (brandArray.length <= 0) {
      _showToast({ title: '请勾选品牌偏好', icon: 'none', duration: 2000 });
      return;
    }

    let fList = features.filter(function (item) {
      return item.checked;
    });
    let featureArray = [];
    fList.map(function (item) {
      featureArray.push(item.text);
    });
    if (featureArray.length <= 0) {
      _showToast({ title: '请勾选车款亮点', icon: 'none', duration: 2000 });
      return;
    }

    if (name.length < 1) {
      _showToast({ title: '请输入您的称呼', icon: 'none', duration: 2000 });
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
        url: 'heque-backend/collectPreciseCarInfo/add',
        data: {
          userId: userId,
          phoneNum: phoneNumber,
          userName: name,
          carBrand: brandArray.join(','),
          powerType: dynamicIndex,
          gearbox: gearboxIndex,
          displacement: displacementIndex,
          carAge: ageIndex,
          preference: featureArray.join(','),
          rent: moneyIndex,
          leaseTerm: timeIndex
        },
        success: res => {
          _hideLoading();
          if (res.code !== Common.NetCode_NoError) {
            _showToast({ title: res.message, icon: 'none', duration: 2000 });
            return;
          }

          _showToast({ title: '提交成功', icon: 'success', duration: 2000 });

          Taro.redirectTo({ url: '/pages/wish/apply_success/apply_success?type=' + res.data.type + '&id=' + res.data.id + '&v=' + new Date().getTime() });
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
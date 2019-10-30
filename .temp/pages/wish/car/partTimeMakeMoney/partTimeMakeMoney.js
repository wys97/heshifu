import Nerv from "nervjs";
import Taro, { showToast as _showToast } from "@tarojs/taro-h5";
import { View, Text, Image, Picker, Swiper, SwiperItem } from '@tarojs/components';
import { AtCheckbox } from 'taro-ui';
import './partTimeMakeMoney.css';

import Netservice from "../../../../netservice";
import { setGlobalData } from '../../../../utils/global_data';

import arrow_right from '../../../../images/common/arrow_right.png';
import need from '../../../../images/wish/car/need.png';
import icon_select from '../../../../images/wish/radio_select.png';
import icon_notselect from '../../../../images/take/icon_notselect.png';

import tick_sheet from '../../../../images/wish/car/tick_sheet.png';
import btn_next from '../../../../images/wish/car/btn_next.png';

import banner_rent from '../../../../images/wish/car/banner_rent.png';
import default_btn_next from '../../../../images/wish/car/default_btn_next.png';

export default class PartTimeMakeMoney extends Taro.Component {
  config = {
    'navigationBarTitleText': '当副班赚钱'
  };
  state = {
    workTimeType: 0, //副班的时间段类型  默认为0:不选， 1: 白班   2：夜班   3.都可以 

    provinceAndCity: '请选择省市', //省市默认值

    multiSelector: [], //省市数据
    checkboxOption: [], //所有的区县的列表
    checkedList: ['请选择区域'],
    showDistrictList: false, // true显示区县
    checkAll: false, //显示区县时的全选功能

    driveAge: '请选择驾龄', //驾龄
    driveAgeValue: ['1年', '2年', '3年', '3年以上'],
    checkedListWrap: [], //缓存的区域的数据   //确定时。显示的数据
    driveAgeType: 1, //对驾龄要求 0-不限 1-1年 2-2年 3-3年及以上
    determinedName: '', //省名
    provinceDataId: 1, //省id
    provinceData: [], //请求的省市列表
    updateList: false, //是否切换了城市 
    districtData: [], //选中的区县的列表
    checkedDistrictId: [], //选中的区域id
    cityName: '', //城市名
    cityId: '', //城市id
    initializeDate: [], //省市的初始化数据

    showHighLight: false //按钮高亮

  };

  componentDidMount() {
    let provinceName = [];
    let cityName = [];

    let that = this;
    Netservice.request({
      url: 'heque-backend/work_driver/getProvinceAndCityList',
      method: 'GET',
      success: res => {
        let data = res.data;
        data.map(item => {
          provinceName.push(item.privinceName);
        });
        cityName.push(data[0].cityList[0].cityName);
        that.setState({
          provinceData: data,
          multiSelector: [provinceName, cityName],
          initializeDate: [provinceName, cityName],
          provinceData2: provinceName
        });
      }
    });
  }

  render() {
    const { workTimeType, provinceAndCity, showDistrictList, checkboxOption, checkedList, checkAll, driveAge, showHighLight } = this.state;

    //选择区域的组件
    let districtComponent = <View className="checkboxOption_wrap">
            <View className="checkboxOption_content">
                <View className="checkboxOption_Operating_box">
                    <Text onClick={this.deselectDistrict.bind(this)}>取消</Text>
                    <Text>请选择区域</Text>
                    <Text onClick={this.confirmDistrict.bind(this)}>确认</Text>
                </View>
                <View className="checkboxOption_check_all_wrap" onClick={this.checkAllBtn.bind(this)}>
                    {checkAll ? <View className="check_all_img">
                        <Image src={tick_sheet} className="check_all_img_tick_sheet" style="pointer-events: none" />
                    </View> : <View className="check_all_img2">
                        </View>}
                    <Text>全选</Text>
                </View>
                <AtCheckbox options={checkboxOption} selectedList={this.state.checkedList} onChange={this.handleChange.bind(this)} />
            </View>
        </View>;

    return <View className="partTimeMakeMoney">
                <Swiper className="partTimeMakeMoney_swiper" circular autoplay={false} interval={3000} style="width:84%">
                    <SwiperItem className="partTimeMakeMoney_SwiperItem" style="width:100%">
                        <Image className="partTimeMakeMoney_swiper_image" src={banner_rent} style="pointer-events: none; width:100%" />
                    </SwiperItem>
                    {/* <SwiperItem className='pt2_SwiperItem' onClick={this.inviteFriends.bind(this)} >
                        <Image className='pt2_swiper_image' src={banner2} onClick={this.inviteFriends.bind(this)} />
                     </SwiperItem>
                     <SwiperItem className='pt2_SwiperItem' onClick={this.summerTopic.bind(this)}>
                        <Image className='pt2_swiper_image' src={banner3} onClick={this.summerTopic.bind(this)} />
                     </SwiperItem>*/}
                </Swiper>
                <Image src={need} className="partTimeMakeMoney_need_img" style="pointer-events: none" />
                <View className="partTimeMakeMoney_need_wrap">
                    <View>
                        <View className="partTimeMakeMoney_type_title">副班代班时间</View>
                        <View className="partTimeMakeMoney_time_type_wrap">
                            <View className="partTimeMakeMoney_time_type" onClick={() => this.switchoverTime(1)}>
                                <Image src={workTimeType == 1 ? icon_select : icon_notselect} className="partTimeMakeMoney_icon_notselect_img" style="pointer-events: none" />
                                <Text>白班</Text>
                            </View>
                            <View className="partTimeMakeMoney_time_type" onClick={() => this.switchoverTime(2)}>
                                <Image src={workTimeType == 2 ? icon_select : icon_notselect} className="partTimeMakeMoney_icon_notselect_img" style="pointer-events: none" />
                                <Text>晚班</Text>
                            </View>
                            <View className="partTimeMakeMoney_time_type" onClick={() => this.switchoverTime(3)}>
                                <Image src={workTimeType == 3 ? icon_select : icon_notselect} className="partTimeMakeMoney_icon_notselect_img" style="pointer-events: none" />
                                <Text>都可以</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View className="partTimeMakeMoney_type_title padding_30">接受哪几个区域交车</View>
                        <Picker mode="multiSelector" range={this.state.multiSelector} onChange={this.onChange} onColumnChange={this.onColumnChange.bind(this)} onCancel={this.onCancel.bind(this)}>
                            <View className={provinceAndCity.indexOf('请选择省市') == 0 ? 'partTimeMakeMoney_time_type type_common_class1' : 'partTimeMakeMoney_time_type type_common_class'}>
                                <Text className="">{provinceAndCity}</Text>
                                <Image src={arrow_right} className="partTimeMakeMoney_arrow_right_img" style="pointer-events: none" />
                            </View>
                        </Picker>
                    </View>
                    <View className={checkedList.indexOf('请选择区域') == 0 ? 'partTimeMakeMoney_time_type2' : 'partTimeMakeMoney_time_type type_common_class2'} onClick={this.selectRegion.bind(this)}>
                        <View className="partTimeMakeMoney_District">
                            {checkedList.map((item, index) => {
              return <Text key={index} className={item.indexOf('请选择区域') !== 0 ? 'partTimeMakeMoney_District_details' : 'partTimeMakeMoney_District_details2'}>{item}</Text>;
            })}
                        </View>
                        <Image src={arrow_right} className="partTimeMakeMoney_arrow_right_img" style="pointer-events: none" />
                    </View>
                    <View>
                        <View className="partTimeMakeMoney_type_title padding_30">个人驾龄</View>
                        <View className="partTimeMakeMoney_time_type type_common_class3">
                            <Picker mode="driveAgeValue" range={this.state.driveAgeValue} onChange={this.setChange} className="partTimeMakeMoney_driveAge_wrap">
                                <View className={driveAge.indexOf('请选择驾龄') == 0 ? 'partTimeMakeMoney_driveAge' : 'partTimeMakeMoney_driveAge2'}>
                                    <Text>{driveAge}</Text>
                                    <Image src={arrow_right} className="partTimeMakeMoney_arrow_right_img" style="pointer-events: none" />
                                </View>
                            </Picker>
                        </View>
                    </View>
                </View>
                <View className="default_btn_next" onClick={this.nextStepBtn.bind(this)}>
                    <Image src={showHighLight ? btn_next : default_btn_next} className="default_btn_next_img" style="pointer-events: none" />
                </View>
                {showDistrictList && districtComponent}
            </View>;
  }

  //切换副班代班时间类型
  switchoverTime(type) {
    this.setState({
      workTimeType: type
    });
    setTimeout(() => {
      this.showHighLight();
    }, 20);
  }

  //取消选择省市时
  onCancel(e) {
    let multiSelector1 = this.state.multiSelector[0];
    this.setState({
      multiSelector: [multiSelector1, this.state.initializeDate[1]]
    });
  }

  //修改省市值
  onChange = e => {

    let provinceData = this.state.provinceData;
    let multiSelector1 = this.state.multiSelector[0];
    let determinedValue1 = multiSelector1[e.detail.value[0]];
    let multiSelector2 = this.state.multiSelector[1];
    let determinedValue2 = multiSelector2[e.detail.value[1]];

    let city = {};
    provinceData.map(item => {
      item.cityList.map(item2 => {

        if (item2.cityName == determinedValue2) {
          city = item2;
        }
      });
    });
    this.setState({
      provinceAndCity: determinedValue1 + ' - ' + determinedValue2,
      cityId: city.id,
      updateList: true,
      checkedList: ['请选择区域'],

      checkAll: false,
      cityName: city.cityName,
      determinedName: determinedValue1, //省名
      multiSelector: [multiSelector1, this.state.initializeDate[1]]
    });

    this.state.checkedDistrictId.length = 0;
    this.state.checkedListWrap.length = 0;

    setTimeout(() => {
      this.showHighLight();
    }, 20);
  };

  //选择省市是触发的函数
  onColumnChange(e) {

    let i = e.detail.value;
    let provinceData = this.state.provinceData;
    let multiSelector = this.state.multiSelector;

    let cityList = provinceData[i].cityList.map(item => {
      return item.cityName;
    });

    if (!(e.detail.column == 1)) {

      this.setState({
        provinceDataId: provinceData[i].id
      });

      multiSelector.splice(1, 1, cityList);
    }
  }

  //显示选择地区组件
  selectRegion(e) {
    e.stopPropagation();
    //未选择省市提示
    if (this.state.provinceAndCity.indexOf('请选择省市') == 0) {
      _showToast({
        title: '请先选择省市',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    let cityId = this.state.cityId;
    let checkboxOption = this.state.checkboxOption;

    //当显示区域为默认值时，清空默认值
    if (this.state.checkedList[0].indexOf('请选择区域') == 0) {
      this.setState({
        checkedList: []

      });
    }
    //更改城市时，请求数据
    if (this.state.updateList) {
      //清空上一个请求的数据
      checkboxOption.length = 0;

      Netservice.request({
        url: 'heque-backend/work_driver/getAreaList',
        method: 'GET',
        data: {
          id: cityId
        },
        success: res => {

          let district = res.data;

          district.map(item => {
            checkboxOption.push({ value: item.areaName, label: item.areaName });
          });

          if (checkboxOption) {
            this.setState({
              showDistrictList: true,
              updateList: false,
              districtData: district
            });
          }
        }
      });
    }

    if (checkboxOption) {
      this.setState({
        showDistrictList: true,
        updateList: false

      });
    }
  }

  //选择的区县
  handleChange(value) {
    let { checkboxOption, checkedDistrictId } = this.state;

    //是否全选
    if (value.length !== checkboxOption.length) {
      this.setState({
        checkAll: false
      });
    } else {
      this.setState({
        checkAll: true
      });
    }
    if (checkboxOption.length == 0) {
      this.setState({
        checkAll: false

      });
    }

    this.setState({
      checkedList: value
    });
  }

  //选择区县的确定按钮
  confirmDistrict(e) {
    e.stopPropagation();
    let { checkedList, districtData, checkedDistrictId } = this.state;
    checkedDistrictId.length = 0;
    checkedList.map(item => {
      districtData.map(item2 => {
        if (item2.areaName.indexOf(item) == 0) {
          checkedDistrictId.push(item2.id);
          checkedDistrictId.join(',');
        }
      });
    });

    if (this.state.checkedList.length == 0) {
      this.setState({
        checkedList: ['请选择区域'],
        showDistrictList: false,
        checkedListWrap: []

      });
    } else {
      this.setState({
        checkedListWrap: checkedList,
        showDistrictList: false

      });
    }
    setTimeout(() => {
      this.showHighLight();
    }, 20);
  }

  //选择区县的取消按钮
  deselectDistrict(e) {
    e.stopPropagation();
    let { checkedListWrap, checkedList, checkboxOption } = this.state;

    if (checkedListWrap.length == 0) {
      this.setState({
        checkedList: ['请选择区域'],

        showDistrictList: false

      });
    } else {
      this.setState({
        showDistrictList: false,
        checkedList: checkedListWrap

      });
    }

    if (checkedListWrap.length == checkboxOption.length) {
      this.setState({
        checkAll: true
      });
    } else {
      this.setState({
        checkAll: false
      });
    }
  }

  //是否全选功能
  checkAllBtn(e) {
    e.stopPropagation();
    let { checkAll, checkboxOption } = this.state;
    if (checkAll) {
      this.setState({
        checkAll: false,
        checkedList: []
      });
    } else {
      let label = checkboxOption.map(item => {
        return item.label;
      });

      this.setState({
        checkAll: true,
        checkedList: label
      });
    }
  }

  //修改驾龄
  setChange = e => {

    let driveAgeValue = this.state.driveAgeValue;

    if (typeof e.detail.value == 'number') {
      this.setState({
        driveAge: driveAgeValue[e.detail.value],
        driveAgeType: e.detail.value + 1
      });
    }

    if (typeof e.detail.value == 'string') {
      this.setState({
        driveAge: driveAgeValue[e.detail.value],
        driveAgeType: Number(e.detail.value) + 1
      });
    }

    if (typeof e.detail.value == 'object') {
      this.setState({
        driveAge: driveAgeValue[e.detail.value[0]],
        driveAgeType: Number(e.detail.value[0]) + 1
      });
    }

    setTimeout(() => {
      this.showHighLight();
    }, 20);
  };

  //必填项已选择，下一步按钮显示高亮
  showHighLight() {
    let { workTimeType, checkedDistrictId, determinedName, driveAge } = this.state;
    if (workTimeType == 0 || checkedDistrictId.length == 0 || determinedName == '' || driveAge == '请选择驾龄') {
      this.setState({
        showHighLight: false
      });
    } else {
      this.setState({
        showHighLight: true
      });
    }
  }

  //下一步按钮
  nextStepBtn(e) {

    e.stopPropagation();
    let { workTimeType, provinceAndCity, checkedList, driveAge, provinceDataId, cityId, determinedName, cityName, driveAgeType, checkedDistrictId, showHighLight } = this.state;
    if (workTimeType == 0) {
      _showToast({
        title: '请选择副班代班时间',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    if (provinceAndCity == '请选择省市') {
      _showToast({
        title: '请选择省市',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    if (checkedList[0].indexOf('请选择区域') == 0) {
      _showToast({
        title: '请选择区域',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    if (driveAge == '请选择驾龄') {
      _showToast({
        title: '请选择驾龄',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    if (!showHighLight) return;

    setGlobalData('type2', workTimeType);
    setGlobalData('pId2', provinceDataId);
    setGlobalData('cId2', cityId);
    setGlobalData('provinceName2', determinedName);
    setGlobalData('cityName2', cityName);
    setGlobalData('driverTime2', driveAgeType);
    setGlobalData('areaIds2', checkedDistrictId);
    setGlobalData('areasName2', checkedList);

    Taro.navigateTo({
      url: '/pages/wish/car/myMessage/myMessage?v=' + new Date().getTime()
    });
  }

  componentDidShow() {
    super.componentDidShow && super.componentDidShow();
  }

  componentDidHide() {
    super.componentDidHide && super.componentDidHide();
  }

}
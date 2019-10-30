import Nerv from "nervjs";
import Taro, { showToast as _showToast } from "@tarojs/taro-h5";
import { View, Text, Image, Picker, Swiper, SwiperItem } from '@tarojs/components';
import { AtCheckbox } from 'taro-ui';
import './assistant.css';

import Netservice from "../../../netservice";
import { setGlobalData } from '../../../utils/global_data';

import arrow_right from '../../../images/common/arrow_right.png';

import icon_select from '../../../images/wish/radio_select.png';
import icon_notselect from '../../../images/take/icon_notselect.png';
import assistant_title1 from '../../../images/wish/assistant/assistant_title1.png';

import btn_next from '../../../images/wish/car/btn_next.png';
import checkbox_normal from '../../../images/wish/checkbox_normal.png';
import checkbox_select from '../../../images/wish/checkbox_select.png';

import banner_rent from '../../../images/wish/car/banner_rent.png';
import default_btn_next from '../../../images/wish/car/default_btn_next.png';

export default class Assistant extends Taro.Component {
  config = {
    'navigationBarTitleText': '招副班'
  };
  state = {
    workTimeType: 0, //副班的时间段类型  默认为0:不选， 1: 白班   2：夜班   3.都可以 

    provinceAndCity: '请选择省市', //省市默认值

    multiSelector: [], //显示的省市数据

    checkboxOption: [], //区县 数据
    checkedList: ['请选择区域'],

    showDistrictList: false, // true显示区县

    checkAll: false, //显示区县时的全选功能

    driveAge: '请选择驾龄', //驾龄
    driveAgeValue: ['不限', '1年', '2年', '3年', '3年以上'],

    supplementaryTerms: [], //补充条件
    showDIYSupplementaryTerms: false, //显示补充条件的输入框
    checked1: 0,
    checked2: 0,
    checked3: 0,
    provinceData: [], //请求的省市列表
    cityId: '', //城市id
    updateList: false, //是否切换了城市 
    districtData: [], //选中的区县的列表
    checkedDistrictId: [], //选中的区域id
    checkedListWrap: [], //缓存的区域的数据   //确定时。显示的数据
    driveAgeType: 0, //对驾龄要求 0-不限 1-1年 2-2年 3-3年  4-三年以上
    provinceData2: [], //老乡籍贯
    provinceAndCity2: '请选择籍贯', //老乡籍贯
    provinceDataId: 1, //省的id
    cityName: '', //城市的名字
    determinedName: '', //省的名字
    initializeDate: [], //省市的初始化数据 


    showHighLight: false //按钮高亮

  };

  componentWillMount() {}

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
    const { workTimeType, provinceAndCity, showDistrictList, checkboxOption, checkedList, checkAll, driveAge, showDIYSupplementaryTerms, checked1, checked2, checked3,
      provinceData2, provinceAndCity2, showHighLight } = this.state;

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
                        <Image src={checkbox_select} className="check_all_img_tick_sheet" style="pointer-events: none" />
                    </View> : <View className="check_all_img2">
                        </View>}
                    <Text>全选</Text>
                </View>
                <AtCheckbox options={checkboxOption} selectedList={this.state.checkedList} onChange={this.handleChange.bind(this)} />
            </View>
        </View>;

    return <View className="Assistant">
                <Swiper className="Assistant_swiper" circular autoplay={false} interval={3000} style="width:84%">
                    <SwiperItem className="Assistant_SwiperItem" style="width:100%">
                        <Image className="Assistant_swiper_image" src={banner_rent} style="pointer-events: none; width:100%" />
                    </SwiperItem>
                    {/* <SwiperItem className='pt2_SwiperItem' onClick={this.inviteFriends.bind(this)} >
                        <Image className='pt2_swiper_image' src={banner2} onClick={this.inviteFriends.bind(this)} />
                     </SwiperItem>
                     <SwiperItem className='pt2_SwiperItem' onClick={this.summerTopic.bind(this)}>
                        <Image className='pt2_swiper_image' src={banner3} onClick={this.summerTopic.bind(this)} />
                     </SwiperItem>*/}
                </Swiper>
                <Image src={assistant_title1} className="Assistant_need_img" style="pointer-events: none" />
                <View className="Assistant_need_wrap">
                    <View>
                        <View className="Assistant_type_title">副班代班时间</View>
                        <View className="Assistant_time_type_wrap">
                            <View className="Assistant_time_type" onClick={() => this.switchoverTime(1)}>
                                <Image src={workTimeType == 1 ? icon_select : icon_notselect} className="Assistant_icon_notselect_img" style="pointer-events: none" />
                                <Text>白班</Text>
                            </View>
                            <View className="Assistant_time_type" onClick={() => this.switchoverTime(2)}>
                                <Image src={workTimeType == 2 ? icon_select : icon_notselect} className="Assistant_icon_notselect_img" style="pointer-events: none" />
                                <Text>晚班</Text>
                            </View>
                            <View className="Assistant_time_type" onClick={() => this.switchoverTime(3)}>
                                <Image src={workTimeType == 3 ? icon_select : icon_notselect} className="Assistant_icon_notselect_img" style="pointer-events: none" />
                                <Text>都可以</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View className="Assistant_type_title padding_30">接受哪几个区域交车</View>
                        <Picker mode="multiSelector" range={this.state.multiSelector} onChange={this.onChange} onColumnChange={this.onColumnChange.bind(this)} onCancel={this.onCancel.bind(this)}>
                            <View className={provinceAndCity.indexOf('请选择省市') == 0 ? 'Assistant_time_type3' : 'Assistant_time_type2'}>
                                <Text>{provinceAndCity}</Text>
                                <Image src={arrow_right} className="Assistant_arrow_right_img" style="pointer-events: none" />
                            </View>
                        </Picker>
                    </View>
                    <View className={checkedList.indexOf('请选择区域') == 0 ? 'Assistant_time_type3' : 'Assistant_time_type2'} onClick={this.selectRegion.bind(this)}>
                        <View className="Assistant_District">
                            {checkedList.map((item, index) => {
              return <Text key={index} className={item.indexOf('请选择区域') == 0 ? 'Assistant_District_details2' : 'Assistant_District_details'}>{item}</Text>;
            })}
                        </View>
                        <Image src={arrow_right} className="Assistant_arrow_right_img" style="pointer-events: none" />
                    </View>
                    <View>
                        <View className="Assistant_type_title padding_30">副班驾龄要求</View>
                        <Picker mode="driveAgeValue" range={this.state.driveAgeValue} onChange={this.setChange} className="Assistant_driveAge_wrap">
                            <View className={driveAge.indexOf('请选择驾龄') == 0 ? 'Assistant_driveAge2' : 'Assistant_driveAge'}>
                                <Text>{driveAge}</Text>
                                <Image src={arrow_right} className="Assistant_arrow_right_img" style="pointer-events: none" />
                            </View>
                        </Picker>
                    </View>
                    <View className="Assistant_supplement_title">补充其他要求（可不选）</View>
                    <View className="Assistant_supplement_type_wrap">
                        <View className="Assistant_supplement_type" onClick={() => this.setSupplementaryTerms(1)}>
                            <Image src={checked1 ? checkbox_select : checkbox_normal} className="Assistant_supplement_type_icon" style="pointer-events: none" />
                            <Text className="Assistant_supplement_type_name">三证齐全</Text>
                        </View>
                        <View className="Assistant_supplement_type" onClick={() => this.setSupplementaryTerms(2)}>
                            <Image src={checked2 ? checkbox_select : checkbox_normal} className="Assistant_supplement_type_icon" style="pointer-events: none" />
                            <Text className="Assistant_supplement_type_name">低于50岁</Text>
                        </View>
                        <View className="Assistant_supplement_type" onClick={() => this.setSupplementaryTerms(3)}>
                            <Image src={checked3 ? checkbox_select : checkbox_normal} className="Assistant_supplement_type_icon" style="pointer-events: none" />
                            <Text className="Assistant_supplement_type_name">老乡</Text>
                        </View>
                    </View>
                    {showDIYSupplementaryTerms && <Picker mode="provinceData2" range={provinceData2} onChange={this.onChange2}>
                        <View className={provinceAndCity2 == '请选择籍贯' ? 'Assistant_time_type3' : 'Assistant_time_type2'}>
                            <Text>{provinceAndCity2}</Text>
                        </View>
                    </Picker>}
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
      provinceAndCity: determinedValue1 + ' - ' + city.cityName,
      cityId: city.id,
      updateList: true,
      checkedList: ['请选择区域'],
      cityName: city.cityName,
      checkAll: false,
      determinedName: determinedValue1,
      multiSelector: [multiSelector1, this.state.initializeDate[1]]

    });

    this.state.checkedDistrictId.length = 0;
    this.state.checkedListWrap.length = 0;

    setTimeout(() => {
      this.showHighLight();
    }, 20);
  };

  //修改老乡籍贯
  onChange2 = e => {
    let { provinceData2 } = this.state;

    if (typeof e.detail.value == 'number') {
      this.setState({
        provinceAndCity2: provinceData2[e.detail.value]
      });
    }

    if (typeof e.detail.value == 'object') {
      this.setState({
        provinceAndCity2: provinceData2[e.detail.value[0]]

      });
    }
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

  //显示选择区域组件
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

  //选择的地区
  handleChange(value) {

    let { checkboxOption, checkedDistrictId } = this.state;
    //全选按钮样式
    if (value.length !== checkboxOption.length) {
      this.setState({
        checkAll: false
      });
    } else {
      this.setState({
        checkAll: true
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

    if (checkedList.length == 0) {
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

    if (checkedList.length == 0 && checkedListWrap.length == 0) {
      this.setState({
        showDistrictList: false,
        checkedList: ['请选择区域']
      });
    }

    if (checkedList.length !== 0 && checkedListWrap.length == 0) {
      this.setState({
        showDistrictList: false,
        checkedList: ['请选择区域'],
        checkAll: false
      });
    }

    if (checkedList.length == 0 && checkedListWrap.length > 0) {
      this.setState({
        showDistrictList: false,
        checkedList: checkedListWrap
      });
    }

    if (checkedList.length > 0 && checkedListWrap.length > 0) {
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
        driveAgeType: e.detail.value
      });
    }

    if (typeof e.detail.value == 'object') {
      this.setState({
        driveAge: driveAgeValue[e.detail.value[0]],
        driveAgeType: e.detail.value[0]

      });
    }

    setTimeout(() => {
      this.showHighLight();
    }, 20);
  };

  //选择补充条件
  setSupplementaryTerms(type) {

    let { supplementaryTerms } = this.state;
    //查找数组里有没有相同的值
    if (supplementaryTerms.includes(type) == true) {
      //获取相同值的下标
      let num = supplementaryTerms.indexOf(type);
      //删除相同值
      supplementaryTerms.splice(num, 1);
      //是否选了老乡
      let aa = supplementaryTerms.indexOf(3);
      //没选老乡，不显示自定义的补充内容
      if (aa == -1) {
        this.setState({
          showDIYSupplementaryTerms: false
        });
      } else {
        this.setState({
          showDIYSupplementaryTerms: true
        });
      }

      if (type == 1) this.setState({ checked1: 0 });

      if (type == 2) this.setState({ checked2: 0 });

      if (type == 3) this.setState({
        checked3: 0,
        provinceAndCity2: '请选择籍贯'
      });
    } else {

      supplementaryTerms.push(type);

      if (supplementaryTerms.includes(3) == true) {
        this.setState({
          showDIYSupplementaryTerms: true
        });
      } else {
        this.setState({
          showDIYSupplementaryTerms: false
        });
      }

      if (type == 1) this.setState({ checked1: 1 });

      if (type == 2) this.setState({ checked2: 1 });

      if (type == 3) this.setState({ checked3: 1 });
    }
  }

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
    let { workTimeType, provinceAndCity, checkedList, driveAge, provinceDataId, determinedName, showHighLight, checkedDistrictId, cityName, driveAgeType, provinceAndCity2, checked1, checked2, checked3, cityId } = this.state;

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

    if (checked3 == 1 && provinceAndCity2 == '请选择籍贯') {
      _showToast({
        title: '请选择籍贯',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    //按扭置灰时
    if (!showHighLight) {
      return;
    }

    //驾龄
    let nativePlace = provinceAndCity2 == '请选择籍贯' ? '' : provinceAndCity2;

    setGlobalData('type', workTimeType);
    setGlobalData('pId', provinceDataId);
    setGlobalData('cId', cityId);
    setGlobalData('provinceName', determinedName);
    setGlobalData('cityName', cityName);
    setGlobalData('driverTime', driveAgeType);
    setGlobalData('threeCertificateReady', checked1);
    setGlobalData('lessFifty', checked2);
    setGlobalData('sameProvince', checked3);
    setGlobalData('nativeName', nativePlace);
    setGlobalData('areaIds', checkedDistrictId);
    setGlobalData('areasName', checkedList);

    Taro.navigateTo({
      url: '/pages/wish/assistant/assistantDetails/assistantDetails'
    });
  }

  componentDidShow() {
    super.componentDidShow && super.componentDidShow();
  }

  componentDidHide() {
    super.componentDidHide && super.componentDidHide();
  }

}
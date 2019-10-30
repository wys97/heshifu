import Nerv from "nervjs";
import './citys.css?v=20190705110';
import Taro, { showLoading as _showLoading, hideLoading as _hideLoading, showToast as _showToast } from "@tarojs/taro-h5";
import { View, Text, Image } from '@tarojs/components';
import Netservice from "../../../netservice";

import { setGlobalData, getGlobalData } from '../../../utils/global_data';

import iconLocation from '../../../images/home/icon_location_success.png';
import iconLocationFail from '../../../images/home/icon_location_fail.png';

export default class Citys extends Taro.Component {

  config = {
    navigationBarTitleText: '选择城市'
  };

  state = {
    city: '',
    cityList: []
  };

  componentWillMount() {
    this.getCitys();

    const city = getGlobalData('city');
    this.setState({
      city
    });
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  getCitys() {
    _showLoading({ title: '努力加载中…' });
    let that = this;
    Netservice.request({
      url: 'heque-eat/city/getRegionCities',
      method: 'GET',
      success: function (res) {

        _hideLoading();
        let cityList = res.data;
        that.setState({
          cityList: cityList
        });
      },
      error: function (err) {
        _hideLoading();
        _showToast({ title: '获取城市失败', icon: 'none', duration: 2000 });
      }
    });
  }

  render() {
    const locationCity = getGlobalData('locationCity');
    let { city, cityList } = this.state;

    const citys = <View className="city_list">
      {cityList.map((item, index) => {
        return <View key={index} className="city_list_content">
            <View className="city_area_name">{item.name}</View>
            <View className="city_name_list">
              {item.data.map((item2, index2) => {
              return <View key={index2} className="city_name" onClick={this.selectCity.bind(this, item2)}>{item2.name}</View>;
            })}
            </View>
          </View>;
      })}

    </View>;

    return <View className="container-citys">
        {/*固定头部*/}
        <View className="cc-header">
          <View className="cc-location">
            <Text className="location-title">当前定位</Text>
            {locationCity === undefined ? <View className="cc-city">
              <Image className="city-icon-fail" src={iconLocationFail} style="pointer-events: none" />
              <Text>定位失败</Text>
            </View> : <View className="cc-city">
              <Image className="city-icon" src={iconLocation} style="pointer-events: none" />
              <Text>{locationCity}</Text>
            </View>}
          </View>
        </View>

        <View className="city-list-view">
          <Text className="title-text">当前支持其他城市</Text>

          <View className="list-city">
            {citys}
          </View>

        </View>
      </View>;
  }

  goBack() {
    Taro.navigateBack();
  }

  selectCity(city, e) {

    setGlobalData('cityCode1', city.codeC);
    setGlobalData('city1', city.name);
    setGlobalData('cityChanged', true);

    localStorage.setItem('cityCode', city.codeC);
    localStorage.setItem('city', city.name);

    Taro.navigateBack();
  }

}
import './points.css?v=201907051107';
import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import Netservice from '../../netservice.js';
import Common from '../../common.js';
import { setGlobalData, getGlobalData } from '../../utils/global_data'

import arrowRight from '../../images/common/arrow_right.png';
import breathingSpace from '../../images/home/breathing_space.png';
import iconNearest1 from '../../images/home/icon_nearest1.png';
import OrderImgBtn from '../../images/home/go_details.png';


export default class Points extends Component {

  config = {
    navigationBarTitleText: '选择取餐点',
  }

  state = {
    cityCode: 0,
    city: '',
    pointList: []
  }

  componentWillMount() {
    const cityCode = localStorage.getItem('cityCode');
    const city = localStorage.getItem('city');
    this.setState({
      cityCode,
      city
    });
    const latitude = localStorage.getItem('latitude');
    const longitude = localStorage.getItem('longitude');

    this.getCityPoints(cityCode, latitude, longitude);
  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() {

    const cityCode = localStorage.getItem('cityCode');
    const city = localStorage.getItem('city');
    this.setState({
      cityCode,
      city
    });
    const latitude = localStorage.getItem('latitude');
    const longitude = localStorage.getItem('longitude');

    this.getCityPoints(cityCode, latitude, longitude);

  }

  componentDidHide() { }


  getCityPoints(cityCode, latitude, longitude) {
    let that = this;
    Netservice.request({
      url: 'heque-eat/eat/storeList',
      method: 'POST',
      data: {
        cityCode: cityCode,
        longitude: longitude,
        latitude: latitude
      },
      success: function (res) {

        let pointList = res.data;
        if (pointList.length <= 0)
          Taro.showToast({ title: '暂无符合条件的取餐点', icon: 'none', duration: 2000 });

        pointList.sort(function (point1, point2) {
          return point1.number - point2.number
        });

        // 修改时间
        for (let point of pointList) {
          let { foodTime1, foodTime2, foodTime3, foodTime4 } = point;

          point.suppleTime1 = foodTime1 ? (foodTime1.slice(0, 5) + '-' + foodTime1.slice(11, 16)) : '';
          point.suppleTime2 = foodTime2 ? '/ ' + (foodTime2.slice(0, 5) + '-' + foodTime2.slice(11, 16)) : '';
          point.suppleTime3 = foodTime3 ? '/ ' + (foodTime3.slice(0, 5) + '-' + foodTime3.slice(11, 16)) : '';
          point.suppleTime4 = foodTime4 ? '/ ' + (foodTime4.slice(0, 5) + '-' + foodTime4.slice(11, 16)) : '';

        }

        that.setState({ pointList: pointList })

      },
      error: function (err) {
      }
    })
  }



  render() {
    let { pointList, city } = this.state;

    const points = pointList.map((value, index) => {
      return <View className='Points_item' key={value.id}>
        <View className='Points-conent_wrap'>
          <View className='Points-conent_left'>
            <View className='Points-view_name'>
              <Text>{value.name}</Text>
              {index === 0 && <Image src={iconNearest1} className='Points-nearest' />}
            </View>

            <View className='Points-distance'>
              {value.number >= 1000 ?
                <Text><Text className='Points-distance_number'>{(value.number / 1000).toFixed(1)}</Text>km</Text>
                : <Text><Text className='Points-distance_number'>{value.number}</Text>m</Text>
              }
            </View>
            <View className='Points-address'>{value.adds}</View>
            <View className='Points-point-time'>
              <Text className='Points-time-title'>供餐时间 :</Text>
              <Text className='Points-time'>{value.suppleTime1} {value.suppleTime2} {value.suppleTime3} {value.suppleTime4}</Text>
            </View>
          </View>

          <View className='Points-conent_right'>
            {value.state && <View className='Points-order-btn' onClick={this.toOrder.bind(this, value)}>
              <Image src={OrderImgBtn} className='Points-OrderImgBtn-btn' />
            </View>}
            {!value.state &&
              <View className='Points-breathingSpace-btn'>
                <Image src={breathingSpace} className='Points-breathingSpace-btn' />
              </View>
            }
          </View>
        </View>
      </View>
    })

    return (
      <View className='default_points'>

        {/*固定头部*/}
        <View className='Points_points-header'>
          <View className='Points_ph-city' onClick={this.goCitys}>
            <Text>{city}</Text>
            <Image className='Points-arrow-right' src={arrowRight} />
          </View>
        </View>

        {/*取餐地点列表*/}
        <View className='points-list'>
          {points}
        </View>

      </View>
    )
  }


  goBack() {
    Taro.navigateBack()
  }

  //去门店页
  toOrder(point, e) {
 
    const currentPoint = getGlobalData('currentPoint');

    if (!currentPoint || (currentPoint.id != point.id)) {
      setGlobalData('currentPoint', point);
      setGlobalData('pointChanged', true);

      let { cityCode, city } = this.state;
      setGlobalData('cityCode', cityCode);
      setGlobalData('city', city);
    }

    let storesDetails = JSON.stringify(point);


    let pid = this.getUrlParam('pid');
    if (pid!==null) {
      setGlobalData('currentPoint', point);
      setGlobalData('pointChanged', true);
      Taro.redirectTo({
        url: '/pages/index/index?storesDetails=' + storesDetails + '&v=' + new Date().getTime()
      })

    } else {
     
        Taro.redirectTo({
          url: '/pages/home_components/package_or_buy/package_or_buy?storesDetails=' + storesDetails + '&v=' + new Date().getTime()
        })

    }




  }
  //去城市列表
  goCitys(e) {
    Taro.navigateTo({ url: '/pages/points/citys/citys' + '?v=' + new Date().getTime() })
  }


  // 网址中 解析、查找 
  getUrlParam(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let url = window.location.href.split('#')[0]
    let search = url.split('?')[1]
    if (search) {
      var r = search.substr(0).match(reg)
      if (r !== null)
        return unescape(r[2])
      return null
    } else
      return null
  }







}



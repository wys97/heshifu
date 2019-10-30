import './home_points.css?v=201907051107';
import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components';
import Netservice from '../../../netservice.js';
import Common from '../../../common.js';
import { setGlobalData, getGlobalData } from '../../../utils/global_data'

import arrowRight from '../../../images/common/arrow_right.png';


import banner1 from '../../../images/home/banner1.png'
import banner2 from '../../../images/home/banner2.png'
import banner3 from '../../../images/home/banner3.png'
import banner4 from '../../../images/home/banner4.png'


import resting from '../../../images/home/Resting.png'
import default_store_img from '../../../images/home/default_store_img.png'
import noServiceImg from '../../../images/home/no_service_img.png'

export default class HomePoints extends Component {

  config = {
    navigationBarTitleText: '点餐',
  }

  state = {
    cityCode: '', //城市编号
    city: '',    //城市名
    pointList: [],  //取餐点列表
    noShop: false, //没有取餐点
  }

  componentWillMount() {
    let cityCode = this.props.cityCode;
    let city = this.props.city;
    this.setState({
      cityCode,
      city
    });

    const latitude = getGlobalData('latitude');
    const longitude = getGlobalData('longitude');
    //请求城市门店
    this.getCityPoints(cityCode, latitude, longitude);
  }

  componentDidMount() { }

  
   //实时监听父组件传过来的值的变化
  componentWillReceiveProps(nextProps) {

    if (nextProps.cityCode && nextProps.cityCode != this.props.cityCode) {
      this.setState({
        cityCode: nextProps.cityCode,
        city: nextProps.city,
      });

      const latitude = getGlobalData('latitude');
      const longitude = getGlobalData('longitude');
      //请求城市门店
      this.getCityPoints(nextProps.cityCode, latitude, longitude);
    }
  }

  componentWillUnmount() { }

  componentDidHide() { }

  //请求城市门店
  getCityPoints(cityCode, latitude, longitude) {
    
    Taro.showLoading({ title: '努力加载中…' });
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
      Taro.hideLoading();

        let pointList = res.data;
        if (pointList.length <= 0) {
          that.setState({
            noShop: true,
          })
        } else {
          that.setState({
            noShop: false,
          })
        }

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
        Taro.hideLoading();
      }
    })
  }



  render() {
    let { pointList, city, noShop } = this.state;
    const points = pointList.map((value, index) => {
      return <View className='pl-item' key={value.id} onClick={this.toOrder.bind(this, value)}>
        <View className='plih-img_wrap'>
          {value.state?<Image src={ value.storeUrl!==null && value.storeUrl!=='' ? value.storeUrl : default_store_img } className='plih-img' />:
          <Image src={resting} className='plih-img' />}
        </View>
        <View className='pli_item_content'>
          <View className='pliht-view'>
            <Text className='pliht-view_name'>{value.name}</Text>
          </View>
          <View className='pli-address_wrap'>
            <View className='pli-address'>{value.adds}</View>
            <View className='pliht-distance'>
              {value.number >= 1000 ?
                <Text>
                  {(value.number / 1000).toFixed(1)}<Text className='points_distance_unit'> km</Text>
                </Text> :
                <Text >{value.number}<Text className='points_distance_unit'> m</Text></Text>
              }
            </View>
          </View>
          <View className='pli-point-time'>
            <Text className='pli-time-title'>营业时间 :</Text>
            <Text>{value.suppleTime1} {value.suppleTime2} {value.suppleTime3} {value.suppleTime4}</Text>
          </View>
        </View>
      </View>
    })

    return (
      <View className='container-points'>
        {/*固定头部*/}
        <View className='points-header'>
          <View className='ph-city' onClick={this.goCitys}>
            <Text>{city}</Text>
            <Image className='ph-arrow-right' src={arrowRight} />
          </View>
        </View>
        <Swiper className='points-swiper' circular autoplay interval={3000}>
          <SwiperItem className='points-swiper_Item'>
            <Image className='points_swiper_image' src={banner1} onClick={this.goEarn.bind(this)} />
          </SwiperItem>
          <SwiperItem >
            <Image className='points_swiper_image' src={banner2}  onClick={this.goLend.bind(this)} />
          </SwiperItem>
          <SwiperItem >
            <Image className='points_swiper_image' src={banner3}  onClick={this.goPartTimeMakeMoney.bind(this)} />
          </SwiperItem>
          <SwiperItem >
            <Image className='points_swiper_image' src={banner4} onClick={this.goAssistant.bind(this)} />
          </SwiperItem>
        </Swiper>
        {/*取餐地点列表*/}
        {!noShop ? <View className='points-list'>
          <View className='nearbyShop'>附近商家</View>
          {points}
        </View> :
          <Image src={noServiceImg} className='points_noServiceImg' style='pointer-events: none' />
        }
      </View>
    )
  }



  toOrder(point, e) {
    let storesDetails = JSON.stringify(point);
  
    Taro.navigateTo({ url: '/pages/home_components/package_or_buy/package_or_buy?storesDetails=' + storesDetails });
  }

  goCitys(e) {
    Taro.navigateTo({ url: '/pages/points/citys/citys' + '?v=' + new Date().getTime() })
  }


  //外快
  goEarn(e) {
    
    e.stopPropagation();
    
    let userId = localStorage.getItem('userId');
    if (userId) {
        Taro.navigateTo({ url: '/pages/wish/earn/earn' + '?v=' + new Date().getTime() })
    } else {
        Taro.navigateTo({ url: '/pages/login/login' + '?v=' + new Date().getTime() })
    }
}

//周转
goLend(e) {

    e.stopPropagation();

    let userId = localStorage.getItem('userId');
    if (userId) {
        Taro.navigateTo({ url: '/pages/wish/lend/lend' + '?v=' + new Date().getTime() })
    } else {
        Taro.navigateTo({ url: '/pages/login/login' + '?v=' + new Date().getTime() })
    }

}

//当副班
goPartTimeMakeMoney(e) {
    e.stopPropagation();

    let userId = localStorage.getItem('userId');
    if (userId) {
        Taro.navigateTo({ url: '/pages/wish/car/car' + '?v=' + new Date().getTime() })
    } else {
        Taro.navigateTo({ url: '/pages/login/login' + '?v=' + new Date().getTime() })
    }
 

}
//招副班
goAssistant(e) {


    let userId = localStorage.getItem('userId');
    if (userId) {
        Taro.navigateTo({ url: '/pages/wish/assistant/assistant' + '?v=' + new Date().getTime() })
    } else {
        Taro.navigateTo({ url: '/pages/login/login' + '?v=' + new Date().getTime() })
    }
}




}
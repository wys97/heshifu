import './package_or_buy.css?v=201907051107';
import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components';


import PointPackage from '../point_package/point_package.js';
import PointBuy from '../point_buy/point_buy.js';


import { setGlobalData, getGlobalData } from '../../../utils/global_data.js'


export default class PackageOrBuy extends Component {

  config = {
    navigationBarTitleText: '取餐点',
  }

  state = {
    currentPoint:{},
    currentCoupon:{},
  }

  componentWillMount(){

    if(this.$router.params.storesDetails!==undefined && this.$router.params.storesDetails!== null){
                let storesDetails = this.$router.params.storesDetails;
                let currentPoint = JSON.parse(decodeURIComponent(storesDetails));
                this.setState({
                    currentPoint,
                })
    }
  }

  componentDidShow(){
      //切换优惠券
      const couponChanged = getGlobalData('couponChanged') || false;
      if (couponChanged) {
        setGlobalData('couponChanged', false);
  
        const currentCoupon = getGlobalData('currentCoupon') || {};
        this.setState({ currentCoupon: currentCoupon });
    }
  }

  render() {
    const { currentPoint, currentCoupon } = this.state;
   
    return (
      <View className='PackageOrBuy'>
            {currentPoint.feeType==1?
                <PointPackage currentPoint={currentPoint}/>
                :
                <PointBuy  currentPoint={currentPoint} currentCoupon={currentCoupon}/>
            }
      </View>
    )
  }
}
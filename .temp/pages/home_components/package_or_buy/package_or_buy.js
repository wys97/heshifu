import Nerv from "nervjs";
import './package_or_buy.css?v=201907051107';
import Taro from "@tarojs/taro-h5";
import { View } from '@tarojs/components';

import PointPackage from "../point_package/point_package";
import PointBuy from "../point_buy/point_buy";

import { setGlobalData, getGlobalData } from "../../../utils/global_data";

export default class PackageOrBuy extends Taro.Component {

  config = {
    navigationBarTitleText: '取餐点'
  };

  state = {
    currentPoint: {},
    currentCoupon: {}
  };

  componentWillMount() {

    if (this.$router.params.storesDetails !== undefined && this.$router.params.storesDetails !== null) {
      let storesDetails = this.$router.params.storesDetails;
      let currentPoint = JSON.parse(decodeURIComponent(storesDetails));
      this.setState({
        currentPoint
      });
    }
  }

  componentDidShow() {
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

    return <View className="PackageOrBuy">
            {currentPoint.feeType == 1 ? <PointPackage currentPoint={currentPoint} /> : <PointBuy currentPoint={currentPoint} currentCoupon={currentCoupon} />}
      </View>;
  }

  componentDidMount() {
    super.componentDidMount && super.componentDidMount();
  }

  componentDidHide() {
    super.componentDidHide && super.componentDidHide();
  }

}
import Nerv from "nervjs";
import './apply_success.css?v=20190626110';
import Taro from "@tarojs/taro-h5";
import { View, Text, Image } from '@tarojs/components';

import successImg from '../../../images/wish/submit_success.png';

export default class ApplySuccess extends Taro.Component {

  config = {
    navigationBarTitleText: '提交成功'
  };

  state = {
    type: 0,
    id: 0
  };

  componentWillMount() {
    let type = this.$router.params.type || 0;
    let id = this.$router.params.id || 0;
    this.setState({ type, id });
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return <View className="container-apply-success">

      <View className="apply-content-view">
        <Image className="apply-image" src={successImg} mode="widthFix" />

        <Text className="apply-content-title">申请提交成功</Text>
        <Text className="apply-content-info" onClick={this.goBackHome.bind(this)}>返回赚钱首页</Text>

        <Text className="apply-content-detail" onClick={this.goToDetail.bind(this)}>查看申请详情</Text>
      </View>

    </View>;
  }

  goBackHome() {
    Taro.redirectTo({ url: "/pages/wish/wish?v=" + new Date().getTime() });
  }

  goToDetail() {
    const { type, id } = this.state;
    Taro.navigateTo({ url: '/pages/my/apply_detail/apply_detail?type=' + type + '&id=' + id + '&v=' + new Date().getTime() });
  }

}
import Nerv from "nervjs";
import Taro from "@tarojs/taro-h5";
import { View, Image } from '@tarojs/components';
import './noprize.css?v=201906202109';

import noPrizeImg from '../../images/prize/img_no_prize.png';
import iconClose from '../../images/prize/icon_close.png';

//抽奖/开奖 组件
export default class NoPrize extends Taro.Component {

  componentDidMount() {}

  render() {

    return <View className="no-prize-bg">
                <View className="no-prize-content">
                    <Image className="no-prize-img" src={noPrizeImg} onClick={this.tapNoPrize.bind(this)} />
                    <Image className="no-prize-close" src={iconClose} onClick={this.tapClose.bind(this)} />
                </View>
            </View>;
  }

  tapNoPrize(e) {
    e.stopPropagation();

    if (this.props.onTapNoPrize) this.props.onTapNoPrize();
  }

  tapClose(e) {
    e.stopPropagation();

    if (this.props.onTapClose) this.props.onTapClose();
  }
}
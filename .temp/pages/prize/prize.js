import Nerv from "nervjs";
import Taro from "@tarojs/taro-h5";
import { View, Image } from '@tarojs/components';
import './prize.css?v=20190704109';

import prizeImg from '../../images/prize/img_prize.png';
import openGif from '../../images/prize/open_prize.gif';

//抽奖/开奖 组件
export default class Prize extends Taro.Component {

  state = {
    openImg: prizeImg,
    background: "rgba(0, 0, 0, 0.5)"
  };

  componentWillMount() {}

  componentDidMount() {}

  render() {

    const { openImg, background } = this.state;

    return <View className="prize-background" style={{ "background": background }}>
                <View className="prize-content">
                    <Image className="prize-img" src={openImg} onClick={this.tapThePrize.bind(this)} />
                    {/* <Image className='no-prize-close' src={iconClose} onClick={this.tapPrizeClose.bind(this)} /> */}
                </View>
            </View>;
  }

  tapThePrize(e) {
    e.stopPropagation();

    this.setState({
      openImg: openGif,
      background: "rgba(0, 0, 0, 0)"
    });

    if (this.props.onTapThePrize) this.props.onTapThePrize();
  }

  tapPrizeClose(e) {
    e.stopPropagation();

    if (this.props.onTapClose) this.props.onTapClose();
  }

}
import Nerv from "nervjs";
import './messages.css?v=20190703108';
import Taro, { showLoading as _showLoading, hideLoading as _hideLoading, showToast as _showToast } from "@tarojs/taro-h5";
import { View, Text, Image } from '@tarojs/components';
import Netservice from "../../../netservice";
import Common from "../../../common";


import no_message from '../../../images/wish/no_message.png';

export default class Messages extends Taro.Component {

  config = {
    navigationBarTitleText: '消息列表',
    enablePullDownRefresh: true
  };

  state = {
    messages: [],
    pageIndex: 1,
    noMoreData: false
  };

  componentWillMount() {
    this.getMessages();
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {
    this._offReachBottom = Taro.onReachBottom({
      callback: this.onReachBottom,
      ctx: this,
      onReachBottomDistance: undefined
    });
  }

  componentDidHide() {
    this._offReachBottom && this._offReachBottom();
  }

  onReachBottom() {
    this.getMessages();
  }

  getMessages() {
    let userId = localStorage.getItem('userId');
    if (!userId) return;

    let { messages, pageIndex, noMoreData } = this.state;
    if (noMoreData) return;

    _showLoading({ title: '努力加载中…' });
    let that = this;
    Netservice.request({
      url: 'heque-backend/collect/queryMessageList?userId=' + userId + '&pageSize=10&pageIndex=' + pageIndex,
      method: 'GET',
      success: function (res) {
        _hideLoading();

        if (res.code !== Common.NetCode_NoError) {
          _showToast({ title: res.message, icon: 'none', duration: 2000 });
          return;
        }

        that.setState({
          messages: messages.concat(res.data),
          pageIndex: pageIndex + 1
        });

        if (res.data.length < 10) that.setState({ noMoreData: true });
      },
      error: function (err) {
        _hideLoading();
      }
    });
  }

  render() {
    let { messages } = this.state;

    const messageList = messages.map((item, index) => {

      return <View className="message-item" key={index} onClick={this.onTapItem.bind(this, item)}>

        <View className="mi-top">
          <Text className="mit-title">状态更新通知</Text>
          <Text className="mit-time">{item.createTime}</Text>
        </View>

        <Text className="mi-content">{item.showText}</Text>

        <View className="mi-line" />

      </View>;
    });

    const noMessageView = <View className="no-message-view">
      <Image src={no_message} className="nmv-img" style="pointer-events: none" />
    </View>;

    return <View className="container-messages">
        {messages.length > 0 ? messageList : noMessageView}
      </View>;
  }

  onTapItem(item, e) {
    //状态 0-待处理 1-处理中 2-处理完成 3-已取消
    if (item.state == 2) Taro.navigateTo({ url: '/pages/my/apply_detail/apply_detail?type=' + item.type + '&id=' + item.relateId + '&v=' + new Date().getTime() });
  }

}
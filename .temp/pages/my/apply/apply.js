import Nerv from "nervjs";
import './apply.css?v=20190703108';
import Taro, { showLoading as _showLoading, hideLoading as _hideLoading, showToast as _showToast, showModal as _showModal } from "@tarojs/taro-h5";
import { View, Text, Image } from '@tarojs/components';
import Netservice from "../../../netservice";
import Common from "../../../common";


import no_apply from '../../../images/my/no_apply.png';
import btn_cancel from '../../../images/my/btn_cancel.png';

export default class Apply extends Taro.Component {

  config = {
    navigationBarTitleText: '我的申请',
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
      url: 'heque-backend/collect/queryIssueList?userId=' + userId + '&pageSize=10&pageIndex=' + pageIndex,
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

      return <View className="apply-item" key={index} onClick={this.onTapItem.bind(this, item)}>

        <View className="ai-content">

          <View className="ai-left">
            <View className="ail-top">
              <Text className="ailt-state">{this.getStateStr(item.state)}</Text>
              <Text className="ailt-type">{this.getTypeStr(item.type)}</Text>
            </View>

            <Text className="ail-time1">{item.updateTime || item.createTime}</Text>
          </View>

          {item.state == 0 && <View className="ai-right_wrap" onClick={this.prepareCancel.bind(this, item)}>
            <Image src={btn_cancel} className="ai-right_img" style="pointer-events: none" />
          </View>}

        </View>

        <View className="ai-line" />

      </View>;
    });

    const noApplyView = <View className="no-apply-view">
      <Image src={no_apply} className="nav-img" style="pointer-events: none" />
    </View>;

    return <View className="container-apply">
        {messages.length > 0 ? messageList : noApplyView}
      </View>;
  }

  //状态 0-待处理 1-处理中 2-处理完成 3-已取消
  getStateStr(state) {
    if (state == 0) return '待处理';else if (state == 1) return '处理中';else if (state == 2) return '处理完成';else if (state == 3) return '已取消';else if (state == 4) return '处理失败';else if (state == 5) return '已关闭';
  }

  //0-周转 1-当副班 2-招副班 3-租车 4-亚滴租车 5-曹操出行 6-首汽约车 7-精准选车
  getTypeStr(type) {
    if (type == 0) return '周转';else if (type == 1) return '当副班';else if (type == 2) return '招副班';else if (type == 3) return '租车';else if (type == 4) return '亚滴租车';else if (type == 5) return '曹操出行';else if (type == 6) return '首汽约车';else if (type == 7) return '精准选车';
  }

  prepareCancel(item, e) {
    e.stopPropagation();

    let that = this;
    _showModal({
      content: '确定取消申请？',
      success(res) {
        if (res.confirm) {
          that.cancelItem(item);
        }
      }
    });
  }

  cancelItem(item) {
    if (item.state != 0) return;

    let userId = localStorage.getItem('userId');
    if (!userId) return;

    _showLoading({ title: '努力加载中…' });
    let that = this;

    let url = '';
    if (item.type == 0) url = 'heque-backend/collect/changeLoanInfo';else if (item.type == 1) url = 'heque-backend/work_driver/updateWorkDriverState';else if (item.type == 2) url = 'heque-backend/employ_driver/updateEmployDriverState';else if (item.type == 3) url = 'heque-backend/collectCarInfo/handle';else if (item.type == 4) url = 'heque-backend/collectYaDiInfo/handle';else if (item.type == 5) url = 'heque-backend/collectCaoCaoInfo/handle';else if (item.type == 6) url = 'heque-backend/collectShouQiInfo/handle';else if (item.type == 7) url = 'heque-backend/collectPreciseCarInfo/handle';

    Netservice.request({
      url: url,
      method: 'POST',
      data: {
        userId: userId,
        id: item.relateId,
        state: 3
      },
      success: function (res) {
        _hideLoading();

        if (res.code !== Common.NetCode_NoError) {
          _showToast({ title: res.message, icon: 'none', duration: 2000 });
          return;
        }

        that.setState({
          messages: [],
          pageIndex: 1,
          noMoreData: false
        }, () => {
          that.getMessages();
        });
      },
      error: function (err) {
        _hideLoading();
      }
    });
  }

  onTapItem(item, e) {

    Taro.navigateTo({ url: '/pages/my/apply_detail/apply_detail?type=' + item.type + '&id=' + item.relateId + '&v=' + new Date().getTime() });
  }

}
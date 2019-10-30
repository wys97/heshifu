import Nerv from "nervjs";
import Taro, { stopPullDownRefresh as _stopPullDownRefresh, showLoading as _showLoading, hideLoading as _hideLoading, showModal as _showModal } from "@tarojs/taro-h5";
import { View, Image, Text, PullDownRefresh } from '@tarojs/components';
import './order_history.css';

import Netservice from "../../../netservice";
import orderImg from '../../../images/my/noOrder.png';
import cancellationOrder from '../../../images/my/cancellation_order.png';
import { setGlobalData, getGlobalData } from '../../../utils/global_data';

export default class OrderHistory extends Taro.Component {
  config = {
    navigationBarTitleText: '历史订单',
    enablePullDownRefresh: true
  };
  state = {
    orderHistoryList: [], //数据
    status: [{ id: 1, state: '待支付' }, { id: 2, state: '支付失败' }, { id: 3, state: '已支付' }, { id: 4, state: '已取消' }, { id: 5, state: '退款处理中' }, { id: 6, state: '退款申请失败' }, { id: 7, state: '退款成功' }, { id: 8, state: '拒绝退款' }, { id: 9, state: '取消退款' }], // 状态
    pagenum: 1, //加载页
    onshow: 0, //显示加载中
    noHistory: false, //没有订单是显示图
    noMoreData: false //没有数据是停止请求


  };

  componentDidMount() {

    this.getOrderHistoryList(1);
  }

  componentDidShow() {
    //判断订单列表是否刷新  true刷新  false不刷新
    let orderStateChanged = getGlobalData('orderStateChanged') || false;

    if (orderStateChanged) {
      setGlobalData('orderStateChanged', false);
      Taro.redirectTo({
        url: '/pages/my/order_history/order_history'
      });
    }
    this._offReachBottom = Taro.onReachBottom({
      callback: this.onReachBottom,
      ctx: this,
      onReachBottomDistance: undefined
    });
    this.pullDownRefreshRef && this.pullDownRefreshRef.bindEvent();
  }
  //下拉刷新
  onPullDownRefresh() {
    _stopPullDownRefresh();
  }

  render() {
    let that = this;
    const { orderHistoryList, status, onshow, noHistory } = this.state;
    const HistoryList = orderHistoryList.map(item => {
      return <View key={item.id}>
        {/*使用箭头函数，调用函数传值 */}
        <View className="orderList" onClick={() => {
          this.theOrderDetails(item.id, item.state);
        }}>
          <View className="tradeMessage">
            <Text className="tradeName">{item.storeName}</Text>
            {status.map(item2 => {
              return <View key={item2.id} className={item.state == Number(item2.id) ? 'state_of_payment' : 'displayNone'}>
                {item.state == Number(item2.id) ? <Text>{item2.state}</Text> : ''}
              </View>;
            })}
          </View>
          <View className={item.state == 1 ? 'merchandise_news' : 'merchandise_news_state_4'}>
            <View className="merchandise_left">
              <Image src={item.dishesUrl} className="greensImg" />
              <View className="message">
                <View className="dish_name">{item.dishesName}</View>
                <View className="number">共{item.orderNum}件商品</View>
                <View className="Time">下单时间 : {item.createTime}</View>
              </View>
            </View>
            <View className="price">¥{item.paymentPrice}</View>
          </View>
          {item.state == 1 && <View className="orderList_buttom">
            <View className="orderList_btn" onClick={that.cancelOrder.bind(this, item.id)}>
              <Image src={cancellationOrder} className="orderList_btn_img" style="pointer-events: none" />
            </View>
          </View>}
        </View>
      </View>;
    });

    const _temp = <View className="order_history">
        {HistoryList}
        {noHistory ? <View className="noHistory">
          <Image className="noHistory_color" src={orderImg} style="pointer-events: none"></Image>
        </View> : <View className="Loadedtip">
            {onshow == 1 && <Text>拼命加载中...</Text>}
            {onshow == 2 && <Text> 没有更多订单了...</Text>}

          </View>}
      </View>;

    return <PullDownRefresh onRefresh={this.onPullDownRefresh && this.onPullDownRefresh.bind(this)} ref={ref => {
      if (ref) this.pullDownRefreshRef = ref;
    }}>{_temp}</PullDownRefresh>;
  }
  //上拉加载
  onReachBottom() {
    //请求的页数加1
    let pageNumber = this.state.pagenum + 1;

    this.setState({
      pagenum: pageNumber
    });
    //请求的页数
    this.getOrderHistoryList(pageNumber);
  }

  //请求数据
  getOrderHistoryList(pageNumber) {

    let that = this;
    //用户Id
    const userId = localStorage.getItem('userId');

    if (that.state.noMoreData) return;

    _showLoading({ title: '努力加载中...' });

    Netservice.request({
      url: 'heque-eat/eat/get_order_info_list',
      method: 'GET',
      data: {
        userId: userId,
        page: pageNumber,
        pageSize: 20
      },
      success: res => {

        let listData = res.data.data;
        //没有订单数据
        if (listData.length == 0 && that.state.pagenum == 1) {
          that.setState({
            onshow: 0,
            noHistory: true
          });
        } else {
          that.setState({
            noHistory: false,
            onshow: 1
          });
        }

        if (that.state.pagenum == 1) {
          that.setState({
            orderHistoryList: listData

          });
        } else {
          let orderHistoryList = that.state.orderHistoryList;
          that.setState({
            orderHistoryList: orderHistoryList.concat(listData),
            onshow: 1
          });
        }

        //请求完所有的数据了
        if (listData.length < 20) {
          that.setState({
            onshow: 2,
            noMoreData: true
          });
        }

        _hideLoading();
      }
    });
  }

  //点击取消订单按钮
  cancelOrder(id, e) {
    const userId = localStorage.getItem('userId');

    let that = this;
    //阻止冒泡
    e.stopPropagation();
    //修改订单状态
    _showModal({
      content: '确定取消订单？',
      success(res) {
        if (res.confirm) {
          _showLoading({ title: '努力加载中…' });
          Netservice.request({
            url: 'heque-eat/eat/delete_order',
            method: 'GET',
            data: {
              id: id
            },
            success: res => {
              _hideLoading();
              Netservice.request({
                url: 'heque-eat/eat/get_order_info_list',
                method: 'GET',
                data: {
                  userId: userId,
                  page: 1,
                  pageSize: 20
                },
                success: res => {
                  let ress = res.data.data;
                  //显示页面大于1
                  that.setState({
                    orderHistoryList: ress,
                    onshow: true
                  });
                  if (ress.length === 0 || ress === []) {
                    that.setState({
                      onshow: false
                    });
                  };
                }
              });
            }

          });
        }
      }
    });
  }

  //到订单详情
  theOrderDetails(id, state) {
    let orderId = id;
    localStorage.setItem('orderState', state);
    Taro.navigateTo({
      url: '/pages/my/order_history/the_order_details/the_order_details?orderId=' + orderId + '&v=' + new Date().getTime()
    });
  }

  componentDidHide() {
    super.componentDidHide && super.componentDidHide();
    this._offReachBottom && this._offReachBottom();
    this.pullDownRefreshRef && this.pullDownRefreshRef.unbindEvent();
  }

}
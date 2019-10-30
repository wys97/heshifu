import Taro from '@tarojs/taro';
import Netservice from '../netservice.js';
import { setGlobalData, } from '../utils/global_data.js'
import JSWX from '../libs/jweixin-1.4.0.js'
import Common from '../common.js'

//微信支付
export function payment(userCardMedalId, orderId, price, openId, successCallBack, cancelBack, failCallBack) {
    // export function payment( userCardMedalId, orderId, price, openId ) {

    let that = this;

    Netservice.request({
        url: 'heque-eat/wechat_pay/hsf_user_payment',
        method: 'POST',
        data: {
            ...userCardMedalId,
            id: orderId,
            paymentPrice: price,
            channel: 'h5',
            openId: openId,
        },
        success: function (res) {
            Taro.hideLoading();

            setGlobalData('currentCoupon', {});

            if (res.code !== Common.NetCode_NoError) {
                Taro.showToast({ title: res.message, icon: 'none', duration: 2000 });
            
                Taro.navigateTo({ url: '/pages/my/order_history/the_order_details/the_order_details?orderId=' + orderId + '&v=' + new Date().getTime() })

                return;
            };

            let params = res.data;
            JSWX.chooseWXPay({
                timestamp: params.timeStamp,
                nonceStr: params.nonceStr,
                package: params.package,
                signType: params.signType,
                paySign: params.sign,
                // // 支付成功后的回调函数
                success(res1) {
                    //支付成功
                    if (successCallBack)
                        successCallBack();

                },

                cancel(res2) {
                    //取消支付
                    if (cancelBack)
                        cancelBack();

                },
                fail(res3) {
                    //支付失败
                    if (failCallBack)
                        failCallBack();
                }

            });

        },
        error:(err)=> {
            Taro.hideLoading();
            //支付失败
            if (failCallBack)
                failCallBack();

        }
    })
}


//0元支付
export function zeroPayment(userCardMedalId, price, orderId) {
    let that = this;
    Netservice.request({
        url: 'heque-eat/wechat_pay/zero_element_pay',
        method: 'POST',
        data: {
            ...userCardMedalId,
            id: orderId,
            paymentPrice: price,
            channel: 'h5',
        },
        success: function (res) {
            Taro.hideLoading();
            
            if (res.code !== Common.NetCode_NoError) {
                Taro.showToast({ title: res.message, icon: 'none', duration: 2000 });
                return;
            }
          
            setGlobalData('currentCoupon', {});
            Taro.navigateTo({ url: '/pages/my/order_history/the_order_details/the_order_details?orderId=' + orderId + '&v=' + new Date().getTime() })

        },
        fail: function (err) {
            Taro.hideLoading();
      
            setGlobalData('currentCoupon', {});
            
            Taro.showToast({ title: '支付失败', icon: 'none', duration: 2000 });
            Taro.navigateTo({ url: '/pages/my/order_history/the_order_details/the_order_details?orderId=' + orderId + '&v=' + new Date().getTime() })
        }
    })
}

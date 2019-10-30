import Nerv from "nervjs";
import Taro from "@tarojs/taro-h5";
import { View } from '@tarojs/components';
import './activityRules.css?v=201906107';

export default class ActivityRules extends Taro.Component {

  config = {
    navigationBarTitleText: '活动规则'
  };

  render() {
    return <View className="activityRules">
                <View className="activityRules_content">
                    <p class="activityRules_content_title">Q：如何参加邀请好友活动？</p>
                    <p class="activityRules_title_answer">A:活动时间内，点击分享按钮将链接发给好友即可参与。</p>

                    <p class="activityRules_content_title margin_top">Q：怎样算是邀请成功？</p>
                    <p class="activityRules_answer">A：好友作为新用户通过您分享的链接下载App，注册成功后算邀请成功。</p>

                    <p class="fontSize30 strong">新用户的定义：</p>
                    <p class="strfontSize28 ">之前从未注册过禾师傅，在活动期间注册禾师傅且使用手机号码绑定账号的。不能被认定为“新用户”的情形，包括但不限于如下情形：</p>
                    <p class="strfontSize28 strong">*使用曾经安装过禾师傅客户端的终端设备登录的用户</p>
                    <p class="strfontSize28 strong">*使用禾师傅已有账号登录新终端设备的用户</p>
                    <p class="strfontSize28 strong">*通过其他禾师傅用户邀请再次下载禾师傅客户端的用户</p>
                    <p class="strfontSize28 strong">*使用同一个手机号码、第三方账号等注册过禾师傅账号的用户</p>
                    <p class="strfontSize28 strong">*存在采用各种不当手段下载、安装、注册、登录客户端，或存在涉嫌违法违规行为（包括不限于作弊、造假、其他交易风险等）的用户</p>
                    <p class="fontSize30 answer">凡是符合以上任一一种情形的，均不能被认定为新用户，禾师傅有权收回因此给与邀请者的奖励。</p>
                    <p class="activityRules_content_title margin_top">Q：获得的奖励如何发放？</p>
                    <p class="answer"> A：邀请成功后获得的优惠券奖励，将会在被邀请人登录成功后发放至您的个人账户中，您可以在禾师傅公众号-我的-我的优惠券里查看。</p>
                    <p class="activityRules_content_title margin_top">Q：优惠券如何使用？</p>
                    <p class="answer">A：支付前可选择使用优惠券，单个用户每日最多使用两张优惠券。</p>
                </View>
            </View>;
  }

  componentDidMount() {
    super.componentDidMount && super.componentDidMount();
  }

  componentDidShow() {
    super.componentDidShow && super.componentDidShow();
  }

  componentDidHide() {
    super.componentDidHide && super.componentDidHide();
  }

}
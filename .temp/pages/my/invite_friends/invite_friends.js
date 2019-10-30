import Nerv from "nervjs";
import Taro from "@tarojs/taro-h5";
import { View, Text, Image } from '@tarojs/components';
import './invite_friends.css?v=2019071110';

import titleImg from '../../../images/coupons/title.png';
import inviteMessageImg from '../../../images/coupons/invite_message.png';
import rightArrowsImg from '../../../images/coupons/right_arrows.png';
import explainImg from '../../../images/coupons/explain.png';
import inviteBtnImg from '../../../images/coupons/invite_btn.png';
import guide from '../../../images/coupons/guide_img.png';
import shareTips from '../../../images/coupons/share_tips.png';

import Netservice from "../../../netservice";

import Common from "../../../common";

// 引入微信js-sdk
import JSWX from '../../../libs/jweixin-1.4.0';

export default class InviteFriends extends Taro.Component {

  config = {
    navigationBarTitleText: '邀请好友'
  };
  state = {
    inviteRegNumber: '', //邀请成功的人数
    inviteRegCardNumber: '', //已领代金券的数量
    shareData: '', //分享链接的数据
    showShareTipsText: false //显示分享提示弹框

  };

  componentWillMount() {

    //获取微信JS接口参数 
    this.getWeChatJSApiParam();

    let that = this;
    let userId = localStorage.getItem('userId');
    that.setState({
      userId: userId
    });
    //请求分享链接的内容
    Netservice.request({
      url: 'heque-user/invite/invite_friend_url',
      method: 'GET',
      data: {
        inviteUserId: userId
      },
      success: res => {
        that.setState({
          shareData: res.data.inviteFriendCopywriting
        });
      }
    });
  }

  componentDidMount() {
    console.log(Common.InvitationFriend);
    let that = this;
    let userId = localStorage.getItem('userId');
    Netservice.request({
      url: 'heque-user/invite/invite_user_home',
      method: 'GET',
      data: {
        inviteUserId: userId
      },
      success: res => {

        let inviteRegNumber = res.data.inviteRegNumber;
        let inviteRegCardNumber = res.data.inviteRegCardNumber;

        that.setState({
          inviteRegNumber,
          inviteRegCardNumber
        });
      }
    });
  }

  render() {
    const { inviteRegNumber, inviteRegCardNumber, showShareTipsText } = this.state;

    // 邀请好友提示弹窗
    let shareTipsText = <View className="shareTipsText" onClick={this.concealShareTipsText.bind(this)}>
            <Image src={guide} className="shareTipsText_guide_img" style="pointer-events: none" />
            <Image src={shareTips} className="shareTipsText_shareTips_img" style="pointer-events: none" />
        </View>;

    return <View className="InviteFriends">
                <View className="InviteFriends_title">
                    <Image className="InviteFriends_titleImg" src={titleImg} style="pointer-events: none" />
                </View>
                <View className="InviteFriends_inviteMessageWrap">
                    <Image className="InviteFriends_inviteMessageImg" src={inviteMessageImg} style="pointer-events: none" />
                    <View className="InviteFriends_inviteMessage_wrap">
                        <View className="inviteMessage_wrap_left">
                            <View className="inviteMessage_Text_number">{inviteRegNumber}</View>
                            <View className="inviteMessage_text">
                                <View className="inviteMessage_text_size28">成功</View>
                                <View className="inviteMessage_text_size22">注册人数</View>
                            </View>
                        </View>
                        <View className="inviteMessage_wrap_content">
                            <View className="inviteMessage_Text_number">{inviteRegCardNumber}</View>
                            <View className="inviteMessage_text">
                                <View className="inviteMessage_text_size28">已领</View>
                                <View className="inviteMessage_text_size22">代金券</View>
                            </View>
                        </View>
                        <View className="inviteMessage_wrap_right" onClick={this.examineRecord.bind(this)}>
                            <Text className="inviteMessage_text_size26">查看记录</Text>
                            <Image src={rightArrowsImg} className="InviteFriends_rightArrowsImg" style="pointer-events: none" />
                        </View>
                    </View>
                </View>
                <Image className="InviteFriends_explainImg" src={explainImg} style="pointer-events: none" />
                <View className="InviteFriends_inviteBtnImg_father" onClick={this.getShare.bind(this)}>
                    <Image className="InviteFriends_inviteBtnImg" src={inviteBtnImg} style="pointer-events: none" />
                </View>
                <View className="activityRules_btn" onClick={this.activityRules.bind(this)}>活动规则</View>
                {showShareTipsText && shareTipsText}
            </View>;
  }

  //获取微信JS接口参数 
  getWeChatJSApiParam() {
    let userId = localStorage.getItem('userId');

    Netservice.request({
      url: 'heque-eat/we_chat_public_number/get_signature?url=' + encodeURIComponent(location.href.split('#')[0]),
      method: 'GET',
      success: res => {
        JSWX.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: 'wxed1d300ad50d204f', // 必填，企业号的唯一标识，此处填写企业号corpid
          timestamp: res.data.timestamp, // 必填，生成签名的时间戳（10位）
          nonceStr: res.data.nonceStr, // 必填，生成签名的随机串,注意大小写
          signature: res.data.signature, // 必填，签名，
          jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'] // 必填，需要使用的JS接口列表，
        });

        JSWX.ready(function () {
          //需在用户可能点击分享按钮前就先调用

          //分享给好友
          JSWX.updateAppMessageShareData({
            title: Common.InviteTitle, // 分享标题
            desc: Common.InviteDesc, // 分享描述
            link: Common.InvitationFriend + userId, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: Common.InviteImgUrl, // 分享图标
            // type: '', // 分享类型,music、video或link，不填默认为link
            // dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {}
          });

          //分享到朋友圈
          JSWX.updateTimelineShareData({
            title: Common.InviteTitle, // 分享标题
            link: Common.InvitationFriend + userId, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: Common.InviteImgUrl, // 分享图标
            success: function () {}
          });
        });
      }
    });
  }

  //分享按钮
  getShare(e) {
    e.stopPropagation();
    this.setState({
      showShareTipsText: true
    });
  }
  concealShareTipsText(e) {
    e.stopPropagation();
    this.setState({
      showShareTipsText: false
    });
  }

  //活动规则
  activityRules(e) {
    e.stopPropagation();
    Taro.navigateTo({
      url: "/pages/my/invite_friends/activityRules/activityRules?v=" + new Date().getTime()
    });
  }

  //查看邀请记录
  examineRecord(e) {
    e.stopPropagation();
    Taro.navigateTo({
      url: "/pages/my/invite_friends/hasActivationList/hasActivationList?v=" + new Date().getTime()
    });
  }

  componentDidShow() {
    super.componentDidShow && super.componentDidShow();
  }

  componentDidHide() {
    super.componentDidHide && super.componentDidHide();
  }

}
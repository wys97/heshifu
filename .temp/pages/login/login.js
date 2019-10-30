import Nerv from "nervjs";
import './login.css?v=20190712108';
import Taro, { showToast as _showToast } from "@tarojs/taro-h5";
import { View, Text, Input, Image } from '@tarojs/components';

import defaultLoginBtn from '../../images/common/login_btn2.png';
import loginBtn from '../../images/common/login_btn1.png';

import Netservice from '../../netservice.js?v=20190624108';
import Common from "../../common";

import TooltipCoupon from '../tooltipCoupon/tooltipCoupon.js?v=201906191108';

export default class Login extends Taro.Component {

  config = {
    navigationBarTitleText: '登录'
  };
  constructor() {
    super();

    this.isCodeClickable = true; //验证码防止连续点击 
    this.isLoginClickable = true; //登录按钮防止连续点击 
  }
  state = {
    hintStyle: true, //提示样式
    hintText: '', //提示词

    securityCodeStyle: 2, //验证码样式，1 第一次输入达11位   2 倒计时中  3 重发验证码
    phoneValue: '', //手机号码
    loginStyle: false, //登录按钮样式, 是否可点击

    importSecurityCode: '', //输入的验证码
    number: 60, //倒计时
    btnText: '发送验证码', //验证码按钮文本

    disablCodeBtn: false, //禁用验证码按钮
    disablLoginBtn: true, //禁用登录按钮

    couponStateStyle: false, //为true时显示优惠券弹框
    couponsData: [] //传到优惠券组件的数据
  };

  componentWillMount() {}

  componentDidMount() {}

  componentWillUpdate() {}

  componentDidUpdate() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {

    const { phoneValue, securityCodeStyle, importSecurityCode, loginStyle, hintStyle, hintText, btnText, disablCodeBtn, disablLoginBtn, couponStateStyle, couponsData } = this.state;
    return <View className="login">

        <View className="contentTitle">
          <View>欢迎来到禾师傅</View>
          <View className="login_font_26">绑定手机会让您的账户更加安全</View>
        </View>

        <View className="input_wrap">

          <Input value={phoneValue} placeholder="请输入手机号码" className="phoneInput" onInput={this.onPhoneChange.bind(this)} maxLength="11" type="number" />

          <View className="securityCode">
            <Input value={importSecurityCode} type="number" maxLength="6" placeholder="请输入验证码" className="input_securityCode" onInput={this.onCodeChange.bind(this)} />
            <View className={securityCodeStyle == 1 ? 'login_placeholder' : 'login_placeholder2'}></View>
            {securityCodeStyle === 1 && <View className="securityCode_btn1" onClick={disablCodeBtn && this.getRegular.bind(this)}>{btnText}</View>}
            {securityCodeStyle === 2 && <View className="securityCode_btn2">{btnText}</View>}
            {securityCodeStyle === 3 && <View className="securityCode_btn3" onClick={disablCodeBtn && this.getRegular.bind(this)}>{btnText}</View>}
          </View>

          {hintStyle === false ? <Text className="hint">{hintText}</Text> : <Text className="hint2"></Text>}
        </View>
        <View className="login_btn1" onClick={!disablLoginBtn && this.goLogin.bind(this)}>
          <Image src={!loginStyle ? defaultLoginBtn : loginBtn} className="login_btn_img" style="pointer-events: none" />
        </View>
        {couponStateStyle && <TooltipCoupon couponsData={couponsData} afterClose={1} notScroll={0} />}
      </View>;
  }

  //手机号
  onPhoneChange(phoneValue) {

    let value = phoneValue.detail.value;
    let number = value.replace(/\s/g, " ");

    this.setState({ phoneValue: number });

    // let numRegular =/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57]|19[0-9]|16[0-9])[0-9]{8}$/;
    // if(number.length >= 11 && numRegular.test(number)){
    if (number.length >= 11) {
      this.setState({
        securityCodeStyle: 1,
        disablCodeBtn: true,
        hintStyle: true,
        disablLoginBtn: false
      });
    } else {
      this.setState({
        securityCodeStyle: 2,
        disablCodeBtn: false,
        hintStyle: false,
        disablLoginBtn: true,
        hintText: '请输入正确的手机号码'
      });
    }
  }

  //获取验证码
  getRegular(e) {

    let that = this;

    if (!this.isCodeClickable) return;
    this.isCodeClickable = false;
    setTimeout(() => {
      this.isCodeClickable = true;
    }, 2000);

    if (this.state.securityCodeStyle === 2) {
      return;
    } else {
      Netservice.request({
        url: 'heque-user/userSms/getUserSmsCode',
        method: 'GET',
        data: {
          phoneNo: this.state.phoneValue, //手机号
          smsType: 4 //代表用户登录验证码
        },
        success: res => {
          if (res.code !== Common.NetCode_NoError) {
            _showToast({
              title: res.message,
              icon: 'none',
              duration: 3000
            });
          } else {
            that.setState({
              btnText: '重发验证码(60s)',
              disablCodeBtn: false,
              securityCodeStyle: 2
            });
            that.setReciprocal(that);
          }
        }
      });
    }
  }

  //倒计时
  setReciprocal(that) {
    let number = that.state.number;

    let time = setInterval(() => {
      number--;

      this.setState({
        btnText: '重发验证码(' + number + 's)',
        disablCodeBtn: false,
        securityCodeStyle: 2
      });

      if (this.state.phoneValue === '' || this.state.phoneValue === null) {

        this.setState({
          number: 60,
          btnText: '发送验证码',
          disablCodeBtn: false,
          securityCodeStyle: 2
        });
        clearInterval(time);
      } else if (number === 0) {

        this.setState({
          number: 60,
          btnText: '重发验证码',
          disablCodeBtn: true,
          securityCodeStyle: 3
        });
        clearInterval(time);
      } else {
        this.setState({
          btnText: '重发验证码(' + number + 's)',
          disablCodeBtn: false,
          securityCodeStyle: 2
        });
      }
    }, 1000);
  }

  //输入验证码
  onCodeChange(importSecurityCode) {

    let Code = importSecurityCode.detail.value;
    this.setState({
      importSecurityCode: Code
    });
    if (Code.length >= 6 && this.state.phoneValue.length !== 0) {
      this.setState({
        loginStyle: true,
        disablLoginBtn: false
      });
    } else {
      this.setState({
        loginStyle: false,
        disablLoginBtn: true
      });
    }
  }

  //登录
  goLogin(e) {

    let that = this;
    let phoneValue = that.state.phoneValue;
    let Code = that.state.importSecurityCode;
    let openId = localStorage.getItem('openId') || '';

    if (!this.isLoginClickable) return;

    this.isLoginClickable = false;

    setTimeout(() => {
      this.isLoginClickable = true;
    }, 3000);

    if (phoneValue !== '' && Code !== '') {
      Netservice.request({
        url: 'heque-user/user/reg_or_login',
        method: 'POST',
        data: {
          phoneNo: phoneValue,
          userType: 1,
          smsCode: Code,
          loginType: 1,
          weChatPublicNumberOpenId: openId
        },
        success: res => {

          if (res.code === Common.NetCode_NoError) {
            let userId = res.data.iid;
            let token = res.data.token;
            let businessType = res.data.businessType;

            localStorage.setItem('userId', userId);
            localStorage.setItem('token', token);
            localStorage.setItem('phone', phoneValue);

            if (res.data && res.data.weChatPublicNumberOpenId && res.data.weChatPublicNumberOpenId.length > 10) {
              localStorage.setItem('openId', res.data.weChatPublicNumberOpenId);
            }

            //如果没选司机类型，就去选择司机类型
            if (businessType === '' || businessType === undefined) {
              Taro.redirectTo({
                url: '/pages/my/choice_motorman_type/choice_motorman_type?v=' + new Date().getTime()
              });
            } else {
              //调用查优惠券的函数
              that.getCouponsMessage(userId);
            }
          } else {
            _showToast({
              title: res.message,
              icon: 'none',
              duration: 3000
            });
          }
        }
      });
    }
  }

  //查优惠券
  getCouponsMessage(userId) {
    let that = this;
    if (userId === null || userId === undefined) {
      return;
    } else {
      Netservice.request({
        'url': 'heque-coupon/discount_coupon/get_not_read',
        method: 'GET',
        data: {
          userId: userId
        },
        success: res => {

          let results = res.data;
          let coupons = results.filter(function (ele) {
            return ele.faceValue > 0;
          });

          if (coupons.length === 0 || coupons === '') {

            that.setState({
              couponStateStyle: false
            });
            //返回
            Taro.navigateBack();
          } else {
            that.setState({
              couponStateStyle: true,
              couponsData: coupons
            });
          }
        }
      });
    }
  }

}
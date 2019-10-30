import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Picker, Swiper, SwiperItem, Input } from '@tarojs/components'
import './assistantDetails.css'
import { AtInput } from 'taro-ui'


import { getGlobalData } from '../../../../utils/global_data'
import Netservice from '../../../../netservice.js'
import Common from '../../../../common.js'


import banner_rent from '../../../../images/wish/car/banner_rent.png'
import assistant_title2 from '../../../../images/wish/assistant/assistant_title2.png'
import btn_submit from '../../../../images/wish/car/btn_submit.png'
import default_btn_next from '../../../../images/wish/car/default_btn_next.png'



export default class AssistantDetails extends Component {

    constructor(props){
        super(props);

        //防重复点击
        this.preventRepeat = true;

    }


    config = {
        'navigationBarTitleText': '招副班'
    }
    state = {
        nameValue: '',
        phoneNumber: '',
        showHighLight: false,
        system: 'android',  //系统


    }

    componentWillMount() {
        let numberValue = localStorage.getItem('phone');

        if (numberValue !== '' && numberValue !== null)
            this.setState({ phoneNumber: numberValue, showHighLight: true })



        Taro.getSystemInfo({
            success: res => { this.setState({ system: res.system }); }
        });

    }


    componentDidMount() {
        var h = document.body.scrollHeight;
        window.onresize = function () {
            if (document.body.scrollHeight < h) {
                document.getElementsByClassName("AssistantDetails_btn_submit_wrap")[0].style.display = "none";

                setTimeout(() => {
                    window.scrollTo({ top: 500, behavior: "smooth" });
                    // window.scroll(0, 500);
                    // document.body && (document.body.scrollTop = 500);
                }, 300);

            } else {
                document.getElementsByClassName("AssistantDetails_btn_submit_wrap")[0].style.display = "block";
            }
        };

    }



    render() {
        let { nameValue, phoneNumber, showHighLight } = this.state;
        return (
            <View className='AssistantDetails'>
                <Swiper className='AssistantDetails_swiper' circular autoplay={false} interval={3000} style='width:84%'>
                    <SwiperItem className='AssistantDetails_SwiperItem' style='width:100%'>
                        <Image className='AssistantDetails_swiper_image' src={banner_rent} style='pointer-events: none; width:100%' />
                    </SwiperItem>
                    {/* <SwiperItem className='pt2_SwiperItem' onClick={this.inviteFriends.bind(this)} >
                    <Image className='pt2_swiper_image' src={banner2} onClick={this.inviteFriends.bind(this)} />
                </SwiperItem>
                <SwiperItem className='pt2_SwiperItem' onClick={this.summerTopic.bind(this)}>
                    <Image className='pt2_swiper_image' src={banner3} onClick={this.summerTopic.bind(this)} />
                </SwiperItem>*/}
                </Swiper>
                <Image src={assistant_title2} className='AssistantDetails_title_img' style='pointer-events: none' />
                <View className='AssistantDetails_content_wrap'>
                    <View className='AssistantDetails_type_title'>您的称呼</View>
                    <AtInput className='AssistantDetails_type_input' value={nameValue} type='text' placeholder='请输入您的名字'  maxLength='7' onBlur={this.onInputBlur.bind(this)}
                     onChange={this.setNameValue.bind(this)} />
                    <View className='AssistantDetails_type_hint'>请确认您的联系方式。海量副班，即刻匹配</View>
                    <Input className='AssistantDetails_type_input' type='number' placeholder='请确认您的联系方式' maxLength='11' value={phoneNumber} onBlur={this.onInputBlur.bind(this)} onChange={this.setPhoneNumber.bind(this)} />
                </View>
                <View className='AssistantDetails_btn_submit_wrap' onClick={this.submitBtn.bind(this)}>
                    <Image src={showHighLight ? btn_submit : default_btn_next} className='AssistantDetails_btn_submit_img' style='pointer-events: none' />
                </View>
            </View>
        )
    }


    //输入框失去焦点时
    onInputBlur() {
        let { system } = this.state;
        if (system.startsWith('iOS') || system.startsWith('ios'))
            window.scroll(0, 0);
    }



    //名字
    setNameValue(value) {
        this.setState({
            nameValue: value.replace(/\s+/g,""),
        })
    }
    //手机
    setPhoneNumber(e) {
        this.setState({
            phoneNumber: e.detail.value
        })


        this.showHighLight(e.detail.value);

    }



    //必填项已选择，下一步按钮显示高亮
    showHighLight(phoneNumber) {
        if (phoneNumber == '' || phoneNumber.length !== 11) {

            this.setState({
                showHighLight: false
            })
        } else {
            this.setState({
                showHighLight: true
            })
        }
    }




    //提交按钮
    submitBtn(e) {
        e.stopPropagation();
        let { nameValue, phoneNumber, showHighLight } = this.state;
        //防重复点击
        if(!this.preventRepeat)
            return;

        this.preventRepeat = false;

        setTimeout(()=>{
            this.preventRepeat = true;
        },3000)



        if (phoneNumber == '') {
            Taro.showToast({
                title: '请输入您的手机号',
                icon: 'none',
                duration: 1500
            })
            return
        }

        if (phoneNumber < 11) {
            Taro.showToast({
                title: '请输入正确的手机号',
                icon: 'none',
                duration: 1500
            })
            return
        }

        if (!showHighLight)
            return


        let userId = localStorage.getItem('userId');
        let type = getGlobalData('type');
        let pId = getGlobalData('pId');
        let cId = getGlobalData('cId');
        let provinceName = getGlobalData('provinceName');
        let cityName = getGlobalData('cityName');
        let driverTime = getGlobalData('driverTime');
        let threeCertificateReady = getGlobalData('threeCertificateReady');
        let lessFifty = getGlobalData('lessFifty');
        let sameProvince = getGlobalData('sameProvince');
        let nativeName = getGlobalData('nativeName');
        let areaIds1 = getGlobalData('areaIds');
        let areasName1 = getGlobalData('areasName');

        //数组转字符串
        let areasName = areasName1.join(',');
        let areaIds = areaIds1.join(',');


        let nameValue2 = nameValue == '' ? '' : nameValue;

        Netservice.request({
            url: 'heque-backend/employ_driver/addEmployDriver',
            method: 'POST',
            data: {
                userId: userId,
                type: type,
                pId: pId,
                cId: cId,
                areaIds: areaIds,
                provinceName: provinceName,
                cityName: cityName,
                areasName: areasName,
                driverTime: driverTime,
                phoneNumber: phoneNumber,
                userName: nameValue2,
                threeCertificateReady: threeCertificateReady,
                lessFifty: lessFifty,
                sameProvince: sameProvince,
                nativeName: nativeName,

            },
            success: res => {
                if (res.code !== Common.NetCode_NoError) {
                    Taro.showToast({
                        title: res.message,
                        icon: 'none',
                        driverTime: 1500
                    })
                } else {
                    Taro.redirectTo({ url: '/pages/wish/apply_success/apply_success?type=' + res.data.collectType + '&id=' + res.data.id + '&v=' + new Date().getTime() })
                }
            }
        })


    }


} 

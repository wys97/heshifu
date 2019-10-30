import Taro, { Component } from '@tarojs/taro'
import { View, Image, Swiper, SwiperItem } from '@tarojs/components'
import './caocao.css'

import { reporteUerBehavior } from '../../../../utils/utils'


import banner_rent1 from '../../../../images/wish/car/caocao/banner_rent.png'
import card_caocao01 from '../../../../images/wish/car/caocao/card_caocao01.png'
import card_caocao02 from '../../../../images/wish/car/caocao/card_caocao02.png'
import card_caocao03 from '../../../../images/wish/car/caocao/card_caocao03.png'
import icon_nxt from '../../../../images/wish/car/icon_nxt.png'
import icon_pre from '../../../../images/wish/car/icon_pre.png'
import introduce_module1 from '../../../../images/wish/car/caocao/introduce_module1.png'
import introduce_module2 from '../../../../images/wish/car/caocao/introduce_module2.png'
import introduce_module3 from '../../../../images/wish/car/caocao/introduce_module3.png'
import btn_apply from '../../../../images/wish/car/caocao/btn_apply.png'


export default class Caocao extends Component {
    config = {
        navigationBarTitleText: '曹操出行'
    }

    state = {
        orderIndex: 0,
    }

    render() {
        let { orderIndex } = this.state;
        return (
            <View className='Caocao'>
                <Swiper className='Caocao_swiper'>
                    <SwiperItem className='Caocao_SwiperItem' style='width:100%'>
                        <Image className='Caocao_swiper_image' src={banner_rent1} style='pointer-events: none; width:100%' />
                    </SwiperItem>
                </Swiper>

                <View className='Caocao_title'>车型可选</View>
                <View className='Caocao_CarType_swiper_wrap'>
                    <Swiper className='Caocao_CarType_swiper' circular={true} autoplay interval={3000} onChange={this.swiperChange.bind(this)} current={orderIndex}>
                        <SwiperItem className='Caocao_CarType_SwiperItem' style='width:100%'>
                            <Image className='Caocao_CarType_swiper_image' src={card_caocao01} style='pointer-events: none; width:100%' />
                        </SwiperItem>
                        <SwiperItem className='Caocao_CarType_SwiperItem' >
                            <Image className='Caocao_CarType_swiper_image' src={card_caocao02} />
                        </SwiperItem>
                        <SwiperItem className='Caocao_CarType_SwiperItem'>
                            <Image className='Caocao_CarType_swiper_image' src={card_caocao03} />
                        </SwiperItem>
                    </Swiper>
                    
                    <View className='swiper_icon_nxt_left' onClick={this.goPrevious.bind(this)}>
                        <Image src={icon_nxt} className='swiper_icon_nxt_left_img' />
                    </View>
                    <View className='swiper_icon_nxt_right' onClick={this.goNext.bind(this)}>
                        <Image src={icon_pre} className='swiper_icon_nxt_right_img' />
                    </View>
                </View>

                <View className='Caocao_title'>平台优势</View>
                <View className='caocao_introduce_module_wrap'>
                    <Image src={introduce_module1} className='caocao_introduce_module_img' />
                    <Image src={introduce_module2} className='caocao_introduce_module_img' />
                    <Image src={introduce_module3} className='caocao_introduce_module_img' />
                </View>

                <View className='caocao_btn_apply_wrap' onClick={this.toApplyDetails.bind(this)}>
                    <Image src={btn_apply} className='caocao_btn_apply_img' />
                </View>

            </View>
        )
    }

    // 滑块改变
    swiperChange(e) {
        let orderIndex = e.detail.current;
        this.setState({ orderIndex })
    }

    //左右滑动按钮
    goPrevious(e) {
        e.stopPropagation();

        let { orderIndex } = this.state;
        if (orderIndex > 0) {
            orderIndex--;
            this.setState({ orderIndex })
        }
    }

    //左右滑动按钮
    goNext(e) {
        e.stopPropagation();

        let { orderIndex } = this.state;
        if (orderIndex < 2) {
            orderIndex++;
            this.setState({ orderIndex })
        }
    }

    //报名申请
    toApplyDetails(e) {
        e.stopPropagation();



        reporteUerBehavior('赚钱|找车|曹操出行', 1, res => {
            Taro.navigateTo({ url: 'https://mobile.caocaokeji.cn/driver/share/shareRegister?type=2&inviteId=3306&cityCode=0755&le=undefined&fq=wx' })
          });


    //     Taro.navigateTo({ url: '/pages/wish/car/caocao/caocao_apply', })
    }


}

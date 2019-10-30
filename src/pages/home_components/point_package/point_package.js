import Taro, { Component } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components'

import './point_package.css'

import banner1 from '../../../images/home/banner1.png'
import banner2 from '../../../images/home/banner2.png'
import banner3 from '../../../images/home/banner3.png'
import banner4 from '../../../images/home/banner4.png'

import phonePoint from '../../../images/common/icon_phone_point.png'
import arrowRight1 from '../../../images/common/arrow_right.png'
import inRestImg from '../../../images/home/in_rest.png'
import OrderBtnImg from '../../../images/home/Order_img_btn.png'
import noDishesImg from '../../../images/home/no_dishes.png'


import Netservice from '../../../netservice.js'

import { setGlobalData, getGlobalData } from '../../../utils/global_data.js'

// 下单买单
export default class PointPackage extends Component {

    state = {
        storesDetails: {},  //门店信息

        packageList: [], //套餐、菜品列表

        inRest: false, //店铺休息状态  true为休息状态
        noDishes: false,  //店铺无菜品
    }

    componentWillMount() {

        if (this.props.currentPoint) {
            let storesDetails = this.props.currentPoint;
            this.setState({ storesDetails })

            //判断是否在休息时间
            if (storesDetails.state)
                this.getPointPackage(storesDetails.id)
            else
                this.setState({ inRest: true })

        } else {
            let storesDetails = JSON.parse(this.$router.params.storesDetails);
            this.setState({ storesDetails })
            //判断是否在休息时间
            if (storesDetails.state)
                this.getPointPackage(storesDetails.id)
            else
                this.setState({ inRest: true })
        }
    }

    //实时监听父组件传过来的值的变化
    componentWillReceiveProps(nextProps) {
        if (nextProps.currentPoint && nextProps.currentPoint.id != this.props.currentPoint.id) {
            let storesDetails = nextProps.currentPoint;
            this.setState({ storesDetails })
            console.log(storesDetails)
            //判断是否在休息时间
            if (storesDetails.state)
                this.getPointPackage(storesDetails.id)
            else
                this.setState({ inRest: true })
        }
    }


    render() {

        let { storesDetails, packageList, inRest, noDishes } = this.state;

        let { foodTime1, foodTime2, foodTime3, foodTime4 } = storesDetails;
        let timeArray = [foodTime1, foodTime2, foodTime3, foodTime4];
        let times = [];
        for (let time of timeArray) {
            if (time && time.length > 5) {
                let aTime = time.slice(0, 5) + '-' + time.slice(11, 16);
                times.push(aTime);
            }
        }
        storesDetails.times = times;

        const packages = packageList.map((item, index) => {
            return <View className='Order_item' key={index} onClick={this.goPackageBuy.bind(this, item)} >

                <View className='Order_img'>
                    <Image className='Order_image' mode='aspectFill' src={item.dishesUrl} />
                </View>
                <View className='Order_info_wrap'>
                    <Text className='Order_name'>{item.dishName}</Text>
                    <Text className='Order_remark'>{item.dishesRemake}</Text>
                    <View className='Order_price_wrap'>
                        <View className='Order_tag'>
                            <Text className='Order_sprice'><Text className='Order_sprice_flag'>￥</Text>{item.specialOffer > 0 ? item.specialOffer : item.originalPrice}</Text>
                            {item.specialOffer > 0 && <Text className='Order_oprice'>￥{item.originalPrice}</Text>}
                        </View>
                        <View className='Order_btn'>
                            <Image src={OrderBtnImg} className='Order_btn_img' style='pointer-events: none' />
                        </View>
                    </View>

                </View>

            </View>
        });

        {/*没有菜品时 */ }
        const noDishesView = <View className='inRest_img_wrap' onClick={this.goToPoints.bind(this)}>
            <Image className='inRest_img' mode='aspectFill' src={noDishesImg} />
        </View>

        return (
            <View className='Order'>
                <View className='order-point' onClick={this.goSlecPoint}>
                    <View className='order_head'>
                        <View className='order_head_title' onClick={this.goToPoints.bind(this)}>
                            <Text className='order_head_name'>{storesDetails.name}</Text>
                            <Image src={arrowRight1} className='order-arrow-right' style='pointer-events: none' />
                        </View>
                        <View className='order_head_distance'>距您
                    {storesDetails.number >= 1000 ?
                                <Text className='order_head_number'>
                                    {(storesDetails.number / 1000).toFixed(1)}<Text className='orderpt_distance_unit'> km</Text>
                                </Text> :
                                <Text className='order_head_number'>{storesDetails.number}<Text className='orderpt_distance_unit'> m</Text></Text>
                            }
                            <Text className='order_head_placeholder'>|</Text>
                            <Text className='order_head_adds'>{storesDetails.adds}</Text>
                        </View>
                        {storesDetails.suppleTime1 !== undefined ?
                            <View className='order_head_time'>
                                <Text>营业时间：</Text>
                                <Text>{storesDetails.suppleTime1}{storesDetails.suppleTime2}{storesDetails.suppleTime3}{storesDetails.suppleTime4}</Text>
                            </View> :
                            <View className='order_head_time'>
                                <Text>营业时间：</Text>
                                {storesDetails.times.length == 1 && <Text>{storesDetails.times[0]}</Text>}
                                {storesDetails.times.length == 2 && <Text>{storesDetails.times[0]} / {storesDetails.times[1]}</Text>}
                                {storesDetails.times.length == 3 && <Text>{storesDetails.times[0]} / {storesDetails.times[1]} / {storesDetails.times[2]}</Text>}
                                {storesDetails.times.length == 4 && <Text>{storesDetails.times[0]} / {storesDetails.times[1]} / {storesDetails.times[2]} / {storesDetails.times[3]}</Text>}
                            </View>
                        }
                    </View>
                    {/*<View className='order-phonePoint-img' onClick={this.contactUs.bind(this)}>
                        <Image src={phonePoint} className='order-phonePoint-img' style='pointer-events: none' />
                    </View>*/}
                </View>
                <Swiper className='order-swiper' circular autoplay interval={3000}>
                    <SwiperItem className='order_SwiperItem'>
                        <Image className='order_swiper_image' src={banner1} onClick={this.goEarn.bind(this)} />
                    </SwiperItem>
                    <SwiperItem className='order_SwiperItem' >
                        <Image className='order_swiper_image' src={banner2} onClick={this.goLend.bind(this)} />
                    </SwiperItem>
                    <SwiperItem className='order_SwiperItem' >
                        <Image className='order_swiper_image' src={banner3} onClick={this.goPartTimeMakeMoney.bind(this)} />
                    </SwiperItem>
                    <SwiperItem className='order_SwiperItem' >
                        <Image className='order_swiper_image' src={banner4} onClick={this.goAssistant.bind(this)} />
                    </SwiperItem>
                </Swiper>

                {/* 休息状态判断 */}
                {inRest ? <View className='inRest_img_wrap' onClick={this.goToPoints.bind(this)} >
                    <Image className='inRest_img' src={inRestImg} style='pointer-events: none' />
                </View>
                    : <View className='Order_dishes_details'>
                        {!noDishes ? packages : noDishesView}
                    </View>
                }

            </View>
        )
    }



    //获取门店菜品
    getPointPackage(stroeId) {
        let that = this;
        Netservice.request({
            url: 'heque-eat/eat/storeEatInfo',
            method: 'POST',
            data: { stroeId: stroeId, },
            success: function (res) {
                if (res.code == '300030') {
                    that.setState({
                        inRest: true
                    })
                } else {
                    let packageList = res.data;
                    let noDishes = false;
                    if (packageList.length <= 0)
                        noDishes = true;

                    const first = packageList[0] || {};
                    const dishId = first.dishId || 0;
                    const type = first.type || 0;

                    that.setState({
                        packageList: packageList,
                        noDishes: noDishes,
                        dishId: dishId,
                        pointType: type == 4 ? 2 : 1,
                        inRest: false
                    });
                }

            },
            error: function (err) {
            }
        })
    }



    //去门店列表    
    goToPoints(e) {
        e.stopPropagation();
        Taro.navigateTo({
            url: '/pages/points/points' + '?v=' + new Date().getTime()
        })
    }


    //抢购按钮， 去快速支付页
    goPackageBuy(item, e) {

        e.stopPropagation();

        let userId = localStorage.getItem('userId');
        if (userId == null || userId == '') {
            Taro.navigateTo({
                url: '/pages/login/login'
            })
        } else {

            let price = item.specialOffer || item.originalPrice;
            let priceType = price === item.specialOffer ? 2 : 1;

            let storesDetails = this.state.storesDetails;

            let dishInfo = encodeURIComponent(JSON.stringify({ dishUrl: item.dishesUrl, dishName: item.dishName, dishPricee: price, priceType: priceType, dishId: item.dishId, eatEverydayDishesDishesId: item.eatEverydayDishesDishesId, dishesRemake: item.dishesRemake, storesDetails: storesDetails }));

            Taro.navigateTo({ url: '/pages/booking/booking?dishInfo=' + dishInfo + '&v=' + new Date().getTime() })
        }

    }




    //联系商家
    contactUs(e) {
        e.stopPropagation();

        Taro.makePhoneCall({
            phoneNumber: String(this.state.storesDetails.storePhoneNumber)
        })

    }

    //外快
    goEarn(e) {
    
        e.stopPropagation();
        
        let userId = localStorage.getItem('userId');
        if (userId) {
            Taro.navigateTo({ url: '/pages/wish/earn/earn' + '?v=' + new Date().getTime() })
        } else {
            Taro.navigateTo({ url: '/pages/login/login' + '?v=' + new Date().getTime() })
        }
    }

    //周转
    goLend(e) {

        e.stopPropagation();

        let userId = localStorage.getItem('userId');
        if (userId) {
            Taro.navigateTo({ url: '/pages/wish/lend/lend' + '?v=' + new Date().getTime() })
        } else {
            Taro.navigateTo({ url: '/pages/login/login' + '?v=' + new Date().getTime() })
        }

    }

    //当副班
    goPartTimeMakeMoney(e) {
        e.stopPropagation();

        let userId = localStorage.getItem('userId');
        if (userId) {
            Taro.navigateTo({ url: '/pages/wish/car/car' + '?v=' + new Date().getTime() })
        } else {
            Taro.navigateTo({ url: '/pages/login/login' + '?v=' + new Date().getTime() })
        }
     

    }
    //招副班
    goAssistant(e) {
    

        let userId = localStorage.getItem('userId');
        if (userId) {
            Taro.navigateTo({ url: '/pages/wish/assistant/assistant' + '?v=' + new Date().getTime() })
        } else {
            Taro.navigateTo({ url: '/pages/login/login' + '?v=' + new Date().getTime() })
        }
    }





}
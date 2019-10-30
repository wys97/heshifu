import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './hasActivationList.css?v=201906107'

import Netservice from '../../../../netservice.js'
import defaultInvite from '../../../../images/coupons/defaultInvite.png'

export default class HasActivationList extends Component {

    config = {
        navigationBarTitleText: '已邀请列表',
    }
    state = {
        hasActivationListData: [],
    }

    componentDidMount() {
        let that = this;
        let userId = localStorage.getItem('userId')
        Netservice.request({
            url: 'heque-user/invite/invite_people',
            method: 'GET',
            data: {
                inviteUserId: userId,
            },
            success: res => {
                console.log(res.data)
                that.setState({
                    hasActivationListData: res.data.hasActivation,
                })
            }

        })
    }


    render() {
        const { hasActivationListData } = this.state;
        return (
            <View className='HasActivationList'>
                {hasActivationListData.length === 0 ?
                    <View className='noListData_style'>
                        <Image className='noListData_style_img' src={defaultInvite} />
                        <View className='noListData_text'>暂没成功邀请好友</View>
                    </View> :
                    <View>
                        {
                            hasActivationListData.map((item, index) => {
                                return <View className='HasActivationList_content' key={index}>
                                    <View className='HasActivationList_content_left'>
                                        <Text className='HasActivationList_content_phone'>{item.phoneNo}</Text>
                                        <Text className='HasActivationList_content_name'>{item.petName}</Text>
                                    </View>
                                    <View className='HasActivationList_content_right'>{item.status === 2 && '已激活'}</View>
                                </View>
                            })
                        }

                    </View>
                }

            </View>
        )
    }



}
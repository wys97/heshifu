import Nerv from "nervjs";
import './apply_detail.css?v=20190904113';
import Taro, { showLoading as _showLoading, hideLoading as _hideLoading, showToast as _showToast } from "@tarojs/taro-h5";
import { View, Text } from '@tarojs/components';
import Netservice from "../../../netservice";
import Common from "../../../common";

export default class ApplyDetail extends Taro.Component {

  config = {
    navigationBarTitleText: '申请详情'
  };

  state = {
    info: {},
    type: 0
  };

  componentWillMount() {
    let type = this.$router.params.type || 0;
    let id = this.$router.params.id || 0;

    this.getInfo(type, id);
    this.setState({ type: type });
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  getInfo(type, rid) {

    _showLoading({ title: '努力加载中…' });
    let that = this;

    let url = '';
    if (type == 0) url = 'heque-backend/collect/queryLoanDetail';else if (type == 1) url = 'heque-backend/work_driver/queryWorkDriverDetail';else if (type == 2) url = 'heque-backend/employ_driver/employDriverDetail';else if (type == 3) url = 'heque-backend/collectCarInfo/findDetail';else if (type == 4) url = 'heque-backend/collectYaDiInfo/findDetail';else if (type == 5) url = 'heque-backend/collectCaoCaoInfo/findDetail';else if (type == 6) url = 'heque-backend/collectShouQiInfo/findDetail';else if (type == 7) url = 'heque-backend/collectPreciseCarInfo/findDetail';

    Netservice.request({
      url: url + '?id=' + rid,
      method: 'GET',
      success: function (res) {
        _hideLoading();
        console.log(res);
        if (res.code !== Common.NetCode_NoError) {
          _showToast({ title: res.message, icon: 'none', duration: 2000 });
          return;
        }

        that.setState({ info: res.data });
      },
      error: function (err) {
        _hideLoading();
      }
    });
  }

  render() {
    let { type, info } = this.state;

    const moneyDetail = <View className="detail-wrapper">

      <View className="detailw-item">
        <Text className="dwi-title">周转周期</Text>
        <Text className="dwi-content">{this.getTimeStr(info.cycle)}</Text>
        <View className="dwi-line" />
      </View>

      <View className="detailw-item">
        <Text className="dwi-title">周转金额(元)</Text>
        <Text className="dwi-content">{this.getAmountStr(info.money)}</Text>
        <View className="dwi-line" />
      </View>

      <View className="detailw-item">
        <Text className="dwi-title">产品偏好</Text>
        <Text className="dwi-content">{this.getPreferenceStr(info.special)}</Text>
        <View className="dwi-line" />
      </View>

      <View className="detailw-item">
        <Text className="dwi-title">还款方式偏好</Text>
        <Text className="dwi-content">{this.getRepaymentStr(info.repayment)}</Text>
        <View className="dwi-line" />
      </View>

      <View className="detailw-item">
        <Text className="dwi-title">您的工作</Text>
        <Text className="dwi-content">{this.getWorkStr(info.job)}</Text>
        <View className="dwi-line" />
      </View>

      <View className="detailw-item">
        <Text className="dwi-title">您的月收入范围</Text>
        <Text className="dwi-content">{this.getEarningStr(info.salary)}</Text>
        <View className="dwi-line" />
      </View>

      <View className="detailw-item">
        <Text className="dwi-title">您周转需求的紧急程度</Text>
        <Text className="dwi-content">{this.getEmergencyStr(info.emergent)}</Text>
        <View className="dwi-line" />
      </View>

      <View className="detailw-item">
        <Text className="dwi-title">称呼</Text>
        <Text className="dwi-content">{info.userName}</Text>
        <View className="dwi-line" />
      </View>

      <View className="detailw-item">
        <Text className="dwi-title">联系方式</Text>
        <Text className="dwi-content">{info.phoneNum}</Text>
      </View>

    </View>;

    const rentDetail = <View className="detail-wrapper">

      <View className="detailw-item">
        <Text className="dwi-title">称呼</Text>
        <Text className="dwi-content">{info.userName}</Text>
        <View className="dwi-line" />
      </View>

      <View className="detailw-item">
        <Text className="dwi-title">联系方式</Text>
        <Text className="dwi-content">{info.phoneNum}</Text>
        <View className="dwi-line" />
      </View>

      <View className="detailw-item">
        <Text className="dwi-title">要求的车型方案内容</Text>
        {info.carType && info.carType.length > 0 && this.getRentArray(info.carType).map((item, index) => {
          return <View className="rent-detail-view" key={index}>
            <Text className="rent-detail-text">{item.text}</Text>
            <Text className="rent-detail-more">{item.more}</Text>
          </View>;
        })}
      </View>

    </View>;

    const asCopilotDetail = <View className="detail-wrapper">

      <View className="detailw-item">
        <Text className="dwi-title">副班代班时间</Text>
        <Text className="dwi-content">{this.getWorkTimeStr(info.type)}</Text>
        <View className="dwi-line" />
      </View>

      <View className="detailw-item">
        <Text className="dwi-title">接受哪几个区域交车</Text>
        <Text className="dwi-content dwi_bottom">{info.provinceName + '-' + info.cityName}</Text>
        <Text className="dwi-content">{(info.areasName || '').replace(/,/g, "  ")}</Text>
        <View className="dwi-line" />
      </View>

      <View className="detailw-item">
        <Text className="dwi-title">个人驾龄</Text>
        <Text className="dwi-content">{this.getDriverTimeStr(info.driverTime)}</Text>
        <View className="dwi-line" />
      </View>

      <View className="detailw-item">
        <Text className="dwi-title">可联系电话</Text>
        <Text className="dwi-content">{info.phoneNumber}</Text>
      </View>

    </View>;

    const findCopilotDetail = <View className="detail-wrapper">

      <View className="detailw-item">
        <Text className="dwi-title">副班代班时间</Text>
        <Text className="dwi-content">{this.getWorkTimeStr(info.type)}</Text>
        <View className="dwi-line" />
      </View>

      <View className="detailw-item">
        <Text className="dwi-title">接受哪几个区域交车</Text>
        <Text className="dwi-content dwi_bottom">{info.provinceName + '-' + info.cityName}</Text>
        <Text className="dwi-content">{(info.areasName || '').replace(/,/g, "  ")}</Text>
        <View className="dwi-line" />
      </View>

      <View className="detailw-item">
        <Text className="dwi-title">对副班驾龄要求</Text>
        <Text className="dwi-content">{this.getDriverTimeStr(info.driverTime)}</Text>
        <View className="dwi-line" />
      </View>

      <View className="detailw-item">
        <Text className="dwi-title">补充其他要求</Text>
        <View className="dwi-wapper">
          <Text className="dwi-content">{(info.threeCertificateReady == 1 ? '三证齐全  ' : '') + (info.lessFifty == 1 ? '小于50岁  ' : '') + (info.sameProvince == 1 ? '老乡' : '')}</Text>
          {info.sameProvince == 1 && <Text className="dwi-content-province">{'(' + info.nativeName + ')'}</Text>}
        </View>
        <View className="dwi-line" />
      </View>

      <View className="detailw-item">
        <Text className="dwi-title">可联系电话</Text>
        <Text className="dwi-content">{info.phoneNumber}</Text>
      </View>

    </View>;

    const rentCar = <View className="detail-wrapper">

      <View className="detailw-item">
        <Text className="dwi-title">称呼</Text>
        <Text className="dwi-content">{info.userName}</Text>
        <View className="dwi-line" />
      </View>
      <View className="detailw-item">
        <Text className="dwi-title">联系方式</Text>
        <Text className="dwi-content">{info.phoneNum}</Text>
        <View className="dwi-line" />
      </View>
      <View className="detailw-item">
        <Text className="dwi-title">品牌偏好</Text>
        <Text className="dwi-content">{(info.carBrand || '').replace(/,/g, "  ")}</Text>
        <View className="dwi-line" />
      </View>

      <View className="detailw-item detailw_flex">
        <Text className="dwi-title">动力类型</Text>
        <Text className="dwi-content margin_no">{this.getDynamics(info.powerType)}</Text>

      </View>

      <View className="detailw-item detailw_flex">
        <Text className="dwi-title">变速箱</Text>
        <Text className="dwi-content margin_no">{this.getGearboxes(info.gearbox)}</Text>
      </View>

      <View className="detailw-item detailw_flex">
        <Text className="dwi-title">排量</Text>
        <Text className="dwi-content margin_no">{this.getDisplacements(info.displacement)}</Text>

      </View>

      <View className="detailw-item detailw_flex">
        <Text className="dwi-title">车龄</Text>
        <Text className="dwi-content margin_no">{this.getCarAges(info.carAge)}</Text>

      </View>

      <View className="detailw-item ">
        <Text className="dwi-title">车款亮点</Text>
        <Text className="dwi-content">{(info.preference || '').replace(/,/g, "  ")}</Text>

        <View className="dwi-line" />
      </View>

      <Text className="dwi_title_font">对租赁方案的要求</Text>

      <View className="detailw-item detailw_flex">
        <Text className="dwi-title">租金</Text>
        <Text className="dwi-content margin_no">{this.getMonies(info.rent)}</Text>

      </View>

      <View className="detailw-item detailw_flex margin_bottom">
        <Text className="dwi-title">租期</Text>
        <Text className="dwi-content margin_no">{this.getTimes(info.leaseTerm)}</Text>
      </View>
    </View>;

    return <View className="container-apply-detail">

        <View className="apply-detail-content">

          <View className="adc-header">

            <Text className="adch-state">{this.getStateStr(info.state)}</Text>
            {info.state == 2 && info.result && info.result.length > 0 && <Text className="adch-result">{info.result}</Text>}

            <View className="adch-line" />

            {(type < 4 || type == 7) && <Text className="adch-text">已提交个人诉求</Text>}
            {type > 3 && type != 7 && <Text className="adch-text mar-bottom">已提交网约车合作服务申请</Text>}
          </View>

          {type == 0 && moneyDetail}
          {type == 1 && asCopilotDetail}
          {type == 2 && findCopilotDetail}
          {type == 3 && rentDetail}
          {type == 7 && rentCar}

        </View>

      </View>;
  }

  //状态 0-待处理 1-处理中 2-处理完成 3-已取消
  getStateStr(state) {
    if (state == 0) return '待处理';else if (state == 1) return '处理中';else if (state == 2) return '处理完成';else if (state == 3) return '已取消';else if (state == 4) return '处理失败';else if (state == 5) return '已关闭';
  }

  //周转 ----------------
  getTimeStr(value) {
    const list = [{ value: 1, text: '1~30天' }, { value: 2, text: '30天~1年' }, { value: 3, text: '1年以上' }];

    let target = {};
    list.map(function (item) {
      if (item.value == value) target = item;
    });
    return target.text || '';
  }

  getAmountStr(value) {
    const list = [{ value: 1, text: '1000 ~ 1万' }, { value: 2, text: '1万 ~ 5万' }, { value: 3, text: '5万以上' }];

    let target = {};
    list.map(function (item) {
      if (item.value == value) target = item;
    });
    return target.text || '';
  }

  getPreferenceStr(value) {
    const list = [{ value: 1, text: '纯信用借款产品' }, { value: 2, text: '抵押借款产品（汽车、房产）' }];

    let target = {};
    list.map(function (item) {
      if (item.value == value) target = item;
    });
    return target.text || '';
  }

  getRepaymentStr(value) {
    const list = [{ value: 1, text: '按日计息，随借随还' }, { value: 2, text: '按月等额，长期超划算' }, { value: 3, text: '按月付息，到期还本' }, { value: 4, text: '一次性还本付息' }];

    let target = {};
    list.map(function (item) {
      if (item.value == value) target = item;
    });
    return target.text || '';
  }

  getWorkStr(value) {
    const list = [{ value: 1, text: '出租车司机' }, { value: 2, text: '网约车司机' }];

    let target = {};
    list.map(function (item) {
      if (item.value == value) target = item;
    });
    return target.text || '';
  }

  getEarningStr(value) {
    const list = [{ value: 1, text: '5000~8000元' }, { value: 2, text: '8000~12000元' }, { value: 3, text: '12000~15000元' }, { value: 4, text: '15000元以上' }];

    let target = {};
    list.map(function (item) {
      if (item.value == value) target = item;
    });
    return target.text || '';
  }

  getEmergencyStr(value) {
    const list = [{ value: 1, text: '越快越好，即刻需求' }, { value: 2, text: '近期有可能需要' }, { value: 3, text: '暂时不需要' }];

    let target = {};
    list.map(function (item) {
      if (item.value == value) target = item;
    });
    return target.text || '';
  }

  //租车 ----------------
  getRentArray(value = '') {
    const list = [{ value: 1, text: '燃油车', more: '' }, { value: 2, text: '新能源车', more: '' }, { value: 3, text: '短租期', more: '(3个月)' }, { value: 4, text: '租车跑快车', more: '(注重车辆性价比)' }, { value: 5, text: '租车跑专车', more: '(注重车辆品牌性能)' }];

    let target = [];
    const values = value.split(',');
    for (let i = 0; i < values.length; i++) {
      const v = values[i];
      list.map(function (item) {
        if (item.value == v) target.push(item);
      });
    }
    return target;
  }

  //当副班 ----------------
  getWorkTimeStr(value) {
    const list = [{ value: 1, text: '白班' }, { value: 2, text: '夜班' }, { value: 3, text: '都可以' }];

    let target = {};
    list.map(function (item) {
      if (item.value == value) target = item;
    });
    return target.text || '';
  }

  getDriverTimeStr(value) {
    const list = [{ value: 0, text: '不限' }, { value: 1, text: '1年' }, { value: 2, text: '2年' }, { value: 3, text: '3年' }, { value: 4, text: '3年以上' }];

    let target = {};
    list.map(function (item) {
      if (item.value == value) target = item;
    });
    return target.text || '';
  }

  //type：0-周转 1-当副班 2-招副班 3-租车 4-亚滴租车 5-曹操出行 6-首汽约车
  getTypeStr(type) {
    if (type == 0) return '周转';else if (type == 1) return '当副班';else if (type == 2) return '招副班';else if (type == 3) return '租车';else if (type == 4) return '亚滴租车';else if (type == 5) return '曹操出行';else if (type == 6) return '首汽约车';
  }

  //精准选车-----------------------------------------

  getDynamics(value) {
    let list = [{ value: 0, text: '不限' }, { value: 1, text: '汽油' }, { value: 2, text: '纯电动' }, { value: 3, text: '油电混合' }, { value: 4, text: '油气混合' }];

    let target = {};
    list.map(function (item) {
      if (item.value == value) target = item;
    });
    return target.text || '';
  }

  getGearboxes(value) {
    let list = [{ value: 0, text: '不限' }, { value: 1, text: '自动挡' }, { value: 2, text: '手动挡' }];

    let target = {};
    list.map(function (item) {
      if (item.value == value) target = item;
    });
    return target.text || '';
  }

  getDisplacements(value) {
    let list = [{ value: 0, text: '不限' }, { value: 1, text: '1-2L' }, { value: 2, text: '2-3L' }, { value: 3, text: '3L以上' }];

    let target = {};
    list.map(function (item) {
      if (item.value == value) target = item;
    });
    return target.text || '';
  }

  getCarAges(value) {
    let list = [{ value: 0, text: '不限' }, { value: 1, text: '新车' }, { value: 2, text: '6个月以下' }, { value: 3, text: '6-12个月' }, { value: 4, text: '1-2年' }, { value: 5, text: '2-3年' }, { value: 6, text: '3年以上' }];

    let target = {};
    list.map(function (item) {
      if (item.value == value) target = item;
    });
    return target.text || '';
  }
  getMonies(value) {
    let list = [{ value: 0, text: '不限' }, { value: 1, text: '2000~4000元' }, { value: 2, text: '4000~6000元' }, { value: 3, text: '6000元以上' }];

    let target = {};
    list.map(function (item) {
      if (item.value == value) target = item;
    });
    return target.text || '';
  }

  getTimes(value) {
    let list = [{ value: 0, text: '不限' }, { value: 1, text: '3个月以下' }, { value: 2, text: '3~6个月' }, { value: 3, text: '6~12个月' }, { value: 4, text: '12~24个月' }, { value: 5, text: '24个月以上' }];

    let target = {};
    list.map(function (item) {
      if (item.value == value) target = item;
    });
    return target.text || '';
  }

}
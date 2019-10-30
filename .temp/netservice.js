import Taro, { request as _request } from "@tarojs/taro-h5";

export default class NetService {

  // static pre_url = 'http://192.168.10.200:8763/'; 
  static pre_url = 'http://47.107.118.242:8763/';
  // static pre_url = 'http://47.112.107.116:8763/';
  // static pre_url = 'https://api.hequecheguanjia.com/';

  /*
  发起网络请求，调用后端接口
  调用样例
  request({
      url: 'api/xxx/xxx',
      method: 'POST',  // GET
      data: {},
      success: function (res) {
      },
      error: function (err) {
      }
  })
  */
  static request(option) {
    let token = window.localStorage.getItem('token') || '';

    _request({
      url: this.pre_url + option.url,
      method: option.method ? option.method.toUpperCase() : 'POST',
      data: option.data || {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Authorization': token,
        'cache': 'no-cache'
      },
      success: function (res) {
        console.log('-->api: ' + option.url.slice(-40) + ', success:' + JSON.stringify(res.data));
        if (option.success && typeof option.success === 'function') option.success(res.data);
      },
      fail: function (err) {
        console.log('-->api: ' + option.url.slice(-40) + ', fail:' + JSON.stringify(err));
        if (option.error && typeof option.error === 'function') option.error(err);
      }
    });
  }

}
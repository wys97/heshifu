
import Netservice from '../netservice.js';

// 计算两点距离
export function calculateDistance(p1, p2) {
    const Rad = ((d) => {
        return d * Math.PI / 180.0; //经纬度转换成三角函数中度分表形式。
    });

    let a = Rad(p1.latitude) - Rad(p2.latitude);
    let b = Rad(p1.longitude) - Rad(p2.longitude);
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(Rad(p1.latitude)) * Math.cos(Rad(p2.latitude)) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;
    // EARTH_RADIUS;
    s = (Math.round(s * 10000) / 10000).toFixed(1);
    if (s >= 1) {
        s = s + 'km';
    } else {
        s = (Math.round(s * 1000)).toFixed(0) + 'm';
    }

    return s;
}

// 网址中 解析、查找 对应key的value
export function getUrlParam(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let url = window.location.href.split('#')[0]
    let search = url.split('?')[1]
    if (search) {
        var r = search.substr(0).match(reg)
        if (r !== null)
            return unescape(r[2])
        return null
    } else
        return null
}

// 上报用户行为
export function reporteUerBehavior(content, eventType, callBack) {
    let userId = localStorage.getItem('userId');
    if (userId) {
        const systemInfo = localStorage.getItem('systemInfo') || '';
        Netservice.request({
            url: 'heque-bi/bp/data/saveBpDataInfo',
            data: {
                userId: userId,
                content: content,
                eventType: eventType,
                terminal: systemInfo,
                channelType: 3
            },
            success: res => {
                callBack({ code: 0, msg: '0k' });
            },
            error: function (err) {
                callBack({ code: 1, msg: JSON.stringify(err) });
            }
        })
    }

}
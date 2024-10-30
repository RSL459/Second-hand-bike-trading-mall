// common/request.js
import config from './config.js';
const request = (url, method, data) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: config.BASE_URL + url,  // 拼接请求地址
            method: method,
            data: data,
            header: {
                'Content-Type': 'application/json',  // 设置请求头
            },
            success: (res) => {
                if (res.statusCode === 200) {
                    resolve(res.data);  // 请求成功，返回数据
                } else {
                    reject(res.data);  // 请求失败，抛出错误
                }
            },
            fail: (err) => {
                reject(err);  // 请求失败，抛出错误
            }
        });
    });
};

export default request;


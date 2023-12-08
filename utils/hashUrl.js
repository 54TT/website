import axios from "axios";
import cookie from "js-cookie";
const config = {
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Method': 'POST', // 允许的请求方法
        'Access-Control-Request-Headers': 'content-type',// 允许的请求头
        // 其他 CORS 相关头部
        'Authorization':cookie.get('token')?cookie.get('token'):undefined
    }
};
export const request =async (method,url,data)=>{
    return await axios[method]('http://188.166.191.246:8080' + url, data, config)
}


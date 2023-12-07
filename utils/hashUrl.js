import axios from "axios";

const hashUrl = "http://188.166.191.246:8080"
// export default hashUrl;

const config = {
    headers: {
        'Content-Type': 'application/json',
        // 'Access-Control-Request-Origin': '*',
        'Access-Control-Request-Method': 'POST', // 允许的请求方法
        'Access-Control-Request-Headers': 'content-type' // 允许的请求头
        // 其他 CORS 相关头部
    }
};
export const request =async (url,data)=>{
    return await axios.post('http://188.166.191.246:8080' + url, data, config)
}


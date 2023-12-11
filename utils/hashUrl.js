import axios from "axios";
import cookie from "js-cookie";
import dayjs from 'dayjs'
import baseUrl from "./baseUrl";

const requestA = axios.create({
    baseURL: 'http://188.166.191.246:8080',
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': cookie.get('token'),
        'Access-Control-Request-Method': 'GET,POST', // 允许的请求方法
        'Access-Control-Request-Headers': 'content-type',// 允许的请求头
    }
})

axios.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return null;
    }
);
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return null;
    }
);
export const request = async (method, url, data) => {
    const aa = cookie.get('username')
    if (aa && aa != 'undefined') {
        const params = JSON.parse(aa)
        if (params && params?.exp && dayjs(dayjs.unix(params?.exp)).isAfter(dayjs())) {
            return await requestA({
                method,
                params: method === 'get' ? data : '',
                data: method === 'get' ? '' : data,
                url
            })
        } else {
            return 'please login again'
        }
    } else {
        return await requestA({
            method,
            params: method === 'get' ? data : '',
            data: method === 'get' ? '' : data,
            url
        })
    }
}

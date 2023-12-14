import axios from "axios";
import cookie from "js-cookie";
import dayjs from 'dayjs'
import {notification} from "antd";
const requestA = axios.create({
    baseURL: 'http://188.166.191.246:8080',
    // headers: {
    // 'Content-Type': 'application/json; charset=utf-8',
    //     'Authorization': cookie.get('token')&&cookie.get('token')!='undefined'?cookie.get('token'):'',
    // }
})
axios.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        notification.warning({
            message: `Please refresh!`, placement: 'topLeft',
            duration: 2
        });
        return null
    }
);
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.message === 'Network Error' && !error.response) {
            console.error('Network error. Please check your internet connection.');
        } else if (error.response) {
            // 捕获服务器响应错误
            console.error('Server error:', error.response.status, error.response.data);
        } else {
            // 捕获其他类型的错误
            console.error('Error:', error.message);
        }
    }
);
export const request = async (method, url, data, token) => {
    const username = cookie.get('user')
    if (username && username != 'undefined') {
        const params = JSON.parse(username)
        if (params && params?.exp && dayjs(dayjs.unix(params?.exp)).isAfter(dayjs())) {
            if (url.includes('upload/image')) {
                const formData = new FormData();
                formData.append('file', data);
                return await requestA({
                    method,
                   data:formData,
                    url,
                    headers: {
                        'Content-Type': 'multipart/form-data', // 根据需要添加其他标头
                        'Authorization': token,
                    }
                })
            } else {
                return await requestA({
                    method,
                    params: method === 'get' ? data : method === 'delete' ? undefined : '',
                    data: method === 'get' ? '' : method === 'delete' ? undefined : data,
                    url,
                    headers: {'Authorization': token,}
                })
            }
        } else {
            return 'please'
        }
    } else {
        return await requestA({
            method,
            params: method === 'get' ? data : method === 'delete' ? undefined : '',
            data: method === 'get' ? '' : method === 'delete' ? undefined : data,
            url,
            headers: {
                'Authorization': token,
            }
        })
    }
}


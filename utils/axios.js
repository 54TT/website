import axios from 'axios'
import  baseUrl from '/utils/baseUrl'
var request = axios.create({
    baseURL: baseUrl,
    headers:{
        'Content-Type':'application/json',
        'token':''
    }
})

export  function get(url,params) {
    return request({method:'GET',params,url})
}
export  function post(url,params) {
    return request({method:'POST',data:params,url})
}

export  function put(url,params) {
    return request({method:'PUT',data:params,url})
}

export  function del(url,params) {
    return request({method:'DELETE',data:params,url})
}
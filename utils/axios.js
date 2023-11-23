import axios from 'axios'
import baseUrl from '/utils/baseUrl'
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
// const cook = cookie.get('name')
// if (!cook) {
//     setBolLogin(true)
//     try {
//         const message = new SiweMessage({
//             domain: window.location.host,
//             address: address,
//             statement: "Sign in with Ethereum to the app.",
//             uri: window.location.origin,
//             version: "1",
//             chainId: chain?.id,
//             nonce: await getCsrfToken(),
//         })
//         const signature = await signMessageAsync({
//             message: message.prepareMessage(),
//         })
//         const data = await signIn("credentials", {
//             message: JSON.stringify(message),
//             redirect: false,
//             signature,
//             callbackUrl: '/',
//         })
//         if (data && data.status === 200 && data.ok) {
//             setB()
//         }
//     } catch (error) {
//     }
// }

export  const getUser=async (params)=>{
    return await axios.get(baseUrl + "/api/user", {
        params: {
            address: params
        }
    })
}


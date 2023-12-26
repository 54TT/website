import React, {useState, useEffect, useRef, useContext} from 'react';
import {Card, Pagination, Segmented, Form, Input, Button, Popconfirm} from "antd";
import styles from '/public/styles/all.module.css'
import {CountContext} from '/components/Layout/Layout'
import {request} from "/utils/hashUrl";
import cookie from "js-cookie";
import {LoadingOutlined} from '@ant-design/icons'
import 'dayjs/locale/en'
import {default as Moralis} from "moralis";
import {ethers} from "ethers";

const {TextArea} = Input;
function Token(props) {
    const {changeTheme, setLogin} = useContext(CountContext);
    const [infoSow, setInfoShow] = useState(false)
    const [isSureShow, setIsSureShow] = useState(true)
    const [infoParams, setInfoParams] = useState(null)
    const [form] = Form.useForm()
    const [imagePreview, setImagePreview] = useState(null);
    //  img  图片
    const [imageP, setImageP] = useState(null);
    const filePickerRef = useRef(null);
    const [tokenAll, setTokenAll] = useState([]);
    const [tokenSlice, setTokenSlice] = useState([]);
    const [current, setCurrent] = useState(1);
    // form   数据
    const [formList, setFormList] = useState(null);
    useEffect(() => {
        if (tokenAll && tokenAll.length > 0) {
            const aaa = [...tokenAll]
            const data = aaa.slice((current - 1) * 20, current * 20)
            setTokenSlice(data)
        }
    }, [current, tokenAll])
    const onFinish = async (values) => {
        try {
            const token = cookie.get('token')
            const params = {...values, logo: imageP}
            const data = await request('post', '/api/v1/addToken', params, token);
          if(data==='please'){setLogin()}else  if (data && data?.status === 200) {
                setImagePreview(null);
                setImageP('')
                setInfoShow(false)
            }
        } catch (err) {
            return null
        }
    };
    const getParams = async () => {
        try {
            const token = cookie.get('username')
            if (token && token != 'undefined') {
                const data = JSON.parse(token)
                const aaa = await getAddressOwner('0xae2Fc483527B8EF99EB5D9B44875F005ba1FaE13')
                if (aaa && aaa.length > 0) {
                    setTokenAll(aaa)

                } else {
                    setTokenAll([])
                    setIsSureShow(false)
                }
            }
        } catch (err) {
            return null
        }
    }
    // 获取address  所有的代币合约地址
    const getAddressOwner = async (address) => {
        try {
            // Moralis   api  密钥   address-  0xae2Fc483527B8EF99EB5D9B44875F005ba1FaE13
            await Moralis.start({
                apiKey: "qHpI9lre2arPz6zZ5nRi7XMVJ5klhtZ1auxnSRX548DOKN2dryiwgfxgkgKSEqa3"
            });
            return await getCoinContract(address)
        } catch (e) {
            return await getCoinContract(address)
        }
    };
    const getCoinContract = async (address) => {
        //   获取用户地址  所有的合约地址
        const response = await Moralis.EvmApi.token.getWalletTokenBalances({
            "chain": "0x1", "address": address
        });
        // 判断合约地址是否有
        if (response.raw && response.raw.length > 0) {
            const par = response?.raw?.map(async (i) => {
                const a = await getTokenOwner(i?.token_address)
                return i.data = a
            })
            const results = await Promise.all(par);
            if (results.length > 0) {
                return results.filter((i) => i)
            } else {
                return null
            }
        } else {
            return null
        }
    }
    // 获取该  代币合约地址的   所有者
    const getTokenOwner = async (token) => {
        try {
            //   eth  api的节点
            const provider = new ethers.providers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/kNPJaYqMx7BA9TcDDJQ8pS5WcLqXGiG7');
            try {
                // eth的  合约 ABI
                const tokenAbi = [{
                    "anonymous": false, "inputs": [{
                        "indexed": true, "name": "previousOwner", "type": "address"
                    }, {
                        "indexed": true, "name": "newOwner", "type": "address"
                    }], "name": "OwnershipTransferred", "type": "event"
                }]
                //获取该  合约地址的所有者  0x726a02b8b22882a2a8bd29d03c0f34429288418a
                if (token) {
                    const tokenContract = new ethers.Contract(token, tokenAbi, provider);
                    // 过滤  合约地址所有者
                    const a = await tokenContract.filters.OwnershipTransferred("0x0000000000000000000000000000000000000000")
                    // 获取该代币合约地址  的所有者
                    const events = await tokenContract.queryFilter(a, 0, 19000000000);
                    if (events.length > 0 && events[0].args) {
                        return events[0]?.args[1]
                    }
                } else {
                    return null
                }
            } catch (err) {
                return null
            }
        } catch (err) {
            return null
        }
    }
    useEffect(() => {
        // getParams()
        setIsSureShow(false)
    }, [])
    const setInfo = async (i) => {
        try {
            setInfoParams(i)
            const token = cookie.get('token')
            request('get', '/api/v1/getTokenByTokenAddress', {address: i}, token).then(res => {
               if(res){setLogin()}else if (res && res?.status === 200) {
                    setFormList(res?.data?.tokenResponse)
                    setInfoShow(true)
                }
            }).catch(err => {
                setFormList(null)
                setInfoShow(true)
            })

        } catch (err) {
            return null
        }
    }
    //   获取图片
    const addImageFromDevice = async (e) => {
        try {
            const {files} = e.target;
            const token = cookie.get('token')
            const data = await request('post', '/api/v1/upload/image', files[0], token);
            if (data === 'please') {
                setLogin()
            } else if (data && data?.status === 200) {
                setImageP(data?.data?.url)
                setImagePreview(URL.createObjectURL(files[0]));
            }
        } catch (err) {
            return null
        }
    };
    // 删除图片
    const deleteImg = () => {
        setImagePreview(null);
        setImageP('')
    }
    const change = (e, a) => {
        setCurrent(e)
    }
    return (
        <div className={`${styles.coinBox} ${changeTheme ? 'coinBack' : 'brightTwo'}`}>
            <p style={{fontSize: '20px', fontWeight: 'bold'}} className={changeTheme ? 'darknessFour' : ''} onClick={()=>setInfoShow(true)}>MY TOKEN</p>
            {/*数据*/}
            {
                isSureShow ? <LoadingOutlined
                    style={changeTheme ? {color: 'white', display: 'block', margin: '0 auto'} : {
                        color: 'black',
                        display: 'block',
                        margin: '0 auto'
                    }}/> : <>
                    {
                        infoSow ? <div style={{display: 'flex', alignItems: 'center'}}>
                                <div className={styles.coinBoxTop}>
                                    <img src="/Booking.png" alt="" style={{width:'30px'}}/>
                                    {/*<span style={{margin: '0 10px'}}>{infoParams && infoParams.name}</span>*/}
                                    <span
                                        style={{color: '#9bc2d9'}}>{(infoParams?.slice(0, 5) + '...' + infoParams?.slice(-5))||''}</span>
                                </div>
                                <div className={styles.coinBoxSet}>
                                    <span className={styles.coinBoxInfo}>info</span>
                                    <img src="/setCoin.svg" alt=""  style={{cursor: 'pointer',width:'15px'}}/>
                                </div>
                            </div>
                            : ''
                    }
                    {
                        infoSow ? <Form
                            name="basic"
                            form={form}
                            onFinish={onFinish}
                            defaultValue={formList}
                            layout={'vertical'}
                            autoComplete="off"
                            className={`${styles.coinBoxForm} ${changeTheme ? 'colorDrak' : ''}`}
                        >
                            <Form.Item
                                label="e-mail"
                                name="email"
                                className={styles.coinBoxFormWi}
                            >
                                <Input className={changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}/>
                            </Form.Item>

                            <Form.Item
                                label="LINK TO LOGO URL"
                                name="link"
                                className={styles.coinBoxFormWi}
                                rules={[
                                    {
                                        required: !imagePreview,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                {
                                    imagePreview ? '' :
                                        <Input readOnly className={changeTheme ? 'darknessTwo' : 'brightTT'}
                                               onClick={() => filePickerRef.current.click()}/>
                                }
                                <input
                                    ref={filePickerRef}
                                    onChange={addImageFromDevice}
                                    type="file" readOnly
                                    accept="image/*"
                                    style={{display: "none"}}
                                />
                                {
                                    imagePreview ? <div style={{display: 'flex', alignItems: 'center'}}>
                                        <img src={imagePreview} alt="imagePreview"
                                             style={{width:'35px'}}/>
                                        <Popconfirm
                                            title="Delete the task"
                                            description="Are you sure to delete this task?"
                                            onConfirm={deleteImg}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <img src="/delete1.svg" style={{marginLeft: '10px', cursor: 'pointer',width:'15px'}} alt=""/>
                                        </Popconfirm>
                                    </div> : ''
                                }
                            </Form.Item>
                            <Form.Item
                                label="Token Website"
                                name="website"
                                className={styles.coinBoxFormWi}
                            >
                                <Input className={changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}/>
                            </Form.Item>
                            <Form.Item
                                label="Telegram"
                                name="telegram"
                                className={styles.coinBoxFormWi}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your username!',
                                    },
                                ]}
                            >
                                <Input className={changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}/>
                            </Form.Item>
                            <Form.Item
                                label="Discord"
                                name="discord"
                                className={styles.coinBoxFormWi}
                            >
                                <Input className={changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}/>
                            </Form.Item>
                            <Form.Item
                                label="Twitter"
                                name="Twitter"
                                className={styles.coinBoxFormWi}
                            >
                                <Input className={changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}/>
                            </Form.Item>
                            <Form.Item
                                label="Facebook"
                                name="facebook"
                                className={styles.coinBoxFormWi}
                            >
                                <Input className={changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}/>
                            </Form.Item>
                            <Form.Item
                                label="Youtube"
                                name="youtube"
                                className={styles.coinBoxFormWi}
                            >
                                <Input className={changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}/>
                            </Form.Item>
                            <Form.Item
                                label="Instagram"
                                name="instagram"
                                className={styles.coinBoxFormWi}
                            >
                                <Input className={changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}/>
                            </Form.Item>
                            <Form.Item
                                label="TikTok"
                                name="tikTok"
                                className={styles.coinBoxFormWi}
                            >
                                <Input className={changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}/>
                            </Form.Item>
                            <Form.Item
                                label="Medium"
                                name="medium"
                                className={styles.coinBoxFormWi}
                            >
                                <Input className={changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}/>
                            </Form.Item>
                            <Form.Item
                                label="Project Brief"
                                name="brief"
                                className={styles.coinBoxFormWi}
                            >
                                <Input className={changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}/>
                            </Form.Item>
                            <Form.Item label="TextArea" name="12"
                                      style={{width:'100%',}}>
                                <TextArea placeholder={'max. 150 characters'}
                                          className={changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'} style={{width: '100%',}}
                                          maxLength={10}/>
                            </Form.Item>
                            <Form.Item style={{display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
                                <div style={{display: 'flex',}}><img src="/Vectors.svg" alt=""
                                                                     onClick={() => {
                                                                         setInfoShow(false)
                                                                         form.resetFields()
                                                                     }}
                                                                     style={{cursor: 'pointer', marginRight: '20px',width:'25px'}}
                                                                     />
                                    <img src="/sure.svg" alt="" onClick={() => form.submit()}
                                         style={{cursor: 'pointer',width:'30px'}}
                                        />
                                </div>
                            </Form.Item>
                        </Form> : <div>
                            {
                                tokenSlice.length > 0 ? tokenSlice.map((i, index) => {
                                    return <div key={index} className={styles.coinBoxTop}>
                                <span style={{
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    marginRight: '10px'
                                }}>{index + 1}</span>
                                        <img src="/Booking.png" alt="" style={{width:'30px'}}/>
                                        {/*<span style={{margin: '0 10px'}}>{i.name}</span>*/}
                                        <span style={{color: '#2294D4'}}>{i?.slice(0, 5) + '...' + i?.slice(-4)}</span>
                                        <div className={styles.coinBoxSet}>
                            <span style={{
                                fontSize: '18px',
                                fontWeight: 'bold',
                                marginRight: '10px',
                                cursor: 'pointer',
                            }}>info</span>
                                            <img src="/setCoin.svg" alt="" style={{cursor: 'pointer',width:'15px'}}
                                                 onClick={() => setInfo(i)}/>
                                        </div>
                                    </div>
                                }) : <p style={{textAlign: 'center'}}>no data</p>}
                            {
                                tokenAll.length > 0 ? <div>
                                    <Pagination pageSize={20} onChange={change}
                                                rootClassName={`${changeTheme ? 'drakePat' : ''} setBo`}
                                                defaultCurrent={1}
                                                total={tokenAll.length}/>
                                </div> : ''
                            }
                        </div>
                    }
                </>

            }

        </div>
    );
}

export default Token;
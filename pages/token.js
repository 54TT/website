import React, {useState, useEffect, useRef, useContext} from 'react';
import {Card, Pagination, Segmented, Form, Input, Button, Popconfirm} from "antd";
import styles from '/public/styles/all.module.css'
import {CountContext} from '/components/Layout/Layout'
import {request} from "../utils/hashUrl";
import cookie from "js-cookie";
import dayjs from "dayjs";
import 'dayjs/locale/en'
import {default as Moralis} from "moralis";
import {ethers} from "ethers";

const {TextArea} = Input;

function Token(props) {
    const {changeTheme, setLogin} = useContext(CountContext);
    const [infoSow, setInfoShow] = useState(false)
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
    const onFinish = (values) => {
        console.log('Success:', values);
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
            const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/d2660efdeff84ac982b0d2de03e13c20');
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
    }
    useEffect(() => {
        getParams()
    }, [])
    const setInfo = async (i) => {
        try {
            setInfoParams(i)
            const token = cookie.get('token')
            const data = await request('get', '/api/v1/getTokenByTokenAddress', '', token);
            setInfoShow(true)
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
        <div className={`${styles.coinBox} ${changeTheme ? 'darknessTwo' : 'brightTwo'}`}>
            <p style={{fontSize: '20px', fontWeight: 'bold'}} className={changeTheme ? 'darknessFour' : ''}>MY TOKEN</p>
            {/*数据*/}
            {
                infoSow ? <div style={{display: 'flex', alignItems: 'center'}}>
                        <div className={styles.coinBoxTop}>
                            <img src="/Booking.png" alt="" width={30}/>
                            <span style={{margin: '0 10px'}}>{infoParams && infoParams.name}</span>
                            <span style={{color: '#9bc2d9'}}>{infoParams && infoParams.token}</span>
                        </div>
                        <div className={styles.coinBoxSet}>
                            <span className={styles.coinBoxInfo}>info</span>
                            <img src="/setCoin.svg" alt="" width={15} style={{cursor: 'pointer'}}/>
                        </div>
                    </div>
                    : ''
            }
            {
                infoSow ? <Form
                    name="basic"
                    form={form}
                    onFinish={onFinish}
                    layout={'vertical'}
                    autoComplete="off"
                    className={`${styles.coinBoxForm} ${changeTheme ? 'colorDrak' : ''}`}
                >
                    <Form.Item
                        label="e-mail"
                        name="e-mail"
                        style={{width: '45%', marginBottom: '10px'}}
                        labelCol={{
                            span: 20,
                        }}
                    >
                        <Input className={changeTheme ? 'darknessTwo' : 'brightTT'}/>
                    </Form.Item>

                    <Form.Item
                        label="LINK TO LOGO URL"
                        name="LINK"
                        labelCol={{
                            span: 20,
                        }}
                        style={{width: '45%', marginBottom: '10px'}}
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
                                     width={35}/>
                                <Popconfirm
                                    title="Delete the task"
                                    description="Are you sure to delete this task?"
                                    onConfirm={deleteImg}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <img src="/delete1.svg" style={{marginLeft: '10px', cursor: 'pointer'}}
                                         alt=""
                                         width={15}/>
                                </Popconfirm>
                            </div> : ''
                        }
                    </Form.Item>
                    <Form.Item
                        label="Token Website"
                        labelCol={{
                            span: 20,
                        }}
                        name="Token"
                        style={{width: '45%', marginBottom: '10px'}}
                    >
                        <Input className={changeTheme ? 'darknessTwo' : 'brightTT'}/>
                    </Form.Item>
                    <Form.Item
                        label="Telegram"
                        labelCol={{
                            span: 20,
                        }}
                        name="Telegram"
                        style={{width: '45%', marginBottom: '10px'}}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input className={changeTheme ? 'darknessTwo' : 'brightTT'}/>
                    </Form.Item>
                    <Form.Item
                        label="Discord"
                        name="Discord"
                        labelCol={{
                            span: 20,
                        }}
                        style={{width: '45%', marginBottom: '10px'}}
                    >
                        <Input className={changeTheme ? 'darknessTwo' : 'brightTT'}/>
                    </Form.Item>
                    <Form.Item
                        label="Twitter"
                        labelCol={{
                            span: 20,
                        }}
                        name="Twitter"
                        style={{width: '45%', marginBottom: '10px'}}
                    >
                        <Input className={changeTheme ? 'darknessTwo' : 'brightTT'}/>
                    </Form.Item>
                    <Form.Item
                        label="Facebook"
                        labelCol={{
                            span: 20,
                        }}
                        name="Facebook"
                        style={{width: '45%', marginBottom: '10px'}}
                    >
                        <Input className={changeTheme ? 'darknessTwo' : 'brightTT'}/>
                    </Form.Item>
                    <Form.Item
                        label="Youtube"
                        name="Youtube"
                        labelCol={{
                            span: 20,
                        }}
                        style={{width: '45%', marginBottom: '10px'}}
                    >
                        <Input className={changeTheme ? 'darknessTwo' : 'brightTT'}/>
                    </Form.Item>
                    <Form.Item
                        label="Instagram"
                        name="Instagram"
                        labelCol={{
                            span: 20,
                        }}
                        style={{width: '45%', marginBottom: '10px'}}
                    >
                        <Input className={changeTheme ? 'darknessTwo' : 'brightTT'}/>
                    </Form.Item>
                    <Form.Item
                        label="TikTok"
                        name="TikTok"
                        labelCol={{
                            span: 20,
                        }}
                        style={{width: '45%', marginBottom: '10px'}}
                    >
                        <Input className={changeTheme ? 'darknessTwo' : 'brightTT'}/>
                    </Form.Item>
                    <Form.Item
                        label="Medium"
                        name="Medium"
                        labelCol={{
                            span: 20,
                        }}
                        style={{width: '45%', marginBottom: '10px'}}
                    >
                        <Input className={changeTheme ? 'darknessTwo' : 'brightTT'}/>
                    </Form.Item>
                    <Form.Item
                        label="Project Brief"
                        name="Project"
                        labelCol={{
                            span: 20,
                        }}
                        style={{width: '45%', marginBottom: '10px'}}
                    >
                        <Input className={changeTheme ? 'darknessTwo' : 'brightTT'}/>
                    </Form.Item>

                    <Form.Item label="TextArea" name="12" labelCol={{span: 20,}}
                               style={{width: '100%', marginBottom: '10px'}}>
                        <TextArea placeholder={'max. 150 characters'}
                                  className={changeTheme ? 'darknessTwo' : 'brightTT'} style={{width: '100%',}}
                                  maxLength={10}/>
                    </Form.Item>
                    <Form.Item style={{display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
                        <div style={{display: 'flex',}}><img src="/Vectors.svg" alt=""
                                                             onClick={() => setInfoShow(false)}
                                                             style={{cursor: 'pointer', marginRight: '20px'}}
                                                             width={25}/>
                            <img src="/sure.svg" alt="" onClick={() => form.submit()} style={{cursor: 'pointer'}}
                                 width={30}/>
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
                                <img src="/Booking.png" alt="" width={30}/>
                                {/*<span style={{margin: '0 10px'}}>{i.name}</span>*/}
                                <span style={{color: '#2294D4'}}>{i}</span>
                                <div className={styles.coinBoxSet}>
                            <span style={{
                                fontSize: '18px',
                                fontWeight: 'bold',
                                marginRight: '10px',
                                cursor: 'pointer'
                            }}>info</span>
                                    <img src="/setCoin.svg" alt="" width={15} style={{cursor: 'pointer'}}
                                         onClick={() => setInfo(i)}/>
                                </div>
                            </div>
                        }) : ''}
                    {
                        tokenAll.length > 0 ? <div
                            style={{position: 'absolute', bottom: '50px', left: '50%', transform: 'translateX(-50%)'}}>
                            <Pagination pageSize={20} onChange={change}
                                        rootClassName={`${changeTheme ? 'drakePat' : ''} setBo`} defaultCurrent={1}
                                        total={tokenAll.length}/>
                        </div> : ''
                    }
                </div>
            }
        </div>
    );
}

export default Token;
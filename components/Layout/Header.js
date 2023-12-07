import React, {useContext, useEffect, useRef, useState} from "react";
import baseUrl from '/utils/baseUrl'
import {request} from '/utils/hashUrl'
import {useAccount, useConnect, useDisconnect,} from "wagmi"
import {InjectedConnector} from 'wagmi/connectors/injected'
import axios from 'axios';
import {Button, DatePicker, Drawer, Dropdown, Form, Input, notification, Select,} from 'antd'
import {CaretDownFilled, CaretRightFilled} from '@ant-design/icons';
import styles from './css/header.module.css'
import DrawerPage from './Drawer';
import jwt from 'jsonwebtoken';
import dynamic from "next/dynamic";
import Link from 'next/link'
import _ from 'lodash'
import cookie from 'js-cookie'
import {useRouter} from 'next/router'
// const DrawerPage = dynamic( () =>  import('./Drawer'),)
import {get, post} from '/utils/axios'
import {ethers} from 'ethers'
import {CountContext} from '/components/Layout/Layout';
import Marquee from "react-fast-marquee";
import {changeLang} from "/utils/set";

const {Option} = Select;
// import ChatSearch from "../Chat/ChatSearch";
const ChatSearch = dynamic(() => import('../Chat/ChatSearch'), {ssr: false})
// import {default as Moralis} from 'moralis'
const Moralis = require("moralis")?.default;
const Header = () => {
    const router = useRouter()
    const [form] = Form.useForm();
    const inputRef = useRef(null);
    const {address, isConnected} = useAccount()
    const {disconnect} = useDisconnect()
    const {connect} = useConnect({
        connector: new InjectedConnector(),
    });
    const {bolName, changeBolLogin, changeShowData, changeFont, changeTheme} = useContext(CountContext);
    const header = changeLang('header')
    const [open, setOpen] = useState(false);
    const [openPresale, setOpenPresale] = useState(false);
    const [openLaunch, setOpenLaunch] = useState(false);
    const [openLink, setOpenLink] = useState(false);
    const [presalePlatform, setPresalePlatform] = useState([]);
    const [launchPlatform, setLaunchPlatform] = useState([]);
    const [tokenForm, setTokenForm] = useState({});
    const [timeForm, setTime] = useState({});
    const [tokenFormBol, setTokenFormBol] = useState(false);
    const changeToken = _.debounce((e) => {
        get('/getTokenNameAndSymbol', {
            tokenAddress: e?.target?.value ? e.target.value : ''
        }).then(res => {
            if (res.status === 200 && res?.data?.symbol) {
                setTokenForm(res.data)
                setTokenFormBol(false)
            } else {
                setTokenForm([])
                setTokenFormBol(false)
            }
        }).catch(err => {
            setTokenForm([])
            setTokenFormBol(false)
        })
    }, 1500)
    useEffect(() => {
        if (cookie.get('username') && bolName && address) {
            getUs()
        }
    }, [bolName])
    const onClose = () => {
        setOpen(false);
        form.resetFields()
    };
    useEffect(() => {
        if (cookie.get('name') && cookie.get('name') !== address && address) {
            cookie.set('name', address, {expires: 1})
            if (router.pathname !== '/') {
                router.push('/')
            }
            changeBolLogin()
            getUs()
        }
    }, [address])
    const showDrawer = () => {
        if (cookie.get('username')) {
            setOpen(true);
            get('/selectPresalePlatform', '').then(res => {
                if (res && res.status === 200) {
                    setPresalePlatform(res.data ? res.data : [])
                } else {
                    setPresalePlatform([])
                }
            }).catch(err => {
                setPresalePlatform([])
            })
            get('/selectLaunchPlatform', '').then(res => {
                if (res && res.status === 200) {
                    setLaunchPlatform(res.data ? res.data : [])
                } else {
                    setLaunchPlatform([])
                }
            }).catch(err => {
                setLaunchPlatform([])
            })
        } else {
            setLaunchPlatform([])
        }
    };
    const onFinishFailed = (a) => {
        notification.warning({
            message: `warning`, description: 'Please enter complete data!', placement: 'topLeft',
            duration: 2
        });
    }
    const onFinish = (values) => {
        if (tokenFormBol) {
            inputRef.current.focus({
                cursor: 'all',
            });
        } else {
            const token = {
                ...tokenForm,
                address: values.token,
                twitter: values.twitter,
                website: values.website,
                telegram: values.telegram
            }
            let presale = {}
            let launch = {}
            let bol = false
            if (!timeForm.presale && !values.presalePlatformId && !values.presaleLink) {
            } else if (!timeForm.presale || !values.presalePlatformId || !values.presaleLink) {
                bol = true
                notification.warning({
                    message: `warning`, description: 'Presale please enter complete!', placement: 'topLeft',
                    duration: 2
                });
            } else {
                presale.presaleTime = timeForm?.presale;
                presale.presalePlatformId = values?.presalePlatformId;
                presale.presaleLink = values?.presaleLink;
            }
            if (!timeForm.launch && !values.launchPlatformId && !values.launchLink) {
            } else if (!timeForm.launch || !values.launchPlatformId || !values.launchLink) {
                bol = true
                notification.warning({
                    message: `warning`, description: 'Launch please enter complete!', placement: 'topLeft',
                    duration: 2
                });
            } else {
                launch.launchTime = timeForm?.launch;
                launch.launchPlatformId = values?.launchPlatformId;
                launch.launchLink = values?.launchLink;
            }
            var arrPresale = Object.keys(presale);
            var arrLaunch = Object.keys(launch);
            if (arrPresale.length === 0 && arrLaunch.length === 0 && !bol) {
                notification.warning({
                    message: `warning`, description: 'Presale or Launch please enter complete!', placement: 'topLeft',
                    duration: 2
                });
            } else if (!bol) {
                const data = {
                    token,
                    presale: arrPresale.length === 0 ? '' : presale,
                    launch: arrLaunch.length === 0 ? '' : launch
                }
                post('/addPresaleAndLaunch', data).then(res => {
                    if (res && res.data?.success) {
                        form.resetFields()
                        setTokenForm({})
                        setTime({})
                        setOpen(false);
                    } else {
                        notification.warning({
                            message: `warning`, description: 'add failed,Please try again', placement: 'topLeft',
                            duration: 2
                        });
                    }
                }).catch(err => {
                    notification.warning({
                        message: `warning`, description: 'add failed,Please try again', placement: 'topLeft',
                        duration: 2
                    });
                })
            }
        }
    };
    const hidePresale = () => {
        setOpenPresale(!openPresale)
    }
    const hideLaunch = () => {
        setOpenLaunch(!openLaunch)
    }
    const hideLink = () => {
        setOpenLink(!openLink)
    }
    const [showChatSearch, setShowChatSearch] = useState(false);
    const [chats, setChats] = useState([]);
    const [userPar, setUserPar] = useState(null);
    const [userBol, setUserBol] = useState(false);
    const getParams = async () => {
        const res = await axios.get(`${baseUrl}/api/chats`, {
            params: {userId: userPar?.id}
        });
        if (res.status === 200) {
            setChats(res.data)
        } else {
            setChats([])
        }
    }
    useEffect(() => {
        if (userPar && userPar.id) {
            getParams()
        }
    }, [userPar])
    const onChangeDate = (name, value, dateString) => {
        let data = _.clone(timeForm)
        if (name === 'launch') {
            data.launch = dateString
            setTime(data)
        } else {
            data.presale = dateString
            setTime(data)
        }
    };
    const [bol, setBol] = useState(false)
    const setB = () => {
        setBol(true)
    }
    const getUs = async () => {
        const data = await axios.get(baseUrl + "/api/user", {
            params: {
                address
            }
        })
        console.log(data)
        if (data?.data && data?.data?.user) {
            setUserPar(data?.data?.user)
            cookie.set('name', address, {expires: 1})
            // 登录刷新   social
            changeShowData()
            cookie.set('username', JSON.stringify(data?.data?.user), {expires: 1})
        } else {
            const {data} = await axios.get('https://api.ipify.org?format=json')
            if (data && data.ip) {
                const ip = await axios.post(baseUrl + "/api/user", {
                    address, ipV4Address: data.ip, ipV6Address: data.ip
                })
                if (ip?.data && ip?.data?.user) {
                    setUserPar(ip?.data?.user)
                    cookie.set('username', JSON.stringify(ip?.data?.user), {expires: 1})
                    // 登录刷新   social
                    changeShowData()
                    cookie.set('name', address, {expires: 1})
                }
            }
        }
    }
    useEffect(() => {
        if (bol && address) {
            getUs()
            setBol(false)
        }
    }, [bol])
    // 登录
    const handleLogin = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // provider._isProvider   判断是否还有请求没有结束
        let account = await provider.send("eth_requestAccounts", []);
        // let account = []
        // 连接的网络和链信息。
        var chain = await provider.getNetwork()
        const {status, data} = await request('/api/v1/token', {address})
        // 获取签名
        var signer = await provider.getSigner();
        // 判断是否有账号
        if (account.length > 0 && data && status === 200) {
            // 判断是否是eth
            if (chain && chain.name !== 'unknow' && chain.chainId) {
                try {
                    // const message = `请签名证明你是钱包账户的拥有者\nstatement:${window.location.host}\nNonce:\n${date}\ndomain:\n ${window.location.host}\naddress: ${address}\nchainId:${chain.chainId}\nuri: ${window.location.origin}\n`
                    // 签名
                    const message = data?.nonce
                    const signature = await signer.signMessage(message)
                    // 验证签名
                    // const recoveredAddress = ethers.utils.verifyMessage(message, signature);
                    const res = await request('/api/v1/login', {
                        signature: signature,
                        addr: address,
                        message
                    })
                    // const data = await getAddressOwner(address)
                    if (res && res.data && res.data?.accessToken) {
                        //   jwt  解析 token获取用户信息
                        const decodedToken = jwt.decode(res.data?.accessToken);
                        if (decodedToken && decodedToken.address) {
                            cookie.set('token', res.data?.accessToken)
                            cookie.set('name', address)
                            cookie.set('username', JSON.stringify(decodedToken))
                            setUserBol(!userBol)
                        }
                    }
                    // if (recoveredAddress === address) {
                    //     setB()
                    //     const data = await getAddressOwner(address)
                    // }
                } catch (err) {
                    return null
                }
            } else {
            }
        } else {
        }
    }
    const set = () => {
        cookie.remove('name');
        cookie.remove('username');
        if (router.pathname !== '/') {
            router.push('/')
        }
        disconnect()
    }
    // 获取address  所有的代币合约地址
    const getAddressOwner = async (address) => {
        try {
            // Moralis   api  密钥   address-0xae2Fc483527B8EF99EB5D9B44875F005ba1FaE13
            await Moralis.start({
                apiKey: "qHpI9lre2arPz6zZ5nRi7XMVJ5klhtZ1auxnSRX548DOKN2dryiwgfxgkgKSEqa3"
            });
            const data = await getCoinContract(address)
            console.log(data)
        } catch (e) {
            const data = await getCoinContract(address)
            console.log(data)
        }
    };
    const getCoinContract = async (address) => {
        //   获取用户地址  所有的合约地址
        const response = await Moralis.EvmApi.token.getWalletTokenBalances({
            "chain": "0x1",
            "address": address
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
        //   eth  api的节点
        const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/d2660efdeff84ac982b0d2de03e13c20');
        // eth的  合约 ABI
        const tokenAbi = [{
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
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
    }
    const [connectBol, setConnectBol] = useState(false)
    useEffect(() => {
        if (connectBol && isConnected) {
            handleLogin()
            setConnectBol(false)
        }
    }, [isConnected])

    const getMoney = () => {
        if (typeof window.ethereum === 'undefined') {
            notification.warning({
                message: `warning`, description: 'Please install MetaMask! And refresh', placement: 'topLeft',
                duration: 2
            });
        } else {
            if (!isConnected) {
                connect()
                setConnectBol(true)
            } else {
                handleLogin()
            }
        }
    }
    const [no, setNo] = useState(false)
    useEffect(() => {
        if (cookie.get('username') && address) {
            const data = JSON.parse(cookie.get('username'))
            setNo(true)
            setUserPar(data)
        } else {
            // router.push('/')
            setNo(false)
            setUserPar('')
        }
    }, [cookie.get('name'), cookie.get('username'), userBol])
    const items = [
        {
            key: '1',
            label: (
                <Link href={`/${userPar && userPar.address ? userPar.address : ''}`}>
                       <span>
      Personal
    </span>
                </Link>
            ),
        },
        {
            key: '2',
            label: (
                <span>
         Token settings
          </span>
            ),
        },
        {
            key: '3',
            label: (
                <span onClick={set}>
            Sign out
          </span>
            ),
        },
        {
            key: '4',
            label: (
                <span onClick={set}>
           Add a coin
          </span>
            ),
        },
    ];
    const [launch, setLaunch] = useState([])
    const showSearch = () => {
        if (cookie.get('username')) {
            setShowChatSearch(true)
        } else {
            getMoney()
        }
    }
    const getLaunch = async () => {
        const res = await axios.get(baseUrl + '/queryLaunch', {
            pageIndex: 0,
            pageSize: 10
        })
        const {data: {data}} = res
        setLaunch(data && data.length > 0 ? data : [])
    }
    useEffect(() => {
        getLaunch()
    }, [])
    const handleChange = (value) => {
        changeFont(value)
    }
    // 获取eth  gas和price
    const getGasPrice = () => {
        console.log(1111111111)
        const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/d2660efdeff84ac982b0d2de03e13c20');
        // 获取当前 gas 价格
        provider.getGasPrice().then((gasPrice) => {
            console.log(gasPrice)
            console.log(ethers.utils.formatEther(gasPrice), 'ETH');
            console.log(ethers.utils.formatUnits(gasPrice, 'gwei')); // 将 wei 转换为 ETH，并打印到控制台
        }).catch((err) => {
            console.error('Failed to get gas price:', err);
        });
    }
    return (
        <div
            className={"top-0 w-full  z-30 transition-all headerClass"}>
            <div className={styles['aaa']} style={{paddingLeft: '110px'}}>
                <span onClick={getGasPrice}>1111111</span>
                {/*<div onClick={() => getAddressOwner('0xae2Fc483527B8EF99EB5D9B44875F005ba1FaE13')}>12345</div>*/}
                <Marquee
                    pauseOnHover={true}
                    speed={30}
                    gradientWidth={100}
                    className={styles.marqueeBox}>
                    {
                        launch.length > 0 && launch.map((i, index) => {
                            return <div key={index} className={`${styles.marquee} `}>
                                <span className={changeTheme ? 'darknessFont' : 'brightFont'}>#{index + 1}</span>
                                <p className={styles.marqueeName}>{i?.symbol?.slice(0, 1)}</p>
                                <span className={changeTheme ? 'darknessFont' : 'brightFont'}>{i.symbol}</span>
                            </div>
                        })
                    }
                </Marquee>
                <div className={styles.searchToken}>
                    <p className={`${styles['search']} ${changeTheme ? 'darknessThree' : 'brightFore boxHover'}`}
                       onClick={showSearch}>{header.search}</p>
                    {showChatSearch && (
                        <ChatSearch
                            setShowChatSearch={setShowChatSearch}
                            chats={chats}
                            setChats={setChats}
                            user={userPar}
                        />
                    )}
                </div>
                <div className={styles.login}>
                    {/*切换字体*/}
                    {/*<Select*/}
                    {/*    style={{*/}
                    {/*        width: 120,*/}
                    {/*    }}*/}
                    {/*    defaultValue={'english'}*/}
                    {/*    onChange={handleChange}*/}
                    {/*    options={[*/}
                    {/*        {*/}
                    {/*            value: 'chinese',*/}
                    {/*            label: '中文简体',*/}
                    {/*        },*/}
                    {/*        {*/}
                    {/*            value: 'traditional',*/}
                    {/*            label: '中文繁体',*/}
                    {/*        },*/}
                    {/*        {*/}
                    {/*            value: 'english',*/}
                    {/*            label: 'English',*/}
                    {/*        },*/}
                    {/*    ]}*/}
                    {/*/>*/}
                    {/*添加代币*/}
                    {/*<Button type={'primary'} className={styles['but']}*/}
                    {/*        onClick={showDrawer}>{header.addCoin}</Button>*/}
                    <div className={`${styles.eth} ${changeTheme ? 'darknessTwo' : 'brightTwo'}`}>
                        <img src="/Ellipse27.png" alt="" width={30} style={{border: '50%', marginRight: '6px'}}/>
                        <p className={changeTheme ? 'darknessFont' : 'brightFont'}>$:2028</p>
                        <p style={{display: 'flex', alignItems: 'center', marginLeft: '8px'}}><img src="/GasStation.png"
                                                                                                   width={20} alt=""/>
                            <span className={changeTheme ? 'darknessFont' : 'brightFont'}>29</span>
                        </p>
                    </div>
                    {
                        no && address ? <div className={styles.loginBox}>
                            <Link href={`/${userPar && userPar.address ? userPar.address : ''}`}>
                                <img className={'loginImg'} width={35}
                                     src={userPar && userPar.profilePicUrl ? userPar.profilePicUrl : '/Ellipse1.png'}
                                     alt=""/>
                            </Link>
                            <Dropdown
                                menu={{
                                    items,
                                }}
                                placement="bottomLeft"
                                arrow
                            >
                                <Button
                                    className={`${styles.loginName} ${styles.but} ${changeTheme ? 'darknessThree' : 'brightFore boxHover'} `}>{userPar && userPar.username ? userPar.username.length > 5 ? userPar.username.slice(0, 5) + '...' : userPar.username : userPar.address.slice(0, 5) + '...'}</Button>
                            </Dropdown>
                        </div> : <Button
                            className={`${styles['but']} ${styles.loginName} ${changeTheme ? 'darknessThree' : 'brightFore boxHover'}`}
                            onClick={getMoney}>{header.login}</Button>
                    }
                </div>
            </div>
            <DrawerPage getMoney={getMoney}/>
            {/*</Suspense>*/}
            <Drawer title="Basic Drawer" destroyOnClose={true} placement="right" onClose={onClose} open={open}>
                <Form
                    name="basic"
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Token"
                        name="token"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your token!',
                            },
                        ]}
                        labelCol={{
                            span: 6,
                        }}>
                        <Input onChange={changeToken} ref={inputRef}
                               style={tokenFormBol ? {borderColor: 'red'} : {}}/>
                    </Form.Item>
                    <div className={styles.addShow}>
                        {
                            !openPresale ? <CaretRightFilled className={styles.addCur}
                                                             onClick={hidePresale}/> :
                                <CaretDownFilled onClick={hidePresale}
                                                 className={`${styles.addCur} ${styles.addCurMt5}`}/>
                        }
                        <p className={styles.addPresale} onClick={hidePresale}>presale</p>
                        <p className={styles.lines}></p>
                    </div>
                    <div style={!openPresale ? {display: 'none'} : {}}>
                        <Form.Item
                            label="Time"
                            name="presaleTime"
                            labelCol={{
                                span: 6,
                            }}
                        >
                            <DatePicker showTime onChange={(e, a) => onChangeDate('presale', e, a)}
                                        style={{width: '100%'}}/>
                        </Form.Item>
                        <Form.Item
                            label="Platform"
                            name="presalePlatformId"
                            labelCol={{
                                span: 8,
                            }}
                        >
                            <Select
                                placeholder="Select a option and change input text above"
                                allowClear
                                style={{width: '100%'}}
                            >
                                {
                                    presalePlatform.length > 0 ? presalePlatform.map((i, index) => {
                                        return <Option value={i.id} key={index}>
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                <img src={`${i.logo ? baseUrl + i.logo : '/Ellipse1.png'}`} alt=""
                                                     width={20} height={20}/>
                                                <span>{i.name}</span>
                                            </div>
                                        </Option>
                                    }) : null
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Link"
                            name="presaleLink"
                            labelCol={{
                                span: 6,
                            }}
                        >
                            <Input/>
                        </Form.Item>
                    </div>
                    {/*launch*/}
                    <div className={styles.addShow}>
                        {
                            !openLaunch ? <CaretRightFilled className={`${styles.addCur}`}
                                                            onClick={hideLaunch}/> :
                                <CaretDownFilled onClick={hideLaunch}
                                                 className={`${styles.addCur} ${styles.addCurMt5}`}/>
                        }
                        <p className={styles.addPresale} onClick={hideLaunch}>launch</p>
                        <p className={styles.lines}></p>
                    </div>
                    <div style={!openLaunch ? {display: 'none'} : {}}>
                        <Form.Item
                            label="Time"
                            name="launchTime"
                            className={'bbb'}
                            labelCol={{
                                span: 6,
                            }}
                        >
                            <DatePicker showTime onChange={(e, a) => onChangeDate('launch', e, a)}
                                        style={{width: '100%'}}/>
                        </Form.Item>
                        <Form.Item
                            label="Platform"
                            name="launchPlatformId"
                            className={'bbb'}
                            labelCol={{
                                span: 8,
                            }}
                        >
                            <Select
                                placeholder="Select a option and change input text above"
                                allowClear
                                style={{width: '100%'}}
                            >
                                {
                                    launchPlatform.length > 0 ? launchPlatform.map((i, index) => {
                                        return <Option value={i.id} key={index}>
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                <img src={`${i.logo ? baseUrl + i.logo : '/Ellipse1.png'}`} alt=""
                                                     width={20} height={20}/>
                                                <span>{i.name}</span>
                                            </div>
                                        </Option>
                                    }) : null
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Link"
                            name="launchLink"
                            className={'bbb'}
                            labelCol={{
                                span: 6,
                            }}
                        >
                            <Input/>
                        </Form.Item>
                    </div>
                    {/*link*/}
                    <div className={styles.addShow}>
                        {
                            openLink ? <CaretRightFilled className={styles.addCur}
                                                         onClick={hideLink}/> : <CaretDownFilled onClick={hideLink}
                                                                                                 className={`${styles.addCur} ${styles.addCurMt5}`}/>
                        }
                        <p className={styles.addPresale} onClick={hideLink}>Link</p>
                        <p className={styles.lines}></p>
                    </div>
                    <div style={openLink ? {display: 'none'} : {}}>
                        <Form.Item
                            label="Twitter"
                            name="twitter"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your twitter!',
                                },
                            ]} labelCol={{
                            span: 8,
                        }}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Telegram"
                            name="telegram"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your telegram!',
                                },
                            ]} labelCol={{
                            span: 9,
                        }}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Website"
                            name="website"
                            className={'bbb'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your website!',
                                },
                            ]} labelCol={{
                            span: 8,
                        }}
                        >
                            <Input/>
                        </Form.Item>
                    </div>
                    <Form.Item wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}>
                        <Button type={'primary'} htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>


            </Drawer>
        </div>
    );
};

export default Header;

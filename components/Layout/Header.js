import React, {useContext, useEffect, useRef, useState} from "react";
import baseUrl from '/utils/baseUrl'
import {request} from '/utils/hashUrl'
import {useAccount, useConnect, useDisconnect,} from "wagmi"
import {InjectedConnector} from 'wagmi/connectors/injected'
import axios from 'axios';
import {Button, DatePicker, Drawer, Dropdown, Form, Input, notification, Select, Switch,} from 'antd'
import {CaretDownFilled, CaretRightFilled} from '@ant-design/icons';
import styles from './css/header.module.css'
import jwt from 'jsonwebtoken';
import DrawerPage from './Drawer'
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
import Image from 'next/image'
import {gql} from "graphql-tag";
import {ApolloClient, InMemoryCache, useQuery} from "@apollo/client";
import dayjs from "dayjs";

const client = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v2-dev', cache: new InMemoryCache(),
});
const {Option} = Select;
// import ChatSearch from "../Chat/ChatSearch";
const ChatSearch = dynamic(() => import('../Chat/ChatSearch'), {ssr: false})
const Moralis = require("moralis")?.default;
const Header = () => {
    const drawer = changeLang('drawer')
    const GET_DATA = gql`query LiveNewPair {
  bundles {
    id
    ethPrice
  }
}`
    const [gas, setGas] = useState(0);
    const {loading, error, data, refetch} = useQuery(GET_DATA, {client});
    useEffect(() => {
        // getGasPrice()
        const interval = setInterval(() => {
            refetch();
            // getGasPrice()
        }, 10000);
        return () => {
            clearInterval(interval);
        }
    }, [refetch])

    const router = useRouter()
    const [form] = Form.useForm();
    const inputRef = useRef(null);
    const {address, isConnected} = useAccount()
    const {disconnect} = useDisconnect()
    const {connect} = useConnect({
        connector: new InjectedConnector(),
    });
    const {
        bolName,
        changeBolLogin,
        changeShowData,
        changeBolName,
        changeFont,
        changeTheme,
        changeBack
    } = useContext(CountContext);
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

    const [value, setValue] = useState(false)
    const changeThemes = (value) => {
        changeBack(value)
        setValue(value)
    }
    // 验证token
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
    //修改用户
    useEffect(() => {
        if (bolName) {
            getUs()
            changeBolName(false)
        }
    }, [bolName])
    const onClose = () => {
        setOpen(false);
        form.resetFields()
    };

    useEffect(() => {
        // 切换钱包
        if (cookie.get('username') && cookie.get('name') !== address && address) {
            if (router.pathname !== '/') {
                router.push('/')
            }
            handleLogin()
            changeBolLogin()
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
            message: `warning`, description: 'Please enter complete data!', placement: 'topLeft', duration: 2
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
                    message: `warning`, description: 'Presale please enter complete!', placement: 'topLeft', duration: 2
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
                    message: `warning`, description: 'Launch please enter complete!', placement: 'topLeft', duration: 2
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
                    message: `warning`,
                    description: 'Presale or Launch please enter complete!',
                    placement: 'topLeft',
                    duration: 2
                });
            } else if (!bol) {
                const data = {
                    token, presale: arrPresale.length === 0 ? '' : presale, launch: arrLaunch.length === 0 ? '' : launch
                }
                post('/addPresaleAndLaunch', data).then(res => {
                    if (res && res.data?.success) {
                        form.resetFields()
                        setTokenForm({})
                        setTime({})
                        setOpen(false);
                    } else {
                        notification.warning({
                            message: `warning`,
                            description: 'add failed,Please try again',
                            placement: 'topLeft',
                            duration: 2
                        });
                    }
                }).catch(err => {
                    notification.warning({
                        message: `warning`,
                        description: 'add failed,Please try again',
                        placement: 'topLeft',
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
    // 获取聊天用户
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

    // 获取  时间
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
    // 获取用户信息
    const getUs = async () => {
        const data = await request('get', "/api/v1/userinfo",'')
        if (data && data?.status === 200) {
            setUserPar(data?.data?.data)
            // cookie.set('username', JSON.stringify(data?.data?.data), {expires: 1})
        }
        // if (data?.data && data?.data?.user) {
        //     setUserPar(data?.data?.user)
        //     cookie.set('name', address, {expires: 1})
        //     // 登录刷新   social
        //     changeShowData()
        //     cookie.set('username', JSON.stringify(data?.data?.user), {expires: 1})
        // } else {
        //     const {data} = await axios.get('https://api.ipify.org?format=json')
        //     if (data && data.ip) {
        //         const ip = await axios.post(baseUrl + "/api/user", {
        //             address, ipV4Address: data.ip, ipV6Address: data.ip
        //         })
        //         if (ip?.data && ip?.data?.user) {
        //             setUserPar(ip?.data?.user)
        //             cookie.set('username', JSON.stringify(ip?.data?.user), {expires: 1})
        //             // 登录刷新   social
        //             changeShowData()
        //             cookie.set('name', address, {expires: 1})
        //         }
        //     }
        // }
    }
    const handleLogin = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // provider._isProvider   判断是否还有请求没有结束
        let account = await provider.send("eth_requestAccounts", []);
        // 连接的网络和链信息。
        var chain = await provider.getNetwork()
        const token = await request('post', '/api/v1/token', {address})
        // 获取签名
        var signer = await provider.getSigner();
        // const signature = await signer.signMessage('你好')
        // 判断是否有账号
        if (account.length > 0 && token && token?.data && token?.status === 200) {
            // 判断是否是eth
            if (chain && chain.name !== 'unknow' && chain.chainId) {
                try {
                    // const message = `请签名证明你是钱包账户的拥有者\nstatement:${window.location.host}\nNonce:\n${date}\ndomain:\n ${window.location.host}\naddress: ${address}\nchainId:${chain.chainId}\nuri: ${window.location.origin}\n`
                    // 签名
                    const message = token?.data?.nonce
                    const signature = await signer.signMessage(message)
                    // 验证签名
                    // const recoveredAddress = ethers.utils.verifyMessage(message, signature);
                    const res = await request('post', '/api/v1/login', {
                        signature: signature, addr: address, message
                    })
                    if (res && res.data && res.data?.accessToken) {
                        //   jwt  解析 token获取用户信息
                        const decodedToken = jwt.decode(res.data?.accessToken);
                        if (decodedToken && decodedToken.address) {
                            cookie.set('token', res.data?.accessToken, {expires: 1})
                            cookie.set('name', address, {expires: 1})
                            cookie.set('username', JSON.stringify(decodedToken), {expires: 1})
                            setUserBol(!userBol)
                        }
                    }
                } catch (err) {
                    return null
                }
            } else {
                notification.warning({
                    description: 'Please select eth!',
                    placement: 'topLeft',
                    duration: 2
                });
            }
        } else {
            notification.warning({
                description: 'Please log in or connect to your account!',
                placement: 'topLeft',
                duration: 2
            });
        }
    }


    // 退出
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
    }

    const [connectBol, setConnectBol] = useState(false)
    useEffect(() => {
        if (connectBol && isConnected) {
            handleLogin()
            setConnectBol(false)
        }
    }, [isConnected])


    // 判断是否下载metamask
    const getMoney = () => {
        if (typeof window.ethereum === 'undefined') {
            notification.warning({
                message: `warning`,
                description: 'Please install MetaMask! And refresh',
                placement: 'topLeft',
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
        const token = cookie.get('username')
        if (token && token != 'undefined') {
            const data = JSON.parse(token)
            if (data && data?.exp && dayjs(dayjs.unix(data?.exp)).isAfter(dayjs())) {
                setNo(true)
                setUserPar(data)
            } else {
                set()
                notification.warning({
                    message: `warning`,
                    description: 'Login expired, please log in again!',
                    placement: 'topLeft',
                    duration: 2
                });
                setNo(false)
                setUserPar('')
            }
        } else {
            // router.push('/')
            setNo(false)
            setUserPar('')
        }
    }, [cookie.get('name'), cookie.get('username'), userBol])

    // 登录的下拉
    const items = [{
        key: '1', label: (<Link href={`/${userPar && userPar.address ? userPar.address : ''}`}>
                       <span>
      Personal
    </span>
        </Link>),
    }, {
        key: '2', label: (<Link href={'/token'}>
                       <span>
     Token settings
    </span>
        </Link>),
    }, {
        key: '3', label: (<span onClick={set}>
            Sign out
          </span>),
    }, {
        key: '4', label: (<Link href={'/coin'}><span>
           Add a coin
          </span> </Link>),
    },];
    const [launch, setLaunch] = useState([])
    // 搜索
    const showSearch = () => {
        if (cookie.get('username')) {
            setShowChatSearch(true)
        } else {
            getMoney()
        }
    }
    const getLaunch = async () => {
        const params = {
            pageIndex: 1, pageSize: 10
        }
        const res = await request('get', '/api/v1/launch', params)
        if (res?.data && res?.status === 200) {
            const {data} = res
            setLaunch(data?.launchs && data?.launchs.length > 0 ? data?.launchs : [])
        } else {
            setLaunch([])
        }
    }
    useEffect(() => {
        getLaunch()
    }, [])
    const handleChange = (value) => {
        changeFont(value)
    }
    // 获取eth  gas和price
    const getGasPrice = async () => {
        const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/d2660efdeff84ac982b0d2de03e13c20');
        // 获取当前 gas 价格
        const data = await provider.getGasPrice()
        const gasPrice = ethers.utils.formatUnits(data, 'gwei')
        setGas(gasPrice ? gasPrice : 0)
    }
    // 除了Home页面显示，其它页面不展示
    const [isShowClass, setIsShowClass] = useState(Boolean)
    useEffect(() => {
        if (router.pathname == '/') {
            setIsShowClass(true)
        } else {
            setIsShowClass(false)
        }
    })

    // 移动端点击显示菜单
    const [isShowMenuItem, setIsShowMenuItem] = useState(false)
    const openShowMenuItem = () => {
        if (isShowMenuItem) {
            setIsShowMenuItem(false)
            const body = document.querySelector("body")
            body.style.overflow = "auto"
        } else {
            setIsShowMenuItem(true)
            const body = document.querySelector("body")
            body.style.overflow = "hidden"
        }
    }
    const push = () => {
        if (cookie.get('name')) {
            router.push('/social')
        } else {
            getMoney()
        }
    }
    const pushPer = () => {
        if (cookie.get('name')) {
            const data = cookie.get('name')
            router.push(`/${data}`)
        } else {
            getMoney()
        }
    }
    const ck = async () => {
        const data = await getAddressOwner('0xae2Fc483527B8EF99EB5D9B44875F005ba1FaE13')
    }
    return (<>
            <div className={styles['headerShowNode']}>
                <div className={"top-0 w-full  z-30 transition-all headerClass"}>
                    {/*<span onClick={getGasPrice}>11111111111</span>*/}
                    <div className={styles['aaa']} style={{paddingLeft: '110px'}}>
                        <Marquee
                            pauseOnHover={true}
                            speed={30}
                            gradientWidth={100}
                            className={styles.marqueeBox}>
                            {launch.length > 0 && launch.map((i, index) => {
                                return <div key={index} className={`${styles.marquee} `}>
                                    <span className={changeTheme ? 'darknessFont' : 'brightFont'}>#{index + 1}</span>
                                    <p className={styles.marqueeName}>{i?.symbol?.slice(0, 1)}</p>
                                    <span className={changeTheme ? 'darknessFont' : 'brightFont'}>{i.symbol}</span>
                                </div>
                            })}
                        </Marquee>
                        <div className={styles.searchToken}>
                            <p className={`${styles['search']} ${changeTheme ? 'darknessThree' : 'brightFore boxHover'}`}
                               onClick={showSearch}>{header.search}</p>
                            {showChatSearch && (<ChatSearch
                                setShowChatSearch={setShowChatSearch}
                                chats={chats}
                                setChats={setChats}
                                user={userPar}
                            />)}
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
                                <img src="/Ellipse27.png" alt="" width={30}
                                     style={{border: '50%', marginRight: '6px'}}/>
                                <p className={changeTheme ? 'darknessFont' : 'brightFont'}>${!loading && data?.bundles?.length > 0 ? Number(data.bundles[0]?.ethPrice).toFixed(2) : 0}</p>
                                <p style={{display: 'flex', alignItems: 'center', marginLeft: '8px'}}><img
                                    src="/GasStation.png"
                                    width={20} alt=""/>
                                    <span className={changeTheme ? 'darknessFont' : 'brightFont'}>{gas}</span>
                                </p>
                            </div>
                            {no ? <div className={styles.loginBox}>
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
                                        className={`${styles.loginName} ${styles.but} ${changeTheme ? 'darknessThree' : 'brightFore boxHover'} `}>{userPar && userPar.username ? userPar.username.length > 5 ? userPar.username.slice(0, 5) + '...' : userPar?.username : userPar?.address.slice(0, 5) + '...'}</Button>
                                </Dropdown>
                            </div> : <Button
                                className={`${styles['but']} ${styles.loginName} ${changeTheme ? 'darknessThree' : 'brightFore boxHover'}`}
                                onClick={getMoney}>{header.login}</Button>}
                        </div>
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
                            rules={[{
                                required: true, message: 'Please input your token!',
                            },]}
                            labelCol={{
                                span: 6,
                            }}>
                            <Input onChange={changeToken} ref={inputRef}
                                   style={tokenFormBol ? {borderColor: 'red'} : {}}/>
                        </Form.Item>
                        <div className={styles.addShow}>
                            {!openPresale ? <CaretRightFilled className={styles.addCur}
                                                              onClick={hidePresale}/> :
                                <CaretDownFilled onClick={hidePresale}
                                                 className={`${styles.addCur} ${styles.addCurMt5}`}/>}
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
                                    {presalePlatform.length > 0 ? presalePlatform.map((i, index) => {
                                        return <Option value={i.id} key={index}>
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                <img src={`${i.logo ? baseUrl + i.logo : '/Ellipse1.png'}`} alt=""
                                                     width={20} height={20}/>
                                                <span>{i.name}</span>
                                            </div>
                                        </Option>
                                    }) : null}
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
                            {!openLaunch ? <CaretRightFilled className={`${styles.addCur}`}
                                                             onClick={hideLaunch}/> :
                                <CaretDownFilled onClick={hideLaunch}
                                                 className={`${styles.addCur} ${styles.addCurMt5}`}/>}
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
                                    {launchPlatform.length > 0 ? launchPlatform.map((i, index) => {
                                        return <Option value={i.id} key={index}>
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                <img src={`${i.logo ? baseUrl + i.logo : '/Ellipse1.png'}`} alt=""
                                                     width={20} height={20}/>
                                                <span>{i.name}</span>
                                            </div>
                                        </Option>
                                    }) : null}
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
                            {openLink ? <CaretRightFilled className={styles.addCur}
                                                          onClick={hideLink}/> : <CaretDownFilled onClick={hideLink}
                                                                                                  className={`${styles.addCur} ${styles.addCurMt5}`}/>}
                            <p className={styles.addPresale} onClick={hideLink}>Link</p>
                            <p className={styles.lines}></p>
                        </div>
                        <div style={openLink ? {display: 'none'} : {}}>
                            <Form.Item
                                label="Twitter"
                                name="twitter"
                                rules={[{
                                    required: true, message: 'Please input your twitter!',
                                },]} labelCol={{
                                span: 8,
                            }}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                label="Telegram"
                                name="telegram"
                                rules={[{
                                    required: true, message: 'Please input your telegram!',
                                },]} labelCol={{
                                span: 9,
                            }}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                label="Website"
                                name="website"
                                className={'bbb'}
                                rules={[{
                                    required: true, message: 'Please input your website!',
                                },]} labelCol={{
                                span: 8,
                            }}
                            >
                                <Input/>
                            </Form.Item>
                        </div>
                        <Form.Item wrapperCol={{
                            offset: 8, span: 16,
                        }}>
                            <Button type={'primary'} htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>


                </Drawer>
            </div>

            {/* 移动端适配导航 */}
            <div className={`${styles.cardParams} ${changeTheme ? 'darknessTwo' : 'brightTwo'}`}>
                <div className={styles['moblic-ShowNode']}>
                    <div className={styles.mobliceMenuFlex}>
                        <div
                            className={`${styles.ethMobliceMg} ${styles.ethMoblice} ${changeTheme ? 'darkMode' : 'whiteMode'}`}>
                            <Link href={'/'}>
                                <Image src={'/GroupMoblice.svg'} alt="GroupMoblice" style={{marginLeft: '12px'}}
                                       width={20} height={20}/>
                            </Link>
                        </div>
                        <div className={`${styles.ethMoblice} ${changeTheme ? 'darkMode' : 'whiteMode'}`}>
                            <Link href={'/search'}>
                                <Image src={'/Search.svg'} alt="Search" style={{marginLeft: '10px'}} width={20}
                                       height={20}/>
                            </Link>
                        </div>
                    </div>
                    <div className={`${styles.ethMobliceCt} ${styles.eth} ${changeTheme ? 'darkMode' : 'whiteMode'}`}>
                        <img src="/Ellipse27.png" alt="" width={40} style={{border: '50%', marginRight: '6px'}}/>
                        <p className={changeTheme ? 'darknessFont' : 'brightFont'}>${!loading && data?.bundles?.length > 0 ? Number(data.bundles[0]?.ethPrice).toFixed(2) : 0}</p>
                        <p style={{display: 'flex', alignItems: 'center', marginLeft: '8px'}}>
                            <img src="/GasStation.png" width={20} alt=""/>
                            <span className={changeTheme ? 'darknessFont' : 'brightFont'}>{gas}</span>
                        </p>
                    </div>
                    {no && address ? <div className={styles.loginBox}>
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
                        onClick={getMoney}>{header.login}</Button>}
                    <div className={styles.mobliceMenuFlex}>
                        <div
                            className={`${styles.ethMobliceMg} ${styles.ethMoblice} ${changeTheme ? 'darkMode' : 'whiteMode'}`}
                            onClick={getMoney}>
                            <Image src={'/WalletMoblice.svg'} alt="WalletMoblice" style={{marginLeft: '10px'}}
                                   width={20} height={20}/>
                        </div>
                        <div className={`${styles.ethMoblice} ${changeTheme ? 'darkMode' : 'whiteMode'}`}
                             onClick={openShowMenuItem}>
                            <Image src={'/Menu.svg'} alt="Menu" style={{marginLeft: '10px'}} width={20} height={20}/>
                        </div>
                    </div>
                </div>
            </div>
            {/* 菜单Items */}
            <div
                className={`${isShowMenuItem ? styles.mobliceMentHideItemsBox : styles.mobliceMentItemsBox} ${changeTheme ? 'darknessTwo' : 'brightTwo'}`}>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    <div className={`${styles.mobliceDpFlex}`}>
                        <Link href={'/'}>
                            <div className={`${styles.mobliceDpFlexs}`}>
                                <Image src={`/Vector.svg`} alt="logo" width={32} height={32}/>
                                <div className={changeTheme ? 'darknessFont' : 'brightFont'}>{drawer.home}</div>
                            </div>
                        </Link>
                    </div>
                    <div className={`${styles.mobliceDpFlex}`}>
                        <Link href={'/featured'}>
                            <div className={`${styles.mobliceDpFlexs}`}>
                                <Image src={`/icon_graph_.svg`} alt="logo" height={32} width={32}/>
                                <div className={changeTheme ? 'darknessFont' : 'brightFont'}>{drawer.featured}</div>
                            </div>
                        </Link>
                    </div>
                    <div className={`${styles.mobliceDpFlex}`}>
                        <Link href={'/presale'}>
                            <div className={`${styles.mobliceDpFlexs}`}>
                                <Image src={`/icon_rocket_.svg`} alt="logo" height={32} width={32}/>
                                <div className={changeTheme ? 'darknessFont' : 'brightFont'}>{drawer.presale}</div>
                            </div>
                        </Link>
                    </div>
                    <div className={`${styles.mobliceDpFlex}`}>
                        <Link href={'/launch'}>
                            <div className={`${styles.mobliceDpFlexs}`}>
                                <Image src={`/icon_timer_.svg`} alt="logo" height={32} width={32}/>
                                <div className={changeTheme ? 'darknessFont' : 'brightFont'}>{drawer.launch}</div>
                            </div>
                        </Link>
                    </div>
                    <div className={`${styles.mobliceDpFlex}`}>
                        <Link href={'/newPair'}>
                            <div className={`${styles.mobliceDpFlexs}`}>
                                <Image src={`/GroupJiuBa.svg`} alt="logo" height={32} width={32}/>
                                <div className={changeTheme ? 'darknessFont' : 'brightFont'}>{drawer.newPair}</div>
                            </div>
                        </Link>
                    </div>
                    <div className={`${styles.mobliceDpFlex}`}>
                        <div onClick={push}>
                            <div className={`${styles.mobliceDpFlexs}`}>
                                <Image src={`/icon_newspaper_.svg`} alt="logo" width={32} height={32}/>
                                <div className={changeTheme ? 'darknessFont' : 'brightFont'}>{drawer.community}</div>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.mobliceDpFlex}`}>
                        <div onClick={pushPer}>
                            <div className={`${styles.mobliceDpFlexs}`}>
                                <Image src={`/icon_new_spaper_.svg`} height={32} alt="logo" width={32}/>
                                <div className={changeTheme ? 'darknessFont' : 'brightFont'}>{drawer.user}</div>
                            </div>
                        </div>
                    </div>
                    {/* 切换主题 */}
                    <div className={`${styles.mobliceDpFlex}`}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Switch checked={value} className={changeTheme ? 'darknessOne' : 'brightOne'}
                                    onChange={changeThemes}/>
                        </div>
                    </div>
                </div>
            </div>
            {/* 滚动条播放 */}
            <div className={`${isShowClass ? styles.headerShowScrollNode : styles.headerHideScrollNode}`}>
                <Marquee
                    pauseOnHover={true}
                    speed={30}
                    gradientWidth={100}
                    className={styles.marqueeBox}>
                    {launch.length > 0 && launch.map((i, index) => {
                        return <div key={index} className={`${styles.marquee} `}>
                            <span className={changeTheme ? 'darknessFont' : 'brightFont'}>#{index + 1}</span>
                            <p className={styles.marqueeName}>{i?.symbol?.slice(0, 1)}</p>
                            <span className={changeTheme ? 'darknessFont' : 'brightFont'}>{i.symbol}</span>
                        </div>
                    })}
                </Marquee>
            </div>
        </>


    );
};

export default Header;

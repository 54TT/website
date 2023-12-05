import React, {useState, useEffect, useRef, useContext, Suspense, startTransition} from "react";
import {getCsrfToken,} from "next-auth/react"
import baseUrl from '/utils/baseUrl'
import {useAccount, useConnect, useNetwork, useSignMessage, useDisconnect,} from "wagmi"
import {InjectedConnector} from 'wagmi/connectors/injected'
import axios from 'axios';
import {Dropdown, Drawer, Form, Select, Input, DatePicker, Button, notification,} from 'antd'
import {CaretDownFilled, CaretRightFilled, LoadingOutlined} from '@ant-design/icons';
import styles from './css/header.module.css'
import DrawerPage from './Drawer'

const {Option} = Select;
import dynamic from "next/dynamic";
import Link from 'next/link'
import _ from 'lodash'
import cookie from 'js-cookie'
import {useRouter} from 'next/router'
// import ChatSearch from "../Chat/ChatSearch";
const ChatSearch = dynamic(() => import('../Chat/ChatSearch'), {ssr: false})
// const DrawerPage = dynamic( () =>  import('./Drawer'),)
import {get, post, del, getUser} from '/utils/axios'
import {ethers} from 'ethers'
import {CountContext} from '/components/Layout/Layout';
import Marquee from "react-fast-marquee";
import {changeLang} from "/utils/set";
import Image from 'next/image'

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
        if (cookie.get('user') && bolName && address) {
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
            router.push('/')
            changeBolLogin()
            getUs()
        }
    }, [address])
    const showDrawer = () => {
        if (cookie.get('name')) {
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
        setBol(!bol)
    }
    const getUs = async () => {
        const data = await axios.get(baseUrl + "/api/user", {
            params: {
                address
            }
        })
        if (data?.data && data?.data?.user) {
            setUserPar(data?.data?.user)
            cookie.set('name', address, {expires: 1})
            changeShowData()
            cookie.set('user', JSON.stringify(data?.data?.user), {expires: 1})
        } else {
            const {data} = await axios.get('https://api.ipify.org?format=json')
            if (data && data.ip) {
                const ip = await axios.post(baseUrl + "/api/user", {
                    address, ipV4Address: data.ip
                })
                if (ip?.data && ip?.data?.user) {
                    setUserPar(ip?.data?.user)
                    cookie.set('user', JSON.stringify(ip?.data?.user), {expires: 1})
                    changeShowData()
                    cookie.set('name', address, {expires: 1})
                }
            }
        }
    }
    useEffect(() => {
        if (bol && address) {
            getUs()
        }
    }, [bol])
    const handleLogin = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let account = await provider.send("eth_requestAccounts", []);
        var signer = await provider.getSigner();
        // 连接的网络和链信息。
        var chain = await provider.getNetwork()
        // 判断是否有账号
        if (account.length > 0) {
            // 判断是否是eth
            if (chain && chain.name !== 'unknow' && chain.chainId) {
                try {
                    const date = Date.now();
                    // await getCsrfToken()
                    // const message = `请签名证明你是钱包账户的拥有者\nstatement:${window.location.host}\nNonce:\n${date}\ndomain:\n ${window.location.host}\naddress: ${address}\nchainId:${chain.chainId}\nuri: ${window.location.origin}\n`
                    const  message = date+'';
                    console.log("message:",date)
                    // 签名
                    const signature = await signer.signMessage(message)
                    console.log("signature:",signature)
                    console.log("address:",address)
                    // 验证签名
                    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
                    console.log("recoveredAddress:",recoveredAddress)
                    if (recoveredAddress === address) {
                        setB()
                    }
                } catch (err) {
                    return null
                }
            } else {
            }
        } else {
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
    }
    const set = () => {
        cookie.remove('name');
        cookie.remove('user');
        router.push('/')
        disconnect()
    }
    const getMoney = () => {
        if (typeof window.ethereum === 'undefined') {
            notification.warning({
                message: `warning`, description: 'Please install MetaMask! And refresh', placement: 'topLeft',
                duration: 2
            });
        } else {
            if (!isConnected) {
                connect()
            } else {
                handleLogin()
            }
        }
    }
    const [no, setNo] = useState(false)
    useEffect(() => {
        if (cookie.get('user')) {
            const data = JSON.parse(cookie.get('user'))
            setNo(true)
            setUserPar(data)
        } else {
            router.push('/')
            setNo(false)
            setUserPar('')
        }
    }, [cookie.get('name'), cookie.get('user')])
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
                <span onClick={set}>
            Sign out
          </span>
            ),
        },
    ];
    const [launch, setLaunch] = useState([])
    const showSearch = () => {
        if (cookie.get('name')) {
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

    // 除了Home页面显示，其它页面不展示
    const [isShowClass, setIsShowClass] = useState(Boolean)
    useEffect(() => {
        if(router.pathname  == '/'){
            setIsShowClass(true)
        }else{
            setIsShowClass(false)
        }
    })
    return (
        <>
            <div className={styles['headerShowNode']}>
                <div className={"top-0 w-full  z-30 transition-all headerClass"}>
                    <div className={styles['aaa']} style={{paddingLeft: '110px'}}>
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
                            <div  className={`${styles.eth} ${changeTheme ? 'darknessTwo' : 'brightTwo'}`}>
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
                                            className={`${styles.loginName} ${styles.but} ${changeTheme ? 'darknessThree' : 'brightFore boxHover'} `}>{userPar && userPar.username ? userPar.username.length > 5 ? userPar.username.slice(0, 5) + '...' : userPar.username : ''}</Button>
                                    </Dropdown>
                                </div> : <Button
                                    className={`${styles['but']} ${styles.loginName} ${changeTheme ? 'darknessThree' : 'brightFore boxHover'}`}
                                    onClick={getMoney}>{header.login}</Button>
                            }
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

            {/* 移动端适配导航 */}
            <div className={`${styles.cardParams} ${changeTheme ? 'darknessTwo' : 'brightTwo'}`}>
                <div className={styles['moblic-ShowNode']}>
                    <div className={styles.mobliceMenuFlex}>
                        <div className={`${styles.ethMobliceMg} ${styles.ethMoblice} ${changeTheme ? 'darkMode' : 'whiteMode'}`}>
                            <Link href={'/'}>
                                <Image src={'/GroupMoblice.svg'} alt="GroupMoblice" style={{marginLeft:'12px'}} width={20} height={20}/>
                            </Link>
                        </div>
                        <div className={`${styles.ethMoblice} ${changeTheme ? 'darkMode' : 'whiteMode'}`}>
                            <Link href={'/search'}>
                                <Image src={'/Search.svg'} alt="Search" style={{marginLeft:'10px'}} width={20} height={20}/>
                            </Link>
                        </div>
                    </div>
                    <div  className={`${styles.ethMobliceCt} ${styles.eth} ${changeTheme ? 'darkMode' : 'whiteMode'}`}>
                        <img src="/Ellipse27.png" alt="" width={40} style={{border: '50%', marginRight: '6px'}}/>
                        <p className={changeTheme ? 'darknessFont' : 'brightFont'}>$:2028</p>
                        <p style={{display: 'flex', alignItems: 'center', marginLeft: '8px'}}>
                            <img src="/GasStation.png" width={20} alt=""/>
                            <span className={changeTheme ? 'darknessFont' : 'brightFont'}>29</span>
                        </p>
                    </div>
                    <div className={styles.mobliceMenuFlex}>
                        <div className={`${styles.ethMobliceMg} ${styles.ethMoblice} ${changeTheme ? 'darkMode' : 'whiteMode'}`}>
                            <Image src={'/WalletMoblice.svg'} alt="WalletMoblice" style={{marginLeft:'10px'}} width={20} height={20}/>
                        </div>
                        <div className={`${styles.ethMoblice} ${changeTheme ? 'darkMode' : 'whiteMode'}`}>
                            <Image src={'/Menu.svg'} alt="Menu" style={{marginLeft:'10px'}} width={20} height={20}/>
                        </div>
                    </div>
                </div>
            </div>

            {/* 滚动条播放 */}
            <div className={`${ isShowClass ? styles.headerShowScrollNode : styles.headerHideScrollNode}`}>
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
            </div>
        </>



    );
};

export default Header;

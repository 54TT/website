import React, {useContext, useEffect, useRef, useState} from "react";
import {request} from '/utils/hashUrl'
import {useAccount, useConnect} from "wagmi"
import {InjectedConnector} from 'wagmi/connectors/injected'
import {Button, DatePicker, Drawer, Dropdown, Form, Input, notification, Select, Switch,} from 'antd'
import styles from './css/header.module.css'
import jwt from 'jsonwebtoken';
import dynamic from "next/dynamic";
import Link from 'next/link'
import cookie from 'js-cookie'
import {useRouter} from 'next/router'
import {ethers} from 'ethers'
import {CountContext} from '/components/Layout/Layout';
import Marquee from "react-fast-marquee";
import {changeLang} from "/utils/set";
// const logicModule = await import('../dynamicLogic');
import {gql} from "graphql-tag";
import {ApolloClient, InMemoryCache, useQuery} from "@apollo/client";
const DrawerPage = dynamic(() => import('./Drawer'), {ssr: false});
// const client = new ApolloClient({
//     uri: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v2-dev', cache: new InMemoryCache(),
// });
const client = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/levi0522/uniswap', cache: new InMemoryCache(),
});
const ChatSearch = dynamic(() => import('/components/Chat/ChatSearch'), {ssr: false})
const Moralis = require("moralis")?.default;
const Header = () => {
    const drawer = changeLang('drawer')
    const GET_DATA = gql`query LiveNewPair {
  bundles {
    id
    ethPrice
  }
}`
    // eth  price
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
    const {address, isConnected} = useAccount()
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
        changeBack, setLogin, logoutBol, changeBol
    } = useContext(CountContext);
    const header = changeLang('header')
    const [value, setValue] = useState(false)
    const changeThemes = (value) => {
        changeBack(value)
        setValue(value)
    }
    //修改用户
    useEffect(() => {
        if (bolName) {
            getUs()
            changeBolName(false)
        }
    }, [bolName])
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
    const [showChatSearch, setShowChatSearch] = useState(false);
    const [chats, setChats] = useState([]);
    const [userPar, setUserPar] = useState(null);
    useEffect(() => {
        if (logoutBol) {
            changeBol(false)
            setUserPar(null)
        }
    }, [logoutBol]);
    // 获取聊天用户
    const getParams = async () => {
        // const res = await axios.get(`${baseUrl}/api/chats`, {
        //     params: {userId: userPar?.uid}
        // });
        // if (res.status === 200) {
        //     setChats(res.data)
        // } else {
        //     setChats([])
        // }
    }
    useEffect(() => {
        if (userPar && userPar.uid) {
            // getParams()
        }
    }, [userPar])

    // 获取用户信息
    const getUs = async () => {
        try {
            const params = JSON.parse(cookie.get('username'))
            const token = cookie.get('token')
            const data = await request('get', "/api/v1/userinfo/" + params?.uid, '', token)
            if (data === 'please') {
                setUserPar(null)
                setLogin()
            } else if (data && data?.status === 200) {
                const user = data?.data?.data
                setUserPar(user)
                cookie.set('username', JSON.stringify(data?.data?.data), {expires: 1})
            } else {
                setUserPar(null)
            }
        } catch (err) {
            setUserPar(null)
            return null
        }
    }
    useEffect(() => {
        if (cookie.get('username') && cookie.get('username') != 'undefined') {
            getUs()
        }
    }, [cookie.get('username')])
    const handleLogin = async () => {
        try {
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
                        if (res === 'please') {
                            setLogin()
                        } else if (res && res.data && res.data?.accessToken) {
                            //   jwt  解析 token获取用户信息
                            const decodedToken = jwt.decode(res.data?.accessToken);
                            if (decodedToken && decodedToken.address) {
                                const data = await request('get', "/api/v1/userinfo/" + decodedToken?.uid, '', res.data?.accessToken)
                                if (data === 'please') {
                                    setLogin()
                                } else if (data && data?.status === 200) {
                                    const user = data?.data?.data
                                    changeShowData(true)
                                    setUserPar(user)
                                    cookie.set('username', JSON.stringify(data?.data?.data), {expires: 1})
                                    cookie.set('token', res.data?.accessToken, {expires: 1})
                                    cookie.set('name', address, {expires: 1})
                                    cookie.set('user', JSON.stringify(decodedToken), {expires: 1})
                                }
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
        } catch (err) {
            return null
        }
    }
    // 退出
    // const set = () => {
    //     cookie.remove('name');
    //     cookie.remove('username');
    //     cookie.remove('token');
    //     cookie.remove('user')
    //     if (router.pathname !== '/') {
    //         router.push('/')
    //     }
    //     disconnect()
    // }
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
    // 登录的下拉
    const items = [{
        key: '1', label: (<Link href={`/person/${userPar && userPar.uid ? userPar.uid : ''}`}>
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
        key: '3', label: (<span onClick={() => setLogin()}>
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
        try {
            const res = await request('get', '/api/v1/feature', {
                pageIndex: 1,
                pageSize: 10
            })
            if (res === 'please') {
                setLogin()
            } else if (res && res?.status === 200) {
                const {data} = res
                setLaunch(data?.featureds && data?.featureds.length > 0 ? data?.featureds : [])
            } else {
                setLaunch([])
            }
        } catch (err) {
            setLaunch([])
            return null
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
        try {
            const provider = new ethers.providers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/kNPJaYqMx7BA9TcDDJQ8pS5WcLqXGiG7');
            try {
                // 获取当前 gas 价格
                const data = await provider.getGasPrice()
                const gasPrice = ethers.utils.formatUnits(data, 'gwei')
                setGas(gasPrice && Number(gasPrice) ? Math.floor(Number(gasPrice)) : 0)
            } catch (err) {
                return null
            }
        } catch (err) {
            return null
        }
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
        if (cookie.get("name")) {
            openShowMenuItem();
            router.push("/social");
        } else {
            getMoney();
        }
    };
    const pushPer = () => {
        if (cookie.get("name")) {
            const data = cookie.get("name");
            openShowMenuItem();
            router.push(`/${data}`);
        } else {
            getMoney();
        }
    };
    const ck = async () => {
        const data = await getAddressOwner('0xae2Fc483527B8EF99EB5D9B44875F005ba1FaE13')
    }
    const strategy = {
        "one": function () {
            openShowMenuItem();
            return router.push('/')
        },
        "two": function () {
            openShowMenuItem();
            return router.push('/featured')
        },
        "three": function () {
            openShowMenuItem();
            return router.push('/presale')
        },
        "four": function () {
            openShowMenuItem();
            return router.push('/launch')
        },
        "five": function () {
            openShowMenuItem();
            return router.push('/newPair')
        }
    }
    const pushOnclick = (level) => {
        return strategy[level]
    }
    return (
        <>
            <div className={styles['headerShowNode']}>
                <div className={"top-0 w-full  z-30 transition-all headerClass"}>
                    <div className={`${changeTheme ? 'topBack' : 'whiteMode'} ${styles['aaa']}`}
                         style={{paddingLeft: '110px'}}>
                        {/*走马灯*/}
                        <Marquee
                            pauseOnHover={true}
                            speed={30}
                            gradientWidth={100}
                            className={styles.marqueeBox}>
                            {launch.length > 0 && launch.map((i, index) => {
                                if (i?.apiData) {
                                    const data = JSON.parse(i.apiData)
                                    return <div key={index} className={`${styles.marquee} `}>
                                        <span
                                            className={changeTheme ? 'darknessFont' : 'brightFont'}>#{index + 1}</span>
                                        <p className={styles.marqueeName}>{data?.baseToken?.symbol?.slice(0, 1)}</p>
                                        <span
                                            className={changeTheme ? 'darknessFont' : 'brightFont'}>{data?.baseToken?.symbol}</span>
                                    </div>
                                }
                            })
                            }
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
                        {/*eth  price*/}
                        <div className={`${styles.eth} ${changeTheme ? 'darknessTwo' : 'brightTwo'}`}>
                            <img src="/Ellipse27.png" alt=""
                                 style={{border: '50%', marginRight: '6px', width: '30px', height: '30px'}}/>
                            <p className={changeTheme ? 'darknessFont' : 'brightFont'}>${!loading && data?.bundles?.length > 0 ? Number(data.bundles[0]?.ethPrice).toFixed(2) : 0}</p>
                            <p style={{display: 'flex', alignItems: 'center', marginLeft: '8px'}}><img
                                src="/GasStation.png"
                                style={{width: '20px', height: '20px'}} alt=""/>
                                <span className={changeTheme ? 'darknessFont' : 'brightFont'}>{gas}</span>
                            </p>
                        </div>
                        {/*<div className={styles.login}>*/}
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
                        {/*eth   price*/}
                        {/*登录*/}
                        {userPar && userPar?.uid ?
                            <div className={`${changeTheme ? 'backLine' : 'brightFore boxHover'}  ${styles.loginBox}`}>
                                <Link href={`/person/${userPar && userPar?.uid ? userPar.uid : ''}`}>
                                    <img className={'loginImg'}
                                         style={{borderRadius: '50%', width: '25px', height: '25px'}}
                                         src={userPar && userPar?.avatarUrl ? userPar.avatarUrl : '/dexlogo.svg'}
                                         alt=""/>
                                </Link>
                                <Dropdown
                                    menu={{items}}
                                    overlayClassName={changeTheme ? 'dropdownClass' : ''}
                                    placement="bottom">
                                    <Button
                                        className={`${styles.loginNames}`}>{userPar && userPar.username ? userPar.username.length > 5 ? userPar.username.slice(0, 5) + '...' : userPar?.username : userPar?.address?.slice(0, 5) + '...' || ''}</Button>
                                </Dropdown>
                                <img className={'loginImg'} style={{borderRadius: '50%', width: '25px', height: '25px'}}
                                     src={userPar && userPar?.avatarUrl ? userPar.avatarUrl : '/dexlogo.svg'}
                                     alt=""/>
                            </div> : <Button
                                className={` ${styles.loginName} ${changeTheme ? 'darknessThree' : 'brightFore boxHover'}`}
                                onClick={getMoney}>{header.login}</Button>}
                    </div>
                    {/*</div>*/}
                </div>
                <DrawerPage getMoney={getMoney}/>
                {/*</Suspense>*/}
            </div>
            {/* 移动端适配导航 */}
            <div className={`${styles.cardParams} ${changeTheme ? 'darknessTwo' : 'brightTwo'}`}>
                <div className={styles['moblic-ShowNode']}>
                    <div className={styles.mobliceMenuFlex}>
                        <div
                            className={`${styles.ethMobliceMg} ${styles.ethMoblice} ${changeTheme ? 'darkMode' : 'whiteMode'}`}>
                            <Link href={'/'}>
                                <img src={'/GroupMoblice.svg'} alt="GroupMoblice"
                                     style={{marginLeft: '12px', width: '20px', height: '20px'}}
                                />
                            </Link>
                        </div>
                        <div className={`${styles.ethMoblice} ${changeTheme ? 'darkMode' : 'whiteMode'}`}>
                            <Link href={'/search'}>
                                <img src={'/Search.svg'} alt="Search"
                                     style={{marginLeft: '10px', width: "20px", height: '20px'}} width={20}
                                />
                            </Link>
                        </div>
                    </div>
                    <div className={`${styles.ethMobliceCt} ${styles.eth} ${changeTheme ? 'darkMode' : 'whiteMode'}`}>
                        <img src="/Ellipse27.png" alt=""
                             style={{border: '50%', marginRight: '6px', width: '40px', height: '40px'}}/>
                        <p className={changeTheme ? 'darknessFont' : 'brightFont'}>${!loading && data?.bundles?.length > 0 ? Number(data.bundles[0]?.ethPrice).toFixed(2) : 0}</p>
                        <p style={{display: 'flex', alignItems: 'center', marginLeft: '8px'}}>
                            <img src="/GasStation.png" alt=""
                                 style={{borderRadius: '50%', width: '20px', height: '20px'}}/>
                            <span className={changeTheme ? 'darknessFont' : 'brightFont'}>{gas}</span>
                        </p>
                    </div>
                    {userPar && userPar?.uid ? <div className={styles.loginBox}>
                        <Link href={`/person/${userPar && userPar?.uid ? userPar.uid : ''}`}>
                            <img className={'loginImg'} style={{borderRadius: '50%', width: '35px', height: '35px'}}
                                 src={userPar && userPar?.avatarUrl ? userPar.avatarUrl : '/dexlogo.svg'}
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
                        {
                            userPar && userPar?.uid ? '' : <div
                                className={`${styles.ethMobliceMg} ${styles.ethMoblice} ${changeTheme ? 'darkMode' : 'whiteMode'}`}
                                onClick={getMoney}>
                                <img src={'/WalletMoblice.svg'} alt="WalletMoblice"
                                     style={{marginLeft: '10px', width: '20px', height: '20px'}}
                                />
                            </div>
                        }
                        <div className={`${styles.ethMoblice} ${changeTheme ? 'darkMode' : 'whiteMode'}`}
                             onClick={openShowMenuItem}>
                            <img src={'/Menu.svg'} alt="Menu"
                                 style={{marginLeft: '10px', width: '20px', height: '20px'}}/>
                        </div>
                    </div>
                </div>
            </div>
            {/* 菜单Items */}
            <div className={`${isShowMenuItem ? styles.mobliceMentHideItemsBox : styles.mobliceMentItemsBox} ${changeTheme ? 'darknessTwo' : 'brightTwo'}`}>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    <div className={`${styles.mobliceDpFlex}`}>
                        <div onClick={pushOnclick('one')}>
                            <div className={`${styles.mobliceDpFlexs}`}>
                                <img src={`/Vector.svg`} alt="logo" style={{width: '32px', height: '32px'}}/>
                                <div className={changeTheme ? 'darknessFont' : 'brightFont'}>{drawer.home}</div>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.mobliceDpFlex}`}>
                        <div onClick={pushOnclick('two')}>
                            <div className={`${styles.mobliceDpFlexs}`}>
                                <img src={`/icon_graph_.svg`} alt="logo" style={{width: '32px', height: '32px'}}/>
                                <div className={changeTheme ? 'darknessFont' : 'brightFont'}>{drawer.featured}</div>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.mobliceDpFlex}`}>
                        <div onClick={pushOnclick('three')}>
                            <div className={`${styles.mobliceDpFlexs}`}>
                                <img src={`/icon_rocket_.svg`} alt="logo" style={{width: '32px', height: '32px'}}/>
                                <div className={changeTheme ? 'darknessFont' : 'brightFont'}>{drawer.presale}</div>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.mobliceDpFlex}`}>
                        <div onClick={pushOnclick('four')}>
                            <div className={`${styles.mobliceDpFlexs}`}>
                                <img src={`/icon_timer_.svg`} alt="logo" style={{width: '32px', height: '32px'}}/>
                                <div className={changeTheme ? 'darknessFont' : 'brightFont'}>{drawer.launch}</div>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.mobliceDpFlex}`}>
                        <div onClick={pushOnclick('five')}>
                            <div className={`${styles.mobliceDpFlexs}`}>
                                <img src={`/GroupJiuBa.svg`} alt="logo" style={{width: '32px', height: '32px'}}/>
                                <div className={changeTheme ? 'darknessFont' : 'brightFont'}>{drawer.newPair}</div>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.mobliceDpFlex}`}>
                        <div onClick={push}>
                            <div className={`${styles.mobliceDpFlexs}`}>
                                <img src={`/icon_newspaper_.svg`} alt="logo" style={{width: '32px', height: '32px'}}/>
                                <div className={changeTheme ? 'darknessFont' : 'brightFont'}>{drawer.community}</div>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.mobliceDpFlex}`}>
                        <div onClick={pushPer}>
                            <div className={`${styles.mobliceDpFlexs}`}>
                                <img src={`/icon_new_spaper_.svg`} style={{width: '32px', height: '32px'}} alt="logo"/>
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
                        if (i?.apiData) {
                            const data = JSON.parse(i.apiData)
                            return <div key={index} className={`${styles.marquee} `}>
                                <span className={changeTheme ? 'darknessFont' : 'brightFont'}>#{index + 1}</span>
                                <p className={styles.marqueeName}>{data?.baseToken?.symbol?.slice(0, 1)}</p>
                                <span
                                    className={changeTheme ? 'darknessFont' : 'brightFont'}>{data?.baseToken?.symbol}</span>
                            </div>
                        }

                    })}
                </Marquee>
            </div>
        </>
    );
};

export default Header;

import React, {useState, useEffect, useRef} from "react";
import {getCsrfToken, signIn, useSession, signOut} from "next-auth/react"
import {SiweMessage} from "siwe"
import baseUrl from '/utils/baseUrl'
import {useAccount, useConnect, useNetwork, useSignMessage, useDisconnect,} from "wagmi"
import Link from "next/link"
import Marquee from "react-fast-marquee";
import DrawerPage from './drawer'
import {InjectedConnector} from 'wagmi/connectors/injected'
import axios from 'axios';
import {Dropdown, Drawer, Form, Select, Input, DatePicker, Button, notification,} from 'antd'
import {CaretDownFilled, CaretRightFilled} from '@ant-design/icons';
import getConfig from "next/config";
import styles from './css/header.module.css'

const {Option} = Select;
import {get, post, del} from '/utils/axios'
import _ from 'lodash'
import dayjs from 'dayjs'
import cookie from 'js-cookie'
import {useRouter} from 'next/router'

const Header = () => {
    const [form] = Form.useForm();
    const {chain} = useNetwork()
    const router = useRouter()
    const inputRef = useRef(null);
    const [api, contextHolder] = notification.useNotification();
    const {address, isConnected} = useAccount()
    const {data: session, status} = useSession()
    const {signMessageAsync} = useSignMessage()
    const {disconnect} = useDisconnect()
    const {connect} = useConnect({
        connector: new InjectedConnector(),
    });
    const {publicRuntimeConfig} = getConfig();
    const assetPrefix = publicRuntimeConfig.assetPrefix || '';
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
            if (res.status === 200 && res.data) {
                setTokenForm(res.data)
                setTokenFormBol(false)
            } else {
                setTokenFormBol(true)
            }
        }).catch(err => {
        })
    }, 1500)

    const onClose = () => {
        setOpen(false);
        form.resetFields()
    };

    const showDrawer = () => {
        setOpen(true);
        get('/selectPresalePlatform', '').then(res => {
            if (res && res.status === 200) {
                setPresalePlatform(res.data ? res.data : [])
            } else {
                setPresalePlatform([])
            }
        }).catch(err => {
        })
        get('/selectLaunchPlatform', '').then(res => {
            if (res && res.status === 200) {
                setLaunchPlatform(res.data ? res.data : [])
            } else {
                setLaunchPlatform([])
            }
        }).catch(err => {
        })

    };
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
            const presale = {
                presaleTime: timeForm.presale,
                presalePlatformId: values.presalePlatformId,
                presaleLink: values.presaleLink
            }
            const launch = {
                launchTime: timeForm.launch,
                launchPlatformId: values.launchPlatformId,
                launchLink: values.launchLink
            }
            const data = {token, presale, launch}
            post('/addPresaleAndLaunch', data).then(res => {
                if (res && res.data?.success) {
                    form.resetFields()
                    setTokenForm({})
                    setTime({})
                    setOpen(false);
                    api.success({
                        message: `Success`, description: 'Added successfully', placement: 'topLeft',
                    });
                } else {
                    api.warning({
                        message: `warning`, description: 'add failed,Please try again', placement: 'topLeft',
                    });
                }
            }).catch(err => {
            })
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
    const geoUser = async () => {
        const data = await axios.post(baseUrl + "/api/user", {
            address: token.sub, ipAddress
        })
    }
    const handleLogin = async () => {
        const cook = window.localStorage.getItem('name')
        if (!session && !cook) {
            try {
                const message = new SiweMessage({
                    domain: window.location.host,
                    address: address,
                    statement: "Sign in with Ethereum to the app.",
                    uri: window.location.origin,
                    version: "1",
                    chainId: chain?.id,
                    nonce: await getCsrfToken(),
                })
                const signature = await signMessageAsync({
                    message: message.prepareMessage(),
                })
                await signIn("credentials", {
                    message: JSON.stringify(message),
                    redirect: false,
                    signature,
                    callbackUrl: '/',
                })
                window.localStorage.setItem('name', address);
            } catch (error) {
                // notification.error({
                //     message: `Please note`, description: 'Error reported', placement: 'topLeft',
                // });
            }
        }
    }
    useEffect(() => {
        if (!session) {
            handleLogin()
        }
    }, [session, isConnected])

    const set = () => {
        window.localStorage.setItem('name', '')
        const a = window.localStorage.getItem('name')
        if (!a) {
            disconnect()
            signOut()
        }
    }
    const push=()=>{
        if(session&&session.user&&session.user.username){
            router.push(`/${session.user.username}`)
        }
    }

    const items = [
        {
            key: '1',
            label: (
                <span onClick={push}>
      Personal
    </span>
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
    return (
        <>
            <header
                className={
                    "top-0 w-full  z-30 transition-all headerClass"}>
                <div className={styles['aaa']}>
                    <div></div>
                    <p className={styles['search']}>Search pair by symbol,name,contract or token</p>
                    <div style={{display:'flex',alignItems:'center'}}>
                        <Button type={'primary'} className={styles['but']}
                                style={{marginRight: '20px', backgroundColor: 'rgb(254,239,146)'}} onClick={showDrawer}>Add
                            Coin</Button>
                        {
                            !session || !window?.localStorage?.getItem('name') ?
                                <Button type={'primary'} className={styles['but']}
                                        style={{backgroundColor: 'rgb(254,239,146)'}} onClick={(e) => {
                                    e.preventDefault()
                                    if (!isConnected) {
                                        connect()
                                    } else {
                                        handleLogin()
                                    }
                                }}>Login</Button> :
                                <div style={{display:'flex',alignItems:'center'}}>
                                    <img style={{marginRight:'10px',width:'30px',borderRadius:'50%',height:'30px'}} src={session?.user?.profilePicUrl} alt=""/>
                                <Dropdown
                                    menu={{
                                        items,
                                    }}
                                    placement="bottomLeft"
                                    arrow
                                >
                                    <Button type={'primary'} className={styles['but']}
                                            style={{
                                                color: 'black',
                                                backgroundColor: 'rgb(254,239,146)'
                                            }}>{session?.user?.username?.slice(0, 5) + '...'}</Button>
                                </Dropdown>
                                </div>
                        }
                    </div>
                </div>
                {/*<nav className="max-w-screen-xl pl-6 mx-auto grid grid-flow-col grid-cols-3 py-3">*/}
                {/*  /!*<div className="flex items-center">*!/*/}
                {/*    /!*<div className="w-full">*!/*/}
                {/*    /!*  /!*<Marquee*!/*!/*/}
                {/*    /!*  /!*  pauseOnHover={true}*!/*!/*/}
                {/*    /!*  /!*  speed={30}*!/*!/*/}
                {/*    /!*  /!*  gradientWidth={100}*!/*!/*/}
                {/*    /!*  /!*>*!/*!/*/}
                {/*    /!*    /!*<div>aaaaaaaaaaaaaaaaaaaaaaa</div>*!/*!/*/}
                {/*    /!*    /!*{hotPairs.map((item, index) => (*!/*!/*/}
                {/*    /!*    /!*  <span key={item.address}>*!/*!/*/}
                {/*    /!*    /!*    <span># {index}</span>*!/*!/*/}
                {/*    /!*    /!*    <Image src={`http://192.168.8.104:3004/${item.logo}`} width={20} height={20} className="mx-3 inline rounded-full" />*!/*!/*/}
                {/*    /!*    /!*    <span>{item.symbol}</span>*!/*!/*/}
                {/*    /!*    /!*  </span>*!/*!/*/}
                {/*    /!*    /!*))}*!/*!/*/}
                {/*    /!*  </Marquee>*!/*/}
                {/*    /!*</div>*!/*/}
                {/*  /!*</div>*!/*/}
                {/*  <div className="flex justify-center ml-9">*/}
                {/*  </div>*/}

                {/*  <div>*/}
                {/*    /!*<Link href="/addCoin">*!/*/}
                {/*    /!*</Link>*!/*/}
                {/*    /!*<Connect />*!/*/}
                {/*  </div>*/}
                {/*</nav>*/}
                <DrawerPage/>
                <Drawer title="Basic Drawer" destroyOnClose={true} placement="right" onClose={onClose} open={open}>
                    <Form
                        name="basic"
                        form={form}
                        onFinish={onFinish}
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
                        {/*presale*/}
                        <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                            {
                                openPresale ? <CaretRightFilled style={{cursor: 'pointer', fontSize: '20px',}}
                                                                onClick={hidePresale}/> :
                                    <CaretDownFilled onClick={hidePresale}
                                                     style={{cursor: 'pointer', fontSize: '20px', marginTop: '5px'}}/>
                            }
                            <p style={{lineHeight: 1, cursor: 'pointer'}} onClick={hidePresale}>presale</p>
                            <p style={{width: '100%', height: '1px', backgroundColor: 'gray'}}></p>
                        </div>
                        <div style={openPresale ? {display: 'none'} : {}}>
                            <Form.Item
                                label="Time"
                                name="presaleTime"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your time!',
                                    },
                                ]}
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
                                rules={[
                                    {
                                        required: true,
                                        message: 'Select input your PresalePlatform!',
                                    },
                                ]}
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
                                                    <img src={baseUrl + `${i.logo}`} alt=""
                                                         width={'20px'}/> <span>{i.name}</span>
                                                </div>
                                            </Option>
                                        }) : null
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Link"
                                name="presaleLink"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your link!',
                                    },
                                ]}
                                labelCol={{
                                    span: 6,
                                }}
                            >
                                <Input/>
                            </Form.Item>
                        </div>
                        {/*launch*/}
                        <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                            {
                                openLaunch ? <CaretRightFilled style={{cursor: 'pointer', fontSize: '20px',}}
                                                               onClick={hideLaunch}/> :
                                    <CaretDownFilled onClick={hideLaunch}
                                                     style={{cursor: 'pointer', fontSize: '20px', marginTop: '5px'}}/>
                            }
                            <p style={{lineHeight: 1, cursor: 'pointer'}} onClick={hideLaunch}>launch</p>
                            <p style={{width: '100%', height: '1px', backgroundColor: 'gray'}}></p>
                        </div>
                        <div style={openLaunch ? {display: 'none'} : {}}>
                            <Form.Item
                                label="Time"
                                name="launchTime"
                                className={'bbb'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your time!',
                                    },
                                ]}
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
                                rules={[
                                    {
                                        required: true,
                                        message: 'Select input your launchPlatform!',
                                    },
                                ]} labelCol={{
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
                                                    <img src={baseUrl + `${i.logo}`} alt=""
                                                         width={'20px'}/> <span>{i.name}</span>
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
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your link!',
                                    },
                                ]} labelCol={{
                                span: 6,
                            }}
                            >
                                <Input/>
                            </Form.Item>
                        </div>
                        {/*link*/}
                        <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                            {
                                openLink ? <CaretRightFilled style={{cursor: 'pointer', fontSize: '20px',}}
                                                             onClick={hideLink}/> : <CaretDownFilled onClick={hideLink}
                                                                                                     style={{
                                                                                                         cursor: 'pointer',
                                                                                                         fontSize: '20px',
                                                                                                         marginTop: '5px'
                                                                                                     }}/>
                            }
                            <p style={{lineHeight: 1, cursor: 'pointer'}} onClick={hideLink}>Link</p>
                            <p style={{width: '100%', height: '1px', backgroundColor: 'gray'}}></p>
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
            </header>
        </>
    );
};

export default Header;

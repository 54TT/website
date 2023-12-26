import React, {useContext, useEffect, useRef, useState} from 'react';
import styles from '/public/styles/all.module.css'
import {
    Button,
    Popconfirm,
    Modal,
    Input,
    ConfigProvider,
    Select,
    Form,
    DatePicker,
    Statistic,
    Table,
    Segmented, Pagination
} from 'antd'
import {request} from "/utils/hashUrl";
import {
    ArrowLeftOutlined,
    GlobalOutlined,
    SendOutlined,
    DeleteOutlined,
    TwitterOutlined,
    RightOutlined
} from '@ant-design/icons'

const {TextArea} = Input
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn';
import cookie from "js-cookie";
import {CountContext} from '/components/Layout/Layout';
import styled from "../public/styles/all.module.css";
import {changeLang} from "../utils/set";

const {Countdown} = Statistic;

function Coin() {
    const {changeTheme, setLogin} = useContext(CountContext);
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errBol, setErrBol] = useState(false)
    const data = [{name: 'cat1', coin: 'CAT1'}, {name: 'cat2', coin: 'CAT2'}, {
        name: 'cat3',
        coin: 'CAT3'
    }, {name: 'cat4', coin: 'CAT4'}, {name: 'cat5', coin: 'CAT5'}, {name: 'cat6', coin: 'CAT6'}, {
        name: 'cat',
        coin: 'CAT'
    }]

    // 确认删除数据
    const confirm = (e, i) => {
        e.preventDefault()
        console.log(e);
        console.log(i);
    };
    const onFinishFailed = (e) => {
        setErrBol(true)
    }
    const onFinish = async (values) => {
        console.log(111111111111111)
        const {
            contractAddress,
            description,
            name,
            discord,
            symbol,
            telegram,
            twitter,
            website,
            youtube,
            chainId,
            presalePlatform,
            presaleTime,
            launchTime,
            launchPlatform,
            presaleLink,
            launchLink
        } = values
        const params = {
            contractAddress,
            description,
            discord,
            symbol,
            telegram,
            twitter,
            website,
            chainId,
            name,
            userId: user?.uid,
            logo: image
        }
        try {
            const token = cookie.get('token')
            const addLaunch = await request('post', '/api/v1/addLaunch', {
                platformId: launchPlatform,
                link: launchLink,
                time: dayjs(launchTime).unix().toString(), ...params
            }, token)
            const addPresale = await request('post', '/api/v1/addPresale', {
                platformId: presalePlatform,
                link: presaleLink,
                time: dayjs(presaleTime).unix().toString(), ...params
            }, token)
            if (addLaunch === 'please') {
                setLogin()
            } else if (addPresale === 'please') {
                setLogin()
            } else if (addLaunch?.data?.flag && addPresale?.data?.flag) {
                showModal()
            }
        } catch (err) {
            return null
        }
    };
    // 图片 储存
    const [image, setImage] = useState(null);
    const [user, setUser] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    //  是否展示form表单
    const [infoSow, setInfoShow] = useState(false)
    // 修改的对象
    const [infoParams, setInfoParams] = useState(null)
    // 下拉的数据
    const [presalePlatform, setPresalePlatform] = useState([]);
    const [chain, setChain] = useState([]);
    const [launchPlatform, setLaunchPlatform] = useState([]);
    const filePickerRef = useRef(null);
    const presaleName = changeLang('presale')
    // 发射 预售
    const [presale, setPresale] = useState([]);
    const [launch, setLaunch] = useState([]);
    const [total, setTotal] = useState(0);
    const [status, setStatus] = useState('presale');
    const [size, setSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const [next, setNext] = useState(1);
    //   获取图片
    const addImageFromDevice = async (e) => {
        try {
            const {files} = e.target;
            const token = cookie.get('token')
            const data = await request('post', '/api/v1/upload/image', files[0], token);
            if (data === 'please') {
                setLogin()
            } else if (data && data?.status === 200) {
                setImage(data?.data?.url)
                form.setFields([
                    {
                        name: 'logo', errors: null
                    }
                ])
                setImagePreview(URL.createObjectURL(files[0]));
            }
        } catch (err) {
            return null
        }
    };
    // 删除图片
    const deleteImg = () => {
        setImage(null)
        setImagePreview(null);
    }

    //   过滤数据
    const analysis = (params) => {
        if (params && params.status === 200 && params.data) {
            return params.data
        } else {
            return null
        }
    }

    // 获取下拉数据
    const getParams = async () => {
        try {
            const token = cookie.get('token')
            const getLaunch = await request('get', '/api/v1/getLaunchPlatforms', '', token)
            const getPresale = await request('get', '/api/v1/getPresalePlatforms', '', token)
            const getChains = await request('get', '/api/v1/getChains', '', token)
            if (getLaunch === 'please') {
                setLogin()
            } else if (getPresale === 'please') {
                setLogin()
            } else if (getChains === 'please') {
                setLogin()
            } else {
                const launch = analysis(getLaunch)
                const presale = analysis(getPresale)
                const chain = analysis(getChains)
                setPresalePlatform(presale && presale?.presalePlatforms && presale.presalePlatforms.length > 0 ? presale.presalePlatforms : [])
                setChain(chain && chain.chains && chain?.chains.length > 0 ? chain.chains : [])
                setLaunchPlatform(launch && launch?.launchPlatform && launch.launchPlatform.length > 0 ? launch.launchPlatform : [])
            }
        } catch (err) {
            return null
        }
    }
    const getDataLaun = async () => {
        try {
            const token = cookie.get('token')
            const getLaunch = await request('get', '/api/v1/getLaunchByUserId', {
                pageIndex: current,
                pageSize: size
            }, token)
            if (getLaunch === 'please') {
                setLogin()
            } else if (getLaunch && getLaunch?.status === 200) {
                const par = getLaunch?.data?.launchs || []
                const a = getPresale?.data?.count || 0
                setTotal(a)
                setLaunch(par)
            }
        } catch (eer) {
            return null
        }
    }
    // 获取数据
    const getDataPre = async () => {
        try {
            const token = cookie.get('token')
            const getPresale = await request('get', '/api/v1/getPresaleByUserId', {
                pageIndex: current,
                pageSize: size
            }, token)
            if (getPresale === 'please') {
                setLogin()
            } else if (getPresale && getPresale?.status === 200) {
                const par = getPresale?.data?.presales || []
                const a = getPresale?.data?.count || 0
                setTotal(a)
                setPresale(par)
            }
        } catch (eer) {
            return null
        }
    }
    const changSeg = (e) => {
        setCurrent(1)
        setSize(10)
        setStatus(e)
    }
    useEffect(() => {
        if (status === 'presale') {
            getDataPre()
        } else {
            getDataLaun()
        }
    }, [current, size, status])

    useEffect(() => {
        getParams()
        if (cookie.get('username') && cookie.get('username') != 'undefined') {
            const data = JSON.parse(cookie.get('username'))
            setUser(data)
        }
        return () => {
            setUser(null)
        }
    }, []);
    const packageHtml = (name) => {
        return <span className={changeTheme ? 'darknessFont' : 'brightFont'}>{name}</span>
    }
    const getD = (a) => {
        if (a) {
            return Date.now() + Number(a) * 1000
        } else {
            return 0
        }
    }
    // 下拉的sli
    const selectAll = (data) => {
        return data.length > 0 ? data.map((i, index) => {
            return <Select.Option value={i.id} key={index}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <img src={`${i.logo ? i.logo : '/dexlogo.svg'}`} alt=""
                         style={{width: '25px', height: '25px'}}/>
                    <span className={changeTheme ? 'fontW' : 'fontB'}>{i.name}</span>
                </div>
            </Select.Option>
        }) : null
    }
    const columns = [
        {
            title: '',
            dataIndex: 'address', align: 'center',
            render: (_, record) => {
                return <img src={record?.logo ? record.logo : '/avatar.png'} style={{borderRadius: '50%'}}
                            width={'30px'} alt=""/>
            }
        },
        {
            title: packageHtml(presaleName.token),
            dataIndex: 'name', align: 'center',
            render: (text) => {
                return <p
                    className={`${changeTheme ? 'darknessFont' : 'brightFont'}`}>{text}</p>
            }
        },
        {
            title: packageHtml(presaleName.symbol),
            dataIndex: 'symbol', align: 'center',
            render: (text) => {
                return <p
                    className={` ${changeTheme ? 'darknessFont' : 'brightFont'}`}>{text}</p>
            }
        },
        {
            title: packageHtml(presaleName.social),
            dataIndex: 'address', align: 'center',
            render: (text, record) => {
                return <div className={styled.presaleBoxTableImg}>
                    <GlobalOutlined className={changeTheme ? 'darknessFont' : 'brightFont'}
                                    style={{cursor: 'pointer', fontSize: '20px'}} onClick={() => push(record, 'one')}/>
                    <TwitterOutlined className={changeTheme ? 'darknessFont' : 'brightFont'}
                                     style={{cursor: 'pointer', fontSize: '20px'}} onClick={() => push(record, 'two')}/>
                    <SendOutlined className={changeTheme ? 'darknessFont' : 'brightFont'}
                                  style={{cursor: 'pointer', fontSize: '20px'}} onClick={() => push(record, 'three')}/>
                </div>
            }
        },
        {
            title: packageHtml(presaleName.time),
            dataIndex: 'time', align: 'center',
            sorter: {
                compare: (a, b) => {
                    const data = a.time ? dayjs.unix(a.time).format('YYYY-MM-DD HH:mm:ss') : 0
                    const pa = b.time ? dayjs.unix(b.time).format('YYYY-MM-DD HH:mm:ss') : 0
                    return dayjs(pa).isBefore(data)
                }
            },
            render: (text, record) => {
                if (text) {
                    return <Countdown title="" className={changeTheme ? 'darknessFont' : 'brightFont'}
                                      value={getD(dayjs(dayjs.unix(text)).isAfter(dayjs()) ? dayjs(dayjs.unix(text)).diff(dayjs(), 'seconds') : '')}
                                      format="HH:mm:ss"/>
                } else {
                    return '00:00:00'
                }
            }
        },
        {
            title: packageHtml(presaleName.platform),
            dataIndex: 'platformLogo', align: 'center',
            render: (text) => {
                return <img src={text} alt="" style={{width: '30px'}} className={styled.presaleBoxTableImgs}/>
            }
        },
        {
            title: packageHtml(presaleName.dex), align: 'center', render: (text, record) => {
                return <img src="/dex-uniswap.png" alt="" style={{width: '30px', height: '30px'}}
                            className={styled.presaleBoxTableImgs}/>
            }
        },
        {
            title: packageHtml('status'), align: 'center', render: (text, record) => {
                return <span>{Number(record?.status) ? '已审核' : '未审核'}</span>
            }
        },
    ];
    const change = () => {
        setErrBol(false)
        setInfoShow(false)
        setImagePreview(null)
        setImage(null)
        form.resetFields()
        setCurrent(1)
        setSize(10)
        getDataPre()
        setStatus('presale')
        setNext(1)
        setIsModalOpen(false);
    }
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        change()
    };
    const customizeRenderEmpty = () => (
        //这里面就是我们自己定义的空状态
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <img src="/noData.png" alt="" width={'80px'}/>
            <p style={{color: '#FF9900'}}>No Data</p>
        </div>
    );
    const disabledDate = (current) => {
        return current && current < dayjs().endOf('day');
    };
    const range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    };
    const disabledDateTime = () => ({
        disabledHours: () => range(0, 24).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
    });
    const changeCur = (e, i) => {
        setCurrent(e)
        setSize(i)
    }
    const nextFrom = () => {
        setNext(res => res + 1)
    }
    const nextBack = () => {
        if (next === 1) {
            setInfoShow(false)
        } else {
            setNext(res => res - 1)
        }
    }
    return (
        <>
            {
                infoSow ?
                    <p style={{color: '#FF0000', cursor: 'pointer', display: 'inline-block', marginLeft: '10px'}}
                       onClick={nextBack}><ArrowLeftOutlined/> Back
                    </p> : ''
            }
                <div className={`${styles.coin} ${changeTheme ? 'coinBack' : 'brightTwo'}`}>
                    {
                        infoSow ? <Form
                            name="basic"
                            form={form}
                            layout={'vertical'}
                            className={changeTheme ? 'colorDrak' : ''}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off">
                            {/*coin*/}
                            <div className={styles.coinFormDiv}>
                                <div className={styles.coinFormDivWi}>
                                    <div className={next !== 1 ? styles.hid : ''}>
                                        <p className={`${styles.coinP} ${changeTheme ? 'fontW' : 'fontB'}`}>Coin
                                            info</p>
                                        <Form.Item
                                            label="Name"
                                            name="name"
                                            className={styles.coinForm}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your name!',
                                                },
                                            ]}
                                        >
                                            <Input placeholder={'e.g.Bitcoin'}
                                                   className={` ${changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}`}/>
                                        </Form.Item>
                                        <Form.Item
                                            label="Symbol"
                                            name="symbol"
                                            className={styles.coinForm}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your symbol!',
                                                },
                                            ]}
                                        >
                                            <Input placeholder={'e.g.BTC'}
                                                   className={` ${changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}`}/>
                                        </Form.Item>
                                        <Form.Item
                                            label="Description"
                                            name="description"
                                            className={styles.coinForm}
                                        >
                                            <TextArea placeholder={'e.g.Bitcoin is a decentralized digital currency'}
                                                      className={` ${changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}`}
                                                      rows={4}/>
                                        </Form.Item>
                                        <Form.Item
                                            label="Chain"
                                            name="chainId"
                                            className={styles.coinForm}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please select your chain!',
                                                },
                                            ]}
                                        >
                                            <Select
                                                placeholder={'Select...'}
                                                allowClear
                                                dropdownStyle={changeTheme ? {background: 'rgb(60,57,70)'} : ''}
                                                className={changeTheme ? `placeholderStyle` : ''}
                                                style={{width: '100%'}}
                                            >
                                                {
                                                    selectAll(chain)
                                                }
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            label="Contract address"
                                            name="contractAddress"
                                            className={styles.coinForm}
                                        >
                                            <Input placeholder={'Please enter...'}
                                                   className={changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}/>
                                        </Form.Item>
                                    </div>
                                    <div className={next === 2 ? '' : styles.hid}>
                                        <p
                                            className={`${styles.coinP} ${changeTheme ? 'fontW' : 'fontB'}`}>Presale&Launch</p>
                                        <Form.Item
                                            label="Presale link"
                                            name="presaleLink"
                                            className={styles.coinForm}
                                        >
                                            <Input placeholder={'Please enter...'}
                                                   className={changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}/>
                                        </Form.Item>
                                        <Form.Item
                                            label="Presale time(UTC)"
                                            name="presaleTime"
                                            className={styles.coinForm}
                                        >
                                            <DatePicker showTime placeholder={'Select...'}
                                                        style={{width: '100%'}}
                                                        disabledDate={disabledDate}
                                                        disabledTime={disabledDateTime}
                                                        className={changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}/>
                                        </Form.Item>
                                        <Form.Item
                                            label="Presale platform"
                                            name="presalePlatform"

                                            className={styles.coinForm}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your launchLink!',
                                                },
                                            ]}
                                        >
                                            <Select
                                                placeholder={'Select...'}
                                                allowClear
                                                dropdownStyle={changeTheme ? {background: 'rgb(60,57,70)'} : ''}

                                                className={changeTheme ? `placeholderStyle` : ''}
                                                style={{width: '100%'}}
                                            >
                                                {
                                                    selectAll(presalePlatform)
                                                }
                                            </Select>
                                        </Form.Item>
                                        <div></div>
                                        <Form.Item
                                            label="Launch link"
                                            name="launchLink"
                                            className={styles.coinForm}
                                        >
                                            <Input placeholder={'Please Enter...'}
                                                   className={changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}/>
                                        </Form.Item>
                                        <Form.Item
                                            label="Launch time"
                                            name="launchTime"
                                            className={styles.coinForm}
                                        >
                                            <DatePicker showTime placeholder={'Select...'}
                                                        style={{width: '100%'}}
                                                        disabledDate={disabledDate}
                                                        disabledTime={disabledDateTime}
                                                        className={changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}/>
                                        </Form.Item>
                                        <Form.Item
                                            label="Launch platform"
                                            name="launchPlatform"
                                            className={styles.coinForm}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your launchLink!',
                                                },
                                            ]}
                                        >
                                            <Select
                                                placeholder={'e.g.www.baidu.com'}
                                                allowClear
                                                dropdownStyle={changeTheme ? {background: 'rgb(60,57,70)'} : ''}
                                                className={changeTheme ? `placeholderStyle` : ''}
                                                style={{width: '100%'}}
                                            >
                                                {
                                                    selectAll(launchPlatform)
                                                }
                                            </Select>
                                        </Form.Item>
                                    </div>
                                </div>
                                <div className={` ${styles.coinFormDivWi}`}>
                                    <div className={next === 3 ? '' : styles.hid}>
                                        <p className={`${styles.coinP} ${changeTheme ? 'fontW' : 'fontB'}`}>Links</p>
                                        <Form.Item
                                            label="Website link"
                                            name="website"
                                            className={styles.coinForm}
                                        >
                                            <Input placeholder={'e.g.https://t.me/bitcoin'}
                                                   className={changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}/>
                                        </Form.Item>
                                        <Form.Item
                                            label="Telegram link"
                                            className={styles.coinForm}
                                            name="telegram"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your telegram!',
                                                },
                                            ]}
                                        >
                                            <Input placeholder={'e.g.https://t.me/bitcoin'}
                                                   className={changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}/>
                                        </Form.Item>
                                        <Form.Item
                                            label="Telegram Chinese"
                                            className={styles.coinForm}
                                            name="telegramChinese"
                                        >
                                            <Input placeholder={'e.g.https://t.me/bitcoin'}
                                                   className={changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}/>
                                        </Form.Item>
                                        <Form.Item
                                            label="Btok Link"
                                            className={styles.coinForm}
                                            name="btokLink"
                                        >
                                            <Input placeholder={'e.g.https://t.me/bitcoin'}
                                                   className={changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}/>
                                        </Form.Item>
                                        <Form.Item
                                            label="Twitter link"
                                            name="twitter"
                                            className={styles.coinForm}
                                        >
                                            <Input placeholder={'e.g.https://t.me/bitcoin'}
                                                   className={changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}/>
                                        </Form.Item>
                                        <Form.Item
                                            label="Discord"
                                            name="discord"
                                            className={styles.coinForm}
                                        >
                                            <Input placeholder={'e.g.https://discord.gg/46upkm'}
                                                   className={changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}/>
                                        </Form.Item>
                                        <Form.Item
                                            label="Project logo"
                                            className={styles.coinForm}
                                            name="logo"
                                            rules={[
                                                {
                                                    required: !imagePreview,
                                                    message: 'Please select an image!',
                                                },
                                            ]}
                                        >{
                                            imagePreview ? '' :
                                                <Input readOnly placeholder={'e.g.https://i.ibb.co/logo.png'}
                                                       className={changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}
                                                       onClick={() => filePickerRef.current.click()}/>
                                        }
                                            <input
                                                ref={filePickerRef}
                                                onChange={addImageFromDevice}
                                                type="file"
                                                accept="image/*"
                                                style={{display: "none"}}
                                            />
                                            {
                                                imagePreview ? <div style={{display: 'flex', alignItems: 'center'}}>
                                                    <img src={imagePreview} alt="imagePreview"
                                                         style={{width: '35px'}}/>
                                                    <Popconfirm
                                                        title="Delete the task"
                                                        description="Are you sure to delete this task?"
                                                        onConfirm={deleteImg}
                                                        okText="Yes"
                                                        cancelText="No"
                                                    >
                                                        <DeleteOutlined style={{
                                                            color: changeTheme ? 'white' : 'black',
                                                            fontSize: '18px'
                                                        }}/>
                                                        {/*<img src="/delete1.svg"*/}
                                                        {/*     style={{marginLeft: '10px', cursor: 'pointer', width: '10px'}}*/}
                                                        {/*     alt=""*/}
                                                        {/*/>*/}
                                                    </Popconfirm>
                                                </div> : ''
                                            }
                                        </Form.Item>
                                    </div>
                                    <div className={next === 4 ? '' : styles.hid}>
                                        <p className={`${styles.coinP} ${changeTheme ? 'fontW' : 'fontB'}`}>Contact
                                            info</p>
                                        <Form.Item
                                            label="For later changes to coin info, please provide the following:
                            Contact Email"
                                            name="for"
                                            className={styles.coinForm}
                                        >
                                            <Input placeholder={'Please Enter...'}
                                                   className={changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}/>
                                        </Form.Item>
                                        <Form.Item
                                            label="Contact Telegram"
                                            name="contactTelegram"
                                            className={styles.coinForm}
                                        >
                                            <Input placeholder={'Please Enter...'}
                                                   className={changeTheme ? 'darknessTwo placeholderStyle' : 'brightTT'}/>
                                        </Form.Item>
                                    </div>
                                </div>
                            </div>

                            <div className={`${styles.fromPost} ${styles.fromMol}`}>
                                {
                                    next === 4 ? '' : <button
                                        style={{padding: '10px 50px', borderRadius: '10px'}} onClick={nextFrom}
                                        className={` ${styles.cinFromNext} ${changeTheme ? 'darknessTwo' : 'fontB brightTT'}`}>Next
                                        step <RightOutlined/></button>
                                }
                                <Form.Item
                                    className={styles.coinForm}>
                                    <Button htmlType={'submit'}
                                            style={{padding: '10px 50px', borderRadius: '10px', height: 'auto'}}
                                            className={`${errBol ? styles.danger : ''} ${next === 4 ? '' : styles.hid} ${changeTheme ? 'fontW darknessTwo' : 'fontB brightTT'}`}>Add
                                        Coin
                                    </Button>
                                </Form.Item>
                                <p style={{textAlign: 'center', color: '#FF9900', fontSize: '17px'}}>Can't wait? Any ad
                                    spot will get your project automatically listed! Contact us now! <span
                                        style={{color: '#00AAFF'}}>@DEXpertOfficial</span></p>
                            </div>
                            {/*<div style={{display: 'flex',}}>*/}
                            {/*    <img src="/Vectors.svg" alt="" onClick={() => {*/}
                            {/*        setInfoParams(null)*/}
                            {/*        setInfoShow(false)*/}
                            {/*        setImagePreview(null)*/}
                            {/*        setImage(null)*/}
                            {/*        form.resetFields()*/}
                            {/*    }}*/}
                            {/*         style={{cursor: 'pointer', marginRight: '20px',width:'25px'}} />*/}
                            {/*    <img src="/sure.svg" alt="" onClick={() => form.submit()} style={{cursor: 'pointer',width:'30px'}}*/}
                            {/*         />*/}
                            {/*</div>*/}
                        </Form> : <div className={styles.screenCoin}>
                            <div className={styles.checkOrAdd}>
                                <Segmented
                                    options={['presale', 'launch']}
                                    onChange={changSeg}
                                    defaultValue={'presale'}
                                    className={`${changeTheme ? 'darkMode' : 'whiteMode'}`}
                                />
                                <Button
                                    className={` ${changeTheme ? 'darknessThree' : 'brightFore'}`}
                                    onClick={() => {
                                        form.resetFields()
                                        setInfoShow(true)
                                        setImagePreview(null)
                                        setImage(null)
                                        setNext(1)
                                        setCurrent(1)
                                        setSize(10)
                                    }}>Add a
                                    coin</Button>
                            </div>
                            <ConfigProvider renderEmpty={customizeRenderEmpty}>
                                <Table columns={columns}
                                       scroll={{x: 'max-content'}}
                                       rowKey={(record) => record?.id}
                                       loading={false}
                                       className={`${changeTheme ? 'darkTable filterTab hei' : 'coinTable tableWh'}  anyTable  ${status === 'presale' && presale.length > 0 || status === 'launch' && launch.length > 0 ? '' : 'heigh'} `}
                                       dataSource={status === 'presale' ? presale : launch}
                                       pagination={false} bordered={false}/>
                            </ConfigProvider>
                            <div style={{display: 'flex', justifyContent: 'end', marginTop: '10px'}}>
                                <Pagination current={current} pageSize={size}
                                            rootClassName={changeTheme ? 'drakePat' : ''}
                                            onChange={changeCur} total={total}/>
                            </div>
                        </div>
                    }
                </div>
                <Modal className={changeTheme ? 'modalDrak' : 'modalWh'}
                       title={<span style={{visibility: 'hidden'}}>Basic Modal</span>} centered destroyOnClose
                       maskClosable={false} open={isModalOpen} footer={null} onCancel={handleCancel}>
                    <p className={` ${changeTheme ? 'fontW' : 'fontB'} ${styles.centerd} ${styles.centerOne}`}>Submission
                        successful, We are reviewing!</p>
                    <p className={`${changeTheme ? 'fontW' : 'fontB'} ${styles.centerd}  ${styles.centerdW}`}>After
                        receiving the information, we will review it as soon as possible. Please do not submit it again,
                        which will only increase the workload of review. We will manually exclude spam content and robot
                        post. Thank you for your support.
                        Please note, if your coin stays inactive for a long while, it may get delisted.</p>
                    <div className={styles.modalBot}><p onClick={handleCancel}
                                                        className={`${changeTheme ? styles.modalBotWh : styles.modalBotBl} ${styles.modalBotP}`}>Back
                        To Main</p></div>
                </Modal>
        </>
    );
}

export default Coin;
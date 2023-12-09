import React, {useContext, useEffect, useRef, useState} from 'react';
import styles from '/public/styles/all.module.css'
import {Button, Popconfirm, Input, Select, Form, DatePicker} from 'antd'
import baseUrl from "../utils/baseUrl";
import {request} from "../utils/hashUrl";
const {TextArea} = Input
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn';
import cookie from "js-cookie";
import {CountContext} from "../components/Layout/Layout";

function Coin() {
    const {changeTheme} = useContext(CountContext);
    const [form] = Form.useForm();
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
    const onFinish = async (values) => {
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
            userId: 1,
            logo: 'https://www.dextools.io/resources/tokens/logos/ether/0xcc7c2146b16850e532605cdb07f18c62cb066962.png?1701753407609'
        }
        // youtube,
        const addLaunch = await request('post', '/api/v1/addLaunch', {
            platformId: launchPlatform,
            link: launchLink,
            time: dayjs(launchTime).unix().toString(), ...params
        })
        const addPresale = await request('post', '/api/v1/addPresale', {
            platformId: presalePlatform,
            link: presaleLink,
            time: dayjs(presaleTime).unix().toString(), ...params
        })
        if (addLaunch?.data?.flag && addPresale?.data?.flag) {
            setInfoShow(false)
            setImagePreview(null)
            setImage(null)
            form.resetFields()
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
    //   获取图片
    const addImageFromDevice = (e) => {
        const {files} = e.target;
        setImage(files[0]);
        setImagePreview(URL.createObjectURL(files[0]));
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
        const getLaunch = await request('get', '/api/v1/getLaunchPlatforms', '')
        const getPresale = await request('get', '/api/v1/getPresalePlatforms', '')
        const getChains = await request('get', '/api/v1/getChains', '')
        const launch = analysis(getLaunch)
        const presale = analysis(getPresale)
        const chain = analysis(getChains)
        setPresalePlatform(presale && presale?.presalePlatforms && presale.presalePlatforms.length > 0 ? presale.presalePlatforms : [])
        setChain(chain && chain.chains && chain?.chains.length > 0 ? chain.chains : [])
        setLaunchPlatform(launch && launch?.launchPlatform && launch.launchPlatform.length > 0 ? launch.launchPlatform : [])
    }

    useEffect(() => {
        getParams()
        if (cookie.get('username')) {
            const data = JSON.parse(cookie.get('username'))
            setUser(data)
        }
        return () => {
            setUser(null)
        }
    }, []);

    // 下拉的sli
    const selectAll = (data) => {
        return data.length > 0 ? data.map((i, index) => {
            return <Option value={i.id} key={index}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <img src={`${i.logo ? i.logo : '/Ellipse1.png'}`} alt=""
                         width={25} height={25}/>
                    <span>{i.name}</span>
                </div>
            </Option>
        }) : null
    }
    return (
        <div className={styles.coin}>
            {
                infoSow ? <Form
                    name="basic"
                    form={form}
                    layout={'vertical'}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <div style={{display: 'flex', alignItems: 'start', justifyContent: 'space-between'}}>
                        <div style={{width: '46%'}}>
                            <p style={{fontSize: '20px', fontWeight: 'bold'}}>Coin info</p>
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
                                <Input className={changeTheme?'darknessTwo':'brightTT'}/>
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
                                <Input className={changeTheme?'darknessTwo':'brightTT'}/>
                            </Form.Item>
                            <Form.Item
                                label="Description"
                                name="description"
                                className={styles.coinForm}
                            >
                                <TextArea
                                    style={{backgroundColor: 'rgb(254,239,146)'}} rows={4}/>
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
                                    placeholder="Select a option and change input text above"
                                    allowClear
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
                                <Input className={changeTheme?'darknessTwo':'brightTT'}/>
                            </Form.Item>
                        </div>
                        <div style={{width: '46%'}}>
                            <p style={{fontSize: '20px', fontWeight: 'bold'}}>Presale&Launch</p>
                            <Form.Item
                                label="Presale time(UTC)"
                                name="presaleTime"
                                className={styles.coinForm}
                            >
                                <DatePicker showTime
                                            style={{width: '100%', backgroundColor: 'rgb(254,239,146)'}}/>
                            </Form.Item>
                            <Form.Item
                                label="Presale platform"
                                name="presalePlatform"
                                className={styles.coinForm}
                            >
                                <Select
                                    placeholder="Select a option and change input text above"
                                    allowClear
                                    style={{width: '100%'}}
                                >
                                    {
                                        selectAll(presalePlatform)
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Presale link"
                                name="presaleLink"
                                className={styles.coinForm}
                            >
                                <Input className={changeTheme?'darknessTwo':'brightTT'}/>
                            </Form.Item>
                            <Form.Item
                                label="Launch time"
                                name="launchTime"
                                className={styles.coinForm}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select your launchTime!',
                                    },
                                ]}
                            >
                                <DatePicker showTime
                                            style={{width: '100%', backgroundColor: 'rgb(254,239,146)'}}/>
                            </Form.Item>
                            <Form.Item
                                label="Launch platform"
                                name="launchPlatform"
                                className={styles.coinForm}
                            >
                                <Select
                                    placeholder="Select a option and change input text above"
                                    allowClear
                                    style={{width: '100%'}}
                                >
                                    {
                                        selectAll(launchPlatform)
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Launch link"
                                name="launchLink"
                                className={styles.coinForm}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your launchLink!',
                                    },
                                ]}
                            >
                                <Input className={changeTheme?'darknessTwo':'brightTT'}/>
                            </Form.Item>
                        </div>
                    </div>
                    <p style={{fontSize: '20px', fontWeight: 'bold'}}>Links</p>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{width: '46%'}}>
                            <Form.Item
                                label="Website link"
                                name="website"
                                className={styles.coinForm}
                            >
                                <Input className={changeTheme?'darknessTwo':'brightTT'}/>
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
                                <Input className={changeTheme?'darknessTwo':'brightTT'}/>
                            </Form.Item>
                            <Form.Item
                                label="Twitter link"
                                name="twitter"
                                className={styles.coinForm}
                            >
                                <Input className={changeTheme?'darknessTwo':'brightTT'}/>
                            </Form.Item>
                        </div>
                        <div style={{width: '46%'}}>
                            <Form.Item
                                label="Discord"
                                name="discord"
                                className={styles.coinForm}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your discord!',
                                    },
                                ]}
                            >
                                <Input className={changeTheme?'darknessTwo':'brightTT'}/>
                            </Form.Item>
                            <Form.Item
                                label="Project logo"
                                className={styles.coinForm}
                                name="logo"
                                // rules={[
                                //     {
                                //         required: !imagePreview,
                                //         message: 'Please select an image!',
                                //     },
                                // ]}
                            >{
                                imagePreview ? '' :
                                    <Input readOnly className={changeTheme?'darknessTwo':'brightTT'}
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
                                label="Youtube"
                                name="youtube"
                                className={styles.coinForm}
                            >
                                <Input className={changeTheme?'darknessTwo':'brightTT'}/>
                            </Form.Item>

                        </div>
                    </div>
                    <Form.Item style={{display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
                        <div style={{display: 'flex',}}>
                            <img src="/Vectors.svg" alt="" onClick={() => {
                                setInfoParams(null)
                                setInfoShow(false)
                                setImagePreview(null)
                                setImage(null)
                                form.resetFields()
                            }}
                                 style={{cursor: 'pointer', marginRight: '20px'}} width={25}/>
                            <img src="/sure.svg" alt="" onClick={() => form.submit()} style={{cursor: 'pointer'}}
                                 width={30}/>
                        </div>
                    </Form.Item>
                </Form> : <div>
                    <p style={{fontSize: '20px', fontWeight: 'bold'}}>Your coin</p>
                    {
                        data.map((i, index) => {
                            return index !== 0 && <div key={index} className={styles.coinList}>
                                <span>{index}.</span>
                                <img src="/avatar.png" alt="" width={30} style={{margin: '0 10px'}}/>
                                <span>{i.name}</span>
                                <span style={{fontSize: '18px', margin: '0 10px'}}>${i.coin}</span>
                                <span style={{fontSize: '18px', fontWeight: 'bold'}}>info</span>
                                <img src="/setCoin.svg" alt="" width={14} onClick={() => {
                                    setInfoShow(true)
                                    setInfoParams(i)
                                }}
                                     style={{cursor: 'pointer', margin: '0 10px'}}/>
                                <Popconfirm
                                    title="Delete the task"
                                    description="Are you sure to delete this task?"
                                    onConfirm={(e) => confirm(e, i)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <img src="/delete1.svg" alt=" " width={14} style={{cursor: 'pointer'}}/>
                                </Popconfirm>
                            </div>
                        })
                    }
                    <Button style={{backgroundColor: 'rgb(254,239,146)'}} onClick={() => {
                        form.resetFields()
                        setInfoShow(true)
                        setImagePreview(null)
                        setImage(null)
                    }}>Add a
                        coin</Button>
                </div>
            }
        </div>
    );
}

export default Coin;
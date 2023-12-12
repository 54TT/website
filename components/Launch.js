import React, {useContext, useEffect, useRef, useState} from "react";
import dayjs from 'dayjs';
import {notification, Pagination, Table, Card, Statistic} from "antd";
import {GlobalOutlined, SendOutlined, TwitterOutlined} from "@ant-design/icons";
import baseUrl from "../utils/baseUrl";

const {Countdown} = Statistic;
import styled from '/public/styles/all.module.css'
import '/public/styles/scroll.module.css'
import Image from 'next/image'
import {request} from '/utils/hashUrl'
import {changeLang} from "/utils/set";
import {CountContext} from '/components/Layout/Layout';

export default function Presale() {
    const launch = changeLang('launch')
    const {changeTheme} = useContext(CountContext);
    const [launchPageSize, setLaunchPageSize] = useState(10);
    const [launchCurrent, setLaunchCurrent] = useState(1);
    const [launchAll, setLaunchAll] = useState(0);
    const [launchPro, setLaunch] = useState([]);
    const [launchBol, setLaunchBol] = useState(true);
    const hint = () => {
        notification.error({
            message: `Please note`, description: 'Error reported', placement: 'topLeft',
            duration: 2
        });
    }
    const changeAllTheme = (a, b) => {
        return changeTheme ? a : b
    }
    const getParams = async (url, params) => {
        const res = await request('get', url, params)
        if (res.status === 200) {
            let {launchs} = res.data
            setLaunch(launchs && launchs.length > 0 ? launchs : [])
            setLaunchAll(0)
            setLaunchBol(false)
        } else {
            setLaunch([])
            setLaunchAll(0)
            setLaunchBol(false)
        }
    }
    // const [diffTime, setDiffTime] = useState(null)
    // const refSet = useRef(null)
    // useEffect(() => {
    //     refSet.current = setInterval(() => setDiffTime(diffTime - 1), 1000)
    //     return () => {
    //         clearInterval(refSet.current)
    //     }
    // }, [diffTime])
    useEffect(() => {
        getParams('/api/v1/launch', {
            pageIndex: launchCurrent,
            pageSize: launchPageSize
        })
    }, []);
    const push = (record, name) => {
        if (name === 'a') {
            window.open(record.telegram)
        } else if (name === 'b') {
            window.open(record.twitter)
        } else {
            window.open(record.website.includes('http') ? record.website : 'https://' + record.website)
        }
    }
    const getD = (a) => {
        if (a) {
            return Date.now() + Number(a) * 1000
        } else {
            return 0
        }
    }
    const columns = [
        {
            title: '',
            dataIndex: 'address', align: 'center',
            width: 30,
            render: (_, record) => {
                return <img src={record?.logo?record?.logo:'/avatar.png'} alt="" width={30}/>
            }
        },
        {
            title: launch.token,
            dataIndex: 'name', align: 'center', width: '25%',
            render: (text) => {
                return <p className={changeAllTheme('darknessFont', 'brightFont')}>{text}</p>
            }
        },
        {
            title: launch.symbol,
            dataIndex: 'symbol', align: 'center',
            render: (text) => {
                return <p
                    className={`${styled.launchTableText} ${changeAllTheme('darknessFont', 'brightFont')}`}>{text}</p>
            }
        },
        {
            title: launch.social,
            dataIndex: 'address', align: 'center',
            width: 200,
            render: (text, record) => {
                return <div className={styled.launchTableDiv}>
                    <GlobalOutlined className={changeAllTheme('darknessFont', 'brightFont')}
                                    style={{cursor: 'pointer', fontSize: '20px'}} onClick={() => push(record, 'one')}/>
                    <TwitterOutlined className={changeAllTheme('darknessFont', 'brightFont')}
                                     style={{cursor: 'pointer', fontSize: '20px'}} onClick={() => push(record, 'two')}/>
                    <SendOutlined className={changeAllTheme('darknessFont', 'brightFont')}
                                  style={{cursor: 'pointer', fontSize: '20px'}} onClick={() => push(record, 'three')}/>
                </div>
            }
        },
        {
            title: <span className={changeAllTheme('darknessFont', 'brightFont')}>{launch.time}</span>,
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
                    return <Countdown title="" className={changeAllTheme('darknessFont', 'brightFont')}
                                      value={getD(dayjs(dayjs.unix(text)).isAfter(dayjs()) ? dayjs(dayjs.unix(text)).diff(dayjs(), 'seconds') : '')}
                                      format="HH:mm:ss"/>
                } else {
                    return <p style={{textAlign: 'center'}}>0</p>
                }
            }
        },
        {
            title: launch.platform,
            dataIndex: 'launch_platform_logo', align: 'center',
            render: (text) => {
                return <img src={baseUrl + text} alt="" width={'30px'} className={styled.launchTableImg}/>
            }
        },
        {
            title: launch.dex, align: 'center', render: (text, record) => {
                return <Image src="/dex-uniswap.png" alt="" style={{height: 'auto', width: 'auto'}} width={30}
                              height={30} className={styled.launchTableImg}/>
            }
        },
    ];

    const change = (e, a) => {
        setLaunchCurrent(e)
        setLaunchPageSize(a)
    }
    return (
        <div className={`${styled.mobliceFeaturedBox} ${styled.featuredBox}`}>
            <Card className={`${styled.launchBoxCard}  ${changeAllTheme('darknessTwo', 'brightTwo')}`}>
                <div className={styled.launchBoxCardBox}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <img src="/Group.png" alt="" width={70} height={70} className={styled.mobliceImage}/>
                        <span style={{fontWeight: 'bold', fontSize: '26px'}} className={changeAllTheme('darknessFont' ,'brightFont')}> {launch.launch}</span>
                    </div>
                    <div className={styled.launchBoxFilter}>
                        <Pagination defaultCurrent={1} current={launchCurrent} showSizeChanger onChange={change}
                                    total={launchAll} pageSize={launchPageSize}/>
                    </div>
                </div>
                <Table className={`anyTable ${changeAllTheme('hotTableD', 'hotTable')}`} scroll={{x: 'max-content'}}
                       bordered={false} columns={columns} loading={launchBol}
                       dataSource={launchPro} rowKey={(record) => record.symbol + record.address}
                       pagination={false} rowClassName={(record) => {
                    return 'oneHave'
                }}/>
            </Card>
            <p className={styled.launchBoxBot}>©DEXpert.io</p>
        </div>
    )
}

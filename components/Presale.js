import React, {useContext, useEffect, useRef, useState} from "react";
import dayjs from 'dayjs';
import {notification, Pagination, Table, Card, Statistic} from "antd";
import {GlobalOutlined, SendOutlined, TwitterOutlined} from "@ant-design/icons";
import styled from '/public/styles/all.module.css'
const {Countdown} = Statistic;
import {changeLang} from "/utils/set";
import {CountContext} from '/components/Layout/Layout';
import {request} from "../utils/hashUrl";
import {useRouter} from "next/router";
import cookie from "js-cookie";

export default function Presale() {
    const presale = changeLang('presale')
    const {changeTheme, setLogin} = useContext(CountContext);
    const [launchPageSize, setLaunchPageSize] = useState(10);
    const [launchCurrent, setLaunchCurrent] = useState(1);
    const [launchAll, setLaunchAll] = useState(0);
    const [launch, setLaunch] = useState([]);
    const [launchBol, setLaunchBol] = useState(true);
    const router = useRouter()
    const changeAllTheme = (a, b) => {
        return changeTheme ? a : b
    }
    const packageHtml = (name) => {
        return <span className={changeAllTheme('darknessFont', 'brightFont')}>{name}</span>
    }
    const hint = () => {
        notification.error({
            message: `Please note`, description: 'Error reported', placement: 'topLeft',
            duration: 2
        });
    }
    const getParams = async (url, params) => {
        try {
            const res = await request('get', url, params)
            if (res === 'please') {
                setLogin()
                setLaunch([])
                setLaunchAll(0)
            } else if (res && res?.status === 200) {
                let {presales} = res?.data
                setLaunch(presales && presales.length > 0 ? presales : [])
                setLaunchAll(0)
                setLaunchBol(false)
            } else {
                setLaunch([])
                setLaunchAll(0)
            }
        } catch (err) {
            setLaunch([])
            setLaunchAll(0)
            return null
        }
    }
    useEffect(() => {
        getParams('/api/v1//presale', {
            pageIndex: launchCurrent,
            pageSize: launchPageSize
        },)
        cookie.remove('list')
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
                return <img src={record?.logo ? record.logo : '/avatar.png'} style={{borderRadius: '50%'}} alt="" width={30}/>
            }
        },
        {
            title: presale.token,
            dataIndex: 'name', align: 'center',
            width: 100,
            render: (text) => {
                return <p
                    className={`${styled.presaleBoxTableP} ${styled.moblicePresaleBoxTableP} ${changeAllTheme('darknessFont', 'brightFont')}`}>{text}</p>
            }
        },
        {
            title: presale.symbol,
            dataIndex: 'symbol', align: 'center',
            render: (text) => {
                return <p
                    className={`${styled.presaleBoxTableP} ${changeAllTheme('darknessFont', 'brightFont')}`}>{text}</p>
            }
        },
        {
            title: presale.social,
            dataIndex: 'address', align: 'center',
            width: 200,
            render: (text, record) => {
                return <div className={styled.presaleBoxTableImg}>
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
            title: packageHtml(presale.time),
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
                    return packageHtml('00:00:00')
                }
            }
        },
        {
            title: presale.platform,
            dataIndex: 'platformLogo', align: 'center',
            render: (text) => {
                return <img src={text} alt="" width={'30px'} className={styled.presaleBoxTableImgs}/>
            }
        },
        {
            title: presale.dex, align: 'center', render: (text, record) => {
                return <img src="/dex-uniswap.png" alt="" width={30} style={{height: 'auto', width: 'auto'}}
                              height={30} className={styled.presaleBoxTableImgs}/>
            }
        },
    ];
    const change = (e, a) => {
        setLaunchCurrent(e)
        setLaunchPageSize(a)
    }
    return (
        <div className={styled.launchBox}>
            <Card className={`${styled.launchBoxCard} ${changeAllTheme('darknessTwo', 'brightTwo')}`}>
                <div className={styled.launchBoxCardBox}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <img src="/iconsss.svg" alt="" width={70} height={70} className={styled.mobliceImage}/>
                        <span style={{fontWeight: 'bold', fontSize: '26px'}}
                              className={changeAllTheme('darknessFont', 'brightFont')}>{presale.presales}</span>
                    </div>
                    <div className={styled.launchBoxFilter}>
                        <Pagination defaultCurrent={1} current={launchCurrent} showSizeChanger onChange={change}
                                    total={launchAll} rootClassName={changeTheme ? 'drakePat' : ''}
                                    pageSize={launchPageSize}/>
                    </div>
                </div>
                <Table className={`anyTable ${changeAllTheme('hotTableD', 'hotTable')}`} bordered={false}
                       columns={columns} loading={launchBol}
                       scroll={{x: 'max-content'}}
                       onRow={(record) => {
                           return {
                               onClick: (event) => {
                                   const data = JSON.stringify({...record, status: 'presale'})
                                   cookie.set('list', data)
                                   router.push('/launchPresaleDetail')
                               },
                           };
                       }}
                       dataSource={launch} rowKey={(record) => record?.id}
                       pagination={false} rowClassName={(record) => {
                    return 'oneHave'
                }}/>
            </Card>
            <p className={styled.launchBoxBot}>©DEXpert.io</p>
        </div>
    )
}

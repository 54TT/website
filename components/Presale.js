import React, {useEffect, useRef, useState} from "react";
import dayjs from 'dayjs';
import {notification, Pagination, Table, Card} from "antd";
import _ from "lodash";
import {get} from "../utils/axios";
import {GlobalOutlined, SendOutlined, TwitterOutlined} from "@ant-design/icons";
export default function Presale() {
    const [launchPageSize, setLaunchPageSize] = useState(10);
    const [launchCurrent, setLaunchCurrent] = useState(1);
    const [launchAll, setLaunchAll] = useState(0);
    const [launch, setLaunch] = useState([]);
    const [launchBol, setLaunchBol] = useState(true);

    const hint = () => {
        notification.error({
            message: `Please note`, description: 'Error reported', placement: 'topLeft',
            duration: 2
        });
    }
    const getParams = (url, params) => {
        get(url, params).then((res) => {
            if (res.status === 200) {
                let {data, count} = res.data
                setLaunch(data && data.length > 0 ? data : [])
                setLaunchAll(count && count.length > 0 ? count[0].count : 0)
                setLaunchBol(false)
            }
        }).catch(err => {
            setLaunch( [])
            setLaunchAll( 0)
            setLaunchBol(false)
            hint()
        })
    }
    const [diffTime, setDiffTime] = useState(null)
    const refSet = useRef(null)
    useEffect(() => {
        refSet.current = setInterval(() => setDiffTime(diffTime - 1), 1000)
        return () => {
            clearInterval(refSet.current)
        }
    }, [diffTime])
    const dao = (name) => {
        if (name) {
            var day = Math.floor((name / (24 * 3600)))
            var hour = Math.floor((name - (24 * 3600 * day)) / (3600))
            var min = Math.floor((name - (24 * 3600 * day) - (hour * 3600)) / (60))
            // var s=Math.floor(name-(24*3600*day)-(hour*3600)-(min*60))
            const m = min.toString().length === 1 ? '0' + min : min
            return day + ':' + hour + ':' + m
        } else {
            return '00:00:00'
        }
    }

    useEffect(() => {
        getParams('/queryPresaleAndLaunch', {
            pageIndex: launchCurrent - 1,
            pageSize: launchPageSize
        },)
    }, []);
    const changeImg = (record) => {
        const data = _.cloneDeep(launch)
        data.map((i) => {
            if (i.key === record.key) {
                i.img = !i.img;
            }
            return i
        })
        setLaunch(data)
    }
    const push = (record, name) => {
        if (name === 'a') {
            window.open(record.telegram)
        } else if (name === 'b') {
            window.open(record.twitter)
        } else {
            window.open(record.website.includes('http') ? record.website : 'https://' + record.website)
        }
    }
    const [va, setVa] = useState('')
    const columns = [
        {
            title: '',
            dataIndex: 'address',align: 'center',
            width: 100,
            render: (_, record) => {
                return <p style={{
                    width: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'black',
                    color: 'white',
                    textAlign: 'center',
                    lineHeight: '40px'
                }}>{record?.symbol?.slice(0, 1)}</p>
            }
        },
        {
            title: 'Pair',
            dataIndex: 'name',align: 'center',
            render: (text) => {
                return <p style={{fontWeight: 'bold', fontSize: '20px', textAlign: 'center'}}>{text}</p>
            }
        },
        {
            title: 'Social Info',
            dataIndex: 'address',align: 'center',
            width: 200,
            render: (text, record) => {
                return <div
                    style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer'}}>
                    <GlobalOutlined style={{cursor: 'pointer', fontSize: '20px'}} onClick={() => push(record, 'one')}/>
                    <TwitterOutlined style={{cursor: 'pointer', fontSize: '20px'}} onClick={() => push(record, 'two')}/>
                    <SendOutlined style={{cursor: 'pointer', fontSize: '20px'}} onClick={() => push(record, 'three')}/>
                </div>
            }
        },
        {
            title: 'Pre-sale ends',
            dataIndex: 'presale_time',align: 'center',
            sorter: {
                compare: (a, b) => {
                    const data = a.presale_time ? dayjs(a.presale_time).format('YYYY-MM-DD HH:mm:ss') : 0
                    const pa = b.presale_time ? dayjs(b.presale_time).format('YYYY-MM-DD HH:mm:ss') : 0
                    return dayjs(pa).isBefore(data)
                }
            },
            render: (text, record) => {
                if (text) {
                    return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><img
                        src="/Time.png" alt="" width={30} height={30}/>
                        <span>{dao(dayjs(text).isAfter(dayjs()) ? dayjs(text).diff(dayjs(), 'seconds') : '')}</span>
                    </div>
                } else {
                    return <p style={{textAlign: 'center'}}>0</p>
                }
            }
        },
        {
            title: 'Launch time',
            dataIndex: 'launch_time',align: 'center',
            sorter: {
                compare: (a, b) => {
                    const data = a.launch_time ? dayjs(a.launch_time).format('YYYY-MM-DD HH:mm:ss') : 0
                    const pa = b.launch_time ? dayjs(b.launch_time).format('YYYY-MM-DD HH:mm:ss') : 0
                    return dayjs(pa).isBefore(data)
                },
            },
            render: (text) => {
                if (text) {
                    return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><img
                        src="/Time.png" alt="" width={30} height={30}/>
                        <span>{dao(dayjs(text).isAfter(dayjs()) ? dayjs(text).diff(dayjs(), 'seconds') : '')}</span>
                    </div>
                } else {
                    return <p style={{textAlign: 'center'}}>0</p>
                }
            }
        },
        {
            title: 'Actions',
            dataIndex: 'launch_time',align: 'center',
            width: 50,
            render: (text, record) => {
                return <img src={`${record.img ? "/StarHave.png" : "/StarNone.png"}`} alt="" width={20} height={20}
                            style={{cursor: 'pointer'}}/>
                // onClick={() => changeImg(record)}
            }
        },
    ];
    const change = (e, a) => {
        setLaunchCurrent(e)
        setLaunchPageSize(a)
    }
    return (
        <div style={{marginRight: '20px'}}>
            <Card style={{
                minWidth: 700,
                backgroundColor: 'rgb(253, 213, 62)',
                width: '100%', border: 'none'
            }}>
                <div style={{
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <img src="/Group.png" alt="" width={70} height={70}/>
                        <span style={{fontWeight: 'bold', fontSize: '26px'}}>PRESALE & LAUNCH</span>
                    </div>
                </div>

                <div style={{display: 'flex', justifyContent: 'end', marginBottom: '20px'}}>
                    <Pagination defaultCurrent={1} current={launchCurrent} showSizeChanger onChange={change}
                                total={launchAll} pageSize={launchPageSize}/>
                </div>

                <Table className={`presale`} bordered={false} columns={columns} loading={launchBol}
                       dataSource={launch} rowKey={(record) => record.symbol + record.address}
                       pagination={false} rowClassName={(record) => {
                    if (dayjs(record.presale_time).isAfter(dayjs()) && dayjs(record.launch_time).isAfter(dayjs())) {
                        return 'anyHave'
                    } else if (dayjs(record.presale_time).isAfter(dayjs()) || dayjs(record.launch_time).isAfter(dayjs())) {
                        return 'oneHave'
                    } else {
                        return 'noHave'
                    }
                }}/>
            </Card>
            <p style={{
                marginTop: '80px',
                textAlign: 'center',
                lineHeight: '1',
                fontSize: '20px',
                color: 'rgb(98,98,98)'
            }}>©DEXPert.io</p>
        </div>
    )
}

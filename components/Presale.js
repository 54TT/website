import React, {useEffect, useState} from "react";
import axios from 'axios';
import baseUrl from '/utils/baseUrl';
// import { useAccount, useNetwork} from "wagmi";
import {useRouter} from 'next/router';
import dayjs from 'dayjs';
import {notification, Pagination, Table, Card} from "antd";
import _ from "lodash";
import {get} from "../utils/axios";
import {GlobalOutlined, SendOutlined, TwitterOutlined} from "@ant-design/icons";

export default function Presale() {
    const router = useRouter();
    const [launchPageSize, setLaunchPageSize] = useState(10);
    const [launchCurrent, setLaunchCurrent] = useState(1);
    const [launchAll, setLaunchAll] = useState(0);
    const [launch, setLaunch] = useState([]);
    const [launchBol, setLaunchBol] = useState(true);
    const [presales, setPresales] = useState([]);
    const [presaleCount, setPresaleCount] = useState(0);

    const hint = () => {
        notification.error({
            message: `Please note`, description: 'Error reported', placement: 'topLeft',
        });
    }
    const [refreshedTime, setRefreshedTime] = useState(dayjs());
    const updateRefreshedTime = () => {
        setRefreshedTime(dayjs());
    };

    const getParams = (url, params) => {
        get(url, params).then((res) => {
            if (res.status === 200) {
                let {data, count} = res.data
                setLaunch(data && data.length > 0 ? data : [])
                setLaunchAll(count&&count.length>0 ? count[0].count : 0)
                setLaunchBol(false)
            }
        }).catch(err => {
            hint()
        })
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
            window.open(record.website.includes('http')?record.website:'https://'+record.website)
        }
    }
    const columns = [
        {
            title: '',
            dataIndex: 'address',
            width: 100,
            render: (_,record) => {
                return    <p style={{width:'40px',borderRadius:'50%',backgroundColor:'black',color:'white',textAlign:'center',lineHeight:'40px'}}>{record?.symbol?.slice(0,1)}</p>
            }
        },
        {
            title: 'Pair',
            dataIndex: 'name',
            render: (text) => {
                return <p style={{fontWeight: 'bold', fontSize: '20px', textAlign: 'center'}}>{text}</p>
            }
        },
        {
            title: 'Social Info',
            dataIndex: 'address',
            width: 200,
            render: (text, record) => {
                return <div
                    style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer'}}>
                    <GlobalOutlined style={{cursor: 'pointer',fontSize:'20px'}} onClick={() => push(record, 'one')}/>
                    <TwitterOutlined style={{cursor: 'pointer',fontSize:'20px'}} onClick={() => push(record, 'two')}/>
                    <SendOutlined style={{cursor: 'pointer',fontSize:'20px'}} onClick={() => push(record, 'three')}/>
                </div>
            }
        },
        {
            title: 'Pre-sale ends',
            dataIndex: 'presale_time',
            sorter: {
                compare: (a, b) => {
                    const data = dayjs(a.presale_time).format('YYYY-MM-DD HH:mm:ss')
                    const pa = dayjs(b.presale_time).format('YYYY-MM-DD HH:mm:ss')
                    return dayjs(pa).isBefore(data)
                }
            },
            render: (text) => {
                return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><img
                    src="/Time.png" alt="" width={'30px'}/> <span>{dayjs(text).format('YYYY-MM-DD:HH:mm:ss')}</span>
                </div>
            }
        },
        {
            title: 'Launch time',
            dataIndex: 'launch_time',
            sorter: {
                compare: (a, b) => {
                    const data = dayjs(a.launch_time).format('YYYY-MM-DD HH:mm:ss')
                    const pa = dayjs(b.launch_time).format('YYYY-MM-DD HH:mm:ss')
                    return dayjs(pa).isBefore(data)
                },
            },
            render: (text) => {
                return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><img
                    src="/Time.png" alt="" width={'30px'}/> <span>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</span>
                </div>
            }
        },
        {
            title: 'Actions',
            dataIndex: 'launch_time',
            width: 50,
            render: (text, record) => {
                return <img src={`${record.img ? "/StarHave.png" : "/StarNone.png"}`} alt="" width={'20px'}
                            style={{cursor: 'pointer'}} onClick={() => changeImg(record)}/>
            }
        },
    ];
    const fetchData = async (chainIdParam, pageIndex, pageSize) => {
        try {
            const headers = {
                'x-api-key': '922e0369e89a40d9be91d68fde539325', // 替换为你的授权令牌
                'Content-Type': 'application/json', // 根据需要添加其他标头
            };

            let pairCount = await axios.get(baseUrl + '/queryAllPresaleCount', {
                headers: headers,
                params: {}
            });
            setPresaleCount(pairCount.data[0].count);

            let data = await axios.get(baseUrl + '/queryAllPresale', {
                headers: headers,
                params: {
                    pageIndex: pageIndex,
                    pageSize: pageSize
                }
            });
            data = data.data
            setPresales(data);
        } catch (error) {
            notification.error({
                message: `Please note`, description: 'Error reported', placement: 'topLeft',
            });
        }
    };
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
                        <img src="/Group.png" alt="" width={'70px'}/>
                        <span style={{fontWeight: 'bold', fontSize: '26px'}}>PRESALE & LAUNCH</span>
                    </div>
                </div>
                {/**/}
                <div style={{display:'flex',justifyContent:'end',marginBottom:'20px'}}>
                    <Pagination defaultCurrent={1} current={launchCurrent} showSizeChanger onChange={change}
                                total={launchAll} pageSize={launchPageSize}/>
                </div>

                <Table className={'hotTable presale'} bordered={false} columns={columns} loading={launchBol}
                       dataSource={launch} rowKey={(record)=>record.symbol+record.address}
                       pagination={false}/>
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

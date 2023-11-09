import React, {useEffect, useRef, useState} from "react";
import axios from 'axios';
import Link from "next/link";
import Image from 'next/image';
import baseUrl from '/utils/baseUrl'
import {formatDecimal, sendGetRequestWithSensitiveData, getRelativeTimeDifference, formatDateTime} from './utils';
import {useAccount, useNetwork} from "wagmi";
import dayjs from 'dayjs';
import {notification, Pagination, Table, Card, Segmented} from "antd";
import _ from "lodash";
import {get} from "../utils/axios";
import {useRouter} from 'next/router'

export default function Featured() {
    const router = useRouter()
    const ref = useRef(null)
    const [featuredPageSize, setFeaturedPageSize] = useState(10);
    const [featuredCurrent, setFeaturedCurrent] = useState(1);
    const [featuredBol, setFeaturedBol] = useState(true);
    const [refreshedTime, setRefreshedTime] = useState(dayjs());
    const [time, setTime] = useState('h24')
    const [tableParams, setTableParams] = useState([]);
    useEffect(() => {
        ref.current = setInterval(() => getParams('/queryFeatured', {
            pageIndex: featuredCurrent - 1,
            pageSize: featuredPageSize
        }), 8000)
        return () => {
            clearInterval(ref.current)
        }
    }, [tableParams]);
    const autoConvert = (number) => {
        if (Math.abs(number) >= 1000000) {
            return `${(number / 1000000).toFixed(2).replace(/\.?0*$/, '')}M`;
        } else if (Math.abs(number) >= 1000) {
            return `${(number / 1000).toFixed(2).replace(/\.?0*$/, '')}K`;
        } else {
            return number.toFixed(2).replace(/\.?0*$/, '');
        }
    };
    const hint = () => {
        notification.error({
            message: `Please note`, description: 'Error reported', placement: 'topLeft',
        });
    }
    const changSeg = (e) => {
        if (e === '5m') {
            setTime('m5')
        } else if (e === '1h') {
            setTime('h1')
        } else if (e === '6h') {
            setTime('h6')
        } else if (e === '24h') {
            setTime('m24')
        }
    }
    const changeImg = (record) => {
        const data = _.cloneDeep(tableParams)
        data.map((i) => {
            if (i.key === record.key) {
                i.img = !i.img;
            }
            return i

        })
        setTableParams(data)
    }
    const columns = [{
        title: '', render: (text, record) => {
            return <p style={{
                width: '30px',
                backgroundColor: 'black',
                color: 'white',
                lineHeight: '30px',
                textAlign: 'center',
                borderRadius: '50%'
            }}>{record?.baseToken?.symbol?.slice(0, 1)}</p>
        }
    }, {
        title: 'PAIR', render: (text, record) => {
            return <div style={{display: 'flex', alignItems: 'center'}}>
                <span>{record.baseToken?.symbol}/{record.quoteToken?.symbol}</span>
            </div>
        }
    },
        {
            title: 'PRICE', render: (text, record) => {
                return <div>{record?.priceUsd ? formatDecimal(record?.priceUsd, 3) : ''}</div>
            }
        },
        {
            title: 'Create Time', render: (text, record) => {
                return <p>{record?.pairCreatedAt ? getRelativeTimeDifference(formatDateTime(record.pairCreatedAt)) : ''}</p>
            }
        },
        {
            title: 'PRICECHANGE', render: (text, record) => {
                return <p
                    style={{color: record?.priceChange[time] > 0 ? 'green' : 'red'}}>{record?.priceChange[time]}</p>
            }
        },
        {
            title: 'TXNS', render: (text, record) => {
                return <p>{record?.txns[time]?.buys + record?.txns[time]?.sells ? autoConvert(record?.txns[time]?.buys + record?.txns[time]?.sells) : ''}</p>
            }
        },
        {
            title: 'VOLUME', render: (text, record) => {
                return <p>{record?.volume[time] ? autoConvert(record?.volume[time]) : ''}</p>
            }
        },
        {
            title: 'LIQUIDITY', render: (text, record) => {
                return <p> {record?.liquidity?.usd ? autoConvert(record.liquidity.usd) : ''}</p>
            }
        },
        // {
        //     title: 'TxCount', dataIndex: 'address', // sorter: {
        //     //     compare: (a, b) => a.chinese - b.chinese,
        //     // },
        //     render: (text, record) => {
        //         return <p style={{letterSpacing: '2px'}}>{record?.txCount}</p>
        //     }
        // },
        // {
        //     title: 'ReserveETH', // sorter: {
        //     //     compare: (a, b) => a.chinese - b.chinese,
        //     // },
        //     dataIndex: 'address', render: (text, record) => {
        //         return <p style={{letterSpacing: '2px'}}>{record?.reserveETH}</p>
        //     }
        // },
        // {
        //     title: 'Volume',
        //     dataIndex: 'address',
        //     sorter: {
        //         compare: (a, b) => a.chinese - b.chinese,
        //     },width:150
        // },
        // {
        //     title: 'Liquidity',
        //     dataIndex: 'address',
        //     sorter: {
        //         compare: (a, b) => a.chinese - b.chinese,
        //     },width:150
        // },
        // {
        //     title: 'T.M.Cap',
        //     dataIndex: 'address',
        //     sorter: {
        //         compare: (a, b) => a.chinese - b.chinese,
        //     },width:150
        // },
        // {
        //     title: '',
        //     dataIndex: 'address',align:'right',
        //     render:(text,record)=>{
        //         return <span style={{cursor:'pointer'}}>...</span>
        //     },
        // },
    ]
    const updateRefreshedTime = () => {
        setRefreshedTime(dayjs());
    };
    const getParams = (url, params) => {
        get(url, params).then(async (res) => {
            if (res.status === 200) {
                let data = res.data
                if (data && data.data.length > 0) {
                    const pairArray = data.data.map(item => item.pairAddress).join(",");
                    const pairInfosResponse = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/ethereum/${pairArray}`);
                    if (pairInfosResponse.status === 200) {
                        setFeaturedBol(false)
                        setTableParams(pairInfosResponse.data?.pairs.length > 0 ? pairInfosResponse.data?.pairs : [])
                    } else {
                        setFeaturedBol(false)
                        setTableParams([])
                    }
                } else {
                    setFeaturedBol(false)
                    setTableParams([])
                }
            }
        }).catch(err => {
            hint()
        })
    }
    useEffect(() => {
        getParams('/queryFeatured', {
            pageIndex: featuredCurrent - 1,
            pageSize: featuredPageSize
        })
    }, [featuredPageSize, featuredCurrent]);
    const changePag = (e, a) => {
        setFeaturedCurrent(e)
        setFeaturedPageSize(a)
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
                        <img src="/gpsReceiving.png" alt="" width={'70px'}/>
                        <span style={{fontWeight: 'bold', fontSize: '26px'}}>FEATURED</span>
                    </div>
                    <Segmented options={['5m', '1h', '6h', '24h']} onChange={changSeg} defaultValue={'24h'}/>

                </div>
                <Table className={'hotTable'} columns={columns} rowKey={(record)=>record?.baseToken?.address+record?.quoteToken?.address} onRow={(record) => {
                    return {
                        onClick: (event) => {
                            const data = record.pairAddress
                            router.push(`/details?pairAddress=${data}`,)
                        },
                    };
                }} loading={featuredBol} bordered={false} dataSource={tableParams} pagination={false}/>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'end'}}>
                    <Pagination defaultCurrent={1} style={{marginTop: '20px'}} showSizeChanger current={featuredCurrent}
                                total={tableParams.length ? tableParams.length : 0} onChange={changePag}
                                pageSize={featuredPageSize}/>
                </div>
            </Card>
            <p style={{
                marginTop: '80px',
                textAlign: 'center',
                lineHeight: '1',
                fontSize: '20px',
                color: 'rgb(98,98,98)'
            }}>©DEXPert.io</p>
        </div>
    );
}

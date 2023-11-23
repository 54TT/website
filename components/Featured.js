import React, {useEffect, useRef, useState} from "react";
import axios from 'axios';
import {formatDecimal, getRelativeTimeDifference, formatDateTime} from './Utils';
import dayjs from 'dayjs';
import {notification, Pagination, Table, Card, Segmented} from "antd";
import {get} from "../utils/axios";
import {useRouter} from 'next/router'
import {autoConvert} from '/utils/set'

export default function Featured() {
    const router = useRouter()
    const ref = useRef(null)
    const [featuredPageSize, setFeaturedPageSize] = useState(10);
    const [featuredCurrent, setFeaturedCurrent] = useState(1);
    const [featuredAll, setFeaturedAll] = useState(null);
    const [featuredBol, setFeaturedBol] = useState(true);
    const [time, setTime] = useState('h24')
    const [tableParams, setTableParams] = useState([]);
    useEffect(() => {
        ref.current = setInterval(() => getParams('/queryFeatured', {
            pageIndex: featuredCurrent - 1,
            pageSize: featuredPageSize
        }), 5000)
        return () => {
            clearInterval(ref.current)
        }
    }, [tableParams]);
    const changSeg = (e) => {
        if (e === '5m') {
            setTime('m5')
        } else if (e === '1h') {
            setTime('h1')
        } else if (e === '6h') {
            setTime('h6')
        } else if (e === '24h') {
            setTime('h24')
        }
    }
    const columns = [{
        title: 'PAIR',align: 'center',  render: (text, record) => {
            return <div style={{display: 'flex', alignItems: 'center',justifyContent:'space-between',width:'50%',margin:'0 auto'}}>
                <p style={{
                    width: '30px',
                    backgroundColor: 'black',
                    color: 'white',
                    lineHeight: '30px',
                    textAlign: 'center',
                    borderRadius: '50%'
                }}>{record?.baseToken?.symbol?.slice(0, 1)}</p>
                <div style={{lineHeight:'1'}}>
                    <p>{record?.baseToken?.symbol.length>7?record.baseToken.symbol.slice(0,4):record.baseToken.symbol}/<span style={{color:'#626262'}}>{record?.quoteToken?.symbol.length>7?record.quoteToken.symbol.slice(0,4):record.quoteToken.symbol}</span></p>
                    <p>{record?.pairAddress?record.pairAddress.length>10?record.pairAddress.slice(0,5)+':'+record.pairAddress.slice(-5):record.pairAddress:''}</p>
                </div>
            </div>
        }
    },
        {
            title: 'PRICE',align: 'center',  render: (text, record) => {
                return <div>{record?.priceUsd ? formatDecimal(record?.priceUsd, 3) : ''}</div>
            },
            sorter: {
                compare: (a, b) => {
                    return Number(a.priceUsd) -Number(b.priceUsd)
                }
            },
        },
        {
            title: 'Create Time',align: 'center',  render: (text, record) => {
                const data =  record.pairCreatedAt.toString().length>10?Number(record.pairCreatedAt.toString().slice(0,10)):record.pairCreatedAt
                return <p>{record?.pairCreatedAt ? getRelativeTimeDifference(formatDateTime(data)) : ''}</p>
            },
            sorter: {
                compare: (a, b) => {
                    const data = a.pairCreatedAt ? dayjs(a.pairCreatedAt).format('YYYY-MM-DD HH:mm:ss') : 0
                    const pa = b.pairCreatedAt ? dayjs(b.pairCreatedAt).format('YYYY-MM-DD HH:mm:ss') : 0
                    return dayjs(pa).isBefore(data)
                }
            },
        },
        {
            title: <span>{'% '+time}</span> ,align: 'center',  render: (text, record) => {
                return <p
                    style={{color: record?.priceChange[time] > 0 ? 'green' : 'red'}}>{record?.priceChange[time]?record.priceChange[time]:0}</p>
            }
        },
        {
            title: 'TXNS',align: 'center',  render: (text, record) => {
                return <p>{record?.txns[time]?.buys + record?.txns[time]?.sells ? autoConvert(record?.txns[time]?.buys + record?.txns[time]?.sells) : 0}</p>
            }
        },
        {
            title: 'VOLUME',align: 'center',  render: (text, record) => {
                return <p>{record?.volume[time] ? autoConvert(record?.volume[time]) : 0}</p>
            }
        },
        {
            title: 'LIQUIDITY',align: 'center',  render: (text, record) => {
                return <p> {record?.liquidity?.usd ? autoConvert(record.liquidity.usd) : ''}</p>
            }
        },
    ]
    const getParams = (url, params) => {
        get(url, params).then(async (res) => {
            if (res.status === 200) {
                let data = res.data
                if (data && data.data.length > 0) {
                    if(data.count){
                        setFeaturedAll(data.count[0].count)
                    }else {
                        setFeaturedAll(0)
                    }
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
            setFeaturedBol(false)
            setTableParams([])
        })
    }
    useEffect(() => {
        getParams('/queryFeatured', {
            pageIndex: featuredCurrent - 1,
            pageSize: featuredPageSize
        })
    }, [featuredPageSize, featuredCurrent]);
    const changePag = (e, a) => {
        setFeaturedBol(true)
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
                        <img src="/wallet.png" alt="" width={70}  height={70}/>
                        <span style={{fontWeight: 'bold', fontSize: '26px'}}>FEATURED</span>
                    </div>
                    <Segmented options={['5m', '1h', '6h', '24h']} onChange={changSeg} defaultValue={'24h'}/>

                </div>
                <Table className={'hotTable anyTable'} columns={columns} rowKey={(record)=>record?.baseToken?.address+record?.quoteToken?.address} onRow={(record) => {
                    return {
                        onClick: (event) => {
                            const data = record.pairAddress
                            router.push(`/details?pairAddress=${data}`,)
                        },
                    };
                }} loading={featuredBol} bordered={false} dataSource={tableParams} pagination={false}/>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'end'}}>
                    <Pagination defaultCurrent={1} style={{marginTop: '20px'}} showSizeChanger current={featuredCurrent}
                                total={featuredAll} onChange={changePag}
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

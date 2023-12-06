import React, {useContext, useEffect, useRef, useState} from "react";
import axios from 'axios';
import {formatDateTime, formatDecimal, getRelativeTimeDifference} from './Utils';
import dayjs from 'dayjs';
import {Card, Pagination, Segmented, Table} from "antd";
import {get} from "../utils/axios";
import {useRouter} from 'next/router'
import {autoConvert, changeLang} from '/utils/set'
import styled from '/public/styles/all.module.css'
import Image from 'next/image'
import {CountContext} from "./Layout/Layout";

export default function Featured() {
    const featured =changeLang('featured')
    const {changeTheme} = useContext(CountContext);
    const router = useRouter()
    const changeAllTheme = (a, b) => {
        return changeTheme ? a : b
    }
    const ref = useRef(null)
    const [featuredPageSize, setFeaturedPageSize] = useState(10);
    const [featuredCurrent, setFeaturedCurrent] = useState(1);
    const [featuredAll, setFeaturedAll] = useState(0);
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
    const packageHtml=(name)=>{
        return <span className={changeAllTheme('darknessFont', 'brightFont')}>{name}</span>
    }
    const columns = [{
        title: packageHtml(featured.pair),align: 'center',  render: (text, record) => {
            return <div className={styled.featuredColumnsBox}>
                <p className={styled.featuredColumns}>{record?.baseToken?.symbol?.slice(0, 1)}</p>
                <div style={{lineHeight:'1'}}>
                    <p className={changeAllTheme('darknessFont','brightFont')}>{record?.baseToken?.symbol.length>7?record.baseToken.symbol.slice(0,4):record.baseToken.symbol}/<span style={{color:'#626262'}}>{record?.quoteToken?.symbol.length>7?record.quoteToken.symbol.slice(0,4):record.quoteToken.symbol}</span></p>
                </div>
            </div>
        }
    },
        {
            title: packageHtml(featured.price),align: 'center',  render: (text, record) => {
                return <div className={changeAllTheme('darknessFont','brightFont')}>{record?.priceUsd ? formatDecimal(record?.priceUsd, 3) : ''}</div>
            },
            sorter: {
                compare: (a, b) => {
                    return Number(a.priceUsd) -Number(b.priceUsd)
                }
            },
        },
        {
            title: packageHtml(featured.createTime),align: 'center',  render: (text, record) => {
                const data =  record.pairCreatedAt.toString().length>10?Number(record.pairCreatedAt.toString().slice(0,10)):record.pairCreatedAt
                return <p className={changeAllTheme('darknessFont','brightFont')}>{record?.pairCreatedAt ? getRelativeTimeDifference(formatDateTime(data)) : ''}</p>
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
            title:  packageHtml('% '+time) ,align: 'center',  render: (text, record) => {
                return <p
                    style={{color: record?.priceChange[time] > 0 ? 'green' : 'red'}}>{record?.priceChange[time]?record.priceChange[time]:0}</p>
            }
        },
        {
            title:  packageHtml(featured.txns),align: 'center',  render: (text, record) => {
                return <p className={changeAllTheme('darknessFont','brightFont')}>{record?.txns[time]?.buys + record?.txns[time]?.sells ? autoConvert(record?.txns[time]?.buys + record?.txns[time]?.sells) : 0}</p>
            }
        },
        {
            title: packageHtml(featured.volume),align: 'center',  render: (text, record) => {
                return <p className={changeAllTheme('darknessFont','brightFont')}>{record?.volume[time] ? autoConvert(record?.volume[time]) : 0}</p>
            }
        },
        {
            title: packageHtml(featured.liquidity),align: 'center',  render: (text, record) => {
                return <p className={changeAllTheme('darknessFont','brightFont')}> {record?.liquidity?.usd ? autoConvert(record.liquidity.usd) : ''}</p>
            }
        },
        {
            title: packageHtml(featured.dex), align: 'center', render: (text, record) => {
                return <Image src="/dex-uniswap.png" alt="" width={30} height={30} style={{borderRadius:'50%',display:'block',margin:'0 auto',height:'auto',width:'auto'}}/>
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
        <div className={styled.featuredBox}>
            <Card className={`${styled.featuredBoxCard} ${changeAllTheme('darknessTwo','brightTwo')}`} >
                <div className={styled.featuredBoxTop}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Image src="/wallet.png" alt="" width={70}  height={70}/>
                        <span style={{fontWeight: 'bold', fontSize: '26px'}} className={changeAllTheme('darknessFont','brightFont')}>{featured.featured}</span>
                    </div>
                    <Segmented options={['5m', '1h', '6h', '24h']} onChange={changSeg} defaultValue={'24h'}/>
                </div>
                <Table className={`anyTable ${changeAllTheme('hotTableD','hotTable')}`} columns={columns} rowKey={(record)=>record?.baseToken?.address+record?.quoteToken?.address} onRow={(record) => {
                    return {
                        onClick: (event) => {
                            const data = record.pairAddress
                            router.push(`/details?pairAddress=${data}`,)
                        },
                    };
                }} loading={featuredBol} bordered={false} dataSource={tableParams} pagination={false}/>
                <div className={styled.featuredBoxBot}>
                    <Pagination defaultCurrent={1} style={{marginTop: '20px'}} showSizeChanger current={featuredCurrent}
                                total={featuredAll} onChange={changePag}
                                pageSize={featuredPageSize}/>
                </div>
            </Card>
            <p className={styled.featuredBoxName}>©DEXpert.io</p>
        </div>
    );
}

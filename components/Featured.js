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
import {request} from "../utils/hashUrl";

export default function Featured() {
    const featured = changeLang('featured')
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
    // useEffect(() => {
    //     ref.current = setInterval(() => getParams('/api/v1/feature', {
    //         pageIndex: featuredCurrent,
    //         pageSize: featuredPageSize
    //     }), 5000)
    //     return () => {
    //         clearInterval(ref.current)
    //     }
    // }, [tableParams]);
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
    const packageHtml = (name) => {
        return <span className={changeAllTheme('darknessFont', 'brightFont')}>{name}</span>
    }
    const packageEllipsisHtml = (name) => {
        return (
            <div className={styled.homeTableParentText}>
                {name.length > 10 ? (
                        <div className={styled.homeTableParentMain}>
                            <span
                                className={`${styled.homeTablePrenSpan} ${changeAllTheme('darknessFont', 'brightFont')}`}>{name.slice(0, -6)}</span>
                            <span
                                className={`${styled.homeTableNextSpan} ${changeAllTheme('darknessFont', 'brightFont')}`}>{name.slice(-6)}</span>
                        </div>)
                    : name
                }
            </div>
        )
    }
    const columns = [{
        title: packageHtml(featured.pair), align: 'left',
        fixed: 'left', render: (text, record) => {
            const data = JSON.parse(record?.apiData)
            return <div className={styled.featuredColumnsBox}>
                <p className={styled.featuredColumns}>{data?.baseToken?.symbol?.slice(0, 1)}</p>
                <div style={{lineHeight: '1'}}>
                    <p className={changeAllTheme('darknessFont', 'brightFont')}>{data?.baseToken?.symbol.length > 7 ? data.baseToken.symbol.slice(0, 4) : data.baseToken.symbol}/<span
                        style={{color: '#626262'}}>{data?.quoteToken?.symbol.length > 7 ? data.quoteToken.symbol.slice(0, 4) : data.quoteToken.symbol}</span>
                    </p>
                </div>
            </div>
        }
    },
        {
            title: packageHtml(featured.price), align: 'center', render: (text, record) => {
                const data = JSON.parse(record?.apiData)
                return <div
                    className={changeAllTheme('darknessFont', 'brightFont')}>{data?.priceUsd ? formatDecimal(data?.priceUsd, 3) : ''}</div>
            },
            sorter: {
                compare: (a, b) => {
                    return Number(JSON.parse(a?.apiData).priceUsd) - Number(JSON.parse(b?.apiData).priceUsd)
                }
            },
        },
        {
            title: packageHtml(featured.createTime), align: 'center', render: (text, record) => {
                const item = JSON.parse(record?.apiData)
                const data = item.pairCreatedAt.toString().length > 10 ? Number(item.pairCreatedAt.toString().slice(0, 10)) : item.pairCreatedAt
                return <p
                    className={changeAllTheme('darknessFont', 'brightFont')}>{item?.pairCreatedAt ? getRelativeTimeDifference(formatDateTime(data)) : ''}</p>
            },
            sorter: {
                compare: (a, b) => {
                    const item = JSON.parse(a?.apiData)
                    const items = JSON.parse(b?.apiData)
                    const data = item.pairCreatedAt ? dayjs(item.pairCreatedAt).format('YYYY-MM-DD HH:mm:ss') : 0
                    const pa = items.pairCreatedAt ? dayjs(items.pairCreatedAt).format('YYYY-MM-DD HH:mm:ss') : 0
                    return dayjs(pa).isBefore(data)
                }
            },
        },
        {
            title: packageHtml('% ' + time), align: 'center', render: (text, record) => {
                const item = JSON.parse(record?.apiData)
                return <p
                    style={{color: item?.priceChange[time] > 0 ? 'green' : 'red'}}>{item?.priceChange[time] ? item.priceChange[time] : 0}</p>
            }
        },
        {
            title: packageHtml(featured.txns), align: 'center', render: (text, record) => {
                const item = JSON.parse(record?.apiData)
                return <p
                    className={changeAllTheme('darknessFont', 'brightFont')}>{item?.txns[time]?.buys + item?.txns[time]?.sells ? autoConvert(item?.txns[time]?.buys + item?.txns[time]?.sells) : 0}</p>
            }
        },
        {
            title: packageHtml(featured.volume), align: 'center', render: (text, record) => {
                const item = JSON.parse(record?.apiData)
                return <p
                    className={changeAllTheme('darknessFont', 'brightFont')}>{item?.volume[time] ? autoConvert(item?.volume[time]) : 0}</p>
            }
        },
        {
            title: packageHtml(featured.liquidity), align: 'center', render: (text, record) => {
                const item = JSON.parse(record?.apiData)
                return <p
                    className={changeAllTheme('darknessFont', 'brightFont')}> {item?.liquidity?.usd ? autoConvert(item.liquidity.usd) : ''}</p>
            }
        },
        {
            title: packageHtml(featured.dex), align: 'center', render: (text, record) => {
                return <Image src="/dex-uniswap.png" alt="" width={30} height={30} style={{
                    borderRadius: '50%',
                    display: 'block',
                    margin: '0 auto',
                    height: 'auto',
                    width: 'auto'
                }}/>
            }
        },
    ]
    const getParams = async (url, params) => {
        const res = await request('get', url, {params})
        if (res && res.status === 200) {
            const {data} = res
            setFeaturedBol(false)
            setTableParams(data && data.featureds && data.featureds.length > 0 ? data.featureds : [])
            setFeaturedAll(0)
        }else {
            setFeaturedBol(false)
            setTableParams([])
            setFeaturedAll(0)
        }
    }
    useEffect(() => {
        getParams('/api/v1/feature', {
            pageIndex: featuredCurrent,
            pageSize: featuredPageSize
        })
        ref.current = setInterval(() => getParams('/api/v1/feature', {
            pageIndex: featuredCurrent,
            pageSize: featuredPageSize
        }), 5000)
        return () => {
            clearInterval(ref.current)
        }
    }, [featuredPageSize, featuredCurrent]);
    const changePag = (e, a) => {
        setFeaturedBol(true)
        setFeaturedCurrent(e)
        setFeaturedPageSize(a)
    }

    return (
        <div className={`${styled.featuredBox} ${styled.mobliceFeaturedBox}`}>
            <Card className={`${styled.featuredBoxCard} ${changeAllTheme('darknessTwo', 'brightTwo')}`}>
                <div className={styled.featuredBoxTop}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Image src="/wallet.png" alt="" width={70} height={70}/>
                        <span style={{fontWeight: 'bold', fontSize: '26px'}}
                              className={changeAllTheme('darknessFont', 'brightFont')}>{featured.featured}</span>
                    </div>
                    <Segmented options={['5m', '1h', '6h', '24h']} onChange={changSeg} defaultValue={'24h'}
                               className={`${changeAllTheme('darkMode', 'whiteMode')}`}/>
                </div>
                <Table className={`anyTable ${changeAllTheme('hotTableD', 'hotTable')}`} columns={columns}
                       scroll={{x: 'max-content'}}
                       rowKey={(record) => record?.id}
                       onRow={(record) => {
                           return {
                               onClick: (event) => {
                                   const data = record.pair
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

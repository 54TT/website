import React, {useEffect, useState, useRef} from "react";
import styles from "../styles/home.module.css";
import axios from 'axios';
import {formatDecimal, sendGetRequestWithSensitiveData, getRelativeTimeDifference, formatDateTime} from './Utils';
import {useRouter} from 'next/router';
import {get, post, del} from '/utils/axios'
import {
    Tooltip,
    Table,
    Card,
    Pagination,
    notification,
    Divider,
    Segmented,
    Form,
    Radio,
    Skeleton,
    Space,
    Switch,
    Drawer
} from 'antd'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)
import {useQuery, ApolloClient, InMemoryCache} from '@apollo/client';
import {gql} from 'graphql-tag';
import {
    HeartFilled,
    HeartOutlined,
    RetweetOutlined,
    MessageOutlined,
    TwitterOutlined,
    SendOutlined,
    ShareAltOutlined,
    GlobalOutlined
} from '@ant-design/icons'
import Bott from "./Bottom";

const client = new ApolloClient({
    uri: 'http://192.168.232.18:8000/subgraphs/name/levi/uniswapv2', cache: new InMemoryCache(),
});

export default function Home() {
    const router = useRouter();
    const ref = useRef(null)
    const GET_DATA = gql`
query NewPair {
  pairs(orderBy: createdAtTimestamp, orderDirection: desc, first: 10) {
    reserveETH
    createdAtTimestamp
    txCount
    token1 {
      id
      name
      symbol
    }
    token0 {
      id
      symbol
      name
    }
  }
}
`;
    const hint = () => {
        notification.error({
            message: `Please note`, description: 'Error reported', placement: 'topLeft',
            duration: 2
        });
    }
    const autoConvert = (number) => {
        if (Math.abs(number) >= 1000000) {
            return `${(number / 1000000).toFixed(2).replace(/\.?0*$/, '')}M`;
        } else if (Math.abs(number) >= 1000) {
            return `${(number / 1000).toFixed(2).replace(/\.?0*$/, '')}K`;
        } else {
            return number.toFixed(2).replace(/\.?0*$/, '');
        }
    };
    const [loadingBool, setLoadingBool] = useState(true);
    const [newPair, setNewPair] = useState([])
    const [loveChanges, setLoveChange] = useState(false);
    const [launch, setLaunch] = useState([]);
    const [launchBol, setLaunchBol] = useState(false);
    const da = "2023-11-30T09:16:29.000Z"
    const dd = "2023-12-09T09:16:24.000Z"
    const [featuredBol, setFeaturedBol] = useState(false);
    const [featured, setFeatured] = useState([]);
    const {loading, error, data} = useQuery(GET_DATA, {client});
    useEffect(() => {
        if (!loading) {
            if (data && data?.pairs.length > 0) {
                setNewPair(data?.pairs)
                setLoadingBool(false)
            } else {
                setNewPair([])
                setLoadingBool(false)
            }
        } else {
            setLoadingBool(false)
            setNewPair([])
        }
    }, [data, loading])
    const getParams = (url, params, name) => {
        get(url, params).then(async (res) => {
            if (res.status === 200) {
                let data = res.data
                if (name === 'featured') {
                    if (data && data.data.length > 0) {
                        const pairArray = data.data.map(item => item.pairAddress).join(",");
                        const pairInfosResponse = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/ethereum/${pairArray}`);
                        if (pairInfosResponse.status === 200) {
                            setFeaturedBol(true)
                            setFeatured(pairInfosResponse.data?.pairs.length > 0 ? pairInfosResponse.data?.pairs : [])
                        } else {
                            setFeaturedBol(false)
                            setFeatured([])
                        }
                    } else {
                        setFeaturedBol(false)
                        setFeatured([])
                    }
                } else if (name === 'launch') {
                    setLaunchBol(true)
                    const {data: {data}} = res
                    setLaunch(data && data.length > 0 ? data : [])
                }
            }
        }).catch(err => {
            hint()
        })
    }
    const [time, setTime] = useState('h24')
    const columns = [{
        title: '', align: 'center', render: (text, record) => {
            return <p style={{
                width: '30px',
                backgroundColor: 'black',
                color: 'white',
                lineHeight: '30px',
                textAlign: 'center',
                borderRadius: '50%', margin: '0 auto'
            }}>{record?.baseToken?.symbol?.slice(0, 1)}</p>
        }
    }, {
        title: 'PAIR', align: 'center', render: (text, record) => {
            return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <span>{record.baseToken?.symbol}/{record.quoteToken?.symbol}</span>
            </div>
        }
    },
        {
            title: 'PRICE', align: 'center', render: (text, record) => {
                return <div>{record?.priceUsd ? formatDecimal(record?.priceUsd, 3) : ''}</div>
            }
        },
        {
            title: 'Create Time', align: 'center', render: (text, record) => {
                const data = record.pairCreatedAt.toString().length > 10 ? Number(record.pairCreatedAt.toString().slice(0, 10)) : record.pairCreatedAt
                return <p>{record?.pairCreatedAt ? getRelativeTimeDifference(formatDateTime(data)) : ''}</p>
            }
        },
        {
            title: <span>{'% ' + time}</span>, align: 'center', render: (text, record) => {
                return <p
                    style={{color: record?.priceChange[time] > 0 ? 'green' : 'red'}}>{record?.priceChange[time] ? record.priceChange[time] : 0}</p>
            }
        },
        {
            title: 'TXNS', align: 'center', render: (text, record) => {
                return <p>{(record?.txns[time]?.buys + record?.txns[time]?.sells) ? autoConvert(record?.txns[time]?.buys + record?.txns[time]?.sells) : 0}</p>
            }
        },
        {
            title: 'VOLUME', align: 'center', render: (text, record) => {
                return <p>{record?.volume[time] ? autoConvert(record?.volume[time]) : 0}</p>
            }
        },
        {
            title: 'LIQUIDITY', align: 'center', render: (text, record) => {
                return <p> {record?.liquidity?.usd ? autoConvert(record.liquidity.usd) : ''}</p>
            }
        },
    ]
    useEffect(() => {
        getParams('/queryFeatured', {
            pageIndex: 0,
            pageSize: 10
        }, 'featured')
        getParams('/queryPresaleAndLaunch', {
            pageIndex: 0,
            pageSize: 10
        }, 'launch')
    }, []);
    useEffect(() => {
        ref.current = setInterval(() => getParams('/queryFeatured', '', 'featured'), 8000)
        return () => {
            clearInterval(ref.current)
        }
    }, [featured]);
    const loveChange = () => {
        setLoveChange(!loveChanges)
    }
    const push = (i, name) => {
        switch (name) {
            case 'one':
                if (i.website.includes('http')) {
                    window.open(i.website)
                } else {
                    window.open('https://' + i.website)
                }
                break
            case 'two':
                window.open(i.twitter)
                break;
            case 'three':
                window.open(i.telegram)
                break;
        }
    }
    const pushRouter = (name) => {
        if (name === 'live') {
            router.push('/newPair')
        } else if (name === 'swap') {
            router.push('/featured')
        } else {
            router.push('/presale')
        }
    }
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

    return (<div className={styles['box']}>
        <div className={styles['boxPar']}>
            {/*左边*/}
            <div className={styles['left']}>
                {/*上面*/}
                <div style={{display: 'flex', justifyContent: 'space-between',}}>
                    {/*左边*/}
                    <div style={{width: '46%', position: 'relative'}} className={'cardParams'}>
                        <Card style={{
                            minWidth: 300,
                            backgroundColor: 'rgb(253, 213, 62)',
                            width: '100%',
                            border: 'none'
                        }}>
                            <ul className={styles['ul']}>
                                <li>
                                    <p style={{fontSize: '20px', fontWeight: 'bold'}}>New Pair</p>
                                    <p style={{fontSize: '20px', color: '#2394D4', cursor: 'pointer'}}
                                       onClick={() => pushRouter('live')}>more></p>
                                </li>
                                {featuredBol ? newPair.length > 0 ? newPair.map((i, v) => {
                                    if (v > 4) {
                                        return ''
                                    } else {
                                        return <li key={v}>
                                            <span style={{width: '3%'}}>{v + 1}</span>
                                            <div style={{
                                                display: 'flex', alignItems: 'center', width: '50%', overflow: 'hidden'
                                            }}>
                                                <p style={{
                                                    width: '30px',
                                                    borderRadius: '50%',
                                                    backgroundColor: 'black',
                                                    textAlign: 'center',
                                                    color: 'white',
                                                    lineHeight: '30px'
                                                }}>{i.token0?.symbol?.slice(0, 1)}</p>
                                                <div style={{width: '81%'}}>
                                                    <div style={{
                                                        width: '100%', display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <span>{i.token0?.symbol ? i.token0?.symbol + '/' : ''}</span>
                                                        <span
                                                            style={{color: 'rgb(98,98,98)'}}>{i.token1?.symbol ? i.token1?.symbol : ''}</span>
                                                    </div>

                                                </div>
                                            </div>
                                            {/*时间*/}
                                            <div style={{width: '35%'}}>
                                                <p style={{textAlign: 'center', lineHeight: '1.3'}}>$0</p>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <img src={` /Group.png`} width={'22%'} alt=""/>
                                                    <span>{i.createdAtTimestamp ? getRelativeTimeDifference(formatDateTime(i.createdAtTimestamp)) : ''}</span>
                                                </div>
                                            </div>
                                        </li>
                                    }
                                }) : [] : [1, 2, 3, 4, 5].map((i, index) => {
                                    return <li key={index}>
                                        <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                                            <Skeleton.Avatar active={true} size={'default'} shape={'circle'}
                                                             style={{marginRight: '15px'}}/>
                                            <Skeleton.Input active={true} size={'default'} block={true}/>
                                        </div>
                                    </li>
                                })}
                            </ul>
                        </Card>
                    </div>
                    {/*右边*/}
                    <div style={{width: '46%',backgroundColor:'rgb(253,213,62)'}} className={'cardParams'}>
                        <Card style={{
                            minWidth: 300,
                            backgroundColor: 'rgb(253, 213, 62)',
                            width: '100%',
                            border: 'none'
                        }}>
                            <ul className={styles['rightUl']}>
                                <li>
                                    <p style={{fontSize: '20px', fontWeight: 'bold'}}>Launch and Presale</p>
                                    <p style={{fontSize: '20px', color: '#2394D4', cursor: 'pointer'}}
                                       onClick={() => pushRouter('coming')}>more></p>
                                </li>
                                {
                                    launchBol ? launch.length > 0 ? launch.map((i, index) => {
                                        if (index > 2) {
                                            return ''
                                        } else {
                                            // var second = dayjs(i.presale_time).isAfter(dayjs())?dayjs(i.presale_time).diff(dayjs(), 'seconds'):''
                                            // setDiffTime(second)
                                            return <li
                                                className={`${styles.li} ${dayjs(i.presale_time).isAfter(dayjs()) ? styles.be : styles.de}`}
                                                style={dayjs(i.presale_time).isAfter(dayjs()) ? {backgroundColor: ' rgb(188, 238, 125)'} : !dayjs(i.launch_time).isAfter(dayjs()) ? {backgroundColor: 'rgb(209,209,209)'} : {}}
                                                key={index}>
                                                <p style={{
                                                    textAlign: 'center',
                                                    width: '40px',
                                                    lineHeight: '40px',
                                                    borderRadius: '50%',
                                                    fontSize: '18px',
                                                    backgroundColor: 'black',
                                                    color: 'white'
                                                }}>{i.symbol.slice(0, 1)}</p>
                                                <div style={{width: '30%'}}>
                                                    <Tooltip title={i.symbol}>
                                                        <p style={{
                                                            textAlign: 'center',
                                                            fontSize: '24px',
                                                            overflow: 'hidden',
                                                            lineHeight: '1.3',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            fontWeight: 'bold'
                                                        }}>{i.symbol}</p>
                                                    </Tooltip>
                                                    <div className={styles['dis']} style={{
                                                        padding: '3px'
                                                    }}>
                                                        {/*<img src={` /Website.png`} alt={`${i.website}`}*/}
                                                        {/*     width={'25%'}/>*/}
                                                        <GlobalOutlined style={{cursor: 'pointer', fontSize: '20px'}}
                                                                        onClick={() => push(i, 'one')}/>
                                                        <TwitterOutlined style={{cursor: 'pointer', fontSize: '20px'}}
                                                                         onClick={() => push(i, 'two')}/>
                                                        <SendOutlined style={{cursor: 'pointer', fontSize: '20px'}}
                                                                      onClick={() => push(i, 'three')}/>
                                                    </div>
                                                </div>
                                                <div>
                                                    {
                                                        dayjs(i.presale_time).isAfter(dayjs()) ? <div>
                                                            <p style={{
                                                                lineHeight: 1,
                                                                letterSpacing: '1px',
                                                                textAlign: 'center'
                                                            }}>Pre-sale ends</p>
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                lineHeight: 1
                                                            }}>
                                                                <img src={`/Time.png`} alt="" width={'22px'}/>
                                                                <span
                                                                    style={{
                                                                        letterSpacing: '2px',
                                                                        fontSize: '18px'
                                                                    }}>{i.presale_time ? dao(dayjs(i.presale_time).isAfter(dayjs()) ? dayjs(i.presale_time).diff(dayjs(), 'seconds') : '') : ''}</span>
                                                            </div>
                                                        </div> : ''
                                                    }
                                                    {/*时间*/}
                                                    <p style={{
                                                        lineHeight: 1,
                                                        letterSpacing: '1px',
                                                        textAlign: 'center'
                                                    }}>launch time</p>
                                                    <div style={{display: 'flex', alignItems: 'center', lineHeight: 1}}>
                                                        <img src={` /Time.png`} alt="" width={'22px'}/>
                                                        <span
                                                            style={{
                                                                letterSpacing: '2px',
                                                                fontSize: '18px'
                                                            }}>{i?.launch_time ? dao(dayjs(i.launch_time).isAfter(dayjs()) ? dayjs(i.launch_time).diff(dayjs(), 'seconds') : '') : ''}</span>
                                                    </div>
                                                </div>
                                            </li>
                                        }
                                    }) : [] : [1, 2, 3,].map((i, index) => {
                                        return <li key={index}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                width: '100%',
                                                lineHeight: '50px'
                                            }}>
                                                <Skeleton.Avatar active={true} size={'default'} shape={'circle'}
                                                                 style={{marginRight: '15px'}}/>
                                                <Skeleton.Input active={true} size={'default'} block={true}/>
                                            </div>
                                        </li>
                                    })
                                }
                                {}
                            </ul>
                        </Card>
                    </div>
                </div>
                {/*下面*/}
                <div className={'homeTable'}>
                    <div className={styles['dis']} style={{width: '100%', marginBottom: '10px', padding: '0 24px'}}>
                        <p style={{fontSize: '20px', fontWeight: 'bold'}}>Featured</p>
                        {/*style={{width: '37%'}}*/}
                        <div className={styles['dis']}>
                            {/*时间选择*/}
                            <Segmented options={['5m', '1h', '6h', '24h']} onChange={changSeg} defaultValue={'24h'}/>
                            <p style={{color: '#2394D4', cursor: 'pointer', fontSize: '20px', marginLeft: '10px'}}
                               onClick={() => pushRouter('swap')}>more></p>
                        </div>
                    </div>
                    {/*表格*/}
                    <Table columns={columns}
                           rowKey={(record) => record?.baseToken?.address + record?.quoteToken?.address}
                           loading={loadingBool}
                           className={'tablesss'} onRow={(record) => {
                        return {
                            onClick: (event) => {
                                const data = record.pairAddress
                                router.push(`/details?pairAddress=${data}`,)
                            },
                        };
                    }}
                           dataSource={featured.length > 5 ? featured.slice(0, 5) : featured}
                           pagination={false} bordered={false}/>
                    <div style={{
                        display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', marginTop: '10px'
                    }}>
                    </div>
                </div>
            </div>
            {/*右边*/}
            <div style={{width: '34%', backgroundColor: '#BCEE7D', borderRadius: '12px', padding: '10px 8px'}}>
                {/*<div style={{*/}
                {/*    backgroundColor: 'rgb(248,229,161)', padding: '16px', borderRadius: '12px', marginTop: '13px'*/}
                {/*}}>*/}
                <ul>
                    <li style={{backgroundColor: 'white', padding: '20px', margin: '20px', borderRadius: '12px'}}>
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '38%'
                        }}>
                            <img src={` /Ellipse.png`} alt="" width={'35px'}/>
                            <div style={{width: '65%'}}>
                                <div style={{
                                    display: 'flex',
                                    lineHeight: '1',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}><span>name</span>
                                    <span style={{color: '#F8E5A1', fontSize: '14px'}}>时间</span></div>
                                <div style={{
                                    display: 'flex',
                                    lineHeight: '1',
                                    marginTop: '3px',
                                    color: '#666666',
                                    alignItems: 'center',
                                }}>name to<span style={{color: '#2294D4', marginLeft: '5px'}}> 时间</span>
                                    {/*<span style={{color: '#F8E5A1', fontSize: '14px'}}></span>*/}
                                </div>
                            </div>
                        </div>
                        <p style={{fontSize: '14px', margin: '10px 0 7px 0'}}>发的文案啦</p>
                        <img src={` /Rectangle.png`} alt="" width={'100%'}/>
                        <ul style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0 5px'
                        }}>
                            <li style={{color: 'rgb(83,100 ,113)'}}>
                                {/*  信息*/}
                                <MessageOutlined style={{cursor: 'pointer'}}/>
                                <span style={{marginLeft: '10px'}}>21</span>
                            </li>
                            <li>
                                {/*旋转*/}
                                <RetweetOutlined style={{cursor: 'pointer'}}/>
                                <span style={{marginLeft: '10px'}}>21</span>
                            </li>
                            <li>
                                {/*爱心*/}
                                {!loveChanges ?
                                    <HeartOutlined style={{cursor: 'pointer'}} onClick={loveChange}/> :
                                    <HeartFilled style={{cursor: 'pointer', color: 'red'}}
                                                 onClick={loveChange}/>}
                                <span style={{marginLeft: '10px'}}>21</span>
                            </li>
                            <li>
                                {/*  分享*/}
                                <ShareAltOutlined style={{cursor: 'pointer'}}/>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
        <Bott/>
    </div>);
}

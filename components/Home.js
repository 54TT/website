import React, {useEffect, useState, useRef} from "react";
import styles from "../styles/home.module.css";
import axios from 'axios';
import  baseUrl from '/utils/baseUrl'
import Link from "next/link";
import Image from 'next/image';
import {formatDecimal, sendGetRequestWithSensitiveData, getRelativeTimeDifference, formatDateTime} from './Utils';
// import {useAccount, chain} from "wagmi";
import {presalePlatforms, presalePlatformMatchLogos, launchPlatformMatchLogos} from "./Constant"
import getConfig from "next/config";
import {useRouter} from 'next/router';
import {get, post, del} from '/utils/axios'
import {Tooltip, Table,Card, Pagination, notification, Divider, Form, Radio, Skeleton, Space, Switch, Drawer} from 'antd'
import moment from 'moment'
import {useQuery, ApolloClient, InMemoryCache} from '@apollo/client';
import {gql} from 'graphql-tag';
import {HeartFilled, HeartOutlined, RetweetOutlined, MessageOutlined, ShareAltOutlined} from '@ant-design/icons'

const client = new ApolloClient({
    uri: 'http://192.168.8.39:8000/subgraphs/name/levi/uniswapv2', cache: new InMemoryCache(),
});
import backImg from '/public/img/background.png'

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
    const {publicRuntimeConfig} = getConfig();
    const assetPrefix = publicRuntimeConfig.assetPrefix || '';
    const [pairs, setPairs] = useState([]);
    const [featuredPairs, setFeaturedPairs] = useState([]);
    const backImgs = backImg
    const [timeFilter, setTimeFilter] = useState("24h");
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(30);
    const [pairCount, setPairCount] = useState(0);
    const [chainId, setChainId] = useState("ethereum");
    const [hotPairs, setHotPairs] = useState([]);
    const [launchs, setLaunchs] = useState([]);
    const [presales, setPresales] = useState([])
    const [api, contextHolder] = notification.useNotification();
    const hint = () => {
        notification.error({
            message: `Please note`, description: 'Error reported', placement: 'topLeft',
        });
    }
    const fetchData = async (chainIdParam, timeFilterParam, pageIndex, pageSize) => {
        try {
            const headers = {
                'x-api-key': '922e0369e89a40d9be91d68fde539325', // 替换为你的授权令牌
                'Content-Type': 'application/json', // 根据需要添加其他标头
            };

            let pairCount = await axios.get( baseUrl+'/queryAllPairCount', {
                headers: headers, params: {}
            });
            setPairCount(pairCount.data[0].count);

            let data = await axios.get( baseUrl+'/queryAllPair', {
                headers: headers, params: {
                    pageIndex: pageIndex, pageSize: pageSize
                }
            });
            data = data.data

            const pairArray = data.map(item => item.address).join(",");
            const pairInfosResponse = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/${chainIdParam}/${pairArray}`);
            const pairInfos = pairInfosResponse.data.pairs;
            let newPairInfos = pairInfos.map(async (pairInfo) => {
                const baseTokenInfo = await axios.get( baseUrl+'/queryTokenByAddress', {
                    headers: headers, params: {
                        address: pairInfo.baseToken.address
                    }
                });
                const timeFrame = timeFilterParam.toLowerCase();
                const txnsFilter = timeFrame === "24h" ? "h24" : timeFrame === "6h" ? "h6" : timeFrame === "1h" ? "h1" : timeFrame === "5m" ? "m5" : "h24"
                const newPairInfo = {
                    pairAddress: pairInfo.pairAddress,
                    baseToken: pairInfo.baseToken,
                    priceUsd: pairInfo?.priceUsd ? formatDecimal(pairInfo.priceUsd, 5) : null,
                    quoteToken: pairInfo.quoteToken,
                    liquidity: pairInfo.liquidity,
                    dexId: pairInfo.dexId,
                    url: pairInfo.url,
                    baseTokenInfo: baseTokenInfo.data[0],
                    priceChange: pairInfo.priceChange[txnsFilter],
                    volume: pairInfo.volume[txnsFilter],
                    txns: {
                        buys: pairInfo.txns[txnsFilter].buys, sells: pairInfo.txns[txnsFilter].sells,
                    }
                };
                return newPairInfo;
            });

            Promise.all(newPairInfos)
                .then((resolvedPairs) => {
                    setPairs(resolvedPairs);
                    setHotPairs(resolvedPairs.slice(0, 5))
                })
                .catch((error) => {
                    hint()
                });
            setTimeFilter(timeFilterParam);
            // setPairs(newPairInfos);
        } catch (error) {
            hint()
        }
    };
    const fetchFeaturedPairsData = async (chainIdParam, timeFilterParam) => {
        try {
            const headers = {
                'Content-Type': 'application/json',
            };

            let data = await axios.get( baseUrl+'/queryAllFeatured', {
                headers: headers, params: {}
            });
            data = data.data
            const pairArray = data.map(item => item.pairAddress).join(",");
            const pairInfosResponse = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/${chainIdParam}/${pairArray}`);
            const pairInfos = pairInfosResponse.data.pairs;
            let newPairInfos = pairInfos.map(async (pairInfo) => {
                const baseTokenInfo = await axios.get( baseUrl+'/queryTokenByAddress', {
                    headers: headers, params: {
                        address: pairInfo.baseToken.address
                    }
                });
                const timeFrame = timeFilterParam.toLowerCase();
                const txnsFilter = timeFrame === "24h" ? "h24" : timeFrame === "6h" ? "h6" : timeFrame === "1h" ? "h1" : timeFrame === "5m" ? "m5" : "h24"
                const newPairInfo = {
                    pairAddress: pairInfo.pairAddress,
                    baseToken: pairInfo.baseToken,
                    priceUsd: pairInfo.priceUsd ? formatDecimal(pairInfo.priceUsd, 5) : null,
                    quoteToken: pairInfo.quoteToken,
                    liquidity: pairInfo.liquidity,
                    dexId: pairInfo.dexId,
                    url: pairInfo.url,
                    baseTokenInfo: baseTokenInfo.data[0],
                    priceChange: pairInfo.priceChange[txnsFilter],
                    volume: pairInfo.volume[txnsFilter],
                    txns: {
                        buys: pairInfo.txns[txnsFilter].buys, sells: pairInfo.txns[txnsFilter].sells,
                    }
                };
                return newPairInfo;
            });

            Promise.all(newPairInfos)
                .then((resolvedPairs) => {
                    setFeaturedPairs(resolvedPairs);
                })
                .catch((error) => {
                    hint()
                });
        } catch (error) {
            hint()
        }
    };
    const autoConvert = (number) => {
        if (Math.abs(number) >= 1000000) {
            return `${(number / 1000000).toFixed(2).replace(/\.?0*$/, '')}M`;
        } else if (Math.abs(number) >= 1000) {
            return `${(number / 1000).toFixed(2).replace(/\.?0*$/, '')}K`;
        } else {
            return number.toFixed(2).replace(/\.?0*$/, '');
        }
    };

    const fetchLaunchsData = async () => {
        try {
            const headers = {
                'x-api-key': '922e0369e89a40d9be91d68fde539325', // 替换为你的授权令牌
                'Content-Type': 'application/json', // 根据需要添加其他标头
            };
            let launchsData = await axios.get( baseUrl+'/queryAllLaunch', {
                headers: headers, params: {
                    pageIndex: 0, pageSize: 5
                }
            });
            setLaunchs(launchsData.data);
        } catch (error) {
            hint()
        }
    };

    const fetchPresalesData = async () => {
        try {
            const headers = {
                'x-api-key': '922e0369e89a40d9be91d68fde539325', // 替换为你的授权令牌
                'Content-Type': 'application/json', // 根据需要添加其他标头
            };

            let presalesData = await axios.get( baseUrl+'/queryAllPresale', {
                headers: headers, params: {
                    pageIndex: 0, pageSize: 3
                }
            });
            setPresales(presalesData.data);
        } catch (error) {
            hint()
        }
    };

    // useEffect(() => {
    //     let chainName = "ethereum";
    // if (chain) {
    //     chainName = chain.name;
    //     chainName = chainName.toLocaleLowerCase();
    //     setChainId(chainName);
    // }
    // fetchData(chainName, timeFilter, currentPage, rowsPerPage);

    // const timer = setInterval(() => {
    //     fetchData(chainName, timeFilter, currentPage, rowsPerPage);
    // }, 5000);

    // return () => {
    //     clearInterval(timer);
    // };
    // }, [chain, timeFilter, currentPage, rowsPerPage]);

    // useEffect(() => {
    //   fetchLaunchsData();
    //   fetchPresalesData();
    //   fetchFeaturedPairsData('ethereum', '24h');
    // }, []);
    const [alignment, setAlignment] = useState('left');
    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    const handleAlignment = (event, newAlignment) => {
        setAlignment(newAlignment);
    };
    const [page, setPage] = useState(0);
    const [loadingBool, setLoadingBool] = useState(true);
    const [tableParams, setTableParams] = useState([]);
    const [tableSize, setTableSize] = useState(10);
    const [tableCurrent, setTableCurrent] = useState(1);
    const [tableTotal, setTableTotal] = useState(100);
    const [loveChanges, setLoveChange] = useState(false);
    const [launch, setLaunch] = useState([]);
    const [launchPre, setLaunchPre] = useState([]);
    const [featuredBol, setFeaturedBol] = useState(false);
    const [featured, setFeatured] = useState([]);
    const [featuredPre, setFeaturedPre] = useState([]);
    useEffect(() => {
        if (launch && launch.length > 2) {
            const data = launch.slice(0, 3)
            setLaunchPre(data)
        } else {
            setLaunchPre(launch)
        }
        if (featured && featured.length > 4) {
            const data = featured.slice(0, 5)
            setFeaturedPre(data)
        } else {
            setFeaturedPre(featured)
        }
    }, [launch, featured])
    const [rowsPerPages, setRowsPerPages] = useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const {loading, error, data} = useQuery(GET_DATA, {client});
    useEffect(() => {
        if (!loading) {
            if (data && data?.pairs.length > 0) {
                setTableParams(data?.pairs)
                setLoadingBool(false)
            } else {
                setTableParams([])
                setLoadingBool(false)
            }
        } else {
            setLoadingBool(true)
        }
    }, [data, loading])

    const getParams = (url, params, name) => {
        get(url, params).then(async (res) => {
            if (res.status === 200) {
                let data = res.data
                if (name === 'featured') {
                    if (data) {
                        const pairArray = data.map(item => item.pairAddress).join(",");
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
                    if (data.data && data.data.length > 0) {
                        setLaunch(data.data)
                    } else {
                        setLaunch([])
                    }
                }
            }
        }).catch(err => {
            hint()
        })
    }
    const columns = [{
        title: 'Pair', render: (text, record) => {
            return <div style={{display: 'flex', alignItems: 'center'}}><p style={{
                width: '30px',
                lineHeight: '30px',
                borderRadius: '50%',
                backgroundColor: 'black',
                color: 'white',
                textAlign: 'center'
            }}>{record.token0?.symbol.slice(0, 1)}</p><span>{record.token0?.symbol}/{record.token1?.symbol}</span>
            </div>
        }
    },
        {
            title: 'Create Time', render: (text, record) => {
                return <p style={{letterSpacing: '2px'}}>{record?.createdAtTimestamp}</p>
            }
        },
        {
            title: 'Create Time', render: (text, record) => {
                return <p style={{letterSpacing: '2px'}}>4242.4K</p>
            }
        },
        {
         width:80,   title: 'Create Time', render: (text, record) => {
                return <p style={{
                    textAlign: 'center',
                    backgroundColor: 'rgb(188,238,125)',borderRadius:'5px'
                }}>237%</p>
            }
        },
        {
            title: 'Create Time', render: (text, record) => {
                return <p style={{letterSpacing: '2px'}}>$12.44M</p>
            }
        },
        {
            title: 'TxCount', dataIndex: 'address', // sorter: {
            //     compare: (a, b) => a.chinese - b.chinese,
            // },
            render: (text, record) => {
                return <p style={{letterSpacing: '2px'}}>{record?.txCount}</p>
            }
        },
        {
            title: 'ReserveETH', // sorter: {
            //     compare: (a, b) => a.chinese - b.chinese,
            // },
            dataIndex: 'address', render: (text, record) => {
                return <p style={{letterSpacing: '2px'}}>{record?.reserveETH}</p>
            }
        }, // {
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
    ];

    // setInterval( getParams('/queryFeatured', '', 'featured'),3000);  // setInterval() 的返回值为一个线程号，这个线程号可以用在清除定时器的函数中 clearInterval(线程号)
    useEffect(() => {
        getParams('/queryFeatured', '', 'featured')
        getParams('/queryPresaleAndLaunch', '', 'launch')
    }, []);

    useEffect(() => {
        ref.current = setInterval(() => getParams('/queryFeatured', '', 'featured'), 8000)
        return () => {
            clearInterval(ref.current)
        }
    }, [featuredPre]);
    const loveChange = () => {
        setLoveChange(!loveChanges)
    }

    function getDateTime(dateTime, format = 'DD:HH:mm') {
        // YYYY-MM-DD:HH:mm:ss
        return moment(dateTime).format(format);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPages(+event.target.value);
        setPage(0);
    };
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
    const pushRouter=(name)=>{
        if(name==='live'){
            router.push('/launch')
        }else if(name==='swap'){
            router.push('/featured')
        }else { router.push('/presale')}
    }
    return (<div className={styles['box']}>
        <div className={styles['boxPar']}>
            {/*左边*/}
            <div className={styles['left']}>
                {/*上面*/}
                <div style={{display: 'flex', justifyContent: 'space-between',}}>
                    {/*左边*/}
                    <div style={{width: '46%', position: 'relative'}}  className={'cardParams'}>
                        {/*<img src={` /fire.png`}*/}
                        {/*     style={{position: 'absolute', top: '-29px', left: '-39px', width: '75px'}} alt=""/>*/}

                        <Card style={{minWidth: 300, backgroundColor: 'rgb(253, 213, 62)', width: '100%', border:'none'}}>
                            <ul className={styles['ul']}>
                                <li>
                                    <p style={{fontSize: '20px', fontWeight: 'bold'}}>LIVE NEW PAIRS</p>
                                    <p style={{fontSize: '20px', color: '#2394D4', cursor: 'pointer'}}  onClick={()=>pushRouter('live')}>more></p>
                                </li>
                                {featuredBol ? featuredPre.length > 0 ? featuredPre.map((i, v) => {
                                    return <li key={v}>
                                        <span style={{width: '3%'}}>{v + 1}</span>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', width: '40%', overflow: 'hidden'
                                        }}>
                                            <p style={{
                                                width: '30px',
                                                borderRadius: '50%',
                                                backgroundColor: 'black',
                                                textAlign: 'center',
                                                color: 'white',
                                                lineHeight: '30px'
                                            }}>{i.baseToken?.symbol.slice(0, 1)}</p>
                                            <div style={{width: '81%'}}>
                                                <div style={{
                                                    width: '100%', display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <span>{i.baseToken?.symbol ? i.baseToken?.symbol + '/' : ''}</span>
                                                    <span style={{color: 'rgb(98,98,98)'}}>{i.quoteToken?.symbol}</span>
                                                </div>
                                                <p style={{
                                                    backgroundColor: 'rgb(188,238,125)',
                                                    padding: '5px 10px',
                                                    margin: '0 auto',
                                                    width: '50%',
                                                    lineHeight: 1,
                                                    borderRadius: '6px'
                                                }}>237%</p>
                                            </div>
                                        </div>
                                        <Tooltip title={i.priceUsd}>
                                                <span
                                                    style={{width: '23%'}}>{i.priceUsd ? '$' + formatDecimal(i.priceUsd, 3) : null}</span>
                                        </Tooltip>
                                        <div style={{width: '25%'}}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <img src={` /Group.png`} width={'22%'} alt=""/>
                                                <span>3m55ss</span>
                                            </div>
                                        </div>
                                    </li>
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
                    <div style={{width: '46%',  marginTop: '4px'}}  className={'cardParams'}>
                        {/*<img src={` /Group.png`}*/}
                        {/*     style={{position: 'absolute', top: '-42px', left: '-68px', width: '75px'}} alt=""/>*/}
                        <Card  style={{minWidth: 300, backgroundColor: 'rgb(253, 213, 62)', width: '100%', border:'none'}}>
                            <ul className={styles['rightUl']}>
                                <li>
                                    <p style={{fontSize: '20px', fontWeight: 'bold'}}>COMING SOON</p>
                                    <p style={{fontSize: '20px', color: '#2394D4', cursor: 'pointer'}}  onClick={()=>pushRouter('coming')}>more></p>
                                </li>
                                {launchPre.length > 0 ? launchPre.map((i, index) => {
                                    return <li className={styles['li']} key={index}>
                                        <p style={{
                                            textAlign: 'center',
                                            width: '50px',
                                            lineHeight: '50px',
                                            borderRadius: '50%',
                                            backgroundColor: 'black',
                                            color: 'white'
                                        }}>{i.symbol.slice(0, 1)}</p>
                                        <div style={{width: '30%'}}>
                                            <Tooltip title={i.symbol}>
                                                <p style={{
                                                    textAlign: 'center',
                                                    fontSize: '24px',
                                                    overflow: 'hidden',
                                                    lineHeight:'1',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    fontWeight: 'bold',marginBottom:'10px'
                                                }}>{i.symbol}</p>
                                            </Tooltip>
                                            <div className={styles['dis']} style={{
                                                padding: '3px',
                                            }}>
                                                <img src={` /Website.png`} alt={`${i.website}`}
                                                     style={{cursor: 'pointer'}} onClick={() => push(i, 'one')}
                                                     width={'25%'}/>
                                                <img src={` /TwitterCircled.png`} alt={`${i.twitter}`}
                                                     onClick={() => push(i, 'two')} width={'25%'}
                                                     style={{cursor: 'pointer'}}/>
                                                <img src={` /Telegram.png`} alt={`${i.telegram}`}
                                                     onClick={() => push(i, 'three')} width={'25%'}
                                                     style={{cursor: 'pointer'}}/>
                                            </div>
                                        </div>
                                        {/*<div style={{width: '50%'}}>*/}
                                        {/*    <div className={styles['dis']} style={{fontSize: '28px', lineHeight: '1'}}>*/}
                                        {/*        /!*{*!/*/}
                                        {/*        /!*  getRelativeTimeDifference(formatDateTime(i.time))*!/*/}
                                        {/*        /!*}*!/*/}
                                        {/*        <span>{getDateTime(i.time).slice(0, 2)}</span>*/}
                                        {/*        <span>{getDateTime(i.time).slice(2, 3)}</span>*/}
                                        {/*        <span>{getDateTime(i.time).slice(3, 5)}</span>*/}
                                        {/*        <span>{getDateTime(i.time).slice(5, 6)}</span>*/}
                                        {/*        <span>{getDateTime(i.time).slice(6)}</span>*/}
                                        {/*    </div>*/}
                                        {/*    <div className={styles['dis']}>*/}
                                        {/*        <span style={{letterSpacing: '-1px'}}>days</span>*/}
                                        {/*        <span style={{letterSpacing: '-1px'}}>hours</span>*/}
                                        {/*        <span style={{letterSpacing: '-1px'}}>minutes</span>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                        <div>
                                            <p style={{lineHeight: 1}}>Pre-sale ends</p>
                                            <div style={{display: 'flex', alignItems: 'center', lineHeight: 1}}>
                                                <img src={` /Time.png`} alt=""/>
                                                <span style={{letterSpacing: '2px'}}>02:13:54</span>
                                            </div>
                                            <p style={{lineHeight: 1}}>launch time</p>
                                            <div style={{display: 'flex', alignItems: 'center', lineHeight: 1}}>
                                                <img src={` /Time.png`} alt="" width={'20%'}/>
                                                <span style={{letterSpacing: '2px'}}>02:13:54</span>
                                            </div>
                                        </div>
                                    </li>
                                }) : []}
                            </ul>
                        </Card>
                    </div>
                </div>
                {/*下面*/}
                <div style={{
                    width: '100%',
                    position: 'relative',
                    backgroundColor: 'rgb(253,213,62)',
                    marginTop: '35px',
                    padding: '10px 0',
                    borderRadius: '12px'
                }}>
                    {/*<img src={` /new.png`}*/}
                    {/*     style={{position: 'absolute', top: '-29px', left: '-33px', width: '67px'}} alt=""/>*/}
                    <div className={styles['dis']} style={{width: '100%', marginBottom: '10px', padding: '0 24px'}}>
                        <p style={{fontSize: '20px', fontWeight: 'bold'}}>SWAP EXPLORER</p>
                        {/*style={{width: '37%'}}*/}
                        <div className={styles['dis']}>
                            {/*s时间选择*/}
                            {/*<ToggleButtonGroup*/}
                            {/*    value={alignment}*/}
                            {/*    exclusive*/}
                            {/*    onChange={handleAlignment}*/}
                            {/*    aria-label="text alignment"*/}
                            {/*    className={styles['button']}*/}
                            {/*>*/}
                            {/*    <ToggleButton value="24h" aria-label="24h">*/}
                            {/*        <span>24h</span>*/}
                            {/*    </ToggleButton>*/}
                            {/*    <ToggleButton value="6h" aria-label="6h">*/}
                            {/*        <span>6h</span>*/}
                            {/*    </ToggleButton>*/}
                            {/*    <ToggleButton value="1h" aria-label="1h">*/}
                            {/*        <span>1h</span>*/}
                            {/*    </ToggleButton>*/}
                            {/*    <ToggleButton value="5m" aria-label="5m">*/}
                            {/*        <span>5m</span>*/}
                            {/*    </ToggleButton>*/}
                            {/*</ToggleButtonGroup>*/}
                            <p style={{color: '#2394D4', cursor: 'pointer', fontSize: '20px'}} onClick={()=>pushRouter('swap')}>more></p>
                        </div>
                    </div>
                    {/*表格*/}
                    <Table columns={columns} rowKey={(record) => record?.token0?.id} loading={loadingBool}
                           className={'tablesss'} showHeader={false}
                           dataSource={tableParams.length > 5 ? tableParams.slice(0, 5) : tableParams}
                           onChange={onChange} pagination={false}/>
                    <div style={{
                        display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', marginTop: '10px'
                    }}>
                        {/*<Pagination defaultCurrent={1} pageSize={tableSize} total={tableTotal} current={tableCurrent}/>*/}
                    </div>
                </div>
            </div>
            {/*右边*/}
            <div style={{width: '34%', position: 'relative'}}>
                {/*<img src={` /Group1.png`} alt="" width={'75px'}*/}
                {/*     style={{position: 'absolute', top: '-40px', left: '-33px'}}/>*/}
                <div style={{backgroundColor: 'rgb(251,238,181)', borderRadius: '12px', padding: '10px 8px'}}>
                    <p className={styles['dis']} style={{padding: '0 34px'}}>
                        <span style={{fontSize: '20px', fontWeight: 'bold'}}>Hotly discussed</span>
                        <span style={{fontSize: '20px', color: '#2394D4', cursor: 'pointer'}}>more></span>
                    </p>
                    <div style={{
                        backgroundColor: 'rgb(248,229,161)', padding: '16px', borderRadius: '12px', marginTop: '13px'
                    }}>
                        <ul>
                            <li style={{backgroundColor: 'white', padding: '10px', borderRadius: '12px'}}>
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
            </div>
        </div>
        <div className={styles['boxBott']}>
            <div style={{width: '20%'}}>
                <img src="/video.png" alt="" width={'50%'} style={{margin: '0 auto'}}/>
                <p style={{fontSize: '20px', fontWeight: 'bold', textAlign: 'center'}}>Instructional video</p>
            </div>
            <p style={{width: '78%', color: 'rgb(98,98,98)', fontSize: '18px', fontWeight: 'bold', lineHeight: 1,}}>All
                content provided on our website, hyperlinked websites, and applications, forums, blogs, social media
                accounts and other DEX-related platforms are intended to provide you with general information only. We
                make no guarantees of any kind regarding our content, including but not limited to the accuracy and
                timeliness of the information. Nothing we provide should be construed as financial, legal, or any other
                type of advice on which you specifically rely for any purpose. Any use or reliance you make on our
                content is entirely at your own risk. What you should do is do your own research, review and analysis
                and verify our content before relying on it. Trading is a high-risk activity that can result in
                significant losses, so you should consult your financial advisor before making any decisions. Nothing on
                our website should be considered an invitation or offer to take any action</p>
        </div>
        <div className={styles['boxLogo']}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between', width: '20%'
            }}>
                <img src="/TwitterX.png" alt="" width={'45px'}/>
                <img src="/TelegramApp.png" alt="" width={'45px'}/>
                <img src="/Discord.png" alt="" width={'45px'}/>
                <img src="/Medium.png" alt="" width={'45px'}/>
            </div>
        </div>
    </div>);
}

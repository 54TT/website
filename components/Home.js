import React, {useEffect, useState, useRef, useContext} from "react";
import styles from "../styles/home.module.css";
import axios from 'axios';
import {formatDecimal, sendGetRequestWithSensitiveData, getRelativeTimeDifference, formatDateTime} from './Utils';
import {useRouter} from 'next/router';
import {get, post, del, getUser} from '/utils/axios'
import Link from 'next/link'
import {dao, autoConvert,} from '/utils/set'
import {
    Tooltip,
    Table,
    Card,
    Segmented,
    Skeleton,
    Spin
} from 'antd'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)
import {
    TwitterOutlined,
    SendOutlined,
    GlobalOutlined
} from '@ant-design/icons'
// import Bott from "./Bottom";
import baseUrl from "../utils/baseUrl";
import _ from "lodash";
import InfiniteScroll from 'react-infinite-scroll-component';
// import PostCard from "./PostCard";
import cook from 'js-cookie'
import dynamic from "next/dynamic";
import {CountContext} from "./Layout/Layout";
const PostCard = dynamic(() => import('./PostCard'), {suspense: false})
const Bott = dynamic(() => import('./Bottom'), {suspense: false})
export default function Home() {
    const router = useRouter();
    const { bolLogin,changeBolLogin} = useContext(CountContext);
    const [cookBol, setCook] = useState(false);
    useEffect(() => {
        if (cook.get('name')) {
            setCook(true)
        } else {
            setCook(false)
        }
    }, [cook.get('name')])
    const refHeight = useRef(null)
    const getUs = async () => {
        const a =cook.get('name')
        const {data: {user}, status} = await getUser(a)
        if (user && status === 200) {
            setUserPa(user)
        } else {
            setUserPa('')
        }
    }
    useEffect(() => {
        if (cook.get('name')) {
            getUs()
        }
    }, [cook.get('name')]);
    const [userPa, setUserPa] = useState(null);
    const [launch, setLaunch] = useState([]);
    const [launchBol, setLaunchBol] = useState(false);
    const [presale, setPresale] = useState([]);
    const [presaleBol, setPresaleBol] = useState(false);
    const [featuredBol, setFeaturedBol] = useState(true);
    const [featured, setFeatured] = useState([]);
    const getParams = (url, params, name) => {
        get(url, params).then(async (res) => {
            if (res.status === 200) {
                let data = res.data
                if (name === 'featured') {
                    if (data && data.data.length > 0) {
                        const pairArray = data.data.map(item => item.pairAddress).join(",");
                        const pairInfosResponse = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/ethereum/${pairArray}`);
                        if (pairInfosResponse.status === 200) {
                            setFeaturedBol(false)
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
                } else if (name === 'presale') {
                    setPresaleBol(true)
                    const {data: {data}} = res
                    setPresale(data && data.length > 0 ? data : [])
                }
            }
        }).catch(err => {
            if (name === 'launch') {
                setLaunchBol(true)
                setLaunch([])
            }
            if (name === 'presale') {
                setPresaleBol(true)
                setPresale([])
            }
            if (name === 'featured') {
                setFeaturedBol(false)
                setFeatured([])
            }
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
                return <p> {record?.liquidity?.usd ? autoConvert(record.liquidity.usd) : 0}</p>
            }
        },
        {
            title: 'DEX', align: 'center', render: (text, record) => {
                return <img src="/dex-uniswap.png" alt="" width={'30px'} style={{borderRadius:'50%',display:'block',margin:'0 auto'}}/>
            }
        },
    ]
    useEffect(() => {
        gets()
        getParams('/queryLaunch', {
            pageIndex: 0,
            pageSize: 10
        }, 'launch')
        getParams('/queryPresale', {
            pageIndex: 0,
            pageSize: 10
        }, 'presale')

    }, []);
    const gets = () => {
        getParams('/queryFeatured', {
            pageIndex: 0,
            pageSize: 10
        }, 'featured')
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
    const [postsData, setPostsData] = useState([])
    const [postsDataAdd, setPostsDataAdd] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [postsDataBol, setPostsDataBol] = useState(false)
    const [postsDataCh, setPostsDataCh] = useState(false)
    const change = () => {
        setPostsDataCh(!postsDataCh)
    }
    useEffect(() => {
        if (postsData&&postsData.length>0) {
            if(bolLogin){
                changeBolLogin()
                setPostsDataAdd(postsData)
            }else {
                const data = postsData.concat(postsDataAdd)
                const aa = _.uniqBy(data, 'id')
                setPostsDataAdd(aa)
            }
        } else {
            if(bolLogin){
                changeBolLogin()
                setPostsDataAdd([])
            }else {
                setPostsDataAdd(postsDataAdd)
            }
        }
    }, [postsDataBol])
    const getPost = async () => {
        const res = await axios.get(`${baseUrl}/api/posts`, {
            params: {pageNumber, userId: userPa?.id},
        });
        if (res.status === 200) {
            setPostsDataBol(!postsDataBol)
            setPostsData(res.data)
        } else {
            setPostsDataBol(!postsDataBol)
            setPostsData([])
        }
    }
    const changePage = () => {
        setPageNumber(pageNumber + 1)
        change()
    }
    useEffect(() => {
        if( cook.get('name') && userPa?.id) {
            getPost()
        }
    }, [postsDataCh, userPa]);

    const pushLink = (name) => {
        if (name.includes('http') || name.includes('https')) {
            window.open(name)
        } else {
            window.open('http://' + name)
        }
    }
    const pushSocial=()=>{
        if(cook.get('name')){
            router.push('/social')
        }
    }
    return (<div className={styles['box']}>
        <div className={styles['boxPar']}>
            {/*左边*/}
            <div ref={refHeight} className={styles['left']}>
                {/*上面*/}
                <div style={{display: 'flex', justifyContent: 'space-between',}}>
                    {/*右边*/}
                    <div style={{width: '46%', backgroundColor: 'rgb(253,213,62)', padding: '0'}}
                         className={'cardParams'}>
                        <Card style={{
                            minWidth: 300,
                            backgroundColor: 'rgb(253, 213, 62)',
                            width: '100%',
                            border: 'none'
                        }}>
                            <ul className={styles['rightUl']}>
                                <li>
                                    <p style={{fontSize: '20px', fontWeight: 'bold'}}>Presale</p>
                                    <Link href={'/presale'}>
                                        <p style={{fontSize: '20px', color: '#2394D4', cursor: 'pointer'}}>more></p>
                                    </Link>
                                </li>
                                {
                                    presaleBol ? presale.length > 0 ? presale.map((i, index) => {
                                        if (index > 2) {
                                            return ''
                                        } else {
                                            return <li className={styles.li}  key={index}
                                                >
                                                    <div style={{display: 'flex', alignItems: 'center',width:'30%'}}>
                                                        <p style={{
                                                            textAlign: 'center',
                                                            width: '30px',
                                                            lineHeight: '30px',
                                                            borderRadius: '50%',
                                                            fontSize: '16px',
                                                            backgroundColor: 'black',
                                                            color: 'white',
                                                            marginRight:'10px'
                                                        }}>{i.symbol.slice(0, 1)}</p>
                                                        <div style={{width:'78%'}}>
                                                            <Tooltip title={i.symbol}>
                                                                <p style={{
                                                                    textAlign: 'center',
                                                                    fontSize: '20px',
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
                                                                <GlobalOutlined
                                                                    style={{cursor: 'pointer', fontSize: '20px'}}
                                                                    onClick={() => push(i, 'one')}/>
                                                                <TwitterOutlined
                                                                    style={{cursor: 'pointer', fontSize: '20px'}}
                                                                    onClick={() => push(i, 'two')}/>
                                                                <SendOutlined
                                                                    style={{cursor: 'pointer', fontSize: '20px'}}
                                                                    onClick={() => push(i, 'three')}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent:'start',
                                                        lineHeight: 1,width:'30%'
                                                    }}>
                                                        <span
                                                            style={{
                                                                fontSize: '22px'
                                                            }}>{dao(dayjs(i.presale_time).isAfter(dayjs()) ? dayjs(i.presale_time).diff(dayjs(), 'seconds') : '')}</span>
                                                    </div>
                                                    <img src={baseUrl + i.presale_platform_logo}
                                                         onClick={() => pushLink(i.presale_link)} alt=""
                                                         width={'30px'} style={{borderRadius:'50%',marginRight:'10px'}}/>
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
                    <div style={{width: '46%', backgroundColor: 'rgb(253,213,62)', padding: '0'}}
                         className={'cardParams'}>
                        <Card style={{
                            minWidth: 300,
                            backgroundColor: 'rgb(253, 213, 62)',
                            width: '100%',
                            border: 'none'
                        }}>
                            <ul className={styles['rightUl']}>
                                <li>
                                    <p style={{fontSize: '20px', fontWeight: 'bold'}}>Launch</p>
                                    <Link href={'/launch'}>
                                        <p style={{fontSize: '20px', color: '#2394D4', cursor: 'pointer'}}>more></p>
                                    </Link>
                                </li>
                                {
                                    launchBol ? launch.length > 0 ? launch.map((i, index) => {
                                        if (index > 2) {
                                            return ''
                                        } else {
                                            return<li className={styles.li} key={index}
                                                >
                                                    <div style={{display: 'flex', alignItems: 'center',width:'30%'}}>
                                                        <p style={{
                                                            textAlign: 'center',
                                                            width: '30px',
                                                            lineHeight: '30px',
                                                            borderRadius: '50%',
                                                            fontSize: '16px',
                                                            backgroundColor: 'black',
                                                            color: 'white',
                                                            marginRight:'10px'
                                                        }}>{i.symbol.slice(0, 1)}</p>
                                                        <div style={{width:'78%'}}>
                                                            <Tooltip title={i.symbol}>
                                                                <p style={{
                                                                    textAlign: 'center',
                                                                    fontSize: '20px',
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
                                                                <GlobalOutlined
                                                                    style={{cursor: 'pointer', fontSize: '20px'}}
                                                                    onClick={() => push(i, 'one')}/>
                                                                <TwitterOutlined
                                                                    style={{cursor: 'pointer', fontSize: '20px'}}
                                                                    onClick={() => push(i, 'two')}/>
                                                                <SendOutlined
                                                                    style={{cursor: 'pointer', fontSize: '20px'}}
                                                                    onClick={() => push(i, 'three')}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent:'start',
                                                            lineHeight: 1,width:'30%'
                                                        }}>
                                                            <span
                                                                style={{
                                                                    fontSize: '22px'
                                                                }}>{dao(dayjs(i.launch_time).isAfter(dayjs()) ? dayjs(i.launch_time).diff(dayjs(), 'seconds') : '')}</span>
                                                        </div>
                                                    <img src={baseUrl + i.launch_platform_logo}
                                                         onClick={() => pushLink(i.launch_link)} alt=""
                                                         width={'30px'}  style={{borderRadius:'50%',marginRight:'10px'}}/>
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
                            <Link href={'/featured'}>
                                <p style={{
                                    fontSize: '20px',
                                    color: '#2394D4',
                                    cursor: 'pointer',
                                    marginLeft: '30px'
                                }}>more></p>
                            </Link>
                        </div>
                    </div>
                    {/*表格*/}
                    <Table columns={columns}
                           rowKey={(record) => record?.baseToken?.address + record?.quoteToken?.address}
                           loading={featuredBol}
                           className={'tablesss anyTable'} onRow={(record) => {
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
            <div className={'cardParams'} style={{height: `${refHeight.current?.offsetHeight}px`}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <p style={{fontSize: '20px', fontWeight: 'bold'}}>Social</p>
                    <Link href={'/social'}>
                        <p onClick={pushSocial} style={{fontSize: '20px', color: '#2394D4', cursor: 'pointer'}}>more></p>
                    </Link>
                </div>
                {
                    cookBol  ? postsDataAdd?.length > 0 ? <InfiniteScroll
                            hasMore={postsDataAdd.length === 8}
                            next={changePage}
                            endMessage={
                                <p style={{textAlign: 'center'}}>
                                    <b>Yay! You have seen it all</b>
                                </p>
                            }
                            loader={<h4>Loading...</h4>}
                            dataLength={postsDataAdd.length}
                        >
                            {postsDataAdd && postsDataAdd?.length > 0 ? postsDataAdd.map((post, index) => {
                                const isLiked =
                                    post.likes && post.likes.length > 0 &&
                                    post.likes.filter((like) => like?.user?.id === userPa?.id).length > 0;
                                return <PostCard
                                    change={change}
                                    liked={isLiked}
                                    key={post.id}
                                    post={post}
                                    user={userPa}
                                />
                            }) : ''}
                        </InfiniteScroll> : <div style={{textAlign: 'center',fontSize:'20px'}}>No data yet</div> :
                        <div style={{textAlign: 'center',fontSize:'20px'}}>Please sign in</div>
                }
            </div>
        </div>
        <Bott/>
    </div>);
}

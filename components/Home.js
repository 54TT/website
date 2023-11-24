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
    Statistic, Carousel
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
import Marquee from 'react-fast-marquee'
import cook from 'js-cookie'
import dynamic from "next/dynamic";
import {CountContext} from "./Layout/Layout";
import {arrayUnique} from '/utils/set'
const {Countdown} = Statistic;
const PostCard = dynamic(() => import('./PostCard'), {suspense: false})
const Bott = dynamic(() => import('./Bottom'), {suspense: false})
export default function Home() {
    const router = useRouter();
    const {bolLogin, changeBolLogin} = useContext(CountContext);
    const [cookBol, setCook] = useState(false);
    useEffect(() => {
        if (cook.get('name')) {
            setCook(true)
            getUs()
        } else {
            setCook(false)
        }
    }, [cook.get('name')])
    const refHeight = useRef(null)
    useEffect(() => {
        if (bolLogin && cook.get('name')) {
            setUserPa(cook.get('name'))
        }
    }, [bolLogin]);
    const getUs = async () => {
        const a = cook.get('name')
        const {data: {user}, status} = await getUser(a)
        if (user && status === 200) {
            setUserPa(user)
        } else {
            setUserPa('')
        }
    }
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
                backgroundColor: '#454545',
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
                return <img src="/dex-uniswap.png" alt="" width={'30px'}
                            style={{borderRadius: '50%', display: 'block', margin: '0 auto'}}/>
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
    // useEffect(() => {
    //     refSet.current = setInterval(() => setDiffTime(diffTime - 1), 1000)
    //     return () => {
    //         clearInterval(refSet.current)
    //     }
    // }, [diffTime])
    const [postsData, setPostsData] = useState([])
    const [postsDataAdd, setPostsDataAdd] = useState([])
    const [pageNumber, setPageNumber] = useState(0)
    const [postsDataBol, setPostsDataBol] = useState(false)
    const [postsDataCh, setPostsDataCh] = useState(false)
    // 滚动
    const [scrollChange, setScrollChange] = useState(false)

    // 点赞
    const [clickChange, setClickChange] = useState(false)

    // 删除的推文id
    const [deleteChange, setDeleteChange] = useState(null)

    const change = (name, id) => {
        if (id) {
            setDeleteChange(id)
        }
        if (name === 'scroll') {
            setScrollChange(true)
        }
        if (name === 'click') {
            setClickChange(true)
        }
        setPostsDataCh(!postsDataCh)
    }
    useEffect(() => {
        if (postsData && postsData.length > 0) {
            if (bolLogin) {
                changeBolLogin()
                setPostsDataAdd(postsData)
            } else {
                if (scrollChange) {
                    const data = postsDataAdd.concat(postsData)
                    setScrollChange(false)
                    setPostsDataAdd(data)
                } else if (clickChange) {
                    setClickChange(false)
                    const data = postsDataAdd.concat(postsData)
                    const aa = arrayUnique(data, 'id')
                    if (deleteChange) {
                        const man = aa.filter((i) => {
                            return i.id !== deleteChange
                        })
                        setPostsDataAdd(man)
                        setDeleteChange(null)
                    } else {
                        setPostsDataAdd(aa)
                    }
                } else {
                    setPostsDataAdd(postsData)
                }
            }
        } else {
            if (bolLogin) {
                changeBolLogin()
                setPostsDataAdd([])
            } else {
                if (scrollChange) {
                    setScrollChange(false)
                    setPostsDataAdd([...postsDataAdd])
                } else if (clickChange) {
                    setClickChange(false)
                    if (deleteChange) {
                        const da = _.cloneDeep(postsDataAdd)
                        const b = da.filter((i) => i.id !== clickChange)
                        setPostsDataAdd(b)
                        setDeleteChange(null)
                    } else {
                        setPostsDataAdd([...postsDataAdd])
                    }
                }
                setPostsDataAdd([...postsDataAdd])
            }
        }
    }, [postsDataBol])
    const getPost = async () => {
        let a = _.cloneDeep(pageNumber)
        if (bolLogin) {
            setPageNumber(0)
            a = 0
        }
        const res = await axios.get(`${baseUrl}/api/posts`, {
            params: {pageNumber: a, userId: userPa?.id},
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
        change('scroll')
    }
    useEffect(() => {
        if (cook.get('name') && userPa?.id) {
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
    const pushSocial = () => {
        if (cook.get('name')) {
            router.push('/social')
        }
    }
    const getD = (a) => {
        if (a) {
            return Date.now() + Number(a) * 1000
        } else {
            return 0
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

                                            return <li className={styles.li} key={index}
                                            >
                                                <div style={{display: 'flex', alignItems: 'center', width: '30%'}}>
                                                    <p style={{
                                                        textAlign: 'center',
                                                        width: '30px',
                                                        lineHeight: '30px',
                                                        borderRadius: '50%',
                                                        fontSize: '16px',
                                                        backgroundColor: '#454545',
                                                        color: 'white',
                                                        marginRight: '10px'
                                                    }}>{i.symbol.slice(0, 1)}</p>
                                                    <div style={{width: '78%'}}>
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
                                                    justifyContent: 'start',
                                                    lineHeight: 1, width: '30%'
                                                }}>
                                                    <Countdown title=""
                                                               value={getD(dayjs(i.presale_time).isAfter(dayjs()) ? dayjs(i.presale_time).diff(dayjs(), 'seconds') : '')}
                                                               format="HH:mm:ss"/>
                                                </div>
                                                <img src={baseUrl + i.presale_platform_logo}
                                                     onClick={() => pushLink(i.presale_link)} alt=""
                                                     width={'30px'} style={{borderRadius: '50%', marginRight: '10px'}}/>
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
                                            return <li className={styles.li} key={index}
                                            >
                                                <div style={{display: 'flex', alignItems: 'center', width: '30%'}}>
                                                    <p style={{
                                                        textAlign: 'center',
                                                        width: '30px',
                                                        lineHeight: '30px',
                                                        borderRadius: '50%',
                                                        fontSize: '16px',
                                                        backgroundColor: '#454545',
                                                        color: 'white',
                                                        marginRight: '10px'
                                                    }}>{i.symbol.slice(0, 1)}</p>
                                                    <div style={{width: '78%'}}>
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
                                                    justifyContent: 'start',
                                                    lineHeight: 1, width: '30%'
                                                }}>
                                                    <Countdown title=""
                                                               value={getD(dayjs(i.launch_time).isAfter(dayjs()) ? dayjs(i.launch_time).diff(dayjs(), 'seconds') : '')}
                                                               format="HH:mm:ss"/>
                                                </div>
                                                <img src={baseUrl + i.launch_platform_logo}
                                                     onClick={() => pushLink(i.launch_link)} alt=""
                                                     width={'30px'} style={{borderRadius: '50%', marginRight: '10px'}}/>
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
            <div className={'cardParams'} id="scrollableDiv" style={{height: `${refHeight?.current?.offsetHeight||0}px`}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <p style={{fontSize: '20px', fontWeight: 'bold'}}>Social</p>
                    <Link href={'/social'}>
                        <p onClick={pushSocial}
                           style={{fontSize: '20px', color: '#2394D4', cursor: 'pointer'}}>more></p>
                    </Link>
                </div>
                {
                    cookBol ? postsDataAdd?.length > 0 ? <InfiniteScroll
                            hasMore={true}
                            next={changePage}
                            scrollableTarget="scrollableDiv"
                            endMessage={
                                <p style={{textAlign: 'center'}}>
                                    <b>Yay! You have seen it all</b>
                                </p>
                            }
                            loader={null}
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
                        </InfiniteScroll> : <div style={{textAlign: 'center', fontSize: '20px'}}>No data yet</div> :
                        <div style={{textAlign: 'center', fontSize: '20px'}}>Please sign in</div>
                }
            </div>
        </div>
        <Bott/>
    </div>);
}

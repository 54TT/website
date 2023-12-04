import React, {useEffect, useState, useRef, useContext} from "react";
import styles from "../public/styles/home.module.css";
import axios from 'axios';
import {formatDecimal, sendGetRequestWithSensitiveData, getRelativeTimeDifference, formatDateTime} from './Utils';
import {useRouter} from 'next/router';
import {get, post, del, getUser} from '/utils/axios'
import Link from 'next/link'
import {dao, autoConvert,} from '/utils/set'
import Image from 'next/image'
import {
    Tooltip,
    Table,
    Card,
    Segmented,
    Skeleton,
    Statistic, Carousel,
    Row, Col
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
const PostCard = dynamic(() => import('./PostCard'), {ssr: false})
const Bott = dynamic(() => import('./Bottom'), {ssr: false})
import {changeLang} from "/utils/set";
import {responseIterator} from "@apollo/client/link/http/responseIterator";

function Home() {
    const router = useRouter();
    const {bolLogin, changeShowData, showData, changeBolLogin, changeTheme} = useContext(CountContext);
    const home = changeLang('home')
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
    useEffect(() => {
        if (showData) {
            getPost()
            changeShowData()
        }
    }, [showData])
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
    const changeAllTheme = (a, b) => {
        return changeTheme ? a : b
    }
    const packageHtml = (name) => {
        return <span className={changeAllTheme('darknessFont', 'brightFont')}>{name}</span>
    }
    const params = [{
        data: presale,
        bol: presaleBol,
        name: home.presale
    }, {data: launch, bol: launchBol, name: home.launch}]
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
        title: packageHtml(home.pair),
        align: 'center',
        render: (text, record) => {
            return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {
                    packageHtml(record?.baseToken?.symbol+'/')
                }
                <span style={{color: 'rgb(156,156,156)'}}>{record?.quoteToken?.symbol}</span>
            </div>
        }
    },
        {
            title: packageHtml(home.price),
            align: 'center',
            render: (text, record) => {
                return packageHtml(record?.priceUsd ? formatDecimal(record?.priceUsd, 3) : '')
            }
        },
        {
            title: packageHtml(home.createTime),
            align: 'center',
            render: (text, record) => {
                const data = record.pairCreatedAt.toString().length > 10 ? Number(record.pairCreatedAt.toString().slice(0, 10)) : record.pairCreatedAt
                return packageHtml(record?.pairCreatedAt ? getRelativeTimeDifference(formatDateTime(data)) : '')
            }
        },
        {
            title: packageHtml('% ' + time),
            align: 'center',
            render: (text, record) => {
                return <p
                    style={{color: changeTheme ? record?.priceChange[time] > 0 ? 'rgb(97,123,64)' : 'rgb(209,68,68)' : record?.priceChange[time] > 0 ? 'green' : 'red'}}>{record?.priceChange[time] ? record.priceChange[time] : 0}</p>
            }
        },
        {
            title: packageHtml(home.txns),
            align: 'center',
            render: (text, record) => {
                return  packageHtml((record?.txns[time]?.buys + record?.txns[time]?.sells) ? autoConvert(record?.txns[time]?.buys + record?.txns[time]?.sells) : 0)
            }
        },
        {
            title:packageHtml(home.volume) ,
            align: 'center',
            render: (text, record) => {
                return  packageHtml(record?.volume[time] ? autoConvert(record?.volume[time]) : 0)
            }
        },
        {
            title: packageHtml(home.liquidity) ,
            align: 'center',
            render: (text, record) => {
                return packageHtml(record?.liquidity?.usd ? autoConvert(record.liquidity.usd) : 0)
            }
        },
        {
            title: packageHtml(home.dex),
            align: 'center',
            render: (text, record) => {
                return <Image src="/dex-uniswap.png" alt="" width={30} height={30}
                              style={{
                                  borderRadius: '50%',
                                  display: 'block',
                                  margin: '0 auto',
                                  height: 'auto',
                                  width: 'auto'
                              }}/>
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
        })
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
                <div className={styles.homeTop}>
                    {
                        params.map((item, index) => {
                            return <div key={index}
                                        className={`cardParams ${ index === 0 ? styles.homeMarginBottom : ""} ${styles.homeModule} ${!changeTheme && 'boxHover'}`}>
                                <Card className={`${styles.homeCard} ${changeAllTheme('darknessTwo', 'brightTwo')}`}>
                                    <ul className={styles['rightUl']}>
                                        <li>
                                            <p className={`${styles.homeCardName} ${changeAllTheme('darknessFont', 'brightFont')}`}>{item.name}</p>
                                            <Link href={item.name === 'presale' ? '/presale' : '/launch'}>
                                                <p className={styles.homeCardMore}>{home.more}></p>
                                            </Link>
                                        </li>
                                        {
                                            item.bol ? item?.data?.length > 0 ? item.data.map((i, index) => {
                                                if (index > 5) {
                                                    return ''
                                                } else {
                                                    return <li
                                                        className={`${styles.li} ${changeAllTheme('darknessItem', 'brightItem')}`}
                                                        key={index}>
                                                        <div className={styles.homeCardListBox}>
                                                            <p className={styles.homeCardIm}>{i.symbol.slice(0, 1)}</p>
                                                            <div style={{width: '78%'}}>
                                                                <Tooltip title={i.symbol}>
                                                                    <p className={`${styles.homeCardSymbol} ${changeAllTheme('darknessFont', 'brightFont')}`}>{i.symbol}</p>
                                                                </Tooltip>
                                                                <div className={styles['dis']} style={{
                                                                    padding: '3px'
                                                                }}>
                                                                    <img onClick={() => push(i, 'one')}
                                                                         src={changeAllTheme('/Websitee.svg', "/Websiteaa.svg")}
                                                                         alt="" width={16}/>
                                                                    <img onClick={() => push(i, 'two')}
                                                                         src={changeAllTheme('/TwitterX22.svg', "/TwitterX11.svg")}
                                                                         alt="" width={18}/>
                                                                    <img onClick={() => push(i, 'three')}
                                                                         src={changeAllTheme("/Telegramss.svg", 'Telegram11.svg')}
                                                                         alt="" width={20}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={styles.homeCardDate}>
                                                            <img
                                                                src={changeAllTheme("/icon _timer.svg", '/icon _time1.svg')}
                                                                alt="" width={15}/>
                                                            <Countdown title=""
                                                                       className={changeAllTheme('darknessFont', 'brightFont')}
                                                                       value={getD(dayjs(i.presale_time ? i.presale_time : i.launch_time).isAfter(dayjs()) ? dayjs(i.presale_time ? i.presale_time : i.launch_time).diff(dayjs(), 'seconds') : '')}
                                                                       format="HH:mm:ss"/>
                                                        </div>
                                                        <img
                                                            src={`${baseUrl}${i?.presale_platform_logo ? i.presale_platform_logo : i.launch_platform_logo}`}
                                                            onClick={() => pushLink(i?.presale_link ? i.presale_link : i.launch_link)}
                                                            alt=""
                                                            width={'30px'} height={'30px'}
                                                            className={styles.homeCardListImg}/>
                                                    </li>
                                                }
                                            }) : [] : [1, 2, 3,].map((i, index) => {
                                                return <li key={index}>
                                                    <div className={styles.homeCardModule}>
                                                        <Skeleton.Avatar active={true} size={'default'} shape={'circle'}
                                                                         style={{marginRight: '15px'}}/>
                                                        <Skeleton.Input active={true} size={'default'} block={true}/>
                                                    </div>
                                                </li>
                                            })
                                        }
                                    </ul>
                                </Card>
                            </div>
                        })
                    }
                </div>
                {/*下面*/}
                <div
                    className={`homeTable ${changeAllTheme('darknessTwo', 'brightTwo boxHover')} ${styles.homeCardBot}`}>
                    <div className={styles['dis']}>
                        <p style={{fontSize: '20px', fontWeight: 'bold'}}
                        className={changeAllTheme('darknessFont', 'brightFont')}>{home.featured}</p>
                        <div className={styles['dis']}>
                            {/*时间选择*/}
                            <Segmented options={['5m', '1h', '6h', '24h']} onChange={changSeg} defaultValue={'24h'}/>
                            <Link href={'/featured'}>
                                <p className={styles.homeFeaturedMore}>{home.more}></p>
                            </Link>
                        </div>
                    </div>
                    <div className={styles['homeTableBox']}>
                        {/*表格*/}
                        <Table columns={columns}
                            rowKey={(record) => record?.baseToken?.address + record?.quoteToken?.address}
                            loading={featuredBol}
                            className={`${changeAllTheme('darkTable', 'tablesss')}  anyTable`} onRow={(record) => {
                            return {
                                onClick: (event) => {
                                    const data = record.pairAddress
                                    router.push(`/details?pairAddress=${data}`,)
                                },
                            };
                        }}
                            dataSource={featured.length > 5 ? featured.slice(0, 5) : featured}
                            pagination={false} bordered={false}/>
                    </div>
                </div>
            </div>
            {/*右边*/}
            <div
                className={`cardParams ${changeAllTheme('socialScrollD darknessThrees', 'socialScroll brightTwo boxHover')}`}
                id="scrollableDiv"
                style={{height: `${refHeight?.current?.scrollHeight || 0}px`}}>
                <div className={styles.homeRightTop}>
                    <p className={`${styles.homeRightTopName} ${changeAllTheme('darknessFont', 'brightFont')}`}>{home.social}</p>
                    <Link href={'/social'}>
                        <p onClick={pushSocial}
                           style={{fontSize: '20px', color: '#2394D4', cursor: 'pointer'}}>{home.more}></p>
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
                        </InfiniteScroll> : <div style={{textAlign: 'center', fontSize: '20px'}}
                                                 className={changeAllTheme('darknessFont', 'brightFont')}>{home.noData}</div> :
                        <div style={{textAlign: 'center', fontSize: '20px'}}
                             className={changeAllTheme('darknessFont', 'brightFont')}>{home.sign}</div>
                }
            </div>
        </div>
        <Bott/>
    </div>);
}

export default Home
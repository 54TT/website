import React, {useEffect, useState, useRef, useContext} from "react";
import styles from "../public/styles/home.module.css";
import {formatDecimal, getRelativeTimeDifference, formatDateTime} from './Utils';
import {useRouter} from 'next/router';
import Link from 'next/link'
import {autoConvert,} from '/utils/set'
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
import _ from "lodash";
import InfiniteScroll from 'react-infinite-scroll-component';
import cook from 'js-cookie'
import dynamic from "next/dynamic";
import {CountContext} from '/components/Layout/Layout';
import {arrayUnique} from '/utils/set'
// import {ConnectKitButton, changeBack} from 'hjt-connectkit';
const {Countdown} = Statistic;
const PostCard = dynamic(() => import('./PostCard'), {ssr: false})
const Bott = dynamic(() => import('./Bottom'), {ssr: false})
import {changeLang} from "/utils/set";
import {request} from "../utils/hashUrl";
import cookie from "js-cookie";

function Home() {
    const router = useRouter();
    const {bolLogin, changeShowData, showData, changeBolLogin, changeTheme, logoutBol,setLogin} = useContext(CountContext);
    const home = changeLang('home')
    const refHeight = useRef(null)
    const getUs = async () => {
        try {
            const params = JSON.parse(cookie.get('username'))
            const token = cookie.get('token')
            const data = await request('get', "/api/v1/userinfo/" + params?.uid, '', token)
            if (data === 'please') {
                setUserPa(null)
                setLogin()
            } else if (data && data?.status === 200) {
                const user = data?.data?.data
                if (user) {
                    setUserPa(user)
                } else {
                    setUserPa(null)
                }
            } else {
                setUserPa(null)
            }
        } catch (err) {
            setUserPa(null)
            return null
        }
    }
    useEffect(() => {
        if (cook.get('username') && cook.get('username') != 'undefined' || showData) {
            getUs()
            changeShowData(false)
        }
    }, [bolLogin, showData]);
    // 退出
    useEffect(()=>{
        if(logoutBol){
            setUserPa(null)
        }
    },[logoutBol])
    const [userPa, setUserPa] = useState(null);
    const [launch, setLaunch] = useState([]);
    const [launchBol, setLaunchBol] = useState(false);
    const [presale, setPresale] = useState([]);
    const [presaleBol, setPresaleBol] = useState(false);
    const [featuredBol, setFeaturedBol] = useState(true);
    const [featured, setFeatured] = useState([]);

    //   social   高度
    const [socialHeight, setSocialHeight] = useState('');

    //   social Loading
    const [socialLoad, setSocialLoad] = useState(true);
    useEffect(() => {
        if (launchBol && presaleBol && !featuredBol) {
            const data = document.getElementById('left').offsetHeight
            setSocialHeight(data)
        }
    }, [launchBol, presaleBol, featuredBol]);


    const changeAllTheme = (a, b) => {
        return changeTheme ? a : b
    }
    const packageHtml = (name) => {
        return <span className={changeAllTheme('darknessFont', 'brightFont')}>{name}</span>
    }
    const packageEllipsisHtml = (name) => {
        return (
            <div className={styles.homeTableParentText}>
                {name?.length > 10 ? (
                        <div className={styles.homeTableParentMain}>
                            <span
                                className={`${styles.homeTablePrenSpan} ${changeAllTheme('darknessFont', 'brightFont')}`}>{name.slice(0, -6)}</span>
                            <span
                                className={`${styles.homeTableNextSpan} ${changeAllTheme('darknessFont', 'brightFont')}`}>{name.slice(-6)}</span>
                        </div>)
                    : name
                }
            </div>
        )
    }
    const params = [{
        data: presale,
        bol: presaleBol,
        name: home.presale, symbol: 'a'
    }, {data: launch, bol: launchBol, name: home.launch, symbol: 'b'}]

    const getParams = async (url, params, name) => {
        try {
            if (name === 'launch') {
                const res = await request('get', url, params)
                if (res === 'please') {
                    setLaunchBol(true)
                    setLaunch([])
                    setLogin()
                } else if (res?.data && res?.status === 200) {
                    const {data} = res
                    setLaunchBol(true)
                    setLaunch(data?.launchs?.length > 0 ? data.launchs : [])
                } else {
                    setLaunchBol(true)
                    setLaunch([])
                }
            }
            if (name === 'presale') {
                const res = await request('get', url, params)
                if (res === 'please') {
                    setLogin()
                    setPresaleBol(true)
                    setPresale([])
                } else if (res?.data && res?.status === 200) {
                    const {data} = res
                    setPresaleBol(true)
                    setPresale(data?.presales?.length > 0 ? data.presales : [])
                } else {
                    setPresaleBol(true)
                    setPresale([])
                }
            }
            if (name === 'featured') {
                const res = await request('get', url, params)
                if (res === 'please') {
                    setLogin()
                    setFeaturedBol(false)
                    setFeatured([])
                } else if (res?.data && res?.status === 200) {
                    const {data} = res
                    setFeaturedBol(false)
                    setFeatured(data?.featureds?.length > 0 ? data.featureds : [])
                } else {
                    setFeaturedBol(false)
                    setFeatured([])
                }

            }
        } catch (err) {
            setLaunchBol(true)
            setLaunch([])
            setFeaturedBol(false)
            setFeatured([])
            setPresaleBol(true)
            setPresale([])
            return null
        }
    }
    const [time, setTime] = useState('h24')
    const columns = [{
        title: '',
        align: 'center',
        fixed: 'left',
        render: (text, record) => {
            const item = JSON.parse(record?.apiData)
            return <p style={{
                width: '30px',
                backgroundColor: '#454545',
                color: 'white',
                lineHeight: '30px',
                textAlign: 'center',
                borderRadius: '50%', margin: '0 auto',
            }}>{item?.baseToken?.symbol?.slice(0, 1)}</p>
        }
    }, {
        title: packageHtml(home.pair),
        align: 'center',
        fixed: 'left',
        render: (text, record) => {
            const item = JSON.parse(record?.apiData)
            return <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column',
            }}>
                <div>{packageHtml(item?.baseToken?.symbol + '/')}
                    <span style={{color: 'rgb(156,156,156)'}}>{item?.quoteToken?.symbol}</span>
                </div>
                <div>{packageEllipsisHtml(item?.quoteToken?.address)}</div>
            </div>
        }
    },
        {
            title: packageHtml(home.price),
            align: 'center',
            render: (text, record) => {
                const item = JSON.parse(record?.apiData)
                return packageHtml(item?.priceUsd ? formatDecimal(item?.priceUsd, 3) : '')
            }
        },
        {
            title: packageHtml(home.createTime),
            align: 'center',
            render: (text, record) => {
                const item = JSON.parse(record?.apiData)
                const data = item.pairCreatedAt.toString().length > 10 ? Number(item.pairCreatedAt.toString().slice(0, 10)) : item.pairCreatedAt
                return packageHtml(item?.pairCreatedAt ? getRelativeTimeDifference(formatDateTime(data)) : '')
            }
        },
        {
            title: packageHtml('% ' + time),
            align: 'center',
            render: (text, record) => {
                const item = JSON.parse(record?.apiData)
                return <p
                    style={{color: changeTheme ? item?.priceChange[time] > 0 ? 'rgb(97,123,64)' : 'rgb(209,68,68)' : item?.priceChange[time] > 0 ? 'green' : 'red'}}>{item?.priceChange[time] ? item.priceChange[time] : 0}</p>
            }
        },
        {
            title: packageHtml(home.txns),
            align: 'center',
            render: (text, record) => {
                const item = JSON.parse(record?.apiData)
                return packageHtml((item?.txns[time]?.buys + item?.txns[time]?.sells) ? autoConvert(item?.txns[time]?.buys + item?.txns[time]?.sells) : 0)
            }
        },
        {
            title: packageHtml(home.volume),
            align: 'center',
            render: (text, record) => {
                const item = JSON.parse(record?.apiData)
                return packageHtml(item?.volume[time] ? autoConvert(item?.volume[time]) : 0)
            }
        },
        {
            title: packageHtml(home.liquidity),
            align: 'center',
            render: (text, record) => {
                const item = JSON.parse(record?.apiData)
                return packageHtml(item?.liquidity?.usd ? autoConvert(item.liquidity.usd) : 0)
            }
        },
        {
            title: packageHtml(home.dex),
            align: 'center',
            render: (text, record) => {
                return <img src="/dex-uniswap.png" alt="" width={30} height={30}
                              style={{
                                  borderRadius: '50%',
                                  display: 'block',
                                  margin: '0 auto',
                                  height: 'auto',
                                  width: 'auto',
                              }}/>
            }
        },
    ]
    useEffect(() => {
        getParams('/api/v1/launch', {
            pageIndex: 1,
            pageSize: 10
        }, 'launch')
        getParams('/api/v1/presale', {
            pageIndex: 1,
            pageSize: 10
        }, 'presale')
        getParams('/api/v1/feature', {
            pageIndex: 1,
            pageSize: 10
        }, 'featured')
        cookie.remove('list')
    }, []);
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
    const [pageNumber, setPageNumber] = useState(1)
    const [postsDataBol, setPostsDataBol] = useState(false)
    const [postsDataCh, setPostsDataCh] = useState(false)
    // 滚动
    const [scrollChange, setScrollChange] = useState(false)
    // 点赞
    const [clickChange, setClickChange] = useState(false)
    // 删除的推文id
    const [deleteChange, setDeleteChange] = useState(null)
    const change = (name, id) => {
        console.log(name,id)
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
                console.log(111111111111111)
                setPostsDataAdd(postsData)
            } else {
                if (scrollChange) {
                    const data = postsDataAdd.concat(postsData)
                    setScrollChange(false)
                    console.log(2222222222222222)
                    setPostsDataAdd(data)
                } else if (clickChange) {
                    setClickChange(false)
                    const data = postsDataAdd.concat(postsData)
                    const aa = arrayUnique(data, 'id')
                    if (deleteChange) {
                        const man = aa.filter((i) => {
                            return i.id !== deleteChange
                        })
                        console.log(333333333333333)
                        setPostsDataAdd(man)
                        setDeleteChange(null)
                    } else {
                        console.log(44444444444444444)
                        setPostsDataAdd(aa)
                    }
                } else {
                    console.log(5555555555555)
                    setPostsDataAdd(postsData)
                }
            }
        } else {
            if (bolLogin) {
                changeBolLogin()
                console.log(6666666666666666)
                setPostsDataAdd([])
            } else {
                if (scrollChange) {
                    setScrollChange(false)
                    console.log(77777777777777777777)
                    setPostsDataAdd([...postsDataAdd])
                } else if (clickChange) {
                    setClickChange(false)
                    if (deleteChange) {
                        const da = _.cloneDeep(postsDataAdd)
                        const b = da.filter((i) => i.id !== clickChange)
                        console.log(88888888888888888888)
                        setPostsDataAdd(b)
                        setDeleteChange(null)
                    } else {
                        console.log(999999999999999)
                        setPostsDataAdd([...postsDataAdd])
                    }
                }
            }
        }
    }, [postsDataBol])
    const changePost = () => {
        setPostsDataBol(!postsDataBol)
        setPostsData([])
        setSocialLoad(false)
    }
    const getPost = async () => {
        try {
            let a = _.cloneDeep(pageNumber)
            if (bolLogin) {
                setPageNumber(1)
                a = 1
            }
            const res = await request('post', '/api/v1/post/public', {page: a.toString()})
            if (res === 'please') {
                changePost()
                setLogin()
            } else if (res && res?.status === 200) {
                setPostsDataBol(!postsDataBol)
                const {data} = res
                setPostsData(data && data?.posts?.length > 0 ? data.posts : [])
                setSocialLoad(false)
            } else {
                changePost()
            }
        } catch (err) {
            changePost()
            return null
        }
    }
    const changePage = () => {
        setPageNumber(pageNumber + 1)
        change('scroll')
    }
    useEffect(() => {
        getPost()
    }, [postsDataCh]);
    const pushLink = (name) => {
        if (name) {
            if (name.includes('http') || name.includes('https')) {
                window.open(name)
            } else {
                window.open('http://' + name)
            }
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
    const pushDetail = (i, name) => {
        const data = JSON.stringify({...i, status: name === 'a' ? 'presale' : 'launch'})
        cookie.set('list', data)
        router.push('/launchPresaleDetail')
    }
    return (<div className={styles['box']}>
        <div className={styles['boxPar']}>
            {/*<ConnectKitButton />*/}
            {/*左边*/}
            <div ref={refHeight} id={'left'} className={styles['left']}>
                {/*上面*/}
                <div className={styles.homeTop}>
                    {
                        params.map((item, index) => {
                            return <div key={index}
                                        className={`cardParams ${index === 0 ? styles.homeMarginBottom : ""} ${styles.homeModule} ${!changeTheme && 'boxHover'}`}>
                                <Card className={`${styles.homeCard} ${changeAllTheme('darknessTwo', 'brightTwo')}`}>
                                    <ul className={styles['rightUl']}>
                                        <li>
                                            <p className={`${styles.homeCardName} ${changeAllTheme('darknessFont', 'brightFont')}`}>{item.name}</p>
                                            <Link href={item.symbol === 'a' ? '/presale' : '/launch'}>
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
                                                        key={index} onClick={() => pushDetail(i, item.symbol)}>
                                                        <div className={styles.homeCardListBox}>
                                                            {
                                                                i?.logo ?
                                                                    <img className={styles.homeCardIm} src={i.logo}
                                                                         alt=""/> :
                                                                    <p className={styles.homeCardIm}>{i.symbol.slice(0, 1)}</p>
                                                            }
                                                            <div style={{
                                                                width: '78%',
                                                                display: 'flex',
                                                                alignItems: 'center'
                                                            }} className={styles.homeCardFlexBox}>
                                                                <Tooltip title={i.symbol}>
                                                                    <p className={`${styles.homeCardSymbol} ${changeAllTheme('darknessFont', 'brightFont')}`}>{i.symbol}</p>
                                                                </Tooltip>
                                                                <div style={{marginTop: '0'}}
                                                                     className={`${styles['editDis']} ${styles['dis']}`}>
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
                                                        <div
                                                            className={`${styles.homeCardDate} ${styles.editHomeCardDate}`}>
                                                            <img
                                                                src={changeAllTheme("/icon _timer.svg", '/icon _time1.svg')}
                                                                alt="" width={15}/>
                                                            <Countdown title=""
                                                                       className={changeAllTheme('darknessFont', 'brightFont')}
                                                                       value={getD(dayjs.unix(i?.time).isAfter(dayjs().unix()) ? dayjs.unix(i?.time ? i.time : '').diff(dayjs(), 'seconds') : '')}
                                                                       format="HH:mm:ss"/>
                                                        </div>
                                                        <img
                                                            src={`${i?.platformLogo ? i.platformLogo : '/ma.svg'}`}
                                                            onClick={() => pushLink(i?.link ? i.link : '')}
                                                            alt=""
                                                            width={'30px'} height={'30px'}
                                                            className={styles.homeCardListImg}/>
                                                    </li>
                                                }
                                            }) : [] : [1, 2, 3, 4].map((i, index) => {
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
                            <Segmented
                                options={['5m', '1h', '6h', '24h']}
                                onChange={changSeg}
                                defaultValue={'24h'}
                                className={`${changeAllTheme('darkMode', 'whiteMode')}`}
                            />
                            <Link href={'/featured'}>
                                <p className={styles.homeFeaturedMore}>{home.more}></p>
                            </Link>
                        </div>
                    </div>
                    <div className={styles['homeTableBox']}>
                        {/*表格*/}
                        <Table columns={columns}
                               scroll={{x: 'max-content'}}
                               rowKey={(record) => record?.id}
                               loading={featuredBol}
                               className={`${changeAllTheme('darkTable', 'tablesss')}  anyTable`} onRow={(record) => {
                            return {
                                onClick: (event) => {
                                    const data = record.pair
                                    router.push(`/details?pairAddress=${data}`,)
                                },
                            };
                        }}
                               dataSource={featured?.length > 5 ? featured.slice(0, 5) : featured}
                               pagination={false} bordered={false}/>
                    </div>
                </div>
            </div>
            {/*右边*/}
            <div
                className={`cardParams ${changeAllTheme('socialScrollD darknessThrees', 'socialScroll brightTwo boxHover')}`}
                id="scrollableDiv"
                style={{height: `${socialHeight || 200}px`}}>
                <div className={styles.homeRightTop}>
                    <p className={`${styles.homeRightTopName} ${changeAllTheme('darknessFont', 'brightFont')}`}>{home.social}</p>
                    <Link href={'/social'}>
                        <p onClick={pushSocial}
                           style={{fontSize: '20px', color: '#2394D4', cursor: 'pointer'}}>{home.more}></p>
                    </Link>
                </div>
                {/* ?*/}
                {
                    socialLoad ? <Skeleton
                        avatar
                        paragraph={{rows: 4,}}
                    /> : postsDataAdd?.length > 0 ? <InfiniteScroll
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
                            return <PostCard
                                change={change}
                                liked={false}
                                key={post?.postId}
                                post={post}
                                user={userPa}
                            />
                        }) : ''}
                    </InfiniteScroll> : <div style={{textAlign: 'center', fontSize: '20px'}}
                                             className={changeAllTheme('darknessFont', 'brightFont')}>{home.noData}</div>
                }
            </div>
            {/*launchBol && presaleBol && !featuredBol ? refHeight?.current?.clientHeight :*/}
        </div>
        <Bott/>
    </div>);
}

export default Home
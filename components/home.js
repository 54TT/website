import React, {useEffect, useState, useMemo, useRef} from 'react';
import styled from '/public/style/home.module.css'
import {useRouter} from 'next/router'
import ScrollAnimationWrapper from './demo'
import {motion, AnimatePresence} from "framer-motion";
import {getScrollYAnimation, getScrollXAnimation, getScrollXXAnimation} from './a'
import B from './b';
import Youtube from 'react-youtube'
function Home(props) {
    const [wodWidth, setWidth] = useState(0)
    // 在组件挂载时添加事件监听器
    useEffect(() => {
        if (window && window?.innerWidth) {
            setWidth(window?.innerWidth)
        }
        const handleResize = () => {
            // 更新状态，保存当前窗口高度
            setWidth(window?.innerWidth);
        };
        // 添加事件监听器
        window.addEventListener('resize', handleResize);
        // 在组件卸载时移除事件监听器
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // 仅在组件挂载和卸载时执行
    const [height, setHeight] = useState('auto')
    useEffect(() => {
        // const data = document.getElementById('name').offsetHeight
        // setHeight(data)
    }, [])
    const pushDex = () => {
        window.open('http://dexpert.io')
    }
    const chartHeight = useRef(null)
    const updateHeight = useRef(null)
    const [moreHeight, setMoreHeight] = useState(0)
    const [updatesHeight, setUpdatesHeight] = useState(0)
    useEffect(() => {
        if (chartHeight && chartHeight.current) {
            const data = chartHeight.current.offsetHeight
            setMoreHeight(data)
        }
        if (updateHeight && updateHeight.current) {
            const data = updateHeight.current.offsetHeight
            setUpdatesHeight(data)
        }
    }, [chartHeight, updateHeight])
    const [isShow, setIsShow] = useState(false)
    const click = () => {
        setIsShow(!isShow)
    }
    const Navigation = ['About us', 'Roadmap', 'Airdrop', 'Learn']
    const update = ['The treasure chest can open up a variety of rare props and fragments!', 'At the same time, a new red name mechanism will also be grandly launched, with players with higher red name values having a higher chance of winning special treasures!', 'But risks and opportunities coexist, and red name players will not automatically recover their health after a PK (attack or defense) ends, until they are completely defeated.', 'Players have stronger outdoor PK strategies, more exciting gameplay, richer fun, and richer rewards.']
    const roadMpa = [{
        time: '2024 Q1',
        data: ['Beta launch of ERC-20 New Pairs', 'Beta release of Community and Live Chat', 'Pre-Sale Beta', 'ERC-20 Buy (info) Bot on Telegram', 'ERC-20 Trending Bot on Telegram']
    }, {
        time: '2024 Q2',
        data: ['Token trade history, related details, and price chart on the WebAPP', 'Token Swap feature on the WebAPP', 'Add on Multi-Chain new pairs', 'Deployment of ERC-20 Token tools', 'Launch of ERC-20 Fast-Trading Bot on Telegram', 'Introduction of ERC-20 Sniper Bot on Telegram']
    }, {
        time: '2024 Q3', data: ['WebAPP fixing and improvement based on user feedback',
            'Upgrade of Community functions',
            'Launch of DEXPERT government token (DEXG)',
            'Beta release of Android & IOS APP']
    }, {time: '2024 Q4', data: ['TBA']}]
    const vedio = [{name: 'Introduction to DEXpert', img: '58O3RUF2nNc'}, {
        name: 'Introduction and Exploring ERC-20 Tokens',
        img: 'OAANMJ-I7po'
    }, {name: 'Token Purchase and Transactions', img: 'Uz2qPfzSxZc'}]
    const img = [{name: 'Decentralized financial functions', img: '/react.svg'}, {
        name: 'Live new pair',
        img: '/xian.svg'
    }, {name: 'Social Community', img: '/message.svg'}]
    return (
        <div className={styled.box}>
            <div className={styled.top}>
                <B name={'right'}>
                    <img src="/logo.svg" alt="" style={{width: '80px'}}/>
                </B>
                {/* web端*/}
                {
                    wodWidth >= 768 ? <div className={styled.topRight}>
                        {
                            Navigation.map((i, index) => {
                                return    <B name={index===0?'top':index===1?'left':index===2?'right':'top'}  key={index}> <p>{i}</p>    </B>
                            })
                        }
                    </div> : <div className={styled.topRightMob}>
                        {/*<MenuUnfoldOutlined />*/}
                        <img src="/Menu.svg" width={40} onClick={click} style={{width: '40px'}} alt=""/>
                        {/*<p onClick={click} style={{color: 'white'}}>展开</p>*/}
                        <AnimatePresence>
                            {isShow && (
                                <motion.div
                                    className={styled.motion}
                                    key="modal"
                                    initial={{height: 0}}
                                    animate={{height: '150px'}}
                                    exit={{height: 0}}
                                    transition={{duration: 0.3}}>
                                    {
                                        Navigation.map((i, index) => {
                                            return <div key={index} style={{
                                                color: 'white',
                                                marginBottom: '10px',
                                                textAlign: 'right'
                                            }}>
                                                {i}
                                            </div>
                                        })
                                    }
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                }
            </div>
            {/*logo*/}
            <div className={styled.centerLogo} style={{marginTop: '10%'}}>
                <B name={'top'}><p className={`${styled.centerLogoPOne} ${styled.centerLogoP}`}>Empowering Connections,
                    Trading with Ease.</p></B>
                <B name={'top'}><p className={styled.centerLogoP}>DEXPERT, Where Decentralized Finance Meets Community
                    Excellence.</p></B>
                <B name={'top'}> <img src="/centerLo.svg" alt=""
                                      style={{width: '80%', display: 'block', margin: '2.5% auto'}}/></B>
                <div className={`${ styled.centerLogoD }`}>
                    {
                        img.map((i, index) => {
                            return <div style={{width:'30%'}} key={index}><B name={index === 0 ? 'left' : index === 1 ? 'top' : 'right'} >
                                <div className={styled.centerLogoDivP}>
                                    <img src={i.img} width={70} alt=""/>
                                    <p>{i.name}</p>
                                </div>
                            </B></div>
                        })
                    }
                </div>
                <p></p>
            </div>
            <B name={'top'}>
                <div className={styled.join}>
                    <p onClick={pushDex}>Join Dexpert</p>
                </div>
            </B>
            {/*about*/}
            <B name={'top'}>
                <div className={styled.aboutNowBox} style={{height: moreHeight + 'px'}}>
                    <div ref={chartHeight} className={styled.aboutNow}>
                        <div>
                            <p>About Us</p>
                            <p>DEXPERT stands out as a decentralized finance (DeFi) platform that extends beyond
                                traditional
                                offerings, introducing a diverse set of trading tools. What sets it apart is its
                                commitment
                                to
                                community building within the cryptocurrency ecosystem. The platform integrates social
                                functions, emphasizing communication and collaboration among users. This unique approach
                                goes
                                beyond financial transactions, creating a vibrant space where members can engage, share
                                insights, and collectively contribute to the evolving crypto landscape. DEXPERT's vision
                                is
                                not
                                only to empower users with advanced trading tools but also to forge lasting connections,
                                fostering a sense of community that transcends the boundaries of decentralized
                                exchanges.</p>
                            <p>Joining and using DEXPERT's social function is hassle-free; just link your wallet for
                                identity
                                without sharing additional details, ensuring privacy. DEXPERT strives to deliver the
                                best in
                                decentralized social networking, prioritizing user convenience and data security.</p>
                        </div>
                    </div>
                    <div className={styled.aboutNowBo} style={{height: moreHeight + 'px'}}></div>
                </div>
            </B>
            {/*update*/}
            <div className={styled.updates}>
                <B name={'top'}><p className={styled.updatesP}>Updates</p></B>
                {/*  box*/}
                <div className={`${wodWidth >= 768 ? '' : styled.centerUpdate} ${styled.updateBox}`}>
                    <div className={styled.updateBoxLeftBox}
                         style={{width: wodWidth >= 768 ? '68%' : '100%', height: updatesHeight + 'px'}}>
                        <div ref={updateHeight} className={styled.updateBoxLeft}>
                            <p>In the new version, players will receive a brand new reward in PK: a battle
                                chest.</p>
                            {
                                update.map((i, index) => {
                                    return <p key={index}>
                                        <span></span>
                                        <span>{i}</span>
                                    </p>
                                })
                            }
                            <div>
                                <div className={styled.updateBoxLeftEnd}>
                                    <p>
                                        <img src="/right.svg" alt="" width={10}
                                             style={{width: '10px', marginTop: '2px'}}/>
                                    </p>
                                    <p>
                                        <img src="/left.svg" alt="" width={10}
                                             style={{width: '10px', marginTop: '2px'}}/>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div style={{height: updatesHeight + 'px'}} className={styled.updateBoxLeftTwo}></div>
                        <div style={{height: updatesHeight + 'px'}} className={styled.updateBoxLeftThree}></div>
                    </div>
                    <div style={{width: wodWidth >= 768 ? '30%' : '50%', margin: '20px auto 0'}}>
                        <B name={'right'}>
                            <img src="/shou.svg" style={{width: '100%'}} alt=""/>
                        </B>
                    </div>
                </div>
            </div>
            {/* road map*/}
            <div className={styled.roadMap}>
                <B name={'top'}><p className={styled.roadMapP}>Road Map</p></B>
                <div className={`${wodWidth >= 768 ? '' : styled.centerUpdate} ${styled.roadMapBot}`}>
                    {
                        roadMpa.map((i, index) => {
                            return <div className={styled.roadMapBotBox} key={index}
                                        style={{width: index === 0 || index === 2 ? wodWidth >= 768 ? '45%' : '100%' : wodWidth >= 768 ? '55%' : '100%'}}>
                                <B name={index === 0 || index === 2 ? 'left' : 'right'}>
                                    <p className={styled.roadMapBotBoxP}>{i.time}</p>
                                </B>
                                <B name={index === 0 || index === 2 ? 'left' : 'right'}>
                                    <div className={styled.roadMapBotBoxBot}>
                                        <p></p>
                                        <div>
                                            {
                                                i.data.map((item, ind) => {
                                                    if (item === 'TBA') {
                                                        return <div key={ind} style={{
                                                            color: 'white',
                                                            fontSize: '23px',
                                                            lineHeight: 1
                                                        }}>{item}</div>
                                                    } else {
                                                        return <p key={ind}>{item}</p>
                                                    }
                                                })
                                            }
                                        </div>
                                    </div>
                                </B>
                                {
                                    wodWidth > 1200 && <img src="/finish.svg"
                                                            alt=""
                                                            style={{
                                                                width: index === 0 || index === 2 ? '50%' : '41%',
                                                                position: 'absolute',
                                                                bottom: index === 0 || index === 1 ? '-60%' : '-120%',
                                                                right: '1%'
                                                            }}/>
                                }
                            </div>
                        })
                    }
                </div>
            </div>
            {/* DEXPERT  */}
            <div className={styled.DEXPERT}>
                <B name={'top'}><p className={styled.DEXPERTP}><span>DEXPERT Academy</span> <img src="/xing.svg" alt=""
                                                                                                 style={{
                                                                                                     width: '27px',
                                                                                                     marginLeft: "10px"
                                                                                                 }}/></p></B>
                <div className={`${wodWidth >= 768 ? '' : styled.centerUpdate} ${styled.dexBox}`}>
                    {
                        vedio.map((i, index) => {
                            return <div style={{
                                width: wodWidth >= 768 ? '30%' : '100%',
                                padding: wodWidth >= 768 ? '3%' : '8%'
                            }} key={index} className={styled.dexBoxBo}>
                                <B name={'top'}>
                                    <div style={{width:'100%',minHeight:'100px'}}>
                                    <Youtube videoId={i.img} opts={{width: '100%',}}/>
                                    </div>
                                </B>
                                <B name={'top'}>
                                    <p className={styled.dexBoxBoP}>{i.name}</p>
                                </B>
                                <B name={'top'}>
                                    <div className={styled.dexBoxBoDiv}>
                                        <p>z</p>
                                        <p>y</p>
                                        <p>w</p>
                                    </div>
                                </B>
                            </div>

                        })
                    }
                </div>
            </div>
            <div className={styled.bott}>
                <B name={'top'}>
                    <p className={`${styled.bottP}`}>Thank you for using DEXpert. Contact us for more details.</p>
                </B>
                <B name={'top'}>
                    <p className={`${styled.bottPLast} ${styled.bottP}`}>@DEXpertOfficial</p>
                </B>
            </div>
        </div>
    );
}

export default Home;
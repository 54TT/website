import React, {useEffect, useState, useMemo, useRef} from 'react';
import styled from '/public/style/home.module.css'
import {useRouter} from 'next/router'
import ScrollAnimationWrapper from './demo'
import {motion, AnimatePresence} from "framer-motion";
import {getScrollYAnimation, getScrollXAnimation, getScrollXXAnimation} from './a'
import B from './b';
import Youtube from 'react-youtube'

// import {MenuUnfoldOutlined} from '@ant-design/icons'
function Home(props) {
    const router = useRouter()
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
    const data = [{
        name: 'Smart Contract Exploration and Management',
        content: 'Dexpert makes it easy for you to explore and manage ERC-20 smart contracts. Whether you\'re a developer, investor, or enthusiast, we provide an intuitive and feature-rich interface that allows you to delve into and effectively manage your smart contracts.',
        img: 'one'
    },
        {
            name: 'Real-Time Market Data',
            content: 'Get the latest market dynamics and ERC-20 token price trends. Dexpert integrates real-time data into the platform, helping you make informed decisions.',
            img: 'two'
        },
        {
            name: 'Security and Privacy Protection',
            content: 'We understand the importance in the blockchain world, so Dexpert adopts advanced security measures to ensure that your data and transactions are maximally protected. Your privacy is our top priority.',
            img: 'three'
        },
        {
            name: 'Chat and Social Features',
            content: ' Dexpert is more than just a tool; it\'s a blockchain community. Through built-in chat and social features, you can connect with global blockchain enthusiasts, developers, and investors, share insights, get feedback, and participate in engaging discussions.',
            img: 'four'
        }]
    const [height, setHeight] = useState('auto')
    useEffect(() => {
        const data = document.getElementById('name').offsetHeight
        setHeight(data)
    }, [])
    const pushDex = () => {
        window.open('http://dexpert.io')
    }
    const chartHeight =useRef(null)
    const [moreHeight,setMoreHeight] = useState(0)
    useEffect(()=>{
        if(chartHeight&&chartHeight.current){
            const data = chartHeight.current.offsetHeight
            setMoreHeight(data)
        }
    },[chartHeight])
    //
    const img = [{img: '/learn1.svg', name: 'Introduction to DEXpert',}, {
        img: '/learn2.svg',
        name: 'Introduction and Exploring ERC-20 Tokens',
    }, {img: '/learn3.svg', name: 'Token Purchase and Transactions',}, {
        img: '/learn4.svg',
        name: 'Choosing Token',
    }, {img: '/learn5.svg', name: 'Setting Up a Wallet',}, {
        img: '/learn6.svg',
        name: 'Getting Ethereum',
    }, {img: '/learn7.svg', name: 'Understanding Gas Fees',}, {
        img: '/learn8.svg',
        name: 'Token Trading and Liquidity',
    }]
    const [isShow, setIsShow] = useState(false)
    const click = () => {
        setIsShow(!isShow)
    }
    const Navigation = ['About us', 'Roadmap', 'Airdrop', 'Learn']
    const time = ['-Uniswap v2 and v3 live new pair', '-Featured pair', '-Token presale and token launch', '-Pair comment, post and chat', '-The launch of Dexpert’s official website', '-Brc20 indexer']
    const time1 = ['-Dex pert app optimization', '-Pair chart widget', '-Brc20 chart widget', '-Multivers Blockchain', '-Multivers swap pair', '-Dex pert iOS and Android app', '-The launch of DEXP', '-Add pair scoring']
    const time2 = ['-The Launch of DEXG', '-Dex pert AMM', '-Add hot pair', '-Token presale and launch improvement']
    const time3 = ['-New Chains', '-New scoring improvement', '-Improvements based on community feedback.',]
    const date = ['2024 Q4', 'Continuous Improvement:', '• Social network', '• Marketplace', '• Progression and modification of every individual DEXpert', '• New Chain', '• New Pair Scoring', '• New swap pair', 'Please note that there are many things that could change the ordering of these priorities including massive traction, breakthrough research, and feedback from the community. In addition, it should be understood that these are projections that we are making to the best of our ability but are subject to many potential disruptions.']
    const imgBot = ['/x.svg', '/t.svg', '/d.svg']
    return (
        <div className={styled.box}>
            {/*<video*/}
            {/*    width="500"*/}
            {/*    height="300"*/}
            {/*    controls*/}
            {/*>*/}
            {/*    <source src="/aaa.mp4" type="video/mp4" />*/}
            {/*    Your browser does not support the video tag.*/}
            {/*</video>*/}
            {/*top*/}
            <div className={styled.top}>
                <img src="/logo.svg" alt="" style={{width: '80px'}}/>
                {/* web端*/}
                {
                    wodWidth >= 768 ? <div className={styled.topRight}>
                        {
                            Navigation.map((i, index) => {
                                return <p key={index}>{i}</p>
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
            <div className={styled.centerLogo} style={{marginTop: wodWidth >= 768 ? '4%' : '25%'}}>
                <p>Empowering Connections, Trading with Ease.</p>
                <p>DEXPERT, Where Decentralized Finance Meets Community Excellence.</p>
                <img src="/centerLo.svg" alt=""
                     style={{width: wodWidth >= 768 ? '80%' : '15%', display: 'block', margin: '0 auto'}}/>
                {/*<p style={{margin: wodWidth >= 768 ? '3% 0' : '10% 3%'}}>Join Dexpert and explore new possibilities in*/}
                {/*    the world of blockchain!</p>*/}
                {/*<div>*/}
                {/*    <div className={wodWidth >= 768 ? '' : styled.dis}>*/}
                {/*        <p onClick={pushDex}*/}
                {/*           className={` ${styled.centerLogoP} ${wodWidth >= 768 ? styled.po : ''}`}>Join Dexpert</p>*/}
                {/*    </div>*/}
                {/*<img src="/bg.svg" alt="" style={{width: '100%', marginTop: wodWidth >= 768 ? "0" : '10%'}}/>*/}
                {/*</div>*/}
                <div>
                    <div>
                        <img src="/react.svg" width={70} alt=""/>
                        <p>Decentralized financial functions</p>
                    </div>
                    <div>
                        <img src="/xian.svg" width={70} alt=""/>
                        <p>Decentralized financial functions</p>
                    </div>
                    <div>
                        <img src="/message.svg" width={70} alt=""/>
                        <p>Decentralized financial functions</p>
                    </div>
                </div>
                <p></p>
            </div>
            <div className={styled.join}>
                <p>Join Dexpert</p>
            </div>
            <div className={styled.aboutNowBox} style={{height:moreHeight+'px'}}>
                <div ref={chartHeight} className={styled.aboutNow}>
                    <div>
                        <p>About Us</p>
                        <p>DEXPERT stands out as a decentralized finance (DeFi) platform that extends beyond traditional
                            offerings, introducing a diverse set of trading tools. What sets it apart is its commitment to
                            community building within the cryptocurrency ecosystem. The platform integrates social
                            functions, emphasizing communication and collaboration among users. This unique approach goes
                            beyond financial transactions, creating a vibrant space where members can engage, share
                            insights, and collectively contribute to the evolving crypto landscape. DEXPERT's vision is not
                            only to empower users with advanced trading tools but also to forge lasting connections,
                            fostering a sense of community that transcends the boundaries of decentralized exchanges.</p>
                        <p>Joining and using DEXPERT's social function is hassle-free; just link your wallet for identity
                            without sharing additional details, ensuring privacy. DEXPERT strives to deliver the best in
                            decentralized social networking, prioritizing user convenience and data security.</p>
                    </div>
                </div>
                <div className={styled.aboutNowBo}  style={{height:moreHeight+'px'}}></div>
            </div>
            <div className={styled.updates}>
                <p>Updates</p>
            </div>
            {/*<Youtube videoId={'Biu4jU9a_EA'}/>*/}
            {/* about*/}
            <div className={styled.about}>
                <div className={styled.aboutTop}>
                    <B name={'top'}>
                        <p className={styled.aboutUs}>About us</p>
                    </B>
                    {/*左右*/}
                    {
                        data.map((i, index) => {
                            return <div
                                className={`${wodWidth >= 768 ? styled.disc : ''} ${wodWidth >= 768 ? styled.aboutBot : styled.aboutBotAll}`}
                                style={{flexDirection: index % 2 === 1 ? 'row-reverse' : 'row'}}
                                key={index}>
                                <B name={'top'}>
                                    <div className={styled.aboutBotLeft}>
                                        <p>{i.name}</p>
                                        <div>
                                            <p>{i.content}</p>
                                        </div>
                                    </div>
                                </B>
                                <B name={index === 0 || index === 2 ? 'left' : 'right'}>
                                    <img
                                        src={i.img === 'one' ? "/abputRight.svg" : i.img === 'two' ? "/5638.svg" : i.img === 'three' ? "/safe.svg" : "/Man.svg"}
                                        alt="" style={{
                                        width: i.img === 'one' ? '85%' : i.img === 'two' ? '25%' : i.img === 'three' ? '60%' : '50%',
                                        display: 'block',
                                        margin: '0 auto'
                                    }}/>
                                </B>
                            </div>

                        })
                    }
                </div>
                <p className={styled.aboutTopBack1}></p>
                <p className={styled.aboutTopBack2}></p>
                <p className={styled.aboutTopBack3}></p>
            </div>
            <div style={{position: 'relative'}}>
                <div className={styled.bot}>
                    <p>Roadmap</p>
                    {/*center*/}
                    <div className={styled.botBot}>
                        {/*左边*/}
                        <div className={wodWidth >= 768 ? styled.botBotLeft : styled.disNo}>
                            <div>
                                {
                                    time.map((i, index) => {
                                        return <B name={'top'} key={index}>
                                            <p className={styled.homeP}>{i}</p>
                                        </B>
                                    })
                                }
                            </div>
                            <div>
                                {
                                    time1.map((i, index) => {
                                        return <B name={'top'} key={index}>
                                            <p className={styled.homeP}>{i}</p>
                                        </B>
                                    })
                                }
                            </div>
                            <div>
                                {
                                    time2.map((i, index) => {
                                        return <B name={'top'} key={index}>
                                            <p className={styled.homeP}>{i}</p>
                                        </B>
                                    })
                                }
                            </div>
                            <div>
                                {
                                    time3.map((i, index) => {
                                        return <B name={'top'} key={index}>
                                            <p className={styled.homeP}>{i}</p>
                                        </B>
                                    })
                                }
                            </div>
                        </div>
                        <img src="/botCenter.svg" alt=""/>
                        {/*    右边*/}
                        <div className={styled.botRight}>
                            <B name={'left'}>
                                <p className={`${styled.botRightp} ${styled.botRightp1}`}>2024 Q1</p>
                            </B>
                            <B name={'left'}>
                                <img src="/rightQiu.png" alt=""
                                     style={{width: '80px', marginTop: '60px', marginLeft: '30px'}}/>
                            </B>
                            <B name={'left'}>
                                <p className={`${styled.botRightp} ${styled.botRightp3}`}>2024 Q2</p>
                            </B>
                            <B name={'left'}>
                                <p className={`${styled.botRightp} ${styled.botRightp4}`}>2024 Q3</p>
                            </B>
                            <B name={'left'}>
                                <p className={`${styled.botRightp} ${styled.botRightp5}`}>2024 Q4</p>
                            </B>
                        </div>
                        {/*中间大球*/}
                        <div></div>
                    </div>
                    {/*xiao*/}
                    <div className={styled.botContent} style={{height: height}}>
                        <div id={'name'}>
                            {
                                date.map((i, index) => {
                                    return <B name={'top'} key={index}>
                                        <p className={styled.botContentp1}>{i}</p>
                                    </B>
                                })
                            }
                        </div>
                        <img src="/smallQiu.png" alt=""/>
                    </div>
                </div>
                <p className={styled.aboutTopBack4}></p>
            </div>
            <div className={styled.learn}>
                <div className={styled.learnBox}>
                    <B name={'top'}>
                        <p className={styled.learnp}>learn</p>
                    </B>
                    <div className={wodWidth >= 768 ? styled.learnImg : styled.mar}>
                        {
                            img.map((i, index) => {
                                return <div className={styled.learnImgBox} key={index} style={{
                                    width: wodWidth >= 768 ? '45%' : '100%',
                                    marginBottom: wodWidth >= 768 ? '5%' : '10%'
                                }}>
                                    <B name={'top'}>
                                        <img src={i.img} alt={''} style={{width: '100%'}}/>
                                        <p style={{textAlign: wodWidth >= 768 ? 'left' : 'center'}}>{i.name}</p>
                                    </B>
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>
            <div className={styled.botImg}>
                <B name={'left'}>
                    <div className={styled.botAllImg}>
                        {
                            imgBot.map((i, index) => {
                                return <img src={i} key={index} style={{width: wodWidth >= 768 ? '10%' : '18%'}}
                                            alt=""/>
                            })
                        }
                    </div>
                </B>
                <B name={'top'}>
                    <p className={styled.botP} style={{fontSize: '18px'}}>©DEXPert.io</p>
                </B>
            </div>
        </div>
    );
}

export default Home;
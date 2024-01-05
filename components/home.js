import React, {useEffect, useState, useMemo, useRef} from 'react';
import styled from '/public/style/home.module.css'
import {useRouter} from 'next/router'
import ScrollAnimationWrapper from './demo'
import {motion} from "framer-motion";
import {getScrollYAnimation, getScrollXAnimation, getScrollXXAnimation} from './a'
import B from './b'

function Home(props) {
    const router = useRouter()
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
                <img src="/boxLeft.svg" alt="" style={{width: '80px'}}/>
                <div className={styled.topRight}>
                    <p>About us</p>
                    <p>Roadmap</p>
                    <p>Airdrop</p>
                    <p>Learn</p>
                </div>
            </div>
            {/*logo*/}
            <div className={styled.centerLogo}>
                <img src="/logo.gif" alt=""/>
                <p>Join Dexpert and explore new possibilities in the world of blockchain!</p>
                <div>
                    <img src="/bg.svg" alt="" style={{width: '100%'}}/>
                    <p onClick={pushDex}>Join Dexpert</p>
                </div>
                <p></p>
            </div>
            {/* about*/}
            <div className={styled.about}>
                <div className={styled.aboutTop}>
                    <B name={'top'}>
                        <p className={styled.aboutUs}>About us</p>
                    </B>
                    {/*左右*/}
                    {
                        data.map((i, index) => {
                            return <div className={styled.aboutBot}
                                        style={{flexDirection: index % 2 === 1 ? 'row-reverse' : 'row'}}
                                        key={index}>
                                <B name={'top'}>
                                    <div>
                                        <div className={styled.aboutBotLeft}>
                                            <p>{i.name}</p>
                                            <div>
                                                <p>{i.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                </B>
                                <B name={index === 0 || index === 2 ? 'left' : 'right'}>
                                    <div>
                                        <img
                                            src={i.img === 'one' ? "/abputRight.svg" : i.img === 'two' ? "/5638.svg" : i.img === 'three' ? "/safe.svg" : "/Man.svg"}
                                            alt="" style={{
                                            width: i.img === 'one' ? '85%' : i.img === 'two' ? '25%' : i.img === 'three' ? '60%' : '50%',
                                            display: 'block',
                                            margin: '0 auto'
                                        }}/>
                                    </div>
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
                        <div className={styled.botBotLeft}>
                            <div>
                                <B name={'top'}>
                                    <p className={styled.homeP}>-Uniswap v2 and v3 live new pair</p>
                                </B>


                                <B name={'top'}>
                                    <p className={styled.homeP}>-Featured pair</p>
                                </B>
                                <B name={'top'}>
                                    <p className={styled.homeP}>-Token presale and token launch</p>
                                </B>
                                <B name={'top'}>
                                    <p className={styled.homeP}> -Pair comment, post and chat</p>
                                </B>
                                <B name={'top'}>
                                    <p className={styled.homeP}>-The launch of Dexpert’s official website</p>
                                </B>
                                <B name={'top'}>
                                    <p className={styled.homeP}>-Brc20 indexer</p>
                                </B>
                            </div>
                            <div>
                                <B name={'top'}>
                                    <p className={styled.homeP}>-Dex pert app optimization</p>
                                </B>
                                <B name={'top'}>
                                    <p className={styled.homeP}>-Pair chart widget</p>
                                </B>
                                <B name={'top'}>
                                    <p className={styled.homeP}>-Brc20 chart widget</p>
                                </B>
                                <B name={'top'}>
                                    <p className={styled.homeP}>-Multivers Blockchain</p>
                                </B>
                                <B name={'top'}>
                                    <p className={styled.homeP}>-Multivers swap pair</p>
                                </B>
                                <B name={'top'}>
                                    <p className={styled.homeP}> -Dex pert iOS and Android app</p>
                                </B>
                                <B name={'top'}>
                                    <p className={styled.homeP}>-The launch of DEXP</p>
                                </B>
                                <B name={'top'}>
                                    <p className={styled.homeP}>-Add pair scoring</p>
                                </B>
                            </div>
                            <div>
                                <B name={'top'}>
                                    <p className={styled.homeP}>-The Launch of DEXG</p>
                                </B>
                                <B name={'top'}>
                                    <p className={styled.homeP}>-Dex pert AMM</p>
                                </B>
                                <B name={'top'}>
                                    <p className={styled.homeP}>-Add hot pair</p>
                                </B>
                                <B name={'top'}>
                                    <p className={styled.homeP}>-Token presale and launch improvement</p>
                                </B>
                            </div>
                            <div>
                                <B name={'top'}>
                                    <p className={styled.homeP}>-New Chains</p>
                                </B>
                                <B name={'top'}>
                                    <p className={styled.homeP}>-New scoring improvement</p>
                                </B>
                                <B name={'top'}>
                                    <p className={styled.homeP}>-Improvements based on community feedback.</p>
                                </B>
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
                                     style={{width: '40%', marginTop: '18%', marginLeft: '8%'}}/>
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
                            <B name={'top'}>
                                <p className={styled.botContentp1}>2024 Q4</p>
                            </B>
                            <B name={'top'}>
                                <p className={styled.botContentp1}>Continuous Improvement:</p>
                            </B>
                            <B name={'top'}>
                                <p className={styled.botContentp1}>• Social network </p>
                            </B>
                            <B name={'top'}>
                                <p className={styled.botContentp1}>• Marketplace</p>
                            </B>
                            <B name={'top'}>
                                <p className={styled.botContentp1}>• Progression and modification of every individual
                                    DEXpert</p>
                            </B>
                            <B name={'top'}>
                                <p className={styled.botContentp1}>• New Chain</p>
                            </B>
                            <B name={'top'}>
                                <p className={styled.botContentp1}>• New Pair Scoring</p>
                            </B>
                            <B name={'top'}>
                                <p className={styled.botContentp1}>• New swap pair</p>
                            </B>
                            <B name={'top'}>
                                <p className={styled.botContentp1}>Please note that there are many things that could
                                    change the ordering of these priorities
                                    including massive traction, breakthrough research, and feedback from the community.
                                    In
                                    addition, it should be understood that these are projections that we are making to
                                    the
                                    best of our ability but are subject to many potential disruptions.</p>
                            </B>
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
                    <div className={styled.learnImg}>
                        {
                            img.map((i, index) => {
                                return <div className={styled.learnImgBox} key={index}>
                                    <B name={'top'}>
                                        <img src={i.img} alt={''} style={{width: '100%'}}/>
                                        <p>{i.name}</p>
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
                        <img src="/x.svg" style={{width: '10%'}} alt=""/>
                        <img src="/t.svg" style={{width: '10%'}} alt=""/>
                        <img src="/d.svg" style={{width: '10%'}} alt=""/>
                    </div>
                </B>
                <B name={'top'}>
                    <p className={styled.botP}>©DEXPert.io</p>
                </B>
            </div>
        </div>
    );
}

export default Home;
import React, {useEffect, useState} from 'react';
import styles from '/public/style/home.module.css'
import {useRouter} from "next/router";
function PointsDetail() {
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

    const data = ['1️.Introduction', "To give back to the Dexpert users for their active participation and interaction, we've launched an exciting points program! 🎉 This program aims to reward users who contribute to the Dexpert ecosystem through a points system.",
        '2.Ways to Earn Points',
        '💌 Invite New Users: Use your unique invitation link to invite new users, and once they successfully interact, you can earn up to 500,000 points!',
        '🐦 Post Tweets: Post up to 5 tweets per day, each earning you 100,000 points!',
        '👍 Appreciate Others: Give up to 10 likes per day, each worth 2,000 points!',
        '💬 Post Comments: Post and reply to up to 5 comments per day, each earning you 10,000 points!',
        '🥰 Digital Identity: Set your avatar for 10,000 points, set your ID for another 10,000 points!',
        '🏆 Post Ranking: Based on the number of likes, the top 5 posts each day will be ranked, with rewards of 500,000, 450,000, 400,000, 300,000, and 200,000 points respectively.',
        '3.Enhanced Rules',
        '🔄 Daily Reset: User comments and reply counts reset at UTC+0 each day to ensure fairness.',
        '📊 Points Display: Clearly display current points and activity records on the profile page, so you can always know your achievements!',
        '4.Points for Airdrop Exchange',
        '💰 Utility Token Exchange: Points can be exchanged for Utility Tokens to be launched in Q2 2024.',
        '🔄 Exchange Process: Details of the exchange process, including exchange ratio and minimum exchange units, will be announced in Phase 2.',

        '5️.Anti-Abuse Mechanism',
        '⚠️ Anti-Spam Posting: A penalty of 100,000 points will be imposed on malicious posters.',
        '🤖 Preventing Invitation Bots: Invited users will be verified (invited new user wallets must be in use). If bot users are detected, the corresponding invitation points will be deducted.',
    ]
    const abc = <div className={styles.detailBoxImg}>
        <img src="/other.svg" alt="" style={{width: '40%'}}/>
        <p style={{fontSize: wodWidth > 768 ? '48px' : '29px'}}>🚀 Join our points program and together, let's build a
            more active and stronger Dexpert community!</p>
    </div>
    return (
        <div className={styles.detailBox}>
            <div style={{width: '90%', margin: "0 auto"}}>
                <div className={styles.detailBoxTop}>
                    <img src="/detailLogo.svg" style={{width: '10%',cursor:"pointer",zIndex:'100'}} onClick={()=>{
                        router.push('/')
                    }} alt=""/>
                    <img src="/detailRight.svg" style={{width: '70%'}} alt=""/>
                </div>
                {!(wodWidth > 768) && abc}
                <div className={styles.detailBoxP}>
                    {
                        data.map((i, index) => {
                            return <p
                                style={index === 1 || index === 8 || index === 11 || index === 14 || (index + 1) === data.length ? {marginBottom: "35px"} : {}}
                                key={index}>{i}</p>
                        })
                    }
                </div>
                {wodWidth > 768 && abc}
                <div className={styles.botNow}>
                    <img src="/one.svg" alt=""/>
                    <img src="/two.svg" alt=""/>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <img src="/three.svg" style={{width: '20%'}} alt=""/>
                        <p style={{color: 'white', lineHeight: '1', marginLeft: '5px'}}>METAMASK</p>
                    </div>
                    <img src="/four.svg" alt=""/>
                </div>
                <p className={styles.bottom}>Thank you for using DEXpert. Contact us for more details.</p>
                <p className={styles.bottom}>@DEXpertOfficial</p>
            </div>
            <img src="/backBack.svg"
                 style={{width: '30%', position: 'absolute', top: '0', left: '0'}} alt=""/>
        </div>
    );
}

export default PointsDetail;
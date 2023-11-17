import React from 'react';
import styles from "../styles/home.module.css";
function Bottom(props) {
    return (
        <div>
            <div className={styles['boxBott']}>
                <div style={{width: '20%'}}>
                    <img src="/video.png" alt=""  style={{margin: '0 auto',width:'50%'}}/>
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
                    <img src="/TwitterX1.png"  alt="" width={45}/>
                    <img src="/TelegramApp.png" alt="" width={45} height={45}/>
                    <img src="/Discord.png" alt="" width={45}  height={45}/>
                    <img src="/Medium.png" alt="" width={45}  height={45}/>
                </div>
            </div>
            <div style={{color:'rgb(55,55,55,)',margin:'20px 0',display:'flex',alignItems:'center',justifyContent:'center'}}>©DEXPert.io</div>
        </div>
    );
}

export default Bottom;
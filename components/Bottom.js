import React, {useContext} from 'react';
import styles from "/styles/all.module.css";
import Image from 'next/image'
import {CountContext} from "./Layout/Layout";
import {changeLang} from "/utils/set";
function Bottom(props) {
    const {changeFamily,} = useContext(CountContext);
    const bottom = changeLang('bottom')
    return (
        <div>
            <div className={styles.bottomBoxLogo} style={{marginTop: '20px'}}>
                <div className={styles.bottomTop}>
                    <div className={styles.bottomImg}>
                        <Image src="/video.png" alt="" width={100} height={100} style={{width:'100%'}}/>
                    </div>
                    <p className={styles.bottomSlign}>{bottom.video}</p>
                </div>
                <p className={styles.bottomText} style={changeFamily!=='english'?{letterSpacing:'2px'}:{}}>{bottom.introduce}</p>
            </div>
            <div className={styles['bottomBoxLogo']}>
                <div className={styles.bottomImgs}>
                    <Image src="/TwitterX1.png" alt="" width={45} height={45}/>
                    <Image src="/TelegramApp.png" alt="" width={45} height={45}/>
                    <Image src="/Discord.png" alt="" width={45} height={45}/>
                    <Image src="/Medium.png" alt="" width={45} height={45}/>
                </div>
            </div>
            <div className={styles.bottomBot}>©DEXpert.io</div>
        </div>
    );
}

export default Bottom;
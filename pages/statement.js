import React, {useContext} from 'react';
import Bott from '/components/Bottom'
import style from '/styles/home.module.css'
import Image from 'next/image'
import {changeLang} from "/utils/set";

function Statement() {
    const statement=changeLang('statement')
    return (
        <div style={{
            width: '86%',
            margin: '0 auto',
            borderRadius: '10px',
            padding: '20px 40px'
        }}>
            <div className={style['abc']}>
                <p style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '26%',
                    margin: '0 auto'
                }}><Image src={'/logo1.png'} alt="logo" width={80} height={80}/><span
                    style={{fontSize: '45px', fontWeight: 'bold', color: 'rgb(55,55,55,)'}}>DEXPERT</span></p>
                <p style={{marginTop: '10px', fontSize: '18px'}}>DEXpert.io </p>
                {
                    statement?.map((i, dev) => {
                        return <p style={{
                            fontSize: '18px',
                            lineHeight: 1.2,
                            marginTop: '20px'
                        }} key={dev}>{i}</p>
                    })
                }
            </div>
            <Bott/>
        </div>
    );
}

export default Statement;


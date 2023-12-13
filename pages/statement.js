import React, {useContext} from 'react';
import Bott from '/components/Bottom'
import style from '/public/styles/home.module.css'
import Image from 'next/image'
import {changeLang} from "/utils/set";
import {CountContext} from '/components/Layout/Layout'

function Statement() {
    const {changeTheme} = useContext(CountContext);
    const statement=changeLang('statement')
    return (
        <div style={{
            width: '86%',
            margin: '0 auto',
            borderRadius: '10px',
            padding: '20px 40px'
        }}>
            <div className={`${style['abc']} ${changeTheme?'darknessTwo ':'brightTwo boxHover'}`}>
                <p style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '25%',
                    margin: '0 auto'
                }}><Image src={'/logo.svg'} alt="logo" width={70} height={70}/><span
                    style={{fontSize: '47px', fontWeight: 'bold', color: 'rgb(55,55,55)'}}>DEXPERT</span></p>
                <p style={{marginTop: '10px', fontSize: '18px'}} className={changeTheme?'darknessFont':'brightFont'}>DEXpert.io </p>
                {
                    statement?.map((i, dev) => {
                        return <p style={{
                            fontSize: '18px',
                            lineHeight: 1.2,
                            marginTop: '20px'
                        }} className={changeTheme?'darknessFont':'brightFont'} key={dev}>{i}</p>
                    })
                }
            </div>
            <Bott/>
        </div>
    );
}

export default Statement;


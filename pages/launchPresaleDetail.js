import React, {useContext, useEffect, useState} from 'react';
import styled from '/public/styles/all.module.css'
import {useRouter} from "next/router";
import cookie from "js-cookie";
import dayjs from "dayjs";
import {CountContext} from "../components/Layout/Layout";

function LaunchPresaleDetail(props) {
    const {changeTheme} = useContext(CountContext);
    const router = useRouter()
    const [list, setList] = useState(null)
    useEffect(() => {
        if (cookie.get('list') && cookie.get('list') != 'undefined') {
            const data = JSON.parse(cookie.get('list'))
            setList(data)
        }
    }, [cookie.get('list')]);
    return (
        <div className={`${styled.lpDetail} ${changeTheme ? 'darknessTwo' : 'brightTwo'}`}>
            {/*左边*/}
            <div className={styled.lpDetailLeft}>
                {/*上边*/}
                <div className={styled.lpDetailLeftTop}>
                    <img src={list?.logo ? list.logo : '/dexlogo.svg'} alt=""
                         style={{borderRadius: '50%', width: '80px'}}/>
                    <span style={{fontWeight: 'bold', fontSize: '22px'}} className={changeTheme?'fontWb':'fontB'}>{list?.name || ''}</span>
                    <div
                        className={`${styled.lpDetailLeftBack} ${changeTheme ? 'darkMode fontWb' : 'whiteMode fontB'}`}>{list?.symbol || '-'}
                    </div>
                    {
                        list?.status === 'presale' ? <div>
                            <p className={`${changeTheme?'fontW':'fontB'} ${styled.lpDetailLefP}`}>Presale</p>
                            <p className={styled.lpDetailLefPT}><img src="/icon _time1.svg" alt=""
                                                                     style={{width: '17px'}}/>
                                <span className={changeTheme?'fontWb':'fontB'}>{list?.time ? dayjs.unix(list?.time).format('YYYY-MM-DD HH:mm:ss') : '00:00:00'}</span>
                            </p>
                        </div> : <div>
                            <p className={styled.lpDetailLefP}>Launch</p>
                            <p className={styled.lpDetailLefPT}>
                                <img src="/icon _time1.svg" alt="" style={{width: '17px'}}/>
                                <span className={changeTheme?'fontWb':'fontB'}>{list?.time ? dayjs.unix(list?.time).format('YYYY-MM-DD HH:mm:ss') : '00:00:'}</span>
                            </p>
                        </div>
                    }
                </div>
                <div className={`${styled.lpDetailLeftBot} ${changeTheme ? 'darkMode fontWb' : 'whiteMode fontB'}`}>
                    {list?.description || '无'}
                </div>
            </div>
            {/*右边*/}
            <div className={styled.lpDetailR}>
                <div className={`${styled.lpDetailRight} ${changeTheme ? 'darkMode' : 'whiteMode'}`}>
                    <img src="/detailImg.svg" alt="" className={styled.lpDetailRightImg}/>
                    <p className={`${changeTheme?'fontWb':'fontB'} ${styled.lpDetailRightCen}`}>{list?.telegram || '-'}</p>
                </div>
                {
                    list?.status === 'presale' ?
                        <div className={` ${changeTheme ? 'darkMode' : 'whiteMode'} ${styled.lpDetailRight}`}>
                            <img src={list?.platformLogo || '/dexlogo.svg'} alt="" className={styled.lpDetailRightImg}/>
                            <p className={`${changeTheme?'fontWb':'fontB'} ${styled.lpDetailRightCen}`}>Presale platform</p>
                        </div> :
                        <div className={` ${changeTheme ? 'darkMode' : 'whiteMode'} ${styled.lpDetailRight}`}>
                            <img src={list?.platformLogo || '/dexlogo.svg'} alt="" className={styled.lpDetailRightImg}/>
                            <p className={`${changeTheme?'fontWb':'fontB'} ${styled.lpDetailRightCen}`}>Launch platform</p>
                        </div>
                }
                <div className={` ${changeTheme ? 'darkMode' : 'whiteMode'} ${styled.lpDetailRight}`}>
                    <img src="/VectorDicord.svg" alt="" className={styled.lpDetailRightImg}/>
                    <p className={`${changeTheme?'fontWb':'fontB'} ${styled.lpDetailRightCen}`}>{list?.discord || '-'}</p>
                </div>
                <div className={` ${changeTheme ? 'darkMode' : 'whiteMode'} ${styled.lpDetailRight}`}>
                    <img src="/pajamas_twitter.svg" alt="" className={styled.lpDetailRightImg}/>
                    <p className={`${changeTheme?'fontWb':'fontB'} ${styled.lpDetailRightCen}`}>{list?.twitter || '-'}</p>
                </div>
                <div className={` ${changeTheme ? 'darkMode' : 'whiteMode'} ${styled.lpDetailRight}`}>
                    <img src="/Ellipse27.png" alt="" className={styled.lpDetailRightImg}/>
                    <p className={styled.lpDetailRightP}>0x9B3A8159e119 eb09822115AE08 Ee1526849e1116</p>
                </div>
            </div>
        </div>
    );
}

export default LaunchPresaleDetail;
import React, {useEffect, useState} from 'react';
import styled from '/public/styles/all.module.css'
import {useRouter} from "next/router";
import cookie from "js-cookie";
import dayjs from "dayjs";

function LaunchPresaleDetail(props) {
    const router = useRouter()
    const [list,setList] = useState(null)
    useEffect(() => {
        if(cookie.get('list')&&cookie.get('list')!='undefined'){
            const data  =JSON.parse(cookie.get('list'))
            setList(data)
        }
    }, [cookie.get('list')]);
    return (
        <div className={styled.lpDetail}>
            {/*左边*/}
            <div className={styled.lpDetailLeft}>
                {/*上边*/}
                <div className={styled.lpDetailLeftTop}>
                    <img src={list?.logo?list.logo:'/dexlogo.svg'} alt="" style={{borderRadius:'50%'}} width={80}/>
                    <span style={{fontWeight: 'bold', fontSize: '22px'}}>{list?.name||''}</span>
                    <div className={styled.lpDetailLeftBack}>{list?.symbol||'-'}
                    </div>
                    {
                        list?.status==='presale'? <div>
                            <p className={styled.lpDetailLefP}>Presale</p>
                            <p className={styled.lpDetailLefPT}>  <img src="/icon _time1.svg" alt="" width={17}/>
                                <span>{list?.time?dayjs.unix(list?.time).format('YYYY-MM-DD HH:mm:ss'):'00:00:00'}</span></p>
                        </div>:<div>
                            <p className={styled.lpDetailLefP}>Launch</p>
                            <p className={styled.lpDetailLefPT}>
                                <img src="/icon _time1.svg" alt="" width={17}/>
                                <span>{list?.time?dayjs.unix(list?.time).format('YYYY-MM-DD HH:mm:ss'):'00:00:'}</span>
                            </p>
                        </div>
                    }
                </div>
                <div className={styled.lpDetailLeftBot}>
                    {list?.description||'无'}
                </div>
            </div>
            {/*右边*/}
            <div className={styled.lpDetailR}>
                <div className={styled.lpDetailRight}>
                    <img src="/detailImg.svg" alt="" className={styled.lpDetailRightImg}/>
                    <p  className={styled.lpDetailRightCen}>{list?.telegram||'-'}</p>
                </div>
                {
                    list?.status==='presale'?  <div className={styled.lpDetailRight}>
                        <img src={list?.platformLogo||'/dexlogo.svg'} alt="" className={styled.lpDetailRightImg}/>
                        <p  className={styled.lpDetailRightCen}>Presale platform</p>
                    </div>: <div className={styled.lpDetailRight}>
                        <img src={list?.platformLogo||'/dexlogo.svg'} alt="" className={styled.lpDetailRightImg}/>
                        <p  className={styled.lpDetailRightCen}>Launch platform</p>
                    </div>
                }
                <div className={styled.lpDetailRight}>
                    <img src="/VectorDicord.svg" alt="" className={styled.lpDetailRightImg}/>
                    <p  className={styled.lpDetailRightCen}>{list?.discord||'-'}</p>
                </div>
                <div className={styled.lpDetailRight}>
                    <img src="/pajamas_twitter.svg" alt="" className={styled.lpDetailRightImg}/>
                    <p  className={styled.lpDetailRightCen}>{list?.twitter||'-'}</p>
                </div>
                <div className={styled.lpDetailRight}>
                    <img src="/Ellipse27.png" alt="" className={styled.lpDetailRightImg}/>
                    <p className={styled.lpDetailRightP}>0x9B3A8159e119 eb09822115AE08 Ee1526849e1116</p>
                </div>
            </div>
        </div>
    );
}

export default LaunchPresaleDetail;
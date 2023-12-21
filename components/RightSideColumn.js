import React, {useContext, useEffect, useState} from "react";
import Link from "next/link";
import styled from '/public/styles/all.module.css';
import {changeLang} from "/utils/set";
import {Skeleton} from 'antd'
import {DownOutlined} from '@ant-design/icons'
import {
    CheckCircleIcon, UserAddIcon,
} from "@heroicons/react/solid";
import {request} from "/utils/hashUrl";
import cookie from "js-cookie";
import {CountContext} from "./Layout/Layout";
import dynamic from 'next/dynamic'

const RightDome = dynamic(() => import('/pages/rightDome'), {ssr: false});

function RightSideColumn({user, chatsData, chatsLoading,}) {
    const social = changeLang('social')
    const {setLogin, changeTheme} = useContext(CountContext)
    const [bol, setBol] = useState(false)
    const chang = () => {
        setBol(!bol)
    }
    useEffect(() => {
        getUsersToFollow();
    }, [bol])
    //  广场用户
    const [usersToFollow, setUsersToFollow] = useState([])
    const [usersToFollowLoading, setUsersToFollowLoading] = useState(true);
    const getUsersToFollow = async () => {
        try {
            const token = cookie.get('token')
            const res = await request('get', '/api/v1/user/public', {page: 1}, token);
            if (res === 'please') {
                setLogin()
            } else if (res && res?.status === 200) {
                setUsersToFollow(res?.data?.userList)
                setUsersToFollowLoading(false)
            } else {
                setUsersToFollowLoading(false)
                setUsersToFollow([])
            }
        } catch (error) {
            setUsersToFollowLoading(false)
            setUsersToFollow([]);
            return null
        }
    };
    const getChats = async () => {
        const token = cookie.get('token')
        const res = await request('get', '/api/v1/session/list', '', token);
    }
    return (<div
        className="hidden  p-2 lg:block max-w-[300px] lg:min-w-[290px] xl:min-w-[300px] sticky xl:mr-8"
        style={{alignSelf: "flex-start"}}>
        <div style={{padding: '10px', borderRadius: '15px 15px 0 0'}}
             className={changeTheme ? 'topBack' : 'brightTwo'}>
            <p className={`${changeTheme ? 'fontW' : 'fontB'} ${styled.rightSideColumnName}`}>{social.who}</p>
            <p className={changeTheme ? 'fontW' : 'fontB'} style={{textAlign: 'center', lineHeight: '1'}}>class
                Name</p>
        </div>
        {/*who*/}
        <div style={{
            background: ' linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.08) 100%)',
            border: '1px solid  rgba(255, 255, 255, 0.20)',
            borderRadius: '0 0 20px 20px'
        }}>
            {usersToFollowLoading ? <RightDome
                data={'loading'}/> : usersToFollow && usersToFollow.length > 0 && Array.isArray(usersToFollow) ? (usersToFollow.map((fol) => {
                return (<div className={'rightSideCard'} key={fol?.uid}>
                    {Number(fol?.uid) !== Number(user?.uid) && (<div
                        key={fol.uid}
                        className="flex justify-between items-centerrounded-lg">
                        <div className="flex items-center">
                            <img src={fol?.avatar ? fol.avatar : '/dexlogo.svg'}
                                 style={{borderRadius: '50%', width: '40px', height: '40px'}} alt="userimg"/>
                            <div>
                                <Link href={`/person/${fol?.uid}`}>
                                    <p className={`ml-3 cursor-pointer hover:underline ${changeTheme ? 'fontWb' : 'fontB'}`}
                                       style={{color: 'rgb(138,138,138)'}}>
                                        {fol?.username ? fol?.username.length > 7 ? fol.username.slice(0, 3) + '...' + fol.username.slice('-3') : fol.username : fol?.address.slice(0, 5)}
                                    </p>
                                </Link>
                            </div>
                        </div>
                        {Number(fol?.uid) !== Number(user?.uid) ? (<>
                            {/*是否关注*/}
                            {fol?.isFollow ?
                                <img src="/addFollow.svg" width={'30px'} style={{cursor: 'pointer'}} alt=""
                                     onClick={async () => {
                                         try {
                                             const token = cookie.get('token')
                                             const data = await request('post', "/api/v1/unfollow", {uid: fol.uid}, token)
                                             if (data === 'please') {
                                                 setLogin()
                                             } else if (data && data?.status === 200 && data?.data?.code === 200) {
                                                 chang()
                                             }
                                         } catch (err) {
                                             return null
                                         }
                                     }}/> :
                                <img src="/addFollow.svg" width={'30px'} style={{cursor: 'pointer'}} alt=""
                                     onClick={async () => {
                                         try {
                                             const token = cookie.get('token')
                                             const data = await request('post', "/api/v1/follow", {userId: fol.uid}, token)
                                             if (data === 'please') {
                                                 setLogin()
                                             } else if (data && data?.status === 200 && data?.data?.code === 200) {
                                                 chang()
                                             }
                                         } catch (err) {
                                             return null
                                         }
                                     }}/>}
                        </>) : ''}
                    </div>)}
                </div>);
            })) : <RightDome
                data={'noData'}/>}
            {
                !usersToFollowLoading&&usersToFollow&&usersToFollow.length>0?<p className={changeTheme ? 'fontW' : 'fontB'}
                                                                                style={{display: 'flex', justifyContent: 'center', cursor: 'pointer', marginBottom: '10px'}}>More
                    users <DownOutlined color={'rgb(94,91,103)'}/></p>:''
            }
        </div>
        {/*chats*/}
        <div style={{padding: '10px', borderRadius: '15px 15px 0 0', marginTop: '10px'}}
             className={changeTheme ? 'topBack' : 'brightTwo'}>
            <p className={`${changeTheme ? 'fontW' : 'fontB'} ${styled.rightSideColumnName}`}>{social.recent}</p>
            <p className={changeTheme ? 'fontW' : 'fontB'} style={{textAlign: 'center', lineHeight: '1'}}>Recent
                chats</p>
        </div>
        <div style={{
            background: ' linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.08) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.20)',
            borderRadius: '0 0 20px 20px'
        }}>
            {chatsLoading ? <RightDome
                data={'loading'}/> : chatsData && Array.isArray(chatsData) && chatsData.length > 0 ? chatsData.map((chat, i) => (
                <div className={'rightSideCard'} key={i}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <div className="flex items-center">
                            <img src={chat?.User?.Avatar ? chat.User.Avatar : '/dexlogo.svg'}
                                 style={{borderRadius: '50%', width: '40px', height: '40px'}} alt="userimg"/>
                            <Link href={`/chats?chat=${chat?.User?.Uid}`}>
                                <p className={`ml-3 cursor-pointer hover:underline ${changeTheme ? 'fontWb' : 'fontB'}`}
                                   style={{color: 'rgb(138,138,138)'}}>
                                    {chat?.User?.Username ? chat?.User?.Username.length > 7 ? chat?.User?.Username.slice(0, 5) : chat?.User?.Username : chat?.User?.Address.slice(0, 5)}
                                </p>
                            </Link>
                        </div>
                        <img src="/chatSocial.svg" alt="" width={'30px'} style={{cursor: 'pointer'}}/>
                    </div>
                </div>)) : <RightDome
                data={'noData'}/> }
            {
                !chatsLoading&&chatsData&&chatsData.length>0? <p className={changeTheme ? 'fontW' : 'fontB'}
                                     style={{display: 'flex', justifyContent: 'center', cursor: 'pointer', marginBottom: '10px'}}>More
                    users <DownOutlined color={'rgb(94,91,103)'}/></p>:''
            }
        </div>
    </div>);
}

export default RightSideColumn;

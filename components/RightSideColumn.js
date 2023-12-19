import React, {useContext, useEffect, useState} from "react";
import Link from "next/link";
import styled from '/public/styles/all.module.css';
import {changeLang} from "/utils/set";
import {Skeleton} from 'antd'
import {
    CheckCircleIcon, UserAddIcon,
} from "@heroicons/react/solid";
import dayjs from "dayjs";
import {request} from "../utils/hashUrl";
import cookie from "js-cookie";
import {CountContext} from "./Layout/Layout";

function RightSideColumn({user, chatsData}) {
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
    const [usersToFollow, setUsersToFollow] = useState([]);

    const [showLoad, setShowLoad] = useState(true);
    const getUsersToFollow = async () => {
        try {
            const token = cookie.get('token')
            const res = await request('get', '/api/v1/user/public', {page: 1}, token);
            if (res === 'please') {
                setLogin()
            } else if (res && res?.status === 200) {
                setUsersToFollow(res?.data?.userList)
            } else {
                setUsersToFollow([])
            }
            setShowLoad(false)
        } catch (error) {
            setUsersToFollow([]);
            setShowLoad(false)
            return null
        }
    };

    const getChats = async () => {
        const token = cookie.get('token')
        const res = await request('get', '/api/v1/session/list', '', token);
    }


    useEffect(() => {
        if (cookie.get('token') && cookie.get('token') != 'undefined') {
        }
    }, [cookie.get('token')])

    return (<div
            className="hidden  p-2 lg:block max-w-[300px] lg:min-w-[290px] xl:min-w-[300px] sticky xl:mr-8"
            style={{alignSelf: "flex-start"}}>
            {showLoad ? <Skeleton active/> : <> className=
                <p className={`${changeTheme ? 'fontW' : 'fontB'} ${styled.rightSideColumnName}`}>{social.who}</p>
                {usersToFollow && usersToFollow.length > 0 && Array.isArray(usersToFollow) ? (usersToFollow.map((fol) => {
                        return (<div className={'rightSideCard'} key={fol?.uid}>
                                {Number(fol?.uid) !== Number(user?.uid) && (<div
                                        key={fol.uid}
                                        className="flex justify-between items-center p-4 rounded-lg">
                                        <div className="flex items-center">
                                            <img src={fol?.avatar ? fol.avatar : '/dexlogo.svg'} width={40}
                                                 height={40}
                                                 style={{borderRadius: '50%'}} alt="userimg"/>
                                            <div>
                                                <Link href={`/chats?chat=${fol?.uid}`}>
                                                    {/*chats?chat=*/}
                                                    <p className="ml-3 cursor-pointer hover:underline"
                                                       style={{color: 'rgb(138,138,138)'}}>
                                                        {fol?.username ? fol?.username.length > 7 ? fol.username.slice(0, 3) + '...' + fol.username.slice('-3') : fol.username : fol?.address.slice(0, 5)}
                                                    </p>
                                                </Link>
                                                {/*{*/}
                                                {/*    <p style={{color: 'grey',}}*/}
                                                {/*       className="ml-3">{fol?.followers ? fol?.followers.length : 0} followers</p>}*/}
                                            </div>
                                        </div>
                                        {Number(fol?.uid) !== Number(user?.uid) ? (<>
                                                {/*是否关注*/}
                                                {fol.isFollow ? (<div className={styled.rightSideColumnClick}
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
                                                                      }}>
                                                        <CheckCircleIcon className="h-6"/>
                                                    </div>) : (<div style={{
                                                        padding: '7px',
                                                        display: 'flex',
                                                        cursor: 'pointer',
                                                        borderRadius: '10px',
                                                        backgroundColor: 'rgba(139, 92, 246)',
                                                        color: 'white'
                                                    }}
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
                                                                    }}
                                                    >
                                                        <UserAddIcon className="h-6 w-6"/>
                                                    </div>)}
                                            </>) : (<></>)}
                                    </div>)}
                            </div>);
                    })) : ''}
                <p className={styled.rightSideColumnName}>{social.recent}</p>
                <div style={{borderTop: '1px solid lightgray'}}>
                    {chatsData && Array.isArray(chatsData) ? (chatsData.map((chat,i) => (
                            <Link href={`/chats?chat=${chat?.User?.Uid}`} key={i}>
                                <div className={`hover:bg-gray-200 ${styled.rightSideColumnL}`}>
                                    <div className="relative">
                                        <img src={chat?.User?.Avatar ? chat.User.Avatar : '/dexlogo.svg'}
                                             width={40} height={40} style={{borderRadius: '50%'}} alt="userimg"/>
                                    </div>
                                    <div className="ml-1">
                                        <p style={{fontSize: '18px', userSelect: 'none'}}>{chat?.User?.Username?chat?.User?.Username.length>7?chat?.User?.Username.slice(0,5):chat?.User?.Username:chat?.User?.Address.slice(0,5)}</p>
                                        {/*<p style={{color: 'grey',}}>*/}
                                        {/*    {chat.texts && chat.texts.length > 30 ? `${chat.texts.substring(0, 30)}...` : chat.texts}*/}
                                        {/*</p>*/}
                                    </div>
                                    {/*{chat.created_at && (<div style={{marginLeft: 'auto'}} className="hidden xl:flex">*/}
                                    {/*        {chat.created_at ? dayjs(chat.created_at).format('YYYY-MM-DD HH:mm:ss') : ''}*/}
                                    {/*    </div>)}*/}
                                </div>
                            </Link>))) : (<Link href={`/chats`} passHref>
                            <p>
                                {social.chat}
                            </p>
                        </Link>)}
                </div>
            </>}
        </div>);
}

export default RightSideColumn;

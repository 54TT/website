import React, {useContext, useEffect, useState} from "react";
import Link from "next/link";
import baseUrl from '/utils/baseUrl'
import styled from '/public/styles/all.module.css';
import {changeLang} from "/utils/set";
import {
    CheckCircleIcon,
    UserAddIcon,
} from "@heroicons/react/solid";
import axios from "axios";
import {followUser, unfollowUser} from "../utils/profileActions";
import {useRouter} from "next/router";
import dayjs from "dayjs";
function RightSideColumn({user, chatsData, userFollowStats,change}) {
    const social = changeLang('social')
    const [bol, setBol] = useState(false)
    const chang = () => {
        setBol(!bol)
    }
    const router = useRouter();
    const [loggedInUserFollowStats, setLoggedInUserFollowStats] =
        useState([]);
    useEffect(() => {
        // getUsersToFollow();
        if (userFollowStats&&userFollowStats.following&&userFollowStats.following.length > 0) {
            setLoggedInUserFollowStats(userFollowStats.following)
        } else {
            setLoggedInUserFollowStats([])
        }
    }, [bol,userFollowStats])
    const [usersToFollow, setUsersToFollow] = useState([]);
    const getUsersToFollow = async () => {
        try {
            const res = await axios.get(
                `${baseUrl}/api/profile/home/youMayLikeToFollow`,
            );
            if (res && res.data) {
                setUsersToFollow(res.data);
            } else {
                setUsersToFollow([]);
            }
        } catch (error) {
            setUsersToFollow([]);
        }
    };

    return (
        <div
            className="hidden  p-2 lg:block max-w-[300px] lg:min-w-[290px] xl:min-w-[300px] sticky xl:mr-8"
            style={{alignSelf: "flex-start"}}
        >
            <p className={styled.rightSideColumnName}>{social.who}</p>
            {usersToFollow && usersToFollow.length > 0 && Array.isArray(usersToFollow) ? (
                usersToFollow.map((fol) => {
                    const isLoggedInUserFollowing =
                        loggedInUserFollowStats?.length > 0 &&
                        loggedInUserFollowStats?.filter(
                            (loggedInUserFollowing) =>
                                loggedInUserFollowing?.user?.id === fol?.id
                        ).length > 0 || '';
                    return (
                        <div  className={'rightSideCard'} key={fol.id}>
                            {fol?.id !== user?.id && (
                                <div
                                    key={fol.id}
                                    className="flex justify-between items-center p-4 rounded-lg"
                                >
                                    <div className="flex items-center">
                                        <img src={fol?.profilePicUrl ? fol.profilePicUrl : '/Ellipse1.png'} width={40} height={40}
                                             style={{ borderRadius: '50%'}}   alt="userimg"/>
                                        <div>
                                            <Link href={`/${fol?.username}`}>
                                            <p
                                                className="ml-3 cursor-pointer hover:underline">
                                                {fol?.username.length > 7 ? fol.username.slice(0, 3) + '...' + fol.username.slice('-3') : fol.name}
                                            </p>
                                            </Link>
                                            {
                                                <p style={{color: 'grey',}}
                                                   className="ml-3">{fol?.followers ? fol?.followers.length : 0} followers</p>}
                                        </div>
                                    </div>
                                    {fol?.id !== user?.id ? (
                                        <>
                                            {/*关注*/}
                                            {isLoggedInUserFollowing ? (
                                                <div className={styled.rightSideColumnClick}
                                                    onClick={async () => {
                                                        const data = await unfollowUser(
                                                            fol.id,
                                                            '',
                                                            user?.id
                                                        );
                                                        if (data && data.status === 200) {
                                                            chang()
                                                            change('like')
                                                        }
                                                    }}
                                                >
                                                    <CheckCircleIcon className="h-6"/>
                                                </div>
                                            ) : (
                                                <div  style={{padding: '7px',
                                                    display: 'flex',
                                                    cursor: 'pointer',
                                                    borderRadius: '10px',
                                                    backgroundColor: 'rgba(139, 92, 246)',
                                                    color: 'white'}}
                                                    onClick={async () => {
                                                        const data = await followUser(
                                                            fol.id,
                                                            '',
                                                            user?.id
                                                        );
                                                        if (data && data.status === 200) {
                                                            chang()
                                                            change('like')
                                                        }
                                                    }}
                                                >
                                                    <UserAddIcon className="h-6 w-6"/>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })
            ) : ''}
            <p className={styled.rightSideColumnName}>{social.recent}</p>
            <div style={{borderTop:'1px solid lightgray'}}>
                {chatsData && Array.isArray(chatsData) ? (
                    chatsData.map((chat) => (
                        <Link href={`/chats?chat=${chat.textsWith}`} key={chat?.textsWith}>
                        <div
                            className={`hover:bg-gray-200 ${styled.rightSideColumnL}`}
                        >
                            <div className="relative">
                                <img src={chat?.profilePicUrl ? chat.profilePicUrl : '/Ellipse1.png'}
                                    width={40}  height={40} style={{ borderRadius: '50%'}} alt="userimg"/>
                            </div>
                            <div className="ml-1">
                                <p style={{fontSize:'18px',userSelect:'none'}}>{chat.name}</p>
                                <p style={{color: 'grey',}}>
                                    {chat.texts && chat.texts.length > 30
                                        ? `${chat.texts.substring(0, 30)}...`
                                        : chat.texts}
                                </p>
                            </div>
                            {chat.created_at && (
                                <div style={{marginLeft:'auto'}} className="hidden xl:flex">
                                    {chat.created_at?dayjs(chat.created_at).format('YYYY-MM-DD HH:mm:ss'):''}
                                </div>
                            )}
                        </div>
                        </Link>
                    ))
                ) : (
                    <Link href={`/chats`} passHref>
                    <p>
                        {social.chat}
                    </p>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default RightSideColumn;

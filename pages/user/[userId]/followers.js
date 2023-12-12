import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import baseUrl from "../../../utils/baseUrl";
// import InfoBox from "../../../components/HelperComponents/InfoBox";
import {
    CheckCircleIcon, ExclamationCircleIcon, UserAddIcon,
} from "@heroicons/react/solid";
import {followUser, unfollowUser} from "../../../utils/profileActions";
import Sidebar from "../../../components/Sidebar";
import Link from 'next/link';
import dynamic from 'next/dynamic'
import cook from "js-cookie";
const InfoBox = dynamic(() => import('../../../components/HelperComponents/InfoBox'), {ssr: false});
// const Sidebar = dynamic(() => import('../../../components/Sidebar'));
import styled from '/public/styles/all.module.css'
import {changeLang} from "/utils/set";
import cookie from "js-cookie";
import {request} from "../../../utils/hashUrl";

function FollowersPage() {
    const social = changeLang('social')
    const router = useRouter();
    const getUs = async () => {
        const params = JSON.parse(cookie.get('username'))
        const data = await request('get', "/api/v1/userinfo/" + params?.uid,)
        if (data && data?.status === 200) {
            const user = data?.data?.data
            if (user) {
                setUserPar(user)
            } else {
                setUserPar(null)
            }
        } else {
            setUserPar(null)
        }
    }
    useEffect(() => {
        if (cook.get('username') && cook.get('username') != 'undefined') {
            getUs()
        }
    }, [cook.get('username')]);
    const [loggedUserFollowStats, setLoggedUserFollowStats] = useState({});
    const [userPar, setUserPar] = useState(null);
    const [errorLoading, setErrorLoading] = useState(false);
    const [followers, setFollowers] = useState([]);
    console.log(followers)
    const [followersBol, setFollowersBol] = useState(false);
    const [page, setPage] = useState(1);

    const change = () => {
        setFollowersBol(!followersBol)
    }
    const getParams = async () => {
        const res = await request('post','/api/v1/follower/list',{uid:userPar?.uid,page});
        if(res&&res?.status===200){
            setFollowers(res?.data?.followerList)
        }
        // if (res.status === 200) {
        //     setFollowers(res.data)
        // } else {
        //     setFollowers([])
        //     setErrorLoading(true)
        // }
    }
    const getUsers = async () => {
        const res = await axios.get(`${baseUrl}/api/user/userFollowStats`, {
            params: {userId: userPar?.id},
        });
        if (res?.status === 200) {
            setLoggedUserFollowStats(res.data.userFollowStats)
        }
    }
    useEffect(() => {
        if (userPar && userPar.uid) {
            getParams()
            // getUsers()
        }
    }, [userPar, followersBol])
    if (errorLoading) {
        return (<InfoBox
            Icon={ExclamationCircleIcon}
            message={"Oops, an error occured"}
            content={`There was an error while fetching the users this user has followed`}
        />);
    }
    // 获取屏幕
    const [winHeight, setHeight] = useState();
    const isAndroid = () => {
        const u = window?.navigator?.userAgent;
        if (u.indexOf("Android") > -1 || u.indexOf("iPhone") > -1) return true;
        return false;
    };
    useEffect(() => {
        if (isAndroid()) {
            setHeight(window.innerHeight - 180);
        } else {
            setHeight("auto");
        }
    });


    return (
        <div className={styled.allMoblice}>
            <div
                className={`h-screen ${styled.followersBox} ${styled.allMobliceW}`}
                style={{height: winHeight, minHeight: winHeight}}

            >
                <main className={styled.followersBoxMin}>
                    <Sidebar user={userPar} topDist={"0"} maxWidth={"250px"}/>
                    <div
                        className={styled.followersBoxData}>
                        <div className="flex items-center ml-2">
                            <p className={styled.followersBoxName}>{social.followers} ·</p>
                            <p style={{
                                userSelect: 'none',
                                fontSize: '20px'
                            }} className="text-gray-500 ml-2">
                                {followers?.length || 0}
                            </p>
                        </div>
                        {followers.length > 0 ? (<div>
                            {followers.map((fol) => {
                                const isLoggedInUserFollowing = loggedUserFollowStats?.following?.length > 0 && loggedUserFollowStats?.following?.filter((loggedInUserFollowing) => loggedInUserFollowing?.user.id === fol?.user?.id).length > 0;
                                return (<div
                                    className={styled.followersBoxFollow}
                                    key={fol?.user?.id}
                                >
                                    <div className="flex items-center  ">
                                        <img src={fol?.avatar || '/Ellipse1.png'} alt="userimg" width={40}
                                             height={40}
                                             style={{borderRadius: '50%'}}/>
                                        <Link href={`/${fol?.username}`}>
                                            <p className={`ml-2 ${styled.followersBoxLink}`}>
                                                {fol?.username.length > 10 ? fol.username.slice(0, 4) + '...' + fol.username.slice(-3) : fol?.username}
                                            </p>
                                        </Link>

                                    </div>
                                    {/*关注或者取关*/}
                                    {/*{fol?.uid !== userPar?.uid ? (<>*/}
                                    {/*    {isLoggedInUserFollowing ? (<div className={styled.followersBoxFoll}*/}
                                    {/*                                     onClick={async () => {*/}
                                    {/*                                         const data = await unfollowUser(fol?.user?.id, setLoggedUserFollowStats, userPar?.id);*/}
                                    {/*                                         if (data && data.status === 200) {*/}
                                    {/*                                             change()*/}
                                    {/*                                         }*/}
                                    {/*                                     }}*/}
                                    {/*    >*/}
                                    {/*        <CheckCircleIcon className="h-6"/>*/}
                                    {/*    </div>) : (<div className={styled.followersBoxFoll}*/}
                                    {/*                    onClick={async () => {*/}
                                    {/*                        const data = await followUser(fol?.user?.id, setLoggedUserFollowStats, userPar?.id);*/}
                                    {/*                        if (data && data.status === 200) {*/}
                                    {/*                            change()*/}
                                    {/*                        }*/}
                                    {/*                    }}*/}
                                    {/*    >*/}
                                    {/*        <UserAddIcon className="h-6"/>*/}
                                    {/*    </div>)}*/}
                                    {/*</>) : (<></>)}*/}
                                </div>);
                            })}
                        </div>) : router?.query?.userId === userPar?.id ? (<p className="text-md text-gray-500">
                            {social.followerGet}
                        </p>) : (<p className="text-md text-gray-500">{social.followerNo}</p>)}
                    </div>
                    <div className="w-10"></div>
                </main>
            </div>
        </div>
    );
}

export default FollowersPage;

import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import baseUrl from "../../../utils/baseUrl";
// import InfoBox from "../../../components/HelperComponents/InfoBox";
import Link from 'next/link'
import {
    CheckCircleIcon,
    UserAddIcon,
} from "@heroicons/react/solid";
import {followUser, unfollowUser} from "../../../utils/profileActions";
import Sidebar from "../../../components/Sidebar";
import dynamic from 'next/dynamic'
import {getUser} from "../../../utils/axios";
import cook from "js-cookie";
import styled from '/public/styles/all.module.css'
const InfoBox = dynamic(() => import('../../../components/HelperComponents/InfoBox'),{ ssr: false });
// const Sidebar = dynamic(() => import('../../../components/Sidebar'))
import {changeLang} from "/utils/set";
function FollowingPage() {
    const social=changeLang('social')
    const router = useRouter();
    const [user, setUser] = useState(null)
    const [followingArrayState, setFollowingArrayState] = useState(null);
    const [userFollowStats, setUserFollowStats] = useState(null);
    const [userFollowBol, setUserFollowBol] = useState(false);
    const getUs=async ()=>{
        const a =cook.get('name')
        const {data:{user},status} =   await getUser(a)
        if(user&&status===200){
            setUser(user)
        }else {
            setUser(null)
        }

    }
    useEffect(() => {
        if(cook.get('name')){
            getUs()
        }
    }, [cook.get('name')]);
    const chang = () => {
        setUserFollowBol(!userFollowBol)
    }
    const getUsers = async () => {
        const res = await axios.get(`${baseUrl}/api/user/userFollowStats`, {
            params: {userId: user?.id},
        });
        if (res?.status === 200) {
            setUserFollowStats(res.data.userFollowStats)
        }
    }
    const getParams = async () => {
        try {
            const res = await axios.get(
                `${baseUrl}/api/profile/following/${user?.id}`,);
            if (res && res.data) {
                setFollowingArrayState(res.data)
            } else {
                setFollowingArrayState([])
            }
        } catch (error) {
        }

    }

    useEffect(() => {
        if (user && user.id) {
            getParams()
            getUsers()
        }
    }, [user, userFollowBol])
    return (
        <div className={styled.allMoblice}>
            <div className={`h-screen ${styled.followersBox} ${styled.allMobliceW}`} >
                <main
                className={styled.followersBoxMin}
                >
                    <Sidebar user={user} topDist={"0"} maxWidth={"250px"}/>
                    <div
                    className={styled.followersBoxData}
                    >
                        <div className="flex items-center ml-2">
                            <p className={styled.followersBoxName}>{social.following} ·</p>
                            <p style={{
                                userSelect: 'none',
                                fontSize: '20px'
                            }} className="text-gray-500 ml-2">
                                {followingArrayState?.length||0}
                            </p>
                        </div>
                        <div className={styled.followingBox}>
                            {followingArrayState && followingArrayState.length > 0 ? followingArrayState.map((fol) => {
                                const isLoggedInUserFollowing =
                                    userFollowStats?.following?.length > 0 &&
                                    userFollowStats?.following?.filter(
                                        (loggedInUserFollowing) =>
                                            loggedInUserFollowing?.user.id === fol?.user?.id
                                    ).length > 0;
                                return (
                                    <div
                                    className={styled.followersBoxFollow}
                                        key={fol?.user?.id}
                                    >
                                        <div className="flex items-center ">
                                            <img    width={40} height={40} style={{
                                                borderRadius: '50%'}} src={fol?.user?.profilePicUrl||'/Ellipse1.png'} alt="userimg"/>
                                            <Link href={`/${fol?.user?.username}`}>
                                                <p className={`ml-3 ${styled.followersBoxLink}`}  >
                                                    {fol?.user?.name.length > 9 ? fol?.user?.name.slice(0, 4) + '...' + fol?.user?.name.slice(-3) : fol?.user?.name}
                                                </p>
                                            </Link>
                                        </div>
                                        {fol?.user?.id !== user?.id ? (
                                            <>
                                                {isLoggedInUserFollowing ? (
                                                    <div className={styled.followersBoxFoll}
                                                        onClick={async () => {
                                                            const data = await unfollowUser(
                                                                fol.user.id,
                                                                setUserFollowStats,
                                                                user?.id
                                                            );
                                                            if (data.status === 200) {
                                                                chang()
                                                            }
                                                        }}
                                                    >
                                                        <CheckCircleIcon className="h-6"/>
                                                        {/*<p className="ml-1.5">Following</p>*/}
                                                    </div>
                                                ) : (
                                                    <div className={styled.followersBoxFoll}
                                                        onClick={async () => {
                                                            const data = await followUser(
                                                                fol?.user?.id,
                                                                setUserFollowStats,
                                                                user?.id
                                                            );
                                                            if (data.status === 200) {
                                                                chang()
                                                            }
                                                        }}
                                                    >
                                                        <UserAddIcon className="h-6 "/>
                                                        {/*<p className="ml-1.5">Follow</p>*/}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                );
                            }) :  router?.query?.userId === user?.id ? (<p className="text-md text-gray-500">
                                {social.followerGet}
                            </p>) : (<p className="text-md text-gray-500">{social.followerNo}</p>)}
                        </div>
                    </div>
                    <div className="w-10"></div>
                </main>
            </div>
        </div>
    );
}
export default FollowingPage;


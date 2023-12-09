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
import {getUser} from "../../../utils/axios";
import cook from "js-cookie";

const InfoBox = dynamic(() => import('../../../components/HelperComponents/InfoBox'),{ ssr: false });
// const Sidebar = dynamic(() => import('../../../components/Sidebar'));
import styled from '/public/styles/all.module.css'
import {changeLang} from "/utils/set";

function FollowersPage() {
    const social = changeLang('social')
    const router = useRouter();
    const getUs = async () => {
        const a = cook.get('name')
        const {data: {user}, status} = await getUser(a)
        if (status === 200 && user) {
            setUserPar(user)
        } else {
            setUserPar('')
        }
    }
    useEffect(() => {
        if (cook.get('name')) {
            getUs()
        }
    }, [cook.get('name')]);
    const [loggedUserFollowStats, setLoggedUserFollowStats] = useState({});
    const [userPar, setUserPar] = useState(null);
    const [errorLoading, setErrorLoading] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [followersBol, setFollowersBol] = useState(false);
    const change = () => {
        setFollowersBol(!followersBol)
    }
    const getParams = async () => {
        const res = await axios.get(`${baseUrl}/api/profile/followers/${userPar?.id}`,);
        if (res.status === 200) {
            setFollowers(res.data)
        } else {
            setFollowers([])
            setErrorLoading(true)
        }

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
        if (userPar && userPar.id) {
            getParams()
            getUsers()
        }
    }, [userPar, followersBol])
    if (errorLoading) {
        return (<InfoBox
            Icon={ExclamationCircleIcon}
            message={"Oops, an error occured"}
            content={`There was an error while fetching the users this user has followed`}
        />);
    }

    return (
        <div className={styled.allMoblice}>
            <div className={`h-screen ${styled.followersBox} ${styled.allMobliceW}`}>
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
                                        <img src={fol?.user?.profilePicUrl || '/Ellipse1.png'} alt="userimg" width={40}
                                            height={40}
                                            style={{borderRadius: '50%'}}/>
                                        <Link href={`/${fol?.user?.username}`}>
                                            <p className={`ml-2 ${styled.followersBoxLink}`}>
                                                {fol?.user?.username.length > 10 ? fol.user.username.slice(0, 4) + '...' + fol.user.username.slice(-3) : fol?.user?.username}
                                            </p>
                                        </Link>

                                    </div>
                                    {fol?.user?.id !== userPar?.id ? (<>
                                        {isLoggedInUserFollowing ? (<div className={styled.followersBoxFoll}
                                                                        onClick={async () => {
                                                                            const data = await unfollowUser(fol?.user?.id, setLoggedUserFollowStats, userPar?.id);
                                                                            if (data && data.status === 200) {
                                                                                change()
                                                                            }
                                                                        }}
                                        >
                                            <CheckCircleIcon className="h-6"/>
                                        </div>) : (<div className={styled.followersBoxFoll}
                                                        onClick={async () => {
                                                            const data = await followUser(fol?.user?.id, setLoggedUserFollowStats, userPar?.id);
                                                            if (data && data.status === 200) {
                                                                change()
                                                            }
                                                        }}
                                        >
                                            <UserAddIcon className="h-6"/>
                                        </div>)}
                                    </>) : (<></>)}
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

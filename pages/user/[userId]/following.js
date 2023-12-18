import React, {useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import {CheckCircleIcon, UserAddIcon} from "@heroicons/react/solid";
import Sidebar from "../../../components/Sidebar";
import cook from "js-cookie";
import styled from "/public/styles/all.module.css";
import {changeLang} from "/utils/set";
import cookie from "js-cookie";
import {request} from "../../../utils/hashUrl";
import {CountContext} from "../../../components/Layout/Layout";

function FollowingPage() {
    const social = changeLang("social");
    const {setLogin,changeTheme} = useContext(CountContext)
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [followingArrayState, setFollowingArrayState] = useState(null);
    const [userFollowStats, setUserFollowStats] = useState(null);
    const [userFollowBol, setUserFollowBol] = useState(false);
    const getUs = async () => {
        try {
            const params = JSON.parse(cookie.get('username'))
            const token = cookie.get('token')
            const data = await request('get', "/api/v1/userinfo/" + params?.uid, '', token)
            if (data === 'please') {
                setUser(null)
                setLogin()
            } else if (data && data?.status === 200) {
                const user = data?.data?.data
                if (user) {
                    setUser(user)
                } else {
                    setUser(null)
                }
            } else {
                setUser(null)
            }
        } catch (err) {
            setUser(null)
            return null
        }
    };
    useEffect(() => {
        if (cook.get('username') && cook.get('username') != 'undefined') {
            getUs()
        }
    }, [cook.get('username')]);
    const chang = () => {
        setUserFollowBol(!userFollowBol);
    };
    const getParams = async () => {
        try {
            const token = cookie.get('token')
            const res = await request('post', '/api/v1/followee/list', {uid: user?.uid, page: 1}, token);
            if (res === 'please') {
                setLogin()
            } else if (res && res?.status === 200) {
                setFollowingArrayState(res?.data?.followeeList)
            }
        } catch (error) {
            return null
        }
    };

    useEffect(() => {
        if (user && user.uid) {
            getParams();
        }
    }, [user, userFollowBol]);
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
                className={`h-screen ${styled.followersBox} ${styled.allMobliceW}  ${changeTheme?'darknessTwo': 'brightTwo'}`}
                style={{height: winHeight, minHeight: winHeight}}
            >
                <main className={styled.followersBoxMin}>
                    <Sidebar user={user} topDist={"0"} maxWidth={"250px"}/>
                    <div className={`${changeTheme?'darknessThree':'noti'} ${styled.followersBoxData}`}>
                        <div className="flex items-center ml-2">
                            <p className={`${changeTheme?'fontW':'fontB'} ${styled.followersBoxName}`}>{social.following} ·</p>
                            <p
                                style={{
                                    userSelect: "none",
                                    fontSize: "20px",
                                }}
                                className="text-gray-500 ml-2"
                            >
                                {followingArrayState?.length || 0}
                            </p>
                        </div>
                        <div className={styled.followingBox}>
                            {followingArrayState && followingArrayState.length > 0 ? (
                                followingArrayState.map((fol) => {
                                    return (
                                        <div
                                            className={styled.followersBoxFollow}
                                            key={fol?.uid}
                                        >
                                            <div className="flex items-center ">
                                                <img
                                                    width={40}
                                                    height={40}
                                                    style={{
                                                        borderRadius: "50%",
                                                    }}
                                                    src={fol?.avatar || "/dexlogo.svg"}
                                                    alt="userimg"
                                                />
                                                <Link href={`/${fol?.uid}`}>
                                                    <p className={` ${styled.followersBoxLink}  ${changeTheme?'fontW':'fontB'} `}>
                                                        {fol?.username
                                                            ? fol?.username.length > 9
                                                                ? fol?.username.slice(0, 4) +
                                                                "..." +
                                                                fol?.username.slice(-3)
                                                                : fol?.username : fol?.address.slice(0, 5)}
                                                    </p>
                                                </Link>
                                            </div>
                                            <div
                                                className={styled.followersBoxFoll}
                                                onClick={async () => {
                                                    try {
                                                        const token = cookie.get('token')
                                                        const data = await request('post', "/api/v1/unfollow", {uid: fol?.uid}, token)
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
                                                <CheckCircleIcon className="h-6"/>
                                                {/*<p className="ml-1.5">Following</p>*/}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : Number(router?.query?.userId) === Number(user?.uid) ? (
                                <p className="text-md text-gray-500">{social.followerGet}</p>
                            ) : (
                                <p className="text-md text-gray-500">{social.followerNo}</p>
                            )}
                        </div>
                    </div>
                    <div className="w-10"></div>
                </main>
            </div>
        </div>
    );
}

export default FollowingPage;

import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import cookie from "js-cookie";
import baseUrl from '/utils/baseUrl'
import {useRouter} from "next/router";
import {LoadingOutlined} from '@ant-design/icons'
import Link from 'next/link'
import styled from '/public/styles/all.module.css'
import {changeLang} from "/utils/set";

function FollowingUsers({profile, userFollowStats, user}) {
    const username=changeLang('username')
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(false);
    const getFollowing = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${baseUrl}/api/profile/following/${profile.user_id}`,
                {
                    headers: {Authorization: cookie.get("token")},
                }
            );

            setFollowing(res.data);
        } catch (error) {
        }
        setLoading(false);
    };

    useEffect(() => {
        if (profile && profile.user_id) {
            getFollowing();
        }
    }, [profile]); //this runs on first component render

    return (
        <div
            className="bg-white rounded-2xl shadow-md  mt-5 p-5"
        >
            <div className="flex justify-between">
                <div className="flex">
                    <h1
                        className="text-2xl font-semibold"
                    >
                        {username.following}
                    </h1>
                    <span
                        className="ml-1 text-gray-500 text-lg"
                        style={{marginTop: "7px"}}
                    >
            {following && following.length > 0 ? following.length : "0"}
          </span>
                </div>
                {following && following.length > 0 && (
                    <Link href={`/user/${profile?.user_id}/following`}>
                        <p
                            className="text-md font-normal cursor-pointer select-none text-purple-400 hover:underline"
                        >
                            {username.viewAll}
                        </p>
                    </Link>
                )}
            </div>
            {loading ? (
                <LoadingOutlined />
            ) : (
                <>
                    {following && following.length > 0 ? (
                        <div className={styled.followerUserBox}>
                            {following.map((fol, index) => index < 5 && (
                                <Link href={`/${fol?.user?.address}`}  key={fol?.user?.id}>
                                    <div
                                        className="mb-5 cursor-pointer"
                                        style={{width: '100%'}}>
                                        <img src={fol?.user?.profilePicUrl||'/Ellipse1.png'} alt="userprof"   width={50}
                                               height={50}/>
                                        <Link href={`/${fol?.user?.address}`}>
                                            <p className={styled.followerUserName}>
                                                {fol?.user?.username.slice(0, 6)}
                                            </p>
                                        </Link>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : profile?.user_id === user?.id ? (
                        <p className="text-md text-gray-500">
                            {username.noFollowing}
                        </p>
                    ) : (
                        <p className="text-md text-gray-500">{`${profile?.name} ${username.otherNoFollowing}`}</p>
                    )}
                </>
            )}
        </div>
    );
}

export default FollowingUsers;


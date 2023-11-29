import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import cookie from "js-cookie";
import {useRouter} from "next/router";
import baseUrl from '/utils/baseUrl'
import Link from 'next/link'
import styled from '/styles/all.module.css'
import {changeLang} from "/utils/set";

function FollowerUsers({profile, userFollowStats, user}) {
    const username=changeLang('username')
    const [followers, setFollowers] = useState([]);
    const getFollowers = async () => {
        try {
            const res = await axios.get(
                `${baseUrl}/api/profile/followers/${profile.user_id}`,
                {
                    headers: {Authorization: cookie.get("token")},
                }
            );
            setFollowers(res.data);
        } catch (error) {
            setFollowers([])
        }
    };
    useEffect(() => {
        if (profile && profile.user_id) {
            getFollowers();
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
                        {username.followers}
                    </h1>
                    <span
                        className="ml-1 text-gray-500 text-lg"
                        style={{marginTop: "7px"}}
                    >
            {followers && followers.length > 0 ? followers.length : "0"}
          </span>
                </div>

                {followers && followers.length > 0 && (
                    <Link href={`/user/${profile?.user_id}/followers`}>
                        <p className="text-md font-normal cursor-pointer select-none text-purple-400 hover:underline">
                            {username.viewAll}
                        </p>
                    </Link>
                )}
            </div>

            {followers && followers.length > 0 ? (
                <div className={styled.followerUserBox}>
                    {followers.map((fol, i) => i < 5 && (
                        <Link href={`/${fol?.user?.address}`} key={fol?.user?.id}>
                            <div
                                className="mb-5 cursor-pointer"
                                style={{width: '100%'}}
                            >
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
                <p className="text-md text-gray-500">{username.noFollowers}
                </p>
            ) : (
                <p className="text-md text-gray-500">{`${profile?.name} ${username.otherNoFollowers}`}</p>
            )}
        </div>
    );
}

export default FollowerUsers;

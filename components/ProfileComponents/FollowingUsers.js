import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import cookie from "js-cookie";
import baseUrl from '/utils/baseUrl'
import {useRouter} from "next/router";
import {LoadingOutlined} from '@ant-design/icons'
import Link from 'next/link'
import styled from '/public/styles/all.module.css'
import {changeLang} from "/utils/set";
import {request} from "../../utils/hashUrl";

function FollowingUsers({userFollowStats,isUserOnOwnAccount, user}) {
    const username=changeLang('username')
    const [following, setFollowing] = useState([]);
    console.log(following)
    const [loading, setLoading] = useState(false);
    const getFollowing = async () => {
        setLoading(true);
        try {
            const res = await request('post','/api/v1/follower/list',{uid:user?.uid,page:1});
            if(res&&res?.status===200){
                setFollowing(res?.data?.followeeList)
            }
        } catch (error) {
        }
        setLoading(false);
    };

    useEffect(() => {
        if (user && user.uid) {
            getFollowing();
        }
    }, [user]); //this runs on first component render

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
                    <Link href={`/user/${user?.uid}/following`}>
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
                                <Link href={`/${fol?.uid}`}  key={fol?.uid}>
                                    <div
                                        className="mb-5 cursor-pointer"
                                        style={{width: '100%'}}>
                                        <img src={fol?.avatar||'/Ellipse1.png'} alt="userprof"   width={50}
                                               height={50}/>
                                        <Link href={`/${fol?.uid}`}>
                                            <p className={styled.followerUserName}>
                                                {fol?.username?fol?.username:fol?.address}
                                            </p>
                                        </Link>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : isUserOnOwnAccount? (
                        <p className="text-md text-gray-500">
                            {username.noFollowing}
                        </p>
                    ) : (
                        <p className="text-md text-gray-500">{`${user?.username?user?.username:user?.address} ${username.otherNoFollowing}`}</p>
                    )}
                </>
            )}
        </div>
    );
}

export default FollowingUsers;


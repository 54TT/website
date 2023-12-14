import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import cookie from "js-cookie";
import {useRouter} from "next/router";
import baseUrl from '/utils/baseUrl'
import Link from 'next/link'
import styled from '/public/styles/all.module.css'
import {changeLang} from "/utils/set";
import {request} from "../../utils/hashUrl";
import {Skeleton} from "antd";
import {CountContext} from "../Layout/Layout";

function FollowerUsers({profile, userFollowStats, isUserOnOwnAccount, user, showLoad}) {
    const username = changeLang('username')
    const {setLogin} = useContext(CountContext)
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const getFollowers = async () => {
        try {
            const token =  cookie.get('token')
            const res = await request('post', '/api/v1/followee/list', {uid: user?.uid, page: 1},token);
            if(res==='please'){
                setLogin()
            }else if (res && res?.data) {
                setFollowers(res.data?.followeeList)
            }
            setLoading(false)
        } catch (error) {
            setFollowers([])
        }
    };
    useEffect(() => {
        if (user && user?.uid) {
            getFollowers();
        }
    }, [user]);

    return (
        <div
            className="bg-white rounded-2xl shadow-md  mt-5 p-5">
            {
                showLoad && !loading ? <Skeleton.Avatar active={true} shape={'circle'}/> : <>
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
                            <Link href={`/user/${user?.uid}/followers`}>
                                <p className="text-md font-normal cursor-pointer select-none text-purple-400 hover:underline">
                                    {username.viewAll}
                                </p>
                            </Link>
                        )}
                    </div>
                    {followers && followers.length > 0 ? (
                        <div className={styled.followerUserBox}>
                            {followers.map((fol, i) => i < 5 && (
                                    <div
                                        className="mb-5 cursor-pointer"
                                        style={{width: '100%'}}
                                    >
                                        <img src={fol?.avatar || '/dexlogo.svg'} alt="userprof" width={50}
                                             height={50}/>
                                        <Link href={`/${fol?.uid}`}>
                                            <p className={styled.followerUserName}>
                                                {fol?.username ? fol.username : fol.address.slice(0,5)}
                                            </p>
                                        </Link>
                                    </div>
                            ))}
                        </div>
                    ) : isUserOnOwnAccount ? (
                        <p className="text-md text-gray-500">{username.noFollowers}
                        </p>
                    ) : (
                        <p className="text-md text-gray-500">{`${user?.username ? user?.username : user?.address.slice(0,5)} ${username.otherNoFollowers}`}</p>
                    )}
                </>
            }
        </div>
    );
}

export default FollowerUsers;

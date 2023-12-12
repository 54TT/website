import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import cookie from "js-cookie";
import {useRouter} from "next/router";
import baseUrl from '/utils/baseUrl'
import Link from 'next/link'
import styled from '/public/styles/all.module.css'
import {changeLang} from "/utils/set";
import {request} from "../../utils/hashUrl";

function FollowerUsers({profile, userFollowStats,isUserOnOwnAccount, user}) {
    const username=changeLang('username')
    const [followers, setFollowers] = useState([]);
    const getFollowers = async () => {
        try {
            const res = await request('post','/api/v1/followee/list',{uid:user?.uid,page:1});
            if(res&&res?.data){
                setFollowers(res.data.followerList)
            }
            (res.data);
        } catch (error) {
            setFollowers([])
        }
    };
    useEffect(() => {
        if (user && user?.uid) {
            getFollowers();
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
                        <Link href={`/${fol?.uid}`} key={fol?.uid}>
                            <div
                                className="mb-5 cursor-pointer"
                                style={{width: '100%'}}
                            >
                                <img src={fol?.avatar||'/Ellipse1.png'} alt="userprof"   width={50}
                                       height={50}/>
                                <Link href={`/${fol?.uid}`}>
                                <p className={styled.followerUserName}>
                                    {fol?.username?fol.username:fol.address}
                                </p>
                                </Link>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : isUserOnOwnAccount? (
                <p className="text-md text-gray-500">{username.noFollowers}
                </p>
            ) : (
                <p className="text-md text-gray-500">{`${user?.username?user?.username:user?.address} ${username.otherNoFollowers}`}</p>
            )}
        </div>
    );
}

export default FollowerUsers;

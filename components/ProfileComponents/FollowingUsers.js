import React, {useContext, useEffect, useState} from "react";
import cookie from "js-cookie";
import Link from 'next/link'
import styled from '/public/styles/all.module.css'
import {changeLang} from "/utils/set";
import {request} from "../../utils/hashUrl";
import {Skeleton} from "antd";
import {CountContext} from "../Layout/Layout";

function FollowingUsers({userFollowStats,isUserOnOwnAccount, user,showLoad}) {
    const username=changeLang('username')
    const {setLogin,changeTheme} = useContext(CountContext)
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const getFollowing = async () => {
        try {
            const token =  cookie.get('token')
            const res = await request('post','/api/v1/followee/list',{uid:user?.uid,page:1},token);
           if(res==='please'){
               setLogin()
           }else if(res&&res?.status===200){
                setFollowing(res?.data?.followeeList)
            }
        } catch (error) {
            return null
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
            className= {`${changeTheme?'introBack':'whiteMode'} rounded-2xl shadow-md  mt-5 p-5`}>
            {
                showLoad&&!loading ? <Skeleton.Avatar active={true} shape={'circle'}/> : <>
                    <div className="flex justify-between">
                        <div className="flex">
                            <h1
                                className={`${changeTheme?'fontW':'fontB'} text-2xl font-semibold`}>
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
                        <>
                            {following && following.length > 0 ? (
                                <div className={styled.followerUserBox}>
                                    {following.map((fol, index) => index < 5 && (
                                            <div
                                                className="mb-5 cursor-pointer"
                                                key={index}
                                                style={{width: '100%'}}>
                                                <img src={fol?.avatar||'/dexlogo.svg'} alt="userprof"   width={50}
                                                     height={50}/>
                                                <Link href={`/${fol?.uid}`}>
                                                    <p className={` ${changeTheme?'drakColor':'fontB'}  ${styled.followerUserName}`}>
                                                        {fol?.username?fol?.username:fol?.address.slice(0,5)}
                                                    </p>
                                                </Link>
                                            </div>
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
                </>
            }
        </div>
    );
}

export default FollowingUsers;


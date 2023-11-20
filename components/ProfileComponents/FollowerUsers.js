import axios from "axios";
import React, {useEffect, useState} from "react";
import cookie from "js-cookie";
import styled from "styled-components";
import {useRouter} from "next/router";
import baseUrl from '/utils/baseUrl'
import {notification} from "antd";
import Link from 'next/link'

function FollowerUsers({profile, userFollowStats, user}) {
    const router = useRouter();
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
            hint()
        }
    };
    const hint = () => {
        notification.error({
            message: `Please note`, description: 'Error reported', placement: 'topLeft',
            duration: 2
        });
    }
    useEffect(() => {
        if (profile && profile.user_id) {
            getFollowers();
        }
    }, [profile]); //this runs on first component render

    return (
        <div
            style={{fontFamily: "Inter"}}
            className="bg-white rounded-2xl shadow-md  mt-5 p-5"
        >
            <div className="flex justify-between">
                <div className="flex">
                    <h1
                        className="text-2xl font-semibold"
                        style={{fontFamily: "inherit"}}
                    >
                        Followers ·
                    </h1>
                    <span
                        className="ml-1 text-gray-500 text-lg"
                        style={{marginTop: ".15rem"}}
                    >
            {followers && followers.length > 0 ? followers.length : "0"}
          </span>
                </div>

                {followers && followers.length > 0 && (
                    <Link href={`/user/${profile?.user_id}/followers`}>
                        <p className="text-md font-normal cursor-pointer select-none text-purple-400 hover:underline"
                           style={{fontFamily: "inherit"}}
                        >
                            View All
                        </p>
                    </Link>
                )}
            </div>

            {followers && followers.length > 0 ? (
                <GridContainer>
                    {followers.map((fol, i) => i < 5 && (
                        <Link href={`/${fol?.user?.address}`} key={fol?.user?.id}>
                            <div
                                className="mb-5 cursor-pointer"
                                style={{width: '30%'}}
                            >
                                <img src={fol?.user?.profilePicUrl||'/Ellipse1.png'} alt="userprof"   width={50}
                                       height={50}/>
                                <Link href={`/${fol?.user?.address}`}>
                                <p style={{overflow: "hidden", textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                    {fol?.user?.username.slice(0, 6)}
                                </p>
                                </Link>
                            </div>
                        </Link>
                    ))}
                </GridContainer>
            ) : profile?.user_id === user?.id ? (
                <p className="text-md text-gray-500">
                    {`You don't have any followers ☹️. The trick is to follow someone and then
          wait for them to follow you back.`}
                </p>
            ) : (
                <p className="text-md text-gray-500">{`${profile?.name} doesn't have any followers.`}</p>
            )}
        </div>
    );
}

export default FollowerUsers;


const GridContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

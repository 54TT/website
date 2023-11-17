import React, {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import baseUrl from "../../../utils/baseUrl";
import InfoBox from "../../../components/HelperComponents/InfoBox";
import {
    CheckCircleIcon, ExclamationCircleIcon, UserAddIcon,
} from "@heroicons/react/solid";
import styled from "styled-components";
import {followUser, unfollowUser} from "../../../utils/profileActions";
import Sidebar from "../../../components/Sidebar";
import {useSession} from "next-auth/react";
import Link from 'next/link';
function FollowersPage() {
    const router = useRouter();
    const {data: session, status} = useSession()
    useEffect(() => {
        if (session && session.user) {
            setUserPar(session.user)
        }
    }, [session, session?.user]);

    const [loggedUserFollowStats, setLoggedUserFollowStats] = useState({});
    const [userPar, setUserPar] = useState(null);
    const [errorLoading, setErrorLoading] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [followersBol, setFollowersBol] = useState(false);
    const change = () => {
        setFollowersBol(!followersBol)
    }
    const getParams = async () => {
        const res = await axios.get(`${baseUrl}/api/profile/followers/${userPar.id}`,);
        if (res.status === 200) {
            setFollowers(res.data)
        } else {
            setFollowers([])
            setErrorLoading(true)
        }

    }
    const getUser = async () => {
        const res = await axios.get(`${baseUrl}/api/user/userFollowStats`, {
            params: {userId: userPar.id},
        });
        if (res?.status === 200) {
            setLoggedUserFollowStats(res.data.userFollowStats)
        }
    }
    useEffect(() => {
        if (userPar && userPar.id) {
            getParams()
            getUser()
        }
    }, [userPar, followersBol])
    if (errorLoading) {
        return (<InfoBox
                Icon={ExclamationCircleIcon}
                message={"Oops, an error occured"}
                content={`There was an error while fetching the users this user has followed`}
            />);
    }

    return (<div className="h-screen" style={{backgroundColor: '#BCEE7D', marginRight: '20px', borderRadius: '10px'}}>
            <main
                style={{
                    height: "calc(100vh - 4.5rem)", overflowY: "auto", display: "flex",
                }}
            >
                <Sidebar user={userPar} topDist={"0"} maxWidth={"250px"}/>
                <div
                    style={{
                        fontFamily: "Inter",
                        width: '50%',
                        margin: '20px auto 0',
                        overflowY: 'auto',
                        borderRadius: '10px',
                        padding: '20px',
                        backgroundColor: '#B2DB7E'
                    }}>
                    <div className="flex items-center ml-2">
                        <Title>Followers ·</Title>
                        <FollowersNumber className="text-gray-500 ml-2">
                            {followers?.length}
                        </FollowersNumber>
                    </div>
                    {followers.length > 0 ? (<div>
                            {followers.map((fol) => {
                                const isLoggedInUserFollowing = loggedUserFollowStats?.following?.length > 0 && loggedUserFollowStats?.following?.filter((loggedInUserFollowing) => loggedInUserFollowing?.user.id === fol?.user?.id).length > 0;
                                return (<div
                                        style={{
                                            marginBottom: '10px',
                                            border: "1px solid gray",
                                            width: '30%',
                                            padding: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            borderRadius: '10px',
                                            backgroundColor: '#BCEE7D',
                                            flexWrap: 'wrap'
                                        }}
                                        key={fol?.user?.id}
                                    >
                                        <div className="flex items-center  ">
                                            <Image src={fol?.user?.profilePicUrl|'error'} alt="userimg"   width={40} height={40}
                                                 style={{ borderRadius: '50%'}}/>
                                            <Link href={`/${fol?.user?.username}`}>
                                                <Name className="ml-2">
                                                    {fol?.user?.username.length > 10 ? fol.user.username.slice(0, 4) + '...' + fol.user.username.slice(-3) : fol?.user?.username}
                                                </Name>
                                            </Link>

                                        </div>
                                        {fol?.user?.id !== userPar?.id ? (<>
                                                {isLoggedInUserFollowing ? (<FollowButton
                                                        onClick={async () => {
                                                            const data = await unfollowUser(fol?.user?.id, setLoggedUserFollowStats, userPar?.id);
                                                            if (data && data.status === 200) {
                                                                change()
                                                            }
                                                        }}
                                                    >
                                                        <CheckCircleIcon className="h-6"/>
                                                        {/*<p className="ml-1.5">Following</p>*/}
                                                    </FollowButton>) : (<FollowButton
                                                        onClick={async () => {
                                                            const data = await followUser(fol?.user?.id, setLoggedUserFollowStats, userPar?.id);
                                                            if (data && data.status === 200) {
                                                                change()
                                                            }
                                                        }}
                                                    >
                                                        <UserAddIcon className="h-6"/>
                                                        {/*<p className="ml-1.5">Follow</p>*/}
                                                    </FollowButton>)}
                                            </>) : (<></>)}
                                    </div>);
                            })}
                        </div>) : router?.query?.userId === userPar?.id ? (<p className="text-md text-gray-500">
                            {`You don't have any followers ☹️. The trick is to follow someone and then
          wait for them to follow you back.`}
                        </p>) : (<p className="text-md text-gray-500">{`This user doesn't have any followers.`}</p>)}
                </div>
                <div className="w-10"></div>
            </main>
        </div>);
}

export default FollowersPage;

const FollowButton = styled.div`
  height: fit-content;
  padding: 0.5rem;
  display: flex;
  cursor: pointer;
  border-radius: 0.5rem;
  background-color: rgba(139, 92, 246);
  color: white;
  font-size: 1.1rem;
  font-family: "Inter";
  font-weight: 400;
`;

const Name = styled.p`
  cursor: pointer;
  user-select: none;
  font-weight: 500;
  font-size: 1.12rem;
  font-family: "Inter";

  :hover {
    text-decoration: underline;
  }
`;

const Title = styled.p`
  user-select: none;
  font-size: 20px;
  font-weight: 600;
  font-family: Inter;
`;

const FollowersNumber = styled.p`
  font-family: Inter;
  user-select: none;
  font-size: 20px;
  font-weight: 400;
`;

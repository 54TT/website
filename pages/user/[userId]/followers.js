import React, {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import baseUrl from "../../../utils/baseUrl";
import InfoBox from "../../../components/HelperComponents/InfoBox";
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    UserAddIcon,
} from "@heroicons/react/solid";
import styled from "styled-components";
import {followUser, unfollowUser} from "../../../utils/profileActions";
import Sidebar from "../../../components/Sidebar";
import {useSession} from "next-auth/react";

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
        const res = await axios.get(
            `${baseUrl}/api/profile/followers/${userPar.id}`,
        );
        if (res.status === 200) {
            setFollowers(res.data)
        } else {
            setFollowers([])
            setErrorLoading(true)
        }

    }

    const getUser = async () => {
        const res = await axios.get(`${baseUrl}/api/user/userFollowStats`, {
            params: {userId:userPar.id},
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
        return (
            <InfoBox
                Icon={ExclamationCircleIcon}
                message={"Oops, an error occured"}
                content={`There was an error while fetching the users this user has followed`}
            />
        );
    }

    return (
        <div className="bg-gray-100 h-screen">
            <main
                style={{
                    height: "calc(100vh - 4.5rem)",
                    overflowY: "auto",
                    display: "flex",
                }}
            >
                <Sidebar user={userPar} topDist={"0"} maxWidth={"250px"}/>
                <div
                    style={{fontFamily: "Inter"}}
                    className="mx-auto h-full w-full flex-1 max-w-md md:max-w-xl lg:max-w-[61.5rem] xl:max-w-[67rem] bg-white p-4 shadow-lg rounded-lg overflow-y-auto"
                >
                    <div className="flex items-center ml-2">
                        <Title>Followers ·</Title>
                        <FollowersNumber className="text-gray-500 ml-2">
                            {followers.length}
                        </FollowersNumber>
                    </div>
                    {followers.length > 0 ? (
                        <GridContainer className="grid-cols-1 lg:grid-cols-2">
                            {followers.map((fol) => {
                                const isLoggedInUserFollowing =
                                    loggedUserFollowStats?.following?.length > 0 &&
                                    loggedUserFollowStats?.following?.filter(
                                        (loggedInUserFollowing) =>
                                            loggedInUserFollowing?.user.id === fol?.user?.id
                                    ).length > 0;
                                return (
                                    <div
                                        style={{border: "1px solid #eee"}}
                                        key={fol?.user?.id}
                                        className="flex items-center justify-between p-4 mb-4 rounded-lg bg-white"
                                    >
                                        <div className="flex items-center  ">
                                            <img src={fol?.user?.profilePicUrl} alt="userimg"
                                                 style={{width: '40px', borderRadius: '50%'}}/>
                                            <Name
                                                className="ml-3"
                                                onClick={() => router.push(`/${fol?.user?.username}`)}
                                            >
                                                {fol?.user?.username.length > 10 ? fol.user.username.slice(0, 4) + '...' + fol.user.username.slice(-3) : fol?.user?.username}
                                            </Name>
                                        </div>
                                        {fol?.user?.id !== userPar?.id ? (
                                            <>
                                                {isLoggedInUserFollowing ? (
                                                    <FollowButton
                                                        onClick={async () => {
                                                            const data = await unfollowUser(
                                                                fol?.user?.id,
                                                                setLoggedUserFollowStats,
                                                                userPar?.id
                                                            );
                                                            if (data && data.status === 200) {
                                                                change()
                                                            }
                                                        }
                                                        }
                                                    >
                                                        <CheckCircleIcon className="h-6"/>
                                                        <p className="ml-1.5">Following</p>
                                                    </FollowButton>
                                                ) : (
                                                    <FollowButton
                                                        onClick={async () => {
                                                            const data = await followUser(
                                                                fol?.user?.id,
                                                                setLoggedUserFollowStats,
                                                                userPar?.id
                                                            );
                                                            if (data && data.status === 200) {
                                                                change()
                                                            }
                                                        }}
                                                    >
                                                        <UserAddIcon className="h-6"/>
                                                        <p className="ml-1.5">Follow</p>
                                                    </FollowButton>
                                                )}
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                );
                            })}
                        </GridContainer>
                    ) : router?.query?.userId === userPar?.id ? (
                        <p className="text-md text-gray-500">
                            {`You don't have any followers ☹️. The trick is to follow someone and then
          wait for them to follow you back.`}
                        </p>
                    ) : (
                        <p className="text-md text-gray-500">{`This user doesn't have any followers.`}</p>
                    )}
                </div>
                <div className="w-10"></div>
            </main>
        </div>
    );
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

const GridContainer = styled.div`
  display: grid;
  column-gap: 0.9rem;
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
  font-size: 1.65rem;
  font-weight: 600;
  font-family: Inter;
`;

const FollowersNumber = styled.p`
  font-family: Inter;
  user-select: none;
  font-size: 1.25rem;
  font-weight: 400;
  margin-top: -1.65rem;
`;

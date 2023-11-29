import React, {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import baseUrl from "../../../utils/baseUrl";
// import InfoBox from "../../../components/HelperComponents/InfoBox";
import Link from 'next/link'
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    UserAddIcon,
} from "@heroicons/react/solid";
import styled from "styled-components";
import {followUser, unfollowUser} from "../../../utils/profileActions";
import Sidebar from "../../../components/Sidebar";
import dynamic from 'next/dynamic'
import {getUser} from "../../../utils/axios";
import cook from "js-cookie";
const InfoBox = dynamic(() => import('../../../components/HelperComponents/InfoBox'),{suspense: false});
// const Sidebar = dynamic(() => import('../../../components/Sidebar'))
function FollowingPage() {
    const router = useRouter();
    const [user, setUser] = useState(null)
    const [followingArrayState, setFollowingArrayState] = useState(null);
    const [userFollowStats, setUserFollowStats] = useState(null);
    const [userFollowBol, setUserFollowBol] = useState(false);
    const getUs=async ()=>{
        const a =cook.get('name')
        const {data:{user},status} =   await getUser(a)
        if(user&&status===200){
            setUser(user)
        }else {
            setUser(null)
        }

    }
    useEffect(() => {
        if(cook.get('name')){
            getUs()
        }
    }, [cook.get('name')]);
    const chang = () => {
        setUserFollowBol(!userFollowBol)
    }
    const getUsers = async () => {
        const res = await axios.get(`${baseUrl}/api/user/userFollowStats`, {
            params: {userId: user?.id},
        });
        if (res?.status === 200) {
            setUserFollowStats(res.data.userFollowStats)
        }
    }
    const getParams = async () => {
        try {
            const res = await axios.get(
                `${baseUrl}/api/profile/following/${user?.id}`,);
            if (res && res.data) {
                setFollowingArrayState(res.data)
            } else {
                setFollowingArrayState([])
            }
        } catch (error) {
        }

    }

    useEffect(() => {
        if (user && user.id) {
            getParams()
            getUsers()
        }
    }, [user, userFollowBol])
    return (
        <div className=" h-screen"  style={{backgroundColor:'#rgb(253,213,62)',marginRight:'20px',borderRadius:'10px'}}>
            <main
                style={{
                    height: "calc(100vh - 4.5rem)",
                    overflowY: "auto",
                    display: "flex",
                }}
            >
                <Sidebar user={user} topDist={"0"} maxWidth={"250px"}/>
                <div
                    style={{
                        fontFamily: "Inter",
                        width: '50%',
                        margin: '20px auto 0',
                        overflowY: 'auto',
                        borderRadius: '10px',
                        padding: '20px',
                        backgroundColor:'#B2DB7E'
                    }}
                >
                    <div className="flex items-center ml-2">
                        <Title>Following ·</Title>
                        <FollowingNumber className="text-gray-500 ml-2">
                            {followingArrayState?.length||0}
                        </FollowingNumber>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        {followingArrayState && followingArrayState.length > 0 ? followingArrayState.map((fol) => {
                            const isLoggedInUserFollowing =
                                userFollowStats?.following?.length > 0 &&
                                userFollowStats?.following?.filter(
                                    (loggedInUserFollowing) =>
                                        loggedInUserFollowing?.user.id === fol?.user?.id
                                ).length > 0;
                            return (
                                <div
                                    style={{
                                        marginBottom: '10px',
                                        border: "1px solid gray",
                                        width: '30%',
                                        padding: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexWrap:'wrap',
                                        borderRadius: '10px',
                                        backgroundColor: '#BCEE7D'
                                    }}
                                    key={fol?.user?.id}
                                >
                                    <div className="flex items-center ">
                                        <img    width={40} height={40} style={{
                                            borderRadius: '50%'}} src={fol?.user?.profilePicUrl||'/Ellipse1.png'} alt="userimg"/>
                                        <Link href={`/${fol?.user?.username}`}>
                                            <Name className="ml-3">
                                                {fol?.user?.name.length > 9 ? fol?.user?.name.slice(0, 4) + '...' + fol?.user?.name.slice(-3) : fol?.user?.name}
                                            </Name>
                                        </Link>
                                    </div>
                                    {fol?.user?.id !== user?.id ? (
                                        <>
                                            {isLoggedInUserFollowing ? (
                                                <FollowButton
                                                    onClick={async () => {
                                                        const data = await unfollowUser(
                                                            fol.user.id,
                                                            setUserFollowStats,
                                                            user?.id
                                                        );
                                                        if (data.status === 200) {
                                                            chang()
                                                        }
                                                    }}
                                                >
                                                    <CheckCircleIcon className="h-6"/>
                                                    {/*<p className="ml-1.5">Following</p>*/}
                                                </FollowButton>
                                            ) : (
                                                <FollowButton
                                                    onClick={async () => {
                                                        const data = await followUser(
                                                            fol?.user?.id,
                                                            setUserFollowStats,
                                                            user?.id
                                                        );
                                                        if (data.status === 200) {
                                                            chang()
                                                        }
                                                    }}
                                                >
                                                    <UserAddIcon className="h-6 "/>
                                                    {/*<p className="ml-1.5">Follow</p>*/}
                                                </FollowButton>
                                            )}
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            );
                        }) :  router?.query?.userId === user?.id ? (<p className="text-md text-gray-500">
                            {`You don't have any followers ☹️. The trick is to follow someone and then
          wait for them to follow you back.`}
                        </p>) : (<p className="text-md text-gray-500">{`This user doesn't have any followers.`}</p>)}
                    </div>
                </div>
                <div className="w-10"></div>
            </main>
        </div>
    );
}
export default FollowingPage;

const FollowButton = styled.div`
  height: fit-content;
  padding: 10px;
  display: flex;
  cursor: pointer;
  border-radius: 10px;
  background-color: rgba(139, 92, 246);
  color: white;
  font-size: 18px;
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
  font-weight: bold;
  font-family: Inter;
`;

const FollowingNumber = styled.p`
  font-family: Inter;
  user-select: none;
  font-size: 20px;
`;

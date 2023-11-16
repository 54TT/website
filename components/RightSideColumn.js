import React, {useEffect, useState} from "react";
import styled from "styled-components";
import Link from "next/link";
import baseUrl from '/utils/baseUrl'
import calculateTime from "../utils/calculateTime";
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    UserAddIcon,
} from "@heroicons/react/solid";
import {Facebook} from "react-content-loader";
import axios from "axios";
import {followUser, unfollowUser} from "../utils/profileActions";
import {useRouter} from "next/router";
import {notification} from "antd";
import {LoadingOutlined} from '@ant-design/icons'

function RightSideColumn({user, chatsData, userFollowStats,change}) {
    const [bol, setBol] = useState(false)
    const chang = () => {
        setBol(!bol)
    }
    const router = useRouter();
    const [loggedInUserFollowStats, setLoggedInUserFollowStats] =
        useState([]);
    useEffect(() => {
        getUsersToFollow();
        if (userFollowStats&&userFollowStats.following&&userFollowStats.following.length > 0) {
            setLoggedInUserFollowStats(userFollowStats.following)
        } else {
            setLoggedInUserFollowStats([])
        }
    }, [bol,userFollowStats])
    const [usersToFollow, setUsersToFollow] = useState([]);
    const getUsersToFollow = async () => {
        try {
            const res = await axios.get(
                `${baseUrl}/api/profile/home/youMayLikeToFollow`,
            );
            if (res && res.data) {
                setUsersToFollow(res.data);
            } else {
                setUsersToFollow([]);
            }
        } catch (error) {
            notification.error({
                message: `Please note`, description: 'Error reported', placement: 'topLeft',
                duration:2
            });
        }
    };

    return (
        <ContainerDiv
            className="hidden  p-2 lg:block max-w-[300px] lg:min-w-[290px] xl:min-w-[300px] sticky xl:mr-8"
            style={{alignSelf: "flex-start", top: "5.45rem"}}
        >
            <Title>Who to follow</Title>
            {usersToFollow && usersToFollow.length > 0 && Array.isArray(usersToFollow) ? (
                usersToFollow.map((fol) => {
                    const isLoggedInUserFollowing =
                        loggedInUserFollowStats?.length > 0 &&
                        loggedInUserFollowStats?.filter(
                            (loggedInUserFollowing) =>
                                loggedInUserFollowing?.user?.id === fol?.id
                        ).length > 0 || '';
                    return (
                        <div  className={'rightSideCard'} key={fol.id}>
                            {fol?.id !== user?.id && (
                                <div
                                    key={fol.id}
                                    className="flex justify-between items-center p-4 rounded-lg"
                                >
                                    <div className="flex items-center">
                                        <img src={fol?.profilePicUrl ? fol.profilePicUrl : '/Ellipse5.png'}
                                             style={{width: '40px', borderRadius: '50%'}} alt="userimg"/>
                                        <div>
                                            <p
                                                className="ml-3 cursor-pointer hover:underline"
                                                onClick={() => router.push(`/${fol?.username}`)}
                                            >
                                                {fol?.username.length > 7 ? fol.username.slice(0, 3) + '...' + fol.username.slice('-3') : fol.name}
                                            </p>
                                            {
                                                <p style={{color: 'grey',}}
                                                   className="ml-3">{fol?.followers ? fol?.followers.length : 0} followers</p>}
                                        </div>
                                    </div>
                                    {fol?.id !== user?.id ? (
                                        <>
                                            {/*关注*/}
                                            {isLoggedInUserFollowing ? (
                                                <FollowButton
                                                    onClick={async () => {
                                                        const data = await unfollowUser(
                                                            fol.id,
                                                            '',
                                                            user?.id
                                                        );
                                                        if (data && data.status === 200) {
                                                            chang()
                                                            change()
                                                        }
                                                    }}
                                                >
                                                    <CheckCircleIcon className="h-6"/>
                                                </FollowButton>
                                            ) : (
                                                <FollowButton
                                                    onClick={async () => {
                                                        const data = await followUser(
                                                            fol.id,
                                                            '',
                                                            user?.id
                                                        );
                                                        if (data && data.status === 200) {
                                                            chang()
                                                            change()
                                                        }
                                                    }}
                                                >
                                                    <UserAddIcon className="h-6 w-6"/>
                                                </FollowButton>
                                            )}
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })
            ) : (
                <Facebook/>
            )}
            <Title>Recent chats</Title>
            <ChatContainerParent>
                {chatsData && Array.isArray(chatsData) ? (
                    chatsData.map((chat) => (
                        <ChatDiv
                            className="hover:bg-gray-200"
                            key={chat.textsWith}
                            onClick={() => router.push(`/chats?chat=${chat.textsWith}`)}
                        >
                            <div className="relative">
                                <img src={chat?.profilePicUrl ? chat.profilePicUrl : '/Ellipse5.png'}
                                     style={{width: '40px', borderRadius: '50%'}} alt="userimg"/>
                            </div>
                            <div className="ml-1">
                                <Name>{chat.name}</Name>
                                <p style={{color: 'grey',}}>
                                    {chat.texts && chat.texts.length > 30
                                        ? `${chat.texts.substring(0, 30)}...`
                                        : chat.texts}
                                </p>
                            </div>
                            {chat.created_at && (
                                <Date className="hidden xl:flex">
                                    {calculateTime(chat.created_at, true)}
                                </Date>
                            )}
                        </ChatDiv>
                    ))
                ) : (
                    <p>
                        You do not have any chats yet. Start a{" "}
                        <Link href={`/chats`} passHref>
                            chat
                        </Link>
                        with someone!
                    </p>
                )}
            </ChatContainerParent>
        </ContainerDiv>
    );
}

export default RightSideColumn;

const Title = styled.p`
  font-size: 1.1rem;
  font-family: inherit;
  font-weight: 500;
  margin-left: 0.4rem;
  margin-top: 1.5rem;
`;

const ContainerDiv = styled.div`
  font-family: "Inter";
  height: fit-content;
`;

const ChatContainerParent = styled.div`
  border-top: 0.5px solid lightgray;
`;

const ChatDiv = styled.div`
  overflow-y: auto;
  display: flex;
  cursor: pointer;
  border-radius: 0.2rem;
  border-bottom: 0.5px solid lightgray;
  font-family: Inter;
  padding: 0.9rem 0.8rem;
  align-items: flex-start;
  column-gap: 0.6rem;

  :hover {
  }
`;

const Name = styled.p`
  user-select: none;
  font-size: 1.05rem;
  font-family: Inter;
`;

const TextPreview = styled.p`
  font-family: Inter;
  margin-top: -0.95rem;
  color: grey;
  font-size: 0.9rem;
`;

const Date = styled.p`
  font-family: Inter;
  margin-left: auto;
`;

const FollowButton = styled.div`
  height: fit-content;
  width: fit-content;
  padding: 0.38rem;
  display: flex;
  cursor: pointer;
  border-radius: 0.5rem;
  background-color: rgba(139, 92, 246);
  color: white;
  font-size: 1.1rem;
  font-family: "Inter";
  font-weight: 400;

  :hover {
    background-color: rgba(109, 40, 217);
  }
`;

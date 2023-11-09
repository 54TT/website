import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import  baseUrl from '/utils/baseUrl'
import calculateTime from "../utils/calculateTime";
import cookie from "js-cookie";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserAddIcon,
} from "@heroicons/react/solid";
import { Facebook } from "react-content-loader";
import axios from "axios";
import { followUser, unfollowUser } from "../utils/profileActions";
import { useRouter } from "next/router";
import Loader from "react-loader-spinner";
import {notification} from "antd";

function RightSideColumn({ user, chatsData, userFollowStats }) {
  const router = useRouter();
  const [loggedInUserFollowStats, setLoggedInUserFollowStats] =
    useState({});
  console.log(loggedInUserFollowStats)
  useEffect(()=>{
    if(userFollowStats&&userFollowStats!=={}){
      setLoggedInUserFollowStats(userFollowStats)
      getUsersToFollow();
    }
  },[userFollowStats])
  const [usersToFollow, setUsersToFollow] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingWhoToF, setLoadingWhoToF] = useState(false);
  const getUsersToFollow = async () => {
    try {
      setLoadingWhoToF(true);
      const res = await axios.get(
          `${baseUrl}/api/profile/home/youMayLikeToFollow`,
          {
            headers: { Authorization: cookie.get("token") },
          }
      );
      setUsersToFollow(res.data);
      setLoadingWhoToF(false);
    } catch (error) {
      notification.error({
        message: `Please note`, description: 'Error reported', placement: 'topLeft',
      });
    }
  };

  return (
    <ContainerDiv
      className="hidden  p-2 lg:block max-w-[300px] lg:min-w-[290px] xl:min-w-[300px] sticky xl:mr-8"
      style={{ alignSelf: "flex-start", top: "5.45rem" }}
    >
      <Title>Who to follow</Title>
      {usersToFollow && usersToFollow.length > 0&&Array.isArray(usersToFollow) ? (
        usersToFollow.map((fol) => {
          const isLoggedInUserFollowing =
            loggedInUserFollowStats?.following?.length > 0 &&
            loggedInUserFollowStats?.following?.filter(
              (loggedInUserFollowing) =>
                loggedInUserFollowing?.user?.id === fol?.id
            ).length > 0||'';

          return (
            <div key={fol.id}>
              {fol?.id !== user?.id && (
                <div
                  style={{ border: ".5px solid lightgrey"}}
                  key={fol.id}
                  className="flex justify-between items-center p-4 mb-4 rounded-lg"
                >
                  <div className="flex items-center">
                    <UserImage src={fol.profilePicUrl} alt="userimg" />
                    <div>
                      <Name
                        className="ml-3 cursor-pointer hover:underline"
                        onClick={() => router.push(`/${fol.username}`)}
                      >
                        {fol.name}
                      </Name>
                      {loadingWhoToF ? (
                        <div
                          style={{
                            marginLeft: "1.5rem",
                            marginTop: "-0.95rem",
                          }}
                        >
                          <Loader
                            type="ThreeDots"
                            color="grey"
                            height={15}
                            width={15}
                            timeout={5000} //3 secs
                          />
                        </div>
                      ) : (
                        <TextPreview className="ml-3">{`${fol.followers ? fol.followers.length: 0} followers`}</TextPreview>
                      )}
                    </div>
                  </div>
                  {fol?.id !== user?.id ? (
                    <>
                      {/*关注*/}
                      {isLoggedInUserFollowing ? (
                        <FollowButton
                          onClick={async () => {
                            await unfollowUser(
                              fol.id,
                              setLoggedInUserFollowStats,
                              setLoading,user?.id
                            );
                          }}
                        >
                          <CheckCircleIcon className="h-6" />
                        </FollowButton>
                      ) : (
                        <FollowButton
                          onClick={async () => {
                            await followUser(
                              fol.id,
                                setLoggedInUserFollowStats,
                              setLoading,user?.id
                            );
                          }}
                        >
                          <UserAddIcon className="h-6 w-6" />
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
        <Facebook />
      )}
      <Title>Recent chats</Title>
      <ChatContainerParent>
        {chatsData&&Array.isArray(chatsData) ? (
          chatsData.map((chat) => (
            <ChatDiv
              className="hover:bg-gray-200"
              key={chat.textsWith}
              onClick={() => router.push(`/chats?chat=${chat.textsWith}`)}
            >
              <div className="relative">
                <UserImage src={chat.profilePicUrl} alt="userimg" />
              </div>

              <div className="ml-1">
                <Name>{chat.name}</Name>
                <TextPreview>
                  {chat.texts && chat.texts.length > 30
                    ? `${chat.texts.substring(0, 30)}...`
                    : chat.texts}
                </TextPreview>
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
            </Link>{" "}
            with someone!
          </p>
        )}
      </ChatContainerParent>
    </ContainerDiv>
  );
}

export default RightSideColumn;

const Title = styled.p`
  font-size: 1.21rem;
  font-family: inherit;
  font-weight: 500;
  margin-left: 0.4rem;
  margin-top: 2rem;
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

const UserImage = styled.img`
  height: 2.8rem;
  width: 2.8rem;
  border-radius: 50%;
  object-fit: cover;
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

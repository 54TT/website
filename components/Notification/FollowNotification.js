import React, {useEffect, useState} from "react";
import styled from "styled-components";
import calculateTime from "../../utils/calculateTime";
import Link from "next/link";
import {CheckCircleIcon, UserAddIcon} from "@heroicons/react/solid";
import {followUser, unfollowUser} from "../../utils/profileActions";

function FollowNotification({notification, userFollowStats, userPar, chang, }) {
    return (
        notification.type === "newFollower" && (
            <NotificationDiv>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <img style={{width: '50px', borderRadius: '50%', marginRight: '15px'}}
                         src={notification?.user?.profilePicUrl ? notification.user.profilePicUrl : '/avatar.png'}
                         alt="userimg"/>
                    <div style={{marginLeft: '10px'}}>
                        <p className="select-none">
                            <Link href={`/${notification.user.username}`} passHref>
                                {notification?.user?.name ? notification?.user?.name?.length > 10 ? notification.user.name.slice(0, 3) + '...' + notification.user.name.slice(-4) : notification.user.name : ''}
                            </Link>
                            started following you.
                        </p>
                        <p className="text-gray-500" style={{marginTop: "0"}}>
                            {calculateTime(notification.date, true)}
                        </p>
                    </div>
                </div>
                {userFollowStats?.following.length > 0 &&
                userFollowStats?.following.filter(
                    (following) => following?.user?.id === notification?.user?.id
                ).length > 0 ? (
                    <FollowButton
                        onClick={async () => {
                            const data = await unfollowUser(
                                notification?.user?.id,
                                '',
                                userPar?.id
                            );
                            if (data && data.status === 200) {
                                chang()
                            }
                        }}
                    >
                        <CheckCircleIcon className="h-5"/>
                        <p className="ml-1.5">Following</p>
                    </FollowButton>
                ) : (
                    <FollowButton
                        onClick={async () => {
                            const data = await followUser(
                                notification?.user?.id,
                                '',
                                userPar?.id
                            );
                            if (data && data.status === 200) {
                                chang()
                            }
                        }}
                    >
                        <UserAddIcon className="h-5"/>
                        <p className="ml-1.5">Follow back</p>
                    </FollowButton>
                )}
                {/* {notification.post.picUrl} */}
            </NotificationDiv>
        )
    );
}

export default FollowNotification;


const NotificationDiv = styled.div`
  display: flex;
  cursor: pointer;
  border-radius: 0.3rem;
  border-bottom: 1px solid #efefef;
  font-family: Inter;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
`;

const FollowButton = styled.div`
  height: fit-content;
  margin-left: 0.4rem;
  padding: 0.5rem;
  display: flex;
  cursor: pointer;
  border-radius: 0.5rem;
  /* border: 1.5px solid black; */
  background-color: transparent;
  color: rgba(107, 114, 128);
  align-self: flex-start;
  font-size: 0.95rem;
  font-family: "Inter";
  font-weight: 400;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
  rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;

  :hover {
    box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px,
    rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px,
    rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;
  }
`;

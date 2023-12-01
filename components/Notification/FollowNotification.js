import React, {useEffect, useState} from "react";
import calculateTime from "../../utils/calculateTime";
import Link from "next/link";
import {CheckCircleIcon, UserAddIcon} from "@heroicons/react/solid";
import styled from '/public/styles/all.module.css'
import {followUser, unfollowUser} from "../../utils/profileActions";

function FollowNotification({notification, userFollowStats, userPar, chang, }) {
    return (
        notification.type === "newFollower" && (
            <div className={styled.commentNotificationBox}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <img   height={50} width={50} style={{ borderRadius: '50%', marginRight: '15px'}}
                         src={notification?.user?.profilePicUrl ? notification.user.profilePicUrl : '/Ellipse1.png'}
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
                    <div className={styled.followNotificationBox}
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
                    </div>
                ) : (
                    <div  className={styled.followNotificationBox}
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
                    </div>
                )}
                {/* {notification.post.picUrl} */}
            </div>
        )
    );
}

export default FollowNotification;

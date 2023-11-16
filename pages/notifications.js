import axios from "axios";
import React, {useEffect, useState} from "react";
import styled from "styled-components";
import InfoBox from "../components/HelperComponents/InfoBox";
import Sidebar from "../components/Sidebar";
import baseUrl from "../utils/baseUrl";
import LikeNotification from "../components/Notification/LikeNotification";
import CommentNotification from "../components/Notification/CommentNotification";
import FollowNotification from "../components/Notification/FollowNotification";
import {useSession} from "next-auth/react";
import {notification} from "antd";

function Notifications() {
    const [notifications, setNotifications] = useState([])
    const [userPar, setUserPar] = useState(null)
    const [followStatsBol, setFollowStatsBol] = useState(false)

    const [userFollowStats, setLoggedUserFollowStats] = useState(null)
    const {data: session, status} = useSession()
    const chang = () => {
        setFollowStatsBol(!followStatsBol)
    }
    useEffect(() => {
        if (session && session.user) {
            setUserPar(session.user)
        }
    }, [session, session?.user, session?.userFollowStats]);
    const notificationRead = async () => {
        try {
            const data = await axios.get(
                `${baseUrl}/api/notifications`, {params: {userId: userPar.id}}
            );
            if (data.status === 200 && data.data) {
                setNotifications(data.data)
            }
        } catch (error) {
            notification.error({
                message: `Please note`, description: 'Error reported', placement: 'topLeft',
            });
        }
    };
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
            notificationRead();
            getUser()
        }
    }, [userPar, followStatsBol]);
    return (
        <div style={{backgroundColor:'rgb(188,238,125)',marginRight:"20px",borderRadius:'10px'}}>
            <main
                className="flex"
                style={{height: "calc(100vh - 4.5rem)"}}
            >
                <Sidebar user={userPar}/>
                <div
                    className="flex-grow mx-auto max-w-md md:max-w-lg lg:max-w-2xl p-4 shadow-lg rounded-lg overflow-y-auto" style={{backgroundColor:'rgb(178,219,126)'}}>
                    <div className="flex items-center ml-2">
                        <Title>Notifications ·</Title>
                        <NotificationCount className="text-gray-500 ml-2">
                            {notifications?.length}
                        </NotificationCount>
                    </div>

                    {notifications.length > 0 ? (
                        <div style={{borderTop: "1px solid #efefef"}}>
                            {notifications?.map((notification) =>{

                                 return   <div key={notification.id}>
                                        {notification.type === "newLike" &&
                                            notification.post !== null && (
                                                <LikeNotification notification={notification}/>
                                            )}
                                        {notification.type === "newComment" &&
                                            notification.post !== null && (
                                                <CommentNotification notification={notification}/>
                                            )}
                                        {notification.type === "newFollower" &&
                                            notification.post !== null && (
                                                <FollowNotification
                                                    notification={notification}
                                                    chang={chang}
                                                    userFollowStats={userFollowStats}
                                                    userPar={userPar}
                                                />
                                            )}
                                    </div>
                            })}
                        </div>
                    ) : (
                        <p className="text-md text-gray-500">
                            {`You don't have any notifications, ${userPar?.name}.`}
                        </p>
                    )}
                </div>
                <div className="bg-transparent flex-grow max-w-[290px]"></div>
            </main>
        </div>
    );
}

export default Notifications;

const Title = styled.p`
  user-select: none;
  font-size: 1.65rem;
  font-weight: 600;
  font-family: Inter;
`;

const NotificationCount = styled.p`
  font-family: Inter;
  user-select: none;
  font-size: 1.25rem;
  font-weight: 400;
  margin-top: -1.5rem;
`;

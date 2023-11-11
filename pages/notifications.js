import axios from "axios";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import InfoBox from "../components/HelperComponents/InfoBox";
import Sidebar from "../components/Sidebar";
import baseUrl from "../utils/baseUrl";
import LikeNotification from "../components/Notification/LikeNotification";
import CommentNotification from "../components/Notification/CommentNotification";
import FollowNotification from "../components/Notification/FollowNotification";
import cookie from "js-cookie";
import { ExclamationCircleIcon } from "@heroicons/react/outline";
import {useSession} from "next-auth/react";
import {notification} from "antd";

function Notifications() {
  const [notifications,setNotifications] =useState([])
  const [errorLoading,setErrorLoading] =useState(false)
  const [userPar,setUserPar] =useState(null)
  const [userFollowStats,setLoggedUserFollowStats] =useState(null)
  const {data: session, status} = useSession()
  useEffect(() => {
    if(session&&session.user){
      setUserPar(session.user)
    }
    if(session&&session.userFollowStats){
      setLoggedUserFollowStats(session.userFollowStats)
    }
  }, [session,session?.user,session?.userFollowStats]);



  const notificationRead = async () => {
    if(userPar&&userPar.id){
      try {
        const data =   await axios.post(
            `${baseUrl}/api/notifications`,
            {userId:userPar.id},
            {
              headers: { Authorization: cookie.get("token") },
            }
        );
        if(data.status===200&&data.data){
          setNotifications(data.data)
          setErrorLoading(false)
        }
      } catch (error) {
        setErrorLoading(true)
        notification.error({
          message: `Please note`, description: 'Error reported', placement: 'topLeft',
        });
      }
    }

  };

  useEffect(() => {
    notificationRead();
  }, []);

  if (errorLoading) {
    notification.error({
      message: `Please note`, description: `${errorLoading}`, placement: 'topLeft',
    });
    return (
      <InfoBox
        Icon={ExclamationCircleIcon}
        message={"Oops, an error occured"}
        content={`There was an error while fetching the notifications.`}
      />
    );
  }

  return (
    <div className="bg-gray-100">
      <main
        className="flex"
        style={{ height: "calc(100vh - 4.5rem)", overflowY: "auto" }}
      >
        <Sidebar user={userPar} />
        <div className="flex-grow mx-auto max-w-md md:max-w-lg lg:max-w-2xl bg-white p-4 shadow-lg rounded-lg overflow-y-auto">
          <div className="flex items-center ml-2">
            <Title>Notifications ·</Title>
            <NotificationCount className="text-gray-500 ml-2">
              {notifications.length}
            </NotificationCount>
          </div>

          {notifications.length > 0 ? (
            <div style={{ borderTop: "1px solid #efefef" }}>
              {notifications.map((notification) => (
                <div key={notification.id}>
                  {notification.type === "newLike" &&
                    notification.post !== null && (
                      <LikeNotification notification={notification} />
                    )}
                  {notification.type === "newComment" &&
                    notification.post !== null && (
                      <CommentNotification notification={notification} />
                    )}
                  {notification.type === "newFollower" &&
                    notification.post !== null && (
                      <FollowNotification
                        notification={notification}
                        userFollowStats={userFollowStats}
                      />
                    )}
                </div>
              ))}
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

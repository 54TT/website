import axios from "axios";
import React, {useEffect, useState} from "react";
import styled from "styled-components";
import InfoBox from "../components/HelperComponents/InfoBox";
import Sidebar from "../components/Sidebar";
import baseUrl from "../utils/baseUrl";
// import LikeNotification from "../components/Notification/LikeNotification";
// import CommentNotification from "../components/Notification/CommentNotification";
// import FollowNotification from "../components/Notification/FollowNotification";
import {notification} from "antd";
import dynamic from 'next/dynamic'
import {getUser} from "/utils/axios";
import cook from "js-cookie";
import {useAccount} from "wagmi";
// const Sidebar = dynamic(() => import('../components/Sidebar'));
const LikeNotification = dynamic(() => import('../components/Notification/LikeNotification'));
const CommentNotification = dynamic(() => import('../components/Notification/CommentNotification'));
const FollowNotification = dynamic(() => import('../components/Notification/FollowNotification'));




function Notifications() {
    const [notifications, setNotifications] = useState([])
    const [userPar, setUserPar] = useState(null)
    const {address} = useAccount()
    const [followStatsBol, setFollowStatsBol] = useState(false)
    const [userFollowStats, setLoggedUserFollowStats] = useState(null)
    const chang = () => {
        setFollowStatsBol(!followStatsBol)
    }
    const getUs=async ()=>{
        const {data:{user},status} =   await getUser(address)
        if(status===200&&user){
            setUserPar(user)
        }else {
            setUserPar('')
        }
    }
    useEffect(() => {
        if(address&&cook.get('name')){
            getUs()
        }
    }, [address]);
    const notificationRead = async () => {
        try {
            const data = await axios.get(
                `${baseUrl}/api/notifications`, {params: {userId: userPar?.id}}
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
    const getUsers = async () => {
        const res = await axios.get(`${baseUrl}/api/user/userFollowStats`, {
            params: {userId:userPar?.id},
        });
        if (res?.status === 200) {
            setLoggedUserFollowStats(res.data.userFollowStats)
        }
    }
    useEffect(() => {
        if (userPar && userPar.id) {
            notificationRead();
            getUsers()
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
                    style={{
                        fontFamily: "Inter",
                        width: '50%',
                        margin: '20px auto 0',
                        overflowY: 'auto',
                        borderRadius: '10px',
                        padding: '20px',
                        backgroundColor:'#B2DB7E'
                    }}>
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
                <div className="w-10"></div>
            </main>
        </div>
    );
}

export default Notifications;

const Title = styled.p`
  user-select: none;
  font-size: 20px;
  font-weight: bold;
  font-family: Inter;
`;

const NotificationCount = styled.p`
  font-family: Inter;
  user-select: none;
  font-size: 20px;
`;

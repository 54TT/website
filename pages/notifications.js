import React, {useContext, useEffect, useState} from "react";
import Sidebar from "../components/Sidebar";
import styles from '/public/styles/allmedia.module.css'
import dynamic from 'next/dynamic'
import cook from "js-cookie";

const LikeNotification = dynamic(() => import('../components/Notification/LikeNotification'), {ssr: false});
const CommentNotification = dynamic(() => import('../components/Notification/CommentNotification'), {ssr: false});
const FollowNotification = dynamic(() => import('../components/Notification/FollowNotification'), {ssr: false});
import {changeLang} from "/utils/set";
import cookie from "js-cookie";
import {request} from "../utils/hashUrl";
import {CountContext} from "../components/Layout/Layout";
import styled from "../public/styles/all.module.css";
function Notifications() {
    const social = changeLang('social')
    const {setLogin,changeTheme} = useContext(CountContext)
    const [notifications, setNotifications] = useState([])
    const [userPar, setUserPar] = useState(null)
    const [followStatsBol, setFollowStatsBol] = useState(false)
    const [userFollowStats, setLoggedUserFollowStats] = useState(null)
    const chang = () => {
        setFollowStatsBol(!followStatsBol)
    }
    const getUs = async () => {
        try {
            const params = JSON.parse(cookie.get('username'))
            const token = cookie.get('token')
            const data = await request('get', "/api/v1/userinfo/" + params?.uid, '', token)
            if (data === 'please') {
                setUserPar(null)
                setLogin()
            } else if (data && data?.status === 200) {
                const user = data?.data?.data
                if (user) {
                    setUserPar(user)
                } else {
                    setUserPar(null)
                }
            } else {
                setUserPar(null)
            }
        } catch (err) {
            setUserPar(null)
            return null
        }
    }
    useEffect(() => {
        if (cook.get('username') && cook.get('username') != 'undefined') {
            getUs()
        }
    }, [cook.get('username')]);
    const notificationRead = async () => {
        try {
            // const data = await axios.get(
            //     `${baseUrl}/api/notifications`, {params: {userId: userPar?.uid}}
            // );
            // if (data.status === 200 && data.data) {
            //     setNotifications(data.data)
            // }
        } catch (error) {
            setNotifications([])
        }
    };
    useEffect(() => {
        if (userPar && userPar.uid) {
            // notificationRead();
        }
    }, [userPar, followStatsBol]);

    // 获取屏幕
    const [winHeight, setHeight] = useState();
    const isAndroid = () => {
        const u = window?.navigator?.userAgent;
        if (u.indexOf("Android") > -1 || u.indexOf("iPhone") > -1) return true;
        return false;
    };
    useEffect(() => {
        if (isAndroid()) {
            setHeight(window.innerHeight - 180);
        } else {
            setHeight("auto");
        }
    });
    return (
        <div className={styles.allMobliceBox}>
            <div
                className={`${styles.allMoblice} ${changeTheme?'darknessTwo': 'brightTwo'}`}
                style={{
                    marginRight: "20px",
                    borderRadius: '10px',
                    height: winHeight,
                    minHeight: winHeight
                }}>
                <main
                    className={`flex ${styles.mobliceNotifications}`}>
                    <Sidebar user={userPar} maxWidth={"250px"}/>
                    <div className={`${changeTheme?'darknessThree':'noti'} ${styled.followersBoxData}`}>
                        <div className="flex items-center ml-2">
                            <p className={`${styled.followersBoxName} ${changeTheme?'fontW':'fontB'}`}>{social.notification} ·</p>
                            <p style={{
                                userSelect: 'none',
                                fontSize: '20px'
                            }} className="text-gray-500 ml-2">
                                {notifications?.length}
                            </p>
                        </div>

                        {notifications.length > 0 ? (
                            <div style={{borderTop: "1px solid #efefef"}}>
                                {notifications?.map((notification) => {
                                    return <div key={notification.id}>
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
                                {`${social.noti} ${userPar?.username || userPar?.address}.`}
                            </p>
                        )}
                    </div>
                    <div className="w-10"></div>
                </main>
            </div>
        </div>
    );
}

export default Notifications;


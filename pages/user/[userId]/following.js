import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import baseUrl from "../../../utils/baseUrl";
// import InfoBox from "../../../components/HelperComponents/InfoBox";
import Link from "next/link";
import { CheckCircleIcon, UserAddIcon } from "@heroicons/react/solid";
import { followUser, unfollowUser } from "../../../utils/profileActions";
import Sidebar from "../../../components/Sidebar";
import dynamic from "next/dynamic";
import cook from "js-cookie";
import styled from "/public/styles/all.module.css";
const InfoBox = dynamic(
  () => import("../../../components/HelperComponents/InfoBox"),
  { ssr: false }
);
// const Sidebar = dynamic(() => import('../../../components/Sidebar'))
import { changeLang } from "/utils/set";
import cookie from "js-cookie";
import {request} from "../../../utils/hashUrl";
function FollowingPage() {
  const social = changeLang("social");
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [followingArrayState, setFollowingArrayState] = useState(null);
  const [userFollowStats, setUserFollowStats] = useState(null);
  const [userFollowBol, setUserFollowBol] = useState(false);
  const getUs = async () => {
    const params = JSON.parse(cookie.get('username'))
    const data = await request('get', "/api/v1/userinfo/" + params?.uid,)
    if (data && data?.status === 200) {
      const user = data?.data?.data
      if (user) {
        setUser(user)
      } else {
        setUser(null)
      }
    } else {
      setUser(null)
    }
  };
  useEffect(() => {
    if (cook.get('username') && cook.get('username') != 'undefined') {
      getUs()
    }
  }, [cook.get('username')]);
  const chang = () => {
    setUserFollowBol(!userFollowBol);
  };
  const getUsers = async () => {
    const res = await axios.get(`${baseUrl}/api/user/userFollowStats`, {
      params: { userId: user?.id },
    });
    if (res?.status === 200) {
      setUserFollowStats(res.data.userFollowStats);
    }
  };
  const getParams = async () => {
    try {
      const res = await request('post','/api/v1/followee/list',{uid:user?.uid,page:1});
      if(res&&res?.status===200){
        setFollowingArrayState(res?.data?.followeeList)
      }
      // if (res && res.data) {
      //   setFollowingArrayState(res.data);
      // } else {
      //   setFollowingArrayState([]);
      // }
    } catch (error) {
      return null
    }
  };

  useEffect(() => {
    if (user && user.uid) {
      getParams();
      // getUsers();
    }
  }, [user, userFollowBol]);
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
    <div className={styled.allMoblice}>
      <div
        className={`h-screen ${styled.followersBox} ${styled.allMobliceW}`}
        style={{ height: winHeight, minHeight: winHeight }}
      >
        <main className={styled.followersBoxMin}>
          <Sidebar user={user} topDist={"0"} maxWidth={"250px"} />
          <div className={styled.followersBoxData}>
            <div className="flex items-center ml-2">
              <p className={styled.followersBoxName}>{social.following} ·</p>
              <p
                style={{
                  userSelect: "none",
                  fontSize: "20px",
                }}
                className="text-gray-500 ml-2"
              >
                {followingArrayState?.length || 0}
              </p>
            </div>
            <div className={styled.followingBox}>
              {followingArrayState && followingArrayState.length > 0 ? (
                followingArrayState.map((fol) => {
                  const isLoggedInUserFollowing =
                    userFollowStats?.following?.length > 0 &&
                    userFollowStats?.following?.filter(
                      (loggedInUserFollowing) =>
                        loggedInUserFollowing?.user.id === fol?.user?.id
                    ).length > 0;
                  return (
                    <div
                      className={styled.followersBoxFollow}
                      key={fol?.user?.id}
                    >
                      <div className="flex items-center ">
                        <img
                          width={40}
                          height={40}
                          style={{
                            borderRadius: "50%",
                          }}
                          src={fol?.avatar|| "/Ellipse1.png"}
                          alt="userimg"
                        />
                        <Link href={`/${fol?.uid}`}>
                          <p className={`ml-3 ${styled.followersBoxLink}`}>
                            {fol?.username.length > 9
                              ? fol?.username.slice(0, 4) +
                                "..." +
                                fol?.username.slice(-3)
                              : fol?.username}
                          </p>
                        </Link>
                      </div>
                      {/*关注或者   取关*/}
                      {/*{fol?.uid !== user?.uid ? (*/}
                      {/*  <>*/}
                      {/*    {isLoggedInUserFollowing ? (*/}
                      {/*      <div*/}
                      {/*        className={styled.followersBoxFoll}*/}
                      {/*        onClick={async () => {*/}
                      {/*          const data = await unfollowUser(*/}
                      {/*            fol.user.id,*/}
                      {/*            setUserFollowStats,*/}
                      {/*            user?.id*/}
                      {/*          );*/}
                      {/*          if (data.status === 200) {*/}
                      {/*            chang();*/}
                      {/*          }*/}
                      {/*        }}*/}
                      {/*      >*/}
                      {/*        <CheckCircleIcon className="h-6" />*/}
                      {/*        /!*<p className="ml-1.5">Following</p>*!/*/}
                      {/*      </div>*/}
                      {/*    ) : (*/}
                      {/*      <div*/}
                      {/*        className={styled.followersBoxFoll}*/}
                      {/*        onClick={async () => {*/}
                      {/*          const data = await followUser(*/}
                      {/*            fol?.user?.id,*/}
                      {/*            setUserFollowStats,*/}
                      {/*            user?.id*/}
                      {/*          );*/}
                      {/*          if (data.status === 200) {*/}
                      {/*            chang();*/}
                      {/*          }*/}
                      {/*        }}*/}
                      {/*      >*/}
                      {/*        <UserAddIcon className="h-6 " />*/}
                      {/*        /!*<p className="ml-1.5">Follow</p>*!/*/}
                      {/*      </div>*/}
                      {/*    )}*/}
                      {/*  </>*/}
                      {/*) : (*/}
                      {/*  <></>*/}
                      {/*)}*/}
                    </div>
                  );
                })
              ) :  Number(router?.query?.userId) === Number(user?.uid) ? (
                <p className="text-md text-gray-500">{social.followerGet}</p>
              ) : (
                <p className="text-md text-gray-500">{social.followerNo}</p>
              )}
            </div>
          </div>
          <div className="w-10"></div>
        </main>
      </div>
    </div>
  );
}
export default FollowingPage;

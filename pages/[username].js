import React, {useContext, useEffect, useRef, useState} from "react";
import baseUrl from "/utils/baseUrl";
import {CheckCircleIcon, UserAddIcon} from "@heroicons/react/solid";

import {
    followUser,
    unfollowUser,
    profilePicturesUpdate,
} from "../utils/profileActions";
import {
    LoadingOutlined,
    CameraOutlined,
    FormOutlined,
    CloseOutlined,
    CheckOutlined,
} from "@ant-design/icons";
import {Avatar, Input, notification, Image, Skeleton} from "antd";
import styles from "/public/styles/allmedia.module.css";
import {useRouter} from "next/router";
import InfiniteScroll from 'react-infinite-scroll-component';
import {EmojiSadIcon} from "@heroicons/react/outline";
import dynamic from "next/dynamic";

const PostCard = dynamic(() => import("../components/PostCard"), {
    ssr: false,
});
const InfoBox = dynamic(
    () => import("../components/HelperComponents/InfoBox"),
    {ssr: false}
);
const ProfileFields = dynamic(
    () => import("../components/ProfileComponents/ProfileFields"),
    {ssr: false}
);
const FollowingUsers = dynamic(
    () => import("../components/ProfileComponents/FollowingUsers"),
    {ssr: false}
);
const FollowerUsers = dynamic(
    () => import("../components/ProfileComponents/FollowerUsers"),
    {ssr: false}
);
import {CountContext} from '/components/Layout/Layout';
import styled from "/public/styles/all.module.css";
import {request} from "../utils/hashUrl";
import cookie from "js-cookie";

function ProfilePage() {
    const {changeBolName, changeTheme, setLogin} = useContext(CountContext);
    const coverImageRef = useRef(null);
    const profilePicRef = useRef(null);
    const [user, setUser] = useState(null);
    const [showLoad, setShowLoad] = useState(true);
    const [LoginUser, setLoginUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [userFollowStats, setUserFollowStats] = useState(null);
    const [coverPicPreview, setCoverPicPreview] = useState("");
    const [profilePicPreview, setProfilePicPreview] = useState(null);
    const isUserOnOwnAccount = Number(LoginUser?.uid) === Number(user?.uid)
    const [editProfile, setEditProfile] = useState(false);
    const [editInput, setEditInput] = useState("");
    useEffect(() => {
        if (cookie.get('username') && cookie.get('username') != 'undefined') {
            const data = JSON.parse(cookie.get('username'))
            setLoginUser(data)
        }
    }, [cookie.get('username')])
    //      changeTheme?'darknessThrees':'brightTwo'
    // 推文  page
    const [page, setPage] = useState(1);
    const router = useRouter();
    const params = router.query;
    // 推文
    const [posts, setPosts] = useState([]);
    const [postsAdd, setPostsAdd] = useState([]);

    //  loading
    const [postsLoad, setPostsLoad] = useState(true);
    const [postsBol, setPostsBol] = useState(false);
    useEffect(() => {
        if (postsBol) {
            if (posts && posts.length > 0) {
                if (postsAdd.length > 0) {
                    const data = [...postsAdd.concat(posts)]
                    setPostsAdd(data)
                    setPostsLoad(false)
                } else {
                    setPostsAdd(posts)
                    setPostsLoad(false)
                }
            }
            setPostsBol(false)
        }
    }, [postsBol])
    // 是否为关注者
    const [followBol, setFollowBol] = useState(false);
    const isLoggedInUserFollowing =
        userFollowStats?.following?.length > 0 &&
        userFollowStats.following?.filter(
            (following) => following?.following_id === user?.user_id
        ).length > 0;

    useEffect(() => {
        setFollowBol(isLoggedInUserFollowing);
    }, [isLoggedInUserFollowing]);

    const addImageFromDevice = async (e, name) => {
        try {
            const {files} = e.target;
            const token = cookie.get('token')
            const data = await request('post', '/api/v1/upload/image', files[0], token);
            if (data === 'please') {
                setLogin()
            } else if (data && data?.status === 200) {
                if (name !== "cover") {
                    try {
                        const res = await request('post', "/api/v1/userinfo", {
                            user: {
                                ...user,
                                avatarUrl: data?.data?.url,
                            }
                        }, token);
                        if (res && res?.status === 200) {
                            setPage(1)
                            change()
                            setPostsAdd([])
                            changeBolName(true);
                            setProfilePicPreview(URL.createObjectURL(files[0]));
                        }
                    } catch (err) {
                        return null
                    }
                } else {
                    try {
                        const res = await request('post', "/api/v1/userinfo", {
                            user: {
                                ...user,
                                coverUrl: data?.data?.url,
                            }
                        }, token);
                        if (res && res?.status === 200) {
                            setPage(1)
                            change()
                            setPostsAdd([])
                            changeBolName(true);
                            setCoverPicPreview(URL.createObjectURL(files[0]));
                        }
                    } catch (err) {
                        return null
                    }
                }
            }
        } catch (err) {
            return null
        }
    };
    useEffect(() => {
        return () => {
            setPostsAdd([])
        }
    }, [])
    // 获取推文
    const getPosts = async () => {
        try {
            const token = cookie.get('token')
            const res = await request('post', '/api/v1/post/list', {uid: params.username, page: page}, token)
            if (res === 'please') {
                setPosts([])
                setPostsBol(true)
                setLogin()
            } else if (res && res?.data) {
                setPosts(res?.data?.posts)
                setPostsBol(true)
            } else {
                setPosts([])
                setPostsBol(true)
            }
        } catch (err) {
            setPosts([])
            setPostsBol(true)
            return null
        }
    };
    // 获取用户
    const getProfile = async () => {
        try {
            const token = cookie.get('token')
            const data = await request('get', "/api/v1/userinfo/" + params?.username, '', token);
            if (data === 'please') {
                setLogin()
                setShowLoad(false)
            } else if (data && data.status === 200) {
                setEditInput(data?.data?.data.username ? data?.data?.data.username : data?.data?.data.address)
                setUser(data?.data?.data)
                setShowLoad(false)
            }
        } catch (error) {
            setShowLoad(false)
            return null
        }
    };
    useEffect(() => {
        if (params && params?.username) {
            getProfile();
            getPosts();
        }
    }, [params])
    const chang = () => {
        setFollowBol(!followBol);
    };
    const [changeBol, setChangeBol] = useState(false);
    useEffect(() => {
        if (changeBol) {
            getPosts();
            setChangeBol(false)
        }
    }, [changeBol]);

    const changePage = () => {
        setPage(page + 1)
        change()
    }
    const change = () => {
        setChangeBol(true);
    };
    const setName = async () => {
        try {
            if (editInput) {
                const token = cookie.get('token')
                const data = await request('post', "/api/v1/userinfo", {
                    user: {
                        ...user,
                        username: editInput,
                    }
                }, token);
                if (data === 'please') {
                    setEditProfile(false)
                    changeBolName(true);
                    setPostsAdd([])
                    setPage(1)
                    setLogin()
                } else if (data && data?.status === 200 && data?.data?.code === 200) {
                    setEditProfile(false)
                    changeBolName(true);
                    setPostsAdd([])
                    setPage(1)
                    change()
                } else {
                    setEditProfile(false)
                }
            } else {
                setEditInput(user?.username ? user?.username : user?.address);
                setEditProfile(false);
            }
        } catch (err) {
            setEditProfile(false)
            return null
        }
    };
    const changeIn = async (e) => {
        setEditInput(e.target.value);
    };
    return (
        <>
            <div className={styles.allMobliceBox}>
                {/**/}
                {/*上面*/}
                <div
                    // ${changeTheme?'darknessThrees':'brightTwo'} introBack
                    className={` ${
                        !isUserOnOwnAccount ? "min-h-[32.4rem]" : "min-h-[29.3rem]"
                    }  shadow-lg ${styled.usernameBox} ${styles.allMoblice} ${changeTheme ? 'darknessThrees' : 'usernameBack'}`}>
                    <div className={styled.usernameBoxTop}>
                        {/*修改背景图*/}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => addImageFromDevice(e, "cover")}
                            name="media"
                            ref={coverImageRef}
                            style={{display: "none"}}
                        ></input>
                        {/*背景图*/}
                        <Image
                            src={
                                coverPicPreview ? coverPicPreview : user?.coverUrl ? user?.coverUrl
                                    : 'error'
                            }
                            alt="cover pic"
                            width={"100%"}
                            height={"100%"}
                        />
                        {/*修改图像*/}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => addImageFromDevice(e, "profile")}
                            name="media"
                            ref={profilePicRef}
                            style={{display: "none"}}
                        ></input>
                        {/*图像*/}
                        {
                            showLoad ? <Skeleton.Avatar active={true} shape={'circle'}/> :
                                <Avatar onClick={() => profilePicRef.current.click()}
                                        src={profilePicPreview ? profilePicPreview : user?.avatarUrl ? user?.avatarUrl : '/dexlogo.svg'}
                                        size={100}
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            cursor: 'pointer',
                                            translate: "-50% -50%",
                                        }}
                                />
                        }
                        {/*修改name*/}
                        <div className={styled.usernameBoxSetName}>
                            {editProfile ? (
                                <Input
                                    onChange={changeIn}
                                    value={editInput}
                                    style={{fontSize: "20px", fontWeight: "bold"}}
                                />
                            ) : (
                                showLoad ? <Skeleton.Button active={true} shape={'default'}/> :
                                    <p className={styles.mobliceEditInput}
                                       style={{fontSize: "20px", fontWeight: "bold"}}>
                                        {editInput}
                                    </p>
                            )}
                            {/*提交按钮*/}
                            {editProfile ? (
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginLeft: "10px",
                                }}
                                >
                                    <CloseOutlined
                                        style={{fontSize: "20px", fontWeight: "bold"}}
                                        onClick={() => {
                                            setEditProfile(false)
                                            setEditInput(user.username ? user.username : user.address)
                                        }}
                                    />{" "}
                                    <CheckOutlined
                                        style={{
                                            fontSize: "20px",
                                            fontWeight: "bold",
                                            marginLeft: "10px",
                                        }}
                                        onClick={setName}
                                    />
                                </div>
                            ) : (isUserOnOwnAccount ? <FormOutlined
                                className={styled.usernameBoxIcon}
                                onClick={() => setEditProfile(true)}
                            /> : '')
                            }
                        </div>
                        {/*是否本人*/}
                        {!showLoad && !(Number(LoginUser?.uid) === Number(user?.uid)) ?
                            //   如果不是本人  是否关注
                            (followBol ? (
                                <div
                                    className={styled.usernameBoxDiv}
                                    onClick={async () => {
                                        try {
                                            const token = cookie.get('token')
                                            const data = await request('post', "/api/v1/unfollow", {uid: user?.uid}, token)
                                            if (data === 'please') {
                                                setLogin()
                                            } else if (data && data?.status === 200 && data?.data?.code === 200) {
                                                chang()
                                            }
                                        } catch (err) {
                                            return null
                                        }
                                    }}>
                                    <CheckCircleIcon className="h-6"/>
                                    <p className="ml-1.5">Following</p>
                                </div>
                            ) : (
                                <div
                                    className={styled.usernameBoxDiv}
                                    onClick={async () => {
                                        try {
                                            const token = cookie.get('token')
                                            const data = await request('post', "/api/v1/follow", {userId: user?.uid}, token)
                                            if (data === 'please') {
                                                setLogin()
                                            } else if (data && data?.status === 200 && data?.data?.code === 200) {
                                                chang()
                                            }
                                        } catch (err) {
                                            return null
                                        }
                                    }}>
                                    <UserAddIcon className="h-6"/>
                                    <p className="ml-1.5">Follow</p>
                                </div>
                            )) : ''}

                        {isUserOnOwnAccount && (
                            <div
                                className={styled.usernameBoxUpdate}
                                onClick={() => coverImageRef.current.click()}>
                                <img src="/Camera.svg" alt="" style={{width: '20px', borderRadius: '50%',}}/>
                            </div>
                        )}
                    </div>
                    {/*下面*/}
                    <div className={`w-full ${styled.usernameBoxBot} ${changeTheme ? 'darknessThrees' : 'brightTwo'}`}>
                        <div
                            className=" md:flex space-x-4 mx-auto max-w-[30rem] sm:max-w-xl md:max-w-3xl lg:max-w-[1000px]">
                            {/*左边关注*/}
                            <div className="max-w-[28rem] ml-4 static mt-3 md:sticky md:mt-6 flex-1 md:max-w-[27rem]"
                                 style={{
                                     alignSelf: "flex-start",
                                 }}>
                                <ProfileFields
                                    user={user}
                                    change={change}
                                    showLoad={showLoad}
                                    getProfile={getProfile}
                                    isUserOnOwnAccount={isUserOnOwnAccount}
                                />
                                {/*粉丝*/}
                                <FollowingUsers
                                    isUserOnOwnAccount={isUserOnOwnAccount}
                                    showLoad={showLoad}
                                    userFollowStats={userFollowStats}
                                    user={user}
                                />
                                {/*我关注者*/}
                                <FollowerUsers
                                    isUserOnOwnAccount={isUserOnOwnAccount}
                                    showLoad={showLoad}
                                    userFollowStats={userFollowStats}
                                    user={user}
                                />
                                <div className="h-9"></div>
                            </div>
                            {/*右边推文*/}
                            <div className={`flex-1 flex-grow mt-6 max-w-md md:max-w-lg lg:max-w-2xl`}>
                                {postsAdd.length > 0 ? (
                                    postsAdd.map((post, index) => {
                                        const isLiked =
                                            post.likes &&
                                            post.likes.length > 0 &&
                                            post.likes.filter((like) => like?.user?.id === user?.id)
                                                .length > 0;
                                        return (
                                            <InfiniteScroll
                                                hasMore={true}
                                                next={changePage}
                                                endMessage={
                                                    <p style={{textAlign: 'center'}}>
                                                        <b>Yay! You have seen it all</b>
                                                    </p>
                                                }
                                                loader={null}
                                                dataLength={posts.length}
                                                key={index}
                                            >
                                                <PostCard
                                                    key={index}
                                                    liked={isLiked}
                                                    post={post}
                                                    user={user}
                                                    change={change}
                                                />
                                            </InfiniteScroll>
                                        );
                                    })
                                ) : (postsLoad ? <Skeleton active/> :
                                        <InfoBox
                                            marginTop={1}
                                            Icon={EmojiSadIcon}
                                            message={
                                                isUserOnOwnAccount
                                                    ? `You don't have any posts, ${editInput}.`
                                                    : "No posts"
                                            }
                                            content={
                                                isUserOnOwnAccount
                                                    ? `Create a new post to start seeing posts here and get your faeshare of attention.`
                                                    : "This user hasn't made a single post. It looks like they are only interested in viewing other posts and lurking around."
                                            }
                                        />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfilePage;

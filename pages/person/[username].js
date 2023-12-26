import React, {useContext, useEffect, useRef, useState} from "react";
import {CheckCircleIcon, UserAddIcon} from "@heroicons/react/solid";
import {
    FormOutlined,
    CloseOutlined,
    CheckOutlined, MessageOutlined
} from "@ant-design/icons";
import {Avatar, Input, notification, Image, Skeleton} from "antd";
import styles from "/public/styles/allmedia.module.css";
import {useRouter} from "next/router";
import InfiniteScroll from 'react-infinite-scroll-component';
import {EmojiSadIcon} from "@heroicons/react/outline";
import dynamic from "next/dynamic";

const PostCard = dynamic(() => import("/components/PostCard"), {
    ssr: false,
});
const InfoBox = dynamic(
    () => import("/components/HelperComponents/InfoBox"),
    {ssr: false}
);
const ProfileFields = dynamic(
    () => import("/components/ProfileComponents/ProfileFields"),
    {ssr: false}
);
const FollowingUsers = dynamic(
    () => import("/components/ProfileComponents/FollowingUsers"),
    {ssr: false}
);
const FollowerUsers = dynamic(
    () => import("/components/ProfileComponents/FollowerUsers"),
    {ssr: false}
);
import {CountContext} from '/components/Layout/Layout';
import styled from "/public/styles/all.module.css";
import {request} from "/utils/hashUrl";
import cookie from "js-cookie";

function ProfilePage() {
    const {changeBolName, changeTheme, setLogin} = useContext(CountContext);
    const coverImageRef = useRef(null);
    const profilePicRef = useRef(null);
    const [user, setUser] = useState(null);
    const [showLoad, setShowLoad] = useState(true);
    const [LoginUser, setLoginUser] = useState(null);
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
    // 是否为关注者  isFollowed
    const [followBol, setFollowBol] = useState(null);
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
                        if (res === 'please') {
                            setLogin()
                        } else if (res && res?.status === 200) {
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
                        if (res === 'please') {
                            setLogin()
                        } else if (res && res?.status === 200) {
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
                setFollowBol(data?.data?.isFollowed)
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
    const pushLink = () => {
        router.push('/chats?chat=' + router?.query?.username)
    }
    return (
        <>
            <div className={styles.allMobliceBox}>
                {/*上面*/}
                <div
                    className={` ${
                        !isUserOnOwnAccount ? "min-h-[32.4rem]" : "min-h-[29.3rem]"
                    }  shadow-lg ${styled.usernameBox} ${styles.allMoblice} ${changeTheme ? '' : 'usernameBack'}`}>
                    <div className={styled.usernameBoxTop}>
                        {/*用户数据*/}
                        <div style={{
                            width: '50%',
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            zIndex: '10',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <>
                                {/*图像*/}
                                {
                                    showLoad ? <Skeleton.Avatar active={true} shape={'circle'}/> :
                                        <Avatar onClick={() => {
                                            if (Number(LoginUser?.uid) === Number(user?.uid)) {
                                                profilePicRef.current.click()
                                            }
                                        }}
                                                src={profilePicPreview ? profilePicPreview : user?.avatarUrl ? user?.avatarUrl : '/dexlogo.svg'}
                                                size={120}
                                        />
                                }
                                {/*关注*/}
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
                                                        setFollowBol(!followBol)
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
                                                        setFollowBol(!followBol)
                                                    }
                                                } catch (err) {
                                                    return null
                                                }
                                            }}>
                                            <UserAddIcon className="h-6"/>
                                            <p className="ml-1.5">Follow</p>
                                        </div>
                                    )) : ''}
                            </>
                            <div style={{marginLeft: '100px'}}>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    {/*修改name*/}
                                    <div className={styled.usernameBoxSetName}>
                                        {/*提交按钮*/}
                                        {editProfile ? (
                                            <div style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginLeft: "10px",
                                            }}>
                                                <CloseOutlined
                                                    style={{
                                                        fontSize: "20px",
                                                        fontWeight: "bold",
                                                        color: 'rgb(59,55,71)'
                                                    }}
                                                    onClick={() => {
                                                        setEditProfile(false)
                                                        setEditInput(user.username ? user.username : user.address)
                                                    }}
                                                />
                                                <CheckOutlined
                                                    style={{
                                                        fontSize: "20px",
                                                        fontWeight: "bold",
                                                        marginLeft: "10px", color: 'rgb(59,55,71)'
                                                    }}
                                                    onClick={setName}
                                                />
                                            </div>
                                        ) : (isUserOnOwnAccount ?
                                            <img src="/Group188.svg" width={'20px'} style={{cursor: 'pointer',marginRight:'20px'}} alt=""
                                                 onClick={() => setEditProfile(true)}/>
                                            : '')
                                        }
                                        {/*name*/}
                                        {editProfile ? (
                                            <Input
                                                onChange={changeIn}
                                                value={editInput}
                                                style={{fontSize: "24px",}}
                                            />
                                        ) : (
                                            showLoad ? <Skeleton.Button active={true} shape={'default'}/> :
                                                <p className={` ${changeTheme ? 'fontW' : 'fontB'} ${styles.mobliceEditInput}`}
                                                   style={{fontSize: "24px",lineHeight:'1'}}>
                                                    {editInput}
                                                </p>
                                        )}
                                    </div>
                                    {/*上传  背景*/}
                                    {isUserOnOwnAccount && (
                                        <div
                                            className={styled.usernameBoxUpdate}
                                            onClick={() => coverImageRef.current.click()}>
                                            <img src="/backSet.svg" alt="" width={'20px'}/>
                                        </div>
                                    )}
                                </div>
                                {/*多少关注者*/}
                                <div className={styled.followers}>
                                    <p className={changeTheme?'fontW':'fontB'} style={{fontSize:'20px'}}>55</p>
                                    <p className={changeTheme?'fontW':'fontB'} style={{margin:'0 7px',fontSize:'14px'}}>Following</p>
                                    <p className={changeTheme?'fontW':'fontB'}>|</p>
                                    <p className={changeTheme?'fontW':'fontB'} style={{fontSize:'20px',margin:'0 7px'}}>66</p>
                                    <p className={changeTheme?'fontW':'fontB'} style={{fontSize:'14px'}}>Follower</p>
                                </div>
                            </div>
                        </div>
                        {/*修改背景图*/}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (Number(LoginUser?.uid) === Number(user?.uid)) {
                                    addImageFromDevice(e, "cover")
                                }
                            }}
                            name="media"
                            ref={coverImageRef}
                            style={{display: "none"}}
                        ></input>
                        {/*背景图*/}
                        <Image
                            src={
                                coverPicPreview ? coverPicPreview : user?.coverUrl ? user?.coverUrl
                                    : '/backto.gif'
                            }
                            alt="cover pic"
                            width={'100%'}
                        />
                        {/*修改图像*/}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (Number(LoginUser?.uid) === Number(user?.uid)) {
                                    addImageFromDevice(e, "profile")
                                }
                            }}
                            name="media"
                            ref={profilePicRef}
                            style={{display: "none"}}
                        ></input>

                    </div>
                    {
                        !(Number(LoginUser?.uid) === Number(user?.uid)) &&
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <MessageOutlined onClick={pushLink} className={changeTheme ? 'fontW' : 'fontB'}
                                             style={{fontSize: '20px', cursor: 'pointer'}}/>
                        </div>
                    }
                    {/*下面*/}
                    <div className={`w-full ${styled.usernameBoxBot} ${changeTheme ? '' : 'brightTwo'}`}>
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
                                {/*<FollowingUsers*/}
                                {/*    isUserOnOwnAccount={isUserOnOwnAccount}*/}
                                {/*    showLoad={showLoad}*/}
                                {/*    userFollowStats={userFollowStats}*/}
                                {/*    user={user}*/}
                                {/*/>*/}
                                {/*我关注者*/}
                                {/*<FollowerUsers*/}
                                {/*    isUserOnOwnAccount={isUserOnOwnAccount}*/}
                                {/*    showLoad={showLoad}*/}
                                {/*    userFollowStats={userFollowStats}*/}
                                {/*    user={user}*/}
                                {/*/>*/}
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

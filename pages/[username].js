import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import baseUrl from '/utils/baseUrl'
import {
    CheckCircleIcon,
    UserAddIcon,
} from "@heroicons/react/solid";
import uploadPic from "../utils/uploadPic";
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
    CheckOutlined
} from '@ant-design/icons'
import {Avatar, Input, notification,Image} from 'antd'
import axios from "axios";
// import ProfileFields from "../components/ProfileComponents/ProfileFields";
// import FollowingUsers from "../components/ProfileComponents/FollowingUsers";
// import FollowerUsers from "../components/ProfileComponents/FollowerUsers";
import {useRouter} from "next/router";
// import PostCard from "../components/PostCard";
// import InfoBox from "../components/HelperComponents/InfoBox";
import {EmojiSadIcon} from "@heroicons/react/outline";
import dynamic from 'next/dynamic'
import cook from "js-cookie";
import {useAccount} from "wagmi";
const PostCard = dynamic(() => import('../components/PostCard'));
const InfoBox = dynamic(() => import('../components/HelperComponents/InfoBox'));
const ProfileFields = dynamic(() => import('../components/ProfileComponents/ProfileFields'));
const FollowingUsers = dynamic(() => import('../components/ProfileComponents/FollowingUsers'));
const FollowerUsers = dynamic(() => import('../components/ProfileComponents/FollowerUsers'));
import {getUser} from "/utils/axios";


function ProfilePage() {
    const {address} = useAccount()
    const coverImageRef = useRef(null);
    const profilePicRef = useRef(null);
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [userFollowStats, setUserFollowStats] = useState(null);
    const [coverPic, setCoverPic] = useState(null);
    const [coverPicPreview, setCoverPicPreview] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [profilePicPreview, setProfilePicPreview] = useState(null);
    const [error, setError] = useState(null);
    const [loadingCoverPic, setLoadingCoverPic] = useState(false);
    const [loadingProfilePic, setLoadingProfilePic] = useState(false);
    const isUserOnOwnAccount = profile?.user_id === user?.id;
    const [loadingBol, setLoadingBol] = useState(false);
    const [editProfile, setEditProfile] = useState(false);
    const [editInput, setEditInput] = useState('');
    const [editInputBol, setEditInputBol] = useState(false);
    const getUs=async ()=>{
        const {data:{user,userFollowStats}} =   await getUser(address)
        setUser(user)
        setUserFollowStats(userFollowStats)
    }
    useEffect(() => {
        if(address&&cook.get('name')){
            getUs()
        }
    }, [address]);
    const changeImg = () => {
        setLoadingBol(!loadingBol)
    }
    const router = useRouter();
    const params = router.query
    const [posts, setPosts] = useState([]);
    const [followBol, setFollowBol] = useState(false);
    const isLoggedInUserFollowing =
        userFollowStats?.following?.length > 0 &&
        userFollowStats.following?.filter(
            (following) => following?.following_id === profile?.user_id
        ).length > 0;

    useEffect(() => {
        setFollowBol(isLoggedInUserFollowing)
    }, [isLoggedInUserFollowing])

    const addImageFromDevice = async (e, name) => {
        const {files} = e.target;
        if (name === "cover") {
            setCoverPic(files[0]); //files that we receive from e.target is automatically an array, so we don't need Array.from
            setCoverPicPreview(URL.createObjectURL(files[0]));
            changeImg()
        } else {
            setProfilePic(files[0]); //files that we receive from e.target is automatically an array, so we don't need Array.from
            setProfilePicPreview(URL.createObjectURL(files[0]));
            changeImg()
        }
    };
    const updateProfilePic = async () => {
        let profileImageUrl;
        setLoadingProfilePic(true);
        if (profilePic !== null) {
            profileImageUrl = await uploadPic(profilePic);
            if (!profileImageUrl) {
                setLoadingProfilePic(false);
                return setError("Error uploading image");
            }
            await profilePicturesUpdate(
                profileImageUrl,
                null,
                setLoadingProfilePic,
                setError, user?.id
            );
            setLoadingProfilePic(false);
        }
    }
    const updateCoverPic = async () => {
        let picUrl;
        setLoadingCoverPic(true);
        if (coverPic !== null) {
            picUrl = await uploadPic(coverPic);
            if (!picUrl) {
                setLoadingCoverPic(false);
                return setError("Error uploading image");
            }
            await profilePicturesUpdate(
                null,
                picUrl,
                setLoadingCoverPic,
                setError, user?.id
            );
            setLoadingCoverPic(false);
        }
    }
    const hint = () => {
        notification.error({
            message: `Please note`, description: 'Error reported', placement: 'topLeft',
        });
    }
    useEffect(() => {
        if (user && user.id) {
            if (profilePic) {
                updateProfilePic();
            }
            if (coverPic) {
                updateCoverPic();
            }
        }

    }, [loadingBol]);
    const getPosts = async () => {
        try {
            const res = await axios.get(
                `${baseUrl}/api/profile/posts/${params?.username}`,
            );
            if (res.status === 200) {
                setPosts(res.data);
            } else {
                setPosts([]);
            }
        } catch (error) {
            hint()
        }
    };

    const getProfile = async () => {
        try {
            const {username} = params;
            const res = await axios.get(`${baseUrl}/api/profile/${username}`);
            const {profile, followersLength, followingLength} = res.data;
            setProfile(profile)
            setEditInput(profile.username)
        } catch (error) {
            return {errorLoading: true};
        }
    }
    const chang = () => {
        setFollowBol(!followBol)
    }
    const [changeBol, setChangeBol] = useState(true)
    useEffect(() => {
        if (params && params.username) {
            getProfile()
            getPosts();
        }
    }, [params]);
    useEffect(() => {
        if (params && params.username) {
            getPosts();
        }
    }, [changeBol]);
    const change = () => {
        setChangeBol(!changeBol)
    }
    const setName = async () => {
        if (editInputBol) {
            if (editInput) {
                const data = await axios.post(baseUrl + '/api/user/updateUserName', {
                        userName: editInput,
                        userId: profile.user_id
                })
                if(data.status===200&&data?.data?.updateUserNameResult?.changedRows){
                    setEditInput(editInput)
                    setEditProfile(false)
                }
            } else {
                setEditInput(profile?.name)
                setEditProfile(false)
            }
        } else {
            notification.error({
                message: `Please note`, description: 'The name is repeated, please re-enter it. ', placement: 'topLeft',
            });
        }
    }
    const changeIn = async (e) => {
        setEditInput(e.target.value)
        const data = await axios.get(baseUrl + '/api/user/isUpdateUserName', {params: {userName: e.target.value}})
        if (data.status === 200) {
            setEditInputBol(data?.data?.flag)
        }
    }
    return (
        <>
            {/*上面*/}
            <div
                className={` ${
                    !isUserOnOwnAccount ? "min-h-[32.4rem]" : "min-h-[29.3rem]"
                }  shadow-lg`}
                style={{
                    fontFamily: "Inter",
                    backgroundColor: "rgb(188,238,125)",
                    marginRight: '20px',
                    borderRadius: '10px'
                }}
            >
                <div style={{
                    position: "relative",
                    width: '100%',
                    height: '250px',
                    overflow: 'hidden',
                    borderRadius: '10px 10px 0 0'
                }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => addImageFromDevice(e, "cover")}
                        name="media"
                        ref={coverImageRef}
                        style={{display: "none"}}
                    ></input>
                    {/*背景图*/}
                    <Image src={coverPicPreview ? coverPicPreview : profile?.cover_pic_url||'error'} alt="cover pic"
                           width={'100%'} height={'100%'}/>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => addImageFromDevice(e, "profile")}
                        name="media"
                        ref={profilePicRef}
                        style={{display: "none"}}
                    ></input>
                    {/*图像*/}
                    <Avatar src={profilePicPreview ? profilePicPreview : profile?.profile_pic_url} size={100} style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        translate: '-50% -50%'
                    }}/>
                    <div style={{
                        position: 'absolute',
                        left: '50%',
                        bottom: '-10px',
                        transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', width: '40%',justifyContent:'center'
                    }}>
                        {
                            editProfile ? <Input onChange={changeIn} value={editInput}
                                                 style={{fontSize: '20px', fontWeight: 'bold'}}/> :
                                <p style={{fontSize: '20px', fontWeight: 'bold'}}>{editInput}</p>
                        }
                        {
                            editProfile ? <div style={{display: 'flex', alignItems: 'center', marginLeft: '10px'}}>
                                <CloseOutlined style={{fontSize: '20px', fontWeight: 'bold'}}
                                               onClick={() => setEditProfile(false)}/> <CheckOutlined
                                style={{fontSize: '20px', fontWeight: 'bold', marginLeft: '10px'}} onClick={setName}/>
                            </div> : <FormOutlined
                                style={{fontSize: '20px', fontWeight: 'bold', marginLeft: '10px', color: 'blue'}}
                                onClick={() => setEditProfile(true)}/>
                        }

                    </div>
                    {/* <Username className="text-xl font-normal text-gray-600">{`@${profile.user.username}`}</Username> */}
                    {!isUserOnOwnAccount &&
                        (followBol ? (
                            <FollowButton
                                onClick={async () => {
                                    await unfollowUser(
                                        profile?.user_id,
                                        setUserFollowStats,
                                        user?.id,
                                    );
                                    chang()
                                }}
                            >
                                <CheckCircleIcon className="h-6"/>
                                <p className="ml-1.5">Following</p>
                            </FollowButton>
                        ) : (
                            <FollowButton
                                onClick={async () => {
                                    await followUser(
                                        profile?.user_id,
                                        setUserFollowStats,
                                        user?.id
                                    );
                                    chang()
                                }}
                            >
                                <UserAddIcon className="h-6"/>
                                <p className="ml-1.5">Follow</p>
                            </FollowButton>
                        ))}

                    {isUserOnOwnAccount && (
                        <>
                            <div style={{
                                padding: '10px',
                                cursor: 'pointer',
                                backgroundColor: 'white',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                borderRadius: '50%'
                            }} onClick={() => profilePicRef.current.click()}>
                                {loadingProfilePic ? (
                                    <>
                                        <LoadingOutlined/>
                                    </>
                                ) : (
                                    <CameraOutlined
                                        style={{fontSize: '20px', color: 'purple', fontWeight: 'bold'}}/>
                                )}
                            </div>
                            <div style={{
                                padding: '10px',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                position: 'absolute',
                                right: '2%',
                                bottom: '2%',
                                borderRadius: '50%'
                            }} onClick={() => coverImageRef.current.click()}>
                                {loadingCoverPic ? (
                                    <>
                                        <LoadingOutlined/>
                                    </>
                                ) : (
                                    <CameraOutlined style={{fontSize: '20px', color: 'gray', fontWeight: 'bold'}}/>
                                )}
                            </div>
                        </>
                    )}
                </div>
                {/*下面*/}
                <div
                    className="bg-gray-100 w-full"
                    style={{marginTop: ".18rem", minHeight: "calc(100vh - 26rem)", paddingTop: '60px'}}
                >
                    <div
                        className=" md:flex space-x-4 mx-auto max-w-[30rem] sm:max-w-xl md:max-w-3xl lg:max-w-[1000px]">
                        {/*左边关注*/}
                        <div
                            className="max-w-[28rem] ml-4 static mt-3 md:sticky md:mt-6 flex-1 md:max-w-[27rem]"
                            style={{
                                // position: "-webkit-sticky" /* for Safari */,
                                // position: "sticky",
                                top: "6rem",
                                alignSelf: "flex-start",
                            }}
                        >
                            {
                                <>
                                    <ProfileFields
                                        profile={profile}
                                        user={user}
                                        change={change}
                                        isUserOnOwnAccount={isUserOnOwnAccount}
                                    />
                                    {
                                        <FollowingUsers
                                            profile={profile}
                                            userFollowStats={userFollowStats}
                                            user={user}
                                        />}
                                    {<FollowerUsers
                                        profile={profile}
                                        userFollowStats={userFollowStats}
                                        user={user}
                                    />}

                                    <div className="h-9"></div>
                                </>}
                        </div>
                        {/*右边推文*/}
                        <div className="flex-1 flex-grow mt-6 max-w-md md:max-w-lg lg:max-w-2xl ">
                            {posts.length > 0 ? (
                                posts.map((post) => {
                                    const isLiked =
                                        post.likes && post.likes.length > 0 &&
                                        post.likes.filter((like) => like?.user?.id === user?.id).length > 0;
                                    return <PostCard
                                        key={post.id}
                                        liked={isLiked}
                                        post={post}
                                        user={user}
                                        setPosts={setPosts}
                                        change={change}
                                    />
                                })
                            ) : (
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
        </>
    );
}

export default ProfilePage;

const FollowButton = styled.div`
  display: flex;
  position: absolute;
  cursor: pointer;
  bottom: 10px;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0.45rem 0.5rem;
  border-radius: 0.5rem;
  background-color: rgba(139, 92, 246);
  color: white;
  font-size: 1.1rem;
`;

import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import  baseUrl from '/utils/baseUrl'
import {
  CameraIcon,
  CheckCircleIcon,
  UserAddIcon,
} from "@heroicons/react/solid";
import uploadPic from "../utils/uploadPic";
import {
  followUser,
  unfollowUser,
  profilePicturesUpdate,
} from "../utils/profileActions";
import {LoadingOutlined} from '@ant-design/icons'
import { parseCookies } from "nookies";
import axios from "axios";
import ProfileFields from "../components/ProfileComponents/ProfileFields";
import FollowingUsers from "../components/ProfileComponents/FollowingUsers";
import FollowerUsers from "../components/ProfileComponents/FollowerUsers";
import { useRouter } from "next/router";
import cookie from "js-cookie";
import PostCard from "../components/PostCard";
import InfoBox from "../components/HelperComponents/InfoBox";
import { EmojiSadIcon } from "@heroicons/react/outline";
import { Facebook as FacebookLoader } from "react-content-loader";
import {useSession} from "next-auth/react";
// https://images.pexels.com/photos/552789/pexels-photo-552789.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260

function ProfilePage() {
  const {data: session, status} = useSession()
  const didMountRef = useRef(false);
  const isMountRef = useRef(false);
  const coverImageRef = useRef(null);
  const profilePicRef = useRef(null);
  const [user,setUser] =useState(null)
  const [profile,setProfile] =useState(null)
  const [userFollowStats, setUserFollowStats] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const [coverPicPreview, setCoverPicPreview] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [error, setError] = useState(null);
  const [loadingCoverPic, setLoadingCoverPic] = useState(false);
  const [loadingProfilePic, setLoadingProfilePic] = useState(false);
  const isUserOnOwnAccount = profile?.user_id === user?.id;

  //state for rendering posts
  const router = useRouter();
  const params = router.query
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  //state for follow stats
  const [followBol, setFollowBol] = useState(false);
  const isLoggedInUserFollowing =
      userFollowStats?.following?.length > 0 &&
      userFollowStats.following?.filter(
      (following) => following?.following_id === profile?.user_id
    ).length > 0;

  useEffect(()=>{
    setFollowBol(isLoggedInUserFollowing)
  },[isLoggedInUserFollowing])

  const addImageFromDevice = async (e, name) => {
    const { files } = e.target;
    if (name === "cover") {
      setCoverPic(files[0]); //files that we receive from e.target is automatically an array, so we don't need Array.from
      setCoverPicPreview(URL.createObjectURL(files[0]));
    } else {
      setProfilePic(files[0]); //files that we receive from e.target is automatically an array, so we don't need Array.from
      setProfilePicPreview(URL.createObjectURL(files[0]));
    }
  };

  //profilePic
  useEffect(() => {
    if (!didMountRef.current || profilePicPreview === null) {
      didMountRef.current = true;
      return;
    } else {
      async function updateProfilePic() {
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
            setError
          );
          setLoadingProfilePic(false);
        }
      }

      updateProfilePic();
    }
  }, [profilePic]);

  //coverPic
  useEffect(() => {
    if (coverPic === null || !isMountRef.current) {
      isMountRef.current = true;
      return;
    } else {
      async function updateCoverPic() {
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
            setError
          );
          setLoadingCoverPic(false);
        }
      }
      updateCoverPic();
    }
  }, [coverPic]);
  const getPosts = async () => {
    setLoadingPosts(true);
    try {
      const { username } = router.query;
      const token = cookie.get("token");
      const res = await axios.get(
          `${baseUrl}/api/profile/posts/${username}`,
          {
            headers: { Authorization: token },
          }
      );
      setPosts(res.data);
    } catch (error) {
      console.log("Error Loading Posts");
    }
    setLoadingPosts(false);
  };
  const getProfile =async ()=>{
    try {
      const { username } = params;
      const res = await axios.get(`${baseUrl}/api/profile/${username}`);
      const { profile, followersLength, followingLength } = res.data;
      setProfile(profile)
    } catch (error) {
      return { errorLoading: true };
    }
  }
  const chang=()=>{
    setFollowBol(!followBol)
  }

  useEffect(() => {
    if(params&&params.username){
      getPosts();
      getProfile()
    }
  }, [params]);
  useEffect(() => {
    if(session){
      setUser(session?.user?session.user:{})
      setUserFollowStats(session?.userFollowStats?session.userFollowStats:{})
    }
  }, [session]);

  return (
    <>
      <div
        className={` ${
          !isUserOnOwnAccount ? "min-h-[32.4rem]" : "min-h-[29.3rem]"
        }  shadow-lg`}
        style={{ fontFamily: "Inter", backgroundColor: "white"}}
      >
        <div className="mx-auto max-w-lg sm:max-w-xl md:max-w-3xl lg:max-w-[1000px]" >
          <div style={{ position: "relative" }}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => addImageFromDevice(e, "cover")}
              name="media"
              ref={coverImageRef}
              style={{ display: "none" }}
            ></input>
            {coverPicPreview !== null ? (
              <img src={coverPicPreview} alt="cover pic" width={'100%'} />
            ) : (
              <img src={profile?.cover_pic_url} alt="cover pic" width={'100%'} />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => addImageFromDevice(e, "profile")}
              name="media"
              ref={profilePicRef}
              style={{ display: "none" }}
            ></input>
            {profilePicPreview !== null ? (
              <ProfileImage src={profilePicPreview} alt="profilepic" />
            ) : (
              <img src={profile?.profile_pic_url} alt="profilepic"  style={{width:'100px',border:'2px solid #f7f5ff',position:'absolute',borderRadius:'50%',top:'83%',left:'42%',}}/>
            )}
            <Name className="font-semibold text-3xl">{profile?.name}</Name>
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
                  <CheckCircleIcon className="h-6" />
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
                  <UserAddIcon className="h-6" />
                  <p className="ml-1.5">Follow</p>
                </FollowButton>
              ))}

            {isUserOnOwnAccount && (
              <>
                <CameraIconDiv onClick={() => profilePicRef.current.click()}>
                  {loadingProfilePic ? (
                    <>
                      <LoadingOutlined/>
                    </>
                  ) : (
                    <CameraIcon className="h-7 text-purple-600" />
                  )}
                </CameraIconDiv>
                <EditCoverPicDiv onClick={() => coverImageRef.current.click()}>
                  {loadingCoverPic ? (
                    <>
                      <LoadingOutlined/>
                    </>
                  ) : (
                    <CameraIcon className="h-7 text-gray-600" />
                  )}
                </EditCoverPicDiv>{" "}
              </>
            )}
          </div>
        </div>
      </div>
      <div
        className="bg-gray-100 w-full"
        style={{ marginTop: ".18rem", minHeight: "calc(100vh - 26rem)" ,paddingTop:'60px'}}
      >
        <div className=" md:flex space-x-4 mx-auto max-w-[30rem] sm:max-w-xl md:max-w-3xl lg:max-w-[1000px]">
          <div
            className="max-w-[28rem] ml-4 static mt-3 md:sticky md:mt-6 flex-1 md:max-w-[27rem]"
            style={{
              // position: "-webkit-sticky" /* for Safari */,
              // position: "sticky",
              top: "6rem",
              alignSelf: "flex-start",
            }}
          >
            {loadingPosts ? (
              <FacebookLoader />
            ) : (
              <>
                <ProfileFields
                  profile={profile}
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
              </>
            )}
          </div>
          <div className="flex-1 flex-grow mt-6 max-w-md md:max-w-lg lg:max-w-2xl ">
            {loadingPosts ? (
              <FacebookLoader />
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  user={user}
                  setPosts={setPosts}
                />
              ))
            ) : (
              <InfoBox
                marginTop={1}
                Icon={EmojiSadIcon}
                message={
                  isUserOnOwnAccount
                    ? `You don't have any posts, ${profile?.name}.`
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
    </>
  );
}
export default ProfilePage;

const CoverImage = styled.img`
  object-fit: cover;
  width: 100%;
  height: 20rem;
  border-bottom-left-radius: 0.8rem;
  border-bottom-right-radius: 0.8rem;
`;

const ProfileImage = styled.img`
  object-fit: cover;
  position: absolute;
  height: 13rem;
  width: 13rem;
  border-radius: 50%;
  top: 95%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 0.4rem solid #f7f5ff;
`;

const CameraIconDiv = styled.div`
  padding: 0.75rem;
  cursor: pointer;
  background-color: white;
  box-shadow: 0.5px 0.5px 0.5px 0.5px #ccc;
  position: absolute;
  top: 104%;
  left: 55.5%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
`;

const EditCoverPicDiv = styled.div`
  padding: 0.75rem;
  background-color: white;
  cursor: pointer;
  position: absolute;
  right: 1.5rem;
  bottom: 1.2rem;
  border-radius: 50%;
`;

const Name = styled.p`
  position: absolute;
  top: 110%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: inherit;
`;

const Username = styled.p`
  position: absolute;
  top: 144%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const FollowButton = styled.div`
  display: flex;
  position: absolute;
  cursor: pointer;
  top: 151%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0.45rem 0.5rem;
  border-radius: 0.5rem;
  background-color: rgba(139, 92, 246);
  color: white;
  font-size: 1.1rem;
`;

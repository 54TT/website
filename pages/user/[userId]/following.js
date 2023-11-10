import React, {useEffect, useState} from "react";
import axios from "axios";
import { useRouter } from "next/router";
import baseUrl from "../../../utils/baseUrl";
import { parseCookies } from "nookies";
import InfoBox from "../../../components/HelperComponents/InfoBox";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserAddIcon,
} from "@heroicons/react/solid";
import styled from "styled-components";
import { followUser, unfollowUser } from "../../../utils/profileActions";
import Sidebar from "../../../components/Sidebar";
import {useSession} from "next-auth/react";

function FollowingPage() {
  const router = useRouter();
  const params = router.query
  const [user,setUser] =useState(null)
  const [followingArrayState, setFollowingArrayState] = useState(null);
  const [userFollowStats, setUserFollowStats] = useState(null);
  const {data: session, status} = useSession()
  useEffect(() => {
    if(session){
      setUser(session?.user?session.user:{})
      setUserFollowStats(session?.userFollowStats?session.userFollowStats:{})
    }
  }, [session]);

  const getParams = async ()=>{
    try {
      const res = await axios.get(
          `${baseUrl}/api/profile/following/${params.userId}`,);
      if(res&&res.data){
        setFollowingArrayState(res.data)
      }else {
        setFollowingArrayState([])
      }
    } catch (error) {
    }

  }

  useEffect(()=>{
    if(params&&params.userId){
      getParams()
    }
  },[params])

  // if (loading) {
  //   return (
  //     <InfoBox
  //       Icon={ExclamationCircleIcon}
  //       message={"Oops, an error occured"}
  //       content={`There was an error while fetching the users this user has followed`}
  //     />
  //   );
  // }

  return (
    <div className="bg-gray-100 h-screen">
      <main
        style={{
          height: "calc(100vh - 4.5rem)",
          overflowY: "auto",
          display: "flex",
        }}
      >
        <Sidebar user={user} topDist={"0"} maxWidth={"250px"} />
        <div
            style={{ fontFamily: "Inter",width:'50%',margin:'20px auto 0',overflowY:'auto',borderRadius:'5px',border:'1px solid rgb(128,128,128)',padding:'20px'}}
            // className="mx-auto flex-1 max-w-md md:max-w-xl lg:max-w-[61.5rem] xl:max-w-[67rem] bg-white p-4 shadow-lg rounded-lg overflow-y-auto"
        >
          <div className="flex items-center ml-2">
            <Title>Following ·</Title>
            <FollowingNumber className="text-gray-500 ml-2">
              {followingArrayState?.length}
            </FollowingNumber>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',}}>
            {followingArrayState&&followingArrayState.length>0?followingArrayState.map((fol) => {
              const isLoggedInUserFollowing =
                  userFollowStats?.following?.length > 0 &&
                  userFollowStats?.following?.filter(
                  (loggedInUserFollowing) =>
                    loggedInUserFollowing?.user.id === fol?.user?.id
                ).length > 0;
              return (
                <div
                  style={{marginBottom:'10px', border: "1px solid gray",width:'48%',padding:'20px',display:'flex',alignItems:'center',justifyContent:'space-between',borderRadius:'10px',backgroundColor:'white' }}
                  key={fol?.user?.id}
                  // className="flex items-center justify-between p-4 mb-4 rounded-lg bg-white"
                >
                  <div className="flex items-center ">
                    {/*profile_pic_url*/}
                    <Image src={fol?.user?.profilePicUrl} alt="userimg" />
                    <Name
                      className="ml-3"
                      onClick={() => router.push(`/${fol?.user?.username}`)}
                    >
                      {fol?.user?.name.length>9?fol?.user?.name.slice(0,4)+'...'+fol?.user?.name.slice(-3):fol?.user?.name}
                    </Name>
                  </div>
                  {fol?.user?.id !== user?.id ? (
                    <>
                      {isLoggedInUserFollowing ? (
                        <FollowButton
                          onClick={async () => {
                            await unfollowUser(
                              fol.user.id,
                                setUserFollowStats,
                              user?.id
                            );
                          }}
                        >
                          <CheckCircleIcon className="h-6" />
                          <p className="ml-1.5">Following</p>
                        </FollowButton>
                      ) : (
                        <FollowButton
                          onClick={async () => {
                            await followUser(
                              fol?.user?.id,
                                setUserFollowStats,
                              user?.id
                            );
                          }}
                        >
                          <UserAddIcon className="h-6 " />
                          <p className="ml-1.5">Follow</p>
                        </FollowButton>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              );
            }):''}
          </div>
        </div>
        <div className="w-10"></div>
      </main>
    </div>
  );
}

{
  /* {followingArrayState.map((fol) => (
            <div
              style={{ border: "1px solid #eee" }}
              key={fol.id}
              className="flex justify-between mb-4 rounded-lg bg-white"
            >
              <div className="flex items-center p-4 ">
                <Image src={fol.pic} />
                <Name className="ml-3">{fol.name}</Name>
              </div> */
}
{
  /* {isLoggedInUserFollowing ? (
                <FollowButton
                //   onClick={async () => {
                //     await unfollowUser(profile.user._id, setUserFollowStats);
                //   }}
                >
                  <CheckCircleIcon className="h-6" />
                  <p className="ml-1.5">Following</p>
                </FollowButton>
              ) : (
                <FollowButton
                //   onClick={async () => {
                //     await followUser(profile.user._id, setUserFollowStats);
                //   }}
                >
                  <UserAddIcon className="h-6" />
                  <p className="ml-1.5">Follow</p>
                </FollowButton>
              )} */
}

export default FollowingPage;

const FollowButton = styled.div`
  height: fit-content;
  padding: 10px;
  display: flex;
  cursor: pointer;
  border-radius: 10px;
  background-color: rgba(139, 92, 246);
  color: white;
  font-size: 18px;
  font-family: "Inter";
  font-weight: 400;
`;

const GridContainer = styled.div`
  display: grid;
`;

const Image = styled.img`
  width: 60px;
  border-radius:50%;
`;

const Name = styled.p`
  cursor: pointer;
  user-select: none;
  font-weight: 500;
  font-size: 1.12rem;
  font-family: "Inter";
  :hover {
    text-decoration: underline;
  }
`;

const Title = styled.p`
  user-select: none;
  font-size: 1.65rem;
  font-weight: 600;
  font-family: Inter;
`;

const FollowingNumber = styled.p`
  font-family: Inter;
  user-select: none;
  font-size: 1.25rem;
  font-weight: 400;
  margin-top: -1.65rem;
`;

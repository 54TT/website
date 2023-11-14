import axios from "axios";
import React, { useEffect, useState } from "react";
import cookie from "js-cookie";
import  baseUrl from '/utils/baseUrl'
import styled from "styled-components";
import { useRouter } from "next/router";
import { Facebook } from "react-content-loader";

function FollowingUsers({ profile, userFollowStats, user }) {
  const router = useRouter();
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const getFollowing = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
          `${baseUrl}/api/profile/following/${profile.user_id}`,
          {
            headers: { Authorization: cookie.get("token") },
          }
      );

      setFollowing(res.data);
    } catch (error) {
    }
    setLoading(false);
  };

  useEffect(() => {
    if(profile&&profile.user_id){
      getFollowing();
    }
  }, [profile]); //this runs on first component render

  return (
    <div
      style={{ fontFamily: "Inter" }}
      className="bg-white rounded-2xl shadow-md  mt-5 p-5"
    >
      <div className="flex justify-between">
        <div className="flex">
          <h1
            className="text-2xl font-semibold"
            style={{ fontFamily: "inherit" }}
          >
            Following ·
          </h1>
          <span
            className="ml-1 text-gray-500 text-lg"
            style={{ marginTop: ".15rem" }}
          >
            {following && following.length > 0 ? following.length : "0"}
          </span>
        </div>
        {following && following.length > 0 && (
          <p
            onClick={() => router.push(`/user/${profile?.user_id}/following`)}
            className="text-md font-normal cursor-pointer select-none text-purple-400 hover:underline"
            style={{ fontFamily: "inherit" }}
          >
            View All
          </p>
        )}
      </div>
      {loading ? (
        <Facebook />
      ) : (
        <>
          {following && following.length > 0 ? (
            <GridContainer>
              {following.map((fol,index) => index<5&&(
                <div
                  className="mb-5 cursor-pointer"
                  key={fol?.user?.id}
                  style={{width:'30%'}}
                  onClick={() => router.push(`/${fol?.user?.username}`)}
                >
                  <img src={fol?.user?.profilePicUrl} alt="userprof" style={{width:'50px',}} />
                  <p style={{overflow:"hidden",textOverflow:'ellipsis',whiteSpace:'nowrap'}}
                    onClick={() => router.push(`/${fol?.user?.username}`)}
                  >
                    {fol?.user?.username.slice(0,6)}
                  </p>
                </div>
              ))}
            </GridContainer>
          ) : profile?.user_id === user?.id ? (
            <p className="text-md text-gray-500">
              {`You've not followed anyone. What are you waiting for?`}
            </p>
          ) : (
            <p className="text-md text-gray-500">{`${profile?.name} hasn't followed anyone yet.`}</p>
          )}
        </>
      )}
    </div>
  );
}

export default FollowingUsers;


const GridContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  
`;

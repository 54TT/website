import React from "react";
import styled from "styled-components";
import calculateTime from "../../utils/calculateTime";
import Link from "next/link";

function LikeNotification({ notification }) {
  return (
    notification.type === "newLike" && (
      <NotificationDiv>
        <img   width={60} height={60} style={{borderRadius:'50%'}} src={notification?.user?.profilePicUrl||'error'} alt="userimg" />
        <div className="select-none"  style={{marginLeft:'10px'}}>
          <p>
            <Link href={`/${notification?.user?.username?notification.user.username:''}`} passHref>
              {notification?.user?.name?notification?.user?.name?.length>10?notification.user.name.slice(0,3)+'...'+notification.user.name.slice(-4):notification.user.name:''}
            </Link>
            liked your
            {/*<Link href={`/post/${notification.post.id}`} passHref>*/}
            {/*  post*/}
            {/*</Link>*/}
            {/*.*/}
          </p>
          <p className="text-gray-500" style={{ marginTop: "0" }}>
            {calculateTime(notification.date, true)}
          </p>
        </div>
        {/* {notification.post.picUrl} */}
      </NotificationDiv>
    )
  );
}

export default LikeNotification;
const NotificationDiv = styled.div`
  display: flex;
  cursor: pointer;
  border-radius: 0.3rem;
  border-bottom: 1px solid #efefef;
  font-family: Inter;
  padding: 10px;
  align-items: center;
  :hover {
    background-color: rgba(243, 244, 246);
  }
`;

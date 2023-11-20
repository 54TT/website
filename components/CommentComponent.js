import React, { useState } from "react";
import styled from "styled-components";
import calculateTime from "../utils/calculateTime";
import { useRouter } from "next/router";
import { MinusCircleIcon, TrashIcon } from "@heroicons/react/outline";
import ReusableDialog from "./ReusableDialog";
import { deleteComment } from "../utils/postActions";
import {notification,} from "antd";
import Link from  'next/link'
const notifyCommentDelete = () =>{
  notification.success({
    message: `Comment deleted successfully!`, placement: 'topLeft',
    duration:2
  });
}
function CommentComponent({ comment, postId,change, user, setComments }) {
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);
  const [open, setOpen] = useState(false);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAgree = async () => {
    await deleteComment(postId, comment.id, setComments, notifyCommentDelete,handleClose,user?.id,change);
  };
  const handleDisagree = () => {
    handleClose();
  };

  return (
    <div className="flex items-start pl-5 pr-3 mt-3">
      <img  alt={''}   style={{borderRadius:'50%',marginTop:'10px'}} height={50} width={50}
        src={comment?.user?.profilePicUrl?comment.user.profilePicUrl:'/Ellipse1.png'}
        className="mr-2"
      />
      {/* extra div for flex of comment text div and the three dots  */}
      <div
        className="flex items-center flex-shrink"
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <div
          style={{ padding: ".48rem 1rem" }}
          className={`bg-gray-100 rounded-3xl items-center`}
        >
          <div className="flex space-x-1">
            <Link href={`/${comment?.user?.username?comment.user.username:''}`}>
            <UserPTag>
              {comment?.user?.name} ·{"  "}
            </UserPTag>
            </Link>
            <span
              className="text-gray-500 font-light text-sm"
              style={{ textDecoration: "none" }}
            >
              {calculateTime(comment.date, true)}
            </span>
          </div>

          <p
            className="text-gray-800 font-light"
            style={{ fontSize: "0.97rem" }}
          >
            {comment.text}
          </p>
        </div>
        {isHovering && comment.user.id === user.id ? (
          <div style={{ width: "3rem", marginLeft: "0.2rem" }}>
            <ThreeDotsDiv
              onClick={() => {
                handleClickOpen();
              }}
              className="flex justify-center items-center"
            >
              <MinusCircleIcon
                style={{ height: "1.2rem", width: "1.2rem" }}
                className="text-gray-500"
              />
            </ThreeDotsDiv>
          </div>
        ) : (
          <div style={{ width: "3rem", marginLeft: "0.2rem" }}>
            <ThreeDotsDiv style={{ visibility: "hidden" }}>
              <MinusCircleIcon
                style={{ height: "1.15rem", width: "1.15rem" }}
                className="text-red-600"
              />
            </ThreeDotsDiv>
          </div>
        )}
      </div>
      <ReusableDialog
        title={"Delete Comment"}
        action={"delete"}
        item={"comment"}
        open={open}
        handleClose={handleClose}
        handleAgree={handleAgree}
        handleDisagree={handleDisagree}
      />
    </div>
  );
}

export default CommentComponent;

const UserPTag = styled.p`
  font-weight: 500;
  margin-bottom: -0.1rem;
  font-size: 0.93rem;
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

const ThreeDotsDiv = styled.div`
  height: 2.1rem;
  width: 2.1rem;
  border-radius: 50%;
  cursor: pointer;
  padding: 0.1rem;
  font-size: 1.2rem;
  :hover {
    background-color: whitesmoke;
  }
`;

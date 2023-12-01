import React, { useState } from "react";
import calculateTime from "../utils/calculateTime";
import { useRouter } from "next/router";
import { MinusCircleIcon, TrashIcon } from "@heroicons/react/outline";
// import ReusableDialog from "./ReusableDialog";
import { deleteComment } from "../utils/postActions";
import {notification,} from "antd";
import dynamic from "next/dynamic";
import styled from '/public/styles/all.module.css'
const ReusableDialog = dynamic(() => import('./ReusableDialog'),{ ssr: false })
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
      <img  alt={''}   height={50} width={50}
        src={comment?.user?.profilePicUrl?comment.user.profilePicUrl:'/Ellipse1.png'}
        className={`mr - 2 ${styled.commentCommentImg}`}
      />
      {/* extra div for flex of comment text div and the three dots  */}
      <div
        className="flex items-center flex-shrink"
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <div
          style={{ padding: "10px  14px" }}
          className={`bg-gray-100 rounded-3xl items-center`}
        >
          <div className="flex space-x-1">
            <Link href={`/${comment?.user?.username?comment.user.username:''}`}>
            <p className={styled.commentCommentUser}>
              {comment?.user?.name} ·{"  "}
            </p>
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
            style={{ fontSize: "10px" }}
          >
            {comment.text}
          </p>
        </div>
        {isHovering && comment.user.id === user.id ? (
          <div className={styled.commentCommentHov}>
            <div
              className={`flex justify-center items-center ${styled.commentCommentOpen}`}
              onClick={() => {
                handleClickOpen();
              }}
            >
              <MinusCircleIcon
                style={{ height: "18px", width: "18px" }}
                className="text-gray-500"
              />
            </div>
          </div>
        ) : (
          <div  className={styled.commentCommentHov}>
            <div className={styled.commentCommentIs}>
              <MinusCircleIcon
                style={{ height: "18px", width: "18px" }}
                className="text-red-600"
              />
            </div>
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

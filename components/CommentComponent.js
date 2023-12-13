import React, {useState} from "react";
import calculateTime from "../utils/calculateTime";
import {useRouter} from "next/router";
import {MinusCircleIcon, TrashIcon} from "@heroicons/react/outline";
import {deleteComment} from "../utils/postActions";
import {notification,} from "antd";
import dynamic from "next/dynamic";
import styled from '/public/styles/all.module.css'

const ReusableDialog = dynamic(() => import('./ReusableDialog'), {ssr: false})
import Link from 'next/link'
import {request} from "../utils/hashUrl";

const notifyCommentDelete = () => {
    notification.success({
        message: `Comment deleted successfully!`, placement: 'topLeft',
        duration: 2
    });
}

function CommentComponent({comment, postId, change, user, setComments, changComment}) {
    const [isHovering, setIsHovering] = useState(false);
    const [open, setOpen] = useState(false);
    // 删除评论  id
    const [commentId, setCommentId] = useState(null)
    const handleMouseOver = () => {
        setIsHovering(true);
    };

    const handleMouseOut = () => {
        setIsHovering(false);
    };

    const handleClickOpen = (id) => {
        setOpen(true);
        setCommentId(id)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAgree = async () => {
        const res = await request('delete', '/api/v1/post/comment/' + commentId, '')
        if (res && res?.status === 200 && res?.data?.code === 200) {
            changComment(commentId)
            setCommentId(null)
            handleClose();
        }
    };
    const handleDisagree = () => {
        handleClose();
    };

    return (
        <div className="flex items-start pl-5 pr-3 mt-3" style={{overflowY: 'auto'}}>
            <img alt={''} height={50} width={50}
                 src={comment?.beReplyUserAvatar ? comment.beReplyUserAvatar : '/Ellipse1.png'}
                 className={`mr - 2 ${styled.commentCommentImg}`}
            />
            {/* extra div for flex of comment text div and the three dots  */}
            <div
                className="flex items-center flex-shrink"
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
            >
                <div
                    style={{padding: "10px  14px"}}
                    className={`bg-gray-100 rounded-3xl items-center`}
                >
                    <div className="flex space-x-1">
                        {/*replyUserAddress*/}
                        {/*replyUserId*/}
                        {/*replyUsername*/}
                        <Link href={`/${comment?.replyUserId ? comment.replyUserId : ''}`}>
                            <p className={styled.commentCommentUser}>
                                {comment?.replyUsername ? comment?.replyUsername.length > 8 ? comment?.replyUsername.slice(0, 5) : comment?.replyUsername : comment?.replyUserAddress.slice(0, 5)} ·
                            </p>
                        </Link>
                        <span
                            className="text-gray-500 font-light text-sm"
                            style={{textDecoration: "none"}}
                        >
              {comment?.createdAt}
            </span>
                    </div>

                    <p
                        className="text-gray-800 font-light"
                        style={{fontSize: "10px"}}
                    >
                        {comment?.content}
                    </p>
                </div>
                {/*是否显示删除按钮*/}
                {isHovering && Number(comment?.replyUserId) === Number(user?.uid) ? (
                    <div className={styled.commentCommentHov}>
                        <div className={`flex justify-center items-center ${styled.commentCommentOpen}`}
                             onClick={() => handleClickOpen(comment?.id)}>
                            <MinusCircleIcon style={{height: "18px", width: "18px"}} className="text-gray-500"/>
                        </div>
                    </div>
                ) : (
                    <div className={styled.commentCommentHov}>
                        <div className={styled.commentCommentIs}>
                            <MinusCircleIcon
                                style={{height: "18px", width: "18px"}}
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

import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import calculateTime from "../utils/calculateTime";
import baseUrl from '/utils/baseUrl'
import {ThumbUpIcon} from "@heroicons/react/solid";
import _ from 'lodash'
import copy from 'copy-to-clipboard'
import {
    ChatAltIcon,
    MinusCircleIcon,
    ShareIcon,
    ThumbUpIcon as ThumbUpOutlineIcon,
} from "@heroicons/react/outline";
import {Input} from 'antd'
import {deletePost, likePost, postComment} from "../utils/postActions";
import CommentComponent from "./CommentComponent";
import {useRouter} from "next/router";
import ReusableDialog from "./ReusableDialog";
import toast, {Toaster} from "react-hot-toast";

const {TextArea} = Input
const notify = () =>
    toast.success("Post deleted successfully!", {
        position: "bottom-center",
    });

const notifyCopyLink = () =>
    toast.success("Post link copied to clipboard!", {
        position: "bottom-center",
    });

function PostCard({post, user, postById, change,liked}) {
    const router = useRouter();
    const [comments, setComments] = useState([]);
    useEffect(() => {
        if (post &&post.comments&& post.comments.length > 0) {
            setComments(post?.comments)
        } else {
            setComments([])
        }
    }, [post])
    const [commentText, setCommentText] = useState("");
    const [showComments, setShowComments] = useState( false);
    const [loading, setLoading] = useState(false);
    const buttonRef = useRef(null);
    const [open, setOpen] = useState(false);
    const createComment = async (e) => {
        e.preventDefault();
        await postComment(post.id, user, commentText, setComments, setCommentText);
    };

    const onEnterPress = (e) => {
        if (e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();
            buttonRef.current.click();

        }
    };

    const handleLike =  async () => {
        await likePost(post?.id, user?.id, liked ? false : true,change)
    };

    const handleClickOpen = () => {
        setOpen(true);

    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAgree = async () => {
        await deletePost(post?.id, setComments, notify,change,user.id);
        // handleClose();
    };
    const handleDisagree = () => {
        handleClose();
    };

    return (
        <div
            style={{fontFamily: "Inter"}}
            className="mb-7 bg-white flex flex-col justify-start rounded-2xl shadow-md"
        >
            <Toaster/>
            <div className="p-4">
                <div className="flex space-x-3 items-center ml-2 relative">
                    <Image src={user && user.profilePicUrl ? user.profilePicUrl : ''} alt="userimg"/>
                    <div>
                        <UserPTag
                            onClick={() => {
                                router.push(`/${post?.user?.username}`);
                            }}
                        >
                            {post?.user ? post?.user?.name : ''}
                        </UserPTag>
                        <p
                            style={{
                                fontSize: ".91rem",
                            }}
                            className="text-gray-500 font-light"
                        >
                            {calculateTime(post?.created_at)}
                        </p>
                    </div>
                    <ReusableDialog
                        title={"Delete Post"}
                        action={"delete"}
                        item={"post"}
                        open={open}
                        handleClose={handleClose}
                        handleAgree={handleAgree}
                        handleDisagree={handleDisagree}
                    />
                    {post?.user_id === user?.id && (
                        <ThreeDotsDiv
                            onClick={() => {
                                handleClickOpen();
                            }}
                            className="flex justify-center items-center absolute top-0 right-2"
                        >
                            <MinusCircleIcon
                                style={{height: "1.2rem", width: "1.2rem"}}
                                className="text-gray-500"
                            />
                        </ThreeDotsDiv>
                    )}
                </div>
                <p className="ml-2 mt-5">{post.text}</p>
            </div>

            {post&&post.picUrl? <img src={post.picUrl} alt={''} style={{width:'100%',}}/>:''}
            <div style={{marginTop: "0.65rem"}} className="ml-5 mr-5">
                <div className="flex justify-between w-full">
                    <div className="flex items-center space-x-0.5 cursor-pointer hover:underline">
                        <ThumbUpIcon
                            className="h-4 text-gray-400
            "
                        />
                        <p className="text-md text-gray-500 font-light select-none">
                            {post && post?.likes ? post?.likes.length : 0}
                        </p>
                    </div>
                    <p
                        onClick={() => setShowComments((prev) => !prev)}
                        className="text-gray-500 cursor-pointer hover:underline font-light select-none"
                    >{`${comments ? comments.length : 0}   comments`}</p>
                </div>
            </div>
            {/*点赞*/}
            <div
                style={{
                    borderTop: ".65px solid lightgrey",
                    borderBottom: ".65px solid lightgrey",
                    marginTop: ".6rem",
                }}
                className="flex space-x-4 ml-4 mr-4 justify-evenly items-center text-gray-500"
            >
                <div
                    onClick={() => handleLike()}
                    className="flex flex-grow justify-center hover:bg-gray-100 space-x-2 mb-1 mt-1 pt-2 pb-2 pl-2.5 pr-2.5 rounded-xl cursor-pointer "
                >
                    <ThumbUpOutlineIcon
                        className={`h-6 ${liked ? "text-transparent" : ""}`}
                        style={{
                            fill: `${liked ? "black" : "transparent"}`,
                        }}
                    />
                    <p
                        style={{
                            userSelect: "none",
                            color: `${liked ? "black" : "rgba(107, 114, 128)"}`,
                        }}
                    >
                        Like
                    </p>
                </div>
                <div
                    onClick={() => setShowComments((prev) => !prev)}
                    className="flex flex-grow justify-center hover:bg-gray-100 space-x-2 mb-1 mt-1 pt-2 pb-2 pl-2.5 pr-2.5 rounded-xl cursor-pointer"
                >
                    <ChatAltIcon className="h-6"/>
                    <p style={{userSelect: "none"}}>Comment</p>
                </div>
                <div
                    onClick={() => {
                        // copy(`${baseUrl}/post/${post.id}`);
                        // notifyCopyLink();
                    }}
                    className="flex flex-grow justify-center hover:bg-gray-100 space-x-2 mb-1 mt-1 pt-2 pb-2 pl-2.5 pr-2.5 rounded-xl cursor-pointer"
                >
                    <ShareIcon className="h-6"/>
                    <p style={{userSelect: "none"}}>Share</p>
                </div>
            </div>
            {/*发送消息*/}
            {showComments && (
                <div className="pb-4">
                    <div className="flex items-center pt-4 pl-5 pr-5 ">
                        <form className="w-full">
                            {/* div which contains the profilepic and the input div */}
                            <div className="flex space-x-2 items-center">
                                <Image
                                    src={user?.profilePicUrl}
                                    alt="profile pic"
                                />
                                <div
                                    style={{padding: ".85rem"}}
                                    className={`flex bg-gray-100 rounded-3xl items-center w-full`}
                                >
                                    <TextArea
                                        showCount
                                        maxLength={100}
                                        onChange={(e) => {
                                            setCommentText(e.target.value);
                                        }}
                                        value={commentText}
                                        className="outline-none w-full bg-transparent text-md placeholder-gray-400 font-light"
                                        placeholder="Write a comment..."
                                        style={{
                                            resize: 'none', fontFamily: "Inter"
                                        }}
                                        onKeyDown={onEnterPress}
                                    />
                                    {/*<TextareaAutosize*/}
                                    {/*  style={{ resize: "none", fontFamily: "Inter" }}*/}
                                    {/*  name="commentText"*/}
                                    {/*  value={commentText}*/}
                                    {/*  onChange={(e) => {*/}
                                    {/*    setCommentText(e.target.value);*/}
                                    {/*  }}*/}
                                    {/*  type="text"*/}
                                    {/*  placeholder={`Write a comment...`}*/}
                                    {/*  maxRows={"4"}*/}
                                    {/*  onKeyDown={onEnterPress}*/}
                                    {/*></TextareaAutosize>*/}
                                </div>
                            </div>
                            <button
                                hidden
                                type="submit"
                                onClick={createComment}
                                ref={buttonRef}
                            ></button>
                        </form>
                    </div>
                            {comments&&comments.length > 0 &&
                                comments.map((comment) => (
                                    <CommentComponent
                                        key={comment.id}
                                        change={change}
                                        comment={comment}
                                        postId={post.id}
                                        user={user}
                                        setComments={setComments}
                                    />
                                ))}
                    {/*{comments.length > 3 && (*/}
                    {/*    <p*/}
                    {/*        onClick={() => router.push(`/post/${post.id}`)}*/}
                    {/*        className="hover:underline ml-5 mt-3 text-gray-500 cursor-pointer font-normal"*/}
                    {/*    >*/}
                    {/*        View all comments*/}
                    {/*    </p>*/}
                    {/*)}*/}
                </div>
            )}
        </div>
    );
}

export default PostCard;

const Image = styled.img`
  object-fit: cover;
  width: 50px;
  border-radius: 50%;
`;

const PostImage = styled.img`
  object-fit: contain;
  height: auto;
  max-height: 455px;
  width: 100%;
  margin-top: 0.35rem;
  margin-bottom: 1.2rem;
  transition: all 0.22s ease-out;
  border-top: 0.7px solid lightgrey;
  border-bottom: 0.7px solid lightgrey;
`;

const UserPTag = styled.p`
  cursor: pointer;
  margin-bottom: -0.09rem;
  font-weight: 500;
  font-size: 1.05rem;

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

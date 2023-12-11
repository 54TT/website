import React, {useContext, useEffect, useRef, useState} from "react";
import {ThumbUpIcon} from "@heroicons/react/solid";
import Link from 'next/link'
import styled from '/public/styles/all.module.css'
import {
    ChatAltIcon,
    MinusCircleIcon,
    ShareIcon,
    ThumbUpIcon as ThumbUpOutlineIcon,
} from "@heroicons/react/outline";
import {Input, notification} from 'antd'
import {deletePost, likePost, postComment} from "../utils/postActions";
import CommentComponent from "./CommentComponent";
import {useRouter} from "next/router";
import ReusableDialog from "./ReusableDialog";

const {TextArea} = Input
import dayjs from 'dayjs'
import {CountContext} from '/components/Layout/Layout';
import {request} from "../utils/hashUrl";

const notify = () => {
    notification.success({
        message: `Post deleted successfully!`, placement: 'topLeft',
        duration: 2
    });
}

function PostCard({post, user, change, liked}) {
    const {changeTheme} = useContext(CountContext);
    // 评论
    const [comments, setComments] = useState([]);
    // 发送的信息
    const [commentText, setCommentText] = useState("");
    // 展示评论
    const [showComments, setShowComments] = useState(false);
    // 提交评论按钮
    const buttonRef = useRef(null);
    const [open, setOpen] = useState(false);
    // 发送评论
    const createComment = async (e) => {
        e.preventDefault();
        // await postComment(post.id, user, commentText, setComments, setCommentText);
        const res = await request('post', '/api/v1/post/comment', {postId: post?.postId, content: commentText})
        if (res &&res?.data&&res?.status===200&& res?.data?.code && res?.data?.code === 200) {
            setCommentText('')
            const newComment = {
                id: 9,
                // user,
                content: commentText,
                createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            };
            setComments((prev) => [newComment, ...prev]);
            // const res = await request('post', '/api/v1/post/comment/list', {postId:  post?.postId, page: 1})
            // if (res && res?.status === 200 && res?.data && res?.data?.comments) {
            //     setComments(res?.data?.comments)
            // } else {
            //     setComments([])
            // }
        }
    };

    const onEnterPress = (e) => {
        if (e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();
            buttonRef.current.click();
        }
    };
    const handleLike = async () => {
        const data = await likePost(post?.id, user?.id, !liked)
        if (data && data.status === 200) {
            change('click')
        }
    };
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleAgree = async () => {
        const data = await deletePost(post?.id, setComments, notify, user.id);
        if (data && data.status === 200) {
            setOpen(false);
            change('click', post?.id);
        }
    };
    const handleDisagree = () => {
        handleClose();
    };
    const getComments = async (id) => {
        if (showComments) {
            setShowComments((prev) => !prev)
        } else {
            const res = await request('post', '/api/v1/post/comment/list', {postId: id, page: 1})
            if (res && res?.status === 200 && res?.data && res?.data?.comments) {
                setComments(res?.data?.comments)
            } else {
                setComments([])
            }
            setShowComments((prev) => !prev)
        }
    }
    return (
        <div
            className={`mb-7 flex flex-col justify-start rounded-2xl shadow-md ${changeTheme ? 'darknessThree' : 'brightBackTwo'}`}>
            {/*头像*/}
            <div className="p-4">
                <div className="flex space-x-3 items-center ml-2 relative">
                    <img height={50} width={50} style={{borderRadius: '50%'}}
                         src={post && post?.user?.profilePicUrl ? post.user.profilePicUrl : '/Ellipse1.png'}
                         alt="userimg"/>
                    <div>
                        <Link href={`/${post?.user?.address ? post.user.address : ''}`}>
                            <div style={{
                                cursor: 'pointer',
                                fontSize: '20px'
                            }} className={changeTheme ? 'darknessFont' : 'brightFont'}>
                                {post?.user?.username ? post?.user?.username.length > 10 ? post.user.username.slice(0, 8) : post.user.username : ''}
                            </div>
                        </Link>
                        <p
                            style={{
                                fontSize: "10px",
                            }}
                            className="text-gray-500 font-light"
                        >
                            {post && post.CreatedAt ? post?.CreatedAt : ''}
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
                    {/*删除按钮*/}
                    {post?.user_id === user?.id && (
                        <div style={{
                            borderRadius: '50%',
                            cursor: 'pointer'
                        }}
                             onClick={() => {
                                 handleClickOpen();
                             }}
                             className="flex justify-center items-center absolute top-0 right-2"
                        >
                            <MinusCircleIcon
                                style={{height: "18px", width: "18px"}}
                                className="text-gray-500"
                            />
                        </div>
                    )}
                </div>
            </div>
            {/*文本*/}
            <div style={{marginLeft: '20px'}}
                 className={changeTheme ? 'darknessFont' : 'brightFont'}>{post?.content || ''}</div>
            {/*图片*/}
            {post && post.picUrl ? <img src={post.picUrl || ''} alt={''} style={{width: '100%',}}/> : ''}
            {/*几条聊天*/}
            <div style={{marginTop: "10px"}} className="ml-5 mr-5">
                <div className="flex justify-between w-full">
                    {/*点赞数*/}
                    <div className="flex items-center space-x-0.5 cursor-pointer hover:underline">
                        <ThumbUpIcon
                            className="h-4 text-gray-40"
                            style={{fill: `${liked ? "black" : "gray"}`}}
                        />
                        <p className="text-md text-gray-500 font-light select-none">
                            {/*{post && post?.likes ? post?.likes.length : 0}*/}
                            {post && post?.likeNum}
                        </p>
                    </div>
                    <p
                        onClick={() => getComments(post.postId)}
                        className="text-gray-500 cursor-pointer hover:underline font-light select-none"
                    >{`${comments ? comments.length : 0}   comments`}</p>
                </div>
            </div>
            {/*点赞*/}
            {/*<div*/}
            {/*    className={`flex space-x-4 ml-4 mr-4 justify-evenly items-center text-gray-500 ${styled.postCardBoxClick}`}*/}
            {/*>*/}
            {/*    <div*/}
            {/*        onClick={() => handleLike()}*/}
            {/*        className={`flex flex-grow justify-center space-x-2 mb-1 mt-1 pt-2 pb-2 pl-2.5 pr-2.5 rounded-xl cursor-pointer ${changeTheme?'darknesDarkItem':'brightWhiteItem'} `}*/}
            {/*    >*/}
            {/*        <ThumbUpOutlineIcon*/}
            {/*            className={`h-6 ${liked ? "text-transparent" : ""}`}*/}
            {/*            style={{*/}
            {/*                fill: `${liked ? "black" : "transparent"}`,*/}
            {/*            }}*/}
            {/*        />*/}
            {/*        <p*/}
            {/*            style={{*/}
            {/*                userSelect: "none",*/}
            {/*                color: `${liked ? "black" : "rgba(107, 114, 128)"}`,*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            Like*/}
            {/*        </p>*/}
            {/*    </div>*/}
            {/*    <div*/}
            {/*        onClick={() => setShowComments((prev) => !prev)}*/}
            {/*        className={` ${changeTheme?'darknesDarkItem':'brightWhiteItem'} flex flex-grow justify-center  space-x-2 mb-1 mt-1 pt-2 pb-2 pl-2.5 pr-2.5 rounded-xl cursor-pointer`}*/}
            {/*    >*/}
            {/*        <ChatAltIcon className="h-6"/>*/}
            {/*        <p style={{userSelect: "none"}}>Comment</p>*/}
            {/*    </div>*/}
            {/*    /!*<div*!/*/}
            {/*    /!*    onClick={() => {*!/*/}
            {/*    /!*        copy(`${baseUrl}/post/${post.id}`);*!/*/}
            {/*    /!*    }}*!/*/}
            {/*    /!*    className="flex flex-grow justify-center hover:bg-gray-100 space-x-2 mb-1 mt-1 pt-2 pb-2 pl-2.5 pr-2.5 rounded-xl cursor-pointer"*!/*/}
            {/*    /!*>*!/*/}
            {/*    /!*    <ShareIcon className="h-6"/>*!/*/}
            {/*    /!*    <p style={{userSelect: "none"}}>Share</p>*!/*/}
            {/*    /!*</div>*!/*/}
            {/*</div>*/}
            {/*发送消息*/}
            {showComments && (
                <div className="pb-4">
                    <div className="flex items-center pt-4 pl-5 pr-5 ">
                        <form className="w-full">
                            {/* div which contains the profilepic and the input div */}
                            <div className="flex space-x-2 items-center">
                                <img width={50} height={50} style={{borderRadius: '50%'}}
                                     src={user?.profilePicUrl || '/Ellipse1.png'}
                                     alt="profile pic"
                                />
                                <div
                                    style={{padding: "10px"}}
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
                    {comments && comments.length > 0 &&
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
                </div>
            )}
        </div>
    );
}

export default PostCard;

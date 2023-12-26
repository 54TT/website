import React, {useContext, useEffect, useRef, useState} from "react";
import Link from 'next/link'
import {
    MinusCircleIcon,
} from "@heroicons/react/outline";
import {Input, notification} from 'antd'
import dynamic from 'next/dynamic'
const ReusableDialog = dynamic(() => import('./ReusableDialog'), {ssr: false});
const CommentComponent = dynamic(() => import('./CommentComponent'), {ssr: false});
const {TextArea} = Input
import dayjs from 'dayjs'
import {CountContext} from '/components/Layout/Layout';
import {request} from "/utils/hashUrl";
import {arrayUnique} from "/utils/set";
import cookie from "js-cookie";

const notify = () => {
    notification.success({
        message: `Post deleted successfully!`, placement: 'topLeft',
        duration: 2
    });
}

function PostCard({post, user, change, liked}) {
    const {changeTheme, setLogin} = useContext(CountContext);
    // 评论
    const [comments, setComments] = useState([]);
    const [commentsAdd, setCommentsAdd] = useState([]);
    const [commentBol, setCommentBol] = useState(false);
    // 评论数
    const [commentNum, setCommentNum] = useState(0);

    // 删除评论  id
    const [commentId, setCommentId] = useState(null);

    const changComment = (id) => {
        setCommentId(id)
    }
    useEffect(() => {
        if (commentId) {
            const data = [...commentsAdd]
            const params = data.filter((i) => i.id !== commentId)
            setCommentsAdd(params)
            setCommentId(null)
        }
    }, [commentId])
    // 评论页码
    const [commentPage, setCommentPage] = useState(1);

    // 判断是评论还是加载更多
    const [commentStatus, setCommentStatus] = useState('');

    useEffect(() => {
        if (commentBol) {
            if (comments.length > 0) {
                if (commentStatus === 'many') {
                    const data = [...commentsAdd.concat(comments)]
                    let aa = arrayUnique(data, 'id')
                    setCommentsAdd(aa)
                } else if (commentStatus === 'enter') {
                    const data = [...comments.concat(commentsAdd)]
                    let aa = arrayUnique(data, 'id')
                    setCommentsAdd(aa)
                } else {
                    setCommentsAdd(comments)
                }
            }
            setCommentBol(false)
        }
    }, [commentBol]);
    useEffect(() => {
        if (post && post?.commentNum) {
            setCommentNum(post?.commentNum)
        } else {
            setCommentNum(0)
        }
    }, [post])
    // 发送的信息
    const [commentText, setCommentText] = useState("");
    // 展示评论
    const [showComments, setShowComments] = useState(false);
    // 提交评论按钮
    const buttonRef = useRef(null);
    const [open, setOpen] = useState(false);
    // 发送评论
    const createComment = async (e) => {
        try {
            e.preventDefault();
            const token = cookie.get('token')
            const res = await request('post', '/api/v1/post/comment', {
                postId: post?.postId,
                content: commentText
            }, token)
            if (res === 'please') {
                setLogin()
            } else if (res && res?.data && res?.status === 200 && res?.data?.code && res?.data?.code === 200) {
                setCommentText('')
                const newComment = {
                    id: dayjs().valueOf(),
                    beReplyUserAvatar:user?.avatarUrl,
                    replyUserId:user?.uid,
                    replyUsername:user?.username,
                    replyUserAddress:user.address,
                    content: commentText,
                    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                };
                const dat = [newComment, ...comments]
                setCommentStatus('enter')
                setComments(dat)
                setCommentBol(true)
                setCommentNum((res) => Number(res) + 1)
            }
        } catch (err) {
            return null
        }
    };

    const onEnterPress = (e) => {
        if (e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();
            buttonRef.current.click();
        }
    };
    const handleLike = async () => {
        // const data = await likePost(post?.id, user?.id, !liked)
        // if (data && data.status === 200) {
        //     change('click')
        // }
    };
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleAgree = async () => {
        try {
            const token = cookie.get('token')
            const res = await request('delete', '/api/v1/post/' + post?.postId, '', token)
            if (res === 'please') {
                setLogin()
            } else if (res && res?.status === 200) {
                setOpen(false);
                change('click', post?.postId);
            }
        } catch (err) {
            return null
        }
    };
    const handleDisagree = () => {
        handleClose();
    };
    const getComments = async (page) => {
        try {
            const token = cookie.get('token')
            const res = await request('post', '/api/v1/post/comment/list', {postId: post?.postId, page: page}, token)
            if (res === 'please') {
                setLogin()
            } else if (res && res?.status === 200 && res?.data && res?.data?.comments) {
                setComments(res?.data?.comments)
                setCommentBol(true)
            } else {
                setCommentBol(true)
                setComments([])
            }
        } catch (err) {
            return null
        }
    }
    const clickPush = () => {
        if (Number(commentNum) > commentsAdd.length) {
            setCommentStatus('many')
            setCommentPage(commentPage + 1)
            getComments(commentPage + 1)
        }
    }
    return (


        <div
            className={`flex flex-col justify-start rounded-2xl shadow-md postBackCard ${changeTheme ? 'postBack' : 'whiteMode'}`}>
            {/*头像*/}
                <div className="flex space-x-3 items-center justify-between relative">
                    <div className={'flex items-center'}>
                    <img  style={{borderRadius: '50%',width:'40px',height:'40px',marginRight:'10px'}}
                         src={post && post?.user?.avatar ? post.user.avatar : '/dexlogo.svg'}
                         alt="userimg"/>
                    <div>
                        <Link href={`/person/${post?.user?.uid ? post.user.uid : ''}`}>
                            <div style={{
                                cursor: 'pointer',
                                fontSize: '20px'
                            }} className={changeTheme ? 'darknessFont' : 'brightFont'}>
                                {post?.user?.username ? post?.user?.username.length > 10 ? post.user.username.slice(0, 8) : post.user.username : post.user.address.slice(0, 5) + '...'}
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
                    {Number(post?.user?.uid) === Number(user?.uid) && (
                            <img  onClick={() => {
                                handleClickOpen();
                            }} src="/VectorSet.svg" alt="" width={'20px'} style={{cursor:'pointer'}}/>
                    )}
                </div>
            {/*文本*/}
            <div
                 className={changeTheme ? 'darknessFont' : 'brightFont'} style={{margin:'10px 0'}}>{post?.content || ''}</div>
            {/*图片*/}
            {post && post?.imageList && post?.imageList.length > 0 ?
                <img src={post?.imageList[0] || ''} alt={''} style={{width: '100%',display:'block',margin:'0 auto',borderRadius:'10px'}}/> : ''}
            {/*几条聊天*/}
                <div className="flex items-center justify-end w-full" style={{marginTop:'10px'}}>
                    {/*点赞数*/}
                    {/*<div className="flex items-center space-x-0.5 cursor-pointer hover:underline">*/}
                    {/*    <ThumbUpIcon*/}
                    {/*        className="h-4 text-gray-40"*/}
                    {/*        style={{fill: `${liked ? "black" : "gray"}`}}*/}
                    {/*    />*/}
                    {/*    <p className="text-md text-gray-500 font-light select-none">*/}
                    {/*        /!*{post && post?.likes ? post?.likes.length : 0}*!/*/}
                    {/*        {post && post?.likeNum}*/}
                    {/*    </p>*/}
                    {/*</div>*/}
                    <img src="/Group78.svg" alt="" width={'20px'}/>
                    <span
                        onClick={() => {
                            if (!showComments) {
                                getComments(1)
                            } else {
                                setCommentsAdd([])
                                setComments([])
                                setCommentStatus('')
                                setCommentPage(1)
                            }
                            setShowComments(!showComments)
                        }}
                        className={`cursor-pointer font-light select-none ${changeTheme?'fontW':'fontB'}`} style={{marginLeft:"5px"}}
                    >{`${commentNum}   comments>`}</span>
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
                    <div className="flex items-center pt-4 pl-5 pr-5 " style={{marginBottom:'15px'}}>
                        <form className="w-full">
                            {/* div which contains the profilepic and the input div */}
                            <div className="flex space-x-2 items-center">
                                <img style={{borderRadius: '50%',width:'50px',height:'50px'}}
                                     src={user?.profilePicUrl || '/dexlogo.svg'}
                                     alt="profile pic"
                                />
                                <div
                                    style={{padding: "17px"}}
                                    className={`flex bg-gray-100 rounded-3xl items-center w-full`}>
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

                    {commentsAdd && commentsAdd.length > 0 && (<div style={{height: '200px', overflowY: 'auto'}}>
                        {
                            commentsAdd.map((comment) => (
                                <CommentComponent
                                    key={comment.id}
                                    change={change}
                                    changComment={changComment}
                                    comment={comment}
                                    postId={post?.postId}
                                    user={user}
                                    setComments={setComments}
                                />
                            ))
                        }
                        {
                            Number(commentNum) > commentsAdd.length &&
                            <p style={{textAlign: 'center', cursor: 'pointer'}} onClick={clickPush}>加载更多</p>
                        }
                    </div>)}

                </div>
            )}
        </div>
    );
}

export default PostCard;

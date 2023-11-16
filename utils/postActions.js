import axios from "axios";
import catchErrors from "./catchErrors";
import baseUrl from '/utils/baseUrl'
const Axios = axios.create({
    baseURL: `${baseUrl}/api/posts`,
});

export const submitNewPost = async (
    userId,
    text,
    location,
    picUrl,
    setPosts,
    setNewPost,
    setError
) => {
    try {
        //post to /baseUrl/api/posts
        const res = await Axios.post("/", {userId, text, location, picUrl}); //on the backend, we destructure text, location and picUrl from req.body
        setPosts((prev) => [res.data, ...prev]); //adding the new post at the top of the array so that it shows up first in feed
        setNewPost({postText: "", location: ""});
    } catch (error) {
        const errorMsg = catchErrors(error);
        setError(errorMsg);
    }
};

export const deletePost = async (postId, setPosts, notify,change,userId) => {
    try {
       const data =  await Axios.delete(`/${postId}`,{data:{userId}});
       if(data&&data.status===200){
           notify();
           change()
       }
    } catch (error) {
    }
};

export const likePost = async (postId, userId,  like,change) => {
    try {
        if (like) {
            await Axios.post(`/like/${postId}`,{userId});
            change()
        } else {
            await Axios.put(`/unlike/${postId}`,{userId});
            change()
        }
    } catch (error) {
    }
};

export const postComment = async (postId, user, text, setComments, setText) => {
    try {
        const res = await Axios.post(`/comment/${postId}`, {text,userId:user?.id});
        setText("");
        const newComment = {
            id: res.data,
            user,
            text,
            date: Date.now(),
        };
        setComments((prev) => [newComment, ...prev]);
    } catch (error) {
    }
};

export const deleteComment = async (
    postId,
    commentId,
    setComments,
    notifyCommentDelete,handleClose,
    userId,change
) => {
    try {
       const data =  await Axios.delete(`/${postId}/${commentId}`,{data:{userId}});
        if(data.status===200){
            setComments((prev) => prev.filter((comment) => comment._id !== commentId));
            notifyCommentDelete();
            handleClose()
            change()
        }
    } catch (error) {
    }
};

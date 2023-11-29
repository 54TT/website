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
        return res
    } catch (error) {
        return error
        const errorMsg = catchErrors(error);
        setError(errorMsg);
    }
};

export const deletePost = async (postId, setPosts, notify,userId) => {
    try {
        return   await Axios.delete(`/${postId}`,{data:{userId}});
    } catch (error) {

    }
};

export const likePost = async (postId, userId,  like) => {
    try {
        if (like) {
            return await Axios.post(`/like/${postId}`, {userId})
        } else {
            return await Axios.put(`/unlike/${postId}`, {userId})
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
    userId
) => {
    try {
       const data =  await axios.delete(`/${postId}/${commentId}`,{data:{userId}});
        if(data.status===200){
            setComments((prev) => prev.filter((comment) => comment._id !== commentId));
            notifyCommentDelete();
            handleClose()
        }
    } catch (error) {
    }
};

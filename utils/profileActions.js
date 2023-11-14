import axios from "axios";
import cookie from "js-cookie";
import router from "next/router";
import catchErrors from "../utils/catchErrors";
import baseUrl from '/utils/baseUrl'

const Axios = axios.create({
    baseURL: `${baseUrl}/api/profile`,
    headers: {Authorization: cookie.get("token")},
});

export const followUser = async (
    userToFollowId,
    setUserFollowStats,
    userId
) => {
    try {
        const data = await Axios.post(`/follow/${userToFollowId}`, {userId});
        if(setUserFollowStats){
            setUserFollowStats((prev) => ({
                ...prev,
                following: [...prev.following, {user: userToFollowId}],
            }));
        }

        return data
    } catch (error) {
        console.log(catchErrors(error));
    }
};

export const unfollowUser = async (
    userToUnfollowId,
    setUserFollowStats,
    userId
) => {
    try {
        const data = await Axios.put(`/unfollow/${userToUnfollowId}`, {userId});
        if (setUserFollowStats) {
            setUserFollowStats((prev) => ({
                ...prev,
                following: prev.following.filter(
                    (following) => following.user !== userToUnfollowId
                ),
            }));
        }
        return data
    } catch (error) {
        console.log(catchErrors(error));
    }
};

export const profileUpdate = async (
    profile,
    setError,
    profilePicUrl,userId
) => {
    try {
      const data =   await Axios.post(`/update`, {...profile, profilePicUrl,userId});
      if(data.status===200){
          return true
      }
    } catch (error) {
        setError(catchErrors(error));
    }
};

export const profilePicturesUpdate = async (
    profilePicUrl,
    coverPicUrl,
    setLoading,
    setError,userId
) => {
    try {
        await Axios.post(`/updatepictures`, {profilePicUrl, coverPicUrl,userId});
        setLoading(false);
        // router.reload();
    } catch (error) {
        setError(catchErrors(error));
        setLoading(false);
    }
};

export const passwordUpdate = async (setSuccess, userPasswords) => {
    try {
        const {currentPassword, newPassword} = userPasswords;

        await Axios.post(`/settings/password`, {currentPassword, newPassword});
        setSuccess(true);
    } catch (error) {
        alert(catchErrors(error));
    }
};

export const toggleMessagePopup = async (
    popupSetting,
    setPopupSetting,
    setSuccess
) => {
    try {
        await Axios.post(`/settings/messagePopup`);
        setPopupSetting(!popupSetting); //if it's true, it'll be set to false and vice versa
        setSuccess(true);
    } catch (error) {
        alert(catchErrors(error));
    }
};

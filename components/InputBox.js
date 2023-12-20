import React, {useRef, useState, useEffect, useContext} from "react";
import {CameraIcon, ChevronUpIcon} from "@heroicons/react/solid";
import {ArrowSmRightIcon} from "@heroicons/react/solid";
import {XIcon} from "@heroicons/react/solid";
import {ChevronDownIcon} from "@heroicons/react/solid";
import {GlobalOutlined} from '@ant-design/icons'
import {ExclamationCircleIcon} from "@heroicons/react/outline";
import dynamic from "next/dynamic";
import {notification} from "antd";
import styled from '/public/styles/all.module.css'
import {request} from "/utils/hashUrl";
const InfoBox = dynamic(() => import('./HelperComponents/InfoBox'), {ssr: false})
import {CountContext} from "./Layout/Layout";
import cookie from "js-cookie";

function InputBox({user, setPosts, increaseSizeAnim, change}) {
    const {changeTheme, setLogin} = useContext(CountContext);
    const buttonRef = useRef(null);
    const filePickerRef = useRef(null);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState(null);
    const [textareaEnabled, setTextareaEnabled] = useState(false);
    const [newPost, setNewPost] = useState('');

    const handleChange = (e) => {
        const {name, value} = e.target;
        setNewPost(value);
    };

    const addImageFromDevice = async (e) => {
        const {files} = e.target;
        setImage(files[0]);
        setImagePreview(URL.createObjectURL(files[0]));
    };

    const createPost = async (e) => {
        try {
            e.preventDefault();
            let picUrl;
            if (image !== null) {
                const token = cookie.get('token')
                picUrl = await request('post', '/api/v1/upload/image', image, token);
                if (picUrl === 'please') {
                    setLogin()
                } else if (!picUrl && picUrl?.status !== 200) {
                    return setError("Error uploading image");
                }
            }
            if (newPost) {
                try {
                    const token = cookie.get('token')
                    const data = await request('post', "/api/v1/post/publish", {
                        uid: user?.uid,
                        address: user?.address,
                        post: {
                            content: newPost,
                            imageList: picUrl && picUrl?.data?.url ? [picUrl.data?.url] : undefined
                        }
                    }, token)
                    if (picUrl === 'please') {
                        setLogin()
                    } else if (data && data?.status === 200) {
                        change('send')
                        setImage(null);
                        setImagePreview(null);
                        setNewPost('')
                    } else {
                        setImage(null);
                        setImagePreview(null);
                        setNewPost('')
                    }
                } catch (err) {
                    return null
                }
            } else {
                notification.warning({
                    message: `Please note`, description: 'Text required', placement: 'topLeft',
                    duration: 2
                })
            }
        } catch (err) {
            return null
        }
    };

    const FormBottomHalf = ({}) => {
        return (
            <>
                {/*<p className={`mt-5 ${styled.inputBoxBoxLine}`}></p>*/}
                <div className="flex space-x-4 mt-2 ml-4 mr-4 justify-evenly items-center">
                    <div
                        className="flex flex-grow justify-center items-center hoverBut  space-x-2 mb-2 pt-2 pb-2 pl-2.5 pr-2.5 rounded-xl cursor-pointer"
                        onClick={() => filePickerRef.current.click()}
                    >
                        <CameraIcon className="h-7  "/>
                        <input
                            ref={filePickerRef}
                            onChange={addImageFromDevice}
                            type="file"
                            accept="image/*"
                            className={changeTheme?'fontW':'fontB'}
                            style={{display: "none"}}
                        />
                        <p className={changeTheme?'fontW':'fontB'}>Photo</p>
                    </div>
                    <button
                        className="flex flex-grow justify-center items-center hoverBut space-x-2 mb-2 pt-2 pb-2 pl-2.5 pr-2.5 rounded-xl cursor-pointer"
                        type="submit"
                        ref={buttonRef}
                        onClick={createPost}
                    >
                        <ArrowSmRightIcon className={changeTheme?'fontW h-7':'fontB h-7'}/>
                        <p className={changeTheme?'fontW':'fontB'}>Post</p>
                    </button>
                </div>
            </>
        );
    };
    const onEnterPress = (e) => {
        if (e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();
            buttonRef.current.click();
        }
    };
    return (
        <>
            <div className={`${styled.inputBoxBox} mt-3 mb-10`}>
                    <div className="flex items-center">
                        <form style={{width: '100%'}}>
                            <div className="flex  space-x-4 items-center">
                                <img src={user && user.avatarUrl ? user.avatarUrl : '/dexlogo.svg'}
                                     style={{borderRadius: "50%",width:'50px',height:"50px"}} alt="profile pic"/>
                                <div style={{width: '100%',background:'rgb(68,66,76)',borderRadius:'10px',padding:'15px 25px'}}
                                     className={`flex  items-center ${increaseSizeAnim.sizeIncUp}`}>
                                    <input
                                        name="postText"
                                        value={newPost}
                                        onChange={handleChange}
                                        className="outline-none w-full bg-transparent font-light text-md placeholder-gray-400 text-lg"
                                        type="text"
                                        placeholder={user ? `What's on your mind, ${user?.username ? user.username : user.address.slice(0, 5)}?` : "What's on your mind?"}></input>
                                    <img src="/GroupPhoto.svg" alt=""  onClick={() => filePickerRef.current.click()}  width={20} style={{marginRight:'15px',cursor:'pointer'}}/>
                                    <img src="/rightPost.svg" alt="" onClick={createPost} width={20} style={{cursor:'pointer'}}/>
                                    {imagePreview && (
                                        <>
                                            <div
                                                className={styled.inputBoxView}
                                            >
                                                <div className={styled.inputBoxIcon}
                                                     onClick={() => {
                                                         setImage(null);
                                                         setImagePreview(null);
                                                     }}
                                                >
                                                    <XIcon className="h-6 text-gray-700"/>
                                                </div>
                                                <img className={styled.inputBoxImg}
                                                     src={imagePreview}
                                                     alt="imagePreview"
                                                ></img>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            <input
                                ref={filePickerRef}
                                onChange={addImageFromDevice}
                                type="file"
                                accept="image/*"
                                style={{display: "none"}}
                            />

                            {/*<FormBottomHalf/>*/}
                        </form>
                    </div>
            </div>
            {error && (
                <InfoBox
                    Icon={ExclamationCircleIcon}
                    message={"Sorry, the post wasn't submitted"}
                    content={error}
                    setError={setError}
                />
            )}
        </>
    );
}

export default InputBox;

import React, {useRef, useState, useEffect} from "react";
import {CameraIcon, ChevronUpIcon} from "@heroicons/react/solid";
import {ArrowSmRightIcon} from "@heroicons/react/solid";
import {XIcon} from "@heroicons/react/solid";
import {ChevronDownIcon} from "@heroicons/react/solid";
import {GlobalOutlined} from '@ant-design/icons'
import uploadPic from "../utils/uploadPic";
import {submitNewPost} from "../utils/postActions";
import {ExclamationCircleIcon} from "@heroicons/react/outline";
// import InfoBox from "./HelperComponents/InfoBox";
import {LoadingOutlined} from '@ant-design/icons'
import dynamic from "next/dynamic";
import {notification} from "antd";
import styled from '/public/styles/all.module.css'
const InfoBox = dynamic(() => import('./HelperComponents/InfoBox'),{ ssr: false })

function InputBox({user, setPosts, increaseSizeAnim,change}) {
    const inputRef = useRef(null);
    const buttonRef = useRef(null);
    const filePickerRef = useRef(null);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [textareaEnabled, setTextareaEnabled] = useState(false);
    const [newPost, setNewPost] = useState({
        postText: "",
        location: "",
    });

    const {postText, location} = newPost;

    const handleChange = (e) => {
        const {name, value} = e.target;
        setNewPost((prev) => ({...prev, [name]: value}));
    };

    const addImageFromDevice = (e) => {
        const {files} = e.target;
        setImage(files[0]); //files that we receive from e.target is automatically an array, so we don't need Array.from
        setImagePreview(URL.createObjectURL(files[0]));
    };

    const createPost = async (e) => {
        e.preventDefault();
        setLoading(true);
        let picUrl;
        if (image !== null) {
            picUrl = await uploadPic(image);
            if (!picUrl) {
                setLoading(false);
                return setError("Error uploading image");
            }
        }
        if(newPost.postText){
            const data =   await submitNewPost(
                user?.id, newPost.postText,
                newPost.location,
                picUrl,
                setPosts,
                setNewPost,
                setError,
            );
            if(data&&data.status===200){
                change('send')
                setImage(null);
                setImagePreview(null);
                setLoading(false);
            }else {
                setImage(null);
                setImagePreview(null);
                setLoading(false);
            }
        }else{
            notification.warning({
                message: `Please note`, description: 'Text required', placement: 'topLeft',
                duration: 2
            })
        }
    };

    const FormBottomHalf = ({}) => {
        return (
            <>
        <p className={`mt-5 ${styled.inputBoxBoxLine}`}></p>
                <div className="flex space-x-4 mt-2 ml-4 mr-4 justify-evenly items-center">
                    <div
                        className="flex flex-grow justify-center items-center hover:bg-gray-100 space-x-2 mb-2 pt-2 pb-2 pl-2.5 pr-2.5 rounded-xl cursor-pointer"
                        onClick={() => filePickerRef.current.click()}
                    >
                        <CameraIcon className="h-7  "/>
                        <input
                            ref={filePickerRef}
                            onChange={addImageFromDevice}
                            type="file"
                            accept="image/*"
                            style={{display: "none"}}
                        />
                        <p>Photo</p>
                    </div>
                    <button
                        className="flex flex-grow justify-center items-center hover:bg-gray-100 space-x-2 mb-2 pt-2 pb-2 pl-2.5 pr-2.5 rounded-xl cursor-pointer"
                        type="submit"
                        ref={buttonRef}
                        onClick={createPost}
                    >
                        {loading ? (
                            <>
                                <LoadingOutlined
                                />
                            </>
                        ) : (
                            <>
                                <ArrowSmRightIcon className="h-7"/>
                                <p>Post</p>
                            </>
                        )}
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
                {textareaEnabled ? (
                    <>
                        <div className="pt-6 pl-6 pr-6">
                            <div className="flex space-x-4 items-center">
                                <img src={user && user.profilePicUrl ? user.profilePicUrl : '/Ellipse1.png'} alt=""
                                       style={{borderRadius: '50%'}} height={50} width={50}/>
                                <div>
                                    <p style={{marginBottom: 0, fontWeight: "600"}}>
                                        {user.username}
                                    </p>
                                    <div className="flex text-gray-500 text-sm space-x-1 items-center">
                                        <GlobalOutlined style={{fontSize: "18px"}}/>
                                        <p>Public</p>
                                    </div>
                                </div>
                            </div>
                            <form className=" mt-5 flex flex-col justify-evenly">
                                <div
                                    className={`p-3.5 bg-gray-100 rounded-xl items-center ${increaseSizeAnim.sizeIncDown} `}
                                >
                                    <textarea
                                        name="postText"
                                        value={postText}
                                        rows="4"
                                        style={{width:'100%',resize: 'none'}}
                                        onChange={handleChange}
                                        className={`outline-none  bg-transparent font-light text-md placeholder-gray-400 text-lg `}
                                        placeholder={`What's on your mind, ${user.name}?`}
                                        onKeyDown={onEnterPress}
                                    ></textarea>
                                    <ChevronUpIcon
                                        className="h-6 w-6 cursor-pointer text-gray-500 ml-auto"
                                        onClick={() => {
                                            setTextareaEnabled(false);
                                        }}
                                    />
                                </div>
                                {imagePreview && (
                                    <>
                                        <div className={styled.inputBoxView}>
                                            <div className={styled.inputBoxIcon} onClick={() => {
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
                                <FormBottomHalf/>
                            </form>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center pt-6 pl-6 pr-6">
                            <form style={{width: '100%'}}>
                                <div className="flex  space-x-4 items-center">
                                    <img src={user && user.profilePicUrl ? user.profilePicUrl : '/Ellipse1.png'} height={50}
                                           width={50} style={{borderRadius: "50%"}} alt="profile pic"/>
                                    <div style={{width: '100%'}}
                                         className={`flex p-3.5 bg-gray-100 rounded-full items-center ${increaseSizeAnim.sizeIncUp}`}
                                    >
                                        <input
                                            name="postText"
                                            value={postText}
                                            onChange={handleChange}
                                            className="outline-none w-full bg-transparent font-light text-md placeholder-gray-400 text-lg"
                                            type="text"
                                            placeholder={user ? `What's on your mind, ${user.name}?` : "What's on your mind?"}
                                        ></input>
                                        <ChevronDownIcon
                                            className="h-7 w-7 cursor-pointer text-gray-500"
                                            onClick={() => {
                                                setTextareaEnabled(true);
                                            }}
                                        />
                                    </div>
                                </div>

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
                                <FormBottomHalf/>
                            </form>
                        </div>
                    </>
                )}
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

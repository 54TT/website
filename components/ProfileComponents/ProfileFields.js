import React, {useContext, useState} from "react";
import {ArrowSmRightIcon, PencilAltIcon} from "@heroicons/react/solid";
import {profileUpdate} from "../../utils/profileActions";
import {
    YoutubeOutlined,
    TwitterOutlined,
    ArrowRightOutlined,
    FacebookOutlined,
    FormOutlined,
    InstagramOutlined,
    LoadingOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons'
import {useEffect} from "react";
import {notification} from "antd";
import styled from '/public/styles/all.module.css'
import {changeLang} from "/utils/set";
import {request} from "../../utils/hashUrl";

const notifyError = () => {
    notification.error({
        message: `Please enter a bio.`, description: 'Error reported', placement: 'topLeft',
        duration: 2
    });
}

function ProfileFields({isUserOnOwnAccount, user, change, getProfile}) {
    // isUserOnOwnAccount
    const username = changeLang('username')
    const [bio, setBio] = useState("");
    useEffect(() => {
        if (user) {
            setBio(user?.bio)
            setSocial({
                youtube: user?.youtube, twitter: user?.twitter, websiteLink:
                user?.websiteLink, discord: user?.discord
            })
        }
    }, [user])
    const [social, setSocial] = useState({});
    const [editProfile, setEditProfile] = useState(false);
    const [error, setError] = useState(false);
    const {youtube, twitter, websiteLink, discord} = social;
    const handleChange = (e) => {
        const {name, value} = e.target;
        if (name === "bio") {
            setBio(value);
            return;
        }
        setSocial((prev) => ({...prev, [name]: value}));
    };

    const updateProfile = async (e) => {
        if (bio === "") {
            notifyError();
            return;
        }

        const data = await request('post', "/api/v1/userinfo", {
            user: {
                ...user,
                ...social, bio
            }
        });
        if (data && data?.status === 200) {
            getProfile()
            setEditProfile(false)
        }
    };

    return (
        <div
            className={`bg-white justify-start rounded-2xl shadow-md p-5 ${styled.profileFieldsBox}`}
        >

            {/*修改*/}
            {editProfile ? (
                <div className="flex justify-between ml-1 mr-0.5 mb-1">
                    <h1
                        className="text-2xl font-semibold"
                    >
                        {username.intro}
                    </h1>
                    <div className={styled.profileFieldsIconBox}>
                        <ArrowLeftOutlined className={styled.profileFieldsIcon} onClick={() => {
                            setEditProfile(false)
                            setBio(user?.bio)
                            setSocial({
                                youtube: user?.youtube, twitter: user?.twitter, websiteLink:
                                user?.websiteLink, discord: user?.discord
                            })
                        }}/>
                        <ArrowRightOutlined className={styled.profileFieldsIcons} onClick={updateProfile}/>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex justify-between">
                        <h1
                            className="text-2xl font-semibold mb-1"
                        >
                            {username.intro}
                        </h1>
                        {isUserOnOwnAccount && (
                            <FormOutlined style={{fontSize: '20px', fontWeight: 'bold'}}
                                          onClick={() => setEditProfile(true)}
                            />
                        )}
                    </div>
                </>
            )}

            {/*数据*/}
            {editProfile ? (
                <div>
          <textarea className={styled.profileFieldsTextarea}
                    name="bio"
                    value={bio}
                    onChange={handleChange}
                    placeholder={username.enterBio}
                    rows="2"
                    wrap="soft"
          />
                    <div>
                        <div className={styled.profileFieldsDiv}>
                            <YoutubeOutlined style={{color: "#8f85de"}}/>
                            <input className={styled.profileFieldsInput}
                                   name="youtube"
                                   value={youtube}
                                   onChange={handleChange}
                                   placeholder="YouTube"
                            />
                        </div>
                        <div className={styled.profileFieldsDiv}>
                            <TwitterOutlined style={{color: "#8f85de"}}/>
                            <input className={styled.profileFieldsInput}
                                   name="twitter"
                                   value={twitter}
                                   onChange={handleChange}
                                   placeholder="Twitter"
                            />
                        </div>
                        <div className={styled.profileFieldsDiv}>
                            <InstagramOutlined style={{color: "#8f85de"}}/>
                            <input className={styled.profileFieldsInput}
                                   name="websiteLink"
                                   value={websiteLink}
                                   onChange={handleChange}
                                   placeholder="Instagram"
                            />
                        </div>
                        <div className={styled.profileFieldsDiv}>
                            <FacebookOutlined style={{color: "#8f85de"}}/>
                            <input className={styled.profileFieldsInput}
                                   name="discord"
                                   value={discord}
                                   onChange={handleChange}
                                   placeholder="discord"
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {bio !== "" ? (
                        <div>
                            <p>{bio}</p>
                        </div>
                    ) : (
                        isUserOnOwnAccount && (
                            <div className={styled.profileFieldsAdd}
                                 onClick={() => setEditProfile(true)}>{username.addBio}</div>
                        )
                    )}
                    {social.youtube === "" &&
                    social.discord === "" &&
                    social.twitter === "" &&
                    social.websiteLink === "" ? (
                        isUserOnOwnAccount && (
                            <div className={styled.profileFieldsAdd} onClick={() => setEditProfile(true)}>
                                {username.addSocial}
                            </div>
                        )
                    ) : (
                        <div className="mt-5">
                            {social?.youtube && (
                                <p className={styled.profileFieldsName}

                                   target="_blank"
                                   href={`https://${social?.youtube}`}
                                   rel="noopener noreferrer"
                                >
                                    <div className={styled.profileFieldsYou}>
                                        <YoutubeOutlined style={{color: "#8f85de"}}/>
                                        <p>{social?.youtube}</p>
                                    </div>
                                </p>
                            )}
                            {social?.twitter && (
                                <p className={styled.profileFieldsName}

                                   target="_blank"
                                   href={`https://${social.twitter}`}
                                   rel="noopener noreferrer"
                                >
                                    <div className={styled.profileFieldsYou}>
                                        <TwitterOutlined style={{color: "#8f85de"}}/>
                                        <p>{social?.twitter}</p>
                                    </div>
                                </p>
                            )}
                            {social?.discord && (
                                <p className={styled.profileFieldsName}
                                   target="_blank"
                                   href={`https://${social.discord}`}
                                   rel="noopener noreferrer"
                                >
                                    <div className={styled.profileFieldsYou}>
                                        <FacebookOutlined style={{color: "#8f85de"}}/>
                                        <p>{social?.discord}</p>
                                    </div>
                                </p>
                            )}
                            {social?.websiteLink && (
                                <p className={styled.profileFieldsName}
                                   target="_blank"
                                   href={`https://${social.websiteLink}`}
                                   rel="noopener noreferrer"
                                >
                                    <div className={styled.profileFieldsYou}>
                                        <InstagramOutlined style={{color: "#8f85de"}}/>
                                        <p>{social?.websiteLink}</p>
                                    </div>
                                </p>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ProfileFields;

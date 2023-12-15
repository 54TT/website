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
import {notification, Skeleton} from "antd";
import styled from '/public/styles/all.module.css'
import {changeLang} from "/utils/set";
import {request} from "../../utils/hashUrl";
import cookie from "js-cookie";
import {CountContext} from "../Layout/Layout";

const notifyError = () => {
    notification.error({
        message: `Please enter a bio.`, description: 'Error reported', placement: 'topLeft',
        duration: 2
    });
}

function ProfileFields({isUserOnOwnAccount, user, change, getProfile, showLoad}) {
    // isUserOnOwnAccount
    const username = changeLang('username')
    const {setLogin, changeTheme} = useContext(CountContext)
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
        try {
            if (bio === "") {
                notifyError();
                return;
            }
            const token = cookie.get('token')
            const data = await request('post', "/api/v1/userinfo", {
                user: {
                    ...user,
                    ...social, bio
                }
            }, token);
            if (data === 'please') {
                setEditProfile(false)
                setLogin()
            } else if (data && data?.status === 200) {
                getProfile()
                setEditProfile(false)
            }
        } catch (err) {
            setEditProfile(false)
            return null
        }
    };
    const list = [{name: 'youtube'}, {name: 'websiteLink'}, {name: 'twitter'}, {name: 'discord'}]

    return (
        <div
            className={` justify-start rounded-2xl shadow-md p-5 ${styled.profileFieldsBox} ${changeTheme ? 'introBack' : 'whiteMode'}`}>
            {
                showLoad ? <Skeleton active={true}/> : <>
                    {/*修改*/}
                    {editProfile ? (
                        <div className="flex justify-between ml-1 mr-0.5 mb-1">
                            <h1 className={`${changeTheme ? 'fontW' : 'fontB'} text-2xl font-semibold`}>
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
                                    className={`  ${changeTheme ? 'fontW' : 'fontB'} text-2xl font-semibold mb-1`}>
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
                            {/**/}
                            <textarea
                                className={`${changeTheme ? 'darknessThrees drakColor' : 'brightFore fontB'} ${styled.profileFieldsTextarea}`}
                                name="bio"
                                value={bio}
                                onChange={handleChange}
                                placeholder={username.enterBio}
                                rows="2"
                                wrap="soft"/>
                            {
                                list.map((i, index) => {
                                    return <div key={index}
                                                className={`${changeTheme ? 'darknessThrees' : 'brightFore'} ${styled.profileFieldsDiv}`}>
                                        {
                                            index === 0 ? <YoutubeOutlined style={{color: "#8f85de"}}/> : index === 1 ?
                                                <FacebookOutlined style={{color: "#8f85de"}}/> : index === 2 ?
                                                    <TwitterOutlined style={{color: "#8f85de"}}/> : index === 3 ?
                                                        <InstagramOutlined style={{color: "#8f85de"}}/> : ''
                                        }
                                        <input
                                            className={`${changeTheme ? 'darknessThrees drakColor' : 'brightFore fontB'}  ${styled.profileFieldsInput}`}
                                            name={i.name}
                                            value={social[i.name]}
                                            onChange={handleChange}
                                            placeholder={<span
                                                className={`${changeTheme ? 'drakColor' : 'fontB'} `}>{i.name}</span>}
                                        />
                                    </div>
                                })
                            }
                            {/*<div>*/}
                            {/*    <div className={`${changeTheme?'darknessThrees':'brightFore'} ${styled.profileFieldsDiv}`}>*/}
                            {/*        <YoutubeOutlined style={{color: "#8f85de"}}/>*/}
                            {/*        <input className={`  ${styled.profileFieldsInput}`}*/}
                            {/*               name="youtube"*/}
                            {/*               value={youtube}*/}
                            {/*               onChange={handleChange}*/}
                            {/*               placeholder="YouTube"*/}
                            {/*        />*/}
                            {/*    </div>*/}
                            {/*    <div className={`${changeTheme?'darknessThrees':'brightFore'} ${styled.profileFieldsDiv}`}>*/}
                            {/*        <TwitterOutlined style={{color: "#8f85de"}}/>*/}
                            {/*        <input className={styled.profileFieldsInput}*/}
                            {/*               name="twitter"*/}
                            {/*               value={twitter}*/}
                            {/*               onChange={handleChange}*/}
                            {/*               placeholder="Twitter"*/}
                            {/*        />*/}
                            {/*    </div>*/}
                            {/*    <div className={`${changeTheme?'darknessThrees':'brightFore'} ${styled.profileFieldsDiv}`}>*/}
                            {/*        <InstagramOutlined style={{color: "#8f85de"}}/>*/}
                            {/*        <input className={styled.profileFieldsInput}*/}
                            {/*               name="websiteLink"*/}
                            {/*               value={websiteLink}*/}
                            {/*               onChange={handleChange}*/}
                            {/*               placeholder="Instagram"*/}
                            {/*        />*/}
                            {/*    </div>*/}
                            {/*    <div className={styled.profileFieldsDiv}>*/}
                            {/*        <FacebookOutlined style={{color: "#8f85de"}}/>*/}
                            {/*        <input className={styled.profileFieldsInput}*/}
                            {/*               name="discord"*/}
                            {/*               value={discord}*/}
                            {/*               onChange={handleChange}*/}
                            {/*               placeholder="discord"*/}
                            {/*        />*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>
                    ) : (
                        <>
                            {bio !== "" ? (
                                <div>
                                    <p className={`${changeTheme ? 'drakColor' : 'fontB'} `}>{bio}</p>
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
                                        <div className={styled.profileFieldsName}
                                             target="_blank"
                                             href={`https://${social?.youtube}`}
                                             rel="noopener noreferrer"
                                        >
                                            <div
                                                className={`${changeTheme ? 'darknessThrees' : 'brightFore'} ${styled.profileFieldsYou}`}>
                                                <YoutubeOutlined style={{color: "#8f85de"}}/>
                                                <p className={`${changeTheme ? 'drakColor' : 'fontB'}`}>{social?.youtube}</p>
                                            </div>
                                        </div>
                                    )}
                                    {social?.twitter && (
                                        <div className={styled.profileFieldsName}
                                             target="_blank"
                                             href={`https://${social.twitter}`}
                                             rel="noopener noreferrer"
                                        >
                                            <div
                                                className={`${changeTheme ? 'darknessThrees' : 'brightFore'} ${styled.profileFieldsYou}`}>
                                                <TwitterOutlined style={{color: "#8f85de"}}/>
                                                <p className={`${changeTheme ? 'drakColor' : 'fontB'} `}>{social?.twitter}</p>
                                            </div>
                                        </div>
                                    )}
                                    {social?.discord && (
                                        <div className={styled.profileFieldsName}
                                             target="_blank"
                                             href={`https://${social.discord}`}
                                             rel="noopener noreferrer"
                                        >
                                            <div
                                                className={`${changeTheme ? 'darknessThrees' : 'brightFore'} ${styled.profileFieldsYou}`}>
                                                <FacebookOutlined style={{color: "#8f85de"}}/>
                                                <p className={`${changeTheme ? 'drakColor' : 'fontB'} `}>{social?.discord}</p>
                                            </div>
                                        </div>
                                    )}
                                    {social?.websiteLink && (
                                        <div className={styled.profileFieldsName}
                                             target="_blank"
                                             href={`https://${social.websiteLink}`}
                                             rel="noopener noreferrer"
                                        >
                                            <div
                                                className={`${changeTheme ? 'darknessThrees' : 'brightFore'} ${styled.profileFieldsYou}`}>
                                                <InstagramOutlined style={{color: "#8f85de"}}/>
                                                <p className={`${changeTheme ? 'drakColor' : 'fontB'} `}>{social?.websiteLink}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </>
            }
        </div>
    );
}

export default ProfileFields;

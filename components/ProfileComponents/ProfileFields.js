import React, {useContext, useState} from "react";
import { ArrowSmRightIcon, PencilAltIcon } from "@heroicons/react/solid";
import { profileUpdate } from "../../utils/profileActions";
import {YoutubeOutlined,TwitterOutlined,ArrowRightOutlined,FacebookOutlined,FormOutlined,InstagramOutlined,LoadingOutlined,ArrowLeftOutlined} from '@ant-design/icons'
import { useEffect } from "react";
import {notification} from "antd";
import styled from '/styles/all.module.css'
import {changeLang} from "/utils/set";
const notifyError = () =>{
  notification.error({
    message: `Please enter a bio.`, description: 'Error reported', placement: 'topLeft',
    duration:2
  });
}
function ProfileFields({ profile, isUserOnOwnAccount,user ,change}) {
  const username =changeLang('username')
  const [bio, setBio] = useState("");
  useEffect(()=>{
    if(profile){
      setBio(profile.bio)
      setSocial({youtube:profile?.youtube,twitter: profile?.twitter, instagram:
        profile?.instagram,facebook:profile?.facebook})
    }
  },[profile])
  const [social, setSocial] = useState({});
  const [editProfile, setEditProfile] = useState(false);
  const [error, setError] = useState(false);
  const { youtube, twitter, instagram, facebook } = social;
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "bio") {
      setBio(value);
      return;
    }
    setSocial((prev) => ({ ...prev, [name]: value }));
  };

  const updateProfile = async (e) => {
    if (bio === "") {
      notifyError();
      return;
    }
   const data =  await profileUpdate({ ...social, bio },  setError, null,user.id);
  if(data){
    change()
    setEditProfile(false)
  }
  };

  return (
    <div
      className={`bg-white justify-start rounded-2xl shadow-md p-5 ${styled.profileFieldsBox}`}
    >
      {editProfile ? (
        <div className="flex justify-between ml-1 mr-0.5 mb-1">
          <h1
            className="text-2xl font-semibold"
          >
            {username.intro}
          </h1>
          <div className={styled.profileFieldsIconBox}>
          <ArrowLeftOutlined className={styled.profileFieldsIcon} onClick={()=>setEditProfile(false)}/>
            <ArrowRightOutlined className={styled.profileFieldsIcons}   onClick={updateProfile}/>
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
              <FormOutlined style={{fontSize:'20px',fontWeight:'bold'}}
                onClick={() => setEditProfile(true)}
              />
            )}
          </div>
        </>
      )}
      {editProfile ? (
        <div>
          <textarea  className={styled.profileFieldsTextarea}
            name="bio"
            value={bio}
            onChange={handleChange}
            placeholder={username.enterBio}
            rows="2"
            wrap="soft"
          />
          <div>
            <div className={styled.profileFieldsDiv}>
              <YoutubeOutlined style={{ color: "#8f85de" }}/>
              <input className={styled.profileFieldsInput}
                name="youtube"
                value={youtube}
                onChange={handleChange}
                placeholder="YouTube"
              />
            </div>
            <div className={styled.profileFieldsDiv}>
              <TwitterOutlined style={{ color: "#8f85de" }}/>
              <input  className={styled.profileFieldsInput}
                name="twitter"
                value={twitter}
                onChange={handleChange}
                placeholder="Twitter"
              />
            </div>
            <div className={styled.profileFieldsDiv}>
              <InstagramOutlined style={{ color: "#8f85de" }}/>
              <input   className={styled.profileFieldsInput}
                name="instagram"
                value={instagram}
                onChange={handleChange}
                placeholder="Instagram"
              />
            </div>
            <div className={styled.profileFieldsDiv}>
              <FacebookOutlined style={{ color: "#8f85de" }}/>
              <input className={styled.profileFieldsInput}
                name="facebook"
                value={facebook}
                onChange={handleChange}
                placeholder="Facebook"
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
              <div  className={styled.profileFieldsAdd}  onClick={() => setEditProfile(true)}>{username.addBio}</div>
            )
          )}
          {social.youtube === "" &&
          social.facebook === "" &&
          social.twitter === "" &&
          social.instagram === "" ? (
            isUserOnOwnAccount && (
              <div  className={styled.profileFieldsAdd} onClick={() => setEditProfile(true)}>
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
                    <YoutubeOutlined style={{ color: "#8f85de" }}/>
                    <p>{social?.youtube}</p>
                  </div>
                </p>
              )}
              {social?.twitter&& (
                           <p className={styled.profileFieldsName}

                                       target="_blank"
                  href={`https://${social.twitter}`}
                  rel="noopener noreferrer"
                >
                  <div className={styled.profileFieldsYou}>
                    <TwitterOutlined style={{ color: "#8f85de" }}/>
                    <p>{social?.twitter}</p>
                  </div>
                </p>
              )}
              {social?.facebook && (
                     <p className={styled.profileFieldsName}
                                       target="_blank"
                  href={`https://${social.facebook}`}
                  rel="noopener noreferrer"
                >
                  <div className={styled.profileFieldsYou}>
                    <FacebookOutlined style={{ color: "#8f85de" }}/>
                    <p>{social?.facebook}</p>
                  </div>
                </p>
              )}
              {social?.instagram && (
                <p className={styled.profileFieldsName}
                  target="_blank"
                  href={`https://${social.instagram}`}
                  rel="noopener noreferrer"
                >
                  <div className={styled.profileFieldsYou}>
                    <InstagramOutlined style={{ color: "#8f85de" }}/>
                    <p>{social?.instagram}</p>
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

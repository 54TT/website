import React, { useState } from "react";
import styled from "styled-components";
import { ArrowSmRightIcon, PencilAltIcon } from "@heroicons/react/solid";
import { profileUpdate } from "../../utils/profileActions";
import {YoutubeOutlined,TwitterOutlined,ArrowRightOutlined,FacebookOutlined,FormOutlined,InstagramOutlined,LoadingOutlined,ArrowLeftOutlined} from '@ant-design/icons'
import { useEffect } from "react";
import {notification} from "antd";
const notifyError = () =>{
  notification.error({
    message: `Please enter a bio.`, description: 'Error reported', placement: 'topLeft',
    duration:2
  });
}
function ProfileFields({ profile, isUserOnOwnAccount,user ,change}) {
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
      style={{ fontFamily: "Inter", position: "relative" }}
      className="bg-white justify-start rounded-2xl shadow-md p-5"
    >
      {editProfile ? (
        <div className="flex justify-between ml-1 mr-0.5 mb-1">
          <h1
            className="text-2xl font-semibold"
            style={{ fontFamily: "inherit" }}
          >
            Intro
          </h1>
          <div style={{display:'flex',alignItems:'center',}}>
          <ArrowLeftOutlined style={{fontSize:'20px',fontWeight:'bold',marginRight:'10px',}} onClick={()=>setEditProfile(false)}/>
            <ArrowRightOutlined style={{fontSize:'20px',fontWeight:'bold'}}   onClick={updateProfile}/>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between">
            <h1
              className="text-2xl font-semibold mb-1"
              style={{ fontFamily: "inherit" }}
            >
              Intro
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
          <Bio
            name="bio"
            value={bio}
            onChange={handleChange}
            placeholder="Enter Bio"
            rows="2"
            wrap="soft"
          />
          <div>
            <SocialMedia>
              <YoutubeOutlined style={{ color: "#8f85de" }}/>
              <SocialMediaInput
                name="youtube"
                value={youtube}
                onChange={handleChange}
                placeholder="YouTube"
              />
            </SocialMedia>
            <SocialMedia>
              <TwitterOutlined style={{ color: "#8f85de" }}/>
              <SocialMediaInput
                name="twitter"
                value={twitter}
                onChange={handleChange}
                placeholder="Twitter"
              />
            </SocialMedia>
            <SocialMedia>
              <InstagramOutlined style={{ color: "#8f85de" }}/>
              <SocialMediaInput
                name="instagram"
                value={instagram}
                onChange={handleChange}
                placeholder="Instagram"
              />
            </SocialMedia>
            <SocialMedia>
              <FacebookOutlined style={{ color: "#8f85de" }}/>
              <SocialMediaInput
                name="facebook"
                value={facebook}
                onChange={handleChange}
                placeholder="Facebook"
              />
            </SocialMedia>
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
              <AddDiv onClick={() => setEditProfile(true)}>Add Bio</AddDiv>
            )
          )}
          {social.youtube === "" &&
          social.facebook === "" &&
          social.twitter === "" &&
          social.instagram === "" ? (
            isUserOnOwnAccount && (
              <AddDiv onClick={() => setEditProfile(true)}>
                Add Social Media Links
              </AddDiv>
            )
          ) : (
            <div className="mt-5">
              {social?.youtube && (
                <AnchorTag
                  target="_blank"
                  href={`https://${social?.youtube}`}
                  rel="noopener noreferrer"
                >
                  <SocialMediaDisplayDiv>
                    <YoutubeOutlined style={{ color: "#8f85de" }}/>
                    <p>{social?.youtube}</p>
                  </SocialMediaDisplayDiv>
                </AnchorTag>
              )}
              {social?.twitter&& (
                <AnchorTag
                  target="_blank"
                  href={`https://${social.twitter}`}
                  rel="noopener noreferrer"
                >
                  <SocialMediaDisplayDiv>
                    <TwitterOutlined style={{ color: "#8f85de" }}/>
                    <p>{social?.twitter}</p>
                  </SocialMediaDisplayDiv>
                </AnchorTag>
              )}
              {social?.facebook && (
                <AnchorTag
                  target="_blank"
                  href={`https://${social.facebook}`}
                  rel="noopener noreferrer"
                >
                  <SocialMediaDisplayDiv>
                    <FacebookOutlined style={{ color: "#8f85de" }}/>
                    <p>{social?.facebook}</p>
                  </SocialMediaDisplayDiv>
                </AnchorTag>
              )}
              {social?.instagram && (
                <AnchorTag
                  target="_blank"
                  href={`https://${social.instagram}`}
                  rel="noopener noreferrer"
                >
                  <SocialMediaDisplayDiv>
                    <InstagramOutlined style={{ color: "#8f85de" }}/>
                    <p>{social?.instagram}</p>
                  </SocialMediaDisplayDiv>
                </AnchorTag>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProfileFields;

const AddDiv = styled.div`
  cursor: pointer;
  padding: 0.65rem;
  margin-top: 1rem;
  background-color: #efeeef;
  border-radius: 0.4rem;
  :hover {
    background-color: #e2e2e2;
  }
  font-weight: 500;
`;


const Bio = styled.textarea`
  overflow: hidden;
  resize: none;
  outline: none;
  padding: 15px;
  margin: 0 0;
  border: 1.5px solid #f0e6ff;
  width: 100%;
  color: black;
  border-radius: 10px;

  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #8f85de;
    opacity: 0.46; /* Firefox */
  }
`;

const SocialMedia = styled.div`
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  padding: 1rem;
  margin: 1.5rem 0 0 0;
  border: 1.5px solid #f0e6ff;
`;

const SocialMediaInput = styled.input`
  width: 100%;
  outline: none;
  border: none;
  color: black;
  margin-left: 0.75rem;
  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #8f85de;
    opacity: 0.46; /* Firefox */
  }
`;

const SocialMediaDisplayDiv = styled.div`
  display: flex;
  column-gap: 0.4rem;
  margin-top: 0.7rem;
  padding: 0.5rem;
  padding: 0.65rem;
  background-color: #efeeef;
  border-radius: 0.4rem;
  cursor: pointer;
  :hover {
    background-color: #e2e2e2;
  }
  user-select: none;
`;

const AnchorTag = styled.a`
  color: black;
  text-decoration: none;
  :hover {
    color: black;
  }
`;

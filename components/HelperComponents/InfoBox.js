import {XIcon} from "@heroicons/react/solid";
import React, {useContext} from "react";
import styled from '/public/styles/all.module.css'
import {CountContext} from "../Layout/Layout";

function InfoBox({Icon, message, content, setError, marginTop}) {
    const {changeTheme} = useContext(CountContext);
    return (
        <div
            className={`${styled.infoBoxTop} rounded-xl shadow-md ${changeTheme ? 'postBack' : 'whiteMode'}`}>
            <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)'}}>
                <img src="/xiaoGroup.svg" alt="" width={'50px'} style={{display: 'block', margin: '0 auto'}}/>
                <p className={`postNoCard ${changeTheme ? 'postColor' : 'fontB'}`} style={{marginTop: '25px'}}>Sorry, no
                    posts...</p>
                <p className={`postNoCard ${changeTheme ? 'postColor' : 'fontB'}`} style={{margin: '5px 0'}}>Please
                    follow another user or create a new post to start seeing posts.</p>
                <p className={`postNoCard ${changeTheme ? 'postColorBot' : 'fontB'}`}>@DEXpertOfficial</p>
            </div>
        </div>
    );
}

export default InfoBox;

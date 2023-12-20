import React from "react";
import styled from '/public/styles/all.module.css'
import dayjs from "dayjs";


function Chat({user, text,chatUserData}) {
    return (
        <>
            {Number(text?.FromUid) === Number(user?.uid) ? (
                <div className={styled.chatLeft}>
                    <span>{text?.CreatedAt?dayjs(text?.CreatedAt).format('YYYY-MM-DD HH:mm:ss'):''}</span>
                    <p className={styled.chatP}>{text?.Content||''}</p>
                    <img src={user?.avatarUrl || '/dexlogo.svg'} alt=""  style={{marginLeft:'10px',borderRadius:'50%',width:'30px',height:'30px'}}/>
                </div>
            ) : (
                <div className={styled.chatRight}>
                    <img src={chatUserData?.avatarUrl || '/dexlogo.svg'} alt="" style={{marginRight:'10px',borderRadius:'50%',width:'30px',height:'30px'}} />
                    <p className={styled.chatP}>{text?.Content||''}</p>
                    <span>{text?.CreatedAt?dayjs(text?.CreatedAt).format('YYYY-MM-DD HH:mm:ss'):''}</span>
                </div>
            )}
        </>
    );
}

export default Chat;

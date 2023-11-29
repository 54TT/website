import React from "react";
import styled from '/styles/all.module.css'
function Chat({ user, text}) {
  return (
    <>
      {text?.sender_id === user?.id ||text?.senderId === user?.id ? (
        <div className={styled.chatLeft}>
          <p>{text.text}</p>
        </div>
      ) : (
        <div className={styled.chatRight}>
          <p>{text.text}</p>
        </div>
      )}
    </>
  );
}

export default Chat;

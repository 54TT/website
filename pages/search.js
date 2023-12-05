import React, { useState, useEffect, useContext } from "react";

import dynamic from "next/dynamic";
import styles from "../components/Layout/css/header.module.css";
import { CountContext } from "../components/Layout/Layout";
import cookie from "js-cookie";
import { changeLang } from "/utils/set";

function Search() {
  const header = changeLang("header");
  const ChatSearch = dynamic(() => import("../components/Chat/ChatSearch"), {
    ssr: false,
  });
  const { changeTheme } = useContext(CountContext);

  const [showChatSearch, setShowChatSearch] = useState(false);
  const showSearch = () => {
    if (cookie.get("name")) {
      // setShowChatSearch(true)
    } else {
      // getMoney()
    }
  };
  return (
    <>
      <div className={styles.mobliceSearchToken}>
        <div style={{marginTop: '20px', marginLeft: '-90px', display: 'flex', justifyContent: 'center'}}>
          <div className={styles.searchToken}>
            <p
              className={`${styles["search"]} ${
                changeTheme ? "darknessThree" : "brightFore boxHover"
              }`}
              onClick={showSearch}
            >
              {header.search}
            </p>
            {showChatSearch && (
              <ChatSearch
                setShowChatSearch={setShowChatSearch}
                chats={chats}
                setChats={setChats}
                user={userPar}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;

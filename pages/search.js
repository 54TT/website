import React, { useState, useEffect, useContext } from "react";

import dynamic from "next/dynamic";
import styles from "../components/Layout/css/header.module.css";
import { CountContext } from '/components/Layout/Layout';
import cookie from "js-cookie";
import { changeLang } from "/utils/set";
import { notification } from 'antd'

function Search() {
  const header = changeLang("header");
  const ChatSearch = dynamic(() => import("../components/Chat/ChatSearch"), {
    ssr: false,
  });
  const { changeTheme } = useContext(CountContext);

  const getMoney = () => {
    if (typeof window.ethereum === 'undefined') {
        notification.warning({
            message: `warning`, description: 'Please install MetaMask! And refresh', placement: 'topLeft',
            duration: 2
        });
    } else {
        if (!isConnected) {
            connect()
        } else {
            handleLogin()
        }
    }
}


  const [showChatSearch, setShowChatSearch] = useState(false);
  const showSearch = () => {
    if (cookie.get("name")) {
      setShowChatSearch(true)
    } else {
      getMoney()
    }
  };
  const menuItem = [
    {id: '1', key: 'DEDE', value: 'WTTH'},
    {id: '2', key: 'DEDE', value: 'WTTH'},
    {id: '3', key: 'DEDE', value: 'WTTH'},
    {id: '4', key: 'DEDE', value: 'WTTH'},
    {id: '5', key: 'DEDE', value: 'WTTH'}
  ]
  const changeAllTheme = (a, b) => {
    return changeTheme ? a : b;
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
        <div style={{marginLeft: '-70px', marginTop: '20px'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <img src="/icon_graph_moblice.svg" alt="zhexiantu"/>
            <p className={changeTheme?'darknessFont':'brightFont'} style={{ marginLeft: '10px' }}>Featured:</p>
          </div>
          <div style={{ marginTop: '10px' }}>
            { menuItem.map((item, index) => {
              return (
                <div key={index} style={{ display: 'flex'}}>
                  <p className={`${changeAllTheme('darknessFont', 'brightFont')}`}>{item.key} / </p>
                  <span style={{ color: 'rgb(156, 156, 156)' }}>{item.value}</span>
                </div>
              )
            }) }
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;

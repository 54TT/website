import axios from "axios";
import {useRouter} from "next/router";
import React, {useState, useEffect, useRef, useContext} from "react";
import baseUrl from "../utils/baseUrl";
import io from "socket.io-client";
import Sidebar from "../components/Sidebar";
import {SearchIcon} from "@heroicons/react/outline";
import calculateTime from "../utils/calculateTime";
import {LoadingOutlined} from '@ant-design/icons'
import {AppleOutlined,} from '@ant-design/icons'
import Link from 'next/link';
import dynamic from 'next/dynamic'
import cook from "js-cookie";
import styles from '/public/styles/allmedia.module.css'
import { CountContext } from '../components/Layout/Layout'

const ChatSearch = dynamic(() => import('../components/Chat/ChatSearch'),{ ssr: false });
const Chat = dynamic(() => import('../components/Chat/Chat'),{ ssr: false });
import {changeLang} from "/utils/set";
import {request} from "../utils/hashUrl";
import cookie from "js-cookie";
function ChatsPage() {
    const { changeTheme } = useContext(CountContext);
    const social=changeLang('social')
    const [chats, setChats] = useState([]);
    const [userPar, setUserPar] = useState({});
    const getUs = async () => {
        const params =JSON.parse( cookie.get('username'))
        const data = await request('get', "/api/v1/userinfo/"+params?.uid,'')
        if(data&&data?.status===200){
            setUserPar(data?.data?.data)
        }else {
            setUserPar('')
        }
    }
    useEffect(() => {
        if (cook.get('name')) {
            getUs()
        }
    }, [cook.get('name')]);
    const router = useRouter();
    const socket = useRef();
    const [texts, setTexts] = useState([]);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [newText, setNewText] = useState("");
    const [chatUserData, setChatUserData] = useState({
        name: "",
        profilePicUrl: "",
    });
    const getParams = async () => {
        if (userPar && userPar.uid) {
            const res = await axios.get(`${baseUrl}/api/chats`, {
                params: {userId: userPar?.uid}
            });
            if (res.status === 200) {
                setChats(res.data)
            } else {
                setChats([])
            }
        }
    }
    const [takeOver, setTakeOver] = useState(false)
    useEffect(() => {
        // getParams()
    }, [userPar, takeOver])
    const openChatId = useRef("");
    const [showChatSearch, setShowChatSearch] = useState(false);
    const da = () => {
        setShowChatSearch(!showChatSearch)
    }

    useEffect(() => {
        if (!socket.current) {
            socket.current = io(baseUrl);
        }
        if (socket.current && userPar && userPar?.uid) {
            socket.current.emit("join", {userId: userPar?.uid});
            socket.current.on("connectedUsers", ({users}) => {
                setConnectedUsers(users);
            });
        }
        if (
            chats &&
            chats.length > 0 &&
            !router.query.chat &&
            router.pathname === "/chats"
        ) {
            router.push(`/chats?chat=${chats[0].textsWith}`, undefined, {
                shallow: true,
            });
        }
        if (userPar && userPar.uid) {
            postPar();
        }
    }, [userPar]);
    useEffect(() => {
        if (userPar && userPar.uid && router.query.chat) {
            const loadTexts = () => {
                socket?.current.emit("loadTexts", {
                    userId: userPar.uid,
                    textsWith: router.query.chat,
                });
                socket?.current.on("textsLoaded", ({chat, textsWithDetails}) => {
                    if (textsWithDetails) {
                        setTexts([]);
                        setChatUserData({
                            name: textsWithDetails.username,
                            profilePicUrl: textsWithDetails.profilePicUrl,
                        });
                        openChatId.current = router.query?.chat;
                    } else {
                        setTexts(chat?.texts && chat.texts.length > 0 ? chat?.texts : []);
                        scrollToBottom();
                        setChatUserData({
                            name: chat?.textsWith.username,
                            profilePicUrl: chat?.textsWith.profilePicUrl,
                        });
                        openChatId.current = chat?.texts_with_id;
                    }
                });
            };
            if (socket?.current && router.query?.chat) {
                loadTexts();
            }
        }
    }, [router.query.chat, userPar]);
    const sendText = (e, text) => {
        e.preventDefault();
        if (text) {
            if (socket.current) {
                if (userPar && userPar.uid) {
                    socket?.current.emit("sendNewText", {
                        userId: userPar.uid,
                        userToTextId: openChatId?.current,
                        text,
                    });
                }
            }
        }
        setNewText("");
    };

    useEffect(() => {
        if (socket.current) {
            socket.current.on("textSent", ({newText}) => {
                if (newText.receiverId === openChatId?.current) {
                    setTexts((prev) => [...prev, newText]);
                    setChats((prev) => {
                        let previousChat = prev.find(
                            (chat) => chat.textsWith === newText.receiverId
                        );
                        if (!previousChat || !previousChat.lastText) {
                            previousChat = {
                                lastText: '',
                                created_at: ''
                            }
                        }
                        previousChat.lastText = newText.text;
                        previousChat.created_at = newText.created_at;
                        return [...prev];
                    });
                }
            });
            socket.current.on("newTextReceived", async ({newText, userDetails}) => {
                if (newText?.senderId === openChatId?.current) {
                    setTexts((prev) => [...prev, newText]);
                    setChats((prev) => {
                        let previousChat = prev.find(
                            (chat) => chat.textsWith === newText.senderId
                        );
                        if (!previousChat || !previousChat.lastText) {
                            previousChat = {
                                lastText: '',
                                created_at: ''
                            }
                        }
                        previousChat.lastText = newText.text;
                        previousChat.created_at = newText.created_at;
                        return [...prev];
                    });
                } else {
                    const ifPreviouslyTexted = chats.filter((chat) => chat.textsWith === newText.senderId).length > 0;
                    if (ifPreviouslyTexted) {
                        setChats((prev) => {
                            let previousChat = prev.find(
                                (chat) => chat.textsWith === newText.senderId
                            );
                            if (!previousChat || !previousChat.lastText) {
                                previousChat = {
                                    lastText: '',
                                    created_at: ''
                                }
                            }
                            previousChat.lastText = newText.text;
                            previousChat.created_at = newText.created_at;
                            return [...prev];
                        });
                    } else {
                        setTakeOver(!takeOver)
                    }
                }
            });
        }
        return () => {
            if (socket.current) {
                socket.current.off("textSent");
                socket.current.off("newTextReceived");
            }
        };
    }, [newText, socket, chats]);
    const endOfMessagesRef = useRef(null);
    const scrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    useEffect(() => {
        texts.length > 0 && scrollToBottom();
    }, [texts]);
    const postPar = async () => {
        try {
            await axios.post(
                `${baseUrl}/api/chats`,
                {userId: userPar.uid}
            );
        } catch (error) {

        }
    }
    // 获取屏幕
    const [winHeight, setHeight] = useState();
    const [chatHeight, setChatHeight] = useState()
    const isAndroid = () => {
        const u = window?.navigator?.userAgent;
        if (u.indexOf("Android") > -1 || u.indexOf("iPhone") > -1) return true;
        return false;
    };
    useEffect(() => {
        if (isAndroid()) {
            setHeight(window.innerHeight - 180);
            setChatHeight(window.innerHeight - 269)
        } else {
            setHeight("auto");
            setChatHeight("auto");
        }
    });
    const changeAllTheme = (a, b) => {
        return changeTheme ? a : b
    }




    return (
        <div className={styles.allMobliceBox}>
            <div 
                className={styles.allMoblice} 
                style={{backgroundColor: 'rgb(253,213,62)', marginRight: '20px', borderRadius: '10px', height: winHeight, minHeight: winHeight}}>
                <main className="flex" style={{height: winHeight}}>
                    <Sidebar user={userPar} maxWidth={"250px"}/>
                    <div style={{backgroundColor: 'rgba(201,201,201,0.7)'}}
                        className={`${styles.mobliceNonoFlex} ${changeAllTheme('darknessTwo', 'brightTwo')} flex flex-grow mx-auto h-full w-full max-w-2xl lg:max-w-[65rem] xl:max-w-[70.5rem] rounded-lg`}>
                        <div
                            style={{
                                borderLeft: "1px solid lightgrey",
                                borderRight: "1px solid lightgrey",
                                fontFamily: "Inter",
                                overflowY: 'auto',
                            }}
                            className={`${styles.allMobliceH} lg:min-w-[27rem] pt-4 ${changeAllTheme('darknessTwo', 'brightTwo')}`}
                        >
                            <p style={{
                                userSelect: 'none',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                fontFamily: 'Inter',
                                margin:'15px',
                            }}>{social.chats}</p>
                            <div
                                onClick={() => setShowChatSearch(true)}
                                className="flex items-center  relative rounded-full bg-gray-100 p-2  m-4 h-12">
                                <SearchIcon className="h-5 text-gray-600 px-1.5 md:px-0 cursor-pointer"/>
                                <input
                                    className="ml-2 bg-transparent outline-none placeholder-gray-500 w-full font-thin hidden md:flex md:items-center flex-shrink"
                                    type="text"
                                    placeholder={social.search}
                                />
                                {showChatSearch && (
                                    <ChatSearch
                                        setShowChatSearch={da}
                                        chats={chats}
                                        setChats={setChats}
                                        user={userPar}
                                    />
                                )}
                            </div>
                            <div className="mt-4" style={{borderTop: "1px solid #efefef"}}>
                                <>
                                    {chats && chats.length > 0 ? (
                                        chats.map((chat) => (
                                            <Link href={`/chats?chat=${chat?.textsWith}`} key={chat.textsWith}>
                                                <div style={{
                                                    display: 'flex',
                                                    cursor: 'pointer',
                                                    borderRadius: '7px',
                                                    borderBottom: '1px solid #efefef',
                                                    padding: '12px',
                                                    alignItems: 'flex-start',
                                                    columnGap: '10px',
                                                }}>
                                                    <div className="relative">
                                                        <img width={80} height={80} style={{
                                                            borderRadius: '50%'
                                                        }} src={chat?.profilePicUrl || '/Ellipse1.png'} alt="userimg"/>
                                                        {connectedUsers?.length > 0 &&
                                                        connectedUsers.filter(
                                                            (user) => user.userId === chat?.textsWith
                                                        ).length > 0 ? (
                                                            <AppleOutlined
                                                                style={{
                                                                    color: "#55d01d",
                                                                    fontSize: "20px",
                                                                    position: "absolute",
                                                                    bottom: "-10px",
                                                                    right: "0",
                                                                }}
                                                            />
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </div>
                                                    <div className="ml-1">
                                                        {
                                                            chat?.username ?
                                                                <p style={{
                                                                    userSelect: 'none',
                                                                    fontWeight: 'bold',
                                                                    fontSize: '18px',
                                                                    marginBottom: '10px'
                                                                }}>{chat?.username?.length > 10 ? chat.username.slice(0, 5) + '...' + chat.username.slice(-5) : chat.username}</p> :
                                                                <p style={{
                                                                    userSelect: 'none',
                                                                    fontWeight: 'bold',
                                                                    fontSize: '18px',
                                                                    marginBottom: '10px'
                                                                }}>{chat?.name?.length > 10 ? chat.name.slice(0, 5) + '...' + chat.name.slice(-5) : chat.name}</p>
                                                        }
                                                        <p style={{
                                                            marginTop: '-13px'
                                                        }}>
                                                            {chat.lastText && chat.lastText.length > 30
                                                                ? `${chat.lastText.substring(0, 30)}...`
                                                                : chat.lastText}
                                                        </p>
                                                    </div>
                                                    {chat.created_at && (
                                                        <p style={{
                                                            marginLeft: 'auto'
                                                        }}>{calculateTime(chat.created_at, true)}</p>
                                                    )}
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <>
                                            <p className="p-5 text-gray-500">
                                                {social.one}
                                            </p>
                                        </>
                                    )}
                                </>
                            </div>
                        </div>
                        {/*右边聊天*/}
                        {router.query?.chat && (
                            <div
                                style={{
                                    flex: "1",
                                    borderRight: "1px solid lightgrey",
                                    fontFamily: "Inter",
                                }}
                            >
                                {/*右边聊天*/}
                                {chatUserData && chatUserData.profilePicUrl ? (
                                    <div style={{
                                        display: 'flex',
                                        cursor: 'pointer',
                                        borderRadius: '8px',
                                        borderBottom: '1px solid #efefef',
                                        padding: '10px',
                                        alignItems: 'center',
                                        columnGap: '7px'
                                    }}>
                                        <img width={80} height={80} style={{
                                            borderRadius: '50%'
                                        }} src={chatUserData?.profilePicUrl || '/Ellipse1.png'} alt="userimg"/>
                                        <div>
                                            <p style={{
                                                userSelect: 'none',
                                                fontWeight: 'bold',
                                                fontSize: '18px',
                                                marginBottom: '10px',
                                            }}>{chatUserData?.name.length > 7 ? chatUserData.name.slice(0, 3) + '...' + chatUserData.name.slice(-3) : chatUserData.name}</p>
                                            {connectedUsers.length > 0 &&
                                                connectedUsers.filter(
                                                    (user) => user?.userId === openChatId?.current
                                                ).length > 0 && <p style={{
                                                    userSelect: 'none',
                                                    fontSize: '15px',
                                                    color: 'rgba(107, 114, 128)',
                                                    marginTop: '-17px',
                                                }}>{"Online"}</p>}
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="max-w-[28rem]"
                                        style={{padding: "14px"}}
                                    >
                                        <LoadingOutlined/>
                                    </div>
                                )}

                                <div
                                    className=" flex flex-col justify-between"
                                    style={{
                                        height: chatHeight,
                                    }}
                                >
                                    <div
                                        className="mt-3 pl-4 pr-4 overflow-y-auto"
                                        style={{scrollbarWidth: "thin"}}
                                    >
                                        <>
                                            {texts.length > 0 ? (
                                                texts.map((text, i) => (
                                                    <Chat
                                                        key={i}
                                                        user={userPar}
                                                        text={text}
                                                    />
                                                ))
                                            ) : (
                                                <div></div>
                                            )}
                                            <div style={{marginBottom: '30px'
                                            }} ref={endOfMessagesRef}/>
                                        </>
                                    </div>
                                    <div
                                        style={{
                                            borderTop: "1px solid #efefef",
                                            borderBottom: "1px solid #efefef",
                                        }}
                                    >
                                        <form
                                            className="flex items-center rounded-full bg-gray-100 p-4 m-4 max-h-12"
                                        >
                                            <input
                                                className="bg-transparent outline-none placeholder-gray-500 w-full font-thin hidden md:flex md:items-center flex-shrink"
                                                type="text"
                                                value={newText}
                                                onChange={(e) => {
                                                    setNewText(e.target.value);
                                                }}
                                                placeholder={social.send}
                                            />
                                            <button
                                                hidden
                                                disabled={!newText}
                                                type="submit"
                                                onClick={(e) => sendText(e, newText)}
                                            >
                                                Send Message
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}


export default ChatsPage;


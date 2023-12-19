import axios from "axios";
import {useRouter} from "next/router";
import React, {useState, useEffect, useRef, useContext} from "react";
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
import {CountContext} from '../components/Layout/Layout'
import {EventSourcePolyfill} from 'event-source-polyfill';

const ChatSearch = dynamic(() => import('../components/Chat/ChatSearch'), {ssr: false});
const Chat = dynamic(() => import('../components/Chat/Chat'), {ssr: false});
import {changeLang} from "/utils/set";
import {request} from "../utils/hashUrl";
import cookie from "js-cookie";
import dayjs from "dayjs";

function ChatsPage() {
    const {changeTheme, setLogin} = useContext(CountContext);
    const social = changeLang('social')
    // 聊天列表
    const [chats, setChats] = useState([]);
    // 登录用户
    const [userPar, setUserPar] = useState({});
    const getUs = async () => {
        try {
            const params = JSON.parse(cookie.get('username'))
            const token = cookie.get('token')
            const data = await request('get', "/api/v1/userinfo/" + params?.uid, '', token)
            if (data === 'please') {
                setLogin()
            } else if (data && data?.status === 200) {
                setUserPar(data?.data?.data)
            } else {
                setUserPar('')
            }
        } catch (err) {
            setUserPar('')
            return null
        }
    }
    useEffect(() => {
        if (cook.get('username') && cook.get('username') != 'undefined') {
            getUs()
        }
    }, [cook.get('username')]);
    const router = useRouter();
    const socket = useRef(null);
    // 聊天消息
    const [texts, setTexts] = useState([]);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [newText, setNewText] = useState("");
    // 聊天的对象
    const [chatUserData, setChatUserData] = useState(null);
    const openChatId = useRef("");
    const [showChatSearch, setShowChatSearch] = useState(false);
    const da = () => {
        setShowChatSearch(!showChatSearch)
    }
    const getChats = async () => {
        try {
            const token = cookie.get('token')
            const data = await request('get', "/api/v1/session/list", '', token)
            if (data === 'please') {
                setLogin()
            } else if (data && data?.status === 200) {
                if (router.query && router.query?.chat) {
                    const listChat = data?.data?.SessionList ? data?.data?.SessionList : []
                    try {
                        const user = await request('get', "/api/v1/userinfo/" + router.query?.chat, '', token)
                        if (user === 'please') {
                            setLogin()
                        } else if (user && user?.status === 200) {
                            const aaa = listChat.filter((i) => Number(i?.User?.Uid) === Number(router.query?.chat))
                            if (aaa && aaa.length > 0) {
                                setChats(listChat)
                            } else {
                                const li = {
                                    Uid: user?.data?.data?.uid,
                                    Username: user?.data?.data?.username,
                                    Address: user?.data?.data?.address,
                                    Avatar: user?.data?.data?.avatarUrl, ...user?.data?.data
                                }
                                const par = listChat.concat([{User: li, Online: false}])
                                setChats(par)
                            }
                            setChatUserData(user?.data?.data)
                        } else {
                            setChatUserData(null)
                        }
                    } catch (err) {
                        return null
                    }
                } else {
                    setChats(data?.data?.SessionList ? data?.data?.SessionList : [])
                }
            } else {
                setChats([])
            }
        } catch (err) {
            return null
        }
    }
    useEffect(() => {
        if (cookie.get('token') && cookie.get('token') != 'undefined') {
            getChats()
            const token = cookie.get('token')
            // 连接  sse
            socket.current = new EventSourcePolyfill('http://188.166.191.246:8081/api/v1/subscribe', {
                headers: {
                    'Authorization': token,
                }
            });
            // if (socket.current && userPar && userPar?.uid) {
            //     socket.current.emit("join", {userId: userPar?.uid});
            //     socket.current.on("connectedUsers", ({users}) => {
            //         setConnectedUsers(users);
            //     });
            // }
            // if (
            //     chats &&
            //     chats.length > 0 &&
            //     !router.query.chat &&
            //     router.pathname === "/chats"
            // ) {
            //     router.push(`/chats?chat=${chats[0].textsWith}`, undefined, {
            //         shallow: true,
            //     });
            // }
            // if (userPar && userPar.uid) {
            //     postPar();
            // }
        }
    }, []);
    const sendText = async (e, text) => {
        try {


            e.preventDefault();
            const token = cookie.get('token')
            const list = {
                Kind: 'text',
                toUser: {uid: Number(router?.query?.chat)},
                fromUser: {...userPar, uid: Number(userPar?.uid)},
                data: text,
                sent: dayjs().unix()
            }
            const data = await request('post', "/api/v1/send", list, token)
            if (data === 'please') {
                setLogin()
            } else if (data && data?.status === 200) {
                const params = texts.concat([{
                    ...list,
                    FromUid: userPar?.uid,
                    CreatedAt: dayjs(),
                    ToUid: router?.query?.chat,
                    Content: text
                }])
                setIsMore(true)
                setTexts(params)
                setNewText("");
            }
        } catch (err) {
            return null
        }
    };
    useEffect(() => {
        if (socket?.current) {
            socket.current.onmessage = ({data}) => {
                let aa = JSON.parse(data)
                if (aa?.kind === "text") {
                    // 接收消息   判断是否是当前聊天用户
                    if (Number(router?.query?.chat) === Number(aa?.fromUser?.Uid)) {
                        const params = texts.concat([{
                            FromUid: aa?.fromUser?.Uid,
                            CreatedAt: dayjs.unix(1702982355),
                            ToUid: aa?.toUser?.Uid,
                            Content: aa?.data
                        }])
                        setIsMore(false)
                        setTexts(params)
                    } else {
                        const aaa = [...chats]
                        const list = aaa.filter(i => Number(aa?.fromUser?.Uid) === Number(i.User.Uid))
                        // 判断聊天列表是否有
                        if (list.length > 0) {

                        } else {
                            const li = {
                                Uid: aa?.fromUser?.Uid,
                                Username: aa?.fromUser?.Username,
                                Address: aa?.fromUser?.Address,
                                Avatar: aa?.fromUser?.Avatar
                            }
                            const par = aaa.concat([{User: li, Online: false}])
                            setChats(par)
                        }
                    }
                }
            }
        }
        return () => {
            if (socket.current) {
                // socket.current.off("textSent");
                // socket.current.off("newTextReceived");
            }
        };
    }, [newText, socket, chats]);
    // 判断是否加载更多
    const [isMore, setIsMore] = useState(false)
    const endOfMessagesRef = useRef(null);
    const scrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    useEffect(() => {
        if (endOfMessagesRef.current && isMore) {
            scrollToBottom();
        }
    }, [texts]);
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
            setChatHeight("80vh");
        }
    });
    const changeAllTheme = (a, b) => {
        return changeTheme ? a : b
    }
    const [va, setVa] = useState('')
    const sendChangeText = (e) => {
        const {target: {value}} = e
        setVa(value)
    }
    const getChatUser = async () => {
        try {
            const token = cookie.get('token')
            const data = await request('get', "/api/v1/userinfo/" + router?.query?.chat, '', token)
            if (data === 'please') {
                setLogin()
            } else if (data && data?.status === 200) {
                setChatUserData(data?.data?.data)
            } else {
                setChatUserData(null)
            }
        } catch (err) {
            return null
        }
    }
    const getChatList = async (time) => {
        const token = cookie.get('token')
        const chatList = texts.length > 0 ? texts : []
        try {
            const data = await request('post', "/api/v1/message/list", {
                queryTime: time,
                uid: Number(router?.query?.chat)
            }, token)
            if (data === 'please') {
                setLogin()
            } else if (data && data?.status === 200) {
                const list = data?.data?.messageList ? data?.data?.messageList : []
                const listRr = list.length > 0 ? list.reverse() : []
                if (chatUserData) {
                    if (Number(chatUserData.uid) === Number(router?.query?.chat)) {
                        // 加载更多
                        if (chatList.length > 0) {
                            const all = listRr.concat(chatList)
                            setIsMore(false)
                            setTexts(all)
                        } else {
                            setIsMore(false)
                            setTexts(listRr)
                        }
                    } else {
                        setIsMore(true)
                        setTexts(listRr)
                    }
                } else {
                    setIsMore(true)
                    setTexts(listRr)
                }
            } else {
                if (chatUserData) {
                    if (Number(chatUserData.uid) === Number(router?.query?.chat)) {
                        setTexts(chatList)
                        setIsMore(false)
                    } else {
                        setIsMore(false)
                        setTexts(chatList)
                    }
                } else {
                    setIsMore(false)
                    setTexts([])
                }
            }
        } catch (err) {
            return null
        }
    }
    useEffect(() => {
        if (router?.query && router?.query?.chat && Number(router?.query?.chat) != Number(chatUserData?.uid) && cookie.get('token') && cookie.get('token') != 'undefined') {
            getChatUser()
            getChatList(dayjs().unix())
        }
    }, [router?.query])
    const getMore = () => {
        const data = dayjs(dayjs(texts[0]?.CreatedAt)).unix()
        getChatList(data)
    }
    const [scrollTopBol, setScrollTopBol] = useState(false)
    const containerRef = useRef(null)
    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                if (containerRef.current.scrollTop < 10) {
                    setScrollTopBol(true)
                } else {
                    setScrollTopBol(false)
                }
            }
        };
        if (containerRef.current) {
            containerRef.current.addEventListener('scroll', handleScroll);
        }
        return () => {
            // 在组件卸载时移除监听器
            if (containerRef.current) {
                containerRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);


    return (
        <div className={styles.allMobliceBox}>
            <div
                className={`${styles.allMoblice} ${changeAllTheme('darknessTwo', 'brightTwo')}`}
                style={{marginRight: '20px', borderRadius: '10px', minHeight: winHeight}}>
                <main className="flex">
                    {/*侧边栏*/}
                    <Sidebar user={userPar} maxWidth={"250px"}/>
                    <div
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
                                margin: '15px',
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
                                {/* 搜索聊天用户*/}
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
                                            <Link href={`/chats?chat=${chat?.User?.Uid}`} key={chat?.User?.Uid}>
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
                                                        <img width={50} height={50} style={{
                                                            borderRadius: '50%'
                                                        }} src={chat?.User?.Avatar || '/dexlogo.svg'} alt="userimg"/>
                                                        {chat?.Online && (
                                                            <AppleOutlined
                                                                style={{
                                                                    color: "#55d01d",
                                                                    fontSize: "20px",
                                                                    position: "absolute",
                                                                    bottom: "-10px",
                                                                    right: "0",
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="ml-1">
                                                        <p style={{
                                                            userSelect: 'none',
                                                            fontWeight: 'bold',
                                                            fontSize: '18px',
                                                            marginBottom: '10px'
                                                        }}>{chat?.User?.Username ? chat?.User?.Username?.length > 10 ? chat?.User?.Username.slice(0, 5) + '...' : chat?.User?.Username : chat?.User?.Address.slice(0, 5)}</p>
                                                        <p style={{
                                                            marginTop: '-13px'
                                                        }}>
                                                            {chat?.data || ''}
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
                        {router?.query?.chat && (
                            <div
                                style={{
                                    flex: "1",
                                    borderRight: "1px solid lightgrey",
                                    fontFamily: "Inter",
                                }}>
                                {/*右边聊天  对象*/}
                                {chatUserData && chatUserData.uid ? (
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
                                        }} src={chatUserData?.avatarUrl || '/dexlogo.svg'} alt="userimg"/>
                                        <div>
                                            <p style={{
                                                userSelect: 'none',
                                                fontWeight: 'bold',
                                                fontSize: '18px',
                                                marginBottom: '10px',
                                            }}>{chatUserData?.username ? chatUserData?.username.length > 7 ? chatUserData.username.slice(0, 5) + '...' : chatUserData.username : chatUserData.address.slice(0, 5) + '...'}</p>
                                            {/*判断是否在线*/}
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
                                        style={{padding: "14px"}}>
                                        <LoadingOutlined/>
                                    </div>
                                )}
                                {/*聊天的背景*/}
                                <div
                                    className=" flex flex-col justify-between"
                                    style={{
                                        height: chatHeight,
                                    }}>
                                    <div className="mt-3 pl-4 pr-4 overflow-y-auto"
                                         style={{scrollbarWidth: "thin"}} ref={containerRef}>
                                        {
                                            texts && texts.length > 99 && scrollTopBol && (
                                                <div style={{textAlign: 'center', cursor: 'pointer'}}
                                                     onClick={getMore}>加载更多</div>)
                                        }
                                        {texts.length > 0 ? (
                                            texts.map((text, i) => (
                                                <Chat
                                                    key={i}
                                                    chatUserData={chatUserData}
                                                    user={userPar}
                                                    text={text}
                                                />
                                            ))
                                        ) : (
                                            <></>
                                        )}
                                        <div style={{
                                            marginBottom: '30px'
                                        }} ref={endOfMessagesRef}/>
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


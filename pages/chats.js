import axios from "axios";
import {useRouter} from "next/router";
import React, {useState, useEffect, useRef} from "react";
import baseUrl from "../utils/baseUrl";
import io from "socket.io-client";
import Sidebar from "../components/Sidebar";
// import ChatSearch from "../components/Chat/ChatSearch";
import {SearchIcon} from "@heroicons/react/outline";
import styled from "styled-components";
import calculateTime from "../utils/calculateTime";
// import Chat from "../components/Chat/Chat";
import {LoadingOutlined} from '@ant-design/icons'
import {AppleOutlined,} from '@ant-design/icons'
import Link from 'next/link';
import dynamic from 'next/dynamic'
import {getUser} from "../utils/axios";
import cook from "js-cookie";
import {useAccount} from "wagmi";
import _ from 'lodash'
// const Sidebar = dynamic(() => import('../components/Sidebar'));
const ChatSearch = dynamic(() => import('../components/Chat/ChatSearch'));
const Chat = dynamic(() => import('../components/Chat/Chat'));
function ChatsPage() {
    const [chats, setChats] = useState([]);
    const [userPar, setUserPar] = useState({});
    const {address} = useAccount()
    const getUs = async () => {
        const {data: {user}, status} = await getUser(address)
        if (status === 200 && user) {
            setUserPar(user)
        } else {
            setUserPar('')
        }
    }
    useEffect(() => {
        if (address && cook.get('name')) {
            getUs()
        }
    }, [address]);
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
        if (userPar && userPar.id) {
            const res = await axios.get(`${baseUrl}/api/chats`, {
                params: {userId: userPar?.id}
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
        getParams()
    }, [userPar, takeOver])
    const openChatId = useRef("");
    const [showChatSearch, setShowChatSearch] = useState(false);
    const da = () => {
        setShowChatSearch(!showChatSearch)
    }

    useEffect(() => {
        if (!socket.current) {
            socket.current = io(baseUrl); //establishing connection with server;
        }
        if (socket.current && userPar && userPar?.id) {
            socket.current.emit("join", {userId: userPar?.id});
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
            //shallow is used to push a page on the router stack without refreshing
        }
        if (userPar && userPar.id) {
            postPar();
        }
    }, [userPar]);
    useEffect(() => {
        if (userPar && userPar.id && router.query.chat) {
            const loadTexts = () => {
                socket?.current.emit("loadTexts", {
                    userId: userPar.id,
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
                        openChatId.current = chat?.texts_with_id; //insert value in router.query ref
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
                if (userPar && userPar.id) {
                    socket?.current.emit("sendNewText", {
                        userId: userPar.id,
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
                            const ifPreviouslyTexted =  chats.filter((chat) => chat.textsWith === newText.senderId).length > 0;
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
    }, [newText, socket,chats]);
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
                {userId: userPar.id}
            );
        } catch (error) {

        }
    }
    return (
        <div style={{backgroundColor: 'rgb(188,238,125)', marginRight: '20px', borderRadius: '10px'}}>
            <main className="flex" style={{height: "calc(100vh - 4.5rem)"}}>
                <Sidebar user={userPar} maxWidth={"250px"}/>
                <div
                    className="flex flex-grow mx-auto h-full w-full max-w-2xl lg:max-w-[65rem] xl:max-w-[70.5rem] bg-white  rounded-lg">
                    <div
                        style={{
                            borderLeft: "1px solid lightgrey",
                            borderRight: "1px solid lightgrey",
                            fontFamily: "Inter",
                            overflowY: 'auto',
                            backgroundColor: 'rgb(178,219,126)'
                        }}
                        className="lg:min-w-[27rem] pt-4"
                    >
                        <Title>Chats</Title>
                        <div
                            onClick={() => setShowChatSearch(true)}
                            className="flex items-center  relative rounded-full bg-gray-100 p-2  m-4 h-12">
                            <SearchIcon className="h-5 text-gray-600 px-1.5 md:px-0 cursor-pointer"/>
                            <input
                                className="ml-2 bg-transparent outline-none placeholder-gray-500 w-full font-thin hidden md:flex md:items-center flex-shrink"
                                type="text"
                                placeholder="Search users"
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
                                            <ChatDiv>
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
                                                                fontSize: "1.85rem",
                                                                position: "absolute",
                                                                bottom: "-.5rem",
                                                                right: "0rem",
                                                            }}
                                                        />
                                                    ) : (
                                                        <></>
                                                    )}
                                                </div>
                                                <div className="ml-1">
                                                    <Name>{chat?.username?.length > 10 ? chat.username.slice(0, 5) + '...' + chat.username.slice(-5) : chat.username}</Name>
                                                    <TextPreview>
                                                        {chat.lastText && chat.lastText.length > 30
                                                            ? `${chat.lastText.substring(0, 30)}...`
                                                            : chat.lastText}
                                                    </TextPreview>
                                                </div>
                                                {chat.created_at && (
                                                    <Date>{calculateTime(chat.created_at, true)}</Date>
                                                )}
                                            </ChatDiv>
                                        </Link>
                                    ))
                                ) : (
                                    <>
                                        <p className="p-5 text-gray-500">
                                            Start a chat with someone!
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
                                minWidth: "27rem",
                                flex: "1",
                                borderRight: "1px solid lightgrey",
                                fontFamily: "Inter",
                            }}
                        >
                            {/*右边聊天*/}
                            {chatUserData && chatUserData.profilePicUrl ? (
                                <ChatHeaderDiv>
                                    <img width={80} height={80} style={{
                                        borderRadius: '50%'
                                    }} src={chatUserData?.profilePicUrl || '/Ellipse1.png'} alt="userimg"/>
                                    <div>
                                        <ChatName>{chatUserData?.name.length > 7 ? chatUserData.name.slice(0, 3) + '...' + chatUserData.name.slice(-3) : chatUserData.name}</ChatName>
                                        {connectedUsers.length > 0 &&
                                            connectedUsers.filter(
                                                (user) => user?.userId === openChatId?.current
                                            ).length > 0 && <LastActive>{"Online"}</LastActive>}
                                    </div>
                                </ChatHeaderDiv>
                            ) : (
                                <div
                                    className="max-w-[28rem]"
                                    style={{padding: "1rem 0.9rem"}}
                                >
                                    <LoadingOutlined/>
                                </div>
                            )}

                            <div
                                className=" flex flex-col justify-between"
                                style={{
                                    height: "calc(100vh - 10.5rem)",
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
                                        <EndOfMessage ref={endOfMessagesRef}/>
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
                                            placeholder="Send a new text..."
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
    );
}


export default ChatsPage;

const Title = styled.p`
  user-select: none;
  font-size: 1.65rem;
  font-weight: 600;
  font-family: Inter;
  margin: 1rem;
`;

const ChatDiv = styled.div`
  display: flex;
  cursor: pointer;
  border-radius: 0.3rem;
  border-bottom: 1px solid #efefef;
  font-family: Inter;
  padding: 1rem 0.9rem;
  align-items: flex-start;
  column-gap: 0.6rem;
`;

const ChatHeaderDiv = styled.div`
  display: flex;
  cursor: pointer;
  border-radius: 0.3rem;
  border-bottom: 1px solid #efefef;
  font-family: Inter;
  padding: 1rem 0.9rem;
  align-items: center;
  column-gap: 0.6rem;
`;
const Name = styled.p`
  user-select: none;
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 10px;
  font-family: Inter;
`;

const ChatName = styled.p`
  user-select: none;
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 10px;
  font-family: Inter;
`;

const TextPreview = styled.p`
  font-family: Inter;
  margin-top: -0.95rem;
`;

const Date = styled.p`
  font-family: Inter;
  margin-left: auto;
`;

const LastActive = styled.p`
  user-select: none;
  font-size: 0.9rem;
  color: rgba(107, 114, 128);
  margin-top: -1.1rem;
`;

const EndOfMessage = styled.div`
  margin-bottom: 30px;
`;

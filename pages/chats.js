import axios from "axios";
import {useRouter} from "next/router";
import {parseCookies} from "nookies";
import React, {useState, useEffect, useRef} from "react";
import baseUrl from "../utils/baseUrl";
import io from "socket.io-client"; //socket.io import
import Sidebar from "../components/Sidebar";
import ChatSearch from "../components/Chat/ChatSearch";
import {SearchIcon} from "@heroicons/react/outline";
import styled from "styled-components";
import calculateTime from "../utils/calculateTime";
import Chat from "../components/Chat/Chat";
import cookie from "js-cookie";
import {Facebook} from "react-content-loader";
import {AppleOutlined, LoadingOutlined} from '@ant-design/icons'
import {useSession} from "next-auth/react";

function ChatsPage() {
    const [chats, setChats] = useState([]);
    const [userPar, setUserPar] = useState({});
    const [userFollowStats, setLoggedUserFollowStats] = useState([]);
    const {data: session, status} = useSession()
    useEffect(() => {
        if (session && session.user) {
            setUserPar(session.user)
        }
        if (session && session.userFollowStats) {
            setLoggedUserFollowStats(session.userFollowStats)
        }
    }, [session, session?.user, session?.userFollowStats]);
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
                params: {userId: userPar.id}
            });
            if (res.status === 200) {
                setChats(res.data)
            } else {
                setChats([])
            }
        }
    }
    useEffect(() => {
        getParams()
    }, [userPar])
    //This ref is for persisting the state of query string in the url(i.e. the chat.textsWith) throughout re-renders
    //when the component re-rendered, the query string was resetting due to a bug in next.js
    const openChatId = useRef("");
    const [showChatSearch, setShowChatSearch] = useState(false);

    //SOCKET.io useEffect (used for connection)
    useEffect(() => {
        if (!socket.current) {
            socket.current = io(baseUrl); //establishing connection with server;
        }
        if (socket.current) {
            //to send data from socket, we use emit
            socket.current.emit("join", {userId: userPar.id});
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
            if (!cookie.get("token")) {
                return;
            }
            router.push(`/chats?chat=${chats[0].textsWith}`, undefined, {
                shallow: true,
            });
            //shallow is used to push a page on the router stack without refreshing
        }

        // cleanup not needed in v4.0.1
        // return () => {
        //   //cleanup function to disconnect the user. This is called on component unmount
        //   // if (socket.current) {
        //   //   socket.current.emit("disconnect");
        //   //   socket.current.off(); //this removes the event listener
        //   // }
        //   console.log("exiting chat");
        // };
    }, []);

    //LOAD TEXTS useEffect. Runs whenever router.query.chat changes, so basically whenever the user clicks on a different user
    useEffect(() => {
        if (userPar && router.query.chat) {
            const loadTexts = () => {
                socket?.current.emit("loadTexts", {
                    userId: userPar.id,
                    textsWith: router.query.chat,
                });
                socket?.current.on("textsLoaded", ({chat, textsWithDetails}) => {
                    //in the case when previous chat isnt there with a user and logged in user clicks on that user from search
                    if (textsWithDetails) {
                        setTexts([]);
                        setChatUserData({
                            name: textsWithDetails.name,
                            profilePicUrl: textsWithDetails.profilePicUrl,
                        });
                        openChatId.current = router.query?.chat;
                    } else {
                        setTexts(chat?.texts&&chat.texts.length>0?chat?.texts:[]);
                        scrollToBottom();
                        setChatUserData({
                            name: chat?.textsWith.name,
                            profilePicUrl: chat?.textsWith.profilePicUrl,
                        });
                        openChatId.current = chat?.texts_with_id; //insert value in router.query ref
                    }
                });
            };
            if (socket?.current && router.query?.chat) {
                loadTexts(); //this should be in a useEffect that's below the useEffect that's creating the connection
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
                console.log(newText)
                if (newText.receiverId === openChatId?.current) {
                    setTexts((prev) => [...prev, newText]);
                    setChats((prev) => {
                        const previousChat = prev.find(
                            (chat) => chat.textsWith === newText.receiverId
                        );
                        previousChat.lastText = newText.text;
                        previousChat.created_at = newText.created_at;
                        return [...prev];
                    });
                }
            });
            socket.current.on("newTextReceived", async ({newText, userDetails}) => {
                console.log(1111111111111111)
                console.log(newText)
                //if router.query.message is same as id of the sender of the new text received, i.e. when the receiver has chat opened and sender sends a text
                if (newText?.senderId === openChatId?.current) {
                    setTexts((prev) => [...prev, newText]);
                    setChats((prev) => {
                        const previousChat = prev.find(
                            (chat) => chat.textsWith === newText.senderId
                        );
                        previousChat.lastText = newText.text;
                        previousChat.created_at = newText.created_at;
                        return [...prev];
                    });
                } else {
                    const ifPreviouslyTexted =
                        chats.filter((chat) => chat.textsWith === newText.senderId).length >
                        0;
                    if (ifPreviouslyTexted) {
                        setChats((prev) => {
                            const previousChat = prev.find(
                                (chat) => chat.textsWith === newText.senderId
                            );
                            previousChat.lastText = newText.text;
                            previousChat.created_at = newText.created_at;
                            return [...prev];
                        });
                    } else {
                        //if sender and receiver have never messaged before
                        const newChat = {
                            textsWith: newText.senderId,
                            name: userDetails.name,
                            profilePicUrl: userDetails.profilePicUrl,
                            lastText: newText.text,
                            created_at: newText.created_at,
                        };
                        setChats((prev) => [newChat, ...prev]);
                    }
                }
            });
        }
    }, []);
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
    useEffect(() => {
        if (userPar && userPar.id) {
            postPar();
        }
    }, []);

    return (
        <div className="bg-gray-100">
            <main className="flex" style={{height: "calc(100vh - 4.5rem)"}}>
                <Sidebar user={userPar} maxWidth={"250px"}/>
                <div
                    className="flex flex-grow mx-auto h-full w-full max-w-2xl lg:max-w-[65rem] xl:max-w-[70.5rem] bg-white  rounded-lg">
                    <div
                        style={{
                            borderLeft: "1px solid lightgrey",
                            borderRight: "1px solid lightgrey",
                            fontFamily: "Inter",
                        }}
                        className="lg:min-w-[27rem] relative pt-4"
                    >
                        <Title>Chats</Title>
                        <div
                            onClick={() => setShowChatSearch(true)}
                            className="flex items-center rounded-full bg-gray-100 p-2  m-4 h-12"
                        >
                            <SearchIcon className="h-5 text-gray-600 px-1.5 md:px-0 cursor-pointer"/>
                            <input
                                className="ml-2 bg-transparent outline-none placeholder-gray-500 w-full font-thin hidden md:flex md:items-center flex-shrink"
                                type="text"
                                placeholder="Search users"
                            />
                        </div>

                        {showChatSearch && (
                            <ChatSearch
                                setShowChatSearch={setShowChatSearch}
                                chats={chats}
                                setChats={setChats}
                                user={userPar}
                            />
                        )}

                        <div className="mt-4" style={{borderTop: "1px solid #efefef"}}>
                            <>
                                {chats && chats.length > 0 ? (
                                    chats.map((chat) => (
                                        <ChatDiv
                                            key={chat.textsWith}
                                            onClick={() =>
                                                router.push(`/chats?chat=${chat.textsWith}`)
                                            }
                                        >
                                            <div className="relative">
                                                <UserImage src={chat.profilePicUrl} alt="userimg"/>
                                                {connectedUsers.length > 0 &&
                                                connectedUsers.filter(
                                                    (user) => user.userId === chat.textsWith
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
                                                <Name>{chat.name}</Name>
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
                    {router.query.chat && (
                        <div
                            style={{
                                minWidth: "27rem",
                                flex: "1",
                                borderRight: "1px solid lightgrey",
                                fontFamily: "Inter",
                                height: "calc(100vh - 4.5rem)",
                            }}
                        >
                            {/*右边聊天*/}
                            {chatUserData && chatUserData.profilePicUrl ? (
                                <ChatHeaderDiv>
                                    <UserImage src={chatUserData.profilePicUrl} alt="userimg"/>
                                    <div>
                                        <ChatName>{chatUserData.name}</ChatName>
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
                                    <Facebook/>
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
                                        // onClick={() => setShowChatSearch(true)}
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

const UserImage = styled.img`
  height: 3.8rem;
  width: 3.8rem;
  border-radius: 50%;
  object-fit: cover;
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

  :hover {
    background-color: rgba(243, 244, 246);
  }
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
  font-size: 1.08rem;
  font-family: Inter;
`;

const ChatName = styled.p`
  user-select: none;
  font-weight: 600;
  font-size: 1.2rem;
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

const TextInputDiv = styled.div`
  padding: 1rem;
`;

const EndOfMessage = styled.div`
  margin-bottom: 30px;
`;

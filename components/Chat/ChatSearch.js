import {
  DotsHorizontalIcon,
} from "@heroicons/react/solid";
import axios from "axios";
import React, {useState, useRef, useContext} from "react";
import Link from "next/link";
import { useClickAway } from "react-use";
import baseUrl from "../../utils/baseUrl";
import styled from '/styles/all.module.css';
function ChatSearch({ setShowChatSearch, setChats, chats,user, }) {
  const social=changeLang('social')
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleChange = async (e) => {
    const { value } = e.target;
    if (value.length === 0) {
      setSearchTerm(value);
      setSearchResults([]);
      return;
    }
    setSearchTerm(value);
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/search/${value}`, {params:{userId:user.id}});
      if (res.data.length === 0) {
        searchResults.length > 0 && setSearchResults([]);
        return setLoading(false);
      }
      setSearchResults(res.data);
    } catch (error) {
        setSearchResults([]);
         setLoading(false);
    }

    setLoading(false);
  };
  const ref = useRef(null);
  useClickAway(ref, () => {
    setShowChatSearch(false);
  });
  return (
    <div
      ref={ref}
      className={styled.chatSearchTop}
    >
      <div className="flex items-center">

        <div className="flex mr-2 ml-1 items-center rounded-full bg-gray-100 p-1 h-12 flex-grow">
          <input
            autoFocus={true}
            className="ml-1 bg-transparent outline-none placeholder-gray-500 w-full font-thin"
            type="text"
            placeholder={social.search}
            value={searchTerm}
            onChange={handleChange}
          />
        </div>
      </div>
      {loading ? (
        <div className="w-full flex items-center justify-center mt-5 mb-2">
          <DotsHorizontalIcon className="h-6 text-gray-400" />
        </div>
      ) : searchResults.length > 0 ? (
        <div   style={{overflowY:'auto',height:'500px'}}>
          {searchResults.map((resultUser) => (
            <Link
              key={resultUser.id}
              href={`/chats?chat=${resultUser.id}`}
              passHref
            >
              <div
                onClick={() => {
                    setShowChatSearch(false);
                  const isUserInChats =
                    chats &&
                    chats.length > 0 &&
                    chats.find((chat) => chat.textsWith === resultUser.id);
                  const newChat = {
                    textsWith: resultUser.id,
                    name: resultUser.username,
                    profilePicUrl: resultUser.profilePicUrl,
                    lastText: "",
                  };
                  if (!isUserInChats) {
                    if (!chats) {
                      setChats([newChat]);
                    } else {
                      setChats((prev) => [newChat, ...prev]);
                    }
                  }
                }}
                className="flex items-center space-x-3 mt-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2"
              >
                <img style={{borderRadius:'50%'}} width={50} src={resultUser?.profilePicUrl?resultUser.profilePicUrl:'/Ellipse1.png'} alt="userimg" />
                <p className={styled.chatSearchName}>{resultUser?.name?resultUser.name.length>10?resultUser.name.slice(0,5)+'...'+resultUser.name.slice(-5):resultUser.name:''}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="w-full flex items-center justify-center mt-5 mb-2">
          <p className="text-gray-400 font-thin ">
            {social.start}
          </p>
        </div>
      )}
    </div>
  );
}
export default ChatSearch;

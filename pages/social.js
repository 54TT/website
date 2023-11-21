import React, {useEffect, useState} from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import baseUrl from '/utils/baseUrl'
// import Feed from "../components/Feed";
import styles from "../styles/social.module.css";
// import RightSideColumn from "../components/RightSideColumn";
import _ from 'lodash'
import dynamic from 'next/dynamic'
import {getUser} from "../utils/axios";
import cook from "js-cookie";
import {useAccount} from "wagmi";
// const Sidebar = dynamic(() => import('../components/Sidebar'));
const Feed = dynamic(() => import('../components/Feed'));
const RightSideColumn = dynamic(() => import('../components/RightSideColumn'));

function Index() {
    const [postsData, setPostsData] = useState([])
    const [postsDataAdd, setPostsDataAdd] = useState([])
    const [postsDataBol, setPostsDataBol] = useState(false)
    const [postSession, setPostSession] = useState({})
    const [errorLoading, setErrorLoading] = useState(false)
    const [chatsData, setChatsData] = useState([])
    const [changeBol, setChangeBol] = useState(true)
    const [pageNumber, setPageNumber] = useState(1)
    const [userPar, setUserPar] = useState(null)
    const {address} = useAccount()
    useEffect(() => {
        if (postsData) {
            const data = postsDataAdd.concat(postsData)
            const aa = _.uniqBy(data,'id')
            setPostsDataAdd(aa)
        } else {
            setPostsDataAdd(postsDataAdd)
        }
    }, [postsDataBol])
    const getUs=async ()=>{
        const {data:{user},status} =   await getUser(address)
        if(status===200&&user){
            setUserPar(user)
        }else {
            setUserPar('')
        }
    }
    useEffect(() => {
        if(address&&cook.get('name')){
            getUs()
        }
    }, [address]);



    const change = () => {
        setChangeBol(!changeBol)
    }
    const changePage = () => {
        setPageNumber(pageNumber + 1)
        change()
    }
    const getParams = async () => {
        const res = await axios.get(`${baseUrl}/api/posts`, {
            params: {pageNumber, userId: userPar?.id},
        });
        if (res.status === 200) {
            setPostsDataBol(!postsDataBol)
            setPostsData(res.data)
        } else {
            setPostsDataBol(!postsDataBol)
            setPostsData([])
        }
        const chatRes = await axios.get(`${baseUrl}/api/chats`, {
            params: {userId: userPar?.id},
        });
        setChatsData(chatRes && chatRes?.data.length > 0 ? chatRes.data : [])
    }
    const getUsers = async () => {
        const res = await axios.get(`${baseUrl}/api/user/userFollowStats`, {
            params: {userId: userPar?.id},
        });
        if (res?.status === 200) {
            setPostSession(res.data.userFollowStats)
        }
    }
    useEffect(() => {
        if (userPar&&userPar.id) {
            getParams()
            getUsers()
        }
    }, [userPar, changeBol])

    return (
        <>
            <div className="min-h-screen"
                 style={{backgroundColor: '#BCEE7D', marginRight: '20px', borderRadius: '10px'}}>
                <main style={{display:'flex'}}>
                    <Sidebar user={userPar?userPar : ''}/>
                    <Feed
                        user={userPar?userPar: ''}
                        postsData={postsDataAdd}
                        errorLoading={errorLoading}
                        change={change}
                        changePage={changePage}
                        increaseSizeAnim={{
                            sizeIncDown: styles.increasesizereally,
                            sizeIncUp: styles.sizeup,
                        }}
                    />
                    <RightSideColumn
                        chatsData={chatsData}
                        userFollowStats={postSession}
                        change={change}
                        user={userPar?userPar : {}}
                    />
                </main>
            </div>
        </>
    );
}


export default Index;

import React, {useEffect, useState, useContext} from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import baseUrl from '/utils/baseUrl'
// import Feed from "../components/Feed";
import styles from "../public/styles/social.module.css";
// import RightSideColumn from "../components/RightSideColumn";
import _ from 'lodash'
import dynamic from 'next/dynamic'
import {getUser} from "../utils/axios";
import cook from "js-cookie";
import { CountContext } from '/components/Layout/Layout'
// const Sidebar = dynamic(() => import('../components/Sidebar'));
const Feed = dynamic(() => import('../components/Feed'), { ssr: false });
const RightSideColumn = dynamic(() => import('../components/RightSideColumn'), { ssr: false });
import {arrayUnique} from '/utils/set'
function Index() {
    const [postsData, setPostsData] = useState([])
    const [postsDataAdd, setPostsDataAdd] = useState([])
    const [postsDataBol, setPostsDataBol] = useState(false)
    const [postSession, setPostSession] = useState({})
    const [errorLoading, setErrorLoading] = useState(false)
    const [chatsData, setChatsData] = useState([])
    const [changeBol, setChangeBol] = useState(true)
    const [pageNumber, setPageNumber] = useState(0)
    const [userPar, setUserPar] = useState(null)

    // 是否滚动
    const [scrollBol, setScrollBol] = useState(false)

    //  是否点赞
    const [clickBol, setClickBol] = useState(false)

    // 是否发推文
    const [sendBol, setSendBol] = useState(false)

    // 删除的推文
    const [deleteId, setDeleteId] = useState(null)

    // 是否关注
    const [likeBol, setLikeBol] = useState(false)
    useEffect(() => {
        if (scrollBol) {
            setScrollBol(false)
            if (postsData && postsData.length > 0) {
                const data = postsDataAdd.concat(postsData)
                setPostsDataAdd(data)
            } else {
                setPostsDataAdd([...postsDataAdd])
            }
        } else if (sendBol) {
            setSendBol(false)
            if (postsData && postsData.length > 0) {
                setPostsDataAdd(postsData)
            } else {
                setPostsDataAdd([])
            }
        } else if (clickBol) {
            setClickBol(false)
            if (postsData && postsData.length > 0) {
                const data = postsDataAdd.concat(postsData)
                let aa = arrayUnique(data, 'id')
                if (deleteId) {
                    const man = aa.filter((i) => {
                        return i.id !== deleteId
                    })
                    setPostsDataAdd(man)
                    setDeleteId(null)
                } else {
                    setPostsDataAdd(aa)
                }
            } else {
                if (deleteId) {
                    const da = _.cloneDeep(postsDataAdd)
                    const b = da.filter((i) => i.id !== deleteId)
                    setPostsDataAdd(b)
                    setDeleteId(null)
                } else {
                    setPostsDataAdd([...postsDataAdd])
                }
            }
        } else {
            if (postsData && postsData.length > 0) {
                setPostsDataAdd(postsData)
            } else {
                setPostsDataAdd([])
            }
        }
    }, [postsDataBol])
    const getUs = async () => {
        const {data: {user}, status} = await getUser(cook.get('name'))
        if (status === 200 && user) {
            setUserPar(user)
        } else {
            setUserPar('')
        }
    }
    useEffect(() => {
        if (cook.get('name')) {
            // getUs()
        }
    }, [cook.get('name')]);
    const change = (name, id) => {
        if (name === 'gun') {
            setScrollBol(true)
        }
        if (name === 'send') {
            setSendBol(true)
        }
        if (name === 'click') {
            setClickBol(true)
        }
        if (name === 'like') {
            setLikeBol(true)
        }
        if (id) {
            setDeleteId(id)
        }
        setChangeBol(!changeBol)
    }
    const changePage = () => {
        setPageNumber(pageNumber + 1)
        change('gun')
    }
    const getParams = async () => {
        let a = _.cloneDeep(pageNumber)
        if (sendBol) {
            a = 0
        }
        const res = await axios.get(`${baseUrl}/api/posts`, {
            params: {pageNumber: a, userId: userPar?.id},
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
        if (userPar && userPar.id) {
            if (!likeBol) {
                getParams()
            } else {
                setLikeBol(false)
            }
            getUsers()
        }
    }, [userPar, changeBol])
    const {  changeTheme } = useContext(CountContext);
    const changeAllTheme = (a, b) => {
        return changeTheme ? a : b
    }
    return (
        <>
            <div className={styles.mobliceSocialBox}>
                <div className={`min-h-screen ${changeAllTheme('darknessTwo', 'brightTwo')}`}
                    style={{backgroundColor: 'rgb(253,213,62)', marginRight: '20px', borderRadius: '10px'}}>
                    <main style={{display: 'flex'}}>
                        <Sidebar user={userPar ? userPar : ''}/>
                        <Feed
                            user={userPar ? userPar : ''}
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
                            user={userPar ? userPar : {}}
                        />
                    </main>
                </div>
            </div>
        </>
    );
}


export default Index;

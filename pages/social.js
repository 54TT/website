import React, {useEffect, useState, useContext} from "react";
import Sidebar from "../components/Sidebar";
import styles from "../public/styles/social.module.css";
import _ from 'lodash'
import dynamic from 'next/dynamic'
import cook from "js-cookie";
import {CountContext} from '/components/Layout/Layout'
const Feed = dynamic(() => import('../components/Feed'), {ssr: false});
const RightSideColumn = dynamic(() => import('../components/RightSideColumn'), {ssr: false});
import {arrayUnique} from '/utils/set'
import {request} from "../utils/hashUrl";
import cookie from "js-cookie";
import {Skeleton} from "antd";

function Index() {
    const {setLogin} = useContext(CountContext);
    // 推文
    const [postsData, setPostsData] = useState([])
    const [postsDataAdd, setPostsDataAdd] = useState([])
    const [postsDataBol, setPostsDataBol] = useState(false)
    const [postsLoad, setPostsLoad] = useState(true)

    const [chatsData, setChatsData] = useState([])
    //  重新获取用户接口
    const [changeBol, setChangeBol] = useState(true)
    // 推文的page
    const [pageNumber, setPageNumber] = useState(1)
    // 用户信息
    const [userPar, setUserPar] = useState(null)
    // 是否滚动
    const [scrollBol, setScrollBol] = useState(false)
    // 是否发推文
    const [sendBol, setSendBol] = useState(false)
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
        } else {
            if (postsData && postsData.length > 0) {
                setPostsDataAdd(postsData)
            } else {
                setPostsDataAdd([])
            }
            setPostsLoad(false)
        }
    }, [postsDataBol])
    const getUs = async () => {
        const params = JSON.parse(cookie.get('username'))
        const token =  cookie.get('token')
        const data = await request('get', "/api/v1/userinfo/" + params?.uid,'',token)
      if(data==='please'){
          setLogin()
      }else  if (data && data?.status === 200) {
            const user = data?.data?.data
            if (user) {
                setUserPar(user)
            } else {
                setUserPar(null)
            }
        } else {
            setUserPar(null)
        }
    }
    useEffect(() => {
        if (cook.get("username") && cook.get("username") != 'undefined') {
            getUs()
        }
    }, [cook.get("username")]);
    const change = (name, id) => {
        if (name === 'gun') {
            setScrollBol(true)
            setChangeBol(!changeBol)
        }
        if (name === 'send') {
            setChangeBol(!changeBol)
            setSendBol(true)
        }
        if (id) {
            const data = _.cloneDeep(postsDataAdd)
            const man = data.filter((i) => {
                return i.postId !== id
            })
            setPostsDataAdd(man)
        }
    }
    const changePage = () => {
        setPageNumber(pageNumber + 1)
        change('gun')
    }
    const getParams = async () => {
        let a = _.cloneDeep(pageNumber)
        if (sendBol) {
            a = 1
        }
        const token =  cookie.get('token')
        const res = await request('post', `/api/v1/post/public`, {page: a},token);
        if(res==='please'){
            setLogin()
        }else if (res && res?.status === 200) {
            setPostsDataBol(!postsDataBol)
            setPostsData(res?.data?.posts)
        } else {
            setPostsDataBol(!postsDataBol)
            setPostsData([])
        }
        // const chatRes = await axios.get(`${baseUrl}/api/chats`, {
        //     params: {userId: userPar?.id},
        // });
        // setChatsData(chatRes && chatRes?.data.length > 0 ? chatRes.data : [])
    }
    useEffect(() => {
        if (userPar && userPar?.uid) {
            getParams()
        }
    }, [userPar, changeBol])
    const {changeTheme} = useContext(CountContext);
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
                        {
                            postsLoad ? <Skeleton active/> : <Feed
                                user={userPar ? userPar : ''}
                                postsData={postsDataAdd}
                                postsLoad={postsLoad}
                                change={change}
                                changePage={changePage}
                                increaseSizeAnim={{
                                    sizeIncDown: styles.increasesizereally,
                                    sizeIncUp: styles.sizeup,
                                }}
                            />
                        }
                        <RightSideColumn
                            chatsData={chatsData}
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
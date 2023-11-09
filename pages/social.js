import React, {useEffect, useState} from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import baseUrl from '/utils/baseUrl'
// import { parseCookies } from "nookies";
import Feed from "../components/Feed";
import styles from "../styles/social.module.css";
import RightSideColumn from "../components/RightSideColumn";
import Layout from "../components/Layout/Layout";
import {getCsrfToken, signIn, useSession} from "next-auth/react";
import {useConnect, useAccount, useSignMessage} from "wagmi";
import {InjectedConnector} from "wagmi/connectors/injected";
import {SiweMessage} from "siwe";
function Index() {
    const {address, isConnected} = useAccount()
    const {data: session, status} = useSession()
    const {signMessageAsync} = useSignMessage()
    const [postsData,setPostsData] = useState([])
    const [errorLoading,setErrorLoading] = useState(false)
    const [chatsData,setChatsData] = useState([])

    const handleLogin = async () => {
        try {
            const callbackUrl = "/protected"
            const message = new SiweMessage({
                domain: window.location.host,
                address: address,
                statement: "Sign in with Ethereum to the app.",
                uri: window.location.origin,
                version: "1",
                // chainId: chain?.id,
                nonce: await getCsrfToken(),
            })
            const signature = await signMessageAsync({
                message: message.prepareMessage(),
            })
            signIn("credentials", {
                message: JSON.stringify(message),
                redirect: false,
                signature,
                callbackUrl,
            })
        } catch (error) {
            console.log(error)
        }
    }
    const getParams = async ()=>{
        const res = await axios.get(`${baseUrl}/api/posts`, {
            params: {pageNumber: 1, userId:session?.user.id},
        });
        const {data} =res
        setPostsData(data)
        const chatRes = await axios.get(`${baseUrl}/api/chats`,{
            params: { userId:session?.user.id},
        });
            setChatsData(chatRes&&chatRes?.data.length>0?chatRes.data:[])
    }
    useEffect(()=>{
        if(session&&session.user&&session?.user.id){
            getParams()
        }
    },[session])

    return (
        <>
            <Layout>
                <div className="bg-gray-100 min-h-screen">
                    <main className="flex">
                        <Sidebar user={session&&session.user?session.user:''}/>
                        <Feed
                            user={session&&session.user?session.user:''}
                            postsData={postsData}
                            errorLoading={errorLoading}
                            increaseSizeAnim={{
                                sizeIncDown: styles.increasesizereally,
                                sizeIncUp: styles.sizeup,
                            }}
                        />
                        <RightSideColumn
                            chatsData={chatsData}
                            userFollowStats={ session&&session.userFollowStats?session.userFollowStats:{}}
                            user={session?session.user:''}
                        />
                    </main>
                </div>
            </Layout>
        </>
    );
}


export default Index;

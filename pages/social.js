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

function Index({postsData, chatsData, errorLoading}) {
    const {address, isConnected} = useAccount()
    // const {user, userFollowStats,} = useSession()
    const {data: session, status} = useSession()
    const {signMessageAsync} = useSignMessage()
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
            window.alert(error)
        }
    }
    const {connect} = useConnect({
        connector: new InjectedConnector(),
    });
    useEffect(()=>{
        if(isConnected&&!session){
            handleLogin()
        }else if(!isConnected){
            connect()
        }
    },[isConnected])

    return (
        <>
            <Layout>
                <div className="bg-gray-100 min-h-screen">
                    <main className="flex">
                        <Sidebar user={session?session.user:''}/>
                        <Feed
                            user={session?session.user:''}
                            postsData={postsData}
                            errorLoading={errorLoading}
                            increaseSizeAnim={{
                                sizeIncDown: styles.increasesizereally,
                                sizeIncUp: styles.sizeup,
                            }}
                        />
                        <RightSideColumn
                            chatsData={chatsData}
                            userFollowStats={ session?session.userFollowStats:''}
                            user={session?session.user:''}
                        />
                    </main>
                </div>
            </Layout>
        </>
    );
}

Index.getInitialProps = async (ctx) => {
    try {
        const res = await axios.get(`${baseUrl}/api/posts`, {
            params: {pageNumber: 1},
        });

        const chatRes = await axios.get(`${baseUrl}/api/chats`);
        return {postsData: res.data, chatsData: chatRes.data};
    } catch (error) {
        return {errorLoading: true};
    }
};

export default Index;

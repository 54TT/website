import React, {useState} from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import baseUrl from '/utils/baseUrl'
// import { parseCookies } from "nookies";
import Feed from "../components/Feed";
import styles from "../styles/social.module.css";
import RightSideColumn from "../components/RightSideColumn";
import Layout from "../components/Layout/Layout";

function Index({user, userFollowStats, postsData, chatsData, errorLoading}) {

    return (
        <>
            <Layout>
                <div className="bg-gray-100 min-h-screen">
                    <main className="flex">
                        <Sidebar user={user}/>
                        <Feed
                            user={user}
                            postsData={postsData}
                            errorLoading={errorLoading}
                            increaseSizeAnim={{
                                sizeIncDown: styles.increasesizereally,
                                sizeIncUp: styles.sizeup,
                            }}
                        />
                        <RightSideColumn
                            chatsData={chatsData}
                            userFollowStats={userFollowStats}
                            user={user}
                        />
                    </main>
                </div>
            </Layout>
        </>
    );
}

Index.getInitialProps = async (ctx) => {
    try {
        const res = await axios.get(`${process.env.baseUrl}/api/posts`, {
            params: {pageNumber: 1},
        });

        const chatRes = await axios.get(`${process.env.baseUrl}/api/chats`);
        return {postsData: res.data, chatsData: chatRes.data};
    } catch (error) {
        return {errorLoading: true};
    }
};

export default Index;

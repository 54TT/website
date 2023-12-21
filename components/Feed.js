import React, {useEffect, useState} from "react";
import styled from '/public/styles/allmedia.module.css'
import {EmojiSadIcon} from "@heroicons/react/outline";
import {LoadingOutlined} from '@ant-design/icons'
import dynamic from 'next/dynamic'
const InputBox = dynamic(() => import('./InputBox'), {ssr: false})
const InfoBox = dynamic(() => import('./HelperComponents/InfoBox'), {ssr: false})
const PostCard = dynamic(() => import('./PostCard'), {ssr: false})
import InfiniteScroll from 'react-infinite-scroll-component';
const PostModul = dynamic(() => import('./postModul'), {ssr: false})
function Feed({user, postsData, change, changePage, increaseSizeAnim}) {
    // postsLoad
    useEffect(() => {
        if (postsData && postsData.length > 0) {
            setPosts(postsData)
            setPostLoad(false)
        } else {
            setPosts([])
            setPostLoad(false)
        }
    }, [postsData])
    const [posts, setPosts] = useState([]);
    const [postsLoad, setPostLoad] = useState(true);
    return (
        <>
            <div className={`flex-grow h-full  scrollbar-hide ${styled.mobliceRight}`}>
                <div style={{width:'80%',margin:'0 auto'}}>
                    <InputBox
                        user={user}
                        change={change}
                        setPosts={setPosts}
                        increaseSizeAnim={increaseSizeAnim}
                    />
                    {
                        postsLoad? <PostModul />:posts&&posts.length>0?<InfiniteScroll
                            hasMore={true}
                            next={changePage}
                            endMessage={
                                <p style={{textAlign: 'center'}}>
                                    <b>Yay! You have seen it all</b>
                                </p>
                            }
                            loader={null}
                            dataLength={posts.length}
                        >
                            {posts && posts?.length > 0 ? posts.map((post, index) => {
                                const isLiked =
                                    post.likes && post.likes.length > 0 &&
                                    post.likes.filter((like) => like?.user?.id === user?.id).length > 0;
                                return <PostCard
                                    change={change}
                                    liked={isLiked}
                                    key={post?.postId}
                                    post={post}
                                    user={user}
                                />
                            }) : ''}
                        </InfiniteScroll>: <InfoBox />
                    }
                </div>
            </div>
        </>
    )
}

export default Feed;

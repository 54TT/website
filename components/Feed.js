import React, {useEffect, useState} from "react";
import styled from '../public/styles/allmedia.module.css'
import {EmojiSadIcon} from "@heroicons/react/outline";
import {LoadingOutlined} from '@ant-design/icons'
import dynamic from 'next/dynamic'

const InputBox = dynamic(() => import('./InputBox'), {ssr: false})
const InfoBox = dynamic(() => import('./HelperComponents/InfoBox'), {ssr: false})
const PostCard = dynamic(() => import('./PostCard'), {ssr: false})
import InfiniteScroll from 'react-infinite-scroll-component';

function Feed({user, postsData, change, changePage, increaseSizeAnim, postsLoad}) {
    useEffect(() => {
        if (postsData && postsData.length > 0) {
            setPosts(postsData)
        } else {
            setPosts([])
        }
    }, [postsData])
    const [posts, setPosts] = useState([]);
    return (
        <>
            <div className={`flex-grow h-full pt-6 mr-5 md:ml-auto  scrollbar-hide ${styled.mobliceRight}`}>
                <div className="mx-auto max-w-md md:max-w-lg lg:max-w-2xl">
                    <InputBox
                        user={user}
                        change={change}
                        setPosts={setPosts}
                        increaseSizeAnim={increaseSizeAnim}
                    />
                    {

                    }
                    {posts ? (
                        !postsLoad && posts.length === 0 ? (
                                <InfoBox
                                    Icon={EmojiSadIcon}
                                    message="Sorry, no posts..."
                                    content="Please follow another user or create a new post to start seeing posts."
                                ></InfoBox>
                            ) :
                            (
                                <InfiniteScroll
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
                                </InfiniteScroll>
                            )
                    ) : (
                        <LoadingOutlined/>
                    )}
                </div>
            </div>
        </>
    )
        ;
}

export default Feed;

import React, {useEffect, useState} from "react";
import InputBox from "./InputBox";
import baseUrl from '/utils/baseUrl'
import {EmojiSadIcon} from "@heroicons/react/outline";
import InfoBox from "./HelperComponents/InfoBox";
import PostCard from "./PostCard";
import axios from "axios";
import {Facebook} from "react-content-loader";
import {notification} from "antd";

function Feed({user, postsData, errorLoading,change, increaseSizeAnim}) {
    useEffect(() => {
        if (postsData && postsData.length > 0) {
            setPosts(postsData)
        } else {
            setPosts([])
        }
    }, [postsData])
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true); //means if there is more data to fetch frm backend, then it'll be true
    const [pageNumber, setPageNumber] = useState(1); //we set it to 2 initially because from getInitialProps below, posts of pageNumber 1 have already been fetched. So now, it's set to pageNumber 2 for next pagination call
    const fetchDataOnScroll = async () => {
        try {
            const res = await axios.get(`${baseUrl}/api/posts`, {
                params: {pageNumber: pageNumber, userId: user.id},
            });
            if (res.data.length === 0) {
                setHasMore(false); //for stopping function call (inside of InfinitScroll component) after all posts have been fetched
            }

            //if more posts are there
            setPosts((prev) => [...prev, ...res.data]);
            setPageNumber((prev) => prev + 1);
        } catch (error) {
            notification.error({
                message: `Please note`, description: 'Error reported', placement: 'topLeft',
                duration:2
            });
        }
    };

    return (
        <>
            <div className="flex-grow h-full pt-6 mr-5 md:ml-auto  scrollbar-hide">
                <div className="mx-auto max-w-md md:max-w-lg lg:max-w-2xl">
                    <InputBox
                        user={user}
                        setPosts={setPosts}
                        increaseSizeAnim={increaseSizeAnim}
                    />
                    {posts ? (
                        posts.length === 0 || errorLoading ? (
                            <InfoBox
                                Icon={EmojiSadIcon}
                                message="Sorry, no posts..."
                                content="Please follow another user or create a new post to start seeing posts."
                            ></InfoBox>
                        ) :
                            (
                                // InfiniteScroll
                            <div
                                // hasMore={hasMore}
                                // next={fetchDataOnScroll}
                                // loader={<Facebook/>}
                                // endMessage={
                                //     <div className="w-full mt-6 mb-6">
                                //         11111
                                //         {/*<RefreshIcon className="h-7 mx-auto" />*/}
                                //     </div>
                                // }
                                // dataLength={posts.length}
                            >
                                {posts && posts?.length > 0 ? posts.map((post,index) => {
                                    const isLiked =
                                        post.likes && post.likes.length > 0 &&
                                        post.likes.filter((like) => like?.user?.id === user?.id).length > 0;
                                    return <PostCard
                                        change={change}
                                        liked={isLiked}
                                        key={post.id}
                                        post={post}
                                        user={user}
                                    />
                                }) : ''}
                            </div>
                        )
                    ) : (
                        <Facebook/>
                    )}
                </div>
            </div>
        </>
    )
        ;
}

export default Feed;

import React, {useContext, useEffect, useRef, useState} from "react";
import Link from 'next/link'
import {
    MinusCircleIcon,
} from "@heroicons/react/outline";
import {Input, notification} from 'antd'
import dynamic from 'next/dynamic'
const ReusableDialog = dynamic(() => import('./ReusableDialog'), {ssr: false});
const CommentComponent = dynamic(() => import('./CommentComponent'), {ssr: false});
const {TextArea} = Input
import dayjs from 'dayjs'
import {CountContext} from '/components/Layout/Layout';
import {request} from "/utils/hashUrl";
import {arrayUnique} from "/utils/set";
import cookie from "js-cookie";

const notify = () => {
    notification.success({
        message: `Post deleted successfully!`, placement: 'topLeft',
        duration: 2
    });
}

function PostCard({post}) {
    const {changeTheme, setLogin} = useContext(CountContext);
    return (
        <div
            className={`flex flex-col justify-start rounded-2xl shadow-md postBackCard ${changeTheme ? 'postBack' : 'whiteMode'}`}>
            {/*头像*/}
            <div className="flex space-x-3 items-center relative">
                <img  style={{borderRadius: '50%',width:'50px',height:'50px'}}
                      src={'/EllipseM.svg'}
                      alt="userimg"/>
                <div>
                        <div style={{
                            cursor: 'pointer',
                            fontSize: '20px'
                        }} className={changeTheme ? 'darknessFont' : 'brightFont'}>
                            User Name
                        </div>
                    <p
                        style={{
                            fontSize: "10px",
                        }}
                        className="text-gray-500 font-light"
                    >
                       0000-00-00 00:00:00
                        {/*GroupShou*/}
                    </p>
                </div>
            </div>
            {/*文本*/}
            <div
                className={changeTheme ? 'darknessFont' : 'brightFont'} style={{margin:'10px 0'}}>Loading...</div>
            {/*图片*/}
            <div style={{height:'40vh',background:'black',position:'relative'}}>
                <img src={'/GroupShou.svg'} alt={''} style={{width: '40px',position:'absolute',top:'50%',left:'50%',transform:"translate(-50%,-50%)",display:'block',margin:'0 auto',borderRadius:'10px'}}/>
            </div>
            {/*几条聊天*/}
            <div className="flex items-center justify-end w-full" style={{marginTop:'10px'}}>
                <img src="/Groupxxi.svg" alt="" width={'20px'}/>
                <span className={`cursor-pointer font-light select-none ${changeTheme?'fontW':'fontB'}`} style={{marginLeft:"5px"}}
                >{`${'000'}   comments>`}</span>
            </div>
        </div>
    );
}

export default PostCard;

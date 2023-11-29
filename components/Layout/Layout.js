import React, {createContext, useState} from "react";
// import Header from "./Header";
import { FloatButton } from 'antd';
import {useRouter} from "next/router";
import {Anchor} from 'antd'
import dynamic from "next/dynamic";
const Header = dynamic(async () =>await import('./Header'),)
export const CountContext = createContext(null);
const Layout = ({children}) => {
    const router = useRouter()

    // 修改name
    const [bolName,setBol]=useState(false)

    // 切换连接
    const [bolLogin,setBolLogin]=useState(false)

    // 登录刷新
    const [showData,setShowData]=useState(false)

    // 切换字体
    const [changeFamily,setChangeFamily]=useState('english')
    const changeFont=(name)=>{
        setChangeFamily(name)
    }
    const changeShowData=()=>{
        setShowData(!showData)
    }
    const changeBolName=()=>{
        setBol(!bolName)
    }
    const changeBolLogin=()=>{
        setBolLogin(!bolLogin)
    }
    return (
        <CountContext.Provider value={{changeFamily,changeFont,bolName,changeShowData,showData, changeBolName,changeBolLogin,bolLogin}}>
            <div className={'layout'} id={'part-1'}>
                <Header/>
                <div
                    style={router.pathname === '/' ? {} : router.pathname === '/statement' ? {marginLeft: '20px'} : {marginLeft: '90px'}}>
                    {children}
                </div>
                <div>
                    <Anchor
                        items={[
                            {
                                key: 'part-1',
                                href: '#part-1',
                                title: 'Part 1',
                            },
                        ]}
                    />
                </div>
                <FloatButton.BackTop />
            </div>
        </CountContext.Provider>
    )
};

export default Layout;

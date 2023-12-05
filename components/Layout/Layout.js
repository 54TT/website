import React, {createContext, useState, useEffect} from "react";
// import Header from "./Header";
import {FloatButton} from 'antd';
import {useRouter} from "next/router";
import {Anchor} from 'antd'
import dynamic from "next/dynamic";

const Header = dynamic(() => import('./Header'),{ ssr: false })
export const CountContext = createContext(null);
const Layout = ({children}) => {
    const router = useRouter()

    // 修改name
    const [bolName, setBol] = useState(false)

    // 切换连接
    const [bolLogin, setBolLogin] = useState(false)

    // 登录刷新
    const [showData, setShowData] = useState(false)

    // 切换字体
    const [changeFamily, setChangeFamily] = useState('english')

    // 切换背景
    const [changeTheme, setChangeTheme] = useState(false)
    const changeBack = () => {
        setChangeTheme(!changeTheme)
    }
    const changeFont = (name) => {
        setChangeFamily(name)
    }
    const changeShowData = () => {
        setShowData(!showData)
    }
    const changeBolName = () => {
        setBol(!bolName)
    }
    const changeBolLogin = () => {
        setBolLogin(!bolLogin)
    }

    useEffect(() => {
        if (changeTheme) {
            const body = document.querySelector('body');
            body.classList.add('darkMode');
            body.classList.remove('whiteMode');
        } else {
            const body = document.querySelector('body');
            body.classList.remove('darkMode');
            body.classList.add('whiteMode');
        }

    }, [changeTheme])
    return (
        <CountContext.Provider value={{
            changeBack,
            changeTheme,
            changeFamily,
            changeFont,
            bolName,
            changeShowData,
            showData,
            changeBolName,
            changeBolLogin,
            bolLogin
        }}>
            <div id={'part-1'}>
                <Header/>
                <div
                    style={router.pathname === '/' ? {} : router.pathname === '/statement' || router.pathname !== '/search' ? {marginLeft: '20px'} : {marginLeft: '90px'}}>
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
                <FloatButton.BackTop/>
            </div>
        </CountContext.Provider>
    )
};

export default Layout;

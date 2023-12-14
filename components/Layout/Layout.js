import React, {createContext, useState, useEffect} from "react";
import Header from "./Header";
import {ConfigProvider, FloatButton} from 'antd';
import {useRouter} from "next/router";
import {Anchor} from 'antd'
import cookie from "js-cookie";
import {useDisconnect} from "wagmi";

export const CountContext = createContext(null);
const Layout = ({children}) => {
    const {disconnect} = useDisconnect()
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

    // 退出
    const setLogin = () => {
        cookie.remove('name');
        cookie.remove('username');
        cookie.remove('token');
        cookie.remove('user')
        if (router.pathname !== '/') {
            router.push('/')
        }
        disconnect()
    }

    const changeBack = () => {
        setChangeTheme(!changeTheme)
    }
    const changeFont = (name) => {
        setChangeFamily(name)
    }
    const changeShowData = () => {
        setShowData(!showData)
    }
    const changeBolName = (name) => {
        setBol(name)
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
            bolLogin,
            setLogin
        }}>
            <ConfigProvider
                theme={{
                    components: {
                        Select: {
                            selectorBg: changeTheme ? 'rgb(59, 55, 71)' : 'rgb(254, 239, 146)'
                        },
                        Segmented: {
                            itemSelectedBg: changeTheme ? 'rgb(59,55,71)' : 'rgb(253,213,62)',
                            itemSelectedColor: changeTheme ? 'rgb(139,199,179)' : 'rgb(0,0,0)',
                            itemColor: changeTheme ? 'rgb(255,255,255)' : 'rgb(0,0,0)'
                        },
                        Pagination: {
                            itemActiveBg: changeTheme ? 'rgb(37,30,38)' : '',
                            itemActiveColorDisabled: changeTheme ? 'rgb(156,156,156)' : '',
                        }
                    }
                }}>
                <div id={'part-1'}>
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
                                },
                            ]}
                        />
                    </div>
                    <FloatButton.BackTop/>
                </div>
            </ConfigProvider>
        </CountContext.Provider>
    )
};

export default Layout;

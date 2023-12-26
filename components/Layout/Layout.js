import React, {createContext, useState, useEffect} from "react";
import Header from "./Header";
import {ConfigProvider, FloatButton} from 'antd';
import {useRouter} from "next/router";
import {Anchor} from 'antd'
import cookie from "js-cookie";
import {useDisconnect} from "wagmi";
import  styled from '/public/styles/all.module.css'
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
    const [changeTheme, setChangeTheme] = useState(true)

    // 退出
    const [logoutBol, setLogoutBol] = useState(false)
    const changeBol=(name)=>{
        setLogoutBol(name)
    }
    const setLogin = async () => {
        cookie.remove('name');
        cookie.remove('username');
        cookie.remove('token');
        cookie.remove('user')
        if (router.pathname !== '/') {
            router.push('/')
        }

        changeBol(true)
        disconnect()
    }

    const changeBack = () => {
        setChangeTheme(!changeTheme)
    }
    const changeFont = (name) => {
        setChangeFamily(name)
    }
    const changeShowData = (name) => {
        setShowData(name)
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
            body.classList.add('bodyBack','darkModes');
            body.classList.remove('whiteMode','whiteModes');
        } else {
            const body = document.querySelector('body');
            body.classList.remove('bodyBack','darkModes');
            body.classList.add('whiteMode','whiteModes');
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
            setLogin, logoutBol ,changeBol
        }}>
            <ConfigProvider
                theme={{
                    components: {
                        Select: {
                            selectorBg: changeTheme ? 'rgb(59, 55, 71)' : 'rgb(254, 239, 146)',
                            optionSelectedBg:changeTheme ? 'rgb(200,200,200)' : ''
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
                    <div className={styled.min1200} style={router.pathname === '/statement' ? {marginLeft: '20px'} : {}}>
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

import React, {createContext, useState} from "react";
import Header from "./Header";
import {useRouter} from "next/router";
export const CountContext = createContext(null);
const Layout = ({children}) => {
    const router = useRouter()
    const [bolName,setBol]=useState(false)
    const [bolLogin,setBolLogin]=useState(false)
    const changeBolName=()=>{
        setBol(!bolName)
    }
    const changeBolLogin=()=>{
        setBolLogin(!bolLogin)
    }
    return (
        <CountContext.Provider value={{bolName, changeBolName,changeBolLogin,bolLogin}}>
            <div className={'layout'}>
                <Header/>
                <div
                    style={router.pathname === '/' ? {} : router.pathname === '/statement' ? {marginLeft: '20px'} : {marginLeft: '90px'}}>
                    {children}
                </div>
            </div>
        </CountContext.Provider>
    )
};

export default Layout;

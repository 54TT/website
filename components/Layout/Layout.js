import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import {useRouter} from "next/router";
const Layout = ({ children }) => {
  const router = useRouter()
  return (
    <div className={'layout'}>
      <Header />
        <div style={router.pathname==='/'?{}:router.pathname==='/statement'?{marginLeft:'20px'}:{marginLeft:'90px'}}>
          {children}
        </div>
    </div>
  )
};

export default Layout;

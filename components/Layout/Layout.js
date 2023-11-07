import React from "react";
import Footer from "./Footer";
import Header from "./Header";
// import DrawerPage from './drawer'

const Layout = ({ children }) => {
  return (
    <div className={'layout'}>
      <Header />
        {/*<DrawerPage/>*/}
        <div style={children?.type?.name==='Home'?{}:{marginLeft:'90px'}}>
          {children}
        </div>
      {/* <Footer /> */}
    </div>
  )
};

export default Layout;

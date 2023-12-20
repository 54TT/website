import React, {useContext} from "react";
import Link from "next/link";
import styled from '/public/styles/all.module.css'
import {CountContext} from "/components/Layout/Layout";

function SidebarRow({ Icon, title, src, route,name, height = 50, width = 50 }) {
    const {changeTheme} = useContext(CountContext);
  return (
    <Link href={route} passHref>
      <div className="cursor-pointer flex items-center space-x-2 p-4 rounded-md leftMoe">
        {src && <img src={src||'/dexlogo.svg'} alt="profile pic" height={height} width={width} />}
        {Icon && <Icon style={{ color: "#7d67e9" }} className="h-9 w-9" />}
        <p className={`hidden sm:inline-flex text-l ${styled.sidebarRowName} `}>
            <span className={`${changeTheme?'fontW':'fontB'}`}>{name?title&&title.length>0?title.slice(0,3)+'...'+title.slice(-3):title:title}</span>
        </p>
      </div>
    </Link>
  );
}

export default SidebarRow;

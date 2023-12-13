import React from "react";
import Link from "next/link";
import styled from '/public/styles/all.module.css'

function SidebarRow({ Icon, title, src, route,name, heighg = 50, width = 50 }) {
  return (
    <Link href={route} passHref>
      <div className="cursor-pointer flex items-center space-x-4 p-4 rounded-md leftMoe">
        {src && <img src={src||'/Ellipse1.png'} alt="profile pic" height={heighg} width={width} />}
        {Icon && <Icon style={{ color: "#7d67e9" }} className="h-9 w-9" />}
        <p
          className={`hidden sm:inline-flex text-l ${styled.sidebarRowName}`}
        >
            <span>{name?title&&title.length>0?title.slice(0,3)+'...'+title.slice(-3):title:title}</span>
        </p>
      </div>
    </Link>
  );
}

export default SidebarRow;

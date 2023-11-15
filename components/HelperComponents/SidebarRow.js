import React from "react";
import styled from "styled-components";
import Link from "next/link";
function SidebarRow({ Icon, title, src, route,name }) {
  return (
    <Link href={route} passHref>
      <div className="cursor-pointer flex items-center space-x-4 p-4 hover:bg-gray-200 rounded-md">
        {src && <img style={{width:'50px',height:'50px',borderRadius:'50%'}} src={src} alt="profile pic" />}
        {Icon && <Icon style={{ color: "#7d67e9" }} className="h-9 w-9" />}
        <p
          style={{
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "1.05rem",
          }}
          className="hidden sm:inline-flex text-l"
        >
            <span>{name?title&&title.length>0?title.slice(0,3)+'...'+title.slice(-3):title:title}</span>
        </p>
      </div>
    </Link>
  );
}

export default SidebarRow;

import React from "react";
import {AppleOutlined} from '@ant-design/icons'
function HeaderIcon({ Icon, active, IconSolid, unread }) {
  return (
    <div
      className={`select-none relative flex items-center cursor-pointer md:px-10 sm:h-14 md:hover:bg-gray-100 rounded-xl  ${
        active ? "border-purple-500" : ""
      } group`}
    >
      <IconSolid
        className={`h-7  text-gray-500 text-center sm:h-7 mx-auto group-hover:text-purple-500 ${
          active ? "text-purple-500" : ""
        } `}
      />

      {unread && (
        <AppleOutlined
          style={{
            position: "relative",
            top: "-.46rem",
            right: ".75rem",
            fontSize: "1rem",
            color: "red",
          }}
        />
      )}
    </div>
  );
}

export default HeaderIcon;

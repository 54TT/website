import React, { useContext } from "react";
import {
  UsersIcon,
  BellIcon,
  ChatIcon,
  UserGroupIcon,
} from "@heroicons/react/outline";
import dynamic from "next/dynamic";
const SidebarRow = dynamic(() => import("./HelperComponents/SidebarRow"), {
  ssr: false,
});
import { changeLang } from "/utils/set";
import styles from "/public/styles/social.module.css";

function Sidebar({ user, topDist, maxWidth }) {
  const social = changeLang("social");
  return (
    <div
      className={`${
        maxWidth
          ? `p-2 max-w-[400px] xl:min-w-[230px]   xl:ml-6`
          : `p-2 max-w-[600px] xl:min-w-[300px]  xl:ml-6`
        }
                ${styles.mobliceSidebar}
            `}
      style={{
        alignSelf: "flex-start",
        fontFamily: "Inter"}}>
        <SidebarRow
            width={30}
            height={30}
            src={"/home_vector.svg"}
            title={social.home}
            route={"/social"}
        />
      <SidebarRow
        width={30}
        height={30}
        src={"/message_vector.svg"}
        title={social.messenger}
        route={"/chats"}
      />
      <SidebarRow
        width={30}
        height={30}
        src={"/icon_notifications_.svg"}
        title={social.notification}
        route={"/notifications"}
      />

      <SidebarRow
        width={30}
        height={30}
        src={"/icon_following_.svg"}
        title={social.following}
        route={
          user && user.uid ? `/user/${user.uid}/following` : ''
        }
      />
      <SidebarRow
        width={30}
        height={30}
        src={"/icon_followers_.svg"}
        title={social.followers}
        route={
          user && user.uid ? `/user/${user.uid}/followers` : ''
        }
      />
    </div>
  );
}

export default Sidebar;

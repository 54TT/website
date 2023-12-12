import React, {useContext} from "react";
import {
    UsersIcon,
    BellIcon,
    ChatIcon,
    UserGroupIcon,
} from "@heroicons/react/outline";
// import SidebarRow from "./HelperComponents/SidebarRow";
import dynamic from "next/dynamic";
const SidebarRow = dynamic(() => import('./HelperComponents/SidebarRow'),{ ssr: false })
import {changeLang} from "/utils/set";
import styles from '../public/styles/social.module.css'

function Sidebar({user, topDist, maxWidth}) {
    const social=changeLang('social')
    return (
        <div
            className={`${maxWidth
                ? `p-2 max-w-[400px] xl:min-w-[230px]   xl:ml-6`
                : `p-2 max-w-[600px] xl:min-w-[300px]  xl:ml-6`}
                ${styles.mobliceSidebar}
            `}
            style={{
                alignSelf: "flex-start",
                fontFamily: "Inter",
            }}
        >
            <SidebarRow
                Icon={UsersIcon}
                title={social.home}
                route={'/social'}
            />
            <SidebarRow
                Icon={UsersIcon}
                title={social.following}
                route={user&&user.uid ? `/user/${user.uid}/following` : ``}
            />
            <SidebarRow
                Icon={UserGroupIcon}
                title={social.followers}
                route={user&&user.uid ? `/user/${user.uid}/followers` : ``}
            />
            <SidebarRow
                Icon={BellIcon}
                title={social.notification}
                route={"/notifications"}
            />
            <SidebarRow
                Icon={ChatIcon}
                title={social.messenger} route={"/chats"}/>
        </div>
    );
}

export default Sidebar;

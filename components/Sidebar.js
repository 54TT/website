import React, {useContext} from "react";
import {
    UsersIcon,
    BellIcon,
    ChatIcon,
    UserGroupIcon,
} from "@heroicons/react/outline";
// import SidebarRow from "./HelperComponents/SidebarRow";
import dynamic from "next/dynamic";
const SidebarRow = dynamic(() => import('./HelperComponents/SidebarRow'),)
import {changeLang} from "/utils/set";

function Sidebar({user, topDist, maxWidth}) {
    const social=changeLang('social')
    return (
        <div
            className={
                maxWidth
                    ? `p-2 max-w-[400px] xl:min-w-[230px]   xl:ml-6`
                    : `p-2 max-w-[600px] xl:min-w-[300px]  xl:ml-6`
            }
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
                route={user&&user.id ? `/user/${user.id}/following` : `/user/1/following`}
            />
            <SidebarRow
                Icon={UserGroupIcon}
                title={social.followers}
                route={user&&user.id ? `/user/${user.id}/followers` : `/user/1/followers`}
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

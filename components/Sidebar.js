import React from "react";
import {
    UsersIcon,
    BellIcon,
    ChatIcon,
    UserGroupIcon,
} from "@heroicons/react/outline";
// import SidebarRow from "./HelperComponents/SidebarRow";
import dynamic from "next/dynamic";
const SidebarRow = dynamic(() => import('./HelperComponents/SidebarRow'),{suspense:false})

function Sidebar({user, topDist, maxWidth}) {
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
                title="Home"
                route={'/social'}
            />
            <SidebarRow
                Icon={UsersIcon}
                title="Following"
                route={user&&user.id ? `/user/${user.id}/following` : `/user/1/following`}
            />
            <SidebarRow
                Icon={UserGroupIcon}
                title="Followers"
                route={user&&user.id ? `/user/${user.id}/followers` : `/user/1/followers`}
            />
            <SidebarRow
                Icon={BellIcon}
                title="Notifications"
                route={"/notifications"}
            />
            <SidebarRow
                Icon={ChatIcon}
                title="Messenger" route={"/chats"}/>
        </div>
    );
}

export default Sidebar;

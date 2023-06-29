import React from 'react'
import { Menu } from 'semantic-ui-react'
import "./sidebar.css";
import User from "./User/user";
import Channels from "./Channels/Channels";
import PrivateChat from './PrivateChat/PrivateChat';
import Favourite from './Favourite/Favourite';

export const SideBar = () => {
    return (<Menu vertical fixed="left" borderless size="large" className="sideBar">
        <User />
        <Favourite/>
        <Channels />
        <PrivateChat/>
    </Menu>
    )
}




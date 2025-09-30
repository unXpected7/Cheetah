import React from "react";
import Bottom from "./BottomBar";
import Chat from "./ChatGroup";
import Top from "./TopBar";

const Main = ({ onLogout }) => {
    return(
        <div className="h-screen flex flex-col">
            <Top onLogout={onLogout}/>
            <Chat/>
            <Bottom/>
        </div>
    )
}

export default Main;
import React from "react";
import Bottom from "./BottomBar";
import Chat from "./ChatGroup";
import Top from "./TopBar";

const Main = () => {
    return(
        <div>
            <Top/>
            <Chat/>
            <Bottom/>
        </div>
    )
}

export default Main;
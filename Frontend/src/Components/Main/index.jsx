import React from "react";
import Bottom from "./BottomBar";
import Chat from "./ChatGroup";
import Top from "./TopBar";

const Main = ({ onLogout }) => {
    const handleSendMessage = (message) => {
        console.log('Sending message:', message);
    };

    return(
        <div className="h-screen flex flex-col bg-gray-50">
            <Top onLogout={onLogout}/>
            <div className="flex-1 overflow-hidden">
                <Chat/>
            </div>
            <Bottom onSendMessage={handleSendMessage}/>
        </div>
    )
}

export default Main;
import React from "react";
import './style.scss';
import Chat from './Chat';

const ChatGroup = () => {
    const [currentUserId] = React.useState(1);
    const [currentContactId] = React.useState(2);

    return (
        <div className="chat-group">
            <Chat
                userId={currentUserId}
                contactId={currentContactId}
            />
        </div>
    );
};

export default ChatGroup;
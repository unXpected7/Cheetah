import React, { useState, useEffect, useRef } from "react";
import { mockAPI } from "../../../services/mockAPI";
import './style.scss';

const Chat = ({ userId, contactId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchMessages();
    }, [userId, contactId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await mockAPI.getMessages(userId, contactId);
            if (response.success) {
                setMessages(response.data);
            } else {
                setError('Failed to load messages');
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            setError('Error loading messages');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const messageToSend = newMessage.trim();
        setNewMessage('');

        try {
            const response = await mockAPI.sendMessage(userId, contactId, messageToSend);
            if (response.success) {
                setMessages([...messages, response.data]);
                simulateTyping();
            } else {
                setError('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Error sending message');
        }
    };

    const simulateTyping = () => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
        }, 2000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatMessageDate = (timestamp) => {
        const today = new Date();
        const messageDate = new Date(timestamp);

        if (messageDate.toDateString() === today.toDateString()) {
            return 'Today';
        } else {
            return messageDate.toLocaleDateString();
        }
    };

    const getMessagesByDate = () => {
        const messagesByDate = {};

        messages.forEach(message => {
            const dateKey = formatMessageDate(message.timestamp);
            if (!messagesByDate[dateKey]) {
                messagesByDate[dateKey] = [];
            }
            messagesByDate[dateKey].push(message);
        });

        return messagesByDate;
    };

    if (isLoading) {
        return (
            <div className="chat">
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <span>Loading messages...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="chat">
                <div className="error">
                    <div className="error-icon">⚠️</div>
                    <div className="error-message">{error}</div>
                    <button onClick={fetchMessages} className="retry-btn">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const messagesByDate = getMessagesByDate();
    const dateKeys = Object.keys(messagesByDate);

    return (
        <div className="chat">
            <div className="messages">
                {dateKeys.map(dateKey => (
                    <div key={dateKey} className="date-separator">
                        <div className="date-label">{dateKey}</div>
                        <div className="messages-day">
                            {messagesByDate[dateKey].map((message) => (
                                <div
                                    key={message.id}
                                    className={`message ${message.senderId === userId ? 'sent' : 'received'}`}
                                >
                                    <div className="message-content">
                                        {message.message}
                                    </div>
                                    <div className="message-time">
                                        {formatTime(message.timestamp)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {messages.length === 0 && (
                    <div className="no-messages">
                        <div className="no-messages-icon">💬</div>
                        <div className="no-messages-text">No messages yet</div>
                        <div className="no-messages-subtext">Start the conversation!</div>
                    </div>
                )}

                {isTyping && (
                    <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="message-input">
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                    rows={2}
                    disabled={isTyping}
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isTyping}
                    className="send-btn"
                >
                    {newMessage.trim() ? 'Send' : 'Type'}
                </button>
            </div>
        </div>
    );
};

export default Chat;
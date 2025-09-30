import React, { useState } from "react";
import './style.scss'
import { Paperclip, Send, Smile, Mic } from "lucide-react";

const Bottom = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');

    const handleSendMessage = () => {
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="bottom bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
            <div className="flex items-end gap-3 max-w-4xl mx-auto">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Paperclip className="w-5 h-5" />
                </button>

                <div className="flex-1 relative">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full resize-none border border-gray-300 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all max-h-32"
                    />
                    <button className="absolute right-2 bottom-2 p-1 text-gray-500 hover:text-gray-700 transition-colors">
                        <Smile className="w-5 h-5" />
                    </button>
                </div>

                {message.trim() ? (
                    <button
                        onClick={handleSendMessage}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-3 rounded-full transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                ) : (
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-600 p-3 rounded-full transition-colors flex items-center justify-center">
                        <Mic className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    )
};

export default Bottom
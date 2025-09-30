import React from "react";
import './style.scss'
import { LogOut, Users, MessageSquare, Bell } from "lucide-react";

const Top = ({ onLogout }) => {
    return (
        <div className="top bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                        <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Group Chat
                        </h1>
                        <p className="text-sm text-gray-500">Connected and chatting</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Online</span>
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
};

export default Top;
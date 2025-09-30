import React from "react";
import './style.scss'
import { LogOut } from "lucide-react";

const Top = ({ onLogout }) => {
    return (
        <div className="top flex justify-between items-center">
            <div className="font-bold text-lg">Group Chat</div>
            <button
                onClick={onLogout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors"
            >
                <LogOut className="w-4 h-4" />
                Logout
            </button>
        </div>
    )
};

export default Top;
import React from 'react';
import WhatsAppInterface from './WhatsAppInterface';

interface MainProps {
  onLogout: () => void;
}

const Main: React.FC<MainProps> = ({ onLogout }) => {
  const userId = 'user-1'; // This would come from your auth system

  return (
    <div className="w-full h-screen bg-background">
      <WhatsAppInterface userId={userId} />
    </div>
  );
};

export default Main;
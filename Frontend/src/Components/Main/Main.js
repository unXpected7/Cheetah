import React from 'react';
import WhatsAppInterface from './WhatsAppInterface';

const Main = ({ onLogout }) => {
  const userId = 'user-1'; // This would come from your auth system

  return (
    <div className="main-container">
      <WhatsAppInterface userId={userId} />
    </div>
  );
};

export default Main;
import React from 'react';
import { useTypingEffect } from '../hook/useTypingEffect';

const MessageBubble = ({ message }) => {
  const displayedText = useTypingEffect(message.text);

  return (
    <div style={{
      display: 'flex',
      justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
      margin: '10px 0'
    }}>
      <div style={{
        maxWidth: '60%',
        padding: '10px',
        borderRadius: '10px',
        backgroundColor: message.sender === 'user' ? '#10a37f' : '#202123',
        color: '#f1f1f1',
      }}>
        {displayedText}
      </div>
    </div>
  );
};

export default MessageBubble;

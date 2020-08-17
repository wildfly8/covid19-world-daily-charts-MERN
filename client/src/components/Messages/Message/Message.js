import React from 'react';
import './Message.css';
import parse from 'html-react-parser'


const Message = ({ message: { text, user }, name }) => {
  let isSentByCurrentUser = false;

  const trimmedName = name.trim();

  if(user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return (
    isSentByCurrentUser
      ? (
        <div className="messageContainer">
          <h3 className="sentText pr-10 colorWhite backgroundBlue">{trimmedName}</h3>
          <div className="messageBox">
            <p className="messageText colorDark">{parse(text)}</p>
          </div>
        </div>
        )
        : (
          <div className="messageContainer">
            <h3 className="sentText pl-10 ">{user}</h3>
            <div className="messageBox backgroundLight">
              <p className="messageText colorDark">{parse(text)}</p>
            </div>
          </div>
        )
  );
}

export default Message;
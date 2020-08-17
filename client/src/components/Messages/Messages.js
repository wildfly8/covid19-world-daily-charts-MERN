import React from 'react'
import Message from './Message/Message'
import './Messages.css'

const Messages = React.forwardRef(({ messages, name }, ref) => (
  <div ref={ref} className="messages">
    {messages.map((message, i) => <div key={i}><Message message={message} name={name}/></div>)}
  </div>
))

export default Messages
import React, { useRef } from 'react'
import ContentEditable from 'react-contenteditable'
import './Input.css'


let timerId = null

const Input = ({ sendMessage, setTyping }) => {

  const text = useRef('');

  return <div className="input">
          <span className="emoji" role="img" aria-label="emoji">💬</span>
          <ContentEditable 
            className="content_editable"
            placeholder={"Type here..."}
            html={text.current}
            onChange={({ target: { value } }) => {
              text.current = value
            }} 
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                if(event.preventDefault) {
                  event.preventDefault()
                }
                document.getElementById('sendButton').click();
                // ContentEditable lib cannot work with React function component well
                // sendMessage(text.current)
                // text.current = ''
              } else {

              }
            }}
            onKeyUp={() => {
              clearTimeout(timerId)
              timerId = setTimeout(() => setTyping(false), 2000)
            }}
          />
          <button id="sendButton" type="button" className="sendButton" onClick={() => {
            sendMessage(text.current)
            text.current = ''
          }}>Send</button>
        </div>

  // return  ( 
  // <form className="form">
  //   <span role="img" aria-label="emoji">💬</span>
  //   <input
  //     className="input"
  //     type="text"
  //     placeholder="Type here..."
  //     value={message}
  //     onChange={({ target: { value } }) => {
  //       text.current = value
  //       setMessage(value)
  //       console.log(`value on change = ${value}`)
  //     }}
  //     onKeyDown={(event) => {
  //       console.log(`keyDown event = ${event.key }`)
  //       if (event.key === 'Enter' && !event.shiftKey) {
  //         if(event.preventDefault) {
  //           event.preventDefault()
  //         }
  //         console.log(`text.current before send = ${text.current}`)
  //         sendMessage()
  //       } else {

  //       }
  //     }}
  //     onKeyUp={() => {
  //       clearTimeout(timerId)
  //       timerId = setTimeout(() => setTyping(false), 2000)
  //     }}
  //   />
  //   <button type="button" className="sendButton" onClick={e => sendMessage()}>Send</button>
  // </form>
  // )
  }

export default Input
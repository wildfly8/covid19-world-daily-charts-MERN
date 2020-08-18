import { useOktaAuth } from '@okta/okta-react'
import React, { useState, useEffect, useRef } from 'react'
import config from './config'
import { fetchUserLoginStatus } from './api'
import io from "socket.io-client"
import TextContainer from './components/TextContainer/TextContainer'
import InfoBar from './components/InfoBar/InfoBar'
import Messages from './components/Messages/Messages'
import Input from './components/Input/Input'
import HeaderBar from './HeaderBar'
// @ts-ignore
import styles from './App.module.css'


//temp
const possibleErrors = ['Your resource server example is using the same Okta authorization server (issuer) that you have configured this React application to use.']
let savedRoomsFetchFailed = false
let counterpartySocketMap = {}
let counterpartyRoomMap = {}

const Chat = () => {
  const { authState, authService } = useOktaAuth()
  const [userInfo, setUserInfo] = useState(null)
  const [allAppUsers, setAllAppUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [counterparties, setCounterparties] = useState([])
  const [selectedCounterparty, setSelectedCounterparty] = useState(null)
  const [savedRooms, setSavedRooms] = useState([])
  const [messages, setMessages] = useState([])
  const [meTyping, setMeTyping] = useState(false)
  const [counterpartyTyping, setCounterpartyTyping] = useState(false)
  const msgConsole = useRef(null);
  const selectedCounterpartyRef = useRef(selectedCounterparty);

  selectedCounterpartyRef.current = selectedCounterparty

  //fetch all saved rooms from DB
  useEffect(() => {
    if (authState.isAuthenticated) {
      authService.getUser().then((info) => {
        const { accessToken } = authState
        setUserInfo(info)
        fetch(`${config.resourceServer.roomsUrl}?user=${info.sub}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }).then((response) => {
          if (!response.ok) {
            return Promise.reject()
          }
          return response.json()
        }).then((data) => {
          setAllAppUsers(data.allAppUsers)
          setSavedRooms(data.rooms)
        }).catch((err) => {
          savedRoomsFetchFailed = true
          console.error(err)
        });
      });
    }
  }, [authState, authService])

  useEffect(() => {
    (async () => {
      if (savedRooms.length > 0) {
        const counterpartyNames = savedRooms.filter(room => room.members.length === 2 && room.members.includes(userInfo.name))
          .map(room => {
            let temp = [...room.members]
            const index = temp.indexOf(userInfo.name)
            if (index > -1) {
              temp.splice(index, 1)
            }
            counterpartyRoomMap[temp[0]] = room.roomName
            return temp[0]
          }
          )
        const counterparties = []
        for (const name of counterpartyNames) {
          counterparties.push({ name: name, status: await fetchUserLoginStatus(name) })
        }
        setCounterparties(counterparties)
        setLoading(false)
        // window.scrollTo(0, document.body.scrollHeight)
      }
    })()
  }, [savedRooms, userInfo])

  useEffect(() => {
    if (selectedCounterparty) {
      if (counterpartySocketMap[selectedCounterparty]) {
        setMessages([{ user: null, text: `Saved messages from DB for this room with ${selectedCounterparty}. (to be done ...)` }])
      } else {
        setMessages([{ user: null, text: `Saved messages from DB for this room with ${selectedCounterparty}. (to be done ...)` }])
        counterpartySocketMap[selectedCounterparty] = io(process.env.REACT_APP_EXPRESS_NODE_SERVER_ENDPOINT);
        let room
        if (counterpartyRoomMap[selectedCounterparty]) {
          room = counterpartyRoomMap[selectedCounterparty]
        } else {
          room = `DM-${userInfo.name}-${selectedCounterparty}`
          counterpartyRoomMap[selectedCounterparty] = room
        }
        counterpartySocketMap[selectedCounterparty].emit('join', { name : userInfo.name, room : room }, (error) => {
          if (error) {
            console.log(error)
          }
        })
        counterpartySocketMap[selectedCounterparty].on('message', (message) => {
          if(message.user === 'admin' || (counterpartyRoomMap[selectedCounterpartyRef.current] && counterpartyRoomMap[selectedCounterpartyRef.current].split('-').includes(message.user))) {
            setMessages(prevMessages => [...prevMessages, message])
          }
          // save to DB...
        })
        counterpartySocketMap[selectedCounterparty].on("roomData", ({ room, users }) => {
          console.log("roomData users=" + JSON.stringify(users) + ", room=" + room)
        })
        counterpartySocketMap[selectedCounterparty].on('counterpartyTyping', ({counterparty, counterpartyTyping}) => {
          if(selectedCounterpartyRef.current && selectedCounterpartyRef.current === counterparty) {
            setCounterpartyTyping(counterpartyTyping)
          }
        })
      }
    }
  }, [selectedCounterparty, userInfo])

  useEffect(() => {
    if(msgConsole && msgConsole.current) {
      msgConsole.current.scrollTop = msgConsole.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (counterpartySocketMap[selectedCounterparty]) {
      counterpartySocketMap[selectedCounterparty].emit('sendMeTyping', meTyping, (error) => {
        if (error) {
          console.log(error)
        }
      })
    }
  }, [meTyping, selectedCounterparty])

  const handlePopupSelection = async (value) => {
    if (value && !Array.isArray(value)) {
      setSelectedCounterparty((prevSelectedCounterparty) => value)
      if (!counterparties.map((counterparty) => counterparty.name).includes(value)) {
        let temp = [...counterparties]
        temp.push({ name: value, status: await fetchUserLoginStatus(value) })
        setCounterparties(temp)
      }
    }
  }

  const sendMessage = (msg) => {
    if (msg) {
      if (counterpartySocketMap[selectedCounterparty]) {
        counterpartySocketMap[selectedCounterparty].emit('sendMessage', msg, (error) => {
          if (error) {
            console.log(error)
          }
        })
      } else {
        alert('Please select one DM target to send a message!')
      }
    }
  }

  return (
    <div className={styles.grid_container}>
      <header className={styles.grid_item_header}><HeaderBar /></header>
      <nav className={styles.grid_item_nav} style={{color: "white", backgroundColor: "#350d36"}}>
        <TextContainer userInfo={userInfo} allAppUsers={allAppUsers} counterparties={counterparties} selectedCounterparty={selectedCounterparty} setSelectedCounterparty={setSelectedCounterparty} handlePopupSelection={handlePopupSelection} />
      </nav>
      <main className={styles.grid_item_content}>
        {savedRoomsFetchFailed && <h2 style={{color: "orange"}}>Failed to fetch saved rooms!! Please verify: ${possibleErrors}</h2>}
        <InfoBar room={counterpartyRoomMap[selectedCounterparty]} />
        {loading? 
          <h2 style={{color: "orange"}}>{loading && 'Loading All Your Saved Channels......'}</h2>
          : 
          <Messages messages={messages} name={userInfo ? userInfo.name : ''} ref={msgConsole} />}
        <Input sendMessage={sendMessage} setMeTyping={setMeTyping} />
      </main>
      <output className={styles.grid_item_infobar}>{counterpartyTyping? `${selectedCounterparty} is typing...` : null}</output>
      <footer className={styles.grid_item_footer}><small>Copyright &copy; Monad Wisdom Technologies. All rights reserved. If any suggestion, please email us at: wisdomspringtech@yahoo.com</small></footer>
    </div>
  )
}

export default Chat
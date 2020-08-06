import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { Message } from 'semantic-ui-react';
import config from './config';
// @ts-ignore
import styles from './App.module.css';
import io from "socket.io-client";
import TextContainer from './components/TextContainer/TextContainer';
import InfoBar from './components/InfoBar/InfoBar';
import Messages from './components/Messages/Messages';
import Input from './components/Input/Input';

const possibleErrors = ['Your resource server example is using the same Okta authorization server (issuer) that you have configured this React application to use.'];
let socket;

const Chat = () => {
  const { authState, authService } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [rooms, setRooms] = useState(null);
  const [roomsFetchFailed, setRoomsFetchFailed] = useState(false);

  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  //fetch all saved rooms from DB
  useEffect(() => {
    if (authState.isAuthenticated) {
      authService.getUser().then((info) => {
        const { accessToken } = authState;
        setUserInfo(info);
        fetch(`${config.resourceServer.roomsUrl}?user=${info.sub}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }).then((response) => {
          if (!response.ok) {
            return Promise.reject();
          }
          return response.json();
        }).then((data) => {
          setRooms(data.rooms);
          setRoomsFetchFailed(false);
          window.scrollTo(0, document.body.scrollHeight);
        }).catch((err) => {
          setRoomsFetchFailed(true);
          console.error(err);
        });
      });
    }
  }, [authState, authService]);

  // useEffect(() => {
  //   if(rooms) {
  //     const { name, room } = {name: userInfo.name, room: 'testRoom'};
  //     socket = io(process.env.REACT_APP_EXPRESS_NODE_SERVER_ENDPOINT);
  //     setRoom(room);
  //     setName(name)
  //     socket.emit('join', { name, room }, (error) => {
  //       if (error) {
  //         alert(error);
  //       }
  //     });
  //     socket.on('message', message => {
  //       setMessages(messages => [...messages, message]);
  //     });
  //     socket.on("roomData", ({ users }) => {
  //       setUsers(users);
  //     });
  //     window.scrollTo(0, document.body.scrollHeight);
  //   }
  // }, [rooms]);

  let initCounterparties = []
  if(userInfo && rooms) {
    initCounterparties = rooms.filter(room => room.members.length === 2 && room.members.includes(userInfo.name))
      .map(room => {
        let temp = [...room.members]
        const index = temp.indexOf(userInfo.name)
        if(index > -1) {
          temp.splice(index, 1)
        }
        return temp[0]
      })
  }

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  return (
    <div>
      {roomsFetchFailed && <div style={{ color: "orange", marginTop: "3em" }}><Message error header="Failed to fetch rooms.  Please verify the following:" list={possibleErrors} /></div>}
      <div className={styles.container}>
        <div className={styles.nav}>
          <TextContainer userInfo={userInfo} initCounterparties={initCounterparties} />
        </div>
        <div className={styles.charts}>
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
        </div>
      </div>
    </div>
  );
};

export default Chat;

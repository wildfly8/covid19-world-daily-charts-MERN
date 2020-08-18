import React, { useState, useEffect } from 'react'
import { useOktaAuth } from '@okta/okta-react';
import { fetchVisitsCounter } from './api';


export const MyContext = React.createContext()

export const MyContextProvider = (props) => {
  const [visitsCounter, setVisitsCounter] = useState(0)
  const [userInfo, setUserInfo] = useState(null);
  const { authState, authService } = useOktaAuth();
  console.log(`useOktaAuth...user=${userInfo}`)

  useEffect(() => {
    (async () => {
      setVisitsCounter(await fetchVisitsCounter());
    })();
  }, []);

  useEffect(() => {
    if (!authState.isAuthenticated) {
      setUserInfo(null);
    } else {
      authService.getUser().then((info) => {
        setUserInfo(info);
      });
    }
    console.log(`auth checking...user=${userInfo}`)
  }, [authState, authService]);

  return (
    <MyContext.Provider value={{ visits: [visitsCounter, setVisitsCounter], user: [userInfo, setUserInfo], auth: [authState, authService] }} >
      {props.children}
    </MyContext.Provider>
  )
}
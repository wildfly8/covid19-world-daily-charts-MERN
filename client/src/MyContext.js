import React, { useState } from 'react'

export const MyContext = React.createContext();

export const MyContextProvider = (props) => {
  const [visitsCounter, setVisitsCounter] = useState(0);

  return (
    <MyContext.Provider value={[visitsCounter, setVisitsCounter]} >
      {props.children}
    </MyContext.Provider>
  )
}
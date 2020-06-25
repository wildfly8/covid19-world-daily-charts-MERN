import React from 'react';
import { AuthContext } from '../Auth';

export default () => {

    const auth = React.useContext(AuthContext);

    const handleClick = () => {
      alert('User Profile: ' + (auth && auth.user? auth.user.name : ''));
    };
  
    return (
      <div>
          <button onClick={handleClick}>User Profile</button>
      </div>
    );
};
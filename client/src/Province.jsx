import React, { useState, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import styles from './App.module.css';

const Profile = () => {
  const { authState, authService } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!authState.isAuthenticated) {
      // When user isn't authenticated, forget any user info
      setUserInfo(null);
    } else {
      authService.getUser().then((info) => {
        setUserInfo(info);
      });
    }
  }, [authState, authService]); // Update if authState changes

  if (!userInfo) {
    return (
      <div className={styles.container}>
        <h2>Fetching daily province stats...</h2>
      </div>
    );
  }

  return (
    <div>
      
    </div>
  );
};

export default Profile;

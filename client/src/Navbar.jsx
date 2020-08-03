import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';
import { Icon, Menu } from 'semantic-ui-react';

const Navbar = () => {
  const { authState, authService } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!authState.isAuthenticated) {
      setUserInfo(null);
    } else {
      authService.getUser().then((info) => {
        setUserInfo(info);
      });
    }
  }, [authState, authService]);


  const login = async () => authService.login('/');
  const logout = async () => authService.logout('/');

  return (
    <div>
      <Menu fixed="top" inverted>
          <Menu.Item><Icon name="sidebar" /></Menu.Item>
          <Menu.Item as="a" header href="/"><Icon name="chart line" />COVID-19 Global Daily Stats by Country</Menu.Item>
          <Menu.Item as="a" header href="/province"><Icon name="chart bar" />Daily Stats by Province</Menu.Item>
          {authState.isAuthenticated && userInfo && (<Menu.Item as="a" href="/chat"><Icon name="rocketchat" />Chat</Menu.Item>)}
          {authState.isAuthenticated && userInfo && <Menu.Item position='right'>Welcome {userInfo.name}!</Menu.Item>}
          {authState.isAuthenticated && userInfo && <Menu.Item position='right' as="a" href="/profile"><Icon name="user outline" />Profile</Menu.Item>}
          {authState.isAuthenticated && userInfo && <Menu.Item position='right' as="a" onClick={logout}>Logout</Menu.Item>}
          {!authState.isPending && !authState.isAuthenticated && <Menu.Item position='right'>Welcome Visitor</Menu.Item>}
          {!authState.isPending && !authState.isAuthenticated && <Menu.Item position='right' as="a" onClick={login}>Login</Menu.Item>}
      </Menu>
    </div>
  );
};
export default Navbar;

import React, { useContext } from 'react';
import { Icon, Menu } from 'semantic-ui-react';
// @ts-ignore
import styles from './App.module.css'
import { MyContext } from './MyContext';


const HeaderBar = () => {
  const {user, auth} = useContext(MyContext)
  const [userInfo, ] = user;
  const [authState, authService] = auth;


  const login = async () => authService.login('/');
  const logout = async () => authService.logout('/');

  return (
      <div className={styles.app_header}>
          <Menu.Item as="a" header href="/" style={{color: "white"}}><Icon name="home" />Home</Menu.Item>
          <Menu.Item as="a" header href="/country" style={{color: "white"}}><Icon name="chart line" />Covid-19 Daily Stats by Country</Menu.Item>
          <Menu.Item as="a" header href="/province" style={{color: "white"}}><Icon name="chart bar" />Covid-19 Daily Stats by Province</Menu.Item>
          {authState.isAuthenticated && userInfo && (<Menu.Item as="a" href="/chat" style={{color: "white"}}><Icon name="rocketchat" />Chat</Menu.Item>)}
          {authState.isAuthenticated && userInfo && <Menu.Item position='right'>Welcome {userInfo.name}!</Menu.Item>}
          {authState.isAuthenticated && userInfo && <Menu.Item position='right' as="a" href="/profile" style={{color: "white"}}><Icon name="user outline" />Profile</Menu.Item>}
          {authState.isAuthenticated && userInfo && <Menu.Item position='right' as="a" onClick={logout} style={{color: "white"}}>Logout</Menu.Item>}
          {!authState.isPending && !authState.isAuthenticated && <Menu.Item position='right'>Welcome Visitor</Menu.Item>}
          {!authState.isPending && !authState.isAuthenticated && <Menu.Item position='right' as="a" onClick={login} style={{color: "white"}}>Login</Menu.Item>}      
      </div>
  );
};
export default HeaderBar;

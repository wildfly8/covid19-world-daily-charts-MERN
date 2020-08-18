import React from 'react';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';
import config from './config';
import Home from './Home';
import CustomLoginComponent from './components/Login';
import Country from './Country';
import Province from './Province';
import Chat from './Chat';
import Profile from './Profile';
import { MyContextProvider } from './MyContext';


const HasAccessToRouter = () => {
  const history = useHistory();

  const customAuthHandler = () => {
    // Redirect to the /login page that has a CustomLoginComponent
    history.push('/login');
  };

  return (
  <Security
      {...config.oidc}
      onAuthRequired={customAuthHandler}
  >
    <MyContextProvider>
      <Route path="/" exact component={Home} />
      <Route path="/country" component={Country} />
      <Route path="/province" component={Province} />
      <Route path="/implicit/callback" component={LoginCallback} />
      <Route path="/login" component={CustomLoginComponent} />
      <SecureRoute path="/chat" component={Chat} />
      <SecureRoute path="/profile" component={Profile} />
    </MyContextProvider>
  </Security>
  );
};

const App = () => {

  return (
    <Router>
      <HasAccessToRouter />
    </Router>
)};

export default App;

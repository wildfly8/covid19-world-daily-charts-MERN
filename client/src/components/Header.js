import React from 'react';
import { Container, Menu, Dropdown, Loader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Auth';
import UserProfile from './UserProfile';

export default () => {
  const auth = React.useContext(AuthContext);

  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header>COVID-19 Global Daily Stats by Country</Menu.Item>
        {/* {auth && auth.user && auth.user.name? (<Menu.Item><UserProfile /></Menu.Item>) : null} */}
      </Container>

      {auth.loading || !auth.user ? (
        <Menu.Item>
          {auth.loading ? (
            <Loader active inline />
          ) : (
            <Link to="/login">Sign In</Link>
          )}
        </Menu.Item>
      ) : (
      <div>
        <UserProfile />
        <Dropdown
          item
          simple
          text={
            auth.user.groups.includes('Admins')
              ? `${auth.user.name} (Admin)`
              : auth.user.name
          }
        >
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to="/logout">
              Sign out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      )}
    </Menu>
  );
};
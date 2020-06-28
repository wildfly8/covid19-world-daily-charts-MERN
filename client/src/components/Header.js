import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { AuthContext } from '../Auth';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default () => {
  const auth = React.useContext(AuthContext);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const classes = useStyles();

  return (
    <React.Fragment>
      <AppBar className={classes.root}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>COVID-19 Global Daily Stats by Country</Typography>
          {auth.loading || !auth.user ?
          (
            <Button color="inherit" component={Link} to="/login">Login</Button>
          ) : 
          (
            <React.Fragment>
            <Button className={classes.menuButton} color="inherit" variant="outlined" onClick={() => alert('User Profile: ' + (auth && auth.user? auth.user.name : ''))}>
                User Profile
              </Button>
              <Button color="inherit" onClick={(event) => setAnchorEl(event.currentTarget)}>
                {auth.user.groups.includes('Admins')? `${auth.user.name} (Admin)`: auth.user.name}
              </Button>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem component={Link} to="/logout">Logout</MenuItem>
              </Menu>
            </React.Fragment>
          )
          }
        </Toolbar>
      </AppBar>
      <Toolbar />
    </React.Fragment>
  );
};
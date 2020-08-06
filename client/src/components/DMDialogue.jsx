import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';


const DMDialog = ({allUsers, open, onClose}) => {

  const handleClose = () => {
    onClose(null);
  };

  const handleListItemClick = (user) => {
    onClose(user);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle id="chooseUser">Choose a User</DialogTitle>
      <List>
        {allUsers.map((user) => (
          <ListItem button onClick={() => handleListItemClick(user)} key={user}>
            <ListItemText primary={user} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

export default DMDialog;
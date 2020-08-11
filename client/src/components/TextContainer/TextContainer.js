import React, { useState } from 'react';
import onlineIcon from '../../icons/onlineIcon.png';
import closeIcon from '../../icons/closeIcon.png';
import './TextContainer.css';
import Button from '@material-ui/core/Button';
import DMDialogue from '../DMDialogue';
import { Icon } from 'semantic-ui-react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  button: {
    textTransform: "none"
  }
});

const TextContainer = ({ userInfo, allAppUsers, counterparties, selectedCounterparty, setSelectedCounterparty, handlePopupSelection }) => {

  const classes = useStyles();
  const [popupOpen, setPopupOpen] = useState(false);

  const handlePopupOpen = () => {
    setPopupOpen(true);
  };

  const handlePopupClose = (value) => {
    setPopupOpen(false);
    handlePopupSelection(value);
  };

  const handleCounterpartyClicked = (e) => {
    setSelectedCounterparty(e.target.textContent);
  }

  return (
    <div>
      <div>
        <h2>User Profile</h2>
      </div>
      <br />
      <div>
        <h3>Direct Messages
          <Button onClick={handlePopupOpen}>
            <Icon name="plus" />
          </Button>
        </h3>
        <div>
          <DMDialogue allUsers={allAppUsers.filter(u => userInfo && u !== userInfo.name)} open={popupOpen} onClose={handlePopupClose} />
          <h4>
            {counterparties.map((counterparty, i) => (
              <div key={i}>
                <img alt="Online Icon" src={counterparty.status? onlineIcon : closeIcon} style={{ marginRight: "5px" }} />
                <span style={counterparty.name === selectedCounterparty? { marginRight: "5px", backgroundColor: "orange" } : { marginRight: "5px" }} ><Button className={classes.button} onClick={handleCounterpartyClicked}>{counterparty.name}</Button></span>
              </div>
            ))}
          </h4>
        </div>
      </div>
    </div>
  )
};

export default TextContainer;
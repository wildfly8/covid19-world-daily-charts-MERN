import React, { useState, useEffect } from 'react';
import onlineIcon from '../../icons/onlineIcon.png';
import './TextContainer.css';
import Button from '@material-ui/core/Button';
import DMDialogue from '../DMDialogue';
import { Icon } from 'semantic-ui-react';
import { makeStyles } from '@material-ui/core';

//temp
const allUsers = ['Shin Xu', 'Test Account', 'Test2 Account', 'Lizzy', 'Test3 Account', 'lil grant'];

const useStyles = makeStyles({
  button: {
    textTransform: "none"
  }
});

const TextContainer = ({ userInfo, initCounterparties }) => {

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [counterparties, setCounterparties] = useState(initCounterparties);
  const [selectedCounterparty, setSelectedCounterparty] = useState(initCounterparties);

  useEffect(() => {
    if(initCounterparties && initCounterparties.length > 0) {
      setCounterparties(initCounterparties);
      setSelectedCounterparty(initCounterparties[0]);
    }
  }, [initCounterparties]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    if(value) {
      setCounterparties(prevCouterparties => {
        let temp;
        if (Array.isArray(value)) {
          temp = [...new Set([...prevCouterparties, ...value])]
        } else {
          temp = [...new Set([...prevCouterparties, value])]
          setSelectedCounterparty(value);
        }
        return temp
      });
    }
  };

  const handleCounterpartyClicked = (e) => {
    setSelectedCounterparty(e.target.textContent);
  };

  return (
    <div>
      <div>
        <h2>User Profile</h2>
      </div>
      <br />
      <div>
        <h3>Direct Messages
          <Button onClick={handleClickOpen}>
            <Icon name="plus" />
          </Button>
        </h3>
        <div>
          <DMDialogue allUsers={allUsers.filter(u => userInfo && u !== userInfo.name)} open={open} onClose={handleClose} />
          <h4>
            {counterparties.map((counterparty) => (
              <div key={counterparty}>
                <img alt="Online Icon" src={onlineIcon} style={{ marginRight: "5px" }} />
                <span style={counterparty === selectedCounterparty? { marginRight: "5px", backgroundColor: "orange" } : { marginRight: "5px" }} ><Button className={classes.button} onClick={handleCounterpartyClicked}>{counterparty}</Button></span>
              </div>
            ))}
          </h4>
        </div>
      </div>
    </div>
  )
};

export default TextContainer;
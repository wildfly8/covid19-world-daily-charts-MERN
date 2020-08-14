import React from 'react';
import onlineIcon from '../../icons/onlineIcon.png';
// import closeIcon from '../../icons/closeIcon.png';
import './InfoBar.css';

const InfoBar = ({ room }) => (
  <div className="infoBar">
    <img className="onlineIcon" src={onlineIcon} alt="online icon" />{room}
  </div>
);

export default InfoBar;
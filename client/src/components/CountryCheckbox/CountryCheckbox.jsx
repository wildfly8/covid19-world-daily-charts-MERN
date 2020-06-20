import React, {useState, useEffect} from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import blue from '@material-ui/core/colors/blue';

const styles = {
    root: {
      color: blue[600],
      '&$checked': {
        color: blue[500],
      },
    },
    checked: {},
  };

const CountryCheckbox = ({checkboxLabel, checked, handleCountryChange}) => {
    
    useEffect(() => {

    }, []);

    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={checked}
                    onChange={(e) => handleCountryChange(e.target.value)}
                />
            }
            label={checkboxLabel}
        />
    )
}

export default withStyles(styles)(CountryCheckbox);
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { blue } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  root: {
    color: blue[500],
    "&$checked": {
      color: blue[600]
    }
  },
  checked: {}
}));

const CountryCheckbox = ({checkboxLabel, checked, handleCountryChange}) => {

    const classes = useStyles();

    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={checked}
                    value={checkboxLabel}
                    onChange={(e) => handleCountryChange(e.target.checked, e.target.value)}
                    classes={{
                      root: classes.root,
                      checked: classes.checked
                    }}
                />
            }
            label={checkboxLabel}
        />
    );
}

export default CountryCheckbox;
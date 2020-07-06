import React from 'react';
import { Checkbox } from 'semantic-ui-react'


const CountryCheckbox = ({checkboxLabel, checked, handleCountryChange}) => {

    return (
            <Checkbox
                label={checkboxLabel}
                checked={checked}
                value={checkboxLabel}
                onChange={(e, data) => handleCountryChange(data.checked, data.value)}
            />           
          );
}

export default CountryCheckbox;
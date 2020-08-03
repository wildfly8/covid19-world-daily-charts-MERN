import React from 'react';
import { Checkbox } from 'semantic-ui-react'


const CountryCheckbox = ({checkboxLabel, checked, handleCountryChange}) => {

    return (
        <div>
            <br/>
            <Checkbox
                label={checkboxLabel}
                checked={checked}
                value={checkboxLabel}
                onChange={(e, data) => handleCountryChange(data.checked, data.value)}
            />
            <br/>
        </div>        
    );
}

export default CountryCheckbox;
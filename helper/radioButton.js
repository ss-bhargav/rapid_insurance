import * as React from 'react';
import Radio from '@mui/material/Radio';

export const RadioButton = ({ values, name, label, options, handler }) => {
  return (
    <>
      <div>
        <label className="mb-0" htmlFor={name}>
          <h6 className="mb-0">{label}</h6>
        </label>
      </div>
      {options.map((obj, index) => {
        return (
          <span key={obj.displayName}>
            <Radio color="primary" checked={obj.displayValue === values[name]} size="small" onChange={(e) => handler(e.target.value, name)} value={obj.displayValue} name={name} inputProps={{ 'aria-label': 'A' }} />
            <span className="h6" style={{ fontSize: '15px' }}>
              {obj.displayName}
            </span>
          </span>
        );
      })}
    </>
  );
};

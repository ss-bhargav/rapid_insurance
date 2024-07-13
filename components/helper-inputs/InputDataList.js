import { Field } from 'formik';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ErrorMsg from './ErrorMsg';

const InputDataList = ({ data, name, label, handler, required, val, helper }) => {
  const [value, setValue] = useState('');
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="col-12 col-md-6 col-lg-6 col-xl-4 mt-2">
      <div className="form-group col-12 p-0">
        <Autocomplete
          size="small"
          name={name}
          value={val}
          onChange={(event, newValue) => {
            setValue(newValue);
            handler(newValue, name);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          options={[...new Set(data.sort())]}
          renderInput={(params) => <TextField size="small" fullWidth color="primary" {...params} label={label} required={required ? required : null} error={helper ? Boolean(helper[name]) : false} helperText={helper ? helper[name] : ''} />}
        />
      </div>
    </div>
  );
};

export default InputDataList;

import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import { IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

export const BasicInput = ({ type, valued, name, label, handler, required, helper, disabled }) => {
  const [value, setValue] = React.useState(valued);

  const onChangehandler = (event) => {
    setValue(event.target.value);
    handler(event.target.value, event.target.name);
  };
  return (
    <div className="col-12 col-md-6 col-lg-6 col-xl-4 mt-2">
      <div className="form-group col-12 p-0">
        <TextField disabled={disabled ? disabled : null} size="small" id="outlined-basic" color="primary" variant="outlined" value={valued} fullWidth required={required ? required : null} name={name} label={label} type={type} onChange={onChangehandler} error={helper ? Boolean(helper[name]) : false} helperText={helper ? helper[name] : ''} />
      </div>
    </div>
  );
};

export const BasicBlockInput = ({ type, valued, name, label, handler, required, helper, disabled, classes }) => {
  const [value, setValue] = React.useState(valued);

  const onChangehandler = (event) => {
    setValue(event.target.value);
    handler(event.target.value, event.target.name);
  };
  return (
    <div className={`${classes} mt-2`}>
      <div className="form-group col-12 p-0">
        <TextField disabled={disabled ? disabled : null} size="small" id="outlined-basic" color="primary" variant="outlined" value={valued} fullWidth required={required ? required : null} name={name} label={label} type={type} onChange={onChangehandler} error={helper ? Boolean(helper[name]) : false} helperText={helper ? helper[name] : ''} />
      </div>
    </div>
  );
};

export const SearchBar = ({ handler, cancelHandler }) => {
  const [value, setValue] = React.useState('');

  const onChangehandler = (event) => {
    setValue(event.target.value);
    handler(event.target.value, event.target.name);
  };

  const clearInput = () => {
    setValue('');
    cancelHandler();
  };

  return (
    <FormControl sx={{ m: 1, width: '40ch' }} variant="outlined">
      <InputLabel htmlFor="outlined-adornment-search">Search</InputLabel>
      <OutlinedInput
        id="outlined-adornment-search"
        type="text"
        size="small"
        value={value}
        onChange={onChangehandler}
        startAdornment={
          <InputAdornment position="start">
            <SearchOutlinedIcon />
          </InputAdornment>
        }
        endAdornment={
          value ? (
            <InputAdornment position="end">
              <IconButton aria-label="toggle password visibility" edge="end" onClick={clearInput}>
                <ClearOutlinedIcon />
              </IconButton>
            </InputAdornment>
          ) : null
        }
        label="Search"
        placeholder="Search"
      />
    </FormControl>
  );
};

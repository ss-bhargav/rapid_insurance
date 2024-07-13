import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import { MenuItem } from '@mui/material';

export default function BasicSelect({ name, label, options, children, required, handler, val, helper }) {
  const [value, setValue] = React.useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
    handler(event.target.value, event.target.name);
  };
  return (
    <div className="col-12 col-md-6 col-lg-6 col-xl-4 mt-2">
      <div className="form-group col-12 p-0">
        <FormControl size="small" fullWidth color="primary" required={required ? required : null} error={helper ? helper[name] : null}>
          <InputLabel id="demo-simple-select-label">{label}</InputLabel>
          <Select value={val} name={name} labelId="demo-simple-select-label" id={name} label={label} onChange={handleChange}>
            {children}
          </Select>
          {helper && helper[name] ? <FormHelperText error={helper[name]}>{helper[name]}</FormHelperText> : null}
        </FormControl>
      </div>
    </div>
  );
}

export function BasicBlockSelect({ name, label, children, required, handler, val, helper }) {
  const [value, setValue] = React.useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
    handler(event.target.value, event.target.name);
  };
  return (
    <div className="col-12 mt-2 p-0">
      <div className="form-group col-12 p-0">
        <FormControl size="small" fullWidth color="primary" required={required ? required : null} error={helper ? helper[name] : null}>
          <InputLabel id="demo-simple-select-label">{label}</InputLabel>
          <Select value={val} name={name} labelId="demo-simple-select-label" id={name} label={label} onChange={handleChange}>
            {children}
          </Select>
          {helper && helper[name] ? <FormHelperText error={helper[name]}>{helper[name]}</FormHelperText> : null}
        </FormControl>
      </div>
    </div>
  );
}

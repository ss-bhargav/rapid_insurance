import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import 'date-fns';

export const InputDatePicker = ({ label, name, maxDate, minDate, options, required, handler, format, val, helper }) => {
  const [value, setValue] = useState(maxDate);

  return (
    <div className="col-12 col-md-6 col-lg-6 col-xl-4 mt-2">
      <div className="form-group col-12 p-0">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            name={name}
            openTo="year"
            format={format ? 'dd/MM/yyyy' : false}
            views={options}
            label={label}
            value={val}
            minDate={minDate}
            maxDate={maxDate}
            onChange={(newValue) => {
              setValue(newValue);
              handler(newValue, name);
            }}
            renderInput={(params) => <TextField size="small" fullWidth color="primary" required={required ? required : null} {...params} error={helper ? Boolean(helper[name]) : false} helperText={helper ? helper[name] : ''} />}
          />
        </LocalizationProvider>
      </div>
    </div>
  );
};

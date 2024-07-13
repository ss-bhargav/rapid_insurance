import React, { useState, Fragment } from 'react';
import { Field, ErrorMessage } from 'formik';
import DatePicker from 'react-datepicker';
import { AiFillStar } from 'react-icons/ai';
import 'react-datepicker/dist/react-datepicker.css';
import { addMonths, format } from 'date-fns';
import MonthYear from 'helper/dateYear';

export const ReactDateFieldMonthYear = (props) => {
  const { name, label, required, handler, minDate, value, disabled, maxDate } = props;
  const [startDate, setStartDate] = useState();
  // console.log('mi', minDate, 'max', maxDate);
  return (
    <div className="form-group col-12 col-md-6 col-lg-6 col-xl-4">
      <label htmlFor={name} className="h6">
        {label}{' '}
        {required ? (
          <sup>
            <AiFillStar style={{ color: 'red', width: '8px' }} />
          </sup>
        ) : null}
      </label>
      <div>
        <Field className="form-control" name={name}>
          {({ field, form, meta }) => {
            let registartionValue = form.values.c_manufacture_year_month === null ? '' : form.values.c_manufacture_year_month;
            let month = form.values.c_manufacture_year_month === null ? '' : parseInt(registartionValue.slice(0, 2)) - 1;

            let year = form.values.c_manufacture_year_month === null ? '' : registartionValue.slice(2).slice(0, 1) === '/' ? registartionValue.slice(3) : registartionValue.slice(2);
            let manufacturedDate = form.values.c_manufacture_year_month === null ? '' : new Date(year, month, 1);
            let selectedDate = form.values.c_manufacture_year_month === null ? '' : manufacturedDate;
            if (startDate) {
              form.values[name] = format(new Date(startDate), 'yyyy/MM/dd');
              selectedDate = startDate;
            }

            return (
              <div>
                <DatePicker
                  // className="form-control  cursor-pointer"
                  className={form.touched[name] && form.errors[name] ? 'form-control is-invalid cursor-pointer' : 'form-control cursor-pointer'}
                  minDate={minDate}
                  maxDate={maxDate}
                  selected={selectedDate}
                  placeholderText="MM/YYYY"
                  onChange={(date) => {
                    setStartDate(date);
                    form.setFieldError(name, '');
                  }}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  showFullMonthYearPicker
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                />
              </div>
            );
          }}
        </Field>
        <ErrorMessage
          name={name}
          render={(message) => (
            <p style={{ fontSize: '14px', marginTop: '5px' }} className="text-danger text-center h6">
              {message}
            </p>
          )}
        />
      </div>
    </div>
  );
};

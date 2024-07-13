import React, { useState, Fragment } from 'react';
import { useFormik, Formik, Form, Field, ErrorMessage } from 'formik';
import DatePicker from 'react-datepicker';
import { AiFillStar } from 'react-icons/ai';
import MonthYear from 'helper/dateYear';
import 'react-datepicker/dist/react-datepicker.css';
import { addMonths, format } from 'date-fns';

export const ReactDateField3 = (props) => {
  const { name, label, required, handler, value, disabled, maxDate, minDate, handleManufacturingDate, startYear } = props;
  const [startDate, setStartDate] = useState();

  function getYears(startYear) {
    let currentYear = new Date().getFullYear() + 1;
    let years = [];
    startYear = startYear || 2000;
    while (startYear < currentYear) {
      years.push(startYear++);
    }
    return years;
  }

  const years = [...getYears(startYear)];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return (
    <div className="form-group col-12 col-md-6 col-xl-4">
      {/* <div className="p-1"> */}
      <label htmlFor={name} className="h6 ">
        {label}{' '}
        {required ? (
          <sup>
            {' '}
            <AiFillStar style={{ color: 'red', width: '8px' }} />
          </sup>
        ) : null}
      </label>
      {/* </div> */}
      <div>
        <Field className="form-control" name={name}>
          {({ field, form, meta }) => {
            // console.log(form);
            let selectedDate = form.values[name] === null ? '' : new Date(form.values[name]);
            if (startDate) {
              form.values[name] = format(new Date(startDate), 'yyyy/MM/dd');
              selectedDate = startDate;
            }

            return (
              <div>
                <DatePicker
                  // className="form-control  cursor-pointer"
                  className={form.touched[name] && form.errors[name] ? 'form-control is-invalid cursor-pointer' : 'form-control cursor-pointer'}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date(minDate)}
                  maxDate={maxDate}
                  placeholderText="DD/MM/YYYY"
                  selected={selectedDate}
                  onChange={(date) => {
                    form.setFieldError(name, '');
                    setStartDate(date);
                    handleManufacturingDate ? handleManufacturingDate(date) : null;
                  }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                    <div
                      style={{
                        margin: 10,
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          decreaseMonth();
                        }}
                      >
                        {'<'}
                      </button>
                      <select value={date.getFullYear()} onChange={({ target: { value } }) => changeYear(value)}>
                        {years.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>

                      <select value={months[date.getMonth()]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}>
                        {months.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          increaseMonth();
                        }}
                      >
                        {'>'}
                      </button>
                    </div>
                  )}
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

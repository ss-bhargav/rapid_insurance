import React, { useState } from 'react';
import { Field, ErrorMessage } from 'formik';
import { AiFillStar } from 'react-icons/ai';

export const InputDataList = (props) => {
  const { name, label, required, handler, options, children, valueKey, displayKey, displayKey2, listName, optionHanlder, showInitial, dependentKey, keyDownHandler } = props;

  return (
    <div className="form-group col-12 col-md-6 col-xl-3 m-2">
      <div className="p-1">
        <label htmlFor={name} className="h6">
          {label && label}{' '}
          {required ? (
            <sup>
              <AiFillStar style={{ color: 'red', width: '8px' }} />
            </sup>
          ) : null}
        </label>
      </div>
      <div>
        <Field className="form-control" name={name}>
          {({ field, form, meta }) => {
            // console.log('form', form);
            let value, optionsArray, filteredValue;
            if (dependentKey) {
              if (form.values[dependentKey] && form.values[dependentKey].length > 1) {
                value = form.values[name];
                optionsArray = options;
              } else {
                value = '';
                form.values[name] = '';
                optionsArray = [];
              }
            } else {
              value = form.values[name];
              optionsArray = options;
            }

            optionsArray.map((option) => {
              if (option[displayKey] === value) {
                filteredValue = option;
              }
            });

            if (displayKey === 'c_rto_location') {
              let registartionValue = value && value.split(' ')[1];
              optionsArray.map((option) => {
                if (option[displayKey2] === registartionValue) {
                  filteredValue = option;
                }
              });
            }

            const onBlurFunction = () => {
              if (form.values[name] && form.values[name].length > 1 && !filteredValue) {
                // value = '';
                // form.values[name] = '';
                form.setFieldError(name, 'Please select from the list');
                // alert('Please select from the list');
              }
            };
            return (
              <div>
                <input
                  type="text"
                  list={listName ? listName : 'default_data'}
                  id={name}
                  {...field}
                  // value={value}
                  onChange={(e) => {
                    form.handleChange(e);
                    handler && handler(e.target.value);
                  }}
                  className={form.touched[name] && form.errors[name] ? 'form-control is-invalid' : 'form-control'}
                  onKeyUp={(e) => e.target.value.length > 0 && optionHanlder(e.target.value, displayKey, displayKey2)}
                  onBlur={onBlurFunction}
                />
                {((form.values[name] && form.values[name].length > 0) || showInitial) && (
                  <datalist id={listName ? listName : 'default_data'}>
                    {optionsArray?.length &&
                      optionsArray?.map((value, index) => {
                        return (
                          <option key={index}>
                            {displayKey && value[displayKey]} {displayKey2 && value[displayKey2]}
                          </option>
                        );
                      })}
                  </datalist>
                )}
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

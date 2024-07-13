import React, { useState } from 'react';
import { Field, ErrorMessage } from 'formik';
import { AiFillStar } from 'react-icons/ai';

export const InputDataList = (props) => {
  const { name, label, required, handler, options, children, valueKey, displayKey, displayKey2, listName, optionHanlder, showInitial, dependentKey } = props;

  return (
    <div className="form-group col-12 col-md-6 col-xl-3 m-2">
      <div className="p-1">
        <label htmlFor={name} className="h6">
          {label && label} {required ? <AiFillStar style={{ color: 'red', width: '8px' }} /> : null}
        </label>
      </div>
      <div>
        <Field className="form-control" name={name}>
          {({ field, form, meta }) => {
            let value, optionsArray;
            if (dependentKey) {
              if (form.values[dependentKey] && form.values[dependentKey].length > 0) {
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

            return (
              <div>
                <input
                  type="text"
                  list={listName ? listName : 'default_data'}
                  id={name}
                  {...field}
                  value={value}
                  onChange={(e) => {
                    form.handleChange(e);
                    handler && handler(e.target.value);
                  }}
                  className="form-control"
                  onKeyUp={(e) => e.target.value.length > 0 && optionHanlder(e.target.value, displayKey, displayKey2)}
                />
                {((form.values[name] && form.values[name].length > 0) || showInitial) && (
                  <datalist id={listName ? listName : 'default_data'}>
                    {optionsArray?.length &&
                      optionsArray?.map((value, index) => {
                        return (
                          <option
                            key={index}
                            // className="text-uppercase"
                            // data-value={value}
                            // value={valueKey && value[valueKey]}
                          >
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
        <ErrorMessage name={name} render={(message) => <p className="text-danger text-center">{message}</p>} />
      </div>
    </div>
  );
};

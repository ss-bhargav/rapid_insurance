import React, { useState } from 'react';
import { Field, ErrorMessage } from 'formik';
import { AiFillStar } from 'react-icons/ai';

export const OptionsSelect = (props) => {
  const { name, label, required, children, handler, options, valueKey, displayKey, displayKey2, optionHanlder } = props;
  return (
    <div className=" form-group col-12 col-md-6 col-lg-6 col-xl-4">
      {/* <div> */}
      <label htmlFor={name} className="h6">
        {label}{' '}
        {required ? (
          <sup>
            <AiFillStar style={{ color: 'red', width: '8px' }} />
          </sup>
        ) : null}
      </label>
      {/* </div> */}
      <div>
        <Field as="select" name={name}>
          {({ field, form, meta }) => {
            return (
              <div>
                <select
                  type="text"
                  id={name}
                  {...field}
                  onChange={(e) => {
                    form.handleChange(e);
                    handler && handler(e.target.value);
                    e.target.value.length > 0 && optionHanlder(e.target.value, displayKey, displayKey2, valueKey, name);
                  }}
                  className={form.touched[name] && form.errors[name] ? 'form-control is-invalid' : 'form-control'}
                >
                  {Array.isArray(options) ? (
                    <>
                      <option value="">Select</option>
                      {options?.map((value, index) => {
                        return (
                          <option key={index} className="text-uppercase" value={valueKey ? value[valueKey] : value}>
                            {displayKey ? value[displayKey] : value} {displayKey2 && value[displayKey2]}
                          </option>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      <option>{options}</option>
                    </>
                  )}
                </select>
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

export const Select = (props) => {
  const { name, label, required, children, handler } = props;

  return (
    <div className=" form-group col-12 col-md-6 col-lg-6 col-xl-4">
      <label htmlFor={name} className="h6">
        {label}{' '}
        {required ? (
          <sup>
            <AiFillStar style={{ color: 'red', width: '8px' }} />{' '}
          </sup>
        ) : null}
      </label>
      <div>
        <Field as="select" name={name}>
          {({ field, form, meta }) => {
            return (
              <div>
                <select
                  type="text"
                  id={name}
                  {...field}
                  onChange={(e) => {
                    form.handleChange(e);
                    handler && handler(e.target.value, name);
                  }}
                  className={form.touched[name] && form.errors[name] ? 'is-invalid form-control' : 'form-control'}
                >
                  {children}
                </select>
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

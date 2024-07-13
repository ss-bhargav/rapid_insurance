import React, { useState } from 'react';
import { Field, ErrorMessage } from 'formik';
import classNames from 'classnames';
import { AiFillStar } from 'react-icons/ai';

export const Input = (props) => {
  const { name, label, required, handler, value, readOnly, icon: Icon, ...inputProps } = props;

  return (
    <div className="form-group col-12 col-md-6 col-lg-3 m-2">
      <div className="p-1">
        <label htmlFor={name} className="h6">
          {label}{' '}
          {required ? (
            <sup>
              <AiFillStar style={{ color: 'red', width: '8px' }} />
            </sup>
          ) : null}
        </label>{' '}
      </div>
      <div>
        <Field className="form-control" name={name}>
          {({ field, form, meta }) => {
            return (
              <div className="d-flex justify-content-center">
                {Icon && <Icon />}
                {value ? (
                  <input
                    type="text"
                    id={name}
                    {...field}
                    readOnly={readOnly}
                    value={value && value}
                    onChange={(e) => {
                      form.handleChange(e);
                      handler && handler(e.target.value);
                    }}
                    // className="form-control"
                    className={form.touched[name] && form.errors[name] ? 'form-control is-invalid' : 'form-control'}
                    {...inputProps}
                  />
                ) : (
                  <input
                    type="text"
                    id={name}
                    {...field}
                    readOnly={readOnly}
                    value={form.values[name] ? form.values[name] : ''}
                    onChange={(e) => {
                      form.handleChange(e);
                      handler && handler(e.target.value);
                    }}
                    // className="form-control"
                    className={form.touched[name] && form.errors[name] ? 'form-control is-invalid' : 'form-control'}
                    {...inputProps}
                  />
                )}
              </div>
            );
          }}
        </Field>
        <ErrorMessage
          name={name}
          render={(message) => (
            <p style={{ fontSize: '16px', marginTop: '5px' }} className="text-danger text-center h6">
              {message}
            </p>
          )}
        />
      </div>
    </div>
  );
};

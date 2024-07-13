import { Field } from 'formik';
import React from 'react';
import ErrorMsg from './ErrorMsg';
import { AiFillStar } from 'react-icons/ai';

export const Input = (props) => {
  const { name, label, handler, required } = props;
  return (
    <div className="form-group col-12 col-md-6 col-xl-4">
      <div className="p-1">
        <label htmlFor={name} className="h6">
          {label}{' '}
          {required ? (
            <sup>
              {' '}
              <AiFillStar style={{ color: 'red', width: '8px' }} />
            </sup>
          ) : null}
        </label>
      </div>
      <Field className="form-control" name={name}>
        {({ field, form, meta }) => {
          return (
            <div>
              <input
                type="text"
                placeholder={label}
                id={name}
                {...field}
                className={form.errors[name] && form.touched[name] ? 'form-control is-invalid' : 'form-control'}
                onChange={(e) => {
                  form.handleChange(e);
                  handler && handler(e.target.value);
                }}
              />
            </div>
          );
        }}
      </Field>
      <ErrorMsg name={name} />
    </div>
  );
};

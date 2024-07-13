import React, { useState, Fragment } from 'react';
import { useFormik, Formik, Form, Field, ErrorMessage } from 'formik';
import DatePicker from 'react-datepicker';
import { AiFillStar } from 'react-icons/ai';
import MonthYear from './dateYear';
import 'react-datepicker/dist/react-datepicker.css';
import { addMonths, format } from 'date-fns';
import classNames from 'classnames';

export const DefaultInput = (props) => {
  const { name, label, required } = props;
  return (
    <div className="form-group flex-grow col-12 col-md-6 col-xl-4">
      <div className="p-1">
        <label htmlFor={name} className="h6">
          {label} {required ? <AiFillStar style={{ color: 'red', width: '8px' }} /> : null}
        </label>
      </div>
      <div>
        <Field className="form-control text-uppercase" id={name} name={name} readOnly />
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

export const DefaultSelect = (props) => {
  const { name, label, required, children } = props;

  return (
    <div className=" form-group col-12 col-md-6 col-xl-3 ">
      <div className="p-1">
        <label htmlFor={name} className="h6">
          {label} {required ? <AiFillStar style={{ color: 'red', width: '8px' }} /> : null}
        </label>
      </div>
      <div>
        <Field as="select" className="form-control w-100" name={name} id={name} readOnly></Field>
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

export const PermanentInput = (props) => {
  const { name, label, required, present, present_name } = props;

  return (
    <div className="form-group col-12 col-md-6 col-xl-3">
      <div className="p-1">
        <label htmlFor={name} className="h6">
          {label} {required ? <AiFillStar style={{ color: 'red', width: '8px' }} /> : null}
        </label>
      </div>
      <div>
        <Field className="form-control" name={name}>
          {({ field, form, meta }) => {
            if (present) {
              meta.touched = true;
              meta.initialTouched = true;
              meta.error = undefined;
              form.touched[name] = true;
            }
            return <div>{present ? <input {...field} type="text" id={name} className="form-control" value={form.values[present_name]} /> : <input {...field} type="text" id={name} className="form-control" />}</div>;
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

export const GiveInput = (props) => {
  const { name, label, required, value } = props;

  return (
    <div className="form-group col-12 col-md-6 col-xl-3">
      <div className="p-1">
        <label htmlFor={name} className="h6">
          {label} {required ? <AiFillStar style={{ color: 'red', width: '8px' }} /> : null}
        </label>
      </div>
      <div>
        <Field className="form-control" name={name}>
          {({ field, form }) => {
            if (value) {
              form.values[name] = value.toString();
            }
            return <input type="text" id={name} className="form-control" readOnly value={value} />;
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

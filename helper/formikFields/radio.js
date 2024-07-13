import React, { useState } from 'react';
import { Field, ErrorMessage } from 'formik';
import { AiFillStar } from 'react-icons/ai';
import classNames from 'classnames';

export const RadioSet = (props) => {
  const { name, label, required, options, handler, value, readOnly, icon: Icon, defaultInput, ...inputProps } = props;
  // console.log(defaultInput);
  const [selectedValue, setSelectedValue] = useState(defaultInput);

  return (
    <div className="d-flex flex-column justify-content-center ">
      <div className="p-1">
        <label htmlFor={name} className="h6 ml-3" style={{ marginLeft: '9px' }}>
          {label && label}{' '}
          {required ? (
            <sup>
              <AiFillStar style={{ color: 'red', width: '8px' }} />
            </sup>
          ) : null}
        </label>
      </div>
      <div className="d-flex flex-wrap col-12 mt-1" role="group" aria-labelledby="my-radio-group">
        {options.length > 0 &&
          options.map((value, i) => {
            let highlighted;
            if (value.inputValue.toString().toLowerCase() === selectedValue.toString().toLowerCase()) {
              highlighted = 'bg-primary text-white';
            }

            return (
              <div key={i} className="form-check form-check-inline col-12 col-md-6 col-xl-3 p-0 mx-2 text-center">
                <div className={classNames('p-1 rounded', highlighted && highlighted.length > 0 ? highlighted : ' bg-white border mb-2')}>
                  <label role="button" htmlFor={value.uniqueName} className="h6 form-check-label">
                    {value.displayValue} {required ? <AiFillStar style={{ color: 'red', width: '8px' }} /> : null}
                  </label>
                </div>
                <div>
                  <Field className="form-control" name={name}>
                    {({ field, form, meta }) => {
                      return (
                        <div className="d-flex justify-content-center">
                          {Icon && <Icon />}
                          <input
                            type="radio"
                            id={value.uniqueName}
                            {...field}
                            readOnly={readOnly}
                            value={value.inputValue}
                            onClick={(e) => {
                              form.handleChange(e);
                              if (handler) {
                                handler(e.target.value, name);
                              }
                              setSelectedValue(e.target.value);
                            }}
                            className="form-check-input visually-hidden"
                            {...inputProps}
                          />
                        </div>
                      );
                    }}
                  </Field>
                </div>
              </div>
            );
          })}
      </div>
      <div>
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

export const Radio = (props) => {
  const { name, label, options } = props;
  return (
    <div>
      <Field>
        {({ field, form, meta }) => {
          return (
            <>
              {options.map((element, index) => {
                return (
                  <>
                    <input type="radio" name={element.name} autocomplete="off" />
                    <label class="btn btn-outline-primary" for="btn-check-outlined">
                      {element.label}
                    </label>
                  </>
                );
              })}
            </>
          );
        }}
      </Field>
      <div>
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

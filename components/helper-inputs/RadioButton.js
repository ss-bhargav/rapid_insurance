import React from 'react';
import { Field } from 'formik';
import styles from './fields.module.scss';

export const RadioBtns = (props) => {
  const { name, label, handler, options, values } = props;
  const active = {
    backgroundColor: '#1B75BA',
    color: '#fff',
    padding: '6px 12px',
  };
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ paddingLeft: '15px' }}>
        <label htmlFor={name} className="mb-0">
          {label}
        </label>
      </div>
      <div className="col-12 col-lg-12 d-flex flex-wrap p-0">
        {options.map((element, index) => {
          return (
            <div key={index} className="col-12 col-md-6 col-lg-6 col-xl-4" style={{ padding: '10px 15px 0px 15px' }}>
              <div
                className={`${styles.container_block} form-control col-12 col-lg-12`}
                style={element.displayValue === values[name] ? active : null}
                onClick={() => {
                  handler(element.displayValue, name);
                }}
              >
                <div>{element.displayName}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

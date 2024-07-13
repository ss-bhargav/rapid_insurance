import React from 'react';
import { ErrorMessage } from 'formik';

const ErrorMsg = (props) => {
  const { name } = props;
  return (
    <>
      <ErrorMessage
        name={name}
        render={(message) => (
          <p style={{ fontSize: '14px' }} className="text-danger text-center h6">
            {message}
          </p>
        )}
      />
    </>
  );
};

export default ErrorMsg;

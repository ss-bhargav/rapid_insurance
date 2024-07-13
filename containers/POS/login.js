import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import { DialogContent } from '@mui/material';
import { ImCross } from 'react-icons/im';
import { BasicBlockInput } from 'components/helper-inputs/BasicInput';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PosValidateLogin } from 'helper/api';
import { PosLoginInitialValues } from 'helper/formik-initial-values';
import { PosLoginValidation } from 'helper/formik-validations';
import FullScreenLoading from 'components/Dailog/FullScreenLoading';
import AlertDialog from 'components/Dailog/SampleDailog';

const PosLoginForm = ({ formHandler, redirectToSignUp }) => {
  const initialValues = PosLoginInitialValues();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resData, setResData] = useState({});
  const [active, setActive] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [loginFields, setLoginFields] = useState({ ...initialValues });

  useEffect(() => {
    if (isSubmitted) {
      setErrors(validate(loginFields));
    }
  }, [loginFields, isSubmitted]);

  const validate = (values) => {
    setIsSubmitted(true);
    return PosLoginValidation(values);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log('clicked');
    setIsSubmitted(true);
    const result = validate(loginFields);
    if (Object.values(result).every((key, index) => key === '')) {
      setIsLoading(true);
      const { status, message } = await PosValidateLogin(loginFields);
      console.log(status, message);
      if (status === 200) {
        // setStatus(status);
        router.push('/pos');
        setIsLoading(false);
        setIsSubmitted(false);
      } else {
        setResData(message);
        setIsLoading(false);
        setActive(true);
        setSignUpFields(signUpFields);
      }
    }
  };

  const closeAlertHandler = () => {
    setActive(false);
  };

  const navigateToSignUp = () => {
    redirectToSignUp();
  };

  const onChangeHandler = (value, name) => {
    setLoginFields({
      ...loginFields,
      [name]: value,
    });
  };

  return (
    <>
      {isloading && <FullScreenLoading />}
      <Dialog open={true} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent style={{ width: '400px' }}>
          <div>
            <div className="d-flex justify-content-between" role="button">
              <h4>Login For POS</h4>
              <div>
                <ImCross title="close" size="0.9em" onClick={formHandler} />
              </div>
            </div>
            <hr className="my-2" />
            <form method="post" onSubmit={onSubmitHandler}>
              <div className="row">
                <BasicBlockInput classes="col-12" type="text" label="Username" name="username" handler={onChangeHandler} helper={errors} />
                <BasicBlockInput classes="col-12" type="password" label="Password" name="password" handler={onChangeHandler} helper={errors} />
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-primary btn-block">
                  Login
                </button>
                <h6 className="text-primary my-3">
                  <Link href="/">
                    <a>Forgotten Password?</a>
                  </Link>
                </h6>
              </div>
              <hr className="my-2" />
              <div className="text-center">
                <button type="button" className="btn btn-success" onClick={navigateToSignUp}>
                  Create New POS Account
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
      {/* {active && <AlertDialog data={resData} handleClose={closeAlertHandler} />} */}
    </>
  );
};

export default PosLoginForm;

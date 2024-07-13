import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import { Button, DialogContent, Input } from '@mui/material';
import { ImCross } from 'react-icons/im';
import { BasicBlockInput } from 'components/helper-inputs/BasicInput';
import { styled } from '@mui/material/styles';
import { FaFileUpload } from 'react-icons/fa';
import { PosSignupInitialValues } from 'helper/formik-initial-values';
import { PosSignUpValidation } from 'helper/formik-validations';
import { PosSubmitDetails } from 'helper/api';
import FullScreenLoading from 'components/Dailog/FullScreenLoading';
import AlertDialog from 'components/Dailog/AlertDialog';

const PosSignUpForm = ({ formHandler, redirectToLogin }) => {
  const initialValues = PosSignupInitialValues();
  const [open, setOpen] = useState(false);
  const [signUpFields, setSignUpFields] = useState({ ...initialValues });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [files, setFiles] = useState({});
  const [resData, setResData] = useState({});
  const [active, setActive] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [isStatus, setStatus] = useState(0);

  useEffect(() => {
    if (isSubmitted) {
      setErrors(validate(signUpFields));
    }
  }, [signUpFields, isSubmitted]);

  const Input = styled('input')({
    display: 'none',
  });

  const onChangeSignUpFields = (value, name) => {
    setSignUpFields({
      ...signUpFields,
      [name]: value,
    });
  };

  const validate = (values) => {
    setIsSubmitted(true);
    return PosSignUpValidation(values);
  };

  const navigateToLogin = () => {
    redirectToLogin();
  };

  // const uploadFile = (e) => {
  //   var uploadObj = {};
  //   console.log('e', e);
  //   const { name } = e.target;
  //   const selected = e.target.files[0].size;

  //   if (selected >= 100000) {
  //     window.alert(`${name} File too big max 100KB`);
  //     e.target.value = null;
  //     return;
  //   }

  //   let file = e.target.files[0];
  //   console.log('f', file, uploadObj[name]);
  //   uploadObj[name] = e.target.files[0];
  //   const reader = new FileReader();
  //   reader.readAsBinaryString(file);
  //   reader.onload = (e) => {
  //     setFiles((preValue) => ({
  //       ...preValue,
  //       [name]: window.btoa(e.target.result),
  //     }));
  //   };
  //   console.log('obj', uploadObj);
  // };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const result = validate(signUpFields);
    if (Object.values(result).every((key, index) => key === '')) {
      setIsLoading(true);
      const { status, message } = await PosSubmitDetails(signUpFields);
      if (status === 200) {
        setStatus(status);
        setResData(message);
        setIsLoading(false);
        setIsSubmitted(false);
        setActive(true);
      } else {
        setResData(message);
        setIsLoading(false);
        setActive(true);
        setSignUpFields(signUpFields);
      }
    }
  };

  const closeAlertHandler = () => {
    isStatus === 200 ? navigateToLogin() : null;
    setActive(false);
  };

  return (
    <>
      {isloading && <FullScreenLoading />}
      <Dialog open={true} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent>
          <>
            <div className="d-flex justify-content-between" role="button">
              <h4>Sign Up</h4>
              <div>
                <ImCross title="close" size="0.9em" onClick={formHandler} />
              </div>
            </div>
            <hr className="my-2" />
            <form method="post" onSubmit={onSubmitHandler}>
              <h6>Personal Details</h6>
              <div className="row">
                <BasicBlockInput valued={signUpFields.first_name} classes="col-12 col-md-6" type="text" label="Full Name" name="first_name" handler={onChangeSignUpFields} helper={errors} />
                <BasicBlockInput classes="col-12 col-md-6" type="text" label="Surname" name="last_name" handler={onChangeSignUpFields} helper={errors} />
                <BasicBlockInput classes="col-12 col-md-6" type="number" label="Mobile Number" name="mobile_number" handler={onChangeSignUpFields} helper={errors} />
                <BasicBlockInput classes="col-12 col-md-6" type="email" label="Email" name="email" handler={onChangeSignUpFields} helper={errors} />
                <BasicBlockInput classes="col-12 col-md-6" type="number" label="Aadhar Number" name="aadhar_number" handler={onChangeSignUpFields} helper={errors} />
                <BasicBlockInput classes="col-12 col-md-6" type="text" label="Pan Number" name="pan_number" handler={onChangeSignUpFields} helper={errors} />
              </div>
              <h6>Bank Details</h6>
              <div className="row">
                <BasicBlockInput classes="col-12 col-md-6" type="text" label="Bank Name" name="bank_name" handler={onChangeSignUpFields} helper={errors} />
                <BasicBlockInput classes="col-12 col-md-6" type="number" label="Account Number" name="account_number" handler={onChangeSignUpFields} helper={errors} />
                <BasicBlockInput classes="col-12 col-md-6" type="text" label="Bank Branch Name" name="bank_branch_name" handler={onChangeSignUpFields} helper={errors} />
                <BasicBlockInput classes="col-12 col-md-6" type="text" label="IFSC Code" name="ifsc_code" handler={onChangeSignUpFields} helper={errors} />
              </div>
              {/* <h6>Upload Files</h6>
              <div className="row">
                <div className="px-1 ml-2">
                  <label htmlFor="contained-button-file">
                    <Input accept="image/*" id="contained-button-file" type="file" name="aadhar_card" onChange={uploadFile} />
                    <Button variant="contained" component="span" endIcon={<FaFileUpload size="0.8em" />}>
                      Upload Aadhar
                    </Button>
                  </label>
                </div>
                <div className="px-1">
                  <label htmlFor="contained-button-file">
                    <Input accept="image/*" id="contained-button-file" type="file" onChange={uploadFile} />
                    <Button variant="outlined" component="span" endIcon={<FaFileUpload size="0.8em" />}>
                      Upload Pancard
                    </Button>
                  </label>
                </div>
                <div className="px-1">
                  <label htmlFor="contained-button-file">
                    <Input accept="image/*" id="contained-button-file" type="file" onChange={uploadFile} />
                    <Button variant="outlined" component="span" endIcon={<FaFileUpload size="0.8em" />}>
                      Upload Photo
                    </Button>
                  </label>
                </div>
                <div className="px-1 ml-2">
                  <label htmlFor="contained-button-file">
                    <Input accept="image/*" id="contained-button-file" type="file" onChange={uploadFile} />
                    <Button variant="outlined" component="span" endIcon={<FaFileUpload size="0.8em" />}>
                      Bank Statement or Cancel cheque
                    </Button>
                  </label>
                </div>
              </div> */}
              <div className="text-center mt-2">
                <button type="submit" className="btn btn-primary">
                  CREATE ACCOUNT
                </button>
              </div>
            </form>
          </>
        </DialogContent>
      </Dialog>
      {active && <AlertDialog data={resData} handleClose={closeAlertHandler} />}
    </>
  );
};

export default PosSignUpForm;

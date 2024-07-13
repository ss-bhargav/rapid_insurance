import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import styles from './Dailog.module.scss';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { GetOtp, VerifyOtp } from 'helper/api';

export default function VerifyOtpComponent({ closeHandler, phone, handler }) {
  const [expireTime, setExpireTime] = useState(30);

  const otpFields = {
    number1: '',
    number2: '',
    number3: '',
    number4: '',
  };

  const [otpNumber, setOtpNumber] = useState(otpFields);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mobile = phone.toString();
  const closeDailogHanlder = () => {
    let verify = confirm('Are you sure?. The changes will not be saved');
    if (verify) {
      handler;
      handler('close');
    }
  };

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        document.querySelector("input[name='number1']").focus();
      }, 500);
    }
  }, []);
  
  function resetTimer() {
    setExpireTime(30);
    const interval = setInterval(() => {
      if (expireTime === 0) {
        clearInterval(interval);
      } else {
        setExpireTime(expireTime - 1);
      }
    }, 1000);
    clearInterval(interval);
  }
  useEffect(() => {
    const interval = setInterval(() => {
      if (expireTime === 0) {
        clearInterval(interval);
      } else {
        setExpireTime(expireTime - 1);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });

  useEffect(async () => {
    async function fetchApi() {
      const response = await GetOtp({ mobile });
      if (response.status === 200) {
        alert(response.otp);
        setIsLoading(false);
        sessionStorage.setItem('phone', response.phone);
        sessionStorage.setItem('fullHash', response.hash);
      }
    }

    fetchApi();
  }, []);

  const onFocusHanlder = (event, focusOn) => {
    if (event.target.value.length === 0 || event.target.value.length === 1) {
      setOtpNumber({
        ...otpNumber,
        [event.target.name]: event.target.value,
      });
    }
    if (event.target.value.length === 1) {
      document.querySelector(`input[name=${focusOn}]`).focus();
      return;
    }
  };

  const onChangeHanlder = (event) => {
    setError(false);
    if (event.target.name === 'number1') {
      onFocusHanlder(event, 'number2');
    }
    if (event.target.name === 'number2') {
      onFocusHanlder(event, 'number3');
    }
    if (event.target.name === 'number3') {
      onFocusHanlder(event, 'number4');
    }
    if (event.target.name === 'number4') {
      onFocusHanlder(event, 'number4');
    }
  };

  const resendOtpHandler = async () => {
    setError(false);
    setIsLoading(true);
    setOtpNumber(otpFields);
    resetTimer();
    const response = await GetOtp({ mobile });
    if (response.status === 200) {
      alert(response.otp);
      setIsLoading(false);
      sessionStorage.setItem('phone', response.phone);
      sessionStorage.setItem('fullHash', response.hash);
    }
  };

  const submitHandler = async () => {
    const otp = `${otpNumber.number1}${otpNumber.number2}${otpNumber.number3}${otpNumber.number4}`;
    if (otp.length !== 4) {
      setError(true);
      return;
    }
    const obj = {
      hash: sessionStorage.getItem('fullHash'),
      phone: sessionStorage.getItem('phone'),
      otp: otp,
    };
    setIsLoading(true);
    const response = await VerifyOtp(obj);
    if (response.status === 200 && response.error === true) {
      setError(true);
      setIsLoading(false);
    } else if (response.status === 200 && response.error === false) {
      handler(response);
    }
  };

  return (
    <div className={styles.verify_otp}>
      <Dialog
        className={styles.verify_otp__dailog}
        open={true}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handler(false);
          }
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="py-2">
          <h4>Verify your OTP</h4>
        </DialogTitle>
        {isLoading ? (
          <div className={styles.verify_otp__loading}>
            <CircularProgress />{' '}
          </div>
        ) : (
          <div>
            <DialogContent className="py-1">
              {/* <DialogContentText id="alert-dialog-description"> */}
              <h6 className="text-center">
                A OTP has been sent to {mobile.slice(0, 3)}XXXX{mobile.slice(-3)}
              </h6>
              {/* </DialogContentText> */}
              <div className={styles.verify_otp__input_wrapper}>
                <input placeholder="0" type="number" className={classNames('form-control', error && styles.inputError)} name="number1" value={otpNumber.number1} onChange={onChangeHanlder} />
                <input placeholder="0" type="number" className={classNames('form-control', error && styles.inputError)} name="number2" value={otpNumber.number2} onChange={onChangeHanlder} />
                <input placeholder="0" type="number" className={classNames('form-control', error && styles.inputError)} name="number3" value={otpNumber.number3} onChange={onChangeHanlder} />
                <input placeholder="0" type="number" className={classNames('form-control', error && styles.inputError)} name="number4" value={otpNumber.number4} onChange={onChangeHanlder} />
              </div>
            </DialogContent>
            <div className="text-center">
              <Button onClick={submitHandler} variant="contained" color="success">
                Verify&nbsp;OTP
              </Button>
              &nbsp;
              {expireTime === 0 ? (
                <Button onClick={resendOtpHandler} variant="contained" color="primary">
                  Resend
                </Button>
              ) : (
                <p>Resend OTP in {expireTime}</p>
              )}
            </div>
            <div className="text-center py-4">
              <Button onClick={closeDailogHanlder}>Cancel</Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

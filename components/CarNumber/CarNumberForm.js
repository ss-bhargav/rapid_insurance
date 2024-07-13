import classNames from 'classnames';
import styles from './CarNumberForm.module.scss';
import Link from 'next/link';
import { useState } from 'react';
import { BsArrowRightCircleFill } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { fadeIn, routeAnimation } from '../../helper/animation';
import { Button, CircularProgress } from '@mui/material';

const CarNumberForm = ({ submitHandler, values, isLoading, linkHandler, newCarHandler }) => {
  const vechile_number = {
    state_code: '',
    rto_code: '',
    series: '',
    number: '',
  };

  const [vechileNumber, setVechileNumber] = useState(values ? values : vechile_number);
  const [error, setError] = useState(false);

  const onChangeHanlder = (event) => {
    setError(false);
    if (event.target.name === 'state_code') {
      if (Number(event.nativeEvent.data)) {
        return;
      }
      setVechileNumber({
        ...vechileNumber,
        [event.target.name]: event.target.value,
      });
      if (event.target.value.length === 2) {
        document.querySelector('input[name=rto_code]').focus();
        return;
      }
    }
    if (event.target.name === 'rto_code') {
      setVechileNumber({
        ...vechileNumber,
        [event.target.name]: event.target.value,
      });
      if (event.target.value.length === 2) {
        document.querySelector('input[name=series]').focus();
        return;
      }
    }
    if (event.target.name === 'series') {
      if ((Number(event.nativeEvent.data) && event.target.value.length < 1) || event.target.value.length > 3) {
        return;
      }

      if (Number(event.nativeEvent.data) || event.nativeEvent.data === '0') {
        document.querySelector('input[name=number]').focus();
        document.querySelector('input[name=number').value = Number(event.nativeEvent.data);
        return;
      }

      if (event.target.value.length === 3) {
        setVechileNumber({
          ...vechileNumber,
          [event.target.name]: event.target.value,
        });
        document.querySelector('input[name=number]').focus();
        return;
      }

      if (Number(event.nativeEvent.data) === NaN) {
        setVechileNumber({
          ...vechileNumber,
          [event.target.name]: event.target.value,
        });
        return;
      }
    }
    setVechileNumber({
      ...vechileNumber,
      [event.target.name]: event.target.value,
    });

    if (event.target.name === 'number') {
      if (event.target.value.length === 0) {
        document.querySelector('input[name=series]').focus();
      }
    }
    if (event.target.name === 'series') {
      if (event.target.value.length === 0) {
        document.querySelector('input[name=rto_code]').focus();
      }
    }
    if (event.target.name === 'rto_code' && vechileNumber.state_code !== null) {
      if (event.target.value.length === 0) {
        document.querySelector('input[name=state_code]').focus();
      }
    }
  };

  const validationsHandler = () => {
    let result = true;
    Object.keys(vechileNumber).map((key, value) => {
      if (!vechileNumber[key]) {
        result = false;
      }

      if (['state_code', 'rto_code'].includes(key)) {
        if (vechileNumber[key].length !== 2) {
          result = false;
          return;
        }
      } else if (key === 'series') {
        if (vechileNumber[key].length <= 1 && vechileNumber[key].length >= 3) {
          result = false;
          return;
        }
      } else if (key === 'number') {
        if (vechileNumber[key].length !== 4) {
          result = false;
          return;
        }
      }
    });
    return result;
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (!validationsHandler()) return setError(true);
    submitHandler(vechileNumber);
  };

  const linkClickHandler = (event) => {
    linkHandler();
  };

  return (
    <motion.div {...routeAnimation} className={styles.carNumberFormWrapper}>
      <form onSubmit={onSubmitHandler}>
        <div className="col-12 col-md-9 p-0 m-0">
          <h1 className="text-md-center">Car Insurance</h1>
          <p className="text-md-center">COMPARE &amp; BUY AFFORDABLE TERM INSURANCE PLANS AT LOWEST RATES</p>
          <div className={styles.carInputWrapper}>
            <input type="text" className={classNames('form-control mr-2', error && styles.inputError)} placeholder="TS" name="state_code" value={vechileNumber.state_code} onChange={onChangeHanlder} />
            <input type="text" className={classNames('form-control mr-2', error && styles.inputError)} placeholder="02" name="rto_code" value={vechileNumber.rto_code} onChange={onChangeHanlder} />
            <input type="text" className={classNames('form-control mr-2', error && styles.inputError)} placeholder="AB" name="series" value={vechileNumber.series} onChange={onChangeHanlder} maxLength="3" />
            <input type="text" className={classNames('form-control mr-2', error && styles.inputError)} placeholder="1234" name="number" value={vechileNumber.number} onChange={onChangeHanlder} maxLength="4" />
          </div>
          <p>
            By clicking on &quot;SUBMIT&quot;, You agree to our <b>Privacy Policy &amp; Terms of Use</b>
          </p>
          <Button disabled={isLoading} className="btn btn-primary btn-block w-md-50" type="submit" variant="contained">
            {isLoading ? <CircularProgress size="20px" color="inherit" /> : 'Submit'}
          </Button>
          <div className={styles.links}>
            <p onClick={linkClickHandler}>I DON&apos;T REMEMBER MY VECHILE NUMBER</p>
            <p onClick={newCarHandler}>I HAVE A NEW CAR</p>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default CarNumberForm;

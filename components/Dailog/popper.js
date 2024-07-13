import styles from './Dailog.module.scss';
import React, { useState } from 'react';
import PosLoginForm from 'containers/POS/login';
import PosSignUpForm from 'containers/POS/signup';

const Popper = ({ handler }) => {
  const [loginForm, setLoginForm] = useState(false);
  const [signUpForm, setSignUpForm] = useState(false);
  const handleLoginAndSignup = (val) => {
    switch (val) {
      case 'login':
        setLoginForm(true);
        break;
      case 'signup':
        setSignUpForm(true);
        break;
      default:
        break;
    }
  };

  const closeHandler = () => {
    setSignUpForm(false);
    setLoginForm(false);
  };

  const redirectToSignUp = () => {
    setSignUpForm(true);
    setLoginForm(false);
  };

  const redirectToLogin = () => {
    setSignUpForm(false);
    setLoginForm(true);
  };
  return (
    <>
      <div id="tooltip" className={styles.popper_model}>
        <div className={styles.icon}></div>
        <div
          className={styles.list}
          onClick={() => {
            handleLoginAndSignup('login');
          }}
        >
          <span role="button">Login</span>
        </div>
        &nbsp;|&nbsp;
        <div className={styles.list} onClick={() => handleLoginAndSignup('signup')}>
          <span role="button">Signup</span>
        </div>
      </div>
      {loginForm && <PosLoginForm formHandler={closeHandler} redirectToSignUp={redirectToSignUp} />}
      {signUpForm && <PosSignUpForm formHandler={closeHandler} redirectToLogin={redirectToLogin}/>}
    </>
  );
};
export default Popper;

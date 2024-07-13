import { useState } from 'react';
import styles from './SignUpPage.module.scss';
import { FaKey, FaUserAlt } from 'react-icons/fa';
import { FiMail } from "react-icons/fi";
import { IoIosCall } from "react-icons/io";

function SignUpPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [usernameValidation, setUsernameValidation] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState(false);
    const [emailValidation, setEmailValidation] = useState(false);
    const { mobileValidation, setMobileValidation } = useState(false);

    const valuesObject = {
        username: "",
        password: "",
        email: "",
        mobile: "",
    }

    const validationsObject = {
        username: false,
        password: false,
        email: false,
        mobile: false,
    }

    const [values, setValues] = useState(valuesObject);
    const [validations, setValidations] = useState(validationsObject)

    const onChaneHandler = (event) => {
        const formValues = {
            ...values,
            [event.target.name]: event.target.value,
        }
        const formValuesValidation = {
            ...validations,
            [event.target.name]: false
        }
        setValues(formValues);
        setValidations(formValuesValidation);
    }

    const validationsHandler = () => {
        let returnValue;
        let validationsObj = {...validations}
        Object.keys(validations).map(key => {
            if (!values[key]) {
                validationsObj[key] = true;
                returnValue = false;
            }
        })
        setValidations(validationsObj)
        return returnValue;
    }

    const resetFleidsHandler = () => {
        let resetValidations = { ...validations }
        let resetValues = { ...values }
        Object.keys(validations).map(key => {
            resetValidations[key] = false;
            resetValues[key] = "";
        })
        setValues(resetValues);
        setValidations(resetValidations);
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();
        if (!validationsHandler()) return;

        alert(username, password);
        resetFleidsHandler()
    }



    return (
        <div className={styles.signupMainWrapper}>
            <div className={styles.signInBox}>
                <form onSubmit={onSubmitHandler}>
                    <div className={styles.heading}>
                        <h4>LMV IB LOGIN</h4>
                    </div>
                    <div className={styles.inputs}>
                        <div className={styles.usernameInput}>
                            <label htmlFor="username">
                                <FaUserAlt />
                            </label>
                            <input className={validations.username ? styles.validation : ""} id="username" name="username" placeholder="Username" value={values.username} onChange={e => onChaneHandler(e)} />
                        </div>
                        <div className={styles.passwordInput}>
                            <label htmlFor="password">
                                <FaKey />
                            </label>
                            <input className={validations.password ? styles.validation : ""} id="password" name="password" placeholder="Password" value={values.password} onChange={e => onChaneHandler(e)} />
                        </div>
                        <div className={styles.emailInput}>
                            <label htmlFor="email">
                                <FiMail />
                            </label>
                            <input className={validations.email ? styles.validation : ""} id="email" name="email" placeholder="Email" value={values.email} onChange={e => onChaneHandler(e)} />
                        </div>  
                        <div className={styles.mobileInput}>
                            <label htmlFor="mobile">
                                <IoIosCall />
                            </label>
                            <input className={validations.mobile ? styles.validation : ""} id="mobile" name="mobile" placeholder="Mobile" value={values.mobile} onChange={e => onChaneHandler(e)} />
                        </div>
                    </div>
                    <div className={styles.buttons}>
                        <button type="submit" >Sign In</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignUpPage;


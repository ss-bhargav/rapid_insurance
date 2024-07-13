// import { useState } from 'react';
// import styles from './sign-in.module.scss';
// import { FaKey, FaUserAlt } from 'react-icons/fa';

// function SignInPage() {
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [usernameValidation, setUsernameValidation] = useState(false);
//     const [passwordValidation, setPasswordValidation] = useState(false);

//     const onChangeUsername = (value) => {
//         setUsernameValidation(false);
//         setUsername(value);
//     }

//     const onChangePassword = (value) => {
//         setPasswordValidation(false);
//         setPassword(value);
//     }

//     const validationFunction = () => {
//         if (!username && !password) {
//             setUsernameValidation(true);
//             setPasswordValidation(true);
//             return false;
//         }
//         if (!username) {
//             setUsernameValidation(true);
//             return false;
//         }
//         if (!password) {
//             setPasswordValidation(true);
//             return false;
//         }

//     }

//     const onSubmitHandler = (event) => {
//         event.preventDefault();

//         if(!validationFunction()) return;

//         alert(username, password);
//         setUsername("");
//         setPassword("");
//         setUsernameValidation(false);
//         setPasswordValidation(false);
//     }

//     return (
//         <div className={styles.signInMainWrapper}>
//             <div className={styles.signInBox}>
//                 <form onSubmit={onSubmitHandler}>
//                     <div className={styles.heading}>
//                         <h4>LMV IB LOGIN</h4>
//                     </div>
//                     <div className={styles.inputs}>
//                         <div className={styles.usernameInput}>
//                             <label htmlFor="username">
//                                 <FaUserAlt />
//                             </label>
//                             <input className={usernameValidation ? styles.validation : ""} id="username" name="username" placeholder="Username" value={username} onChange={e => onChangeUsername(e.target.value)} />
//                         </div>
//                         <div className={styles.passwordInput}>
//                             <label htmlFor="password">
//                                 <FaKey />
//                             </label>
//                             <input className={passwordValidation ? styles.validation : ""} id="password" name="password" placeholder="Password" value={password} onChange={e => onChangePassword(e.target.value)} />
//                         </div>
//                     </div>
//                     <div className={styles.buttons}>
//                         <button type="submit" >Sign In</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default SignInPage;

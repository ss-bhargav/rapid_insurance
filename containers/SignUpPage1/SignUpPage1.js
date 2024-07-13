// import { useState } from 'react';
// import styles from './SignUpPage.module.scss';
// import { FaKey, FaUserAlt } from 'react-icons/fa';
// import { FiMail } from 'react-icons/fi';
// import { IoIosCall } from 'react-icons/io';
// import { Formik, Form, ErrorMessage } from 'formik';
// import * as yup from 'yup';
// import { Input } from '../../helper/inputBox';

// function SignUpPage1() {
//   const initialValues = {
//     username: '',
//     email: '',
//     password: '',
//     mobile: '',
//   };

//   const validations = yup.object({
//     username: yup.string().required('Please enter the username').min(6, 'Please enter atleast 6 characters'),
//     email: yup.string().required('Please enter the email').min(6, 'Please enter atleast 6 characters'),
//     password: yup.string().required('Please enter the password').min(6, 'Please enter atleast 6 characters'),
//     mobile: yup.string().required('Please enter the mobile').length(10, 'Please enter 10 digits mobile number'),
//   });

//   const onSubmitHandler = async (values, formikProps) => {
//     console.log(values);
//   };

//   return (
//     <div className={styles.signupMainWrapper}>
//       <div className={styles.signInBox}>
//         <Formik initialValues={initialValues} validationSchema={validations} onSubmit={onSubmitHandler}>
//           <Form>
//             <div className={styles.heading}>
//               <h4>LMV IB LOGIN</h4>
//             </div>
//             <div className={`${styles.inputs}`}>
//               <div className={styles.usernameInput}>
//                 <Input name="username" required icon={FaUserAlt} placeholder="Username" />
//               </div>
//               <div className={styles.passwordInput}>
//                 <Input name="password" required icon={FaKey} placeholder="Password" />
//               </div>
//               <div className={styles.emailInput}>
//                 <Input name="email" required icon={FiMail} placeholder="Email" />
//               </div>
//               <div className={styles.mobileInput}>
//                 <Input name="mobile" required icon={FiMail} placeholder="Mobile" />
//               </div>
//             </div>
//             <div className={styles.buttons}>
//               <button type="submit">Sign Up</button>
//             </div>
//           </Form>
//         </Formik>
//       </div>
//     </div>
//   );
// }

// export default SignUpPage1;

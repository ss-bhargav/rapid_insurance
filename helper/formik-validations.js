import { tablePaginationClasses } from '@mui/material';
import * as yup from 'yup';

export const bike_buynow_validations = (values) => {
  const initialValidation = {
    c_title: yup.string().required('Please select the title'),
    c_first_name: yup.string().required('Please enter the first name').min(6, 'Please enter atleast 3 characters'),
    c_last_name: yup.string().required('Please enter the last name').min(6, 'Please enter atleast 3 characters'),
    c_maritial_status: yup.string().required('Please select the marital status'),
    c_aadhar_number: yup
      .string()
      .required('Please enter the aadhar')
      .matches(/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/, 'Please Enter 12 Digit Aadhaar Number'),
    c_gender: yup.string().required('Please select the gender'),
    c_gst_number: yup.string(),
    c_mobile: yup
      .string()
      .required('Please enter the mobile')
      .matches(/^[6-9]\d{9}$/, 'Please Enter a valid Phone Number'),
    c_email: yup.string().required('Please enter the email').email('Please enter valid email address'),
    c_dob: yup.string().required('Please select date of birth').nullable(),
    c_address_line1: yup.string().required('Please enter the address line1').min(6, 'Please enter atleast 6 characters'),
    c_address_line2: yup.string().required('Please enter the address line2').min(6, 'Please enter atleast 6 characters'),
    c_address_line3: yup.string(),
    c_pincode: yup
      .string()
      .required('Please enter the pincode')
      .matches(/^[1-9]{1}[0-9]{2}[0-9]{3}$/, 'Please Enter a valid Pincode'),
    c_city: yup.string().required('Please enter the city'),
    c_state: yup.string().required('Please enter the state'),
    c_registration_number: yup
      .string()
      .required('Please enter the registration number')
      .matches(/^[A-Za-z]{2,3}(\d{2}([A-Za-z]{1,2})?)?\d{3,4}$/, 'Please enter valid registration number'),
    c_engine_number: yup.string().required('Please enter the engine number'),
    // .matches(/^[A-Za-z]{2}[A-z0-9]{5,16}$/, 'Please enter valid engine number'),
    c_chassis_number: yup.string().required('Please enter the chassis number'),
    // .matches(/^[A-Za-z]{2}[A-z0-9]{5,16}$/, 'Please enter valid chassis number'),
    c_prev_policy_number: yup.string().required('Please enter the previous policy number'),
    c_vehicle_colour: yup.string().required('Please enter the color type'),
    c_is_vehicle_financed: yup.string().required('Please enter the is vehicle financed'),
    c_valid_pucc: yup.string().required('Please enter the is valid pucc'),
    c_nominee_relation: yup.string().required('Please enter the nominee relationship'),
    c_nominee_full_name: yup.string().required('Please enter the nominee full name'),
    c_nominee_dob: yup.string().nullable().required('Please enter the dob'),
  };
  const financier = {
    c_financier_name: yup.string().nullable().required('Please select financer name'),
  };
  if (values === true) {
    return yup.object({
      ...initialValidation,
      ...financier,
    });
  } else {
    return yup.object({
      ...initialValidation,
    });
  }
};

export const insuranceValidationForm = (values) => {
  let initialValues = {};

  // vehicle details fields validation
  initialValues.c_make = !values.c_make ? 'Please Select Vehicle Manufacturer' : '';
  initialValues.c_model = !values.c_model ? 'Please Select Vehicle Model' : '';
  initialValues.c_variant = !values.c_variant ? 'Please Select Vehicle Variant' : '';
  initialValues.c_fuel_type = !values.c_fuel_type ? 'Please Select Fuel Type' : '';
  initialValues.c_registration_date = !values.c_registration_date ? 'Please Select Registration Date' : '';
  initialValues.c_place_of_registration = !values.c_place_of_registration ? 'Please select the registration date' : '';
  initialValues.c_manufacture_year_month = !values.c_manufacture_year_month ? 'Please Select Manufature Month and Year' : '';
  initialValues.c_full_name = !values.c_full_name ? 'Please Enter Full Name' : /^[a-zA-Z]{1,20}[a-zA-Z\s]{2,19}$/.test(values.c_full_name) ? '' : 'Please Enter Atleast 6 Characters';
  initialValues.c_mobile = !values.c_mobile ? 'Please Enter Mobile Number' : /^[6-9]\d{9}$/.test(values.c_mobile) ? '' : 'please Enter valid Mobile Number';
  initialValues.c_email = !values.c_email ? 'Please Enter Email Address' : /\S+@\S+\.\S+/.test(values.c_email) ? '' : 'Please Enter Valid Email Address';

  // existing policy fields validation
  let existingPolicyValidations = {};
  existingPolicyValidations.c_prev_insurer = !values.c_prev_insurer ? 'Please Select Previous Insurer' : '';
  existingPolicyValidations.c_prev_policy_expire_date = !values.c_prev_policy_expire_date ? 'Please Select Previous Policy Expire Date' : '';

  // tp Insurer field validation
  let tpPreviousInsurer = {};
  tpPreviousInsurer.c_tp_previous_insurer = !values.c_tp_previous_insurer ? 'Please Select Previous TP Insurer' : '';

  // ncb field validation
  let ncbValidations = {};
  ncbValidations.c_ncb = !values.c_ncb && values.c_ncb !== 0 ? 'Please Select Previous Year NCB' : '';

  if (values.c_plan === 'TP-0-OD-1' && values.c_existing_policy && !values.c_claim_last_year) {
    return {
      ...initialValues,
      ...existingPolicyValidations,
      ...tpPreviousInsurer,
      ...ncbValidations,
    };
  } else if (values.c_existing_policy && !values.c_claim_last_year) {
    return {
      ...initialValues,
      ...existingPolicyValidations,
      ...ncbValidations,
    };
  } else if (values.c_existing_policy && values.c_claim_last_year) {
    return {
      ...initialValues,
      ...existingPolicyValidations,
    };
  } else {
    return {
      ...initialValues,
    };
  }
};

export const buyNowFormValidation = (values) => {
  let initialValues = {};
  initialValues.c_registration_number = !values.c_registration_number ? 'Please Enter Registration Number' : /^[A-Za-z]{2,3}(\d{2}([A-Za-z]{1,2})?)?\d{3,4}$/.test(values.c_registration_number) ? '' : 'Please Enter Valid Registration Number';
  initialValues.c_title = !values.c_title ? 'Please Select Title' : '';
  initialValues.c_first_name = !values.c_first_name ? 'Please Enter First Name' : /^[a-zA-Z]{1,19}[a-zA-Z\s]{2,19}$/.test(values.c_first_name) ? '' : 'Please Enter Full Name with max of 15 characters';
  initialValues.c_last_name = !values.c_last_name ? 'Please Enter Last Name' : /^[a-zA-Z]{2,16}$/.test(values.c_last_name) ? '' : 'Please Enter Full Name with max of 15 characters';
  initialValues.c_dob = !values.c_dob ? 'Please Select Date of Birth' : '';
  initialValues.c_maritial_status = !values.c_maritial_status ? 'Please Select Maritial Status' : '';
  initialValues.c_aadhar_number = !values.c_aadhar_number ? 'Please Enter 12 digit Aadhar Number' : /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/.test(values.c_aadhar_number) ? '' : 'Please Enter valid Aadhar Number';
  initialValues.c_gender = !values.c_gender ? 'Please Select Gender' : '';
  initialValues.c_mobile = !values.c_mobile ? 'Please Enter Mobile Number' : /^[6-9]\d{9}$/.test(values.c_mobile) ? '' : 'Please Enter valid Mobile Number';
  initialValues.c_email = !values.c_email ? 'Please Enter Email Address' : /\S+@\S+\.\S+/.test(values.c_email) ? '' : 'Please Enter Valid Email Address';
  initialValues.c_address_line1 = !values.c_address_line1 ? 'Please Enter Address 1' : /^[a-zA-Z0-9,'-./]{1,40}[a-zA-Z0-9\s,'-.]{2,50}$/.test(values.c_address_line1) ? '' : 'Please Enter Address with max of 20 characters long';
  initialValues.c_address_line2 = !values.c_address_line2 ? 'Please Enter Address 2' : /^[a-zA-Z0-9,'-./]{1,40}[a-zA-Z0-9\s,'-]{2,50}/.test(values.c_address_line2) ? '' : 'Please Enter Address with max of 20 characters long';
  initialValues.c_pincode = !values.c_pincode ? 'Please Enter Pincode' : /^[1-9]{1}[0-9]{2}[0-9]{3}$/.test(values.c_pincode) ? '' : 'Please Enter Valid Pincode';
  initialValues.c_city = !values.c_city ? 'Please Enter City' : /^[a-zA-Z]{2,10}[a-zA-Z\s]{2,15}$/.test(values.c_city) ? '' : 'Please Enter Valid City Name';
  initialValues.c_state = !values.c_state ? 'Please Enter State' : /^[a-zA-Z]{2,10}[a-zA-Z\s]{2,15}$/.test(values.c_state) ? '' : 'Please Enter Valid State Name';
  initialValues.c_engine_number = !values.c_engine_number ? 'Please Enter Enginee Number' : /^[A-z0-9]{7,16}$/.test(values.c_engine_number) ? '' : 'Engine Number Should Have Minimum of 8 Characters';
  initialValues.c_chassis_number = !values.c_chassis_number ? 'Please Enter Vehicle Chassis Number' : values.c_rollover ? (/^[A-Za-z]{2}[A-z0-9]{5,15}$/.test(values.c_chassis_number) ? '' : 'Please Enter Valid Chassis Number') : /^[A-Za-z]{2}[A-z0-9]{16}$/.test(values.c_chassis_number) ? '' : 'Please Enter Valid Chassis Number';
  initialValues.c_prev_policy_number = !values.c_prev_policy_number ? 'Please Enter Previous Policy Number' : /^[a-zA-Z0-9]{5,15}$/.test(values.c_prev_policy_number) ? '' : 'Please Enter Valid Policy Number';
  initialValues.c_vehicle_colour = !values.c_vehicle_colour ? 'Please Select Vehicle Colour' : '';
  initialValues.c_is_vehicle_financed = values.c_is_vehicle_financed === '' ? 'Please Select Vehicle Financed' : '';
  initialValues.c_valid_pucc = values.c_valid_pucc === '' ? 'Please Select Required Field' : '';
  initialValues.c_nominee_relation = !values.c_nominee_relation ? 'Please Select Nominee Relation' : '';
  initialValues.c_nominee_full_name = !values.c_nominee_full_name ? 'Please Enter Nominee First Name' : /^[a-zA-Z]{2,10}[a-zA-Z\s]{2,15}$/.test(values.c_nominee_full_name) ? '' : 'Please Enter Name with max of 15 characters long';
  initialValues.c_nominee_dob = !values.c_nominee_dob ? 'Please Select Nominee Date of Birth' : '';
  let financier = {};
  financier.c_financier_name = !values.c_financier_name ? 'Please Enter Financier Name' : /^[a-zA-Z]{1,8}[a-zA-Z\s]{2,15}$/.test(values.c_financier_name) ? '' : 'Please Enter Valid Financiers Name';
  financier.c_financier_type = !values.c_financier_type ? 'Please Select Financier Type' : '';
  let companyType = {};
  companyType.c_gst_number = !values.c_gst_number ? 'Please enter GST Number' : /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(values.c_gst_number) ? '' : 'Please Enter Valid GST Number';
  companyType.c_company_name = !values.c_company_name ? 'Please Enter Company Name' : /^[a-zA-Z]{1,10}[a-zA-Z]{2,15}/.test(values.c_company_name) ? '' : 'Please Enter Company Name';
  let pollutionCertificate = {};
  pollutionCertificate.c_pucc_number = !values.c_pucc_number ? 'Please Select PUCC Number' : /^[a-zA-Z0-9]{5,15}$/.test(values.c_pucc_number) ? '' : 'Please Enter Valid PUCC Number';
  pollutionCertificate.c_pucc_valid_date = !values.c_pucc_valid_date ? 'Please Select Pollution Certificate Valid Date' : '';
  // let paCover = {};
  // paCover.c_cpa = !values.c_cpa ? 'Please Select Reason For PA Cover' : '';

  if (values.c_customer_type === 'C' && !values.c_valid_pucc && values.c_is_vehicle_financed) {
    return {
      ...initialValues,
      ...companyType,
      ...financier,
    };
  } else if (values.c_customer_type === 'C' && values.c_valid_pucc && !values.c_is_vehicle_financed) {
    return {
      ...initialValues,
      ...companyType,
      ...pollutionCertificate,
    };
  } else if (values.c_customer_type === 'C' && values.c_valid_pucc && values.c_is_vehicle_financed) {
    return {
      ...initialValues,
      ...companyType,
      ...financier,
      ...pollutionCertificate,
    };
  } else if (values.c_customer_type === 'C' && !values.c_valid_pucc && !values.c_is_vehicle_financed) {
    return {
      ...companyType,
      ...initialValues,
    };
  } else if (values.c_customer_type === 'I' && !values.c_valid_pucc && values.c_is_vehicle_financed) {
    return {
      ...initialValues,
      ...financier,
    };
  } else if (values.c_customer_type === 'I' && values.c_valid_pucc && !values.c_is_vehicle_financed) {
    return {
      ...initialValues,
      ...pollutionCertificate,
    };
  } else if (values.c_customer_type === 'I' && values.c_valid_pucc && values.c_is_vehicle_financed) {
    return {
      ...initialValues,
      ...financier,
      ...pollutionCertificate,
    };
  } else if (values.c_customer_type === 'I' && !values.c_valid_pucc && !values.c_is_vehicle_financed) {
    return {
      ...initialValues,
    };
  } else {
    return {
      ...initialValues,
    };
  }
};

export const EditFieldsValidation = (values) => {
  let initialValues = {};
  initialValues.c_registration_date = !values.c_registration_date ? 'Please Select Registration Date' : '';
  initialValues.c_manufacture_year_month = !values.c_manufacture_year_month ? 'Please Select Manufature Month and Year' : '';

  let existingPolicyValidations = {};
  existingPolicyValidations.c_prev_insurer = !values.c_prev_insurer ? 'Please Select Previous Insurer' : '';
  existingPolicyValidations.c_prev_policy_expire_date = !values.c_prev_policy_expire_date ? 'Please Select Previous Policy Expire Date' : '';

  // tp Insurer field validation
  let tpPreviousInsurer = {};
  tpPreviousInsurer.c_tp_previous_insurer = !values.c_tp_previous_insurer ? 'Please Select Previous TP Insurer' : '';

  // ncb field validation
  let ncbValidations = {};
  ncbValidations.c_ncb = !values.c_ncb && values.c_ncb !== 0 ? 'Please Select Previous Year NCB' : '';
  if (values.c_plan === 'TP-0-OD-1' && values.c_existing_policy && !values.c_claim_last_year) {
    return {
      ...initialValues,
      ...existingPolicyValidations,
      ...ncbValidations,
      ...tpPreviousInsurer,
    };
  } else if (values.c_rollover && values.c_existing_policy && !values.c_ncb) {
    return {
      ...initialValues,
      ...existingPolicyValidations,
      ...ncbValidations,
    };
  } else if (values.c_rollover && values.c_existing_policy && values.c_ncb) {
    return {
      ...initialValues,
      ...existingPolicyValidations,
    };
  } else if (values.c_rollover && !values.c_existing_policy) {
    return {
      ...initialValues,
    };
  } else if (!values.c_rollover) {
    return {
      ...initialValues,
    };
  }
};

export const PosSignUpValidation = (values) => {
  let initialValues = {};
  initialValues.first_name = !values.first_name ? 'Please Enter First Name' : /^[a-zA-Z]{1,19}[a-zA-Z\s]{2,19}$/.test(values.first_name) ? '' : 'Please Enter Full Name with max of 15 characters';
  initialValues.last_name = !values.last_name ? 'Please Enter Last Name' : /^[a-zA-Z]{2,16}$/.test(values.last_name) ? '' : 'Please Enter Full Name with max of 15 characters';
  initialValues.aadhar_number = !values.aadhar_number ? 'Please Enter 12 digit Aadhar Number' : /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/.test(values.aadhar_number) ? '' : 'Please Enter valid Aadhar Number';
  initialValues.mobile_number = !values.mobile_number ? 'Please Enter Mobile Number' : /^[6-9]\d{9}$/.test(values.mobile_number) ? '' : 'Please Enter valid Mobile Number';
  initialValues.email = !values.email ? 'Please Enter Email Address' : /\S+@\S+\.\S+/.test(values.email) ? '' : 'Please Enter Valid Email Address';
  initialValues.pan_number = !values.pan_number ? 'Please Enter Pancard Number' : /^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/.test(values.pan_number) ? '' : 'Please Enter valid Pancard Number';
  initialValues.bank_name = !values.bank_name ? 'Please Enter Bank Name' : /^[a-zA-Z\s]+$/.test(values.bank_name) ? (values.bank_name.trim().length > 2 ? '' : 'Please Enter valid Bank Name') : 'Please Enter Valid Bank Name';
  initialValues.account_number = !values.account_number ? 'Please Enter Account Number' : /^\d{9,18}$/.test(values.account_number) ? '' : 'Please Enter Valid Account Number';
  initialValues.ifsc_code = !values.ifsc_code ? 'Please Enter IFSC Code' : /^[A-Za-z]{4}[a-zA-Z0-9]{7}$/.test(values.ifsc_code) ? '' : 'Please Enter Valid IFSC Code';
  initialValues.bank_branch_name = !values.bank_branch_name ? 'Please Enter Bank Branch Name' : /^[a-zA-z\s]+$/.test(values.bank_branch_name) ? (values.bank_branch_name.trim().length > 2 ? '' : 'Please Enter valid Branch Name') : 'Please Enter Valid Branch Name';

  return initialValues;
};

export const PosLoginValidation = (values) => {
  let initialValues = {};
  initialValues.username = !values.username ? 'Please Enter Username' : /^[A-Za-z]{3}[0-9]{5}$/.test(values.username) ? '' : 'Please Enter valid Username';
  initialValues.password = !values.password ? 'Please Enter Password' : /^[A-Za-z]{3}[0-9]{4}[$]{1}$/.test(values.password) ? '' : 'Please Enter Valid Password';
  return initialValues;
};

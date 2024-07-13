import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from './BuyNow.module.scss';
import { Formik, Form } from 'formik';
import { DefaultInput } from 'helper/formik-inputs';
import { Alert, Button } from '@mui/material';
import { bike_buynow_validations, buyNowFormValidation } from 'helper/formik-validations';
import { bikeBuyNowInitialValue } from 'helper/formik-initial-values';
import { PostTwoWheelerBuyNow, KotakFinancersHandler, KotakBuyNowPayUHandler, UpdateQuotation } from 'helper/api';
import PayNow from 'components/PayNow/PayNow';
import { useEffect, useState } from 'react';
import { BsCheckCircle } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { ImCancelCircle } from 'react-icons/im';
import { CustomAlert } from 'helper/alert';
import { addYears, roundToNearestMinutes, subYears } from 'date-fns';
import { ReactDateField3 } from 'helper/formikFields/reactDateField';
import { Select } from 'helper/formikFields/select';
import { BuyNowInput } from 'helper/formikFields/buyNowInput';
import AlertDialog from 'components/Dailog/AlertDialog';
import { InputDataList } from 'helper/formikFields/inputDataList';
import FullScreenLoading from 'components/Dailog/FullScreenLoading';
// import InputDataList from 'components/helper-inputs/InputDataList';
import { InputDatePicker } from 'components/helper-inputs/DatePicker';
import BasicSelect from 'components/helper-inputs/Select';
import { BasicInput } from 'components/helper-inputs/BasicInput';
import MenuItem from '@mui/material/MenuItem';
import formatDate from 'components/helper-inputs/formatDate';

export default function BikeInsuranceBuyNow({ defaultValue, path }) {
  const [showBuyNow, setShowBuyNow] = useState(false);
  const [data, setData] = useState({ ...defaultValue });
  const [expanded, setExpanded] = useState('panel2');
  const [alert, setAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clientDetails, setClientDetails] = useState({ ...defaultValue, ...bikeBuyNowInitialValue(defaultValue) });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validated, setIsValidated] = useState(false);

  const router = useRouter();

  const details = ['c_title', 'c_first_name', 'c_last_name', 'c_maritial_status', 'c_aadhar_number', 'c_gender', 'c_mobile', 'c_email', 'c_dob'];
  const detailsWithCompanyName = [...details, 'c_company_name', 'c_gst_number'];
  const contactDetails = ['c_address_line1', 'c_address_line2', 'c_pincode', 'c_city', 'c_state'];
  const vehicleDetails = ['c_registration_number', 'c_engine_number', 'c_chassis_number', 'c_prev_policy_number', 'c_vehicle_colour', 'c_is_vehicle_financed', 'c_valid_pucc'];
  const vehicleDetailsWithFinancers = [...vehicleDetails, 'c_financier_name', 'c_financier_type'];
  const vehicleDetailswithPucc = [...vehicleDetails, 'c_financier_name', 'c_financier_type', 'c_pucc_number', 'c_pucc_valid_date'];
  const vehicleDetailswithoutFinancers = [...vehicleDetails, 'c_pucc_number', 'c_pucc_valid_date'];
  const nomineeDetails = ['c_nominee_relation', 'c_nominee_full_name', 'c_nominee_dob'];

  const validate = (values) => {
    setIsSubmitted(true);
    return buyNowFormValidation(values);
  };

  function validateFunction(arr) {
    let result = arr.filter((element, index) => {
      if (errors[element] !== '') {
        return true;
      }
    });
    return result.length;
  }

  useEffect(() => {
    if (isSubmitted) {
      setErrors(validate(clientDetails));
    }
  }, [clientDetails, isSubmitted]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleCloseBuyNow = () => {
    setShowBuyNow(false);
  };

  const onChangeClientHandler = (value, name) => {
    setClientDetails({
      ...clientDetails,
      [name]: value,
    });
  };

  const onValidateVehicleDetails = () => {
    if (clientDetails.c_is_vehicle_financed && clientDetails.c_valid_pucc) {
      return validateFunction(vehicleDetailswithPucc);
    } else if (!clientDetails.c_valid_pucc && clientDetails.c_is_vehicle_financed) {
      return validateFunction(vehicleDetailsWithFinancers);
    } else if (!clientDetails.c_is_vehicle_financed && clientDetails.c_valid_pucc) {
      return validateFunction(vehicleDetailswithoutFinancers);
    } else {
      return validateFunction(vehicleDetails);
    }
  };

  const onValidateCustomerDetails = () => {
    if (clientDetails.c_customer_type === 'I') {
      return validateFunction(details);
    } else {
      return validateFunction(detailsWithCompanyName);
    }
  };

  const onSubmitFormHandler = async (e) => {
    e.preventDefault();
    const result = validate(clientDetails);
    if (Object.values(result).every((key, index) => key === '')) {
      if (defaultValue?.c_registration_number && defaultValue?.c_registration_number?.toLowerCase() !== clientDetails?.c_registration_number?.toLowerCase()) {
        setAlert(true);
      } else {
        setIsLoading(true);
        const puccDate = {
          c_pucc_valid_date: formatDate(clientDetails.c_pucc_valid_date),
        };
        const obj = {
          c_dob: formatDate(clientDetails.c_dob),
          c_nominee_dob: formatDate(clientDetails.c_nominee_dob),
          c_pucc_valid_date: '',
        };
        let buyNowData;
        if (clientDetails.c_valid_pucc) {
          buyNowData = { ...clientDetails, ...puccDate };
        } else {
          buyNowData = { ...clientDetails, ...obj };
        }
        const updatedClientObject = { ...defaultValue, ...buyNowData };
        const updatedRes = await UpdateQuotation(router.query.details, updatedClientObject);
        const id = router.query.details;
        if (updatedRes) {
          setIsLoading(false);
          if (path === 'pos') {
            return router.push({
              pathname: '/pos/proposal',
              query: { details: id },
            });
          }
          router.push({
            pathname: '/proposal',
            query: { details: id },
          });
          setIsSubmitted(false);
        }
      }
    } else {
      setIsSubmitted(true);
    }
  };

  return (
    <>
      <div className={styles.main_accordion_wrapper}>
        {isLoading && <FullScreenLoading />}
        {showBuyNow && <PayNow data={data} handleClose={handleCloseBuyNow} />}
        <div className={styles.accordion_wrapper}>
          <form onSubmit={onSubmitFormHandler}>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                  <span>&nbsp;View Input Details</span>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="px-2">
                  <div className="d-flex flex-wrap pt-1 justify-content-between">
                    <BasicInput disabled valued={clientDetails?.c_idv} helper={errors} name="c_idv" label="IDV" />
                    <BasicInput disabled valued={clientDetails?.c_make_model} helper={errors} name="c_make_model" label="Make and Model" />
                    <BasicInput disabled valued={clientDetails?.c_rto_location} helper={errors} name="c_rto_location" label="RTO" />
                    <BasicInput disabled valued={clientDetails?.c_registration_date} helper={errors} name="c_registration_date" label="Registration Date" />
                    <BasicInput disabled valued={clientDetails?.c_anti_theiflper={errors} name="c_policy_tenure" lac_anti_theifn" />
                    <BasicInput disabled valued={clientDetails?.c_prev_policy_expire_date} helper={errors} name="c_prev_policy_expire_date" label="Prev Policy Expire Date" />
                    <BasicInput disabled valued={clientDetails?.c_electrical_accessories} helper={errors} name="c_electrical_accessories" label="Electrical" />
                    <BasicInput disabled valued={clientDetails?.c_non_electrical_accessories} helper={errors} name="c_non_electrical_accessories" label="Non Electrical" />
                    <BasicInput disabled valued={clientDetails?.c_ncb} helper={errors} name="c_ncb" label="No Claim Bonus" />
                    <BasicInput disabled valued={clientDetails?.c_voluntary_excess} helper={errors} name="c_voluntary_excess" label="VOLUNTRY ACCESS" />
                    <BasicInput disabled valued={clientDetails?.c_anti_theif_device ? 'NO' : 'YES'} helper={errors} name="c_anti_theif_device" label="ANTI-THEFT DEVICE" />
                    <BasicInput disabled valued={clientDetails?.c_limit_tp_damage ? 'YES' : 'NO'} helper={errors} name="c_tppd" label="TPPD" />
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} disabled={false}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2bh-content" id="panel2bh-header">
                {onValidateCustomerDetails() && isSubmitted ? <ImCancelCircle size="1.5em" color="red" /> : null}
                <Typography sx={{ width: '33%', flexShrink: 0 }}>&nbsp;Contact Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="px-2">
                  <div className="d-flex flex-wrap pt-1  justify-content-evenly ">
                    <BasicSelect val={clientDetails?.c_title} name="c_title" label="Select Title" helper={errors} handler={onChangeClientHandler}>
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="mr">Mr</MenuItem>
                      <MenuItem value="mrs">Mrs</MenuItem>
                      <MenuItem value="miss">Miss</MenuItem>
                    </BasicSelect>
                    <BasicInput valued={clientDetails.c_first_name} helper={errors} name="c_first_name" label="First Name" handler={onChangeClientHandler} />
                    <BasicInput name="c_last_name" label="Last Name" valued={clientDetails.c_last_name} helper={errors} handler={onChangeClientHandler} />
                    <InputDatePicker val={clientDetails.c_dob} name="c_dob" label="Date of Birth" maxDate={subYears(new Date(), 18)} minDate={subYears(new Date(), 60)} options={['year', 'month', 'day']} helper={errors} handler={onChangeClientHandler} />
                    <BasicSelect val={clientDetails?.c_maritial_status} name="c_maritial_status" label="Marital Status" helper={errors} handler={onChangeClientHandler}>
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="married">Married</MenuItem>
                      <MenuItem value="single">Single</MenuItem>
                      <MenuItem value="divorced">Divorced</MenuItem>
                      <MenuItem value="window">Widow</MenuItem>
                    </BasicSelect>
                    <BasicInput name="c_aadhar_number" label="Aadhar Number" valued={clientDetails.c_aadhar_number} helper={errors} handler={onChangeClientHandler} />
                    <BasicSelect val={clientDetails?.c_gender} name="c_gender" label="Gender" helper={errors} handler={onChangeClientHandler}>
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="others">Others</MenuItem>
                    </BasicSelect>
                    <BasicInput valued={clientDetails.c_mobile} helper={errors} name="c_mobile" label="Mobile" required handler={onChangeClientHandler} />
                    <BasicInput valued={clientDetails.c_email} helper={errors} name="c_email" label="Email" required handler={onChangeClientHandler} />
                    {clientDetails.c_customer_type === 'C' ? <BasicInput name="c_company_name" label="Company Name" valued={clientDetails?.c_company_name} helper={errors} handler={onChangeClientHandler} /> : null}
                    <BasicInput valued={clientDetails.c_gst_number} helper={errors} name="c_gst_number" label="GST" handler={onChangeClientHandler} />
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} disabled={false}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3bh-content" id="panel3bh-header">
                {validateFunction(contactDetails) && isSubmitted ? <ImCancelCircle size="1.5em" color="red" /> : null}
                <Typography sx={{ width: '33%', flexShrink: 0 }}>&nbsp;Address Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="px-2">
                  <div className="d-flex flex-wrap pt-1 justify-content-evenly">
                    <BasicInput valued={clientDetails.c_address_line1} helper={errors} name="c_address_line1" label="Address Line 1" handler={onChangeClientHandler} />
                    <BasicInput valued={clientDetails.c_address_line2} helper={errors} name="c_address_line2" label="Address Line 2" handler={onChangeClientHandler} />
                    <BasicInput valued={clientDetails.c_address_line3} helper={errors} name="c_address_line3" label="Address Line3" handler={onChangeClientHandler} />
                    <BasicInput valued={clientDetails.c_pincode} helper={errors} name="c_pincode" label="Pincode" handler={onChangeClientHandler} />
                    <BasicInput valued={clientDetails.c_city} helper={errors} name="c_city" label="City" handler={onChangeClientHandler} />
                    <BasicInput valued={clientDetails.c_state} helper={errors} name="c_state" label="State" handler={onChangeClientHandler} />
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')} disabled={false}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4bh-content" id="panel4bh-header">
                {onValidateVehicleDetails() && isSubmitted ? <ImCancelCircle size="1.5em" color="red" /> : null}
                <Typography sx={{ width: '33%', flexShrink: 0 }}>&nbsp;Vehicle Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="px-2">
                  <div className="d-flex flex-wrap pt-1  justify-content-evenly ">
                    <BasicInput valued={clientDetails.c_registration_number} helper={errors} name="c_registration_number" label="Registration Number" handler={onChangeClientHandler} />
                    <BasicInput valued={clientDetails.c_engine_number} helper={errors} name="c_engine_number" label="Engine Number" handler={onChangeClientHandler} />
                    <BasicInput valued={clientDetails.c_chassis_number} helper={errors} name="c_chassis_number" label="Chassis Number" handler={onChangeClientHandler} />
                    <BasicInput valued={clientDetails.c_prev_policy_number} helper={errors} name="c_prev_policy_number" label="Previous Policy Number" handler={onChangeClientHandler} />
                    <BasicSelect name="c_vehicle_colour" label="Vehicle Color" val={clientDetails.c_vehicle_colour} helper={errors} handler={onChangeClientHandler}>
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="black">Black</MenuItem>
                      <MenuItem value="blue">Blue</MenuItem>
                      <MenuItem value="red">Red</MenuItem>
                      <MenuItem value="brown">Brown</MenuItem>
                      <MenuItem value="green">Green</MenuItem>
                      <MenuItem value="light_blue">Light Blue</MenuItem>
                      <MenuItem value="light_green">Light Green</MenuItem>
                    </BasicSelect>
                    <BasicSelect name="c_is_vehicle_financed" label="Is your vehicle financed?" val={clientDetails.c_is_vehicle_financed} helper={errors} handler={onChangeClientHandler}>
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value={true}>Yes</MenuItem>
                      <MenuItem value={false}>No</MenuItem>
                    </BasicSelect>
                    {clientDetails.c_is_vehicle_financed ? (
                      <>
                        <BasicSelect name="c_financier_type" label="Select Financier Type" val={clientDetails.c_financier_type} helper={errors} handler={onChangeClientHandler}>
                          <MenuItem value="">Select</MenuItem>
                          <MenuItem value="hypothecation">HYPOTHECATION</MenuItem>
                          <MenuItem value="hire purchase">HIRE PURCHASE</MenuItem>
                          <MenuItem value="lease agreement">LEASE AGREEMENT</MenuItem>
                        </BasicSelect>
                        <BasicInput valued={clientDetails.c_financier_name} helper={errors} name="c_financier_name" label="Financier Name" handler={onChangeClientHandler} />
                      </>
                    ) : null}
                    <BasicSelect name="c_valid_pucc" label="Is valid PUCC ?" val={clientDetails.c_valid_pucc} helper={errors} handler={onChangeClientHandler}>
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value={true}>Yes</MenuItem>
                      <MenuItem value={false}>No</MenuItem>
                    </BasicSelect>
                    {clientDetails.c_valid_pucc ? (
                      <>
                        <BasicInput valued={clientDetails.c_pucc_number} helper={errors} name="c_pucc_number" label="Enter PUCC Number" handler={onChangeClientHandler} />
                        <InputDatePicker val={clientDetails.c_pucc_valid_date} name="c_pucc_valid_date" label="Select PUCC Valid upto" maxDate={addYears(new Date(), 1)} options={['year', 'month', 'day']} helper={errors} handler={onChangeClientHandler} />
                      </>
                    ) : null}
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')} disabled={false}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel5bh-content" id="panel5bh-header">
                {validateFunction(nomineeDetails) && isSubmitted ? <ImCancelCircle size="1.5em" color="red" /> : null}
                <Typography sx={{ width: '33%', flexShrink: 0 }}>&nbsp;Nominee Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="px-2">
                  <div className="d-flex flex-wrap pt-1  justify-content-evenly ">
                    <BasicInput name="c_nominee_full_name" label="Full Name" valued={clientDetails.c_nominee_full_name} helper={errors} handler={onChangeClientHandler} />
                    <InputDatePicker val={clientDetails.c_nominee_dob} name="c_nominee_dob" label="Date of Birth" maxDate={subYears(new Date(), 18)} minDate={subYears(new Date(), 60)} options={['year', 'month', 'day']} helper={errors} handler={onChangeClientHandler} />
                    <BasicSelect name="c_nominee_relation" label="Relationship" val={clientDetails.c_nominee_relation} helper={errors} handler={onChangeClientHandler}>
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="spouse">spouse</MenuItem>
                      <MenuItem value="brother">brother</MenuItem>
                      <MenuItem value="mother">mother</MenuItem>
                      <MenuItem value="father">father</MenuItem>
                      <MenuItem value="son">son</MenuItem>
                      <MenuItem value="others">Others</MenuItem>
                    </BasicSelect>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel6bh-content" id="panel6bh-header">
                <Typography sx={{ width: '33%', flexShrink: 0 }}>&nbsp;Terms and Conditions</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ width: '100%', flexShrink: 0 }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nulla facilisi cras fermentum odio eu feugiat pretium nibh. Malesuada pellentesque elit eget gravida. Elementum eu facilisis sed odio morbi quis commodo odio aenean. Ridiculus mus mauris vitae ultricies leo integer malesuada. Scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis. Quam adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus. Sed lectus vestibulum mattis ullamcorper velit. A arcu cursus vitae congue. Pellentesque diam
                  volutpat commodo sed. Et tortor at risus viverra adipiscing at. Rhoncus aenean vel elit scelerisque. Leo vel fringilla est ullamcorper eget nulla. Gravida dictum fusce ut placerat orci nulla pellentesque dignissim. Risus in hendrerit gravida rutrum quisque non tellus orci. Lacus vestibulum sed arcu non odio euismod. Accumsan tortor posuere ac ut consequat semper.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <div className={styles.online_button}>
              <Button type="submit" variant="contained" disableRipple={true}>
                ONLINE PAYMENT
              </Button>
            </div>
          </form>
        </div>
        {alert && <AlertDialog data="Registration number mismatch" handleClose={() => setAlert(false)} />}
      </div>
    </>
  );
}

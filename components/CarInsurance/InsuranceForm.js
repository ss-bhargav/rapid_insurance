import { useEffect, useState } from 'react';
import bikeInsurance from 'public/bike-insurance.svg';
import Image from 'next/image';
import styles from '../CarInsurance/CarInsuranceForm.module.scss';
import { motion } from 'framer-motion';
import { fadeIn, routeAnimation } from '../../helper/animation';
import { addMonths, subMonths, subYears } from 'date-fns';
import { GetInsuranceCompanies, GetPcManufacturers, GetPcModels, GetPcVarients, GetAllLocations, GetPcFuelTypes, GetQuotation } from 'helper/api';
import { carInsuranceRadios, carInsuranceInitialValues, newCarInsuranceInitialValues } from 'helper/formik-initial-values';
import AlertDialog from 'components/Dailog/AlertDialog';
import { calculateYears } from 'helper/formatDate';
import { useRouter } from 'next/router';
import { RadioBtns } from 'components/helper-inputs/RadioButton';
import { customerTypeOptions, insuranceExistingFields, planTypesForRolloverCarInsurance, planTypesForCarInsurance, ncbValues } from 'helper/constants';
import FullScreenLoading from 'components/Dailog/FullScreenLoading';
import InputDataList from 'components/helper-inputs/InputDataList';
import { InputDatePicker } from 'components/helper-inputs/DatePicker';
import BasicSelect from 'components/helper-inputs/Select';
import { BasicInput } from 'components/helper-inputs/BasicInput';
import MenuItem from '@mui/material/MenuItem';
import formatDate from 'components/helper-inputs/formatDate';
import { insuranceValidationForm } from 'helper/formik-validations';

const InsuranceForm = (props) => {
  const { setInsurance, values, isLoading, rollover } = props;
  const [manufacturers, setManufacturers] = useState([]);
  const [models, setModels] = useState([]);
  const [variants, setVariants] = useState([]);
  const [insurers, setInsurers] = useState([]);
  const [fuel, setFuel] = useState([]);
  const [rtoLocations, setRtoLocations] = useState([]);
  const [planTypeAlert, setPlanTypeAlert] = useState(false);
  const [alert, setAlert] = useState(false);
  const [makeValue, setMakeValue] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [rolloverType, setRolloverType] = useState(rollover);
  const [details, setDetails] = useState(rolloverType ? carInsuranceInitialValues(values) : newCarInsuranceInitialValues(values));
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validated, setIsValidated] = useState(false);
  const [existingPolicyAlert, setExistingPolicyAlert] = useState(false);
  const [url, setUrl] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const { makes } = await GetPcManufacturers();
      setManufacturers(makes);
      const { data } = await GetAllLocations();
      setRtoLocations(data);
      const response2 = await GetInsuranceCompanies();
      setInsurers(response2.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const quotationsId = router.query.editDetails;
    const getDetails = async () => {
      if (quotationsId !== undefined && values) {
        setUrl(false);
        const clientRes = await GetQuotation(quotationsId);
        const user = clientRes?.data[0]?.client_object;
        setRolloverType(user.c_rollover);
        setDetails(user);
      }
    };
    getDetails();
  }, []);

  const closeAlert = () => {
    setPlanTypeAlert(false);
    setAlert(false);
    setExistingPolicyAlert(false);
  };
  // validation function with initial values and regular expresions
  const validate = (values) => {
    setIsSubmitted(true);
    return insuranceValidationForm(values);
  };

  useEffect(() => {
    if (isSubmitted) {
      setErrors(validate(details));
    }
  }, [details, isSubmitted]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const result = validate(details);
    const submitedDetails = {
      ...details,
      c_registration_date: formatDate(details.c_registration_date),
      c_manufacture_year_month: formatDate(details.c_manufacture_year_month),
      c_prev_policy_expire_date: details.c_prev_policy_expire_date ? formatDate(details.c_prev_policy_expire_date) : '',
      c_rollover: rolloverType ? true : false,
    };
    if (!rolloverType) {
      delete submitedDetails.c_prev_policy_expire_date;
    }
    if (Object.values(result).every((key, index) => key === '')) {
      const yearSpan = calculateYears(new Date(details.c_manufacture_year_month), new Date());
      if (9.5 < yearSpan) {
        setAlert(true);
      } else {
        setInsurance(submitedDetails);
        setIsValidated(false);
        setIsSubmitted(false);
      }
    }
  };

  const onSelectCallBackHandler = async (value, name) => {
    let updated_details = {
      ...details,
      [name]: value,
    };
    setDetails(updated_details);
    switch (name) {
      case 'c_plan':
        value === 'TP-0-OD-1' ? setPlanTypeAlert(true) : null;
        break;
      case 'c_make':
        if (value === null) {
          setDetails({ ...details, c_make: null, c_model: null, c_variant: null, c_fuel_type: null });
          setModels([]);
          setVariants([]);
          setFuel([]);
        } else {
          setMakeValue(value);
          const { models } = await GetPcModels(value);
          setModels(models);
        }
        break;
      case 'c_model':
        if (value === null) {
          setDetails({ ...details, c_model: null, c_variant: null, c_fuel_type: null });
          setVariants([]);
          setFuel([]);
        } else {
          setModelValue(value);
          const { variants } = await GetPcVarients(makeValue, value);
          setVariants(variants);
        }
        break;
      case 'c_variant':
        if (value === null) {
          setDetails({ ...details, c_variant: null, c_fuel_type: null });
          setFuel([]);
        } else {
          const { fuelTypes } = await GetPcFuelTypes(makeValue, modelValue);
          setFuel(fuelTypes);
        }
        break;
      case 'c_existing_policy':
        setExistingPolicyAlert(true);
        break;
      default:
        break;
    }
  };

  const ncbValuesFunc = () => {
    return ncbValues.map((list, index) => {
      return (
        <MenuItem value={`${list.displayValue}`} key={list.displayValue}>
          {list.displayName} % ({index === 0 ? `less than 1 year` : index + ' year age'})
        </MenuItem>
      );
    });
  };

  return (
    <>
      <div className={styles.carInsuranceWrapper}>
        {isLoading && <FullScreenLoading />}
        <h2 className="py-3 m-0 text-center"> Insure Your Drive </h2>
        <div className="row col-12 p-0 m-0">
          <div className={`${styles.formMainWrapper} col-10 col-lg-8 m-auto p-0 p-md-3 p-lg-3`}>
            <form onSubmit={onSubmitHandler} autoComplete="off" autoSave="off">
              <motion.div {...routeAnimation}>
                <RadioBtns name="c_customer_type" label="Customer Type" handler={onSelectCallBackHandler} options={customerTypeOptions} values={details} />
                {rolloverType ? <RadioBtns name="c_plan" label="Plan Type" handler={onSelectCallBackHandler} options={planTypesForRolloverCarInsurance} values={details} /> : <RadioBtns name="c_plan" label="Plan Type" handler={onSelectCallBackHandler} options={planTypesForCarInsurance} values={details} />}
                <div className="ml-3">
                  <p className="mb-0 p-0 font-weight-normal"> Vehicle Details </p>
                </div>
                <div className="d-flex flex-wrap">
                  <InputDataList val={details.c_make} name="c_make" data={manufacturers} label="Select Make" handler={onSelectCallBackHandler} helper={errors} />
                  <InputDataList val={details.c_model} name="c_model" data={models} label="Select Model" handler={onSelectCallBackHandler} helper={errors} />
                  <InputDataList val={details.c_variant} name="c_variant" data={variants} label="Select variant" handler={onSelectCallBackHandler} helper={errors} />
                  <InputDataList val={details.c_fuel_type} name="c_fuel_type" data={fuel} label="Select Fuel Type" handler={onSelectCallBackHandler} helper={errors} />
                  <InputDataList val={details.c_place_of_registration} name="c_place_of_registration" data={rtoLocations} label="Place of Registration" handler={onSelectCallBackHandler} helper={errors} />
                  <InputDatePicker val={details.c_registration_date} name="c_registration_date" label="Registartion Date" handler={onSelectCallBackHandler} maxDate={rolloverType ? subYears(new Date(), 1) : new Date()} minDate={rolloverType ? subYears(new Date(), 10) : subMonths(new Date(), 6)} options={['year', 'month', 'day']} helper={errors} />
                  <InputDatePicker val={details.c_manufacture_year_month} name="c_manufacture_year_month" label="Manufacture Month/Year" options={['year', 'month']} handler={onSelectCallBackHandler} maxDate={rolloverType ? (details.c_registration_date !== null ? new Date(details.c_registration_date) : subYears(new Date(), 1)) : new Date()} minDate={rolloverType ? subYears(new Date(), 10) : subYears(new Date(), 2)} helper={errors} />
                </div>
                {rolloverType ? (
                  <>
                    <RadioBtns name="c_existing_policy" label='Do you have an existing comprehensive policy (Select "NO" if ownership transfer)' handler={onSelectCallBackHandler} options={insuranceExistingFields} values={details} />
                    {details.c_existing_policy ? (
                      <>
                        <div className="d-flex flex-wrap">
                          <InputDatePicker val={details.c_prev_policy_expire_date} name="c_prev_policy_expire_date" label="Prev Policy Expire Date" minDate={subMonths(new Date(), 4)} maxDate={addMonths(new Date(), 2)} options={['year', 'month', 'day']} handler={onSelectCallBackHandler} helper={errors} />
                          <InputDataList val={details.c_prev_insurer} name="c_prev_insurer" data={insurers} label="Previous Insurer" handler={onSelectCallBackHandler} helper={errors} />
                          {details.c_plan === 'TP-0-OD-1' ? <InputDataList val={details.c_tp_previous_insurer} name="c_tp_previous_insurer" label="TP Policy Insurer" data={insurers} handler={onSelectCallBackHandler} helper={errors} /> : null}
                        </div>
                        <RadioBtns name="c_claim_last_year" label="Did you claim last year?" handler={onSelectCallBackHandler} options={insuranceExistingFields} values={details} />
                        {!details.c_claim_last_year ? (
                          <BasicSelect val={details.c_ncb} name="c_ncb" label="Select previous year NCB" options={ncbValues} handler={onSelectCallBackHandler} helper={errors}>
                            {ncbValuesFunc()}
                          </BasicSelect>
                        ) : null}
                      </>
                    ) : null}
                  </>
                ) : null}
                <div className="ml-3">
                  <p className="mb-0 p-0 font-weight-normal">Customer Details </p>
                </div>
                <div className="d-flex flex-wrap">
                  <BasicInput valued={details.c_full_name} type="text" name="c_full_name" label="Full Name" handler={onSelectCallBackHandler} helper={errors} />
                  <BasicInput valued={details.c_mobile} type="number" name="c_mobile" label="Mobile" handler={onSelectCallBackHandler} helper={errors} />
                  <BasicInput valued={details.c_email} type="email" name="c_email" label="Email" handler={onSelectCallBackHandler} helper={errors} />
                </div>
                <div className="">
                  <button type="submit" className="btn btn-primary ml-3 mt-2" disabled={isLoading}>
                    Submit
                  </button>
                </div>
              </motion.div>
            </form>
            {url ? (
              <div className="changeRolloverType text-center mt-3" role="button">
                {rolloverType ? (
                  <h6
                    onClick={() => {
                      setRolloverType(false);
                      setDetails(newCarInsuranceInitialValues(values));
                    }}
                  >
                    I have New Car
                  </h6>
                ) : (
                  <h6
                    onClick={() => {
                      setRolloverType(true);
                      setDetails(carInsuranceInitialValues(values));
                    }}
                  >
                    I Dont Remember My vehicle Number
                  </h6>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {planTypeAlert && <AlertDialog handleClose={closeAlert} data="You can buy only an OD policy. If you have an active TP policy coverage up to next year." />}
      {alert && <AlertDialog handleClose={closeAlert} data="Your bike is not eligible for insurance because its life span is above 9.5 years." />}
      {!details.c_existing_policy && existingPolicyAlert && <AlertDialog handleClose={closeAlert} data="Your policy will not issue instantly. It will issue after inspection." />}
    </>
  );
};
('');
export default InsuranceForm;

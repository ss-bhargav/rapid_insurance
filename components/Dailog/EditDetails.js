import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { DialogContent } from '@mui/material';
import styles from './Dailog.module.scss';
import { ImCross } from 'react-icons/im';
import { RadioButton } from 'helper/radioButton';
import BasicSelect from 'components/helper-inputs/Select';
import { InputDatePicker } from 'components/helper-inputs/DatePicker';
import InputDataList from 'components/helper-inputs/InputDataList';
import { customerTypeOptions, planTypesForRolloverBikeInsurance, insuranceExistingFields, planTypesForBikeInsurance, ncbValues, planTypesForRolloverCarInsurance, planTypesForCarInsurance } from 'helper/constants';
import { motion } from 'framer-motion';
import { addMonths, subMonths, subYears } from 'date-fns';
import { useRouter } from 'next/router';
import { MenuItem } from '@mui/material';
import { EditFieldsValidation } from 'helper/formik-validations';

const transactionAlertsVariants = {
  hidden: {
    opacity: 0,
    transition: {
      delay: 0.2,
      duration: 5,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.2,
      duration: 5,
      type: 'spring',
      stiffness: 30,
    },
  },
};

const EditDetails = ({ data, handler, closeDialogHandler, submitHandler, resetHandler, details, clientObject, insurers, updateFormDetails }) => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const currentUrl = router.pathname.split('/')[router.pathname.split('/').length - 2];
  const [updateDetails, setUpdateDetails] = useState({ ...clientObject });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isSubmitted) {
      setErrors(EditFieldsValidation(updateDetails));
    }
  }, [updateDetails, isSubmitted]);

  const onChangeHandler = async (value, name) => {
    if (name === 'c_claim_last_year' || name === 'c_existing_policy') {
      setUpdateDetails({
        ...updateDetails,
        [name]: JSON.parse(value),
      });
    } else {
      setUpdateDetails({
        ...updateDetails,
        [name]: value,
      });
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

  const planTypeHandler = () => {
    switch (currentUrl) {
      case 'bike-insurance':
        return updateDetails.c_rollover ? planTypesForRolloverBikeInsurance : planTypesForBikeInsurance;
        break;
      case 'car-insurance':
        return updateDetails.c_rollover ? planTypesForRolloverCarInsurance : planTypesForCarInsurance;
        break;
      default:
        break;
    }
  };

  const bgHeader = {
    height: '45px',
    backgroundColor: '#1B75BA',
    color: '#fff',
    textAlign: 'center',
    padding: '8px 5px',
    margin: '0',
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (Object.values(errors).every((obj, index) => obj === '' && isSubmitted)) {
      updateFormDetails(updateDetails);
    }
  };

  return (
    <motion.div variants={transactionAlertsVariants} initial="hidden" animate="visible">
      <Dialog open={true} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent className="p-0">
          <div style={bgHeader}>
            <div className="d-flex justify-content-between align-items-baseline p-1">
              <h6>&nbsp;Edit&nbsp;Details</h6>
              <div className={styles.closeDialog} role="button">
                <ImCross size="0.9em" title="close" onClick={closeDialogHandler} />
              </div>
            </div>
          </div>
          <div className="px-3 py-2">
            <form onSubmit={onSubmitHandler}>
              <RadioButton name="c_customer_type" label="Customer Type" handler={onChangeHandler} options={customerTypeOptions} values={updateDetails} />
              <RadioButton name="c_plan" label="Plan Type" handler={onChangeHandler} options={planTypeHandler()} values={updateDetails} />
              <div className="row">
                <InputDatePicker val={updateDetails.c_registration_date} name="c_registration_date" label="Registartion Date" handler={onChangeHandler} maxDate={updateDetails.c_rollover ? subYears(new Date(), 1) : new Date()} minDate={updateDetails.c_rollover ? subYears(new Date(), 10) : subMonths(new Date(), 6)} options={['year', 'month', 'day']} helper={errors} />
                <InputDatePicker val={updateDetails.c_manufacture_year_month} name="c_manufacture_year_month" label="Manufacture Month/Year" options={['year', 'month']} handler={onChangeHandler} maxDate={updateDetails.c_rollover ? (updateDetails.c_registration_date !== null ? new Date(updateDetails.c_registration_date) : subYears(new Date(), 1)) : new Date()} minDate={updateDetails.c_rollover ? subYears(new Date(), 10) : subYears(new Date(), 2)} helper={errors} />
              </div>
              {updateDetails.c_rollover ? (
                <>
                  <RadioButton name="c_existing_policy" label="Do you have an existing policy?" handler={onChangeHandler} options={insuranceExistingFields} values={updateDetails} />
                  {updateDetails.c_existing_policy ? (
                    <>
                      <div className="row">
                        <InputDatePicker val={updateDetails.c_prev_policy_expire_date} name="c_prev_policy_expire_date" label="Prev Policy Expire Date" minDate={subMonths(new Date(), 4)} maxDate={addMonths(new Date(), 2)} options={['year', 'month', 'day']} handler={onChangeHandler} helper={errors} />
                        <InputDataList val={updateDetails.c_prev_insurer} name="c_prev_insurer" data={insurers} label="Previous Insurer" handler={onChangeHandler} helper={errors} />
                        {updateDetails.c_plan === 'TP-0-OD-1' ? <InputDataList val="" name="c_tp_previous_insurer" data={insurers} label="TP Policy Insurer" handler={onChangeHandler} helper={errors} /> : null}
                      </div>
                      <RadioButton name="c_claim_last_year" label="Did you claim last year?" handler={onChangeHandler} options={insuranceExistingFields} values={updateDetails} />
                      {!updateDetails.c_claim_last_year ? (
                        <div className="row">
                          <BasicSelect val={updateDetails.c_ncb} name="c_ncb" label="Select previous year NCB" options={ncbValues} handler={onChangeHandler} helper={errors}>
                            {ncbValuesFunc()}
                          </BasicSelect>
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </>
              ) : null}
              <div className="text-center">
                <Button type="submit" color="primary" variant="contained" size="small">
                  Update
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default EditDetails;

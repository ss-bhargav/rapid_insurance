import carInsurance from '../../public/car-insurance.svg';
import styles from './CarInsurancePage.module.scss';
import Image from 'next/image';
import axios from 'axios';
import { useEffect, useState } from 'react';
import CarNumberForm from '../../components/CarNumber/CarNumberForm';
import InsuranceForm from 'components/CarInsurance/InsuranceForm';
import { AddQuotation, GetKotakRolloverQuotes, GetPremiumQuotes, GetVehicleDetails, GetQuotation, UpdateQuotation } from 'helper/api';
import { useRouter } from 'next/router';
import VerifyOtpComponent from 'components/Dailog/VerifyOtpDailog';
import FullScreenLoading from 'components/Dailog/FullScreenLoading';

const CarInsurancePage = ({ path }) => {
  const router = useRouter();
  const [carNumber, setCarNumber] = useState(null);
  const [isRollover, setIsRollover] = useState(false);
  const [carDetails, SetCarDetails] = useState({});
  const [showInsuranceForm, setShowInsuranceForm] = useState(false);
  const [showNewCarForm, setShowNewCarForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [carNumberForm, setCarNumberForm] = useState(true);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpActive, setOtpActive] = useState(false);
  const [clientObject, setClientObject] = useState({});
  const [loading, setLoading] = useState(false);

  const carNumberHandler = async (value) => {
    setIsLoading(true);
    const c_registration_number = `${value.state_code}${value.rto_code}${value.series}${value.number}`;
    try {
      const data = await GetVehicleDetails(c_registration_number);
      // console.log('data', data);
      if (data.status === 200) {
        if (data?.data?.c_vehicle_category.toUpperCase() !== 'M-CYCLE/SCOOTER(2WN)') {
          SetCarDetails(data.data);
          setCarNumberForm(false);
          setShowInsuranceForm(true);
          setIsLoading(false);
        } else {
          const userRes = confirm('Looks like you have entered a bike registration number, Click ok to contine to bike insurance page');
          if (userRes) {
            router.push('/bike-insurance');
          }
        }
      }
    } catch (error) {
      // alert(error.message);
      setCarNumberForm(false);
      setShowInsuranceForm(true);
      setIsLoading(false);
    }
  };

  const carNumberHandler2 = () => {
    setCarNumberForm(false);
    setShowInsuranceForm(true);
    setIsRollover(true);
  };

  const carInsuranceHandler = async (values) => {
    const planType = values.c_plan.split('-');
    const client_object = {
      ...values,
      c_make_model: `${values.c_make},${values.c_model},${values.c_variant}, ${values.c_fuel_type}`,
      c_own_damage: planType[3],
      c_third_party_damage: planType[1],
      c_policy_tenure: planType[3],
      c_registration_number: carNumber,
    };
    setClientObject(client_object);
    setMobileNumber(client_object.c_mobile);
    setOtpActive(true);
  };

  const newCarInsuranceHandler = (values) => {
    setIsRollover(false);
    setShowNewCarForm(true);
    setShowInsuranceForm(false);
    setCarNumberForm(false);
  };

  const closeOTPHandler = async (res) => {
    const queryObject = router.query;
    if (res.message === 'Success') {
      setOtpActive(false);
      setIsLoading(true);
      const client_obj = { ...clientObject };
      // console.log(JSON.stringify(client_obj));
      if (Object.keys(queryObject).length > 0) {
        const updateQuotationRes = await UpdateQuotation(router.query.editDetails, client_obj);
        if (updateQuotationRes) {
          if (path === 'pos') {
            return router.push({
              pathname: '/pos/car-insurance/quotations',
              query: {
                quotationsId: updateQuotationRes?.data[0]?.quotation_id,
              },
            });
          }
          router.push({
            pathname: '/car-insurance/quotations',
            query: {
              quotationsId: updateQuotationRes?.data[0]?.quotation_id,
            },
          });
        }
      } else {
        const addQuotationRes = await AddQuotation(client_obj);
        if (addQuotationRes) {
          if (path === 'pos') {
            return router.push({
              pathname: '/pos/car-insurance/quotations',
              query: {
                quotationsId: addQuotationRes?.data[0]?.quotation_id,
              },
            });
          }
          router.push({
            pathname: '/car-insurance/quotations',
            query: {
              quotationsId: addQuotationRes?.data[0]?.quotation_id,
            },
          });
        }
      }
    } else {
      setOtpActive(false);
    }
    if ('close') {
      setOtpActive(false);
    }
  };
  return (
    <>
      <div className={styles.carMainWrapper}>
        {loading && router.query.editDetails && <FullScreenLoading />}
        {carNumberForm && (
          <div className="col-12 d-md-flex justify-content-center align-items-center p-0" style={{ height: '80vh' }}>
            <div className="row m-0 pt-3 pt-md-0">
              <div className="col-12 col-md-6">
                <Image src={carInsurance} alt="Lmv Insurance" width="600" height="400" />
              </div>
              <div className="col-12 col-md-6">
                <CarNumberForm submitHandler={carNumberHandler} linkHandler={carNumberHandler2} isLoading={isLoading} newCarHandler={newCarInsuranceHandler} />
              </div>
            </div>
          </div>
        )}
      </div>
      <div>{showInsuranceForm && <InsuranceForm rollover={true} setInsurance={carInsuranceHandler} values={carDetails} isLoading={isLoading} />}</div>
      <div>{showNewCarForm && <InsuranceForm rollover={false} values={carDetails} setInsurance={carInsuranceHandler} isLoading={isLoading} />}</div>
      {otpActive && <VerifyOtpComponent phone={mobileNumber} handler={closeOTPHandler} />}
    </>
  );
};

export default CarInsurancePage;

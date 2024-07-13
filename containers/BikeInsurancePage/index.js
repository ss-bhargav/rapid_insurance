import styles from './BikeInsurancePage.module.scss';
import bikeInsurance from 'public/bike-insurance.svg';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import BikeNumberForm from 'components/BikeNumber/BikeNumberForm';
import { useRouter } from 'next/router';
// import BikeInsuranceForm1 from 'components/BikeInsurance/BikeInsuranceForm';
import VerifyOtpComponent from 'components/Dailog/VerifyOtpDailog';
import { AddQuotation, GetVehicleDetails, GetQuotation, UpdateQuotation } from 'helper/api';
import FullScreenLoading from 'components/Dailog/FullScreenLoading';
import InsuranceForm from 'components/BikeInsurance/BikeInsuranceForm';

const BikeInsurancePage = ({ path }) => {
  const router = useRouter();
  ///// Values State
  const [bikeNumber, setBikeNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRollover, setIsRollover] = useState(false);
  const [bikeDetails, SetBikeDetails] = useState({});
  const [newBikeForm, setNewBikeForm] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpActive, setOtpActive] = useState(false);
  const [clientObject, setClientObject] = useState({});
  const [loading, setLoading] = useState(false);
  ///// Form States
  const [bikeNumberForm, setBikeNumberForm] = useState(true);
  const [showInsuranceForm, setShowInsuranceForm] = useState(false);

  //////// Values Hanlders
  const bikeNumberHandler = async (value) => {
    const c_registration_number = `${value.state_code}${value.rto_code}${value.series}${value.number}`;
    setBikeNumber(c_registration_number);
    setIsLoading(true);
    try {
      const data = await GetVehicleDetails(c_registration_number);
      if (data.status === 200) {
        if (data?.data?.c_vehicle_category.toUpperCase() === 'M-CYCLE/SCOOTER(2WN)') {
          SetBikeDetails(data.data);
          setBikeNumberForm(false);
          setShowInsuranceForm(true);
        } else {
          const userRes = confirm('Looks like you have entered a car registration number, Click ok to contine to car insurance page');
          if (userRes) {
            router.push('/car-insurance');
          }
        }
        setIsLoading(false);
      }
    } catch (error) {
      setBikeNumberForm(false);
      setShowInsuranceForm(true);
      setIsLoading(false);
    }
  };

  const bikeNumberHandler2 = () => {
    setBikeNumberForm(false);
    setShowInsuranceForm(true);
    setIsRollover(true);
  };

  const bikeInsuranceHandler = async (values) => {
    const planType = values.c_plan.split('-');
    const client_object = {
      ...values,
      c_make_model: `${values.c_make},${values.c_model},${values.c_variant}, ${values.c_fuel_type}`,
      c_own_damage: planType[3],
      c_third_party_damage: planType[1],
      c_policy_tenure: planType[3],
      c_registration_number: bikeNumber,
    };
    setClientObject(client_object);
    setMobileNumber(client_object.c_mobile);
    setOtpActive(true);
  };

  const verifyOTPHandler = async (res) => {
    const queryObject = router.query;
    if (res.message === 'Success') {
      setOtpActive(false);
      setIsLoading(true);
      const client_obj = { ...clientObject };
      if (Object.keys(queryObject).length > 0) {
        const updateQuotationRes = await UpdateQuotation(router.query.editDetails, client_obj);
        if (updateQuotationRes) {
          if (path === 'pos') {
            return router.push({
              pathname: '/pos/bike-insurance/quotations',
              query: {
                quotationsId: updateQuotationRes?.data[0]?.quotation_id,
              },
            });
          }
          router.push({
            pathname: '/bike-insurance/quotations',
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
              pathname: '/pos/bike-insurance/quotations',
              query: {
                quotationsId: addQuotationRes?.data[0]?.quotation_id,
              },
            });
          }
          router.push({
            pathname: '/bike-insurance/quotations',
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

  const newBikeHandler = () => {
    setBikeNumberForm(false);
    setIsRollover(false);
    setNewBikeForm(true);
  };

  return (
    <>
      <div className={styles.bikeMainWrapper}>
        {loading && router.query.editDetails && <FullScreenLoading />}
        {bikeNumberForm && (
          <div className="col-12 d-md-flex justify-content-center align-items-center p-0" style={{ height: '85vh' }}>
            <div className="row m-0 pt-3 pt-md-0">
              <div className="col-12 col-md-6">
                <Image src={bikeInsurance} alt="Lmv Insurance" width="600" height="400" />
              </div>
              <div className="col-12 col-md-6">
                <BikeNumberForm submitHandler={bikeNumberHandler} linkHandler={bikeNumberHandler2} isLoading={isLoading} newBikeHandler={newBikeHandler} />
              </div>
            </div>
          </div>
        )}
      </div>
      {showInsuranceForm && <InsuranceForm rollover={true} setInsurance={bikeInsuranceHandler} values={bikeDetails} isLoading={isLoading} />}
      {newBikeForm && <InsuranceForm rollover={false} setInsurance={bikeInsuranceHandler} values={bikeDetails} isLoading={isLoading} />}
      {otpActive && <VerifyOtpComponent phone={mobileNumber} handler={verifyOTPHandler} />}
    </>
  );
};

export default BikeInsurancePage;

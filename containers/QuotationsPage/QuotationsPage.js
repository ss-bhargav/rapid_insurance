import { GetPcPremiumQuotes, GetTwPremiumQuotes, GetVarients, GetPcVarients, UpdateQuotation, GetInsuranceCompanies, GetQuotation } from 'helper/api';
import { Button } from '@mui/material';
import Divider from '@mui/material/Divider';
import QuotationCard from 'components/QuotationCard/QuotationCard';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import styles from './QuotationsPage.module.scss';
import FullScreenLoading from 'components/Dailog/FullScreenLoading';
import { useRouter, withRouter } from 'next/router';
import { EncryptObject } from 'helper/hashing';
import { quotationSortingOptions, quotations, AddonsResetValues } from 'helper/constants';
import QuotationDetails from 'components/Dailog/QuotationDetails';
import sortingFunction, { defaultSort } from 'helper/sortingFunction';
import Addons from 'components/Dailog/addons';
import SummaryDetails from 'components/Dailog/SummaryDetails';
import AlertDialog from 'components/Dailog/AlertDialog';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import VehicleDetails from './VehicleDetails';
import Errors from './Errors.js';
import { AddonsInitialValues } from 'helper/formik-initial-values';
import EditDetails from 'components/Dailog/EditDetails';

const QuotationsPage = ({ props, clientRes, path }) => {
  console.log('props', props);
  console.log('client', clientRes);
  const [addonsValues, setAddonsValues] = useState(AddonsInitialValues(clientRes));
  const [insurerDetails, setInsurerDetails] = useState(clientRes);
  const [isLoading, setIsLoading] = useState(false);
  const [varients, setVarients] = useState([]);
  const [quote, setQuote] = useState(null);
  const [quotationSortingValue, setQuotationSortingValue] = useState('P-L-H');
  const [showQuotationDetails, setShowQuotationDetails] = useState(false);
  const [data, setData] = useState({});
  const [sortQuotationData, setSortQuotationData] = useState([]);
  const [errorFreeArray, setErrorFreeArray] = useState([]);
  const [errorArray, setErrorArray] = useState([]);
  const [displayQuotations, setDisplayQuotation] = useState([]);
  const [showCoverItems, setShowCoverItems] = useState(false);
  const [showAddons, setShowAddons] = useState(false);
  const [minMaxValues, setMinMaxValues] = useState([]);
  const router = useRouter();
  const [customerDetails, setCustomerDetails] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [editOptions, setEditOptions] = useState(false);
  const [insurers, setInsurers] = useState([]);
  const [companiesObject, setCompaniesObject] = useState({ ...props?.companies });

  const insuranceType = router.pathname.split('/')[router.pathname.split('/').length - 2];

  useEffect(() => {
    async function fetchData() {
      const response2 = await GetInsuranceCompanies();
      setInsurers(response2.data);
    }
    fetchData();
  }, []);

  useEffect(async () => {
    let errorFreeData = [];
    let errorData = [];
    const client_object = {
      ...insurerDetails,
      ...props?.companies,
    };
    UpdateQuotation(router.query.quotationsId, client_object);
    if (props?.status === 200) {
      props?.data?.map((obj, index) => {
        if (obj.error === 'false' || obj.error === false) {
          errorFreeData.push(obj.data);
        } else {
          errorData.push(obj);
        }
      });
    }

    setErrorFreeArray(errorFreeData);
    setErrorArray(errorData);
    setDisplayQuotation([...errorFreeData]);
    setSortQuotationData([...errorFreeData]);
    // const varientResponse = await GetVarients(props.query.manufacturer_code, props.query.model_code);
    // setVarients(varientResponse.varients);
    setMinMaxValues([...errorFreeData]);
  }, []);

  // sorting function
  const sortingQuotations = (value, displayQuotations) => {
    let sortingArray;
    switch (value) {
      case 'P-L-H':
        sortingArray = sortingFunction(displayQuotations, 's_net_premium', 1);
        break;
      case 'P-H-L':
        sortingArray = sortingFunction(displayQuotations, 's_net_premium');
        break;
      case 'IDV-L-H':
        sortingArray = sortingFunction(displayQuotations, 's_idv', 1);
        break;
      case 'IDV-H-L':
        sortingArray = sortingFunction(displayQuotations, 's_idv');
        break;
      default:
        sortingArray = sortingFunction(displayQuotations, 's_net_premium', 1);
        break;
    }
    setSortQuotationData(sortingArray);
  };

  useEffect(() => {
    sortingQuotations('P-L-H', displayQuotations);
  }, [displayQuotations]);

  useEffect(() => {
    setMinMaxValues(defaultSort(minMaxValues, 'c_net_premium'));
  }, [minMaxValues]);

  const onChangeHandler = (value, name) => {
    if (value === 'false' || value === 'true') {
      setAddonsValues({
        ...addonsValues,
        [name]: value === 'false' ? false : true,
      });
      return;
    }

    if (typeof value === 'string' && event.target.type === 'radio') {
      setAddonsValues({
        ...addonsValues,
        [name]: Number(value),
      });
      return;
    }
    if (typeof value === 'string' && event.target.type === 'number') {
      setAddonsValues({
        ...addonsValues,
        [name]: value,
      });
    }
  };

  const onBuyHandler = async (values) => {
    setIsLoading(true);
    const companyObject = { ...companiesObject[values.s_company_name] };
    const client_object = { ...insurerDetails, addons: { ...addonsValues }, company_object: { ...companyObject }, ...companiesObject };
    const id = router.query.quotationsId;

    const updateRes = await UpdateQuotation(id, client_object);
    if (updateRes) {
      if (path === 'pos') {
        return router.push({
          pathname: '/pos/buy-now',
          query: { details: id },
        });
      }
      router.push({
        pathname: '/buy-now',
        query: { details: id },
      });
    }
  };

  const addonsReset = AddonsResetValues();
  // Reset Addons to default values
  const onResetFormHandler = () => {
    setAddonsValues({
      ...addonsValues,
      ...addonsReset,
    });
  };

  const regenerateQuotationFunc = async (clientObject) => {
    try {
      setIsLoading(true);
      setErrorArray([]);
      let response;

      const obj = {
        ...clientObject,
        ...companiesObject,
      };

      if (insuranceType !== 'car-insurance') {
        response = await GetTwPremiumQuotes(obj);
      } else {
        response = await GetPcPremiumQuotes(obj);
      }
      setCompaniesObject(response?.companies);

      const responseObj = {
        ...clientObject,
        ...response?.companies,
      };

      await UpdateQuotation(router.query.quotationsId, responseObj);
      let filteredArray = [];
      let errorObj = [];
      if (response.status === 200) {
        response.data.map((obj, index) => {
          if (!obj.error) {
            filteredArray.push(obj.data);
            setErrorFreeArray(filteredArray);
          } else {
            errorObj.push(obj);
            setErrorArray(errorObj);
          }
        });
        setDisplayQuotation(filteredArray);
        setMinMaxValues(filteredArray);
        window.scrollTo(0, 0);
        setIsLoading(false);
      }
    } catch (error) {
      window.scrollTo(0, 0);
      setIsLoading(false);
    }
  };

  // Submitting selected addons for revised premium quotation
  const addonsSubmitHandler = async (event) => {
    event.preventDefault();
    setShowCoverItems(false);
    setShowAddons(true);
    const clientObject = { ...insurerDetails, addons: { ...addonsValues } };
    regenerateQuotationFunc(clientObject);
  };

  const onChangeSelectHandler = (e) => {
    sortingQuotations(e.target.value, displayQuotations);
    setQuotationSortingValue(e.target.value);
  };

  const onClickInfoHandler = (data) => {
    setShowQuotationDetails(true);
    setData(data);
  };

  const alertCloseHandler = () => {
    setShowQuotationDetails(false);
    setShowCoverItems(false);
    setCustomerDetails(false);
    setEditOptions(false);
  };

  const showCoverItemsHandler = () => {
    setShowCoverItems(true);
  };

  const showCustomerDetails = () => {
    setCustomerDetails(true);
  };

  const EditHandler = () => {
    setEditOptions(true);
  };

  const updateFormHandler = (values) => {
    setEditOptions(false);
    setInsurerDetails({
      ...insurerDetails,
      ...values,
    });
    const updateInsurerDetails = {
      ...insurerDetails,
      ...values,
    };
    const clientObject = { ...updateInsurerDetails, addons: { ...addonsValues } };
    regenerateQuotationFunc(clientObject);
  };

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badgeStyledBadge': {
      right: -3,
      top: '10px',
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0',
    },
  }));

  const ErrorHandler = (values) => {
    if (values.length > 0) {
      setErrorAlert(true);
    }
  };

  const closeErrorAlert = () => {
    setErrorAlert(false);
  };

  let sortSystemIDV = [];
  const filterSystemIDV = sortQuotationData.filter((data) => {
    sortSystemIDV.push(data?.s_system_idv);
  });

  return (
    <div className={styles.tw_quote_wrapper}>
      {isLoading && <FullScreenLoading />}
      <div className={styles.quotation_section}>
        <div className={styles?.header_section}>{/* <VehicleDetails data={insurerDetails} minMaxValues={minMaxValues} /> */}</div>
        {/* <Divider classes={styles.divider} /> */}
        {/* <div className={styles.filter_section}>
          <div className={styles.no_of_insurances}>
            <p>Insurer: 7</p>
          </div>
          <div className={styles.filter}>
           
          </div>
        </div> */}
        <div className={styles.quotationSelectors}>
          <div className={styles.quotionsPageSelectors}>
            <Button color="primary" variant="contained" size="small" onClick={EditHandler}>
              Edit
            </Button>
            <Button color="primary" variant="outlined" size="small" onClick={showCoverItemsHandler}>
              cover
            </Button>
            <Button color="primary" variant="outlined" size="small" onClick={showCustomerDetails}>
              Summary
            </Button>
            <Button variant="outlined" color="error" style={{ padding: '2px 18px' }} onClick={() => ErrorHandler(errorArray)}>
              <StyledBadge badgeContent={errorArray.length} color="error">
                Failed&nbsp;&nbsp;
              </StyledBadge>
            </Button>
          </div>
          <div className={styles.sortingDropdown}>
            <select
              onChange={(e) => {
                onChangeSelectHandler(e);
              }}
            >
              {quotationSortingOptions.map((list, index) => {
                return (
                  <option value={list.value} key={list.value}>
                    {list.display}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className={styles?.titles_section}>
          <div className={styles.plan}>
            <p>Insurance &#38; Plan</p>
          </div>
          <div className={styles.addons}>
            <p>Addons</p>
          </div>
          <div className={styles.premium}>
            <p>Premium/Year Excl.Tax</p>
          </div>
        </div>
        <div className={styles?.insurance_cards_section}>
          {displayQuotations.length > 0 ? (
            sortQuotationData.map((quotation, index) => {
              if (Object.keys(quotation).length > 0) {
                return (
                  <div className={styles.insurance_card} key={quotation?.s_company_name}>
                    {/* <input className={classNames('form-check-input', styles.checkbox)} type="checkbox" value="" /> */}
                    <QuotationCard data={quotation} onSubmitHandler={onBuyHandler} showAddons={showAddons} handler={() => onClickInfoHandler(quotation)} />
                  </div>
                );
              } else {
                return <h2>No Quotations Found</h2>;
              }
            })
          ) : (
            <h2>No Quotations Found</h2>
          )}
        </div>
      </div>
      {errorAlert && <Errors data={errorArray} handleClose={closeErrorAlert} />}
      {showQuotationDetails && <QuotationDetails data={data} handleClose={alertCloseHandler} />}
      {showCoverItems && <Addons data={addonsValues} handler={onChangeHandler} closeDialogHandler={alertCloseHandler} submitHandler={addonsSubmitHandler} resetHandler={onResetFormHandler} IDV={Math.min(...sortSystemIDV)} />}
      {customerDetails && <SummaryDetails data={insurerDetails} handler={alertCloseHandler} />}
      {editOptions && <EditDetails insurers={insurers} clientObject={insurerDetails} details={props} closeDialogHandler={alertCloseHandler} updateFormDetails={updateFormHandler} />}
    </div>
  );
};

export default withRouter(QuotationsPage);

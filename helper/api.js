import axios from 'axios';

// const URL = process.env.DEV_URL
// const URL = process.env.PROD_URL

const URL = 'http://localhost:3000';
// const URL = 'https://beta.lmvinsurance.com';
// const URL = 'https://rapid-insurance-lmv.herokuapp.com';

export let DeploymentURL = URL;

///////////////////////////////////////// MAKE, MODEL & VARIENTS

export const GetVehicleDetails = async (value) => {
  const { data } = await axios.get(`${DeploymentURL}/api/vehicle/${value}`);
  return data;
};

export const GetTwManufacturers = async () => {
  const { data } = await axios.get(`${DeploymentURL}/api/vehicle/two-wheeler/manufacturers`);
  return data;
};

export const GetTwModels = async (manufacturer) => {
  const values = { manufacturer };
  const { data } = await axios.post(`${DeploymentURL}/api/vehicle/two-wheeler/models`, values);
  return data;
};

export const GetTwVarients = async (manufacturer, model) => {
  const values = { manufacturer, model };
  const { data } = await axios.post(`${DeploymentURL}/api/vehicle/two-wheeler/variants`, values);
  return data;
};

export const GetTwFuelTypes = async (manufacturer, model) => {
  const values = { manufacturer, model };
  const { data } = await axios.post(`${DeploymentURL}/api/vehicle/two-wheeler/fuel`, values);
  return data;
};

export const GetPcManufacturers = async () => {
  const { data } = await axios.get(`${DeploymentURL}/api/vehicle/private-car/manufacturers`);
  return data;
};

export const GetPcModels = async (manufacturer) => {
  const values = { manufacturer };
  const { data } = await axios.post(`${DeploymentURL}/api/vehicle/private-car/models`, values);
  return data;
};

export const GetPcVarients = async (manufacturer, model) => {
  const values = { manufacturer, model };
  const { data } = await axios.post(`${DeploymentURL}/api/vehicle/private-car/variants`, values);
  return data;
};

export const GetPcFuelTypes = async (manufacturer, model) => {
  const values = { manufacturer, model };
  const { data } = await axios.post(`${DeploymentURL}/api/vehicle/private-car/fuel`, values);
  return data;
};

/////////////////////////////// RTO DETAILS

export const GetAllLocations = async () => {
  const { data } = await axios.get(`${DeploymentURL}/api/rto/all-locations`);
  return data;
};

export const GetPcAllLocations = async () => {
  const { data } = await axios.get(`${DeploymentURL}/api/rto/pc-all-locations`);
  return data;
};

////////////////////////////////// INSURANCE COMPANY'S

export const GetInsuranceCompaniesOld = async () => {
  const { data } = await axios.get(`${DeploymentURL}/api/insurance_companies`);
  return data;
};

export const GetInsuranceCompanies = async () => {
  const { data } = await axios.get(`${DeploymentURL}/api/insurers`);
  return data;
};

////////////////////////////////// GENERATE QUOTATION

export const GetTwPremiumQuotes = async (values) => {
  const { data } = await axios.post(`${DeploymentURL}/api/two-wheeler/premium`, values);
  return data;
};

export const GetPcPremiumQuotes = async (values) => {
  const { data } = await axios.post(`${DeploymentURL}/api/private-car/premium`, values);
  return data;
};

////////////////////////////////// OTP

export const GetOtp = async (values) => {
  const { data } = await axios.post(`${DeploymentURL}/api/auth/send-otp`, values);
  return data;
};

export const VerifyOtp = async (values) => {
  const { data } = await axios.post(`${DeploymentURL}/api/auth/verify-otp`, values);
  return data;
};

//////////////////////////// KOTAK API's

export const KotakTwProposalHandler = async (values) => {
  const { data } = await axios.post(`${DeploymentURL}/api/kotak/two-wheeler/proposal`, values);
  return data;
};
export const KotakPcProposalHandler = async (values) => {
  const { data } = await axios.post(`${DeploymentURL}/api/kotak/private-car/proposal`, values);
  return data;
};

export const KotakVerifyTransactionHandler = async (values) => {
  const { key, command, hash, var1 } = values;
  const { data } = await axios.post(`${DeploymentURL}/api/kotak/payment/verify-payment`, {
    key,
    command,
    hash,
    var1,
  });
  return data;
};

export const KotakPolicyDocumentHandler = async (values) => {
  const { data } = await axios.post(`${DeploymentURL}/api/kotak/policy-document`, values);
  return data;
};

export const KotakInsurersHandler = async () => {
  const { data } = await axios.get(`${DeploymentURL}/api/kotak/insueres`);
  return data;
};

export const KotakFinancersHandler = async () => {
  const { data } = await axios.get(`${DeploymentURL}/api/kotak/financers`);
  return data;
};

export const KotakBuyNowPayUHandler = async (values) => {
  const { data } = await axios.post(`${DeploymentURL}/api/kotak/payment/buy-now`, values);
  return data;
};

//////////////////////////// TATA AIG API's

export const TataAigPaymentGatewayHandler = async (values) => {
  const { data } = await axios.post(`https://pipuat.tataaiginsurance.in/tagichubws/cpirequest.jsp`, values);
  return data;
};

export const TataAigTwProposalHandler = async (values) => {
  const { data } = await axios.post(`${DeploymentURL}/api/tata-aig/two-wheeler/proposal`, values);
  return data;
};

export const TataAigPcProposalHandler = async (values) => {
  const { data } = await axios.post(`${DeploymentURL}/api/tata-aig/private-car/proposal`, values);
  return data;
};

export const TataAigPaymentHandler = async (proposal_number) => {
  const values = { proposal_number: proposal_number, src: 'TP' };
  const { data } = await axios.post(`${DeploymentURL}/api/tata-aig/payment/make`, values);
  return data;
};

export const TataAigPolicyDocumentHandler = async (values) => {
  const { data } = await axios.post(`${DeploymentURL}/api/tata-aig/policy-document`, values);
  return data;
};

///////////////////////////// TRANSACTION API'S
export const VerifyTransactionIdHandler = async (values) => {
  const { data } = await axios.post(`${DeploymentURL}/api/transactions/txnid-verify`, {
    txnid: values,
  });
  return data;
};

export const GenerateNewTransactionIdHandler = async () => {
  const { data } = await axios.get(`${DeploymentURL}/api/transactions/generate-txnid`);
  return data;
};

///////////////////////////// CUSTOMER API'S

export const VerifyCRNHandler = async (values) => {
  const { data } = await axios.post(`${DeploymentURL}/api/customer/verify-crn`, {
    crn: values,
  });
  return data;
};

export const GenerateNewCRNHandler = async () => {
  const { data } = await axios.get(`${DeploymentURL}/api/customer/generate-crn`);
  return data;
};

//////////////////////////////// QUOTATION API'S

export const AddQuotation = async (values) => {
  if (Object.keys(values).length > 0) {
    const { data } = await axios.post(`${DeploymentURL}/api/quotation/add`, values);
    return data;
  }
};

export const UpdateQuotation = async (quotation_id, client_object) => {
  const values = { quotation_id, client_object };
  if (Object.keys(client_object).length > 0) {
    const { data } = await axios.post(`${DeploymentURL}/api/quotation/update`, values);
    return data;
  }
};

export const GetQuotation = async (values) => {
  console.log(values)
  const { data } = await axios.post(`${DeploymentURL}/api/quotation/get`, { quotation_id: values });
  return data;
};

//////////////////////////////// OTHER API'S

export const PostTwoWheelerBuyNow = async (values) => {
  const { data } = await axios.post(`${DeploymentURL}/api/two-wheeler/buy-now`, values);
  return data;
};

//////////////////////////////Pos routes

export const PosSubmitDetails = async (values) => {
  const { data } = await axios.post(`${DeploymentURL}/api/pos/pos-signup`, values);
  return data;
};

export const PosValidateLogin = async (values) => {
  const { data } = await axios.post(`${DeploymentURL}/api/pos/pos-login`, values);
  return data;
};

import { format } from 'date-fns';
import getYear from 'date-fns/getYear';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import getDate from 'date-fns/getDate';
import differenceInMonths from 'date-fns/differenceInMonths';
import differenceInYears from 'date-fns/differenceInYears';
import uatTwModelArray from '../../db/kotak/uat/tw_model.json';
import uatTwRtoArray from '../../db/kotak/uat/tw_rto.json';
import { errorResponse, splitRegistrationNumber } from 'serverHelper/helperFunctions';
import { constants } from 'serverHelper/constants';
import { KotakTwMakeModelVariantHandler } from 'server_helper/serverSideFunctions/vehicle/twoWheeler';
import { KotakRtoDetails } from 'server_helper/serverSideFunctions/rto';
import { KotakInsurersDetails } from 'server_helper/serverSideFunctions/insurers';

///////////////////////////////////////////////////  PREMIUM  //////////////////////////////////////

export let KotakTwPremiumClientToServerMapper = (client) => {

  const example = {
    c_aa_membership: "No",
    c_aadhar_number: "266665093572",
    c_address_line1: "rice mill street",
    c_address_line2: "rice mill street",
    c_address_line3: "",
    c_anti_theif_device: "No",
    c_chassis_number: "ts5445466554w8789",
    c_city: "tanuku",
    c_claim_last_year: false,
    c_colour: "",
    c_company_name: "",
    c_customer_type: "I",
    c_dob: "1997/01/03",
    c_electrical_accessories: "0",
    c_email: "saikumar.solasa@gmail.com",
    c_engine_number: "ts88773774",
    c_existing_policy: true,
    c_financed: "",
    c_financier_name: "",
    c_financier_type: "",
    c_first_name: "sai kumar solasa",
    c_fuel_type: "Petrol",
    c_full_name: "sai kumar solasa",
    c_gender: "male",
    c_gst_number: "",
    c_idv: "37000",
    c_is_vehicle_financed: false,
    c_last_name: "solasa",
    c_make: "HERO HONDA",
    c_make_model: "HERO HONDA,PASSION,DISC (149CC), Petrol",
    c_manufacture_year_month: "2019/02/10",
    c_maritial_status: "single",
    c_mobile: "7702577123",
    c_model: "PASSION",
    c_ncb: "20",
    c_nominee_dob: "1970/03/31",
    c_nominee_full_name: "lakshmi",
    c_nominee_relation: "mother",
    c_non_electrical_accessories: "8000",
    c_own_damage: "1",
    c_pan_number: "",
    c_pincode: "534218",
    c_place_of_registration: "MH01 MUMBAI",
    c_plan: "TP-1-OD-1",
    c_policy_tenure: "1",
    c_prev_insurer: "ACKO",
    c_prev_policy_expire_date: "2022-05-17",
    c_prev_policy_number: "1234566",
    c_pucc_number: "",
    c_pucc_valid_date: "",
    c_registration_date: "2020-03-10",
    c_registration_number: "mh01ab1234",
    c_rollover: true,
    c_rto_location: "MH01 MUMBAI",
    c_state: "andhra pradesh",
    c_third_party_damage: "1",
    c_title: "mr",
    c_tp_previous_insurer: "",
    c_tppd: "Yes",
    c_transaction_id: 91652786630920,
    c_valid_pucc: false,
    c_variant: "DISC (149CC)",
    c_vehicle_colour: "black",
    c_voluntary_excess: "No",
  }

  console.log(JSON.stringify(example))

  /////////////////////////----- VALIDATIONS -----/////////////////////////

  if (client.c_manufacture_year_month && client.c_registration_date) {
    const days = differenceInCalendarDays(new Date(client.c_registration_date), new Date(client.c_manufacture_year_month));
    if (days < 0) return errorResponse('Manufacture Date should not be lesser than the registration date');
  }

  if (differenceInMonths(new Date(), new Date(client.c_manufacture_year_month)) / 12 > 9.99) {
    return errorResponse('Vehicle age must be below 9.5 years');
  }

  if (client.c_engine_number && client.c_engine_number.toString().length < 8) {
    return errorResponse('Engine number should be minimun 8 characters');
  }

  if (client.rollover) {
    if (client.c_chassis_number && client.c_chassis_number.toString().length < 8) {
      return errorResponse('Chassis number should be minimun 8 characters for rollover');
    }
  } else {
    if (client.c_chassis_number && client.c_chassis_number.toString().length > 17) {
      return errorResponse('Chassis number should be below or only 17 characters for new business');
    }
  }

  if (!client.c_rollover) {
    if (client.c_registration_date) {
      const dateDiff = differenceInMonths(new Date(), new Date(client.c_registration_date));
      if (dateDiff > 6) {
        return errorResponse('Bike must be registered between 6 months from today');
      } else if (dateDiff === 6) {
        if (getDate(new Date(client.c_registration_date)) > getDate(new Date())) {
          return errorResponse('Bike must be registered before 6 months on same date');
        }
      }
    } else {
      return errorResponse('Registration Date is mandatory for new business');
    }
  }
  /////////////////////////----- PLAN TYPE DETAILS     -----/////////////////////////

  const planType = client.c_plan.split('-');
  let third_party_tenure = planType[1];
  let own_damage_tenure = planType[3];
  let policy_tenure = planType[3];
  let vProductTypeODTP = '';
  let nProductCode = '';

  if (client.c_rollover) {
    vProductTypeODTP = 1022;
  } else {
    vProductTypeODTP = 1066;
  }

  if (client.c_plan === 'TP-1-OD-0') {
    nProductCode = 3192;
  } else if (third_party_tenure > 0 && own_damage_tenure > 0) {
    nProductCode = 3191;
  }

  /////////////////////////----- VEHICLE & RTO DETAILS -----/////////////////////////

  let nManufactureYear = getYear(new Date(client.c_manufacture_year_month));
  if (!nManufactureYear) return errorResponse('Manufacture Year should not be null or invalid format');

  let vehicleDetails = KotakTwMakeModelVariantHandler(client);
  if (Object.keys(vehicleDetails).length === 0) {
    return errorResponse('Vehicle Details not available Kotak Database');
  }

  let rtoDetails = KotakRtoDetails(client.c_place_of_registration);
  if (Object.keys(rtoDetails).length === 0) {
    return errorResponse('Vehicle Details not available Kotak Database');
  }

  let dSelectedRegDate = format(new Date(client.c_registration_date), 'dd/MM/yyyy');

  if (vehicleDetails?.TXT_SEGMENTTYPE?.toLowerCase() === 'motor cycle' && client.c_place_of_registration.toLowerCase().slice(0, 4).includes('gj')) {
    return errorResponse('Motorcycle Segment to be blocked for (Gujarat - GJ) and Scooter segment to be kept open');
  }
  if (!dSelectedRegDate) return errorResponse('Registartion date should not be null or invalid format');

  let vRegistrationNumber1 = null;
  let vRegistrationNumber2 = null;
  let vRegistrationNumber3 = null;
  let vRegistrationNumber4 = null;
  let registration_code = client.c_place_of_registration.slice(0, 4);

  if (client.c_registration_number) {
    if (registration_code) {
      if (client.c_registration_number.toLowerCase().includes(registration_code.toLowerCase())) {
        const response = splitRegistrationNumber(client.c_registration_number);
        vRegistrationNumber1 = response.num1;
        vRegistrationNumber2 = response.num2;
        vRegistrationNumber3 = response.num3;
        vRegistrationNumber4 = response.num4;
      } else {
        return errorResponse("Registartion Number and Registration Code doesn't match");
      }
    }
  } else {
    if (registration_code) {
      vRegistrationNumber1 = registration_code.slice(0, 2).toUpperCase();
      vRegistrationNumber2 = registration_code.slice(2, 4);
    }
  }

  /////////////////////////----- PREV POLICY DETAILS -----/////////////////////////
  let dSelectedPreviousPolicyExpiryDate = null;
  let bIsNoPrevInsurance;
  let nTotalClaimCount = 0;
  let nClaimCount1Year = 0;
  let nClaimCount2Year = 0;
  let nClaimCount3Year = 0;
  let nSelectedPreviousPolicyTerm = 0;
  let nSelectedRequiredPolicyTerm;

  if (client.c_rollover) {
    nSelectedRequiredPolicyTerm = client.c_policy_tenure;
  } else {
    nSelectedRequiredPolicyTerm = 1;
  }

  let prevInsurerDetails = {}

  if (client.c_prev_insurer) {
    prevInsurerDetails = KotakInsurersDetails(client?.c_prev_insurer);
    if (Object.keys(prevInsurerDetails).length === 0) {
      return errorResponse("Previous Insuere details not found in kotak database");
    }
  }

  if (client?.c_rollover) {
    if (client?.c_prev_policy_expire_date) {
      dSelectedPreviousPolicyExpiryDate = format(new Date(client?.c_prev_policy_expire_date), 'dd/MM/yyyy');
    } else {
      return errorResponse('Previous Policy date should not be null or invalid format');
    }
  }

  if (client.c_rollover) {
    bIsNoPrevInsurance = client?.c_prev_insurer ? false : true;
  } else {
    bIsNoPrevInsurance = true;
  }

  if (client.c_rollover) {
    if (client.c_claim_last_year) {
      nTotalClaimCount = 1;
    }

    if (Number(nTotalClaimCount) === 1) {
      nClaimCount1Year = 0;
    }
    if (Number(nTotalClaimCount) === 2) {
      nClaimCount2Year = 0;
    }
    if (Number(nTotalClaimCount) === 3) {
      nClaimCount3Year = 0;
    }
    nSelectedPreviousPolicyTerm = 1;
  }

  /////////////////////////----- CUSTOMER DETAILS -----/////////////////////////

  let vCSCustomerFirstName = '';
  let vCSCustomerLastName = '';
  let vCSCustomerMobileNo = '';

  if (client.c_full_name) {
    if (client.c_full_name.split(' ').length > 1) {
      vCSCustomerFirstName = client.c_full_name.split(' ')[0];
      vCSCustomerLastName = client.c_full_name.split(' ')[1];
    } else {
      vCSCustomerFirstName = client.c_full_name;
      vCSCustomerLastName = client.c_full_name;
    }
  }
  if (Number(client.c_mobile) && client.c_mobile.length == 10) {
    vCSCustomerMobileNo = client.c_mobile;
  } else {
    return errorResponse('Please enter 10 digits mobile number');
  }

  /////////////////////////----- ADDONS DETAILS -----/////////////////////////

  let bIsNonElectAccessReq = Number(client?.addons?.c_non_electrical_accessories) ? true : false;
  let nNonElectAccessSumInsured = bIsNonElectAccessReq ? Number(client?.addons?.c_non_electrical_accessories) : 0;

  let bIsElectAccessReq = Number(client?.addons?.c_electrical_accessories) ? true : false;
  let nElectAccessSumInsured = bIsElectAccessReq ? Number(client?.addons?.c_electrical_accessories) : 0;

  let bIsSideCar = Number(client?.addons?.c_side_car) ? true : false;
  let nSideCarSumInsured = bIsSideCar ? Number(client?.addons?.c_side_car) : 0;

  let bIsPACoverForUnnamed = Number(client?.addons?.c_pa_unnamed_passenger) ? true : false;
  let nPACoverForUnnamedSumInsured = bIsPACoverForUnnamed ? Number(client?.addons?.c_pa_unnamed_passenger) : 0;

  let bIsCompulsoryPAWithOwnerDriver = client?.addons?.c_pa_cover_owner_driver ? true : false;

  let bIsLossAccessoriesReq = Number(client.c_loss_accessories) ? true : false;
  let nLossAccessSumInsured = bIsLossAccessoriesReq ? Number(client.c_loss_accessories) : 0;

  let nRequestIDV = 0;
  let vPAODTenure = 0;

  if (client?.addons?.c_pa_cover_owner_driver) {
    if (client.c_rollover) {
      vPAODTenure = 1;
    } else {
      if (Number(client.c_policy_tenure) === 1 || Number(client.c_policy_tenure) === 5 || Number(client.c_policy_tenure) === 3) {
        vPAODTenure = Number(client.c_policy_tenure);
      }
    }
  } else {
    vPAODTenure = 0;
  }

  if (Number(client?.addons?.c_request_idv)) {
    if (Number(client?.kotak?.s_system_idv)) {
      let IdvLimit = Number(client.kotak.s_system_idv) * 0.1;
      let minimum = Number(client.kotak.s_system_idv) - IdvLimit;
      let maximum = Number(client.kotak.s_system_idv) + IdvLimit;

      if (Number(client?.addons?.c_request_idv) >= minimum && Number(client?.addons?.c_request_idv) <= maximum) {
        nRequestIDV = Number(client?.addons?.c_request_idv);
      } else {
        return errorResponse('Request IDV must be 10% greater or less than system idv');
      }
    } else {
      return errorResponse('System IDV is not valid, Please enter your details fetch the quote again');
    }
  }

  /////////////////////////----- BUYNOW DETAILS -----/////////////////////////

  let two_wheeler_premium = {
    vQuoteID: client?.kotak?.s_quote_id ? client.kotak?.s_quote_id : "",
    vWorkFlowID: client?.kotak?.s_workflow_id ? client.kotak?.s_workflow_id : "",
    vUserLoginId: 'BP000001',
    vIntermediaryCode: '3169170000',
    vOfficeName: 'MUMBAI-KALINA',
    nOfficeCode: 90002,
    bIsRollOver: client?.c_rollover ? true : false,
    nSelectedMakeCode: vehicleDetails?.MANUFACTURERCODE || '',
    vSelectedMakeDesc: vehicleDetails?.MANUFACTURER || '',
    nSelectedModelCode: vehicleDetails?.NUM_PARENT_MODEL_CODE || '',
    vSelectedModelDesc: vehicleDetails?.VEHICLEMODEL || '',
    nSelectedVariantCode: vehicleDetails?.Variant_Code_VEHICLEMODELCODE || '',
    vSelectedVariantDesc: vehicleDetails?.TXT_VARIANT || '',
    nSelectedVariantSeatingCapacity: vehicleDetails?.SEATINGCAPACITY || '',
    vSelectedVariantModelCluster: vehicleDetails?.TXT_MODEL_CLUSTER || '',
    nSelectedVariantCubicCapacity: vehicleDetails?.CUBICCAPACITY || '',
    vSelectedModelSegment: vehicleDetails?.TXT_SEGMENTTYPE || '',
    vSelectedFuelTypeDescription: vehicleDetails?.TXT_FUEL || '',
    nSelectedRTOCode: rtoDetails?.TXT_RTO_LOCATION_CODE || '',
    vSelectedRegistrationCode: rtoDetails?.NUM_REGISTRATION_CODE || '',
    vSelectedRTOCluster: rtoDetails?.TXT_RTO_CLUSTER || '',
    vSelectedRTOAuthorityLocation: rtoDetails?.TXT_RTO_LOCATION_DESC || '',
    vRTOStateCode: rtoDetails?.NUM_STATE_CODE || '',
    dSelectedRegDate,
    dSelectedPreviousPolicyExpiryDate,
    dPreviousPolicyStartDate: '/Date(-62135596800000)/',
    bIsNoPrevInsurance,
    nTotalClaimCount,
    nClaimCount1Year,
    nClaimCount2Year,
    nClaimCount3Year,
    nSelectedPreviousPolicyTerm,
    nSelectedNCBRate: Number(client?.c_ncb) ? Number(client?.c_ncb) : 0,
    vSelectedPrevInsurerDesc: prevInsurerDetails?.COMPANYNAME || '',
    vSelectedPrevInsurerCode: prevInsurerDetails?.TXT_COMPANY_CODE || '',
    vSelectedPrevPolicyType: client?.c_rollover ? 'Comprehensive' : '',
    nSelectedRequiredPolicyTerm: client?.c_rollover ? policy_tenure : 1,
    vRegistrationNumber1,
    vRegistrationNumber2,
    vRegistrationNumber3,
    vRegistrationNumber4,
    vEngineNumber: client.c_engine_number ? client.c_engine_number : null,
    vChassisNumber: client.c_chassis_number ? client.c_chassis_number : null,
    nClaimFreeYears: 0,
    bIsNonElectAccessReq,
    bIsElectAccessReq,
    bIsSideCar,
    bIsPACoverForUnnamed,
    nNonElectAccessSumInsured,
    nElectAccessSumInsured,
    nSideCarSumInsured,
    nPACoverForUnnamedSumInsured,
    vCustomerType: client.c_customer_type.toUpperCase(),
    nRequestIDV,
    nMarketMovement: -35,
    nResponseCreditScore: 0,
    bIsFlaProcessActive: false,
    bIsCreditScoreOpted: false,
    bIsNewCustomer: false,
    vCSCustomerFirstName,
    vCSCustomerLastName,
    dCSCustomerDOB: '22/04/2021',
    vCSCustomerMobileNo,
    vCSCustomerPincode: '',
    vCSCustomerIdentityProofType: '1',
    vCSCustomerIdentityProofNumber: '',
    vProductTypeODTP,
    nProductCode,
    nManufactureYear,
    bIsCompulsoryPAWithOwnerDriver,
    vPAODTenure,
    bIsLossAccessoriesReq,
    nLossAccessSumInsured,
    vAPICustomerId: '',
    vBusineeChanneltype: null,
    nPrimaryMOCode: 0,
    vPrimaryMOName: null,
    dApplicationDate: '/Date(-62135596800000)/',
    nCSCustomerGender: 0,
    vCSCustomerPANNumber: null,
    vCustomerFullName: null,
    vPosPanCard: '',
    vSPID: 'SP0000000039',
    IsRenewal: false,
    isIMT28: client?.addons?.c_legal_liability_pd ? client?.addons?.c_legal_liability_pd : false,
    vPersonIMT28: client?.addons?.c_legal_liability_pd ? 1 : 0,
    isIMT29: client?.c_legal_liability_employee ? client?.c_legal_liability_employee : false,
    vPersonIMT29: client?.c_legal_liability_employee ? 1 : 0,
    IsPartnerRequest: true,
  };

  return {
    error: false,
    data: two_wheeler_premium,
  };
};

export let KotakTwPremiumServerToClientMapper = (server) => {
  let makeModelDetails = `${server.vManufacturer} ${server.vModel} ${server.vVariant} ${server.vFuelType}`;
  let rtoDetails = `${server.vRTOAuthorityLocation}`;

  let server_object = {
    s_net_premium: server.nNetPremium,
    s_total_premium: server.nTotalPremium,
    s_idv: server.nFinalIDV,
    s_gst_percent: server.nGSTPercent,
    s_gst_amount: server.nGSTAmount,
    s_ncb_percent: server.nNoClaimBonusPercentageApplicable,
    s_ncb_amount: server.nNoClaimBonusDiscount,
    s_basic_od_premium: server.nOwnDamagePremium,
    s_basic_tp_premium: server.nBasicTPPremium,
    s_make_model_details: makeModelDetails,
    s_rto_details: rtoDetails,
    s_policy_expire_date: server.vPolicyEndDate,
    s_policy_start_date: server.vPolicyStartDate,
    s_electrical_accessories_si: server?.nElectricalIDVSI,
    s_electrical_accessories_premium: server?.nElectricalAccessoriesPremium,
    s_non_electrical_accessories_si: server?.nNonElectricalIDVSI,
    s_non_electrical_accessories_premium: server?.nNonElectricalAccessoriesPremium,
    s_pa_cover_owner_driver_premium: server.nPACoverForOwnerDriverPremium,
    s_pa_unnamed_passenger_si: server.nPACoverForUnnamedSumInsured,
    s_pa_unnamed_passenger_premium: server.nPAtoUnnamedHirerPillionPassngrPremium,
    s_loss_accessories_si: server?.nLossIDVSI,
    s_loss_accessories_premium: server?.nLossOfAccessoriesPremium,
    s_legal_liability_pd_premium: server?.nLegalLiabilityPaidDriverNo,
    s_side_car_si: server?.nSideCarValue,
    s_side_car_premium: server?.nSideCarDiscount,
    s_system_idv: server.nSystemIDV,
    s_is_credit_score_opted: server.nResponseCreditScore,
    s_quote_id: server.vQuoteID,
    s_workflow_id: server.vWorkFlowID,
    s_company_name: 'kotak',
    s_service_type: 'two_wheeler',
    s_plan_type: 'premium',
    s_plan_name: 'Kotak General Insurance',
  };

  return server_object;
};

///////////////////////////////////////////////////  PROPOSAL   //////////////////////////////////////

export let KotakTwProposalClientToServerMapper = (client) => {
  if (!client.company_object.s_workflow_id) return errorResponse('Workflow ID is required');
  if (!client.company_object.s_quote_id) return errorResponse('Quote ID is required');
  if (client.c_rollover && client.c_chassis_number.length <= 8) return errorResponse('ChassisNumber for rollover should be at least 8 characters long');
  if (!client.c_rollover && client.c_chassis_number.length >= 17) return errorResponse('ChassisNumber for new business should be allowed only 17 characters');
  if (client.c_engine_number.length <= 8) return errorResponse('EngineNumber should be at least 8 characters long');
  if (!client.c_transaction_id) return errorResponse('Transaction ID is required');
  if (!client.company_object.s_total_premium) return errorResponse('Total Premium is required');

  ///////////////////////////  CUSTOMER DETAILS ////////////////////////////
  let vCustomerName = '';
  if (client.c_middle_name) {
    vCustomerName = `${client.c_first_name.toUpperCase()} ${client.c_middle_name.toUpperCase()} ${client.c_last_name.toUpperCase()}`;
  } else {
    vCustomerName = `${client.c_first_name.toUpperCase()} ${client.c_last_name.toUpperCase()}`;
  }

  if (client.c_nominee_dob && differenceInYears(new Date(), new Date(client.c_nominee_dob)) < 18) {
    if (!client.c_nominee_appointee_name && !client.c_nominee_appointee_relationship) {
      return errorResponse('As the nominee age is less than 18, Nominee Appointee Name and Relationship is required');
    }
  }

  ////////////////////////////////  SAVE PROPOSAL DETAILS   ///////////////////////////////////////

  let vRegistrationNumber1 = null;
  let vRegistrationNumber2 = null;
  let vRegistrationNumber3 = null;
  let vRegistrationNumber4 = null;
  let registration_code = client.c_place_of_registration.slice(0, 4);

  if (client.c_registration_number) {
    if (registration_code) {
      if (client.c_registration_number.toLowerCase().includes(registration_code.toLowerCase())) {
        const response = splitRegistrationNumber(client.c_registration_number);
        vRegistrationNumber1 = response.num1;
        vRegistrationNumber2 = response.num2;
        vRegistrationNumber3 = response.num3;
        vRegistrationNumber4 = response.num4;
      } else {
        return errorResponse("Registartion Number and Registration Code doesn't match");
      }
    }
  } else {
    if (registration_code) {
      vRegistrationNumber1 = registration_code.slice(0, 2).toUpperCase();
      vRegistrationNumber2 = registration_code.slice(2, 4);
    } else {
      return errorResponse('If the policy is a new business then it must have a valid registration code');
    }
  }

  const proposalAndPayment = {
    objclsPartnerTwoWheelerSaveProposal: {
      objTwoWheelerSaveProposalRequest: {
        objCustomerDetails: {
          vCustomerId: '',
          vCustomerType: client.c_customer_type ? client.c_customer_type.toUpperCase() : '',
          vIDProof: '0',
          vIDProofDetails: '',
          vCustomerFirstName: client.c_first_name ? client.c_first_name.toUpperCase() : '',
          vCustomerMiddleName: client.c_middle_name ? client.c_middle_name.toUpperCase() : '',
          vCustomerLastName: client.c_last_name ? client.c_last_name.toUpperCase() : '',
          vCustomerEmail: client.c_email ? client.c_email : '',
          vCustomerMobile: client.c_mobile ? client.c_mobile : '',
          vCustomerDOB: client.c_dob ? format(new Date(client.c_dob), 'dd/MM/yyyy') : '',
          vCustomerSalutation: client.c_title ? client.c_title.toUpperCase() : '',
          vCustomerGender: client.c_gender ? client.c_gender.toUpperCase() : '',
          vOccupationCode: '1',
          vMaritalStatus: client.c_maritial_status ? client.c_maritial_status : '',
          vCustomerAadharNumber: client.c_aadhar_number ? client.c_aadhar_number : '',
          vCustomerPanNumber: client.c_pan_number ? client.c_pan_number : '',
          vCustomerPassportNumber: client.c_passport_number ? client.c_passport_number : '',
          vCustomerVoterIdNumber: client.c_voter_id_number ? client.c_voter_id_number : '',
          vCustomerPincode: client.c_pincode ? client.c_pincode : '',
          vCustomerPincodeLocality: client.c_pincode_locality ? client.c_pincode_locality : '',
          vCustomerStateCd: client.c_state_code ? client.c_state_code : '',
          vCustomerStateName: client.c_state ? client.c_state : '',
          vCustomerCityDistrict: client.c_district ? client.c_district : '',
          vCustomerCityDistrictCd: client.c_district_code ? client.c_district_code : '',
          vCustomerCity: client.c_city ? client.c_city : '',
          vCustomerCityCd: client.c_city_code ? client.c_city_code : '',
          vCustomerAddressLine1: client.c_address_line1 ? client.c_address_line1 : '',
          vCustomerAddressLine2: client.c_address_line2 ? client.c_address_line2 : '',
          vCustomerAddressLine3: client.c_address_line3 ? client.c_address_line3 : '',
          vCustomerCRNNumber: client.c_crn ? client.c_crn : '',
          vOrganizationName: '',
          vOrganizationContactName: '',
          vOrganizationEmail: '',
          vOrganizationMobile: '',
          vOrganizationPincode: '',
          vOrganizationAddressLine1: '',
          vOrganizationTANNumber: '',
          vOrganizationGSTNumber: '',
        },
        vUserLoginId: 'BP000001',
        vWorkFlowID: client.company_object.s_workflow_id ? client.company_object.s_workflow_id : '',
        vQuoteID: client.company_object.s_quote_id ? client.company_object.s_quote_id : '',
        vNomineeName: client.c_nominee_full_name ? client.c_nominee_full_name : '',
        vNomineeDOB: client.c_nominee_dob ? format(new Date(client.c_nominee_dob), 'dd/MM/yyyy') : '',
        vNomineeRelationship: client.c_nominee_relation ? client.c_nominee_relation : '',
        vNomineeAppointeeName: client.c_nominee_appointee_name ? client.c_nominee_appointee_name : '',
        vNomineeAppointeeRelationship: client.c_nominee_appointee_relationship ? client.c_nominee_appointee_relationship : '',
        vRMCode: '',
        dBranchInwardDate: format(new Date(), 'dd/MM/yyyy'),
        vBranchInwardNumber: '',
        vCustomerCRNNumber: client.c_crn ? client.c_crn : '',
        vRegistrationNumber1,
        vRegistrationNumber2,
        vRegistrationNumber3,
        vRegistrationNumber4,
        vEngineNumber: client.c_engine_number ? client.c_engine_number : '',
        vChassisNumber: client.c_chassis_number ? client.c_chassis_number : '',
        vPrevInsurerCode: '',
        vPrevInsurerExpiringPolicyNumber: client.c_prev_policy_number ? client.c_prev_policy_number : '',
        vColourOfvehicle: client.c_vehicle_colour ? client.c_vehicle_colour : '',
        vPreInspectionNumber: '',
        bIsVehicleFinanced: client.c_is_vehicle_financed ? client.c_is_vehicle_financed : false,
        vFinancierAddress: '',
        vFinancierAgreementType: '',
        vFinancierCode: client.c_financer_code ? client.c_financer_code : '',
        vFinancierName: client.c_financier_name ? client.c_financier_name : '',
      },
      objParaPaymentDetails: {
        vCdAccountNumber: '',
        vWorkFlowId: client.company_object.s_workflow_id ? client.company_object.s_workflow_id : '',
        vQuoteId: client.company_object.s_quote_id ? client.company_object.s_quote_id : '',
        vProposalId: '',
        vIntermediaryCode: '3169170000',
        vCustomerId: '',
        vPaymentNumber: client?.c_transaction_id ? client?.c_transaction_id : '',
        nPremiumAmount: client.company_object.s_total_premium ? client.company_object.s_total_premium : '',
        vTransactionFlag: 'BPOS',
        vLoggedInUser: 'BP000001',
        vProductInfo: 'Two Wheeler Comprehensive',
        vPaymentModeCode: 'PA',
        vPaymentModeDescription: 'PAYMENT AGGREGATOR',
        vPayerType: '1',
        vPayerCode: '',
        vPayerName: '',
        vApplicationNumber: '',
        vBranchName: '',
        vBankCode: '0',
        vBankName: '',
        vIFSCCode: '',
        vBankAccountNo: '0411672667',
        vHouseBankBranchCode: '14851091',
        vInstrumentNo: client?.c_transaction_id ? client?.c_transaction_id : '',
        vCustomerName,
        vHouseBankId: '',
        vInstrumentDate: format(new Date(), 'dd/MM/yyyy'),
        vInstrumentAmount: client.company_object.s_total_premium ? client.company_object.s_total_premium : '',
        vPaymentLinkStatus: '',
        vPaymentEntryId: '',
        vPaymentAllocationId: '',
        vPolicyNumber: client.c_prev_policy_number ? client.c_prev_policy_number : '',
        vPolicyStartDate: '',
        vProposalDate: '',
        vCustomerFullName: '',
        vIntermediaryName: '',
        vCustomerEmailId: '',
        nCustomerMobileNumber: '',
        vErrorMsg: '',
      },
    },
  };

  return {
    error: false,
    data: proposalAndPayment,
  };
};

export const KotakTwProposalServerToClientMapper = (server) => {
  const server_object = server.Fn_Save_Partner_Two_Wheeler_Proposal_Payment_DetailsResult;

  const server_response = {
    s_policy_number: server_object.vPolicyNumber,
    s_product_code: server_object.vProductCode,
    s_proposal_number: server_object.vProposalNumber,
    s_quote_id: server_object.vQuoteId,
    s_company_name: 'kotak',
    s_service_type: 'two_wheeler',
    s_plan_type: 'proposal',
    s_plan_name: 'Kotak General Insurance',
  };

  return server_response;
};

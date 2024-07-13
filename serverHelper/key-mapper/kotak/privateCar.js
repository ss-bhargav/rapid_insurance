import { format } from "date-fns";
import getYear from "date-fns/getYear";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import differenceInMonths from "date-fns/differenceInMonths";
import { errorResponse, splitRegistrationNumber, getNextDay, getNextYear } from "serverHelper/helperFunctions";
import { constants } from "serverHelper/constants";
import { KotakPcMakeModelVariantHandler } from "server_helper/serverSideFunctions/vehicle/privateCar";
import { KotakRtoDetails } from "server_helper/serverSideFunctions/rto";
import { KotakInsurersDetails } from "server_helper/serverSideFunctions/insurers";

// /////////////////////////////////////////////////  PREMIUM

export const KotakPcPremiumClientToServerMapper = (client) => {
    let NcbArray = [0, 20, 25, 35, 45, 50];
    let voluntryExcess = [0, 2500, 5000, 7500, 15000];
    /////////////////////////----- VALIDATIONS -----/////////////////////////

    if (!client.c_registration_date) return errorResponse("Registration Date is required");
    if (!client.c_customer_type) return errorResponse("Customer Type is required");
    if (Number(client?.kotak?.s_system_idv) > 5000000) {
        return errorResponse("Quote will not be generated if IDV > 50 Lakhs");
    }
    if (client?.c_engine_number?.length > 0 && client?.c_engine_number?.length < 8) {
        return errorResponse("Engine number should be minimun 8 characters");
    }
    if (!client.c_registration_date) return errorResponse("Registration date should be null");
    if (client?.c_rollover && client?.c_chassis_number?.length > 0 && client.c_chassis_number?.length < 8) {
        return errorResponse("Chassis number should be minimun 8 characters for rollover");
    }
    if (!client?.rollover && client?.c_chassis_number?.length > 0 && client.c_chassis_number?.length < 17) {
        return errorResponse("Chassis number should be below or only 17 characters for new business");
    }
    if (client.c_rollover && !client.c_prev_policy_expire_date)
        return errorResponse("Please give a valid Previous Policy End Date");
    if (client.c_ncb && !NcbArray.includes(Number(client.c_ncb)))
        return errorResponse("No Claim Bonus must be one of  0 | 20 | 25 | 35 | 45 | 50");
    if (client?.addons?.c_voluntary_excess && !voluntryExcess.includes(Number(client?.addons?.c_voluntary_excess)))
        return errorResponse("Voluntry Excess must be one of  0 | 2500 | 5000 | 7500 | 15000");
    if (client.c_customer_type?.toLowerCase() === "i" && client.c_credit_score_required) {
        if (!client.c_full_name || !client.c_dob || !client.c_mobile) {
            return errorResponse(
                "If customer details are required. If customer type is Indivudial and credit scor" + "e is opted"
            );
        }
    }

    /////////////////////////----- PLAN TYPE DETAILS     -----/////////////////////////

    const planType = client.c_plan.split("-");
    let third_party_tenure = planType[1];
    let own_damage_tenure = planType[3];
    let policy_tenure = planType[3];
    let vProductType = "ComprehensivePolicy";
    let vProductTypeODTP = "";
    let nProductCode = "";

    if (client.c_plan === "TP-0-OD-1") {
        nProductCode = "3151";
    }

    if (client.c_plan === "TP-0-OD-1") {
        vProductType = "ODOnly";
    } else if (third_party_tenure > 0 && own_damage_tenure > 0) {
        vProductType = "ComprehensivePolicy";
    }

    if (client.c_rollover) {
        if (client.c_plan === "TP-1-OD-1") {
            vProductTypeODTP = 1011;
        } else if (client.c_plan === "TP-0-OD-1") {
            vProductTypeODTP = "";
        }
    } else {
        if (client.c_plan) {
            if (client.c_plan === "TP-3-OD-3") {
                vProductTypeODTP = 1062;
            } else if (client.c_plan === "TP-3-OD-1") {
                vProductTypeODTP = 1063;
            }
        }
    }

    if (client.c_rollover) {
        if (client?.c_plan === "TP-1-OD-0") {
            return errorResponse("Plan Type TP only 1 is not applicable for Kotak Private Car Rollover");
        }
    } else {
        if (client?.c_plan === "TP-3-OD-0") {
            return errorResponse("Plan Type TP only 3 is not applicable for Kotak Private Car New Business");
        }
    }

    /////////////////////////----- VEHICLE & RTO DETAILS -----/////////////////////////

    let vRegistrationDate = format(new Date(client.c_registration_date), "dd/MM/yyyy");
    let vRegistrationYear = getYear(new Date(client.c_registration_date));

    let vehicleDetails = KotakPcMakeModelVariantHandler(client);

    if (Object.keys(vehicleDetails).length === 0) {
        return errorResponse("Vehicle Details not available Kotak Database");
    }

    let rtoDetails = KotakRtoDetails(client.c_place_of_registration);

    if (Object.keys(rtoDetails).length === 0) {
        return errorResponse("Vehicle Details not available Kotak Database");
    }

    /////////////////////////----- PREV POLICY DETAILS -----/////////////////////////
    let dateTomorrow = getNextDay(new Date())
    let nextYear = getNextYear(new Date())
    let vPreviousPolicyEndDate;
    let vNCBRate = "";
    let vClaimCount = "";
    let vPrevPolicyType = "ComprehensivePolicy";
    let vPrevInsurerDescription = "";
    let vPrevInsurerCode = "";
    let dPreviousTPPolicyExpiryDate = format(new Date(nextYear), "dd/MM/yyyy");
    let dPreviousTPPolicyStartDate = format(new Date(dateTomorrow), "dd/MM/yyyy");
    let vPrevTPInsurerCode = "";
    let PrevTPInsurerExpiringPolicyNumber = "";
    let vPrevTPInsurerName = "";
    let vCustomerPrevPolicyNumber = "";

    let prevInsurerDetails = {}


    if (client.c_prev_insurer) {
        prevInsurerDetails = KotakInsurersDetails(client?.c_prev_insurer);
        if (Object.keys(prevInsurerDetails).length === 0) {
            return errorResponse("Previous Insuere details not found in kotak database");
        }
        vPrevInsurerDescription = prevInsurerDetails?.COMPANYNAME;
        vPrevInsurerCode = prevInsurerDetails?.TXT_COMPANY_CODE;
    }


    if (client.c_rollover) {
        vPreviousPolicyEndDate = format(new Date(client.c_prev_policy_expire_date), "dd/MM/yyyy");
    }

    if (client.c_rollover) {
        vClaimCount = client.c_claim_last_year ? "1 OD Claim" : "";
        vNCBRate = client.c_claim_last_year ? "0" : Number(client.c_ncb);
    } else {
        vClaimCount = "";
        vNCBRate = "0";
    }

    /////////////////////////----- CUSTOMER DETAILS -----/////////////////////////
    /////////////////////////----- ADDONS DETAILS -----/////////////////////////
    let isPACoverUnnamed = false;
    let vPersonUnnamed = 0;
    let vUnNamedSI = 0;
    let isPACoverPaidDriver = false;
    let vPACoverPaidDriver = 0;
    let vSIPaidDriver = 0;
    let vCustomerVoluntaryDeductible = Number(client?.addons?.c_voluntary_excess)
        ? Number(client?.addons?.c_voluntary_excess)
        : "0";

    if (Number(client?.addons?.c_pa_unnamed_passenger)) {
        isPACoverUnnamed = true;
        vPersonUnnamed = vehicleDetails?.SEATINGCAPACITY;
        if (
            Number(client?.addons?.c_pa_unnamed_passenger) >= 10000 &&
            Number(client?.addons?.c_pa_unnamed_passenger) <= 200000
        ) {
            if (Number.isInteger(Number(client?.addons?.c_pa_unnamed_passenger) / 10000)) {
                vUnNamedSI = Number(client?.addons?.c_pa_unnamed_passenger);
            } else {
                return errorResponse(
                    "Unnamed Passenger value should be any value of 10000 - 200000 with the interval " + "of 10000"
                );
            }
        } else {
            return errorResponse("Unnamed Passenger value should be between 10000 and 200000");
        }
    }

    if (Number(client?.addons?.c_pa_cover_paid_driver)) {
        isPACoverPaidDriver = true;
        vPACoverPaidDriver = 1;
        if (
            Number(client?.addons?.c_pa_cover_paid_driver) >= 10000 &&
            Number(client?.addons?.c_pa_cover_paid_driver) <= 200000
        ) {
            if (Number.isInteger(Number(client?.addons?.c_pa_cover_paid_driver) / 10000)) {
                vSIPaidDriver = Number(client?.addons?.c_pa_cover_paid_driver);
            } else {
                return errorResponse(
                    "Personal Accident Cover for Paid Driver value should be any value of 10000 - 200" +
                    "000 with the interval of 10000"
                );
            }
        } else {
            return errorResponse("Personal Accident Cover for Paid Driver value should be between 10000 and 200000");
        }
    }

    /////////////////////////----- BUYNOW DETAILS -----/////////////////////////

    // /////////////////////////////////////////////////// DATES
    // //////////////////////////////////////////

    let presentDate = format(new Date(), "dd/MM/yyyy");

    let differenceYears = differenceInMonths(new Date(), new Date(client.c_registration_date)) / 12;

    let differenceDays = differenceInCalendarDays(
        new Date(client.c_registration_date),
        new Date(client.c_manufacture_year_month)
    );

    if (differenceDays < 0) {
        return errorResponse("Manfacture Date should not be greater than Registartion Date");
    }
    if (differenceYears > 11.99) return errorResponse("Age of the vehicle should not be greater than 11.99");
    if (client.c_road_side_assistance && differenceYears > 7.99)
        return errorResponse(
            "If Road Side Assistance is true, Vehicle age should not be more than 7.99 years " + "old"
        );
    if (client.c_depreciation_cover && differenceYears > 2.49)
        return errorResponse("If Depreciation Cover is true, Vehicle age should not be more than 2.49 years ol" + "d");
    if (client.c_consumable_cover && differenceYears > 2.49)
        return errorResponse("If Consumable Cover is true, Vehicle age should not be more than 2.49 years old");
    if (client.c_engine_protect && differenceYears > 2.49)
        return errorResponse("If Engine Protect is true, Vehicle age should not be more than 2.49 years old");
    if (client.c_return_to_invoice && differenceYears > 2.49)
        return errorResponse("If Return to Invoice is true, Vehicle age should not be more than 2.49 years old");

    // /////////////////////////////////////////////////// ADDONS

    if (Number(client?.addons?.c_request_idv)) {
        if (Number(client?.kotak?.s_system_idv)) {
            let minLimit = Number(client?.kotak?.s_system_idv) * 0.1;
            let maxLimit = Number(client?.kotak?.s_system_idv) * 0.15;
            let minimum = Number(client?.kotak?.s_system_idv) - minLimit;
            let maximum = Number(client?.kotak?.s_system_idv) + maxLimit;

            if (Number(client?.addons?.c_request_idv) >= minimum && Number(client?.addons?.c_request_idv) <= maximum) {
                nRequestIDV = Number(client?.addons?.c_request_idv);
            } else {
                return errorResponse("Request IDV must be 10% greater or less than system idv");
            }
        } else {
            return errorResponse("System IDV is not valid, Please enter your details fetch the quote again");
        }
    }

    //////////////////////////////////////////////////// PREV INSURER
    let bIsCreditScoreOpted = "0";
    let bIsNoPrevInsurance;

    let vCSCustomerIdentityProofNumber;
    let vCSCustomerFirstName = "";
    let vCSCustomerLastName = "";
    let dCSCustomerDOB = "";
    let vCSCustomerMobileNo = "";
    let vCSCustomerPincode = "";

    if (client.c_credit_score_required && client.c_customer_type.toLowerCase() === "i") {
        bIsCreditScoreOpted = "1";
        vCSCustomerFirstName = client.c_first_name ? client.c_first_name : "";
        vCSCustomerLastName = client.c_last_name ? client.c_last_name : "";
        dCSCustomerDOB = client.c_dob ? client.c_dob : "";
        vCSCustomerMobileNo = client.c_mobile ? client.c_mobile : "";
        vCSCustomerPincode = client.c_pincode ? client.c_pincode : "";
        vCSCustomerIdentityProofNumber = client.c_pan_number ? client.c_pan_number : "";
    }

    if (client.c_rollover) {
        if (client.c_prev_insurer) {
            bIsNoPrevInsurance = 0;
        } else {
            bIsNoPrevInsurance = 1;
        }
    } else {
        bIsNoPrevInsurance = 1;
    }

    let vPAODTenure;

    if (client?.addons?.c_pa_cover_owner_driver) {
        if (client.c_rollover) {
            vPAODTenure = 1;
        } else {
            if (Number(client.c_policy_tenure) === 1 || Number(client.c_policy_tenure) === 5) {
                vPAODTenure = Number(client.c_policy_tenure);
            }
        }
    } else {
        vPAODTenure = 0;
    }

    const pc_premium = {
        vIdProof: "1",
        vIdProofDetail: client.c_pan_number ? client.c_pan_number : "",
        vIntermediaryCode: constants.kotak.intermediate_code,
        vIntermediaryName: constants.kotak.intermediate_name,
        nOfficeCode: constants.kotak.office_code,
        vOfficeName: constants.kotak.office_name,
        vManufactureCode: vehicleDetails?.MANUFACTURERCODE || "",
        vManufactureName: vehicleDetails?.MANUFACTURER || "",
        vModelCode: vehicleDetails?.NUM_PARENT_MODEL_CODE || "",
        vModelDesc: vehicleDetails?.VEHICLEMODEL || "",
        vVariantCode: vehicleDetails?.Variant_Code_VEHICLEMODELCODE || "",
        vVariantDesc: vehicleDetails?.TXT_VARIANT || "",
        vModelSegment: vehicleDetails?.TXT_SEGMENTTYPE || "",
        vSeatingCapacity: vehicleDetails?.SEATINGCAPACITY || "",
        vFuelType: vehicleDetails?.TXT_FUEL || "",
        vModelCluster: vehicleDetails?.TXT_MODEL_CLUSTER || "",
        vCubicCapacity: vehicleDetails?.CUBICCAPACITY || "",
        isLPGCNGChecked: Number(client?.addons?.c_lpg_cng_kit) ? true : false,
        vLPGCNGKitSI: Number(client?.addons?.c_lpg_cng_kit) ? Number(client?.addons?.c_lpg_cng_kit) : 0,
        isElectricalAccessoriesChecked: Number(client?.addons?.c_electrical_accessories) ? true : false,
        vElectricalAccessoriesSI: Number(client?.addons?.c_electrical_accessories)
            ? Number(client?.addons?.c_electrical_accessories)
            : 0,
        isNonElectricalAccessoriesChecked: Number(client?.addons?.c_non_electrical_accessories) ? true : false,
        vNonElectricalAccessoriesSI: Number(client?.addons?.c_non_electrical_accessories)
            ? Number(client?.addons?.c_non_electrical_accessories)
            : 0,
        vRegistrationDate,
        vRegistrationYear,
        vRTOCode: rtoDetails?.TXT_RTO_LOCATION_CODE || "",
        vRTOStateCode: rtoDetails?.NUM_STATE_CODE || "",
        vRegistrationCode: rtoDetails?.NUM_REGISTRATION_CODE || "",
        vRTOCluster: rtoDetails?.TXT_RTO_CLUSTER || "",
        vRegistrationZone: rtoDetails?.TXT_REGISTRATION_ZONE || "",
        isReturnToInvoice: client?.c_return_to_invoice ? client?.c_return_to_invoice : false,
        isRoadSideAssistance: client?.addons?.c_road_side_assistance ? client?.addons?.c_road_side_assistance : false,
        isEngineProtect: client?.addons?.c_engine_protect ? client?.addons?.c_engine_protect : false,
        isDepreciationCover: Number(client?.addons?.c_depreciation_cover) ? true : false,
        nVlntryDedctbleFrDprctnCover: Number(client?.addons?.c_depreciation_cover) ? 0 : 0,
        isConsumableCover: client?.addons?.c_consumable_cover ? client?.addons?.c_consumable_cover : false,
        isPACoverUnnamed,
        vPersonUnnamed,
        vUnNamedSI,
        vMarketMovement: "-10",
        isPACoverPaidDriver,
        vPACoverPaidDriver,
        vSIPaidDriver,
        isIMT28: client?.addons?.c_legal_liability_pd ? client?.addons?.c_legal_liability_pd : false,
        isIMT29: client?.c_legal_liability_employee ? client?.c_legal_liability_employee : false,
        vPersonIMT28: client?.addons?.c_legal_liability_pd ? 1 : 0,
        vPersonIMT29: client?.c_legal_liability_employee ? 1 : 0,
        vBusinessType: client?.c_rollover ? "R" : "N",
        vPolicyStartDate: "",
        vPreviousPolicyEndDate,
        vProductType,
        vClaimCount,
        vClaimAmount: "0",
        vNCBRate,
        vPreviousYearNCB: "0",
        vWorkflowId: client?.kotak?.c_workflow_id ? client?.kotak?.c_workflow_id : "",
        vFinalIDV: "0",
        objCustomerDetails: {
            vCustomerType: client.c_customer_type.toUpperCase(),
            vCustomerLoginId: "BP000001",
            vCustomerGender: client.c_gender ? client.c_gender : "",
            vCustomerVoluntaryDeductible,
        },
        objPrevInsurer: {
            vPrevPolicyType,
            vPrevInsurerDescription,
            vPrevInsurerCode,
        },
        bIsCreditScoreOpted,
        bIsNewCustomer: "0",
        vCSCustomerFirstName,
        vCSCustomerLastName,
        dCSCustomerDOB,
        vCSCustomerMobileNo,
        vCSCustomerPincode,
        vCSCustomerIdentityProofType: "1",
        vCSCustomerIdentityProofNumber,
        bIsNoPrevInsurance,
        vPAODTenure,
        vProductTypeODTP,
        vPosPanCard: "",
        dPreviousTPPolicyExpiryDate,
        dPreviousTPPolicyStartDate,
        vPrevTPInsurerCode,
        PrevTPInsurerExpiringPolicyNumber,
        vPrevTPInsurerName,
        nProductCode,
        vCustomerPrevPolicyNumber,
        // vPACoverOwnDriver: client?.addons?.c_pa_cover_owner_driver ? true : false,
        // vPAOwnerDriver: true,
    };

    return { error: false, data: pc_premium };
};

export const KotakPcPremiumServerToClientMapper = (server) => {
    let makeModelDetails = `${server.vMake} ${server.vModel} ${server.vVariant} ${server.vFuelType}`;
    let rtoDetails = `${server.vRTO}`;

    let return_server_object = {
        s_net_premium: server.vNetPremium,
        s_total_premium: server.vTotalPremium,
        s_idv: server.vFinalIDV,
        s_system_idv: server.vSystemIDV,
        s_gst_percent: server.vGSTRate,
        s_gst_amount: server.vGSTAmount,
        s_ncb_percent: server.vNCBPercentage,
        s_ncb_amount: server.vNCB,
        s_basic_od_premium: server.vTotalOwnDamagePremium,
        s_basic_tp_premium: server.vTotalPremiumLiability,
        s_make_model_details: makeModelDetails,
        s_rto_details: rtoDetails,
        s_is_credit_score_opted: server.vCreditScore,
        s_quote_id: server.vQuoteId,
        s_workflow_id: server.vWorkFlowID,
        s_policy_expire_date: server.vPolicyEndDate,
        s_policy_start_date: server.vPolicyStartDate,
        s_cover_type: server.vCoverType,
        s_electrical_accessories_si: server.vElectricalAccessories,
        s_electrical_accessories_premium: server.vElectronicSI,
        s_non_electrical_accessories_si: server.vNonElectricalAccessories,
        s_non_electrical_accessories_premium: server.vNonElectronicSI,
        s_pa_unnamed_passenger_si: server.vPAUnnamedPassengerSI,
        s_pa_unnamed_passenger_premium: server.vPAForUnnamedPassengerPremium,
        s_engine_protect_premium: server.vEngineProtect,
        s_pa_cover_owner_driver_premium: server.vPACoverForOwnDriver,
        s_depreciation_cover_premium: server.vDepreciationCover,
        s_voluntary_deduction_for_depreciation: server.vVoluntaryDeductionDepWaiver,
        s_voluntary_excess_premium: server.vVoluntaryDeduction,
        s_company_name: "kotak",
        s_service_type: "private_car",
        s_plan_type: "premium",
        s_plan_name: "Kotak General Insurance",
    };

    return return_server_object;
};

// /////////////////////////////////////////////////  PROPOSAL

export const KotakPcProposalClientToServerMapper = (client) => {
    if (!client.company_object.s_workflow_id) return errorResponse("Workflow ID is required");
    if (!client.company_object.s_quote_id) return errorResponse("Quote ID is required");
    if (!client.c_customer_type) return errorResponse("Customer Type is required");
    if (!client.c_first_name) return errorResponse("First Name is required");
    if (!client.c_registration_number) return errorResponse("Registration number is required");
    if (!client.c_engine_number) return errorResponse("Engine number is required");
    if (!client.c_chassis_number) return errorResponse("Chassis number is required");
    if (!client.company_object.s_total_premium) return errorResponse("Total Premium is required");
    if (!client.c_transaction_id) return errorResponse("Transaction ID is required");

    // Dates

    let vCustomerRegNumber1;
    let vCustomerRegNumber2;
    let vCustomerRegNumber3;
    let vCustomerRegNumber4;

    const response = splitRegistrationNumber(client.c_registration_number);
    vCustomerRegNumber1 = response.num1;
    vCustomerRegNumber2 = response.num2;
    vCustomerRegNumber3 = response.num3;
    vCustomerRegNumber4 = response.num4;

    const pc_proposal = {
        objParaCustomerDetails: {
            vCustomerLoginId: "BP000001",
            vCustomerId: "",
            isSearchCustomer: false,
            vCustomerType: client.c_customer_type ? client.c_customer_type.toUpperCase() : "",
            vCustomerTypeId: "",
            vCustomerFirstName: client.c_first_name ? client.c_first_name : "",
            vCustomerMiddleName: client.c_middle_name ? client.c_middle_name : "",
            vCustomerLastName: client.c_last_name ? client.c_last_name : "",
            vCustomerEmail: client.c_email ? client.c_email : "",
            vCustomerMobile: client.c_mobile ? client.c_mobile : "",
            vCustomerDOB: client.c_dob ? format(new Date(client.c_dob), "dd/MM/yyyy") : "",
            vCustomerPincode: client.c_pincode ? client.c_pincode : "",
            vCustomerSalutation: client.c_title ? client.c_title : "",
            vCustomerGender: client.c_gender ? client.c_gender.toUpperCase() : "",
            vCustomerPanNumber: client.c_pan_number ? client.c_pan_number : "",
            vCustomerAddressLine1: `${client.c_address_line1} ${client.c_address_line2} ${client.c_address_line3}`,
            vIntermediaryCode: "3169170000",
            vCustomerQuoteId: client.company_object.s_quote_id ? client.company_object.s_quote_id : "",
            vCustomerWorkFlowId: client.company_object.s_workflow_id ? client.company_object.s_workflow_id : "",
            vCustomerNomineeName: client.c_nominee_full_name ? client.c_nominee_full_name : "",
            vCustomerNomineeDOB: client.c_nominee_dob ? format(new Date(client.c_nominee_dob), "dd/MM/yyyy") : "",
            vCustomerNomineeRelationship: client.c_nominee_relation ? client.c_nominee_relation : "",
            vCustomerRegNumber1,
            vCustomerRegNumber2,    
            vCustomerRegNumber3,
            vCustomerRegNumber4,
            vCustomerEngineNumber: client.c_engine_number ? client.c_engine_number : "",
            vCustomerChassisNumber: client.c_chassis_number ? client.c_chassis_number : "",
            vCustomerBusinessType: client.c_rollover ? "R" : "N",
            vCustomerFullName: `${client.c_first_name} ${client.c_last_name}`,
            vAppointeeName: "",
            vAppointeeRelation: "",
            vCustomerPrevPolicyNumber: client.c_prev_policy_number,
            vCustomerPreInpectionNumber: "",
            bIsYourVehicleFinanced: client.c_is_vehicle_financed ? "1" : "0",
            vFinancierName: "",
            vFinancierCode: "",
            vFinancierAddress: client.c_is_vehicle_financed ? client.c_financer_address : "",
            vFinancierAgreementType: client.c_is_vehicle_financed ? client.c_financer_agreement_type : "",
            vCustomerCRNNumber: client.c_crn ? client.c_crn : "",
            vCustomerLoanAcNumber: "",
            vRMCode: "",
            vBranchInwardNumber: "",
            dBranchInwardDate: format(new Date(), "dd/MM/yyyy"),
            vOrganizationName: client.c_company_name ? client.c_company_name : "",
            vOrganizationContactName: client.c_company_name ? client.c_company_name : "",
            vOrganizationEmail: client.c_email ? client.c_email : "",
            vOrganizationMobile:  client.c_mobile ? client.c_mobile : "",
            vOrganizationPincode: "505327",
            vOrganizationAddressLine1: "505327 Jagtial",
            vOrganizationTANNumber:  "PDES03028F",
            vOrganizationGSTNumber: client.c_gst_number ? client.c_gst_number : "",
            vOrganizationStateCd:"27"
        },
        objParaPaymentDetails: {
            vCdAccountNumber: "",
            vWorkFlowId: client.company_object.s_workflow_id ? client.company_object.s_workflow_id : "",
            vQuoteId: client.company_object.s_quote_id ? client.company_object.s_quote_id : "",
            vProposalId: "",
            vIntermediaryCode: "3169170000",
            vCustomerId: "",
            vPaymentNumber: client.c_transaction_id ? client.c_transaction_id : "",
            nPremiumAmount: client.company_object.s_total_premium ? client.company_object.s_total_premium : "",
            vTransactionFlag: "BPOS",
            vLoggedInUser: "BP000001",
            vProductInfo: "Private Car Comprehensive",
            vPaymentModeCode: "PA",
            vPaymentModeDescription: "PAYMENT AGGREGATOR",
            vPayerType: "1",
            vPayerCode: "",
            vPayerName: "",
            vApplicationNumber: "",
            vBranchName: "",
            vBankCode: "0",
            vBankName: "",
            vIFSCCode: "",
            vBankAccountNo: "0411672667",
            vHouseBankBranchCode: "14851091",
            vInstrumentNo: client.c_transaction_id ? client.c_transaction_id : "",
            vCustomerName: `${client.c_first_name} ${client.c_last_name}`,
            vHouseBankId: "",
            vInstrumentDate: format(new Date(), "dd/MM/yyyy"),
            vInstrumentAmount: client.company_object.s_total_premium ? client.company_object.s_total_premium : "",
            vPaymentLinkStatus: "",
            vPaymentEntryId: "",
            vPaymentAllocationId: "",
            vPolicyNumber: "",
            vPolicyStartDate: "",
            vProposalDate: "",
            vCustomerFullName: `${client.c_first_name} ${client.c_last_name}`,
            vIntermediaryName: "",
            vCustomerEmailId: client.c_email ? client.c_email : "",
            nCustomerMobileNumber: client.c_mobile ? client.c_mobile : "",
            vErrorMsg: "",
        },
    };

    return { error: false, data: pc_proposal };
};

export const KotakPcProposalServerToClientMapper = (server) => {
    const server_object = server.Fn_Save_Partner_Private_Car_Proposal_Payment_DetailsResult;

    const server_response = {
        s_policy_number: server_object.vPolicyNumber,
        s_product_code: server_object.vProductCode,
        s_proposal_number: server_object.vProposalNumber,
        s_quote_id: server_object.vQuoteId,
        s_company_name: "kotak",
        s_service_type: "private_car",
        s_plan_type: "proposal",
        s_plan_name: "Kotak General Insurance",
    };

    return server_response;
};

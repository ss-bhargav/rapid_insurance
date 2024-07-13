import { v4 as uuidv4 } from 'uuid';
import { format } from "date-fns";
import getYear from "date-fns/getYear";
import add from 'date-fns/add';
import differenceInYears from 'date-fns/differenceInYears';
import { errorResponse, getStartAndEndPolicyDate } from "serverHelper/helperFunctions";
import { IciciPcMakeModelVariantHandler } from "server_helper/serverSideFunctions/vehicle/privateCar";
import MasterRtoArray from '../../db/kotak/master/pc_rto_master.json';
import PcRtoArray from '../../db/icici/PcRtoMaster.json'
import { IciciRtoDetails } from "server_helper/serverSideFunctions/rto";

///////////////////////////////////////////////////  PREMIUM  ///////////////////////////////////////////

export const IciciPcPremiumClientToServerMapper = (client) => {

    /////////////////////////----- VALIDATIONS -----/////////////////////////
    if (!client.c_registration_date) return errorResponse('Registartion date should not be null or invalid format');
    if (!client.c_manufacture_year_month) return errorResponse('Manufacture Year should not be null or invalid format');

    /////////////////////////----- PLAN TYPE DETAILS -----/////////////////////////
    const planType = client.c_plan.split('-');
    let third_party_tenure = planType[1];
    let own_damage_tenure = planType[3];
    let policy_tenure = 0;

    ////// Rollover
    if (client.c_plan === "TP-1-OD-0") {
        policy_tenure = 1;
    } else if (client.c_plan === "TP-0-OD-1") {
        policy_tenure = 1;
    } else if (client.c_plan === "TP-1-OD-1") {
        policy_tenure = 1;
    } else if (client.c_plan === "TP-1-OD-2") {
        policy_tenure = 2;
    } else if (client.c_plan === "TP-1-OD-3") {
        policy_tenure = 3;
    }

    ////// New Business
    if (client.c_plan === "TP-5-OD-1") {
        policy_tenure = 1;
    } else if (client.c_plan === "TP-5-OD-3") {
        policy_tenure = 3;
    } else if (client.c_plan === "TP-5-OD-5") {
        policy_tenure = 5
    }


    /////////////////////////----- VEHICLE & RTO DETAILS -----/////////////////////////
    let vehicleDetails = IciciPcMakeModelVariantHandler(client);
    if (Object.keys(vehicleDetails).length === 0) {
        return errorResponse("Vehicle Details not available ICICI Database")
    }

    let RtoDetails = IciciRtoDetails(client.c_place_of_registration)

    if (Object.keys(RtoDetails).length === 0) {
        return errorResponse('RTO Details not found for given registration code');
    }

    let DeliveryOrRegistrationDate = format(new Date(client.c_registration_date), "yyyy-MM-dd")
    let FirstRegistrationDate = format(new Date(client.c_registration_date), "yyyy-MM-dd")
    let ManufacturingYear = getYear(new Date(client.c_manufacture_year_month))

    /////////////////////////----- PREV POLICY DETAILS -----/////////////////////////
    let PreviousPolicyEndDate = ""
    let PreviousPolicyStartDate = ""

    if (client?.c_prev_policy_expire_date) {
        PreviousPolicyEndDate = format(new Date(client.c_prev_policy_expire_date), 'yyyy/MM/dd');
        PreviousPolicyStartDate = format(add(new Date(PreviousPolicyEndDate), { years: -1, days: -1 }), 'yyyy/MM/dd');
    }

    /////////////////////////----- QUOTATION DETAILS -----/////////////////////////
    let PolicyStartDate = ""
    let PolicyEndDate = ""
    const dates = getStartAndEndPolicyDate(client)

    PolicyStartDate = format(new Date(dates.start_date), 'yyyy/MM/dd');
    PolicyEndDate = format(new Date(dates.end_date), 'yyyy/MM/dd');

    /////////////////////////----- ADDONS DETAILS -----/////////////////////////

    const server_object = {
        CorrelationId: client?.icici?.s_correlation_Id ? client?.icici?.s_correlation_Id : uuidv4(),
        BusinessType: client?.c_rollover ? 'Roll Over' : 'New Business',
        DealId: 'DEAL-3001-0206164',
        VehicleMakeCode: vehicleDetails.VehicleManufactureCode,
        VehicleModelCode: vehicleDetails.VehicleModelCode,
        RTOLocationCode: RtoDetails?.RTOLocationCode || "",
        ExShowRoomPrice: 0,
        IsNoPrevInsurance: client.c_prev_insurer ? false : true,
        ManufacturingYear,
        DeliveryOrRegistrationDate,
        FirstRegistrationDate,
        IsTransferOfNCB: false,
        TransferOfNCBPercent: 0,
        PreviousPolicyDetails: {
            PreviousPolicyStartDate,
            PreviousPolicyEndDate,
            ClaimOnPreviousPolicy: 0,
            TotalNoOfODClaims: '0',
            PreviousPolicyType: 'Comprehensive Package',
            PreviousInsurerName: client.c_prev_insurer ? client.c_prev_insurer : "",
            PreviousPolicyNumber: '123456789',
        },
        IsVehicleHaveLPG: false,
        IsVehicleHaveCNG: false,
        SIVehicleHaveLPG_CNG: Number(client?.addons?.c_lpg_cng_kit) ? Number(client?.addons?.c_lpg_cng_kit) : 0,
        IsFiberGlassFuelTank: client?.addons?.c_fiber_glass_fuel_tank ? true : false,
        PolicyStartDate,
        PolicyEndDate,
        customerDetails: {
            customerType: "",
            customerName: "",
            dateOfBirth: new Date(),
            pinCode: "",
            panCardNo: "",
            email: "",
            mobileNumber: "",
            addressLine1: "",
            countryCode: 0,
            stateCode: 0,
            cityCode: 0,
            gender: "",
            mobileISD: "",
            gstDetails: {
                gstExemptionApplicable: "",
                gstInNumber: "",
                gstToState: "",
                constitutionOfBusiness: "",
                customerType: "",
                panDetails: "",
                gstRegistrationStatus: "",
                gstToStateCode: 0
            },
        },
        IsHaveElectricalAccessories: Number(client?.addons?.c_electrical_accessories) ? true : false,
        SIHaveElectricalAccessories: Number(client?.addons?.c_electrical_accessories) ? Number(client?.addons?.c_electrical_accessories) : 0,
        IsHaveNonElectricalAccessories: Number(client?.addons?.c_non_electrical_accessories) ? true : false,
        SIHaveNonElectricalAccessories: Number(client?.addons?.c_non_electrical_accessories) ? Number(client?.addons?.c_non_electrical_accessories) : 0,
        TPPDLimit: client?.addons?.c_limit_tppd ? Number(client?.addons?.c_limit_tppd) : '0',
        IsLegalLiabilityToPaidDriver: client?.addons?.c_legal_liability_pd ? true : false,
        NoOfDriver: 1,
        IsLegalLiabilityToPaidEmployee: client?.addons?.c_legal_liability_pe ? true : false,
        NoOfEmployee: 1,
        IsPACoverUnnamedPassenger: Number(client?.addons?.c_pa_unnamed_passenger) ? true : false,
        SIPACoverUnnamedPassenger: Number(client?.addons?.c_pa_unnamed_passenger) ? Number(client?.addons?.c_pa_unnamed_passenger) : 0,
        IsValidDrivingLicense: client?.addons?.c_valid_driving_license ? true : false,
        IsMoreThanOneVehicle: client?.addons?.c_more_than_one_vehicle ? true : false,
        IsPACoverOwnerDriver: client?.addons?.c_pa_cover_owner_driver ? true : false,
        IsVoluntaryDeductible: false,
        VoluntaryDeductiblePlanName: "",
        IsAutomobileAssocnFlag: client?.addons?.c_automobile_association ? true : false,
        IsAntiTheftDisc: client?.addons?.c_anti_theif ? true : false,
        IsHandicapDisc: client?.addons?.c_handicap ? true : false,
        IsExtensionCountry: client?.addons?.c_extension_country ? true : false,
        ExtensionCountryName: 'Bhutan, Bangladesh, Nepal, Pakistan, Maldives, SriLanka',
        ZeroDepPlanName: client?.addons?.c_zero_depreciation ? true : false,
        IsRTIApplicableflag: client?.addons?.c_rti_applicable ? true : false,
        IsTyreProtect: client?.addons?.c_tyre_protect ? true : false,
        IsEngineProtectPlus: client?.addons?.c_engine_protect_plus ? true : false,
        RSAPlanName: "",
        KeyProtectPlan: "",
        LossOfPersonalBelongingPlanName: "",
        OtherLoading: 2,
        OtherDiscount: 0,
        GSTToState: "MAHARASHTRA",
        Tenure: 0,
        TPTenure: 0,
        PACoverTenure: 0,
        ISPACoverWaiver: client?.addons?.c_pa_cover_owner_driver ? false : true,
        TPStartDate: "",
        TPEndDate: "",
        TPPolicyNo: "",
        TPInsurerName: "",
        IsRegisteredCustomer: false,
        IsEMIProtect: false,
        EMIAmount: 0,
        NoOfEMI: 0,
        TimeExcessInIays: 0,
        SoftCopyFlag: "",
        CustomerType: client?.c_customer_type.toLowerCase() === "i" ? 'INDIVIDUAL' : "CORPORATE",
        RegistrationNumber: client.c_rollover ? client.c_registration_number : "NEW",
        EngineNumber: client?.c_engine_number ? client?.c_engine_number : "",
        ChassisNumber: client?.c_chassis_number ? client?.c_chassis_number : "",
    }

    return {
        error: false,
        data: server_object,
    };
};

export const IciciPcPremiumServerToClientMapper = (server) => {
    return server;
};


///////////////////////////////////////////////////  PROPOSAL  ///////////////////////////////////////////

export const IciciPcProposalClientToServerMapper = (client) => {

    let vehicleDetails = IciciPcMakeModelVariantHandler(client);
    if (Object.keys(vehicleDetails).length === 0) {
        return errorResponse("Vehicle Details not available ICICI Database")
    }

    let RtoDetailsArray = [];
    let FilteredArray = [];
    let rtoLoation = ""

    MasterRtoArray.map((rto) => {
        if (rto.NUM_REGISTRATION_CODE.toString().toLowerCase() === client.c_rto_registration_code.toString().toLowerCase()) {
            FilteredArray.push(rto);
        }
    })

    if (FilteredArray.length === 0) {
        if (client.c_rto_location) {
            rtoLoation = client.c_rto_location
        } else {
            return errorResponse("RTO Details not found for given registration code");
        }
    } else {
        rtoLoation = FilteredArray[0].TXT_RTO_LOCATION_DESC
    }

    PcRtoArray.map((rto) => {
        if (rto.RTOLocationDesciption.toString().toLowerCase().includes(rtoLoation.toLowerCase())) {
            if (rto.RTOLocationDesciption.toString().toLowerCase().includes("-")) {
                RtoDetailsArray.push(rto);
            }
        }
    });

    if (RtoDetailsArray.length === 0) return errorResponse("RTO Details not found for given registration code")



    /////////////////////// DATES   
    let DeliveryOrRegistrationDate = format(new Date(client.c_registration_date), "yyyy-MM-dd")
    let FirstRegistrationDate = format(new Date(client.c_registration_date), "yyyy-MM-dd")
    let PreviousPolicyEndDate = format(new Date(client.c_prev_policy_expire_date), "yyyy-MM-dd")
    let PreviousPolicyStartDate = format(add(new Date(PreviousPolicyEndDate), { years: -1, days: 1 }), "yyyy-MM-dd")
    let ManufacturingYear = getYear(new Date(client.c_manufacture_year_month))
    let DateOfBirth = format(new Date(client.c_dob), "yyyy/MM/dd");

    if (!DeliveryOrRegistrationDate) return errorResponse("Registartion date should not be null or invalid format");
    if (!PreviousPolicyEndDate)
        return errorResponse("Previous Policy date should not be null or invalid format");
    if (!ManufacturingYear) return errorResponse("Manufacture Year should not be null or invalid format");

    let PolicyStartDate = format(add(new Date(PreviousPolicyEndDate), { days: 1 }), "yyyy-MM-dd")
    let PolicyEndDate = format(add(new Date(PolicyStartDate), { years: 1, days: -1 }), "yyyy-MM-dd")

    let Age = ''
    if (client.c_nominee_dob) {
        Age = differenceInYears(new Date(), new Date(client.c_nominee_dob))
    }

    let AddressLine1 = `${client.c_address_line1} ${client.c_address_line2}`

    const client_object = {
        BusinessType: client.c_rollover ? 'Roll Over' : 'New Business',
        CorrelationId: client?.company_object?.s_correlation_Id,
        VehicleMakeCode: vehicleDetails.VehicleManufactureCode,
        VehicleModelCode: vehicleDetails.VehicleModelCode,
        RTOLocationCode: RtoDetailsArray[0].RTOLocationCode,
        ExShowRoomPrice: 0,
        DealId: 'DEAL-3001-0206164',
        PolicyStartDate,
        PolicyEndDate,
        GSTToState: 'MAHARASHTRA',
        CustomerType: client.c_customer_type.toLowerCase() === "i" ? 'INDIVIDUAL' : "CORPORATE",
        ManufacturingYear,
        DeliveryOrRegistrationDate,
        EngineNumber: client.c_engine_number,
        ChassisNumber: client.c_chassis_number,
        RegistrationNumber: client.c_registration_number,
        PreviousPolicyDetails: {
            PreviousPolicyStartDate,
            PreviousPolicyEndDate,
            ClaimOnPreviousPolicy: 0,
            PreviousPolicyType: 'Comprehensive Package',
            PreviousInsurerName: client.c_prev_insurer ? client.c_prev_insurer : "",
            PreviousPolicyNumber: client.c_prev_policy_number ? client.c_prev_policy_number : "",
        },
        CustomerDetails: {
            CustomerType: client.c_customer_type.toLowerCase() === "i" ? 'INDIVIDUAL' : "CORPORATE",
            CustomerName: `${client.c_first_name} ${client.c_last_name}`,
            DateOfBirth,
            PinCode: client.c_pincode ? client.c_pincode : "",
            PANCardNo: client.c_pan_number ? client.c_pan_number : "",
            Email: client.c_email ? client.c_email : "",
            MobileNumber: client.c_mobile ? client.c_mobile : "",
            AddressLine1,
            CountryCode: 100,
            StateCode: 65,
            CityCode: 200,
            AadharNumber: client.c_aadhar_number ? client.c_aadhar_number : "",
            GSTDetails: {
                CustomerType: 'RELATED PARTIES',
                ConstitutionOfBusiness: 'PROPRIETORSHIP',
                GSTToState: 'MAHARASHTRA',
                PanDetails: 'TESTI8895F',
                GSTRegistrationStatus: 'TO BE COMMENCED',
                GSTInNumber: '27TESTI8895F2Z5'
            }
        },
        nomineeDetails: {
            NameOfNominee: client.c_nominee_full_name ? client.c_nominee_full_name : "",
            Age,
            Relationship: client.c_nominee_relation ? client.c_nominee_relation : "",
        }
    }

    return {
        error: false,
        data: client_object,
    };
};

export const IciciPcProposalServerToClientMapper = (server) => {
    return server;
};


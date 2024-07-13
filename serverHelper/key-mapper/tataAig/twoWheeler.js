import {
    errorResponse,
    splitRegistrationNumber,
    DateToTataAigDateConverterHandler,
    getNextDay,
    getPrevDay,
    TataAigDateToDateConverterHandler,
    getStartAndEndPolicyDate
} from "serverHelper/helperFunctions";
import InsurerArray from "../../db/tataAig/InsurersMaster.json";
import { TataAigTwMakeModelVariantHandler } from "server_helper/serverSideFunctions/vehicle/twoWheeler";
import { constants } from "server_helper/constants";
import { TataAigRtoDetails } from "server_helper/serverSideFunctions/rto";
import differenceInMonths from 'date-fns/differenceInMonths';
import { differenceInCalendarDays } from "date-fns";

export let TataAigTwQuoteClientToServerMapper = (client, quote_type) => {
    /////////////////////////----- VALIDATIONS -----/////////////////////////

    if (!client.c_customer_type) return errorResponse("Customer Type is required");
    if (client.c_engine_number && client.c_engine_number.toString().length < 8) {
        return errorResponse("Engine number should be minimun 8 characters");
    }
    if (!client.c_rollover) {
        if (client.c_registration_date) {
            const dateDiff = differenceInMonths(new Date(), new Date(client.c_registration_date));
            if (dateDiff > 6) {
                return errorResponse("Bike must be registered between 6 months from today");
            } else if (dateDiff === 6) {
                if (getDate(new Date(client.c_registration_date)) > getDate(new Date())) {
                    return errorResponse("Bike must be registered before 6 months on same date");
                }
            }
        } else {
            return errorResponse("Registration Date is mandatory for new business");
        }
    }
    // if (quote_type === "full" && !client?.c_registration_number)
    //     return errorResponse("Registartion number required in full quote");
    if (quote_type === "full" && (!client?.tataAig?.s_idv_upper_limit || !client?.tataAig?.s_idv_lower_limit))
        return errorResponse("IDV Upper limit & IDV Lower limit is required for full quote");

    /////////////////////////----- PLAN TYPE DETAILS-----/////////////////////////

    const planType = client.c_plan.split("-");
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
    }


    let covertype_code = "";
    let covertype_name = "";

    let cover_type = "package";

    if (client.c_plan === "TP-1-OD-0") {
        cover_type = "liability";
        covertype_code = 2;
        covertype_name = "Liability";
    } else if (client.c_plan === "TP-0-OD-1") {
        cover_type = "ownDamage";
        covertype_code = 3;
        covertype_name = "Standalone Own Damage";
    } else if (client.c_plan === "TP-1-OD-1") {
        cover_type = "package";
        covertype_code = 1;
        covertype_name = "Package";
    }

    ////// Rollover

    if (client.c_plan === "TP-2-OD-2") {
        return errorResponse("TP 2 years and OD 2 years is not applicable for Tata Aig Rollover");
    } else if (client.c_plan === "TP-3-OD-3") {
        return errorResponse("TP 3 years and OD 3 years is not applicable for Tata Aig Rollover");
    }

    ////// New Business

    if (client.c_plan === "TP-5-OD-3") {
        return errorResponse("TP 5 years and OD 3 years is not applicable for Tata Aig New Business");
    } else if (client.c_plan === "TP-5-OD-5") {
        return errorResponse("TP 5 years and OD 5 years is not applicable for Tata Aig New Business");
    }


    /////////////////////////----- VEHICLE & RTO DETAILS -----/////////////////////////

    let segment_code, fuel_code, veh_age;
    let purchase_date = DateToTataAigDateConverterHandler(client.c_registration_date);
    let manf_year = new Date(client.c_manufacture_year_month).getFullYear();

    let age = new Date().getFullYear() - new Date(client.c_registration_date).getFullYear();
    if (age <= 10) {
        veh_age = age;
    } else {
        return errorResponse("Vechile age is more than 10 years");
    }

    let vehicleDetails = TataAigTwMakeModelVariantHandler(client);

    if (Object.keys(vehicleDetails).length === 0) {
        return errorResponse("Vehicle Details not available Kotak Database");
    }

    if (vehicleDetails.TXT_SEGMENTTYPE) {
        if (vehicleDetails.TXT_SEGMENTTYPE.toLowerCase() === "scooter") {
            segment_code = 7;
        } else if (vehicleDetails.TXT_SEGMENTTYPE.toLowerCase() === "motor cycle") {
            segment_code = 8;
        } else if (vehicleDetails.TXT_SEGMENTTYPE.toLowerCase() === "moped") {
            segment_code = 9;
        }
    }

    if (vehicleDetails.TXT_FUEL) {
        switch (vehicleDetails.TXT_FUEL) {
            case "Petrol":
                fuel_code = 1;
                break;
            case "Diesel":
                fuel_code = 2;
                break;
            case "CNG":
                fuel_code = 3;
                break;
            case "Battery":
                fuel_code = 4;
                break;
            case "External CNG":
                fuel_code = 5;
                break;
            case "External LPG":
                fuel_code = 6;
                break;
            case "Electricity":
                fuel_code = 7;
                break;
            case "Hydrogen":
                fuel_code = 8;
                break;
            case "LPG":
                fuel_code = 9;
                break;

            default:
                break;
        }
    }

    let regno_1, regno_2, regno_3, regno_4, splittedRegNumber, registartion_number;

    regno_1 = client.c_place_of_registration.slice(0, 2);
    regno_2 = client.c_place_of_registration.slice(2, 4);
    regno_3 = "";
    regno_4 = "";

    if (client.c_registration_number) {
        splittedRegNumber = splitRegistrationNumber(client.c_registration_number);
        regno_1 = splittedRegNumber.num1;
        regno_2 = splittedRegNumber.num2;
        regno_3 = splittedRegNumber.num3;
        regno_4 = splittedRegNumber.num4;
    } else {
        registartion_number = `${regno_1}${regno_2}AB1234`;
        splittedRegNumber = splitRegistrationNumber(registartion_number);
        regno_1 = splittedRegNumber.num1;
        regno_2 = splittedRegNumber.num2;
        regno_3 = splittedRegNumber.num3;
        regno_4 = splittedRegNumber.num4;
    }

    let rtoDetails = TataAigRtoDetails(client.c_place_of_registration);

    if (Object.keys(rtoDetails).length === 0) {
        return errorResponse("Rto Details not available Kotak Database");
    }

    /////////////////////////----- PREV POLICY DETAILS -----/////////////////////////

    let pp_covertype_code = "",
        pp_covertype_name = "",
        pp_enddate = "",
        pp_claim_yn = "",
        pp_prev_ncb = "",
        pp_curr_ncb,
        tenure = "",
        cust_gstin = "";

    if (cover_type) {
        if (cover_type === "package") {
            pp_covertype_code = 1;
            pp_covertype_name = "Package";
        } else if (cover_type === "liability") {
            pp_covertype_code = 2;
            pp_covertype_name = "Liability";
        } else if (cover_type === "ownDamage") {
            pp_covertype_code = 3;
            pp_covertype_name = "Standalone Own Damage";
        }
    }

    if (client.c_prev_policy_expire_date) {
        pp_enddate = DateToTataAigDateConverterHandler(client.c_prev_policy_expire_date);
    } else {
        pp_enddate = DateToTataAigDateConverterHandler(new Date());
    }

    if (quote_type === "full") {
        if (cover_type === "package") {
            pp_claim_yn = client.c_claim_last_year ? "Y" : "N";
            if (pp_claim_yn === "N") {
                pp_prev_ncb = Number(client.c_ncb) ? Number(client.c_ncb) : 0;
                pp_curr_ncb = Number(client.c_ncb) ? Number(client.c_ncb) : 0;
            } else {
                pp_prev_ncb = "0";
                pp_curr_ncb = "0";
            }
        } else {
            pp_claim_yn = "N";
            pp_prev_ncb = "0";
            pp_curr_ncb = "0";
        }
    } else {
        pp_claim_yn = client.c_claim_last_year ? "Y" : "N";
        if (pp_claim_yn === "N") {
            pp_prev_ncb = Number(client.c_ncb) ? Number(client.c_ncb) : 0;
            pp_curr_ncb = Number(client.c_ncb) ? Number(client.c_ncb) : 0;
        } else {
            pp_prev_ncb = "0";
            pp_curr_ncb = "0";
        }
    }

    if (quote_type === "full" && client.c_customer_type) {
        if (client.c_customer_type.toLowerCase() === "i") {
            cust_gstin = "";
        } else {
            cust_gstin = client?.c_gst_number;
        }
    } else {
        cust_gstin = "";
    }

    if (client.c_rollover) {
        if (cover_type === "package") {
            tenure = policy_tenure;
        } else {
            tenure = "1";
        }
    } else {
        if (cover_type === "package") {
            tenure = policy_tenure;
        } else {
            tenure = "5";
        }
    }

    let risk_startdate, risk_enddate, policyStartDate;

    let policyDates = getStartAndEndPolicyDate(client)

    
    risk_startdate = DateToTataAigDateConverterHandler(policyDates.start_date)
    risk_enddate = DateToTataAigDateConverterHandler(policyDates.end_date)
    
    // let differenceDays = differenceInCalendarDays(new Date(client.c_prev_policy_expire_date), new Date())

    // if (client.c_rollover) {
    //     if (client.c_prev_policy_expire_date && differenceDays >= 0) {
    //         policyStartDate = getNextDay(new Date(client.c_prev_policy_expire_date))
    //     } else {
    //         policyStartDate = getNextDay(new Date())
    //     }
    // } else {
    //     policyStartDate = new Date()
    // }

    // risk_startdate = DateToTataAigDateConverterHandler(policyStartDate);

    // if (client.c_rollover) {
    //     if (Number(policy_tenure)) {
    //         const policyEndDate = getPrevDay(policyStartDate)
    //         risk_enddate = DateToTataAigDateConverterHandler(policyEndDate, Number(policy_tenure), 0);
    //     } else {
    //         const policyEndDate = getPrevDay(policyStartDate)
    //         risk_enddate = DateToTataAigDateConverterHandler(policyEndDate, 1, 0);
    //     }
    // } else {
    //     if (client.c_rollover) {
    //         risk_enddate = DateToTataAigDateConverterHandler(new Date(), 5, 0);
    //     } else {
    //         const policyEndDate = getPrevDay(policyStartDate)
    //         risk_enddate = DateToTataAigDateConverterHandler(policyEndDate, 5, 0);
    //     }
    // }


    /////////////////////////----- QUOTATION DETAILS -----/////////////////////////

    let quotation_no = "";

    if (quote_type === "full") {
        if (client?.tataAig?.s_quote_id) {
            quotation_no = client?.tataAig?.s_quote_id;
        }
    }

    let idv = "",
        revised_idv = "",
        idvupperlimit = "",
        idvlowerlimit = "",
        uw_discount = "",
        Uw_DisDb = "",
        uw_load = "",
        uw_loading_discount = "0",
        uw_loading_discount_flag = "D";

    if (quote_type === "full") {
        idvlowerlimit = Number(client?.tataAig?.s_idv_lower_limit);
        idvupperlimit = Number(client?.tataAig?.s_idv_upper_limit);

        if (cover_type === "package" || cover_type === "ownDamage") {
            idv = client?.tataAig?.s_idv ? client?.tataAig?.s_idv : "";
            if (client?.c_request_idv) {
                if (idvlowerlimit && idvupperlimit) {
                    if (
                        idvlowerlimit < Number(client?.c_request_idv) &&
                        idvupperlimit > Number(client?.c_request_idv)
                    ) {
                        revised_idv = client?.c_request_idv;
                    } else {
                        return errorResponse(`Revised Idv should be between ${idvlowerlimit} and ${idvupperlimit}`);
                    }
                } else {
                    return errorResponse(`idvlowerlimit and idvupperlimit is required for revised_idv`);
                }
            } else {
                revised_idv = client?.tataAig.s_idv ? client?.tataAig?.s_idv : "";
            }
        }

        uw_discount = client?.tataAig?.s_uw_discount;
        Uw_DisDb = client?.tataAig?.s_uw_disDb;
        uw_load = client?.tataAig?.s_uw_load;
        uw_loading_discount = client?.tataAig?.s_uw_loading_discount;
        uw_loading_discount_flag = client?.tataAig?.s_uw_loading_discount_flag;
    }

    /////////////////////////----- ADDONS DETAILS -----/////////////////////////

    let C1, C2, C3, C4, C5, C6, C7, C8, C10, C11, C12, C17, C18, C29, C35, C37, C38, C47, C49, C50, C51;
    let cover_opted = [];
    let driver_declaration = "ODD01";

    C8 = { opted: "N" };
    C38 = { opted: "N" };
    C37 = { opted: "N" };
    C35 = { opted: "N", no_of_claims: "2", Deductibles: "0" };
    C47 = { opted: "N" };

    if (cover_type === "package" || cover_type === "ownDamage") {
        C1 = { opted: "Y" };
        cover_opted = [...cover_opted, "C1"];
    } else {
        C1 = { opted: "N" };
    }

    if (cover_type !== "ownDamage") {
        C2 = { opted: "Y" };
        cover_opted = [...cover_opted, "C2"];
    } else {
        C2 = { opted: "N" };
    }

    if (driver_declaration === "ODD01" && client.c_customer_type.toLowerCase() === "i" && covertype_name !== "Standalone Own Damage") {
        C3 = { opted: "Y", tenure: "1" };
        cover_opted = [...cover_opted, "C3"];
    } else {
        C3 = { opted: "N", tenure: "" };
    }

    if (Number(client?.addons?.c_electrical_accessories)) {
        C4 = { opted: "Y", SI: Number(client?.addons?.c_electrical_accessories) };
        cover_opted = [...cover_opted, "C4"];
    } else {
        C4 = { opted: "N", SI: "" };
    }

    if (Number(client?.addons?.c_non_electrical_accessories)) {
        C5 = { opted: "Y", SI: Number(client?.addons?.c_non_electrical_accessories) };
        cover_opted = [...cover_opted, "C5"];
    } else {
        C5 = { opted: "N", SI: "" };
    }   

    if (Number(client?.addons?.c_side_car)) {
        C6 = { opted: "Y", SI: Number(client?.addons?.c_side_car) };
        cover_opted = [...cover_opted, "C6"];
    } else {
        C6 = { opted: "N", SI: "" };
    }

    if (Number(client?.addons?.c_lpg_cng_kit)) {
        C7 = { opted: "Y", SI: Number(client?.addons?.c_lpg_cng_kit) };
        cover_opted = [...cover_opted, "C7"];
    } else {
        C7 = { opted: "N", SI: "" };
    }

    if (Number(client?.addons?.c_voluntary_excess)) {
        C10 = { opted: "Y", SI: Number(client?.addons?.c_voluntary_excess) };
        cover_opted = [...cover_opted, "C10"];
    } else {
        C10 = { opted: "N", SI: "" };
    }

    if (client?.addons?.c_anti_theif) {
        C11 = { opted: "Y" };
        cover_opted = [...cover_opted, "C11"];
    } else {
        C11 = { opted: "N" };
    }

    if (client?.addons?.c_limit_tppd) {
        C12 = { opted: "Y" };
        cover_opted = [...cover_opted, "C12"];
    } else {
        C12 = { opted: "N" };
    }

    if (Number(client?.addons?.c_pa_unnamed_passenger)) {
        C17 = { opted: "Y", SI: Number(client?.addons?.c_pa_unnamed_passenger), persons: 1 };
        cover_opted = [...cover_opted, "C17"];
    } else {
        C17 = { opted: "N", SI: "", persons: "" };
    }

    if (client?.addons?.c_legal_liability_pd) {
        C18 = { opted: "Y", persons: 1 };
        cover_opted = [...cover_opted, "C18"];
    } else {
        C18 = { opted: "N", persons: "" };
    }

    if (Number(client?.addons?.c_depreciation_cover)) {
        C35 = { opted: "Y", SI: Number(client?.addons?.c_depreciation_cover) };
        cover_opted = [...cover_opted, "C35"];
    } else {
        C35 = { opted: "N", SI: "" };
    }

    if (Number(client?.addons?.c_return_to_invoice)) {
        C38 = { opted: "Y", SI: Number(client?.addons?.c_return_to_invoice) };
        cover_opted = [...cover_opted, "C38"];
    } else {
        C38 = { opted: "N", SI: "" };
    }

    if (Number(client?.addons?.c_road_side_assistance)) {
        C47 = { opted: "Y", SI: Number(client?.addons?.c_road_side_assistance) };
        cover_opted = [...cover_opted, "C47"];
    } else {
        C47 = { opted: "N", SI: "" };
    }

    cover_opted = cover_opted.join();

    const covers = { C1, C2, C3, C4, C5, C6, C7, C8, C10, C11, C12, C17, C18, C29, C35, C37, C38, C47, C49, C50, C51 };

    const server_object = {
        functionality: "validatequote",
        quote_type,
        vehicle: {
            quotation_no,
            segment_code,
            segment_name: vehicleDetails.TXT_SEGMENTTYPE,
            cc: vehicleDetails.CUBICCAPACITY,
            sc: vehicleDetails.SEATINGCAPACITY,
            sol_id: constants?.tataAig?.quotation.sol_Id,
            lead_id: "",
            mobile_no: client.c_mobile ? client.c_mobile : "",
            email_id: client.c_email ? client.c_email : "",
            emp_email_id: "",
            customer_type: client.c_customer_type.toLowerCase() === "i" ? "Individual" : "Organization",
            product_code: "3122",
            product_name: "Two Wheeler",
            // subproduct_code: vehicleDetails.VEHICLECLASSCODE,
            subproduct_code: 37,
            subproduct_name: "Two Wheeler",
            subclass_code: "",
            subclass_name: "",
            covertype_code,
            covertype_name,
            btype_code: client.c_rollover ? 2 : 1,
            btype_name: client.c_rollover ? "Roll Over" : "New Business",
            risk_startdate,
            risk_enddate,
            purchase_date,
            veh_age,
            manf_year,
            make_code: vehicleDetails?.MANUFACTURERCODE || "",
            make_name: vehicleDetails?.MANUFACTURER || "",
            model_code: vehicleDetails?.NUM_PARENT_MODEL_CODE || "",
            model_name: vehicleDetails?.VEHICLEMODEL || "",
            variant_code: vehicleDetails?.VEHICLEMODELCODE || "",
            variant_name: vehicleDetails?.TXT_VARIANT || "",
            model_parent_code: vehicleDetails?.NUM_PARENT_MODEL_CODE || "",
            fuel_code,
            fuel_name: vehicleDetails?.TXT_FUEL || "",
            gvw: "",
            age: "0",
            miscdtype_code: "",
            bodytype_id: vehicleDetails?.BODYTYPECODE || "",
            idv,
            revised_idv,
            regno_1,
            regno_2,
            regno_3,
            regno_4,
            rto_loc_code: rtoDetails?.RTO_LOC_CODE || "",
            rto_loc_name: rtoDetails?.RTO_LOC || "",
            rtolocationgrpcd: rtoDetails?.RTO_LOCATION_GRP_CD || "",
            rto_zone: rtoDetails?.RTO_ZONE || "",
            rating_logic: "",
            campaign_id: "",
            fleet_id: "",
            discount_perc: "",
            pp_covertype_code,
            pp_covertype_name,
            pp_enddate,
            pp_claim_yn,
            pp_prev_ncb,
            pp_curr_ncb,
            addon_plan_code: "P1",
            addon_choice_code: "CHOICE1",
            cust_name: client.c_full_name ? client.c_full_name : "",
            ab_cust_id: "",
            ab_emp_id: "",
            usr_name: "",
            producer_code: "",
            pup_check: "N",
            pos_panNo: "",
            pos_aadharNo: "",
            is_cust_JandK: "NO",
            cust_pincode: rtoDetails?.RTO_PINCODE || "",
            cust_gstin,
            tenure,
            uw_discount,
            Uw_DisDb,
            uw_load,
            uw_loading_discount,
            uw_loading_discount_flag,
            engine_no: client.c_engine_number ? client.c_engine_number : "",
            chasis_no: client.c_chassis_number ? client.c_chassis_number : "",
            tppolicytype: "Comprehensive Package",
            tppolicytenure: "5",
            driver_declaration,
            ac_opted_in_pp: "Y",
            idvupperlimit,
            idvlowerlimit,
            agent_state_code: "101",
            cust_state_code: "2",
            otp_mobile_no: "",
            cover_opted,
            od_covers: "C1",
            tp_covers: "C2,C3",
            addon_covers: "",
            PP_FLAG: "N",
            AA_FLAG: "N",
            INSPECT_FLAG: "N",
            MAINDRIVER_FLAG: "N",
        },
        cover: {
            ...covers,
        },
    };

    return server_object;
};

export let TataAigTwQuoteServerToClientMapper = (server) => {
    const make = server?.data?.quotationdata?.make_name;
    const model = server?.data?.quotationdata?.model_name;
    const variants = server?.data?.quotationdata?.variant_name;
    const rto_location = server?.data?.quotationdata?.rto_loc_name;
    const rto_zone = server?.data?.quotationdata?.rto_zone;

    const makeModelDetails = `${make} ${model} ${variants}`;
    const rtoDetails = `${rto_location} ${rto_zone}`;

    let server_object = {
        s_net_premium: server?.data?.NETPREM,
        s_total_premium: server?.data?.TOTALPAYABLE,
        s_idv: server?.data?.quotationdata?.idv,
        s_revised_idv: server.data?.quotationdata?.revised_idv,
        s_idv_lower_limit: server?.data?.quotationdata?.idvlowerlimit,
        s_idv_upper_limit: server?.data?.quotationdata?.idvupperlimit,
        s_gst_amount: server?.data?.TAX?.total_prem,
        s_gst_percent: server?.data?.TAX?.total_rate,
        s_ncb_percent: server?.data?.C15?.rate,
        s_ncb_amount: server?.data?.C15?.premium,
        s_basic_od_premium: server?.data?.C1?.premium,
        s_basic_tp_premium: server?.data?.C2?.premium,
        s_make_model_details: makeModelDetails,
        s_rto_details: rtoDetails,
        s_quote_id: server?.data?.quotationdata?.quotation_no,
        s_system_idv: server?.nSystemIDV,
        s_uw_discount: server?.data?.quotationdata?.uw_discount,
        s_uw_disDb: server?.data?.quotationdata?.Uw_DisDb,
        s_uw_load: server?.data?.quotationdata?.uw_load,
        s_uw_loading_discount: server?.data?.quotationdata?.uw_loading_discount,
        s_uw_loading_discount_flag: server?.data?.quotationdata?.uw_loading_discount_flag,
        s_pa_cover_owner_driver_si: server?.data?.C3?.SI,
        s_pa_cover_owner_driver_premium: server?.data?.C3?.premium,
        s_electrical_accessories_si: server?.data?.C4?.SI,
        s_electrical_accessories_premium: server?.data?.C4?.premium,
        s_non_electrical_accessories_si: server?.data?.C5?.SI,
        s_non_electrical_accessories_premium: server?.data?.C5?.premium,
        s_anti_theif_premium: server?.data?.C11?.premium,
        s_side_car_si: server?.data?.C6?.SI,
        s_side_car_premium: server?.data?.C6?.premium,
        s_pa_unnamed_passenger_si: server?.data?.C17?.SI,
        s_pa_unnamed_passenger_premium: server?.data?.C17?.premium,
        s_lpg_cng_kit_premium: server?.data?.C7?.premium,
        s_limit_tppd_premium: server?.data?.C12?.premium,
        s_legal_liability_pd_premium: server?.data?.C18?.premium,
        s_policy_start_date: TataAigDateToDateConverterHandler(server?.data?.quotationdata?.risk_startdate),
        s_policy_end_date: TataAigDateToDateConverterHandler(server?.data?.quotationdata?.risk_enddate),
        s_company_name: "tataAig",
        s_service_type: "two_wheeler",
        s_plan_type: "premium",
        s_plan_name: "Tata Aig General Insurance",
    };

    return server_object;
};

///////////////////////////////////////////////////  PROPOSAL  ///////////////////////////////////////////

export const TataAigTwProposalClientToServerMapper = (client) => {
    let salutation = "",
        client_type = "",
        organization_name = "",
        first_name = "",
        middle_name = "",
        last_name = "",
        gender = "",
        dob = "",
        marital_status = "Others";

    let c_gst_number;

    if (client?.c_customer_type?.toLowerCase() === "i") {
        salutation = client?.c_title ? client?.c_title : "";
        client_type = "Individual";
        first_name = client?.c_first_name ? client?.c_first_name : "";
        middle_name = client?.c_middle_name ? client?.c_middle_name : "";
        last_name = client?.c_last_name ? client?.c_last_name : "";
        gender = client?.c_gender ? client?.c_gender : "";
        dob = DateToTataAigDateConverterHandler(client?.c_dob);
        if (client?.c_maritial_status) {
            if (client?.c_maritial_status.toLowerCase() == "married") {
                marital_status = "Married";
            } else if (client?.c_maritial_status.toLowerCase() == "single") {
                marital_status = "Single";
            }
        }
    } else {
        salutation = "M/s.";
        client_type = "Organization";
        organization_name = client?.c_company_name ? client?.c_company_name : "";
        marital_status = "";
    }

    ////////////////////////////////////////////////// INSURER
    let code = "",
        name = "";

    if (client.c_prev_insurer) {
        InsurerArray.map((insurer) => {
            if (insurer.shortname.toLowerCase() === client.c_prev_insurer.toLowerCase()) {
                name = insurer.companyname;
                code = insurer.shortname;
            }
        });
    }

    ////////////////////////////////////////////////// INSURER

    let financier_name = "";
    let financier_type = "";

    const client_object = {
        functionality: "validateproposal",
        quotation_no: client?.company_object?.s_quote_id,
        sol_id: "1001",
        lead_id: "",
        pol_sdate: DateToTataAigDateConverterHandler(client.c_prev_policy_expire_date, undefined, 1),
        sp_name: "Name",
        sp_license: "Lino12345566",
        sp_place: "Mahbubnagar",
        productcod: "3122",
        customer: {
            salutation,
            client_type,
            organization_name,
            first_name,
            middle_name,
            last_name,
            gender,
            dob,
            marital_status,
            address_1: client?.c_address_line1 ? client?.c_address_line1 : "",
            address_2: client?.c_address_line2 ? client?.c_address_line2 : "",
            address_3: client?.c_address_line3 ? client?.c_address_line3 : "",
            address_4: client?.c_address_line4 ? client?.c_address_line4 : "",
            pincode: client?.c_pincode ? client?.c_pincode : "",
            account_no: "",
            cust_aadhaar: client?.c_aadhar_number ? client?.c_aadhar_number : "",
            cust_pan: client?.c_pan_number ? client?.c_pan_number : "",
            mobile_no: client.c_mobile ? client.c_mobile : "",
            email_id: client.c_email ? client.c_email : "",
        },
        vehicle: {
            engine_no: client?.c_engine_number ? client?.c_engine_number : "",
            chassis_no: client?.c_chassis_number ? client?.c_chassis_number : "",
        },
        prevpolicy: {
            flag: client.c_existing_policy ? "Y" : "N",
            code,
            name,
            address1: client.c_address_line1 ? client.c_address_line1 : "",
            address2: "",
            address3: "",
            polno: client?.c_prev_policy_number ? client?.c_prev_policy_number : "",
            pincode: "",
            doc_name: "",
        },
        bundpolicy: {
            flag: "N",
        },
        financier: {
            type: client?.financier_type ? client?.financier_type : "",
            name: client?.financier_name ? client?.financier_name : "",
            address: "",
            loanacno: "",
        },
        automobile: { flag: "N", number: "", name: "", expiry_date: "" },
        nominee: {
            name: client.c_nominee_full_name ? client.c_nominee_full_name : "",
            age: client.c_nominee_dob ? new Date().getFullYear() - new Date(client.c_nominee_dob).getFullYear() : "",
            relation: client.c_nominee_relation ? client.c_nominee_relation : "",
        },
        driver: {
            flag: client?.c_customer_type?.toLowerCase() === "i" ? "N" : "Y",
            fname: client?.c_customer_type?.toLowerCase() === "i" ? client?.c_first_name : "",
            lname: client?.c_customer_type?.toLowerCase() === "i" ? client?.c_last_name : "",
            gender: client?.c_customer_type?.toLowerCase() === "i" ? client?.c_gender : "",
            age: "",
            drivingexp: "",
            marital_status: client?.c_customer_type?.toLowerCase() === "i" ? client?.c_maritial_status : "",
        },
        inspection: {
            flag: "N",
            number: "",
            date: "",
            agency_name: "",
            imagename_1: "",
            imagename_2: "",
            imagename_3: "",
        },
    };
    return client_object;
};

export const TataAigTwProposalServerToClientMapper = (server) => {
    const server_response = {
        s_proposal_number: server.data.proposalno,
        s_quote_id: server.data.quotationno,
        s_premium: server.data.premium,
        s_random_key: server.data.randkey,
        s_company_name: "tataAig",
        s_service_type: "two_wheeler",
        s_plan_type: "proposal",
        s_plan_name: "Tata Aig General Insurance",
    };
    return server_response;
};

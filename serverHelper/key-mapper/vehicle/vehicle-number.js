import RTOArray from "../../db/kotak/master/tw_rto_master.json";
import ModelArray from "../../db/kotak/uat/tw_model.json";
import TwVehicleDetails from "../../db/master/two-wheeler.json";
import PcVehicleDetails from "../../db/master/private-car.json";
import InsurerDetails from "../../db/master/insurers.json";
import getYear from "date-fns/getYear";
import { MasterTwMakeModelVariantHandler } from "../../serverSideFunctions/vehicle/twoWheeler";

// MH12SP4923
//           maker_description: TVS MOTOR COMPANY LTD
//           maker_model:  TVS APACHE RTR 200 4V
// MH12GH2531
//           maker_description: TVS MOTOR COMPANY LTD
//           maker_model:  TVS APACHE RTR 180
// TS21D3421
//           maker_description: INDIA YAMAHA MOTOR PVT LTD
//           maker_model:  YAMAHA R15 BSIV
// TS21G0007
//           maker_description: M/S. CLASSIC LEGENDS PVT LTD.
//           maker_model: JAWA FORTY TWO BSIV
// TS21A9099
//           maker_description: HONDA MOTORCYCLE AND SCOOTER INDIA (P) LTD
//           maker_model: ACTIVA 4G W E A S& KS&DRUMCBS
// AP29BJ5267
//           maker_description: HERO HONDA MOTORS  LTD
//           maker_model: CBZ X-TREME (ES)  BSIII
// TS21B4999
//           maker_description: ROYAL ENFIELD
//           maker_model: CLASSIC 350 BSIV
//MH01BJ1980

export const VehicleServerToClient = (server) => {
    let c_rto_registration_code = null;
    let c_rto_location = null;

    let c_place_of_registration;
    let c_prev_insurer = null;
    let c_prev_policy_number = null;
    let c_prev_policy_expire_date = null;
    let c_pucc_number = null;
    let c_pucc_upto = null;
    let c_make = "";
    let c_model = "";
    let c_variant = "";
    let variant = "";
    let insurer = "";
    let vehicleDetails = {};
    let vehicleType = "";

    if (server?.vehicle_category_description?.toUpperCase() === "M-CYCLE/SCOOTER(2WN)") {
        vehicleDetails = MasterTwMakeModelVariantHandler(server)
        vehicleType = "two-wheeler"
    }

    if (Object.keys(vehicleDetails).length > 0) {
        c_make = vehicleDetails?.MANUFACTURER;
        c_model = vehicleDetails?.VEHICLEMODEL;
        c_variant = `${vehicleDetails?.TXT_VARIANT} ${vehicleDetails?.CUBICCAPACITY}CC`;
    }

    // ///////////////////////////-------- MAKE DETAILS -------////////////////////////

    // let makeArray = [];

    // if (server?.vehicle_category_description?.toUpperCase() === "M-CYCLE/SCOOTER(2WN)") {
    //     TwVehicleDetails?.map((vehicle, i) => {
    //         if (server?.maker_description.toLowerCase().includes(vehicle?.MANUFACTURER.toLowerCase())) {
    //             makeArray.push(vehicle.MANUFACTURER);
    //         }
    //     });
    // }

    // makeArray = [...new Set(makeArray)];

    // if (makeArray.length > 0) {
    //     if (makeArray.length > 1) {
    //         c_make = makeArray[0];
    //     } else {
    //         c_make = makeArray[0];
    //     }
    // }

    // ///////////////////////////-------- MODEL DETAILS -------////////////////////////

    // let modelArray = [];

    // if (server?.maker_model?.toLowerCase().includes(c_make?.toLowerCase())) {
    //     c_model = server?.maker_model?.toLowerCase().replace(c_make?.toLowerCase(), "").trim();
    // } else {
    //     c_model = server?.maker_model;
    // }

    // TwVehicleDetails.map((vehicle, i) => {
    //     if (vehicle.MANUFACTURER === c_make) {
    //         if (c_model.toLowerCase().includes(vehicle.VEHICLEMODEL.toLowerCase())) {
    //             modelArray.push(vehicle.VEHICLEMODEL);
    //         }
    //     }
    // });

    // modelArray = [...new Set(modelArray)];

    // if (modelArray.length > 0) {
    //     if (modelArray.length > 1) {
    //         c_model = modelArray[0];
    //     } else {
    //         c_model = modelArray[0];
    //     }
    // }

    // ///////////////////////////-------- VARIANT DETAILS -------////////////////////////

    // let variantArray = [];

    // TwVehicleDetails.map((vehicle, i) => {
    //     if (vehicle.MANUFACTURER === c_make && vehicle.VEHICLEMODEL === c_model) {
    //         if (c_model.toLowerCase().includes(vehicle.TXT_VARIANT.toLowerCase())) {
    //             console.log(vehicle.TXT_VARIANT);
    //             variantArray.push(vehicle.TXT_VARIANT);
    //         }
    //     }
    // });

    ///////////////////////////-------- RTO DETAILS -------////////////////////////

    RTOArray.forEach((rto) => {
        if (server.rc_number.toLowerCase().slice(0, 4) === rto.NUM_REGISTRATION_CODE.toLowerCase()) {
            c_rto_registration_code = rto.NUM_REGISTRATION_CODE;
            c_rto_location = rto.TXT_RTO_LOCATION_DESC;
        }
    });

    if (c_rto_registration_code && c_rto_location) {
        c_place_of_registration = `${c_rto_registration_code}, ${c_rto_location}`;
    } else {
        c_place_of_registration = server.registered_at;
    }

    ///////////////////////////-------- INSURER DETAILS -------////////////////////////
    let insurerArray = [];

    InsurerDetails.map((insurer, i) => {
        if (server.insurance_company.toLowerCase().includes(insurer.shortname.toLowerCase())) {
            insurerArray.push(insurer.shortname);
        }
    });

    if (insurerArray.length > 1) {
        c_prev_insurer = insurerArray[0];
    } else {
        c_prev_insurer = insurerArray[0];
    }

    const returnObject = {
        c_make,
        c_model,
        c_variant,
        c_registration_number: server.rc_number || "",
        c_registartion_date: server.registration_date || "",
        c_full_name: server.owner_name || "",
        c_address_line1: server.present_address || "",
        c_contact_address_line1: server.permanent_address || "",
        c_mobile: server.c_mobile || "",
        c_chassis_number: server.vehicle_chasi_number || "",
        c_engine_number: server.vehicle_engine_number || "",
        c_body_type: server.body_type || "",
        c_fuel_type: server.fuel_type || "",
        c_colour: server.colour || "",
        c_financer: server.financer || "",
        c_financed: server.financed || "",
        c_prev_insurer,
        c_prev_policy_number: server.insurance_policy_number || "",
        c_prev_policy_expire_date: server.insurance_upto || "",
        c_manufacture_year_month: server.manufacturing_date || "",
        c_place_of_registration,
        c_vehicle_cc: server.cubic_capacity ? Number(server.cubic_capacity).toFixed(0) : "",
        c_seat_capacity: server.seat_capacity || "",
        c_vehicle_category: server.vehicle_category_description || "",
        c_make_model: `${server.maker_description}, ${server.maker_model}, ${server.fuel_type}`,
        c_vehicle_weight: server.vehicle_gross_weight || "",
        c_no_cylinders: server.no_cylinders || "",
        c_rto_registration_code,
        c_pucc_number: server.pucc_number || "",
        c_pucc_upto: server.pucc_upto || "",
    };

    // return server;
    return returnObject;
};

import kotakTwRto from "serverHelper/db/kotak/master/tw_rto_master.json";
import kotakPcRto from "serverHelper/db/kotak/master/pc_rto_master.json";
import kotakUatTwRto from "serverHelper/db/kotak/uat/tw_rto.json";
import kotakUatPcRto from "serverHelper/db/kotak/uat/pc_rto.json";
import rtoMaster from "../../db/master/rto.json";
import TataAigRto from "../../db/tataAig/rto_master.json";
import iciciRto from "../../db/icici/TwRtoMaster.json";

export const RtoAllLocationsHandler = (req, res) => {
    let locations = rtoMaster.map((value) => `${value?.NUM_REGISTRATION_CODE} ${value?.TXT_RTO_LOCATION_DESC?.toUpperCase()}`);

    locations = [...new Set(locations)];

    res.send({
        status: 200,
        data: locations
    });
};

export const RtoStatesHandler = (req, res) => {
    const filterRTO = [];

    let rtoArray = [];

    if (req.query.slug === "tw-states") {
        rtoArray = [...kotakUatTwRto];
    } else if (req.query.slug === "pc-states") {
        rtoArray = [...kotakUatPcRto];
    }

    rtoArray.map((uatValue) => {
        const filterState = rto.filter((value) => value.TXT_RTO_LOCATION_CODE === uatValue.TXT_RTO_LOCATION_CODE);
        if (filterState.length > 0) {
            filterRTO.push(filterState[0]);
        }
    });

    const states = [];

    const stateCodeArray = filterRTO.map((value) => {
        return value.NUM_STATE_CODE;
    });

    const stateCodeNoRepeat = [...new Set(stateCodeArray)];
    stateCodeNoRepeat.map((value) => {
        for (let x = 0; x < filterRTO.length; x++) {
            if (value === filterRTO[x].NUM_STATE_CODE) {
                states.push({
                    c_rto_state: filterRTO[x]?.RTO_STATE_NAME || "",
                    c_rto_state_code: filterRTO[x]?.NUM_STATE_CODE || "",
                });
                return;
            }
        }
    });

    res.send({
        status: 200,
        data: states
    });
};

export const RtoLocationsHandler = (req, res) => {
    const { state_code } = req.body;

    let rtoArray = [];

    if (req.query.slug === "tw-locations") {
        rtoArray = [...kotakUatTwRto];
    } else if (req.query.slug === "pc-locations") {
        rtoArray = [...kotakUatPcRto];
    }

    const locations = rtoArray
        .filter((value) => Number(value.NUM_STATE_CODE) === Number(state_code))
        .map((value) => {
            return {
                c_rto_location: value.TXT_RTO_LOCATION_DESC,
                c_rto_location_code: value.TXT_RTO_LOCATION_CODE,
                c_rto_registration_code: value.NUM_REGISTRATION_CODE,
            };
        });

    res.send({
        status: 200,
        data: locations
    });
};

export const KotakRtoDetails = (c_place_of_registration) => {
    const kotakUat = [...kotakUatTwRto, ...kotakUatPcRto];

    const registration_code = c_place_of_registration.slice(0, 4)

    const rtoDetails = kotakUat.filter((rto) => {
        if (rto?.NUM_REGISTRATION_CODE?.toLowerCase() === registration_code?.toLowerCase()) {
            return rto
        }
    })

    if (rtoDetails.length > 0) {
        return rtoDetails[0]
    } else {
        return {}
    }
}


export const TataAigRtoDetails = (c_place_of_registration) => {
    const stringOne = c_place_of_registration.slice(0, 2);
    const stringTwo = c_place_of_registration.slice(2, 4);
    const rtoString = `${stringOne}-${stringTwo}`;

    let rtoDetails = TataAigRto.filter((rto) => {
        if (rto?.REGISTRATION_CODE?.toLowerCase() === rtoString?.toLowerCase()) {
            return rto
        }
    })

    if (rtoDetails.length > 2) rtoDetails.sort((a, b) => b.RTO_ID - a.RTO_ID);

    if (rtoDetails.length > 0) {
        return rtoDetails[0]
    } else {
        return {}
    }
}


export const IciciRtoDetails = (c_place_of_registration) => {
    const registration_code = c_place_of_registration.slice(0, 4)
    const rto_place = c_place_of_registration.slice(5, c_place_of_registration.length)

    let RtoDetailsArray = [];
    let FilteredArray = [];
    let rtoLoation = '';

    rtoMaster.map((rto) => {
        if (rto.NUM_REGISTRATION_CODE.toString().toLowerCase() === registration_code.toString().toLowerCase()) {
            FilteredArray.push(rto);
        }
    });

    if (FilteredArray.length === 0) {
        if (client.c_rto_location) {
            rtoLoation = rto_place
        } else {
            return errorResponse('RTO Details not found for given registration code');
        }
    } else {
        rtoLoation = FilteredArray[0].TXT_RTO_LOCATION_DESC;
    }

    iciciRto.map((rto) => {
        if (rto.RTOLocationDesciption.toString().toLowerCase().includes(rtoLoation.toLowerCase())) {
            if (rto.RTOLocationDesciption.toString().toLowerCase().includes('-')) {
                RtoDetailsArray.push(rto);
            }
        }
    });

    return RtoDetailsArray[0]
}
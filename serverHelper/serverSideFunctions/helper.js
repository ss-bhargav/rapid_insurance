import twMaster1 from "../db/master/two-wheeler.json";
import tataMaster1 from "../db/tataAig/TwMakeModelMaster.json";
import iciciTwMaster from "../db/icici/TwMakeModelMaster.json";
import kotakTwMaster from "../db/icici/TwMakeModelMaster.json";
import kotakTwUat from "../db/kotak/uat/tw_model.json";
import kotakPcUat from "../db/kotak/uat/pc_model.json";
import PcMaster from '../db/master/private-car.json'

export const GetHelperFunction = (req, res) => {
    let resultArray = kotakPcUat
        .filter(tata => tata?.MANUFACTURER && tata?.VEHICLEMODEL && tata?.TXT_VARIANT && tata?.CUBICCAPACITY && tata?.TXT_FUEL)
        .map((tata) => {
            return {
                MANUFACTURER: tata?.MANUFACTURER,
                VEHICLEMODEL: tata?.VEHICLEMODEL,
                VARIANT: tata?.TXT_VARIANT,
                CUBICCAPACITY: tata?.CUBICCAPACITY,
                FUEL_TYPE: tata?.TXT_FUEL
            }
        })
    res.send(resultArray);
};

export const PostHelperFunction = (req, res) => {
    res.send({ status: 200, body: req.body });
};

import InsurersMaster from "../db/master/insurers.json";
import kotakInsurers from "../db/kotak/master/insurersMaster.json";

export const GetInsuranceDetails = (req, res) => {
    let insurersArray = [];

    InsurersMaster.map((insurers) => {
        insurersArray.push(insurers.shortname);
    });

    insurersArray = [...new Set(insurersArray)];
    res.send({ status: 200, data: insurersArray });
};

export const KotakInsurersDetails = (prevInsurer) => {
    const filteredInsurer = kotakInsurers.filter((insurer) => {
        if (insurer?.TXT_COMPANY_CODE?.toLowerCase() === prevInsurer?.toLowerCase()) {
            return insurer;
        }
    });

    if (filteredInsurer.length > 0) {
        return filteredInsurer[0];
    } else {
        return {};
    }
};

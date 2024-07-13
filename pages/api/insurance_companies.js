import kotakInsurersMaster from "serverHelper/db/kotak/master/insurersMaster.json";

export default function handler(req, res) {
    if (req.method == "GET") {
        GetInsuranceDetails(req, res);
    }
}

const GetInsuranceDetails = (req, res) => {
    const insurerMapped = kotakInsurersMaster.map((insurer) => {
        return {
            c_prev_insurer: insurer.COMPANYNAME,
            c_prev_insurer_code: insurer.TXT_COMPANY_CODE,
        };
    });

    res.send({ status: 200, data: insurerMapped });
};

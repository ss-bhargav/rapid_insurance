export default function handler(req, res) {
    if (req.method == "GET") {
        GetInsuranceDetails(req, res);
    }
}

const GetInsuranceDetails = (req, res) => {
    res.send({ status: 200, message: "Sorry we don't have a master database for Financers" });
};

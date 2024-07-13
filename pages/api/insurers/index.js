import { GetInsuranceDetails } from "server_helper/serverSideFunctions/insurers";

export default function handler(req, res) {
    if (req.method == "GET") {
        GetInsuranceDetails(req, res);
    }
}

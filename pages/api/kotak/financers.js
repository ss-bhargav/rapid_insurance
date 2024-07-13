import { KotakFinancersMasterHanlder } from "server_helper/serverSideFunctions/kotak/helper";

export default function handler(req, res) {
    if (req.method === "GET") KotakFinancersMasterHanlder(req, res);
}

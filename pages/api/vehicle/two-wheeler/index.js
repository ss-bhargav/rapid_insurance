import { GetTwMakeModelVariantsHandler } from "server_helper/serverSideFunctions/vehicle/twoWheeler";

export default function handler(req, res) {
     if (req.method === "POST") GetTwMakeModelVariantsHandler(req, res);
}

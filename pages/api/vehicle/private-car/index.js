import { GetPcMakeModelVariantsHandler } from "server_helper/serverSideFunctions/vehicle/privateCar";

export default function handler(req, res) {
     if (req.method === "POST") GetPcMakeModelVariantsHandler(req, res);
}

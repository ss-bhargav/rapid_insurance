import { VehicleServerToClient } from "serverHelper/key-mapper/vehicle/vehicle-number";
import axios from "axios";

export const GetVehicleDetails = async (req, res) => {
    const { vehicle_number } = req.query;
    // const URL = 'https://sandbox.aadhaarkyc.io/api/v1/rc/rc'
    const URL = "https://kyc-api.aadhaarkyc.io/api/v1/rc/rc";
    const Token =
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTYzMDA1MDkwMiwianRpIjoiMzBiZmViYjQtZTlmNi00NGU0LWE3YTMtYjhhMTFjZDA3MWFhIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2Lm1hbm9qMTQzdmFybWFAYWFkaGFhcmFwaS5pbyIsIm5iZiI6MTYzMDA1MDkwMiwiZXhwIjoxOTQ1NDEwOTAyLCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsicmVhZCJdfX0.2ZRssdacfCzh0tSVgnzIa4zyQgqcT-TWANwDPO7da70";

    const headersObject = {
        headers: { "Content-Type": "application/json", Authorization: Token },
    };

    try {
        const { data } = await axios.post(URL, { id_number: vehicle_number }, headersObject);
        if (data.message === null || data.success === true) {
          const client_object = VehicleServerToClient(data.data);
        //   res.status(200).send({ status: 200, data: data });
            res.status(200).send({ status: 200, data: client_object });
        } else {
            res.status(200).send({ status: 203, message: data.message });
        }
    } catch (error) {
        res.status(401).send({ status: 401, message: error.message });
    }
};

import { GetVehicleDetails } from 'server_helper/serverSideFunctions/vehicle/vehicleDetails';


export default function handler(req, res) {
  if (req.method == 'GET') GetVehicleDetails(req, res);
}

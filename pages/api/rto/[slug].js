import { RtoAllLocationsHandler } from "server_helper/serverSideFunctions/rto";


export default function handler(req, res) {
    const { slug } = req.query;

    switch (slug) {
        case "all-locations":
            if (req.method === "GET") RtoAllLocationsHandler(req, res);
            break;
        default:
            res.status(404).send("Router is not correct, Please check the router");
            break;
    }
}


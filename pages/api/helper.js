import { GetHelperFunction, PostHelperFunction } from "server_helper/serverSideFunctions/helper";

export default function handler(req, res) {
    if (req.method == "GET") {
        GetHelperFunction(req, res);
    } else if (req.method == "POST") {
        PostHelperFunction(req, res);
    }
}


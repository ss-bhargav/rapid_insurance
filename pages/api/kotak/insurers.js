import { KotakInsurersMasterHandler } from "server_helper/serverSideFunctions/kotak/helper";

export default function handler(req, res) {
    if (req.method === "GET") KotakInsurersMasterHandler(req, res);
}

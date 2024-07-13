import { KotakPolicyDocumentMainHandler } from "server_helper/serverSideFunctions/kotak/helper";

export default function handler(req, res) {
    if (req.method === "POST") KotakPolicyDocumentMainHandler(req, res);
}

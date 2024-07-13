import { TataAigPolicyDocumentMainHandler } from "server_helper/serverSideFunctions/tataAig/policyDownload";

export default function handler(req, res) {
    if (req.method === "POST") TataAigPolicyDocumentMainHandler(req, res);
}

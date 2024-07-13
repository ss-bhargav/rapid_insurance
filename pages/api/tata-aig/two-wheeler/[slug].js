import Database from "serverHelper/database";
import {
    TataAigTwProposalCtoS,
    TataAigTwProposalStoC,
    TataAigTwQuoteCtoS,
    TataAigTwQuoteStoC,
} from "server_helper/serverSideFunctions/tataAig/test";
import {
    TataAigTwProposalMainHandler,
    TataAigTwQuoteMainHandler,
    TataAigTwPremiumMainHandler
} from "server_helper/serverSideFunctions/tataAig/twoWheeler";

;

export default function handler(req, res) {
    const { slug } = req.query;
    switch (slug) {
        case "full-quote":
            if (req.method === "POST") TataAigTwQuoteMainHandler(req, res, "full");
            break;
        case "quick-quote":
            if (req.method === "POST") TataAigTwQuoteMainHandler(req, res, "quick");
            break;
        case "premium":
            if (req.method === "POST") TataAigTwPremiumMainHandler(req, res);
            break;
        case "proposal":
            if (req.method === "POST") TataAigTwProposalMainHandler(req, res);
            break;
        case "quick-quote-client-to-server":
            if (req.method === "POST") TataAigTwQuoteCtoS(req, res, "quick");
            break;
        case "quick-quote-server-to-client":
            if (req.method === "POST") TataAigTwQuoteStoC(req, res, "quick");
            break;
        case "full-quote-client-to-server":
            if (req.method === "POST") TataAigTwQuoteCtoS(req, res, "full");
            break;
        case "full-quote-server-to-client":
            if (req.method === "POST") TataAigTwQuoteStoC(req, res, "full");
            break;
        case "proposal-client-to-server":
            if (req.method === "POST") TataAigTwProposalCtoS(req, res);
            break;
        case "proposal-server-to-client":
            if (req.method === "POST") TataAigTwProposalStoC(req, res);
            break;

        default:
            res.status(404).send("Something went wrong");
            break;
    }
}

import Database from "serverHelper/database";
import {
    TataAigPcPremiumMainHandler,
    TataAigPcProposalMainHandler,
    TataAigPcQuoteMainHandler,
} from "server_helper/serverSideFunctions/tataAig/privateCar";
import {
    TataAigPcPremiumCtoS,
    TataAigPcPremiumStoC,
    TataAigPcProposalCtoS,
    TataAigPcProposalStoC,
} from "server_helper/serverSideFunctions/tataAig/test";

;

export default function handler(req, res) {
    const { slug } = req.query;
    switch (slug) {
        case "quick-quote":
            if (req.method === "POST") TataAigPcQuoteMainHandler(req, res, "quick");
            break;
        case "full-quote":
            if (req.method === "POST") TataAigPcQuoteMainHandler(req, res, "full");
            break;
        case "premium":
            if (req.method === "POST") TataAigPcPremiumMainHandler(req, res);
            break;
        case "proposal":
            if (req.method === "POST") TataAigPcProposalMainHandler(req, res);
            break;
        case "quick-quote-client-to-server":
            if (req.method === "POST") TataAigPcPremiumCtoS(req, res, "quick");
            break;
        case "quick-quote-server-to-client":
            if (req.method === "POST") TataAigPcPremiumStoC(req, res, "quick");
            break;
        case "full-quote-client-to-server":
            if (req.method === "POST") TataAigPcPremiumCtoS(req, res, "full");
            break;
        case "full-quote-server-to-client":
            if (req.method === "POST") TataAigPcPremiumStoC(req, res, "full");
            break;
        case "proposal-client-to-server":
            if (req.method === "POST") TataAigPcProposalCtoS(req, res);
            break;
        case "proposal-server-to-client":
            if (req.method === "POST") TataAigPcProposalStoC(req, res);
            break;

        default:
            res.status(404).send("Something went wrong");
            break;
    }
}

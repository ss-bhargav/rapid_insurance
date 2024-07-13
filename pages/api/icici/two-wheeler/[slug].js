import Database from "serverHelper/database";
import {
    IciciTwPremiumCtoS,
    IciciTwPremiumStoC,
    IciciTwProposalCtoS,
    IciciTwProposalStoC,
} from "server_helper/serverSideFunctions/icici/test";
import {
    IciciTwPremiumMainHandler,
    IciciTwProposalMainHandler,
} from "server_helper/serverSideFunctions/icici/twoWheeler";

;

export default function handler(req, res) {
    const { slug } = req.query;
    switch (slug) {
        case "premium":
            if (req.method === "POST") IciciTwPremiumMainHandler(req, res);
            break;
        case "proposal":
            if (req.method === "POST") IciciTwProposalMainHandler(req, res);
            break;
        case "premium-client-to-server":
            if (req.method === "POST") IciciTwPremiumCtoS(req, res);
            break;
        case "premium-server-to-client":
            if (req.method === "POST") IciciTwPremiumStoC(req, res);
            break;
        case "proposal-client-to-server":
            if (req.method === "POST") IciciTwProposalCtoS(req, res);
            break;
        case "proposal-server-to-client":
            if (req.method === "POST") IciciTwProposalStoC(req, res);
            break;

        default:
            res.status(404).send("Something went wrong");
            break;
    }
}

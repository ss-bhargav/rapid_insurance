import {
    IciciPcPremiumMainHandler,
    IciciPcProposalMainHandler,
} from "server_helper/serverSideFunctions/icici/privateCar";
import {
    IciciPcPremiumCtoS,
    IciciPcPremiumStoC,
    IciciPcProposalCtoS,
    IciciPcProposalStoC,
} from "server_helper/serverSideFunctions/icici/test";

export default function handler(req, res) {
    const { slug } = req.query;
    switch (slug) {
        case "premium":
            if (req.method === "POST") IciciPcPremiumMainHandler(req, res);
            break;
        case "proposal":
            if (req.method === "POST") IciciPcProposalMainHandler(req, res);
            break;
        case "premium-client-to-server":
            if (req.method === "POST") IciciPcPremiumCtoS(req, res);
            break;
        case "premium-server-to-client":
            if (req.method === "POST") IciciPcPremiumStoC(req, res);
            break;
        case "proposal-client-to-server":
            if (req.method === "POST") IciciPcProposalCtoS(req, res);
            break;
        case "proposal-server-to-client":
            if (req.method === "POST") IciciPcProposalStoC(req, res);
            break;

        default:
            res.status(404).send("Something went wrong");
            break;
    }
}

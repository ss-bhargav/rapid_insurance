import {
    TataAigGetManfactuers,
    TataAigGetManfactuersAndModels,
    TataAigGetTwModels,
    TataAigGetVariants,
} from "server_helper/serverSideFunctions/tataAig/vehicle";

export default function handler(req, res) {
    const { slug } = req.query;

    switch (slug) {
        case "manufacturers-models":
            if (req.method === "GET") TataAigGetManfactuersAndModels(req, res);
            break;
        case "manufacturers":
            if (req.method === "GET") TataAigGetManfactuers(req, res);
            break;
        case "variants":
            if (req.method === "POST") TataAigGetVariants(req, res);
            break;
        case "models":
            if (req.method === "POST") TataAigGetTwModels(req, res);
            break;

        default:
            res.status(404).send("Something went wrong");
            break;
    }
}

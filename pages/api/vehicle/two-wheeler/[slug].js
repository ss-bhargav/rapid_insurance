import {
    TwoWheelerFuelHandler,
    TwoWheelerMakeHandler,
    TwoWheelerMakeModelHandler,
    TwoWheelerModelsHandler,
    TwoWheelerVariantsHandler
} from "server_helper/serverSideFunctions/vehicle/twoWheeler";


export default function handler(req, res) {
    const { slug } = req.query;

    switch (slug) {
        case "manufacturers":
            if (req.method === "GET") TwoWheelerMakeHandler(req, res);
            break;
        case "models":
            if (req.method === "POST") TwoWheelerModelsHandler(req, res);
            break;
        case "variants":
            if (req.method === "POST") TwoWheelerVariantsHandler(req, res);
            break;
        case "fuel":
            if (req.method === "POST") TwoWheelerFuelHandler(req, res);
            break;
        case "manufacturers-models":
            if (req.method === "GET") TwoWheelerMakeModelHandler(req, res);
            break;
        default:
            res.status(404).send("Something went wrong");
            break;
    }
}
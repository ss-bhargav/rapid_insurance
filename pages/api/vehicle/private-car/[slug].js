import {
    PrivateCarFuelHandler,
    PrivateCarMakeHandler,
    PrivateCarMakeModelHandler,
    PrivateCarModelsHandler,
    PrivateCarVariantsHandler
} from "server_helper/serverSideFunctions/vehicle/privateCar";


export default function handler(req, res) {
    const { slug } = req.query;

    switch (slug) {
        case "manufacturers":
            if (req.method === "GET") PrivateCarMakeHandler(req, res);
            break;
        case "models":
            if (req.method === "POST") PrivateCarModelsHandler(req, res);
            break;
        case "variants":
            if (req.method === "POST") PrivateCarVariantsHandler(req, res);
            break;
        case "fuel":
            if (req.method === "POST") PrivateCarFuelHandler(req, res);
            break;
        case "manufacturers-models":
            if (req.method === "GET") PrivateCarMakeModelHandler(req, res);
            break;

        default:
            res.status(404).send("Something went wrong");
            break;
    }
}
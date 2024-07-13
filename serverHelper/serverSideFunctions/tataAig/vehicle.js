import makeModels from "../../db/tataAig/TwMakeModelMaster.json";

export const TataAigGetManfactuersAndModels = (req, res) => {
    const makeModelArray = makeModels.map((makeModel) => {
        return {
            c_make: makeModel.MANUFACTURER,
            c_model: makeModel.VEHICLEMODEL,
        };
    });

    res.send({ status: 200, data: makeModelArray });
};
export const TataAigGetManfactuers = (req, res) => {
    res.send({ status: 200, message: "Manufactuers" });
};
export const TataAigGetVariants = (req, res) => {
    res.send({ status: 200, message: "Variants" });
};
export const TataAigGetTwModels = (req, res) => {
    res.send({ status: 200, message: "Models" });
};

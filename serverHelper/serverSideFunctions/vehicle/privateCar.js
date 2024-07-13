import TataAigMaster from "serverHelper/db/tataAig/TwMakeModelMaster.json";
import KotakUat from "../../db/kotak/uat/pc_model.json";
import KotakMaster from "serverHelper/db/kotak/master/pc_model_master.json";
import IciciMaster from "serverHelper/db/icici/PcMakeModelMaster.json";
import PrivateCarMaster from "../../db/master/private-car.json";

export const PrivateCarMakeHandler = (req, res) => {
    let makes = [];

    const manufacture_codes = [...new Set(PrivateCarMaster.map((vehicle) => vehicle.MANUFACTURERCODE))];

    manufacture_codes.forEach((value) => {
        const filteredVehicle = PrivateCarMaster.find((vehicle) => vehicle.MANUFACTURERCODE === value);
        if (filteredVehicle) {
            makes.push(filteredVehicle.MANUFACTURER);
        }
    });

    makes = [...new Set(makes)];
    res.status(200).send({ status: 200, makes: makes });
};

export const PrivateCarModelsHandler = (req, res) => {
    const { manufacturer } = req.body;
    let models = [];

    const manufacture_codes = [
        ...new Set(
            PrivateCarMaster.filter((vehicle) => vehicle.MANUFACTURER.toLowerCase() === manufacturer.toLowerCase())
        ),
    ];
    const model_codes = [...new Set(PrivateCarMaster.map((vehicle) => vehicle.NUM_PARENT_MODEL_CODE))];

    model_codes.forEach((value) => {
        const filteredModel = manufacture_codes.find((vehicle) => vehicle.NUM_PARENT_MODEL_CODE === value);
        if (filteredModel) {
            models.push(filteredModel.VEHICLEMODEL);
        }
    });

    models = [...new Set(models)];

    res.status(200).send({ status: 200, models });
};

export const PrivateCarVariantsHandler = (req, res) => {
    const { manufacturer, model } = req.body;

    const variantsArray = PrivateCarMaster.filter(
        (vehicle) =>
            vehicle.MANUFACTURER.toLowerCase() === manufacturer.toLowerCase() &&
            vehicle.VEHICLEMODEL.toLowerCase() === model.toLowerCase()
    ).map((vehicle) => {
        return `${vehicle.TXT_VARIANT} (${vehicle.CUBICCAPACITY}CC)`;
    });

    const variants = [...new Set(variantsArray)];
    res.status(200).send({ status: 200, variants });
};

export const PrivateCarFuelHandler = (req, res) => {
    const { manufacturer, model } = req.body;

    const fuelArray = PrivateCarMaster.filter(
        (vehicle) =>
            vehicle.MANUFACTURER.toLowerCase() === manufacturer.toLowerCase() &&
            vehicle.VEHICLEMODEL.toLowerCase() === model.toLowerCase()
    ).map((vehicle) => vehicle.TXT_FUEL);

    const fuelTypes = [...new Set(fuelArray)];
    res.status(200).send({ status: 200, fuelTypes });
};

export const PrivateCarMakeModelHandler = (req, res) => {
    const vehiclemanufacturers = [];

    PrivateCarMaster.map((vehicle) => {
        const vehicleFilter = vehiclemanufacturers.filter(
            (value) =>
                value.MANUFACTURERCODE === vehicle.MANUFACTURERCODE &&
                value.NUM_PARENT_MODEL_CODE === vehicle.NUM_PARENT_MODEL_CODE
        );
        if (vehicleFilter.length > 0) {
            return;
        }
        vehiclemanufacturers.push({
            c_make: vehicle.MANUFACTURER,
            c_make_code: vehicle.MANUFACTURERCODE,
            c_model: vehicle.VEHICLEMODEL,
            c_model_code: vehicle.NUM_PARENT_MODEL_CODE,
            c_fuel_type: vehicle.TXT_FUEL,
        });
    });

    res.status(200).send({ status: 200, vehiclemanufacturers });
};

export const GetPcMakeModelVariantsHandler = (req, res) => {
    const tataAig = TataAigPcMakeModelVariantHandler(req.body);
    const kotak = KotakPcMakeModelVariantHandler(req.body);
    const icici = IciciPcMakeModelVariantHandler(req.body);

    const vechileDetails = {
        tataAig,
        kotak,
        icici,
    };

    res.status(200).send({ body: vechileDetails });
};

const variantHandler = (frontEnd, backEnd, index) => {
    const truthyArray = [];
    let backEndString = backEnd;
    let frontEndString = frontEnd;

    if (backEnd.includes("-") || backEnd.includes("(") || backEnd.includes(")")) {
        backEndString = backEndString.replace("-", "");
        backEndString = backEndString.replace("(", "");
        backEndString = backEndString.replace(")", "");
    }
    if (frontEnd.includes("-") || frontEnd.includes("(") || frontEnd.includes(")")) {
        frontEndString = frontEndString.replace("-", "");
        frontEndString = frontEndString.replace("(", "");
        frontEndString = frontEndString.replace(")", "");
    }
    let splitString = backEndString.split(/( |-)/);

    splitString.map((string) => {
        if (string.length > 1) {
            if (frontEndString.includes(string)) {
                truthyArray.push("true");
            }
        }
    });

    return {
        truthyArray,
        length: truthyArray.length,
        index,
    };
};

export const KotakPcMakeModelVariantHandler = (vehicle) => {
    let manfacturesArray = [];
    let modelsArray = [];
    let variantArray = [];
    let variantSortArray = [];
    let vechileDetails = {};

    KotakUat.forEach((makeModel) => {
        if (makeModel.MANUFACTURER.toLowerCase().includes(vehicle.c_make.toLowerCase())) {
            manfacturesArray.push(makeModel);
        } else if (vehicle.c_make.toLowerCase().includes(makeModel.MANUFACTURER.toLowerCase())) {
            manfacturesArray.push(makeModel);
        }
    });

    if (manfacturesArray.length > 0) {
        manfacturesArray.map((manufacture) => {
            if (manufacture.VEHICLEMODEL && manufacture.CUBICCAPACITY) {
                if (vehicle.c_variant.includes(`${manufacture.CUBICCAPACITY.toString()}CC`)) {
                    if (
                        vehicle.c_fuel_type.toString().toLowerCase() === manufacture.TXT_FUEL.toString().toLowerCase()
                    ) {
                        if (vehicle.c_make.toString() === manufacture.VEHICLEMODEL.toString()) {
                            modelsArray.push(manufacture);
                        } else if (vehicle.c_model.toString().includes(manufacture.VEHICLEMODEL.toString())) {
                            modelsArray.push(manufacture);
                        } else if (manufacture.VEHICLEMODEL.toString().includes(vehicle.c_model.toString())) {
                            modelsArray.push(manufacture);
                        }
                    }
                }
            }
        });
    }

    if (modelsArray.length > 0) {
        modelsArray.map((model, index) => {
            if (model.TXT_VARIANT) {
                const value = variantHandler(vehicle.c_variant, model.TXT_VARIANT, index);
                if (value.length > 0) {
                    variantArray.push(value);
                }
            }
        });
    }

    if (variantArray.length > 0) {
        variantSortArray = variantArray.sort((a, b) => {
            return b.length - a.length;
        });
        vechileDetails = modelsArray[variantSortArray[0].index];
    }

    return vechileDetails;
};

export const TataAigPcMakeModelVariantHandler = (vehicle) => {
    let manfacturesArray = [];
    let modelsArray = [];
    let variantArray = [];
    let variantSortArray = [];
    let vechileDetails = {};

    TataAigMaster.forEach((makeModel) => {
        if (makeModel.MANUFACTURER.toLowerCase().includes(vehicle.c_make.toLowerCase())) {
            manfacturesArray.push(makeModel);
        } else if (vehicle.c_make.toLowerCase().includes(makeModel.MANUFACTURER.toLowerCase())) {
            manfacturesArray.push(makeModel);
        }
    });

    if (manfacturesArray.length > 0) {
        manfacturesArray.map((manufacture) => {
            if (manufacture.VEHICLEMODEL && manufacture.CUBICCAPACITY) {
                if (vehicle.c_variant.includes(`${manufacture.CUBICCAPACITY.toString()}CC`)) {
                    if (
                        vehicle.c_fuel_type.toString().toLowerCase() === manufacture.TXT_FUEL.toString().toLowerCase()
                    ) {
                        if (vehicle.c_make.toString() === manufacture.VEHICLEMODEL.toString()) {
                            modelsArray.push(manufacture);
                        } else if (vehicle.c_model.toString().includes(manufacture.VEHICLEMODEL.toString())) {
                            modelsArray.push(manufacture);
                        } else if (manufacture.VEHICLEMODEL.toString().includes(vehicle.c_model.toString())) {
                            modelsArray.push(manufacture);
                        }
                    }
                }
            }
        });
    }

    if (modelsArray.length > 0) {
        modelsArray.map((model, index) => {
            if (model.TXT_VARIANT) {
                const value = variantHandler(vehicle.c_variant, model.TXT_VARIANT, index);
                if (value.length > 0) {
                    variantArray.push(value);
                }
            }
        });
    }

    if (variantArray.length > 0) {
        variantSortArray = variantArray.sort((a, b) => {
            return b.length - a.length;
        });
        vechileDetails = modelsArray[variantSortArray[0].index];
    }

    return vechileDetails;
};

export const IciciPcMakeModelVariantHandler = (vehicle) => {
    let manfacturesArray = [];
    let modelsArray = [];
    let variantArray = [];
    let variantSortArray = [];
    let vechileDetails = {};

    IciciMaster.forEach((makeModel) => {
        if (makeModel.Manufacture.toLowerCase().includes(vehicle.c_make.toLowerCase())) {
            manfacturesArray.push(makeModel);
        } else if (vehicle.c_make.toLowerCase().includes(makeModel.Manufacture.toLowerCase())) {
            manfacturesArray.push(makeModel);
        }
    });

    if (manfacturesArray.length > 0) {
        manfacturesArray.map((manufacture) => {
            if (manufacture.VehicleModel && manufacture.CubicCapacity) {
                if (vehicle.c_vehicle_cc.toString() === manufacture.CubicCapacity.toString()) {
                    if (
                        vehicle.c_fuel_type
                            .toString()
                            .toLowerCase()
                            .includes(manufacture.FuelType.toString().toLowerCase())
                    ) {
                        if (vehicle.c_make.toString() === manufacture.VehicleModel.toString()) {
                            modelsArray.push(manufacture);
                        } else if (vehicle.c_model.toString().includes(manufacture.VehicleModel.toString())) {
                            modelsArray.push(manufacture);
                        } else if (manufacture.VehicleModel.toString().includes(vehicle.c_model.toString())) {
                            modelsArray.push(manufacture);
                        }
                    } else if (
                        manufacture.FuelType.toString()
                            .toLowerCase()
                            .includes(vehicle.c_fuel_type.toString().toLowerCase())
                    ) {
                        if (vehicle.c_make.toString() === manufacture.VehicleModel.toString()) {
                            modelsArray.push(manufacture);
                        } else if (vehicle.c_model.toString().includes(manufacture.VehicleModel.toString())) {
                            modelsArray.push(manufacture);
                        } else if (manufacture.VehicleModel.toString().includes(vehicle.c_model.toString())) {
                            modelsArray.push(manufacture);
                        }
                    }
                }
            }
        });
    }

    // return manfacturesArray

    const variantHandler = (frontEnd, backEnd, index) => {
        const truthyArray = [];
        let backEndString = backEnd;
        let frontEndString = frontEnd;

        if (backEnd.includes("-")) {
            backEndString = backEndString.replace("-", "");
        }
        if (frontEnd.includes("-")) {
            frontEndString = frontEndString.replace("-", "");
        }
        let splitString = backEndString.split(/( |-)/);

        splitString.map((string) => {
            if (string.length > 1) {
                if (frontEndString.includes(string)) {
                    truthyArray.push("true");
                }
            }
        });
        return {
            truthyArray,
            length: truthyArray.length,
            index,
        };
    };

    if (modelsArray.length > 0) {
        modelsArray.map((model, index) => {
            if (model.VehicleModel) {
                const value = variantHandler(`${vehicle.c_model} ${vehicle.c_variant}`, model.VehicleModel, index);
                if (value.length > 0) {
                    variantArray.push(value);
                }
            }
        });
    }

    if (variantArray.length > 0) {
        variantSortArray = variantArray.sort((a, b) => {
            return b.length - a.length;
        });
        vechileDetails = modelsArray[variantSortArray[0].index];
    }

    return vechileDetails;
};

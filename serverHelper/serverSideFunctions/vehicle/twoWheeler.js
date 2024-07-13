import TataAigMaster from "../../db/tataAig/TwMakeModelMaster.json";
import KotakUat from "../../db/kotak/uat/tw_model.json";
import KotakMaster from "../../db/kotak/master/tw_model_master.json";
import IciciMaster from "../../db/icici/TwMakeModelMaster.json";
import TwoWheelerMaster from "../../db/master/two-wheeler.json";

export const TwoWheelerMakeHandler = (req, res) => {
    let makes = [];
    let TwMaster = [...TwoWheelerMaster, ...KotakUat];
    const manufacture_codes = [...new Set(TwMaster.map((vehicle) => vehicle.MANUFACTURERCODE))];
    manufacture_codes.forEach((value) => {
        const filteredVehicle = TwMaster.find((vehicle) => vehicle.MANUFACTURERCODE === value);
        if (filteredVehicle) {
            makes.push(filteredVehicle.MANUFACTURER);
        }
    });
    makes = [...new Set(makes)];
    res.status(200).send({ status: 200, makes: makes });
};

export const TwoWheelerModelsHandler = (req, res) => {
    const { manufacturer } = req.body;
    let models = [];

    let TwMaster = [...TwoWheelerMaster, ...KotakUat];

    const manufacture_codes = [...new Set(TwMaster.filter((vehicle) => vehicle.MANUFACTURER === manufacturer))];
    const model_codes = [...new Set(TwMaster.map((vehicle) => vehicle.NUM_PARENT_MODEL_CODE))];

    model_codes.forEach((value) => {
        const filteredModel = manufacture_codes.find((vehicle) => vehicle.NUM_PARENT_MODEL_CODE === value);
        if (filteredModel) {
            models.push(filteredModel.VEHICLEMODEL);
        }
    });

    models = [...new Set(models)];
    res.status(200).send({ status: 200, models });
};

export const TwoWheelerVariantsHandler = (req, res) => {
    const { manufacturer, model } = req.body;
    let TwMaster = [...TwoWheelerMaster, ...KotakUat];
    const variantsArray = TwMaster.filter(
        (vehicle) =>
            vehicle.MANUFACTURER.toLowerCase() === manufacturer.toLowerCase() &&
            vehicle.VEHICLEMODEL.toLowerCase() === model.toLowerCase()
    ).map((vehicle) => {
        return `${vehicle.TXT_VARIANT} (${vehicle.CUBICCAPACITY}CC)`;
    });

    const variants = [...new Set(variantsArray)];
    res.status(200).send({ status: 200, variants });
};

export const TwoWheelerFuelHandler = (req, res) => {
    const { manufacturer, model } = req.body;
    let TwMaster = [...TwoWheelerMaster, ...KotakUat];
    const fuelArray = TwMaster.filter(
        (vehicle) =>
            vehicle.MANUFACTURER.toLowerCase() === manufacturer.toLowerCase() &&
            vehicle.VEHICLEMODEL.toLowerCase() === model.toLowerCase()
    ).map((vehicle) => vehicle.TXT_FUEL);

    const fuelTypes = [...new Set(fuelArray)];
    res.status(200).send({ status: 200, fuelTypes });
};

export const TwoWheelerMakeModelHandler = (req, res) => {
    const vehiclemanufacturers = [];

    let TwMaster = [...TwoWheelerMaster, ...KotakUat];

    TwMaster.map((vehicle) => {
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

export const GetTwMakeModelVariantsHandler = (req, res) => {
    const tataAig = TataAigTwMakeModelVariantHandler(req.body);
    const kotak = KotakTwMakeModelVariantHandler(req.body);
    const icici = IciciTwMakeModelVariantHandler(req.body);

    const vechileDetails = {
        tataAig,
        kotak,
        icici,
    };

    res.status(200).send({ body: vechileDetails });
};

export const MasterTwMakeModelVariantHandler = (vehicle) => {
    let manfacturesArray = [];
    let modelsArray = [];
    let variantArray = [];
    let variantSortArray = [];
    let vechileDetails = {};

    TwoWheelerMaster.forEach((makeModel) => {
        if (makeModel?.MANUFACTURER?.toLowerCase()?.includes(vehicle?.maker_description?.toLowerCase())) {
            manfacturesArray.push(makeModel);
        } else if (vehicle?.maker_description?.toLowerCase()?.includes(makeModel?.MANUFACTURER?.toLowerCase())) {
            manfacturesArray.push(makeModel);
        }
    });

    if (manfacturesArray?.length > 0) {
        manfacturesArray.map((manufacture) => {
            if (manufacture?.VEHICLEMODEL && manufacture?.CUBICCAPACITY) {
                if (Math.floor(vehicle?.cubic_capacity) === Number(manufacture?.CUBICCAPACITY)) {
                    if (
                        vehicle?.fuel_type?.toString()?.toLowerCase() === manufacture?.TXT_FUEL?.toString().toLowerCase()
                    ) {
                        if (vehicle?.maker_description?.toString() === manufacture?.VEHICLEMODEL?.toString()) {
                            modelsArray.push(manufacture);
                        } else if (vehicle?.maker_model?.toString().includes(manufacture?.VEHICLEMODEL?.toString())) {
                            modelsArray.push(manufacture);
                        } else if (manufacture?.VEHICLEMODEL?.toString().includes(vehicle?.maker_model?.toString())) {
                            modelsArray.push(manufacture);
                        }
                    }
                }
            }
        });
    }

    const variantHandler = (frontEnd, backEnd, index) => {
        const truthyArray = [];
        const splitString = backEnd.toString().split(/( |-)/);
        splitString.map((string) => {
            if (string.length > 1) {
                if (frontEnd.includes(string)) {
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

    // console.log(manfacturesArray)
    // console.log(modelsArray)

    if (modelsArray.length > 0) {
        modelsArray.map((model, index) => {
            if (model.TXT_VARIANT) {
                const value = variantHandler(vehicle.maker_model, model.TXT_VARIANT, index);
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


export const KotakTwMakeModelVariantHandler = (vehicle) => {
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

    const variantHandler = (frontEnd, backEnd, index) => {
        const truthyArray = [];
        const splitString = backEnd.toString().split(/( |-)/);
        splitString.map((string) => {
            if (string.length > 1) {
                if (frontEnd.includes(string)) {
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

export const IciciTwMakeModelVariantHandler = (vehicle) => {
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
                if (vehicle.c_variant.includes(`${manufacture.CubicCapacity.toString()}CC`)) {
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

    if (variantArray.length > 0) {
        variantSortArray = variantArray.sort((a, b) => {
            return b.length - a.length;
        });
        vechileDetails = modelsArray[variantSortArray[0].index];
    }

    return vechileDetails;
};

export const TataAigTwMakeModelVariantHandler = (vehicle) => {
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

    const variantHandler = (frontEnd, backEnd, index) => {
        const truthyArray = [];
        const splitString = backEnd.toString().split(/( |-)/);
        splitString.map((string) => {
            if (string.length > 1) {
                if (frontEnd.includes(string)) {
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

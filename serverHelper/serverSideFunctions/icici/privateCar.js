import axios from "axios";
import { IciciAccessTokenHandler } from "./auth";
import {
    IciciPcPremiumClientToServerMapper,
    IciciPcPremiumServerToClientMapper,
    IciciPcProposalClientToServerMapper,
    IciciPcProposalServerToClientMapper,
} from "server_helper/key-mapper/icici/privateCar";

/////////////////////////////////////////// PRIVATE CAR  -  PREMIUM HANDLER  //////////////////////////////////////////

export const IciciPcPremiumMainHandler = async (req, res) => {
    const client_object = { ...req.body };

    // await Database.DB.query(
    //     `insert into customers_otp(full_name, mobile, email, insurance_values) values ('${client_object.full_name}', '${
    //         client_object.mobile
    //     }', '${client_object.email}', '${JSON.stringify(client_object)}')`
    // );`

    const iciciResponse = await IciciAccessTokenHandler(client_object, iciciPcPremiumHandler);

    res.status(200).send({ status: 200, data: iciciResponse });
};

export const IciciPcPremiumHandler = async (client_object) => {
    const { token } = client_object.authentication;
    const header_object = {
        headers: {
            vTokenCode: token,
            "Content-Type": "application/json",
        },
    };

    const icici_pc_premium = {
        company: "icici",
        service: "private_car",
        type: "premium",
    };

    const server_object = IciciPcPremiumClientToServerMapper(client_object);

    if (server_object.error) {
        return {
            error: true,
            ...icici_pc_premium,
            data: server_object.message,
        };
    }
    const URL = "";
    try {
        const { data } = await axios.post(URL, server_object.data, header_object);
        if (data.ErrorMessage === null) {
            const clientData = IciciPcPremiumServerToClientMapper(data.TwoWheelerResponseWithCover);
            return { error: false, ...icici_pc_premium, data: clientData };
        } else {
            return {
                error: true,
                ...icici_pc_premium,
                message: data.ErrorMessage,
            };
        }
    } catch (err) {
        return { error: true, ...icici_pc_premium, message: err.message };
    }
};

/////////////////////////////////////////// PRIVATE CAR -  PROPOSAL HANDLER  //////////////////////////////////////////

export const IciciPcProposalMainHandler = async (req, res) => {
    const client_object = { ...req.body };

    // await Database.DB.query(
    //     `insert into customers_otp(full_name, mobile, email, insurance_values) values ('${client_object.full_name}', '${
    //         client_object.mobile
    //     }', '${client_object.email}', '${JSON.stringify(client_object)}')`
    // );`

    const iciciResponse = await iciciAccessTokenHandler(client_object, iciciPcProposalHandler);

    res.status(200).send({ status: 200, data: iciciResponse });
};

export const IciciPcProposalHandler = async (client_object) => {
    const { token } = client_object.authentication;
    const header_object = {
        headers: {
            vTokenCode: token,
            "Content-Type": "application/json",
        },
    };

    const icici_pc_proposal = {
        company: "icici",
        service: "private_car",
        type: "proposal",
    };

    const server_object = IciciPcProposalClientToServerMapper(client_object);

    if (server_object.error) {
        return {
            error: true,
            ...icici_pc_proposal,
            data: server_object.message,
        };
    }

    const URL = "";

    try {
        const { data } = await axios.post(URL, server_object.data, header_object);
        if (data.ErrorMessage === null) {
            const clientData = IciciPcProposalServerToClientMapper(data.TwoWheelerResponseWithCover);
            return { error: false, ...icici_pc_proposal, data: clientData };
        } else {
            return {
                error: true,
                ...icici_pc_proposal,
                message: data.ErrorMessage,
            };
        }
    } catch (err) {
        return { error: true, ...icici_pc_proposal, message: err.message };
    }
};

import axios from "axios";
import {
    IciciPcPremiumClientToServerMapper,
    IciciPcProposalClientToServerMapper
} from "server_helper/key-mapper/icici/privateCar";
import {
    IciciTwPremiumClientToServerMapper,
    IciciTwProposalClientToServerMapper
} from "server_helper/key-mapper/icici/twoWheeler";
import { IciciAccessTokenHandler } from "./auth";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////// TWO WHEELER - PREMIUM  //////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const IciciTwPremiumCtoS = async (req, res) => {
    const client_object = { ...req.body };
    const response = IciciTwPremiumClientToServerMapper(client_object);
    res.status(200).send({ response });
};

export const IciciTwPremiumStoC = async (req, res) => {
    const client_object = { ...req.body };

    const TwPremiumServerToClient = async (client_object, authentication) => {

        const URL = `${process.env.ICIC_SANITY}/${process.env.ICICI_TW_PREMIUM}`

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authentication.token}`
        }

        try {
            const { data } = await axios({ method: 'post', url: URL, data: client_object, headers: headers })
            return data;
        } catch (err) {
            return { message: err.message };
        }
    };

    const response = await IciciAccessTokenHandler(client_object, TwPremiumServerToClient);

    res.status(200).send({ response });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////// TWO WHEELER - PROPOSAL  //////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const IciciTwProposalCtoS = async (req, res) => {
    const client_object = { ...req.body }
    // const response = IciciTwProposalClientToServerMapper(client_object);
    const response = IciciTwPremiumClientToServerMapper(client_object);
    res.status(200).send({ response });
};

export const IciciTwProposalStoC = async (req, res) => {
    const client_object = { ...req.body };

    const ProposalServerToClientHandler = async (client_object, authentication) => {

        const URL = `${process.env.ICIC_SANITY}/${process.env.ICICI_TW_PROPOSAL}`

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authentication.token}`
        }

        try {
            const { data } = await axios({ method: 'post', url: URL, data: client_object, headers: headers })
            console.log(data);
            return data;
        } catch (err) {
            return { message: err.message };
        }
    };

    const response = await IciciAccessTokenHandler(client_object, ProposalServerToClientHandler);

    res.status(200).send({ response });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////// PRIVATE CAR - PREMIUM  /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const IciciPcPremiumCtoS = async (req, res) => {
    const client_object = { ...req.body };
    const response = IciciPcPremiumClientToServerMapper(client_object);
    res.status(200).send({ response });
};

export const IciciPcPremiumStoC = async (req, res) => {
    const client_object = { ...req.body };

    const PcPremiumServerToClient = async (client_object, authentication) => {
        const URL = `${process.env.ICIC_SANITY}/${process.env.ICICI_PC_PREMIUM}`

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authentication.token}`
        }

        try {
            const { data } = await axios({ method: 'post', url: URL, data: client_object, headers: headers })
            return data;
        } catch (err) {
            return { message: err.message };
        }
    };
    const response = await IciciAccessTokenHandler(client_object, PcPremiumServerToClient);
    res.status(200).send({ response });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////// PRIVATE CAR - PROPOSAL  /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const IciciPcProposalCtoS = async (req, res) => {
    const client_object = { ...req.body };
    const response = IciciPcProposalClientToServerMapper(client_object);
    res.status(200).send({ response });
};

export const IciciPcProposalStoC = async (req, res) => {
    const client_object = { ...req.body };

    const PcProposalServerToClient = async (client_object) => {
        const URL = `${process.env.ICIC_SANITY}/${process.env.ICICI_PC_PROPOSAL}`

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authentication.token}`
        }

        try {
            const { data } = await axios({ method: 'post', url: URL, data: client_object, headers: headers })
            console.log(data);
            return data;
        } catch (err) {
            return { message: err.message };
        }
    };

    const response = await IciciAccessTokenHandler(client_object, PcProposalServerToClient);
    res.status(200).send({ response });
};
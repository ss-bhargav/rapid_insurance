import axios from "axios";
import {
    KotakPcPremiumClientToServerMapper,
    KotakPcProposalClientToServerMapper,
} from "server_helper/key-mapper/kotak/privateCar";
import {
    KotakTwPremiumClientToServerMapper,
    KotakTwProposalClientToServerMapper,
} from "server_helper/key-mapper/kotak/twoWheeler";
import { KotakAccessTokenHandler } from "./auth";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////// PRIVATE CAR - PREMIUM  /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const KotakPcPremiumCtoS = async (req, res) => {
    const client_object = { ...req.body };

    const PcPremiumClientToServer = async (client_object) => {
        const server_object = KotakPcPremiumClientToServerMapper(client_object);
        return server_object;
    };

    const response = await KotakAccessTokenHandler(client_object, PcPremiumClientToServer);
    res.status(200).send({ response });
};

export const KotakPcPremiumStoC = async (req, res) => {
    const client_object = { ...req.body };

    const PcPremiumServerToClient = async (client_object) => {
        const { token, email } = client_object.authentication;
        const header_object = {
            headers: {
                vTokenCode: token,
                "Content-Type": "application/json",
            },
        };

        delete client_object.authentication;

        const URL = `${process.env.KOTAK_UAT}/${process.env.KOTAK_PC_PREMIUM}/${email}`;

        try {
            const { data } = await axios.post(URL, client_object, header_object);
            return data;
        } catch (err) {
            return { message: err.message };
        }
    };
    const response = await KotakAccessTokenHandler(client_object, PcPremiumServerToClient);
    res.status(200).send({ response });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////// PRIVATE CAR - PROPOSAL  /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const KotakPcProposalCtoS = async (req, res) => {
    const client_object = { ...req.body };

    const PcProposalClientToServer = async (client_object) => {
        const server_object = KotakPcProposalClientToServerMapper(client_object);
        return server_object;
    };

    const response = await KotakAccessTokenHandler(client_object, PcProposalClientToServer);

    res.status(200).send({ response });
};

export const KotakPcProposalStoC = async (req, res) => {
    const client_object = { ...req.body };

    const PcProposalServerToClient = async (client_object) => {
        const { token, email } = client_object.authentication;
        const header_object = {
            headers: {
                vTokenCode: token,
                "Content-Type": "application/json",
            },
        };

        delete client_object.authentication;

        const QuoteId = client_object.objParaPaymentDetails.vQuoteId;
        const EmailID = client_object.objParaCustomerDetails.vCustomerLoginId;

        const URL = `${process.env.KOTAK_UAT}/${process.env.KOTAK_PC_PROPOSAL}/${QuoteId}/${email}`;

        try {
            const { data } = await axios.post(URL, client_object, header_object);
            return data;
        } catch (err) {
            return { message: err.message };
        }
    };

    const response = await KotakAccessTokenHandler(client_object, PcProposalServerToClient);
    res.status(200).send({ response });
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////// TWO WHEELER - PREMIUM  //////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const KotakTwPremiumCtoS = async (req, res) => {
    const client_object = { ...req.body };

    const TwPremiumClientToServer = async (client_object) => {
        const server_object = KotakTwPremiumClientToServerMapper(client_object);
        return server_object;
    };

    const response = await KotakAccessTokenHandler(client_object, TwPremiumClientToServer);

    res.status(200).send({ response });
};

export const KotakTwPremiumStoC = async (req, res) => {
    const client_object = { ...req.body };

    const TwPremiumServerToClient = async (client_object) => {
        const { token } = client_object.authentication;
        const header_object = {
            headers: {
                vTokenCode: token,
                "Content-Type": "application/json",
            },
        };

        delete client_object.authentication;

        const URL = `${process.env.KOTAK_UAT}/${process.env.KOTAK_TW_PREMIUM}`;

        try {
            const { data } = await axios.post(URL, client_object, header_object);
            return data;
        } catch (err) {
            return { message: err.message };
        }
    };

    const response = await KotakAccessTokenHandler(client_object, TwPremiumServerToClient);

    res.status(200).send({ response });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////// TWO WHEELER - PROPOSAL  //////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const KotakTwProposalCtoS = async (req, res) => {
    const client_object = { ...req.body };

    const ProposalClientToServerHandler = async (client_object) => {
        const server_object = KotakTwProposalClientToServerMapper(client_object);
        return server_object;
    };

    const response = await KotakAccessTokenHandler(client_object, ProposalClientToServerHandler);

    res.status(200).send({ response });
};

export const KotakTwProposalStoC = async (req, res) => {
    const client_object = { ...req.body };

    const ProposalServerToClientHandler = async (client_object) => {
        const { token } = client_object.authentication;
        const header_object = {
            headers: {
                vTokenCode: token,
                "Content-Type": "application/json",
            },
        };

        delete client_object.authentication;

        const URL = `${process.env.KOTAK_UAT}/${process.env.KOTAK_TW_PROPOSAL}`;

        try {
            const { data } = await axios.post(URL, client_object, header_object);
            return data;
        } catch (err) {
            return { message: err.message };
        }
    };

    const response = await KotakAccessTokenHandler(client_object, ProposalServerToClientHandler);

    res.status(200).send({ response });
};

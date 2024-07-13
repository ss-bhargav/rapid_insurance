import axios from "axios";
import Database from "server_helper/database";
import { IciciAccessTokenHandler } from "./auth";
import {
    IciciTwPremiumClientToServerMapper,
    IciciTwPremiumServerToClientMapper,
    IciciTwProposalClientToServerMapper,
    IciciTwProposalServerToClientMapper,
} from "server_helper/key-mapper/icici/twoWheeler";

/////////////////////////////////////////// TWO WHEELER -  PREMIUM HANDLER  //////////////////////////////////////////

export const IciciTwPremiumMainHandler = async (req, res) => {
    const client_object = { ...req.body };

    const IciciResponse = await IciciAccessTokenHandler(client_object, IciciTwPremiumHandler);

    res.status(200).send({ status: 200, data: IciciResponse });
};

export const IciciTwPremiumHandler = async (client_object, authentication) => {

    const icici_tw_premium = {
        company: "icici",
        service: "two_wheeler",
        type: "premium",
    };

    const server_object = IciciTwPremiumClientToServerMapper(client_object);

    if (server_object.error) {
        return {
            error: true,
            ...icici_tw_premium,
            data: server_object.message,
        };
    }

    const URL = `${process.env.ICIC_SANITY}/${process.env.ICICI_TW_PREMIUM}`

    const UAT_URL = "https://ilesb01.insurancearticlez.com/ilservices/motor/v1/proposal/twowheelercalculatepremium"

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authentication.token}`
    }

    try {
        const { data } = await axios({ method: 'post', url: URL, data: server_object.data, headers: headers })
        if (data.status === "Success") {
            const clientData = IciciTwPremiumServerToClientMapper(data);
            return { error: false, ...icici_tw_premium, data: clientData };
        } else {
            return {
                error: true,
                ...icici_tw_premium,
                message: data.message,
            };
        }
    } catch (err) {
        return { error: true, ...icici_tw_premium, message: err.message };
    }
};

/////////////////////////////////////////// TWO WHEELER - PROPOSAL HANDLER  //////////////////////////////////////////

export const IciciTwProposalMainHandler = async (req, res) => {
    const client_object = { ...req.body };

    const kotakResponse = await IciciAccessTokenHandler(client_object, IciciTwProposalHandler);

    res.status(200).send({ status: 200, data: kotakResponse });
};

export const IciciTwProposalHandler = async (client_object, authentication) => {

    const icici_tw_proposal = {
        company: "icici",
        service: "two_wheeler",
        type: "proposal",
    }

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authentication.token}`
    }

    // const server_object = IciciTwProposalClientToServerMapper(client_object);
    const server_object = IciciTwPremiumClientToServerMapper(client_object);

    if (server_object.error) {
        return { error: true, ...icici_tw_proposal, data: server_object.message };
    }

    const URL = `${process.env.ICIC_SANITY}/${process.env.ICICI_TW_PROPOSAL}`

    try {
        const { data } = await axios({ method: 'post', url: URL, data: server_object.data, headers: headers })
        if (data.riskDetails !== null) {
            const resposeData = IciciTwProposalServerToClientMapper(data);
            return { error: false, ...icici_tw_proposal, data: resposeData };
        } else {
            return {
                error: true,
                ...icici_tw_proposal,
                message: data.message,
            };
        }
    } catch (err) {
        return { error: true, ...icici_tw_proposal, message: err.message };
    }
};

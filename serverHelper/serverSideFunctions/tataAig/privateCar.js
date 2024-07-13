import axios from "axios";
import Database from "server_helper/database";
import { TataAigAccessTokenHandler } from "./auth";
import {
    TataAigPcPremiumClientToServerMapper,
    TataAigPcPremiumServerToClientMapper,
    TataAigPcProposalClientToServerMapper,
    TataAigPcProposalServerToClientMapper,
} from "server_helper/key-mapper/tataAig/privateCar";
import { DeploymentURL } from "helper/api";


/////////////////////////////////////////// PRIVATE CAR -  PREMIUM HANDLER  //////////////////////////////////////////

export const TataAigPcPremiumMainHandler = async (req, res) => {
    const client_object = { ...req.body };
    const tataAigResponse = await TataAigPcPremiumHandler(client_object)
    res.status(200).send({ status: 200, data: tataAigResponse });
}

export const TataAigPcPremiumHandler = async (client_object) => {
    let tataAigResponse = {}
    const tataAigQuickResponse = await TataAigPcQuoteHandler(client_object, "quick")

    if (tataAigQuickResponse.error) {
        tataAigResponse = tataAigQuickResponse
    } else {
        const tataAigObject = {
            ...client_object,
            tataAig: {
                ...tataAigQuickResponse.data
            }
        }
        tataAigResponse = await TataAigPcQuoteHandler(tataAigObject, "full")
    }
    return tataAigResponse
}


/////////////////////////////////////////// PRIVATE CAR  -  QUICK QUOTE HANDLER  //////////////////////////////////////////

export const TataAigPcQuoteMainHandler = async (req, res, quote_type) => {
    const client_object = { ...req.body };
    const TataAigResponse = await TataAigPcQuoteHandler(client_object, quote_type);
    res.status(200).send({ status: 200, data: TataAigResponse });
};

export const TataAigPcQuoteHandler = async (client_object, quote_type) => {
    const tataAig_pc_premium = {
        company: "tataAig",
        service: "private_car",
        type: "premium",
        quote_type
    };

    const server_object = TataAigPcPremiumClientToServerMapper(client_object, quote_type);

    if (server_object.error) {
        return {
            error: true,
            ...tataAig_pc_premium,
            data: server_object.message,
        };
    }
    const header_object = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    const URL = `${process.env.TATAAIG_UAT}/${process.env.TATAAIG_PREMIUM}`;


    const params = new URLSearchParams();
    params.append("QDATA", JSON.stringify({ ...server_object }));
    params.append("SRC", process.env.TATAAIG_SRC);
    params.append("T", process.env.TATAAIG_TOKEN);
    params.append("productid", process.env.TATAAIG_PC_PRODUCT_ID);

    try {
        const { data } = await axios.post(URL, params, header_object);
        // return data.data;
        if (!data?.data?.message) {
            const clientData = TataAigPcPremiumServerToClientMapper(data, quote_type);
            return { error: false, ...tataAig_pc_premium, data: clientData };
        } else {
            return {
                error: true,
                ...tataAig_pc_premium,
                message: data.data.message,
            };
        }
    } catch (err) {
        return { error: true, ...tataAig_pc_premium, message: err.message };
    }
};

/////////////////////////////////////////// PRIVATE CAR -  PROPOSAL HANDLER  //////////////////////////////////////////

export const TataAigPcProposalMainHandler = async (req, res) => {
    const client_object = { ...req.body };
    const kotakResponse = await TataAigPcProposalHandler(client_object);
    res.status(200).send({ status: 200, data: kotakResponse });
};


export const TataAigPcProposalHandler = async (client_object) => {
    const tataAig_object = {
        company: "tataAig",
        service: "private_car",
        type: "proposal"
    };
    const server_object = TataAigPcProposalClientToServerMapper(client_object);

    if (server_object.error) {
        return {
            error: true,
            ...tataAig_object,
            message: server_object.message,
        };
    }

    const header_object = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    const URL = `${process.env.TATAAIG_UAT}/${process.env.TATAAIG_PROPOSAL}`;

    const params = new URLSearchParams();
    params.append("PDATA", JSON.stringify({ ...server_object }));
    params.append("SRC", process.env.TATAAIG_SRC);
    params.append("T", process.env.TATAAIG_TOKEN);
    params.append("product_code", process.env.TATAAIG_PC_PRODUCT_ID);
    params.append("THANKYOU_URL", client_object?.c_thank_you_url);

    try {
        const { data } = await axios.post(URL, params, header_object);
        if (!data?.data?.message) {
            const clientData = TataAigPcProposalServerToClientMapper(data);
            return { error: false, ...tataAig_object, data: clientData };
        } else {
            return {
                error: true,
                ...tataAig_object,
                message: data.data.message,
            };
        }
    } catch (err) {
        return { error: true, ...tataAig_object, message: err.message };
    }
};

import axios from "axios";
import { DeploymentURL } from "helper/api";
import {
    TataAigPcPremiumClientToServerMapper,
    TataAigPcProposalClientToServerMapper,
} from "server_helper/key-mapper/tataAig/privateCar";
import {
    TataAigTwProposalClientToServerMapper,
    TataAigTwQuoteClientToServerMapper,
} from "server_helper/key-mapper/tataAig/twoWheeler";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////// TWO WHEELER - QUICK QUOTE  //////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const TataAigTwQuoteCtoS = (req, res, quote_type) => {
    const client_object = { ...req.body };

    const response = TataAigTwQuoteClientToServerMapper(client_object, quote_type);

    res.status(200).send({ response });
};

export const TataAigTwQuoteStoC = async (req, res, quote_type) => {
    const client_object = { ...req.body };
    const header_object = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    const URL = `${process.env.TATAAIG_UAT}/${process.env.TATAAIG_PREMIUM}`;

    const params = new URLSearchParams();
    params.append("QDATA", JSON.stringify({ ...client_object }));
    params.append("SRC", process.env.TATAAIG_SRC);
    params.append("T", process.env.TATAAIG_TOKEN);
    params.append("productid", process.env.TATAAIG_TW_PRODUCT_ID);

    try {
        const { data } = await axios.post(URL, params, header_object);
        res.status(200).send({ data });
    } catch (err) {
        res.status(200).send({ message: err.message });
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////// TWO WHEELER - PROPOSAL  //////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const TataAigTwProposalCtoS = (req, res) => {
    const client_object = { ...req.body };
    const response = TataAigTwProposalClientToServerMapper(client_object);
    res.status(200).send({ response });
};

export const TataAigTwProposalStoC = async (req, res) => {
    const client_object = { ...req.body };

    const header_object = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    const URL = `${process.env.TATAAIG_UAT}/${process.env.TATAAIG_PROPOSAL}`;

    const params = new URLSearchParams();
    params.append("PDATA", JSON.stringify({ ...client_object }));
    params.append("SRC", process.env.TATAAIG_SRC);
    params.append("T", process.env.TATAAIG_TOKEN);
    params.append("product_code", process.env.TATAAIG_TW_PRODUCT_ID);
    params.append("THANKYOU_URL", `${DeploymentURL}/transaction/status`);

    try {
        const { data } = await axios.post(URL, params, header_object);
        res.status(200).send({ data });
    } catch (err) {
        res.status(200).send({ message: err.message });
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////// PRIVATE CAR - PREMIUM  /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const TataAigPcPremiumCtoS = (req, res, quote_type) => {
    const client_object = { ...req.body };
    const response = TataAigPcPremiumClientToServerMapper(client_object, quote_type);
    res.status(200).send({ response });
};

export const TataAigPcPremiumStoC = async (req, res) => {
    const client_object = { ...req.body };
    const header_object = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    }

    const URL = `${process.env.TATAAIG_UAT}/${process.env.TATAAIG_PREMIUM}`;

    const params = new URLSearchParams();
    params.append("QDATA", JSON.stringify({ ...client_object }));
    params.append("SRC", process.env.TATAAIG_SRC);
    params.append("T", process.env.TATAAIG_TOKEN);
    params.append("productid", process.env.TATAAIG_PC_PRODUCT_ID);

    try {
        const { data } = await axios.post(URL, params, header_object);
        res.status(200).send({ data });
    } catch (err) {
        res.status(200).send({ message: err.message });
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////// PRIVATE CAR - PROPOSAL  /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const TataAigPcProposalCtoS = (req, res) => {
    const client_object = { ...req.body };
    const response = TataAigPcProposalClientToServerMapper(client_object);
    res.status(200).send({ response });
};

export const TataAigPcProposalStoC = async (req, res) => {
    const client_object = { ...req.body };
    const header_object = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    }
    const URL = `${process.env.TATAAIG_UAT}/${process.env.TATAAIG_PROPOSAL}`;

    const params = new URLSearchParams();
    params.append("PDATA", JSON.stringify({ ...client_object }));
    params.append("SRC", process.env.TATAAIG_SRC);
    params.append("T", process.env.TATAAIG_TOKEN);
    params.append("product_code", process.env.TATAAIG_PC_PRODUCT_ID);
    params.append("THANKYOU_URL", `${DeploymentURL}/transaction/status`);

    try {
        const { data } = await axios.post(URL, params, header_object);
        res.status(200).send({ data });
    } catch (err) {
        res.status(200).send({ message: err.message });
    }
};

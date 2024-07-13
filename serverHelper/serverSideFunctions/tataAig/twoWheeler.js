import axios from "axios";
import { DeploymentURL } from "helper/api";
import Database from "server_helper/database";
import {
    TataAigTwProposalClientToServerMapper,
    TataAigTwProposalServerToClientMapper,
    TataAigTwQuoteClientToServerMapper,
    TataAigTwQuoteServerToClientMapper,
} from "server_helper/key-mapper/tataAig/twoWheeler";

/////////////////////////////////////////// TWO WHEELER -  PREMIUM HANDLER  //////////////////////////////////////////

export const TataAigTwPremiumMainHandler = async (req, res) => {
    const client_object = { ...req.body };
    const tataAigResponse = await TataAigTwPremiumHandler(client_object)
    res.status(200).send({ status: 200, data: tataAigResponse });
}

export const TataAigTwPremiumHandler = async (client_object) => {
    let tataAigResponse = {}
    const tataAigQuickResponse = await TataAigTwQuoteHandler(client_object, "quick")

    if (tataAigQuickResponse.error) {
        tataAigResponse = tataAigQuickResponse
    } else {
        const tataAigObject = {
            ...client_object,
            tataAig: {
                ...tataAigQuickResponse.data
            }
        }
        tataAigResponse = await TataAigTwQuoteHandler(tataAigObject, "full")
    }
    return tataAigResponse
}

/////////////////////////////////////////// TWO WHEELER -  QUICK QUOTE HANDLER  //////////////////////////////////////////

export const TataAigTwQuoteMainHandler = async (req, res, quote_type) => {
    const client_object = { ...req.body };
    const TataAigResponse = await TataAigTwQuoteHandler(client_object, quote_type);
    res.status(200).send({ status: 200, data: TataAigResponse });
};

export const TataAigTwQuoteHandler = async (client_object, quote_type) => {
    const tataAig_tw_premium = {
        company: "tataAig",
        service: "two_wheeler",
        type: "premium",
        quote_type,
    };

    const server_object = TataAigTwQuoteClientToServerMapper(client_object, quote_type);

    if (server_object.error) {
        return {
            error: true,
            ...tataAig_tw_premium,
            message: server_object.message,
        };
    }

    const header_object = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    // const URL = `https://pipuat.tataaiginsurance.in/tagichubms/ws/v1/ws/tran1/quotation`;

    // const params = new URLSearchParams();
    // params.append("QDATA", JSON.stringify({ ...server_object }));
    // params.append("SRC", "TP");
    // params.append("T", "2D9D1BC5A837E7A2741C6121317E9EE6CE1D32145CBCF7084FA4493ECDA2C2804969A5473610BC2AB4FC034359C11D55F99F8AEC736D84F0EFD531DFE24FFC74F0923F1288A83121B8045A8AAA4D9F920B4D737E3A1134B824E23B1F0561D97AEA647554A31570720BDB6E4CE3D8813A1138ABF16F2A23A8E6BAB012DD07B768019A5B583351F6D36C1F6F26B5C8D474D2F701E664A96F73806EE3A5235DEFFD76CF4106F7F074A55258D75B1DDEFD38");
    // params.append("productid", "3122");

    const URL = `${process.env.TATAAIG_UAT}/${process.env.TATAAIG_PREMIUM}`;

    const params = new URLSearchParams();
    params.append("QDATA", JSON.stringify({ ...server_object }));
    params.append("SRC", process.env.TATAAIG_SRC);
    params.append("T", process.env.TATAAIG_TOKEN);
    params.append("productid", process.env.TATAAIG_TW_PRODUCT_ID);

    try {
        const { data } = await axios.post(URL, params, header_object);
        if (!data?.data?.message) {
            const clientData = TataAigTwQuoteServerToClientMapper(data, quote_type);
            return { error: false, ...tataAig_tw_premium, data: clientData };
        } else {
            return {
                error: true,
                ...tataAig_tw_premium,
                message: data.data.message,
            };
        }
    } catch (err) {
        return { error: true, ...tataAig_tw_premium, message: err.message };
    }
};

/////////////////////////////////////////// TWO WHEELER - PROPOSAL HANDLER  //////////////////////////////////////////

export const TataAigTwProposalMainHandler = async (req, res) => {
    const client_object = { ...req.body };
    const kotakResponse = await TataAigTwProposalHandler(client_object);
    res.status(200).send({ status: 200, data: kotakResponse });
};

export const TataAigTwProposalHandler = async (client_object) => {

    const tataAig_tw_premium = {
        company: "tataAig",
        service: "two_wheeler",
        type: "proposal"
    };
    const server_object = TataAigTwProposalClientToServerMapper(client_object);

    if (server_object.error) {
        return {
            error: true,
            ...tataAig_tw_premium,
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
    params.append("product_code", process.env.TATAAIG_TW_PRODUCT_ID);
    params.append("THANKYOU_URL", client_object?.c_thank_you_url);

    try {
        const { data } = await axios.post(URL, params, header_object);
        if (!data?.data?.message) {
            const clientData = TataAigTwProposalServerToClientMapper(data);
            return { error: false, ...tataAig_tw_premium, data: clientData };
        } else {
            return {
                error: true,
                ...tataAig_tw_premium,
                message: data.data.message,
            };
        }
    } catch (err) {
        return { error: true, ...tataAig_tw_premium, message: err.message };
    }
};

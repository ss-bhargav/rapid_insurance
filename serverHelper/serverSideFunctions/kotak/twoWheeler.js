import axios from "axios";
import Database from "server_helper/database";
import FormData from "form-data";
import { KotakAccessTokenHandler } from "./auth";
import {
    KotakTwPremiumClientToServerMapper,
    KotakTwPremiumServerToClientMapper,
    KotakTwProposalClientToServerMapper,
    KotakTwProposalServerToClientMapper,
} from "server_helper/key-mapper/kotak/twoWheeler";

/////////////////////////////////////////// TWO WHEELER -  PREMIUM HANDLER  //////////////////////////////////////////

export const KotakTwPremiumMainHandler = async (req, res) => {
    const client_object = { ...req.body };

    // await Database.DB.query(
    //     `insert into customers_otp(full_name, mobile, email, insurance_values) values ('${client_object.full_name}', '${
    //         client_object.mobile
    //     }', '${client_object.email}', '${JSON.stringify(client_object)}')`
    // );`

    const kotakResponse = await KotakAccessTokenHandler(client_object, KotakPremiumHandler);

    res.status(200).send({ status: 200, data: kotakResponse });
};

export const KotakPremiumHandler = async (client_object) => {
    const { token } = client_object.authentication;
    const header_object = {
        headers: {
            vTokenCode: token,
            "Content-Type": "application/json",
        },
    };

    const kotak_tw_premium = {
        company: "kotak",
        service: "two_wheeler",
        type: "premium",
    };

    const server_object = KotakTwPremiumClientToServerMapper(client_object);

    if (server_object.error) {
        return { error: true, ...kotak_tw_premium, data: server_object.message };
    }

    const URL = `${process.env.KOTAK_UAT}/${process.env.KOTAK_TW_PREMIUM}`;

    try {
        const { data } = await axios.post(URL, server_object.data, header_object);
        if (data.ErrorMessage === null) {
            const clientData = KotakTwPremiumServerToClientMapper(data.TwoWheelerResponseWithCover);
            return { error: false, ...kotak_tw_premium, data: clientData };
        } else {
            return { error: true, ...kotak_tw_premium, message: data.ErrorMessage };
        }
    } catch (err) {
        return { error: true, ...kotak_tw_premium, message: err.message };
    }
};

/////////////////////////////////////////// TWO WHEELER - PROPOSAL HANDLER  //////////////////////////////////////////

export const KotakTwProposalMainHandler = async (req, res) => {
    const client_object = { ...req.body };

    const kotakResponse = await KotakAccessTokenHandler(client_object, KotakProposalHandler);
    res.status(200).send({ status: 200, data: kotakResponse });
};

export const KotakProposalHandler = async (client_object) => {
    const { token } = client_object.authentication;
    const header_object = {
        headers: {
            vTokenCode: token,
            "Content-Type": "application/json",
        },
    };

    const kotak_tw_proposal = {
        company: "kotak",
        service: "two_wheeler",
        type: "proposal",
    };

    const server_object = KotakTwProposalClientToServerMapper(client_object);

    if (server_object.error) {
        return { error: true, ...kotak_tw_proposal, data: server_object.message };
    }

    const URL = `${process.env.KOTAK_UAT}/${process.env.KOTAK_TW_PROPOSAL}`;

    try {
        const { data } = await axios.post(URL, server_object.data, header_object);

        if (data.Fn_Save_Partner_Two_Wheeler_Proposal_Payment_DetailsResult.vErrorMessage.length === 0) {
            const resposeData = KotakTwProposalServerToClientMapper(data);
            return { error: false, ...kotak_tw_proposal, data: resposeData };
        } else {
            return {
                error: true,
                ...kotak_tw_proposal,
                message: data.Fn_Save_Partner_Two_Wheeler_Proposal_Payment_DetailsResult.vErrorMessage,
            };
        }
    } catch (err) {
        return { error: true, ...kotak_tw_proposal, message: err.message };
    }
};

import Database from "server_helper/database";
import { KotakPremiumHandler } from "serverHelper/serverSideFunctions/kotak/twoWheeler";
import { TataAigTwPremiumHandler, TataAigTwQuoteHandler } from "serverHelper/serverSideFunctions/tataAig/twoWheeler";
import { IciciTwPremiumHandler } from "serverHelper/serverSideFunctions/icici/twoWheeler";
import { IciciAccessTokenHandler } from "serverHelper/serverSideFunctions/icici/auth";
import { KotakAccessTokenHandler } from "server_helper/serverSideFunctions/kotak/auth";

export default function handler(req, res) {
    if (req.method === "POST") {
        PremiumHandler(req, res);
    }
}

////////////////////////////////////////////////////////////////////////////// MAIN HANDLERS  /////////////////////////////////////////////////

const PremiumHandler = async (req, res) => {

    const client_object = { ...req.body };

    const working_companies = { 
        kotak: false,
        tataAig: false,
        icici: true,
    }

    let responseArray = []
    let companies = {}


    const companySwitchHandler = async (company) => {
        if (working_companies[company]) {
            switch (company) {
                case "kotak":
                    return KotakAccessTokenHandler(client_object, KotakPremiumHandler);
                case "tataAig":
                    return TataAigTwPremiumHandler(client_object);
                case "icici":
                    return IciciAccessTokenHandler(client_object, IciciTwPremiumHandler)

                default:
                    break;
            }
        }
    }

    await Promise.all(Object.keys(working_companies).map(async (company) => {
        const response = await companySwitchHandler(company)
        if (response) {
            responseArray.push(response)
            if (!response.error) {
                companies = {
                    ...companies,
                    [company]: { ...response.data },
                };
            }
        }
    })
    )

    // // const kotakResponse = await KotakAccessTokenHandler(client_object, KotakPremiumHandler);
    // // const tataAigResponse = await TataAigTwPremiumHandler(client_object);
    // const icicResponse = await IciciAccessTokenHandler(client_object, IciciTwPremiumHandler)

    // const responseArray = [
    //     // kotakResponse,
    //     // tataAigResponse,
    //     icicResponse
    // ];

    // let companies = {};

    // // if (!kotakResponse.error) {
    // //     companies = {
    // //         ...companies,
    // //         kotak: { ...kotakResponse.data },
    // //     };
    // // }
    // // if (!tataAigResponse.error) {
    // //     companies = {
    // //         ...companies,
    // //         tataAig: { ...tataAigResponse.data },
    // //     };
    // // }
    // if (!icicResponse.error) {
    //     companies = {
    //         ...companies,
    //         tataAig: { ...icicResponse.data },
    //     };
    // }

    res.status(200).send({ status: 200, data: responseArray, companies });
};

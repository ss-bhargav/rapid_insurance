import Database from "server_helper/database";
import { KotakAccessTokenHandler } from "server_helper/serverSideFunctions/kotak/auth";
import { KotakPCPremiumHandler } from "server_helper/serverSideFunctions/kotak/privateCar";
import { TataAigPcPremiumHandler } from "server_helper/serverSideFunctions/tataAig/privateCar";

export default function handler(req, res) {
    if (req.method === "POST") {
        PremiumHandler(req, res);
    }
}

const PremiumHandler = async (req, res) => {
    const client_object = { ...req.body };

    const working_companies = {
        kotak: true,
        tataAig: true,
    }

    let responseArray = []
    let companies = {}

    const companySwitchHandler = async (company) => {
        if (working_companies[company]) {
            switch (company) {
                case "kotak":
                    return KotakAccessTokenHandler(client_object, KotakPCPremiumHandler);
                case "tataAig":
                    return TataAigPcPremiumHandler(client_object);

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

    // Object.keys(working_companies).map(async (company) => {
    //     if (working_companies[company]) {
    //         switch (company) {
    //             case "kotak":
    //                 const kotakResponse = await KotakAccessTokenHandler(client_object, KotakPCPremiumHandler);
    //                 if (!kotakResponse.error) {
    //                     companies = {
    //                         ...companies,
    //                         kotak: { ...kotakResponse.data },
    //                     };
    //                 }
    //                 responseArray.push(kotakResponse);
    //                 break;
    //             case "tataAig":
    //                 const tataAigResponse = await TataAigPcPremiumHandler(client_object);
    //                 if (!tataAigResponse.error) {
    //                     companies = {
    //                         ...companies,
    //                         tataAig: { ...tataAigResponse.data },
    //                     };
    //                 }
    //                 responseArray.push(tataAigResponse);
    //                 break;
    //             case "icici":
    //                 const icicResponse = await IciciAccessTokenHandler(client_object, IciciTwPremiumHandler)
    //                 if (!icicResponse.error) {
    //                     companies = {
    //                         ...companies,
    //                         tataAig: { ...icicResponse.data },
    //                     };
    //                 }
    //                 responseArray.push(icicResponse);
    //                 break;

    //             default:
    //                 break;
    //         }
    //     }
    // })

    // const kotakResponse = await KotakAccessTokenHandler(client_object, KotakPCPremiumHandler);
    // const tataAigResponse = await TataAigPcPremiumHandler(client_object);

    // const responseArray = [
    //     kotakResponse,
    //     // tataAigResponse
    // ];
    // let companies = {};

    // if (!kotakResponse.error) {
    //     companies = {
    //         ...companies,
    //         kotak: { ...kotakResponse.data },
    //     };
    // }
    // if (!tataAigResponse.error) {
    //     companies = {
    //         ...companies,
    //         tataAig: { ...tataAigResponse.data },
    //     };
    // }

    res.status(200).send({ status: 200, data: responseArray, companies });
};

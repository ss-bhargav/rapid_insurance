import { TataAigAccessTokenHandler } from "./auth";
import axios from "axios";

export const TataAigPolicyDocumentMainHandler = async (req, res) => {
    const client_object = { ...req.body };
    const response = await TataAigPolicyDocumentHandler(client_object);
    res.status(200).setHeader("Content-Type", "text/pdf").send({ status: 200, data: response });
};

const TataAigPolicyDocumentHandler = async (client_object) => {
    const header_object = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    let URL;

    https://pipuat.tataaiginsurance.in/tagichubws/motor_policy.jsp?polno=${client_object.policyno}&src=app&key=${client_object.rnd_str}`;

    if (client_object.productcode === "3121") {
        URL = `${process.env.TATAAIG_UAT}/${process.env.TATAAIG_PC_POLICY_DOCUMENT}?polno=${client_object.policyno}&src=app&key=${client_object.rnd_str}`;
    } else if (client_object.productcode === "3122") {
        URL = `${process.env.TATAAIG_UAT}/${process.env.TATAAIG_TW_POLICY_DOCUMENT}?polno=${client_object.policyno}&src=app&key=${client_object.rnd_str}`;
    }

    try {
        const { data } = await axios.get(URL, header_object);
        return data;
    } catch (err) {
        return err.message;
    }
};


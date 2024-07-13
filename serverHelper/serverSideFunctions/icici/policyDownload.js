// import { TataAigAccessTokenHandler } from "./auth";
// import axios from "axios";

// export const TataAigPolicyDocumentMainHandler = async (req, res) => {
//     const client_object = { ...req.body };

//     const response = await TataAigAccessTokenHandler(client_object, TataAigPolicyDocumentHandler);
//     res.status(200).send({ status: 200, data: response });
// };

// const TataAigPolicyDocumentHandler = async (client_object) => {
//     const { token, email } = client_object.authentication;
//     const header_object = {
//         headers: {
//             vTokenCode: token,
//             "Content-Type": "application/json",
//         },
//     };

//     const { c_proposal_number, c_policy_number, c_product_code } = client_object;

//     const URL = "";

//     try {
//         const { data } = await axios.get(URL, header_object);
//         return data;
//     } catch (err) {
//         return err.message;
//     }
// };

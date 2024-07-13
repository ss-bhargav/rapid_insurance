import { KotakAccessTokenHandler } from './auth';
import kotakInsurersMaster from 'serverHelper/db/kotak/master/insurersMaster.json';
import kotakFInancersMaster from 'serverHelper/db/kotak/master/financersMaster.json';
import axios from 'axios';

export const KotakPolicyDocumentMainHandler = async (req, res) => {
  const client_object = { ...req.body };

  const kotakResponse = await KotakAccessTokenHandler(client_object, KotakPolicyDocumentHandler);
  res.status(200).send({ status: 200, data: kotakResponse });
};

const KotakPolicyDocumentHandler = async (client_object) => {
  const { token, email } = client_object.authentication;
  const header_object = {
    headers: {
      vTokenCode: token,
      'Content-Type': 'application/json',
    },
  };

  const { s_proposal_number, s_policy_number, s_product_code } = client_object;

  const URL = `${process.env.KOTAK_UAT}/${process.env.KOTAK_POLICY_DOCUMENT}/${s_proposal_number}/${s_policy_number}/${s_product_code}/${email}`;

  try {
    const { data } = await axios.get(URL, header_object);
    return data;
  } catch (err) {
    return err.message;
  }
};

export const KotakInsurersMasterHandler = (req, res) => {
  const insurerMapped = kotakInsurersMaster.map((insurer) => {
    return {
      c_prev_insurer: insurer.COMPANYNAME,
      c_prev_insurer_code: insurer.TXT_COMPANY_CODE,
    };
  });

  res.send({ status: 200, data: insurerMapped });
};

export const KotakFinancersMasterHanlder = (req, res) => {
  const financerMapped = kotakFInancersMaster.map((financer) => {
    return {
      c_financier_name: financer.TXT_FINANCIER_NAME,
      c_financer_code: financer.NUM_FINANCIER_CD,
    };
  });

  res.send({ status: 200, data: financerMapped });
};

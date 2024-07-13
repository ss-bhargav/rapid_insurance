import axios from 'axios';
import Database from 'server_helper/database';
import { KotakPcPremiumClientToServerMapper, KotakPcPremiumServerToClientMapper, KotakPcProposalClientToServerMapper, KotakPcProposalServerToClientMapper } from 'server_helper/key-mapper/kotak/privateCar';
import { KotakAccessTokenHandler } from './auth';

/////////////////////////////////////////// PRIVATE CAR - PREMIUM HANDLER  //////////////////////////////////////////

export const KotakPCPremiumMainHandler = async (req, res) => {
  const client_object = { ...req.body };

  // await Database.DB.query(
  //     `insert into customers_otp(full_name, mobile, email, insurance_values) values ('${client_object.full_name}', '${
  //         client_object.mobile
  //     }', '${client_object.email}', '${JSON.stringify(client_object)}')`
  // );`

  const kotakResponse = await KotakAccessTokenHandler(client_object, KotakPCPremiumHandler);
  res.status(200).send({ status: 200, data: kotakResponse });
};

export const KotakPCPremiumHandler = async (client_object) => {
  const { token, email } = client_object.authentication;
  const header_object = {
    headers: {
      vTokenCode: token,
      'Content-Type': 'application/json',
    },
  };
  const kotak_pc_premium = {
    company: 'kotak',
    service: 'private_car',
    type: 'premium',
  };

  const server_object = KotakPcPremiumClientToServerMapper(client_object);

  if (server_object.error) {
    return { error: true, ...kotak_pc_premium, data: server_object.message };
  }

  const URL = `${process.env.KOTAK_UAT}/${process.env.KOTAK_PC_PREMIUM}/${email}`;

  try {
    const { data } = await axios.post(URL, server_object.data, header_object);
    if (data.vErrorMsg === 'Success') {
      const resposeData = KotakPcPremiumServerToClientMapper(data);
      return { error: false, ...kotak_pc_premium, data: resposeData };
    } else {
      return { error: true, ...kotak_pc_premium, message: data.vErrorMsg };
    }
  } catch (err) {
    return { error: true, ...kotak_pc_premium, message: err.message };
  }
};

/////////////////////////////////////////// PRIVATE CAR - PROPOSAL HANDLER  //////////////////////////////////////////

export const KotakPCProposalMainHandler = async (req, res) => {
  const client_object = { ...req.body };

  // await Database.DB.query(
  //     `insert into customers_otp(full_name, mobile, email, insurance_values) values ('${client_object.full_name}', '${
  //         client_object.mobile
  //     }', '${client_object.email}', '${JSON.stringify(client_object)}')`
  // );

  const kotakResponse = await KotakAccessTokenHandler(client_object, KotakPCProposalHandler);
  res.status(200).send({ status: 200, data: kotakResponse });
};

export const KotakPCProposalHandler = async (client_object) => {
  const { token, email } = client_object.authentication;
  const header_object = {
    headers: {
      vTokenCode: token,
      'Content-Type': 'application/json',
    },
  };

  const kotak_pc_proposal = {
    company: 'kotak',
    service: 'private_car',
    type: 'proposal',
  };

  const server_object = KotakPcProposalClientToServerMapper(client_object);

  if (server_object.error) {
    return { error: true, ...kotak_pc_proposal, data: server_object.message };
  }

  const QuoteId = server_object.data.objParaPaymentDetails.vQuoteId;

  const URL = `${process.env.KOTAK_UAT}/${process.env.KOTAK_PC_PROPOSAL}/${QuoteId}/${email}`;

  try {
    const { data } = await axios.post(URL, server_object.data, header_object);
    if (data.Fn_Save_Partner_Private_Car_Proposal_Payment_DetailsResult.vErrorMessage === 'Success') {
      const mappedData = KotakPcProposalServerToClientMapper(data);
      return { error: false, ...kotak_pc_proposal, data: mappedData };
    } else {
      return {
        error: true,
        ...kotak_pc_proposal,
        message: data.Fn_Save_Partner_Private_Car_Proposal_Payment_DetailsResult.vErrorMessage,
      };
    }
  } catch (err) {
    return { error: true, ...kotak_pc_proposal, message: err.message };
  }
};

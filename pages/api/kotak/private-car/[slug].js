import Database from 'server_helper/database';
import { KotakPCPolicyDocumentMainHandler, KotakPCPremiumMainHandler, KotakPCProposalMainHandler } from 'serverHelper/serverSideFunctions/kotak/privateCar';
import { KotakPcPremiumCtoS, KotakPcPremiumStoC, KotakPcProposalCtoS, KotakPcProposalStoC } from 'serverHelper/serverSideFunctions/kotak/test';

// ;

export default function handler(req, res) {
  const { slug } = req.query;
  switch (slug) {
    case 'premium':
      if (req.method === 'POST') KotakPCPremiumMainHandler(req, res);
      break;
    case 'proposal':
      if (req.method === 'POST') KotakPCProposalMainHandler(req, res);
      break;
    case 'premium-client-to-server':
      if (req.method === 'POST') KotakPcPremiumCtoS(req, res);
      break;
    case 'premium-server-to-client':
      if (req.method === 'POST') KotakPcPremiumStoC(req, res);
      break;
    case 'proposal-client-to-server':
      if (req.method === 'POST') KotakPcProposalCtoS(req, res);
      break;
    case 'proposal-server-to-client':
      if (req.method === 'POST') KotakPcProposalStoC(req, res);
      break;

    default:
      res.status(404).send('Something went wrong');
      break;
  }
}

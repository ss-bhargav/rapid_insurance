import Database from 'server_helper/database';
import { KotakTwPolicyDocumentMainHandler, KotakTwPremiumMainHandler, KotakTwProposalMainHandler } from 'serverHelper/serverSideFunctions/kotak/twoWheeler';
import { KotakTwPremiumCtoS, KotakTwPremiumStoC, KotakTwProposalCtoS, KotakTwProposalStoC } from 'serverHelper/serverSideFunctions/kotak/test';

// ;

export default function handler(req, res) {
  const { slug } = req.query;
  switch (slug) {
    case 'premium':
      if (req.method === 'POST') KotakTwPremiumMainHandler(req, res);
      break;
    case 'proposal':
      if (req.method === 'POST') KotakTwProposalMainHandler(req, res);
      break;
    case 'premium-client-to-server':
      if (req.method === 'POST') KotakTwPremiumCtoS(req, res);
      break;
    case 'premium-server-to-client':
      if (req.method === 'POST') KotakTwPremiumStoC(req, res);
      break;
    case 'proposal-client-to-server':
      if (req.method === 'POST') KotakTwProposalCtoS(req, res);
      break;
    case 'proposal-server-to-client':
      if (req.method === 'POST') KotakTwProposalStoC(req, res);
      break;

    default:
      res.status(404).send('Something went wrong');
      break;
  }
}

require('dotenv').config();
const router = require('express').Router;
import { SubmitPosSignUpDetails,ValidateLoginDetails } from 'server_helper/pos/signup';

export default function handler(req, res) {
  const { details } = req.query;
  switch (details) {
    case 'pos-signup':
      if (req.method === 'POST') SubmitPosSignUpDetails(req, res);
      break;
    case 'pos-login':
      if (req.method === 'POST') ValidateLoginDetails(req, res);
      break;
    default:
      break;
  }
}

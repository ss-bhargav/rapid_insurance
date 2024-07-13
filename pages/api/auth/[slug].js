require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const jwtAuthToken = process.env.ACCESS_TOKEN_SECRET;
const jwtRefreshToken = process.env.JWT_REFRESH_TOKEN;
const smsKey = process.env.SMS_SECRET_KEY;
const { URLSearchParams } = require('url');
const fetch = require('node-fetch');

export default function handler(req, res) {
  const { slug } = req.query;

  switch (slug) {
    case 'send-otp':
      if (req.method === 'POST') SendOtp(req, res);
      break;
    case 'verify-otp':
      if (req.method === 'POST') VerifyOtp(req, res);
      break;
    case 'verify-payment':
      if (req.method === 'POST') VerifyPayment(req, res);
      break;

    default:
      res.status(404).send('Something went wrong');
      break;
  }
}

const VerifyPayment = async (req, res) => {
  const encodedParams = new URLSearchParams();
  encodedParams.set('key', req.body.key);
  encodedParams.set('command', req.body.command);
  encodedParams.set('var1', req.body.var1);
  encodedParams.set('hash', req.body.hash);
  const url = 'https://test.payu.in/merchant/postservice?form=2';
  const options = { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' }, body: encodedParams };
  fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      res.status(200).send({ status: 200, data: json });
    })
    .catch((err) => {
      console.error('error:' + err);
      res.status(200).send({ status: 400, message: err.message });
    });
  // res.status(200).send({message: 'OK'});
};

const SendOtp = async (req, res) => {
  try {
    const phone = req.body.mobile;
    const otp = Math.floor(1000 + Math.random() * 9000);
    const ttl = 10 * 60 * 1000;
    const expires = Date.now() + ttl;
    const data = `${phone}.${otp}.${expires}`;
    const hash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
    const fullHash = `${hash}.${expires}`;

    //////////////////////////////// Production

    // axios.post(`https://www.smsgatewayhub.com/api/mt/SendSMS?APIKey=${process.env.SMS_GATEWAY_HUB_KEY}&senderid=LMVINS&channel=2&DCS=0&flashsms=0&number=${phone}&text=Dear ${phone}, ${otp} is OTP for your login at LMVIB POS portal. It will be valid for 10 minutes. In case of dispute call us 9493326920.&dlttemplateid=1305163453225680984`)
    // axios
    //   .post(`https://www.smsgatewayhub.com/api/mt/SendSMS?APIKey=${process.env.SMS_GATEWAY_HUB_KEY}&senderid=LMVINS&channel=2&DCS=0&flashsms=0&number=${phone}&text=Dear ${phone}, ${otp} is OTP for your login at LMV Rapid Insurance. It will be valid for 10 minutes. In case of dispute call us 9493326920.&dlttemplateid=1307163515586328482`)
    //   .then((response) => {
    //     res.status(200).send({ status: 200, phone, hash: fullHash });
    //   })
    //   .catch((err) => console.log(err.message));

    ////////////////////////////// Testing

    res.status(200).send({ status: 200, phone, hash: fullHash, otp });
  } catch (error) {
    res.status(400).send({ status: 400, message: error.message });
  }
};

const VerifyOtp = (req, res) => {
  try {
    const phone = req.body.phone;
    const hash = req.body.hash;
    const otp = req.body.otp;
    let [hashValue, expires] = hash.split('.');
    let now = Date.now();
    if (now > parseInt(expires)) {
      return res.status(504).send({ message: 'Timeout Please try again' });
    }
    const data = `${phone}.${otp}.${expires}`;
    const newHash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
    if (newHash === hashValue) {
      return res.status(200).send({ error: false, message: 'Success', status: 200 });
      // const accessToken = jwt.sign({data : phone},jwtAuthToken,{expiresIn:'30s'})
      // const refreshToken = jwt.sign({data:phone},refreshToken,{expiresIn:'30s'})
    } else {
      return res.status(200).send({ status: 200, error: true, message: 'Incorrect OTP' });
    }
  } catch (error) {
    return res.status(200).send({ status: 400, error: true, message: 'Something went wrong.....!' });
  }
};

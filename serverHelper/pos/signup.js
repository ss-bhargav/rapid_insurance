require('dotenv').config();
import conn from 'server_helper/database';
const jwt = require('jsonwebtoken');
import { serialize } from 'cookie';

export const SubmitPosSignUpDetails = async (req, res) => {
  try {
    const valueIndex = (obj) => {
      return Object.keys(obj)
        .map((key, index) => `$${index + 1}`)
        .join(',');
    };
    const { mobile_number, pan_number, aadhar_number } = req.body;
    function generatePosId(values) {
      let name = req.body.last_name.slice(0, 3);
      let last_char = req.body.mobile_number.slice(5).toString();
      let pos_id = name + last_char;
      return pos_id;
    }

    function generatePosIdPassword(values) {
      let generate_password_char1 = req.body.last_name.slice(0, 3);
      let generate_password_char2 = req.body.mobile_number.slice(9).toString();
      let generate_random = Math.floor(100 + Math.random() * 900);
      return generate_password_char1 + generate_password_char2 + generate_random.toString() + '$';
    }

    const pos_id = generatePosId(req.body);
    const password = generatePosIdPassword(req.body);

    const obj = {
      ...req.body,
      pos_id,
      password,
    };
    const validateDetails = await (await conn.query(`select * from pos_details where mobile_number = $1 and aadhar_number =$2 and pan_number = $3`, [mobile_number, aadhar_number, pan_number])).rows;

    if (validateDetails.length > 0) {
      return res.status(202).send({ status: 202, message: 'Details Already Exists' }).end();
    }
    const insertRecord = await (await conn.query(`insert into pos_details(${Object.keys(obj).join(',')}) values(${valueIndex(obj)}) returning *`, Object.values(obj))).rows;
    insertRecord.length > 0 ? res.send({ status: 200, message: `POS details registered Successfully with user Id : ${insertRecord[0].pos_id}` }).end() : res.send({ status: 204, message: 'Something went wrong, Please try again' }).end();
  } catch (error) {
    return res.status(400).send('Something went wrong, Please try again after sometime');
  }
};

export const ValidateLoginDetails = async (req, res) => {
  try {
    const { username, password } = req.body;

    const validateLoginDetails = await (await conn.query(`select pos_id,password from pos_details where pos_id = $1 and password =$2`, [username, password])).rows;
    if (validateLoginDetails.length <= 0) {
      return res.status(202).send({ status: 204, message: `Username or Password doesn't exists` }).end();
    } else {
      const token = jwt.sign(username, process.env.JWT_REFRESH_TOKEN);
      res.setHeader('Set-Cookie', serialize('token', token, { path: '/', maxAge: 60 * 60 * 24 * 1, secure: process.env.NODE_ENV === 'production', sameSite: true, httpOnly: true, secure: true })).send({ status: 200, message: 'login successfully' });
    }
  } catch (error) {
    return res.status(400).send('Something went wrong, Please try again after sometime');
  }
};

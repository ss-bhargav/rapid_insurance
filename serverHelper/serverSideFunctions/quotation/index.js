import { v4 as uuidv4 } from 'uuid';
import conn from 'server_helper/database';

export const AddQuotation = async (req, res) => {
  const quotation_id = uuidv4();
  const date = new Date();
  const crn = Date.now();
  const client_object = JSON.stringify(req.body);

  try {
    const data = await (await conn.query(`insert into quotation_details(quotation_id, crn, date, client_object) values ($1, $2, $3, $4) returning *`, [quotation_id, crn, date, client_object])).rows;

    res.send({ data });
  } catch (error) {
    res.send({ message: error.message });
  }
};

export const GetQuotation = async (req, res) => {
  const { quotation_id } = req.body;

  try {
    const data = await (await conn.query(`select * from quotation_details where quotation_id = '${quotation_id}'`)).rows;
    res.send({ data });
  } catch (error) {
    res.send({ message: error.message });
  }
};

export const UpdateQuotation = async (req, res) => {
  const { quotation_id, client_object } = req.body;

  try {
    const data = await (await conn.query(`update quotation_details set client_object = '${JSON.stringify(client_object)}' where quotation_id = '${quotation_id}' returning *`)).rows;
    res.send({ data });
  } catch (error) {
    res.send({ message: error.message });
  }
};

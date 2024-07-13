import Database from 'server_helper/database';
// ;

export default function handler(req, res) {
  const { slug } = req.query;

  switch (slug) {
    case 'txnid-verify':
      if (req.method === 'POST') {
        VerifyTransactionIdHandler(req, res);
      }
      break;

    case 'generate-txnid':
      if (req.method === 'GET') {
        GenerateNewTransactionIdHandler(req, res);
      }
      break;

    default:
      res.status(404).send('Something went wrong');
      break;
  }
}

const GenerateNewTransactionIdHandler = async (req, res) => {
  const randomNumber = Date.now();
  const txnid = Number(`9${randomNumber}`);
  res.status(200).send({ txnid });
};

const VerifyTransactionIdHandler = async (req, res) => {
  try {
    const response = await (await Database.DB.query(`select txnid from payment_transactions where txnid = '${req.body.txnid}'`)).rowCount;
    res.status(200).send({ data: response });
  } catch (error) {
    res.status(400).send({ data: error.message });
  }
};

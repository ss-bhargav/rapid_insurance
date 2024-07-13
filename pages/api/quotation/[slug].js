import { AddQuotation, GetQuotation, UpdateQuotation } from "server_helper/serverSideFunctions/quotation";


export default function handler(req, res) {
     const { slug } = req.query;
   
     switch (slug) {
       case 'add':
         if (req.method === 'POST') AddQuotation(req, res);
         break;
       case 'update':
         if (req.method === 'POST') UpdateQuotation(req, res);
         break;
       case 'get':
         if (req.method === 'POST') GetQuotation(req, res);
         break;
   
       default:
         res.status(404).send('Something went wrong');
         break;
     }
   }
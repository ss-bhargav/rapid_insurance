import { TataAigMakePayment } from "server_helper/serverSideFunctions/tataAig/payment";

 
 export default function handler(req, res) {
     const { slug } = req.query;
 
     switch (slug) {
         case "make":
             if (req.method === "POST") TataAigMakePayment(req, res);
             break;
         default:
             res.status(404).send("Something went wrong");
             break;
     }
 }
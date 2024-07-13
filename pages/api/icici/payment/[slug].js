import { icicCreateTransactionsHandler } from "server_helper/serverSideFunctions/icici/payment";

export default function handler(req, res) {
     const { slug } = req.query;
     switch (slug) {
          case "create-transactions":
               if (req.method === "POST") icicCreateTransactionsHandler(req, res);
               break;

          default:
               res.status(404).send("Something went wrong");
               break;
     }
}

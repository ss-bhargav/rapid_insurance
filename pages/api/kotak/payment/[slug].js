import { PayUKotakPayment, VerifyPaymentWithTxnid } from "serverHelper/serverSideFunctions/kotak/payment";

export default function handler(req, res) {
    const { slug } = req.query;

    switch (slug) {
        case "verify-payment":
            if (req.method === "POST") VerifyPaymentWithTxnid(req, res);
            break;
        case "buy-now":
            if (req.method === "POST") PayUKotakPayment(req, res);
            break;

        default:
            res.status(404).send("Something went wrong");
            break;
    }
}

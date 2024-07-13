require("dotenv").config();
import crypto from "crypto";
import { URLSearchParams } from "url";
import fetch from "node-fetch";
import { VerifyPaymentClientToServer } from "serverHelper/key-mapper/kotak/payment";
import { DeploymentURL, GenerateNewTransactionIdHandler } from "helper/api";
import { EncryptObject } from "helper/hashing";
import FormData from "form-data";
import axios from "axios";

// Merchant ID: 106955
// Merchant Key: an7rIU
// SALT: 8MUr8LS7
// CardNumber: 5123456789012346
// CVV: 123
// Expiry: May 2025
// OTP - 123456



export const PayUKotakPayment = async (req, res) => {

    const data = { ...req.body }

    const key = 'an7rIU';
    const productinfo = 'Bike';
    const salt = '8MUr8LS7';
    const hashString = '8MUr8LS7';
    let txnid;

    const response = await GenerateNewTransactionIdHandler()
    if (response.txnid) {
        txnid = response.txnid;
    }

    // const hashString = `${key}|${txnid}|${data.premium}|${productinfo}|${data.first_name}|${data.email}||||||${salt}`;
    const hashing = crypto.createHash('sha512').update(hashString).digest('hex');

    const encryptedObject = EncryptObject({ key, txnid, salt, data });

    const surl = `${DeploymentURL}/transaction/success?response=${encryptedObject}`;
    const furl = `${DeploymentURL}/transaction/failure?response=${encryptedObject}`;
    const curl = `${DeploymentURL}/transaction/cancel?response=${encryptedObject}`;


    var bodyFormData = new FormData();
    bodyFormData.append("key", key);
    bodyFormData.append("txnid", txnid);
    bodyFormData.append("amount", data.company_object.s_total_premium);
    bodyFormData.append("productinfo", productinfo);
    bodyFormData.append("firstname", data.c_first_name);
    bodyFormData.append("lastname", data.c_last_name);
    bodyFormData.append("email", data.c_email);
    bodyFormData.append("phone", data.c_mobile);
    bodyFormData.append("address1", data.c_address_line1);
    bodyFormData.append("address2", data.c_address_line2);
    bodyFormData.append("city", data.c_city);
    bodyFormData.append("state", data.c_state);
    bodyFormData.append("country", "india");
    bodyFormData.append("zipcode", data.c_pincode);
    bodyFormData.append("udf1", "");
    bodyFormData.append("udf2", "");
    bodyFormData.append("udf3", "");
    bodyFormData.append("udf4", "");
    bodyFormData.append("udf5", "");
    bodyFormData.append("surl", surl);
    bodyFormData.append("furl", furl);
    bodyFormData.append("curl", curl);
    bodyFormData.append("hash", hashing);
    bodyFormData.append("pg", "");
    bodyFormData.append("codurl", "");
    bodyFormData.append("drop_category", "");
    bodyFormData.append("enforce_paymethod", "");
    bodyFormData.append("note_category", "");
    bodyFormData.append("api_version", "");
    bodyFormData.append("shipping_firstname", "");
    bodyFormData.append("shipping_lastname", "");
    bodyFormData.append("shipping_address1", "");
    bodyFormData.append("shipping_address2", "");
    bodyFormData.append("shipping_city", "");
    bodyFormData.append("shipping_state", "");
    bodyFormData.append("shipping_country", "");
    bodyFormData.append("shipping_zipcode", "");
    bodyFormData.append("shipping_phone", "");
    bodyFormData.append("offer_key", "");
    bodyFormData.append("partner_hold_time", "");
    bodyFormData.append("Items", "");
    bodyFormData.append("offer_key", "");
    bodyFormData.append("Birthday", "");
    bodyFormData.append("Gender", "");
    bodyFormData.append("Ipurl", "");
    bodyFormData.append("pre_authorize", "");
    bodyFormData.append("transactionContext", "");

    // res.status(200).send(bodyFormData);
    const url = 'https://test.payu.in/_payment';
    axios.post('https://test.payu.in/_payment', bodyFormData, { "Content-Type": "multipart/form-data" })
        .then(function (response) {
            res.status(200).send(response);
        })
        .catch(function (response) {
            //handle error
            console.log(response.message);
        });   // fetch(url, options)

};

// export const PayUKotakPayment = async (req, res) => {

//     const data = {...req.body}
//     // Merchant ID: 106955
//     // Merchant Key: an7rIU
//     // SALT: 8MUr8LS7
//     // CardNumber: 5123456789012346
//     // CVV: 123
//     // Expiry: May 2025
//     // OTP - 123456
//     const key = 'an7rIU';
//     const productinfo = 'Bike';
//     const salt = '8MUr8LS7';
//     const hashString = '8MUr8LS7';
//     let txnid;

//     const response = await GenerateNewTransactionIdHandler()
//     if (response.txnid) {
//         txnid = response.txnid;
//     }

//     // const hashString = `${key}|${txnid}|${data.premium}|${productinfo}|${data.first_name}|${data.email}||||||${salt}`;
//     const hashing = crypto.createHash('sha512').update(hashString).digest('hex');

//     const encryptedObject = EncryptTxnObject({ key, txnid, salt, data });

//     const surl = `${DeploymentURL}/transaction/success?response=${encryptedObject}`;
//     const furl = `${DeploymentURL}/transaction/failure?response=${encryptedObject}`;
//     const curl = `${DeploymentURL}/transaction/cancel?response=${encryptedObject}`;


//     const encodedParams = new URLSearchParams();
//     encodedParams.set("key", key);
//     encodedParams.set("txnid", txnid);
//     encodedParams.set("amount", data.company_object.s_total_premium);
//     encodedParams.set("productinfo", productinfo);
//     encodedParams.set("firstname", data.c_first_name);
//     encodedParams.set("lastname", data.c_last_name);
//     encodedParams.set("email", data.c_email);
//     encodedParams.set("phone", data.c_mobile);
//     encodedParams.set("address1", data.c_address_line1);
//     encodedParams.set("address2", data.c_address_line2);
//     encodedParams.set("city", data.c_city);
//     encodedParams.set("state", data.c_state);
//     encodedParams.set("country", "india");
//     encodedParams.set("zipcode", data.c_pincode);
//     encodedParams.set("udf1", "");
//     encodedParams.set("udf2", "");
//     encodedParams.set("udf3", "");
//     encodedParams.set("udf4", "");
//     encodedParams.set("udf5", "");
//     encodedParams.set("surl", surl);
//     encodedParams.set("furl", furl);
//     encodedParams.set("curl", curl);
//     encodedParams.set("hash", hashing);
//     encodedParams.set("pg", "");
//     encodedParams.set("codurl", "");
//     encodedParams.set("drop_category", "");
//     encodedParams.set("enforce_paymethod", "");
//     encodedParams.set("note_category", "");
//     encodedParams.set("api_version", "");
//     encodedParams.set("shipping_firstname", "");
//     encodedParams.set("shipping_lastname", "");
//     encodedParams.set("shipping_address1", "");
//     encodedParams.set("shipping_address2", "");
//     encodedParams.set("shipping_city", "");
//     encodedParams.set("shipping_state", "");
//     encodedParams.set("shipping_country", "");
//     encodedParams.set("shipping_zipcode", "");
//     encodedParams.set("shipping_phone", "");
//     encodedParams.set("offer_key", "");
//     encodedParams.set("partner_hold_time", "");
//     encodedParams.set("Items", "");
//     encodedParams.set("offer_key", "");
//     encodedParams.set("Birthday", "");
//     encodedParams.set("Gender", "");
//     encodedParams.set("Ipurl", "");
//     encodedParams.set("pre_authorize", "");
//     encodedParams.set("transactionContext", "");

//     const url = "https://test.payu.in/_payment";
//     const options = {
//         method: "POST",
//         headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
//         body: encodedParams,
//     };
//     fetch(url, options)
//         .then((res) => res.json())
//         .then((json) => console.log(json))
//         .catch((err) => console.error("error:" + err));
// };




export const VerifyPaymentWithTxnid = async (req, res) => {
    const key = process.env.PAYU_KEY;
    const salt = process.env.PAYU_SALT;
    const var1 = req.body.txnid;
    const command = "verify_payment";

    const hashString = `${key}|${command}|${var1}|${salt}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    const encodedParams = new URLSearchParams();
    encodedParams.set("key", key);
    encodedParams.set("command", command);
    encodedParams.set("var1", var1);
    encodedParams.set("hash", hash);
    const url = "https://test.payu.in/merchant/postservice?form=2";
    const options = {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
        body: encodedParams,
    };

    const response = await fetch(url, options);
    const response_data = await response.json();

    if (response_data?.status === 1) {
        const client_object = VerifyPaymentClientToServer(response_data, var1);
        res.status(200).send({ error: false, transaction_details: response_data, client_object: client_object });
    } else {
        res.status(200).send({ error: true, message: response_data?.msg });
    }
};




export const SavePaymentAndGetDetails = async (jsonObject, status) => {
    const key = jsonObject.hash_keys.key;
    const var1 = jsonObject.hash_keys.txnid;
    const salt = jsonObject.hash_keys.salt;
    const crn = jsonObject?.data?.c_crn || 5668545;
    const command = "verify_payment";

    const hashString = `${key}|${command}|${var1}|${salt}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    const encodedParams = new URLSearchParams();
    encodedParams.set("key", key);
    encodedParams.set("command", command);
    encodedParams.set("var1", var1);
    encodedParams.set("hash", hash);
    const url = "https://test.payu.in/merchant/postservice?form=2";
    const options = {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
        body: encodedParams,
    };

    const response = await fetch(url, options);
    const response_data = await response.json();

    const store_transaction = {
        txnid: var1,
        crn: jsonObject.data.c_crn || null,
        customer_name: jsonObject.data.c_full_name || null,
        customer_mobile: jsonObject.data.c_mobile || null,
        company_name: jsonObject.data.c_company_name || null,
        status: status,
        plan_name: jsonObject.data.c_plan_name || null,
        transaction_response: JSON.stringify(response_data),
        customer_response: JSON.stringify(jsonObject.data),
    };

    const store_customer = {
        crn: jsonObject.data.c_crn || 5668545,
        txnid: var1,
        full_name: jsonObject.data.c_full_name || null,
        mobile: jsonObject.data.c_mobile || null,
        email: jsonObject.data.c_email || null,
        customer_response: JSON.stringify(jsonObject.data),
    };

    let valueIndex = (store_object) => {
        return Object.values(store_object)
            .map((item, index) => `$${index + 1}`)
            .join(", ");
    };

    try {
        const verify_transaction_id = await (
            await Database.DB.query(`select txnid from payment_transactions where txnid = ${var1}`)
        ).rowCount;
        if (verify_transaction_id === 0) {
            const transaction_response = await (
                await Database.DB.query(
                    `INSERT INTO payment_transactions(${Object.keys(store_transaction).join(
                        ", "
                    )}) VALUES (${valueIndex(store_transaction)})`,
                    Object.values(store_transaction)
                )
            ).rowCount;
            if (transaction_response) {
                console.log("Transaction Added Successfully");
            } else {
                console.log("Something went wrong while adding transaction");
            }
        } else {
            console.log("Transaction already exist");
        }
    } catch (error) {
        console.log("Something went wrong while validation or inserting transaction data in database");
    }

    try {
        const verify_crn = await (await Database.DB.query(`select crn from customers where crn = ${crn}`)).rowCount;
        if (verify_crn === 0) {
            const customer_response = await (
                await Database.DB.query(
                    `INSERT INTO customers(${Object.keys(store_customer).join(", ")}) VALUES (${valueIndex(
                        store_customer
                    )})`,
                    Object.values(store_customer)
                )
            ).rowCount;
            if (customer_response) {
                console.log("Customer Added Successfully");
            } else {
                console.log("Something went wrong while adding customer");
            }
        } else {
            console.log("Customer already exisit");
        }
    } catch (error) {
        console.log("Something went wrong while validation or inserting customer data in database");
    }

    const response_transaction = VerifyPaymentClientToServer(response_data, var1);

    return { error: false, message: "Success", transaction_details: response_transaction };
};

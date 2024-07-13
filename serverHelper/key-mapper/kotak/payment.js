export const VerifyPaymentClientToServer = (server_object, txnid) => {
    const transaction_details = server_object.transaction_details[txnid];

    const client_object = {
        s_mih_pay_id: transaction_details.mihpayid || null,
        s_transaction_amount: transaction_details.amt || null,
        s_txnid: transaction_details.txnid || null,
        s_additional_charges: transaction_details.additional_charges || null,
        s_product_info: transaction_details.productinfo || null,
        s_bank_code: transaction_details.bankcode || null,
        s_transaction_date: transaction_details.addedon || null,
        s_payment_source: transaction_details.payment_source || null,
        s_card_type: transaction_details.card_type || null,
    };

    return client_object;
};

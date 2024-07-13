

export const TataAigMakePayment = async (req, res, next) => {

     const { proposal_number, src } = req.body;

     console.log(req.body);

     const paymentURL = `https://pipuat.tataaiginsurance.in/tagichubws/cpirequest.jsp?proposal_no=${proposal_number}&src=${src}`

     res.status(301).redirect(paymentURL)

}
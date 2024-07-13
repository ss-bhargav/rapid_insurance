import React, { useEffect } from 'react';
import CryptoJS from 'crypto-js';

const TransactionStatus = ({ query }) => {

     useEffect(() => {
          console.log(query);
          if (query.response) {
               const parsedWordArray = CryptoJS.enc.Base64.parse(query.response)
               const response_object = parsedWordArray.toString(CryptoJS.enc.Utf8);
               console.log(JSON.parse(response_object))
          }
     }, [])

     return (<div>
          <h1>Transaction Status</h1>
     </div>)
}

export default TransactionStatus;
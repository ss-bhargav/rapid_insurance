import TataAigTransaction from "components/TransactionStatus/TataAig";
import CryptoJS from 'crypto-js';


export default function PageData({ response_object, quotation_id, client_object }) {
     return (
          <div>
               <TataAigTransaction
                    response={response_object}
                    quotation_id={quotation_id}
                    client_object={client_object}
               />
          </div>
     )
}

export async function getServerSideProps(context) {
     const { query } = context;
     let valuesArray = []
     Object.keys(query).forEach((value, key) => {
          valuesArray.push(query[value])
     })

     let response_object = null;
     if (valuesArray[1]) {
          const parsedWordArray = CryptoJS.enc.Base64.parse(valuesArray[1])
          response_object = JSON.parse(parsedWordArray.toString(CryptoJS.enc.Utf8))
     }

     return {
          props: {
               response_object,
               quotation_id: valuesArray[0],
          },
     };
}


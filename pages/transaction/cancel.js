// import { useEffect, useState } from 'react';
import { DecryptObject } from 'helper/hashing';
import { SavePaymentAndGetDetails } from 'serverHelper/serverLessFunctions/server-less-functions';

const TransactionCancel = ({ data, error }) => {
  return (
    <div>
      <h1>Transaction Cancel</h1>
    </div>
  );
};

export default TransactionCancel;

export async function getServerSideProps(context) {
  const encryptedString = context.req.__NEXT_INIT_QUERY.response;
  const jsonObject = DecryptObject(encryptedString);

  if (jsonObject.data.c_company_name === 'kotak') {
    const data = await SavePaymentAndGetDetails(jsonObject, 'cancel');
    if (data.error) {
      return {
        props: {
          data: jsonObject,
          error: data.error,
        },
      };
    } else {
      return {
        props: {
          data: jsonObject,
        },
      };
    }
  }
}

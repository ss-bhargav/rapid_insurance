import { DecryptTxnObject } from 'helper/hashing';
import { SavePaymentAndGetDetails } from 'serverHelper/serverLessFunctions/server-less-functions';

const TransactionFailure = ({ data, error }) => {
  return (
    <div>
      <h1>Transaction Failure</h1>
    </div>
  );
};

export default TransactionFailure;

export async function getServerSideProps(context) {
  const encryptedString = context.req.__NEXT_INIT_QUERY.response;
  const jsonObject = DecryptTxnObject(encryptedString);

  if (jsonObject.data.c_company_name === 'kotak') {
    const data = await SavePaymentAndGetDetails(jsonObject, 'failure');
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

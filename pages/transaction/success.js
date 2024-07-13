import { useEffect, useState } from 'react';
import SuccessPage from 'components/TransactionStatus/PaymentSuccess';
import { GetQuotation } from 'helper/api';

const TransactionSuccess = ({ client_object }) => {
  return (
    <div>
      <SuccessPage data={client_object} />
    </div>
  );
};

export default TransactionSuccess;

export async function getServerSideProps(context) {
  const {
    query: { response },
  } = context;
  const getDetails = await GetQuotation(response);

  if (getDetails?.data?.length > 0) {
    return {
      props: {
        client_object: getDetails?.data[0],
      },
    };
  }

  return {
    props: {
      client_object: {},
    },
  };
}

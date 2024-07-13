import React from 'react';
import ProposalPage from 'containers/ProposalPage';
import { GetQuotation } from 'helper/api';

const ReturnPage = ({ client_object }) => {
  return (
    <div>
      <ProposalPage data={client_object} />
    </div>
  );
};

export default ReturnPage;

export async function getServerSideProps(context) {
  const {
    query: { details },
  } = context;
  const getDetails = await GetQuotation(details);

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

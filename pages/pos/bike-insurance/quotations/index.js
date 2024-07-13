import QuotationsPage from 'containers/QuotationsPage/QuotationsPage';
import { GetTwPremiumQuotes, GetQuotation } from 'helper/api';

const TwoWheelerQuotation = ({ response, clientObj }) => {
  return (
    <div>
      <QuotationsPage props={response} clientRes={clientObj} path="pos" />
    </div>
  );
};

export default TwoWheelerQuotation;

export async function getServerSideProps(context) {
  const {
    query: { quotationsId },
  } = context;
  const getDetails = await GetQuotation(quotationsId);

  if (getDetails?.data?.length > 0) {
    const response = await GetTwPremiumQuotes(getDetails?.data[0].client_object);
    return {
      props: {
        response,
        clientObj: getDetails?.data[0].client_object,
      },
    };
  }
  return {
    props: {
      response: {},
      clientObj: {},
    },
  };
}

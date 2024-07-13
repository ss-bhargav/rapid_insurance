import QuotationsPage from 'containers/QuotationsPage/QuotationsPage';
// import { DecryptObject } from 'helper/hashing';
import { GetPcPremiumQuotes, GetQuotation } from 'helper/api';


const index = ({ response, clientObj }) => {
  return <QuotationsPage props={response} clientRes={clientObj} />;
};

export default index;

export async function getServerSideProps(context) {
  const {
    query: { quotationsId },
  } = context;
  const getDetails = await GetQuotation(quotationsId);
  if (Object.values(getDetails?.data[0]?.client_object).length > 0) {
    const response = await GetPcPremiumQuotes(getDetails?.data[0].client_object);
    return {
      props: {
        response,
        clientObj: getDetails?.data[0].client_object,
      },
    };
  }
}

import QuotationsPage from 'containers/QuotationsPage/QuotationsPage';
import { GetTwPremiumQuotes, GetQuotation } from 'helper/api';

const TwoWheelerQuotation = ({ response, clientObj, quotationsId }) => {
  return (
    <div>
      <QuotationsPage props={response} clientRes={clientObj} quotationId={quotationsId}/>
    </div>
  );
};

export default TwoWheelerQuotation;

// export async function getServerSideProps(context) {
//   const { query: { quotationsId } } = context;
  
//   return { 
//     props : { 
//       quotationsId: quotationsId
//     }
//   }
// }

export async function getServerSideProps(context) {
  const { query: { quotationsId } } = context;
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

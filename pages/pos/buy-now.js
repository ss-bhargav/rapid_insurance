import BikeBuyNow from 'containers/BuyNowPage';
import { GetQuotation } from 'helper/api';

const BikeInsurancePage = ({ data }) => {
  return <BikeBuyNow defaultValue={data} path="pos" />;
};

export default BikeInsurancePage;

export async function getServerSideProps(context) {
  const {
    query: { details },
  } = context;
  const jsonObject = await GetQuotation(details);

  return {
    props: {
      data: jsonObject?.data[0]?.client_object,
    },
  };
}

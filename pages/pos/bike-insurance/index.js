import RouteAnimation from 'components/RouteAnimation/RouteAnimation';
import BikeInsurancePage from 'containers/BikeInsurancePage';

const BikeInsurance = () => {
  return (
    <RouteAnimation>
      <BikeInsurancePage path="pos" />
    </RouteAnimation>
  );
};

export default BikeInsurance;

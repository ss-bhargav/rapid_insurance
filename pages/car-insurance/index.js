import RouteAnimation from 'components/RouteAnimation/RouteAnimation';
import CarInsurance from '../../containers/CarInsurancePage';
import { withRouter } from 'next/router';

const CarInsurancePage = () => {
  return (
    <RouteAnimation>
      <CarInsurance />
    </RouteAnimation>
  );
};

export default CarInsurancePage;

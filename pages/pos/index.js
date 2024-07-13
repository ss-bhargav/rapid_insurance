import RouteAnimation from 'components/RouteAnimation/RouteAnimation';
import HomePage from 'containers/HomePage';
import Cookies from 'js-cookie';

const index = () => {
  return (
    <RouteAnimation>
      <HomePage path="pos" />
    </RouteAnimation>
  );
};

export default index;

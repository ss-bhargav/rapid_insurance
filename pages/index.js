import RouteAnimation from "../components/RouteAnimation/RouteAnimation";
import HomePage from "../containers/HomePage";
import PropTypes from "prop-types";

const Home = ({ responseObj }) => {
  return (
    <RouteAnimation>
      <HomePage responseObj={responseObj} />
    </RouteAnimation>
  )
}

Home.prototype = {
  responseObj: PropTypes.object,
}

export async function getStaticProps(context) {
  return {
    props: {
      pageType : "HomePage"
    }
  }
}
export default Home;


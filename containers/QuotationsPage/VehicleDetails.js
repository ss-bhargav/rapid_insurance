import styles from './VehicleDetails.module.scss';
const VehicleDetails = ({ crn = '1234566', data, minMaxValues, query }) => {
  console.log('query', data);
  return (
    <>
      <div className={`${styles.vehicle_details} col-12 col-lg-12 text-center d-md-flex`}>
        <h6>CRN : {crn}</h6>
        <h6>Vehicle : {data?.c_make_model}</h6>
        <h6>RTO:{data?.c_place_of_registration}</h6>
        <h6>NCB: {data?.c_ncb}%</h6>
        <h6>{/* Premium: {`${minMaxValues[0]?.s_net_premium}`} - {`${minMaxValues[minMaxValues.length - 1]?.s_net_premium}`} */}</h6>
      </div>
    </>
  );
};

export default VehicleDetails;

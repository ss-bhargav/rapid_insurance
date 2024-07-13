import { formatMoney } from 'helper/formatMoney';
import styles from './QuatationPremiumDetails.module.scss';
const QuatationPremiumDetails = (details) => {
  const addonsPremium = ['s_pa_unnamed_passenger_premium', 's_electrical_accessories_premium', 's_legal_liability_pd_premium', 's_loss_accessories_premium', 's_non_electrical_accessories_premium', 's_pa_cover_owner_driver_premium', 's_pa_unnamed_passenger_premium', 's_side_car_premium'];

  let addons = {};
  Object.keys(details.details).filter((premium) => {
    if (details.details[premium] > 0 && addonsPremium.includes(premium)) {
      console.log('pre', premium);
      addons[premium.split('_').slice(1, premium.split('_').length - 1)] = details.details[premium];
    }
  });

  return (
    <>
      <div className={styles.detailsItem}>
        <p className={styles.key1}>Plan Name</p>
        <p className={styles.value1}>{details.details.s_plan_name}</p>
      </div>
      <div className={styles.detailsItem}>
        <p className={styles.key1}>Bike Model</p>
        <p className={styles.value1}>{details.details.s_make_model_details}</p>
      </div>
      <div className={styles.detailsItem}>
        <p className={styles.key1}>RTO</p>
        <p className={styles.value1}>{details.details.s_rto_details}</p>
      </div>
      <div className={styles.detailsItem}>
        <p className={styles.key1}>IDV</p>
        <p className={styles.value1}>{formatMoney(details.details.s_idv)}</p>
      </div>
      <div className={styles.detailsItem}>
        <p className={styles.key1}>CRN</p>
        <p className={styles.value1}></p>
      </div>
      <hr />
      <div>
        <div className={styles.premiumCheckout}>
          <p className={styles.key} style={{ fontWeight: '700' }}>
            Own damage premium (A)
          </p>
          <p className={styles.value}>
            &#8377;&nbsp;
            {parseInt(Math.round(details.details.s_basic_od_premium)) - parseInt(Math.round(details.details.s_ncb_amount))}
          </p>
          <p className={styles.key} style={{ fontWeight: '700' }}>
            Third Party Premium (B)
          </p>
          <p className={styles.value}>
            &#8377;&nbsp;
            {Math.round(details.details.s_basic_tp_premium)}
          </p>
        </div>
        <div className={styles.premiumCheckout}>
          <p className={styles.key}>Basic OD</p>
          <p className={styles.value}>&#8377;&nbsp;{Math.round(details.details.s_basic_od_premium)}</p>
          <p className={styles.key}>Basic 3rd Party Premium</p>
          <p className={styles.value}>&#8377;&nbsp;{Math.round(details.details.s_basic_tp_premium)}</p>
        </div>
        <div className={styles.premiumCheckout}>
          <p className={styles.key}>No Claim Bonus</p>
          <p className={styles.value}>&#8377;&nbsp;{Math.round(details.details.s_ncb_amount)}</p>
          <p className={styles.key}></p>
          <p className={styles.value}></p>
        </div>
        {Object.keys(addons).length > 0 ? (
          <>
            <div style={{ backgroundColor: '#e7e7e7', padding: '3px 0px', textAlign: 'center' }}>
              <h6 className="">Addons</h6>
            </div>
            <div className={styles.premiumCheckout}>
              {Object.keys(addons).map((obj, index) => {
                return (
                  <>
                    <p className={`text-capitalize ${styles.key}`}>{obj.replaceAll(',', ' ')}</p>
                    <p className={styles.value}>&#8377;&nbsp;{Math.round(addons[obj])}</p>
                  </>
                );
              })}
            </div>
            <hr className="p-0 m-0" />
          </>
        ) : null}
        <div className={styles.premiumCheckout}>
          <p className={styles.key}></p>
          <p className={styles.value}></p>
          <p className={styles.key}>Net Premium</p>
          <p className={styles.value}>&#8377;&nbsp;{formatMoney(Math.round(parseInt(details.details.s_net_premium)))}</p>
        </div>
        <div className={styles.premiumCheckout}>
          <p className={styles.key}></p>
          <p className={styles.value}></p>
          <p className={styles.key}>GST/Service Tax {details.details.s_gst_percent}% :</p>
          <p className={styles.value}>&#8377;&nbsp;{formatMoney(Math.round(details.details.s_gst_amount))}</p>
        </div>
        <div className={styles.premiumCheckout}>
          <p className={styles.key}></p>
          <p className={styles.value}></p>
          <p className={styles.key}>Total Premium</p>
          <p className={styles.value}>&#8377;&nbsp;{formatMoney(Math.round(parseInt(details.details.s_total_premium)))}</p>
        </div>
      </div>
    </>
  );
};

export default QuatationPremiumDetails;

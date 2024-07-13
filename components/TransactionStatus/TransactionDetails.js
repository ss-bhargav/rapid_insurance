import { formatMoney } from 'helper/formatMoney';
import styles from './TransactionDetails.module.scss';

const TransactionDetails = ({ details }) => {
  return (
    <>
      <div className={styles.transactionDetails}>
        <div className={styles.transactionDetail}>
          <p className={styles.transactionKey}>Plan Name</p>
          <p className="h6 text-primary">{details.companyName}</p>
        </div>
        <div className={styles.transactionDetail}>
          <p className={styles.transactionKey}>Transaction ID</p>
          <p className="h6 text-primary">{details.transaction_id}</p>
        </div>
        <div className={styles.transactionDetail}>
          <p className={styles.transactionKey}>Bike Model</p>
          <p className="h6 text-primary">{details.bikeModel}</p>
        </div>
        <div className={styles.transactionDetail}>
          <p className={styles.transactionKey}>RTO</p>
          <p className="h6 text-primary">{details.rto}</p>
        </div>
        <div className={styles.transactionDetail}>
          <p className={styles.transactionKey}>IDV</p>
          <p className="h6 text-primary">{formatMoney(details.idv)}</p>
        </div>
        <div className={styles.transactionDetail}>
          <p className={styles.transactionKey}>CRN</p>
          <p className="h6 text-primary">{details.crn}</p>
        </div>
      </div>
      <hr />
      <div className={styles.transactionAmount}>
        <div className={styles.transactionAmountItem}>
          <p className="h6">Own damage premium (A)</p>
          <p>&#8377;&nbsp;{formatMoney(Math.round(details.basic_od - details.ncb_discount))}</p>
        </div>
        <div className={styles.transactionAmountItem}>
          <p className="h6">Third Party premium (B)</p>
          <p>&#8377;&nbsp;{formatMoney(Math.round(details.third_party_premium))}</p>
        </div>
        <div className={styles.transactionAmountItem}>
          <p>Basic OD</p>
          <p>&#8377;&nbsp;{formatMoney(Math.round(details.basic_od))}</p>
        </div>
        <div className={styles.transactionAmountItem}>
          {/* <p>GST Amount</p>
          <p>&nbsp;&nbsp;{details.gst_amount}</p> */}
        </div>
        <div className={styles.transactionAmountItem}>
          <p>No Claim Bonus</p>
          <p>&#8377;&nbsp;{formatMoney(Math.round(details.ncb_discount))}</p>
        </div>
        <div style={{ gridColumnStart: 1, gridColumnEnd: 2 }}></div>
        <div style={{ gridColumnStart: 1, gridColumnEnd: 3 }}>
          <hr />
        </div>
        <div style={{ gridColumnStart: 2, gridColumnEnd: 3 }}>
          <div className={styles.transactionAmountItem}>
            <p>Net Premium</p>
            <p>&#8377;&nbsp;{formatMoney(Math.round(details.net_premium))}</p>
          </div>
          <div className={styles.transactionAmountItem}>
            <p>GST Amount</p>
            <p>&#8377;&nbsp;{formatMoney(Math.round(details.gst_amount))}</p>
          </div>
          <div className={styles.transactionAmountItem}>
            <p>Total Premium</p>
            <p>&#8377;&nbsp;{formatMoney(Math.round(details.total_premium))}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionDetails;

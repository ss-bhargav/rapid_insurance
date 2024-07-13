import styles from './TransactionDetails.module.scss';
import { motion } from 'framer-motion';
import { FcCancel } from 'react-icons/fc';
import TransactionDetails from './TransactionDetails';
const transactionAlertsVariants = {
  hidden: {
    opacity: 0,
    x: -500,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.2,
      duration: 5,
      type: 'spring',
      stiffness: 30,
    },
  },
};
const TransactionFailedPage = () => {
  const details = {
    companyName: 'HDFC General Insurance co Ltd',
    serviceLogId: 1234567,
    bikeModel: 'ROYAL ENFIELD CLASSIC',
    rto: 'Karimnagar',
    idv: 52395,
    crn: 5458303,
    od: 349,
    thirdPartyPremium: 985,
  };
  return (
    <motion.div
      className={styles.successPageWrapper}
      variants={transactionAlertsVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.successMsgWrapper}>
        <h1 className={styles.successIcon}>
          <FcCancel size="1em" color="red" />
        </h1>
        <h2 className="text-danger p-2" style={{ textAlign: 'center' }}>
          Transaction Failed
        </h2>
        <TransactionDetails details={details} />
      </div>
    </motion.div>
  );
};

export default TransactionFailedPage;

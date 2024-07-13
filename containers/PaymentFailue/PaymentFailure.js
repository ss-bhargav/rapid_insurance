
import styles from './PaymentFailure.module.scss';
import trainSvg from "../../public/failure-page-train-crash.svg";
import Image from 'next/image';

const PaymentFailurePage = () => {


     return (
          <div className={styles.payment_failure}>
               <div className={styles.banner_content}>
                    <h1>Transaction Failure</h1>
               </div>
               <div className={styles.banner_image}>
                    <div style={{ height: 'auto', width: '500px' }}>
                         <Image src={trainSvg} />
                    </div>
               </div>
          </div>
     )
}


export default PaymentFailurePage;
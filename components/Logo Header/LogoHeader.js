import Image from "next/image";
import styles from './LogoHeader.module.scss';
import Link from "next/link";


const LogoHeader = () => {
    return (
        <div className={styles.logoHeader}>
            <div className={styles.logo}>
                <Link href="/">
                    <a>
                        <Image src="/logo.png" alt='LMV IB Logo' width='150' height='80' />
                    </a>
                </Link>
            </div>
        </div>
    )
}

export default LogoHeader

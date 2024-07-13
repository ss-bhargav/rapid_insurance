import { useRouter } from "next/router";
import styles from './footer.module.scss';
import Link from "next/link";

const Footer = () => {
    const router = useRouter();


    return (
        <footer className={styles.footer}>
            <div className={styles.links}>
                <div className={styles.insurance}>
                    <h5>Insurance</h5>
                    <ul>
                        <li>
                            <Link href="/">
                                <a>Car Insurance</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/">
                                <a>Bike Insurance</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/">
                                <a>Health Insurance</a>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className={styles.tools}>
                    <h5>Tools</h5>
                    <ul>
                        <li>
                            <Link href="/">
                                <a>FAQ Page</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/">
                                <a>Compare Quotes</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/">
                                <a>Get Quotes</a>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className={styles.myAccount}>
                    <h5>My Accounts</h5>
                    <ul>
                        <li>
                            <Link href="/">
                                <a>Account dashboard</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/">
                                <a>File a claim</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/">
                                <a>Take a claim</a>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={styles.connect}>
                <form>
                    <div>
                        <label htmlFor="email">Stay Connected</label>
                        <br />
                        <input name="email" />
                    </div>
                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </footer>
    )
}

export default Footer;
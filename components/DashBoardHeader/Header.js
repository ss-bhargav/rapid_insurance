import { MdNotifications } from 'react-icons/md';
import Image from 'next/image';
import Avatar from 'public/avatar.png';
import Link from 'next/link';
import styles from './header.module.scss';

const DashBoardHeader = () => {
  const obj = {
    name: 'Ravi',
    email: 'saikumar@gmail.com',
    location: 'hyderabad',
    contact: 9848913140,
  };
  return (
    <>
      <header>
        <div className={styles.header}>
          <div>
            <Link href="/pos">
              <a>
                <Image src="/lmv_logo1.svg" alt="LMV IB Logo" width="240" height="70" />
              </a>
            </Link>
          </div>
          <div className="mr-md-3">
            <MdNotifications size="1.5em" role="button" />
            &nbsp;
            <button type="button" className="btn btn-primary">
              Logout
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default DashBoardHeader;
{
}

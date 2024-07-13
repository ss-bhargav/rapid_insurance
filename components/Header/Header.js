import { useRouter } from 'next/router';
import Image from 'next/image';
import logo from '../../public/logo.png';
import classnames from 'classnames';
import styles from './header.module.scss';
import Link from 'next/link';
import { AiOutlineMenu } from 'react-icons/ai';
import { useState } from 'react';
import Logo from '../../public/Logo.svg';
import Popper from 'components/Dailog/popper';

const Header = ({ handler }) => {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);

  const menuHandler = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <>
      <header className={styles.header}>
        <div className="py-1 row">
          <div>
            <Link href="/">
              <a>
                <Image src="/lmv_logo1.svg" alt="LMV IB Logo" width="240" height="70" />
              </a>
            </Link>
          </div>
          <div className="ml-2 d-none d-lg-block">
            <h6 className="text-danger underline pt-4">Beta Version</h6>
          </div>
        </div>
        <div className={`${styles.mobileMenuBar} ${openMenu ? styles.openMenu : styles.closeMenu}`}>
          <div className={styles.mobileIconDiv} onClick={menuHandler}>
            <AiOutlineMenu />
          </div>
        </div>
        <div className={styles.menu}>
          <ul>
            <li>
              <Link href="/about-us">
                <a>About Us</a>
              </Link>
            </li>
            <li>
              <Link href="/contact-us">
                <a>Contact Us</a>
              </Link>
            </li>
            <li>
              <Link href="/blog">
                <a>Blog</a>
              </Link>
            </li>
            <li>
              <Link href="/sign-in">
                <a>Sign In</a>
              </Link>
            </li>
            <li>
              <Link href="/sign-up">
                <a>Sign Up</a>
              </Link>
            </li>
            <li role="button" id="header_popper">
              <a>POS</a>
              <Popper />
            </li>
          </ul>
        </div>
      </header>
    </>
  );
};

export default Header;

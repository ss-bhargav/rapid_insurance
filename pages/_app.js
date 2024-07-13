import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.css';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Head from 'next/head';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import Popper from 'components/Dailog/popper';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DashBoardHeader from 'components/DashBoardHeader/Header';
import HeaderProfile from 'components/DashBoardHeader/HeaderProfile';
import SideNav from 'components/DashBoardHeader/SideNav';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();

  const path = router.pathname.split('/');
  if (Component.getLayout) {
    return Component.getLayout(<Component {...pageProps} />);
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: '#1B75BA',
      },
    },
  });

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {path[1] === 'pos' ? <DashBoardHeader /> : <Header />}
      <ThemeProvider theme={theme}>
        {path[1] === 'pos' ? (
          <main style={{ marginTop: '85px' }}>
            <div className="row m-0 p-0">
              <div className="col-12 col-lg-2 m-0 p-0">
                <SideNav />
              </div>
              <div className="col-12 col-lg-10 p-0">
                <HeaderProfile />
                <Component {...pageProps} />
              </div>
            </div>
          </main>
        ) : (
          <main style={{ marginTop: '85px' }}>
            <Component {...pageProps} />
          </main>
        )}
        {/* <Footer /> */}
      </ThemeProvider>
    </>
  );
};

export default MyApp;

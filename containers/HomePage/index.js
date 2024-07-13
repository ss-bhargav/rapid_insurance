import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { withRouter } from 'next/router';
import { productItems, posProductItems } from 'helper/constants';
import Reports from 'containers/POS/PosReports/reports';

const HomePage = ({ path }) => {
  let items = [];
  if (path === 'pos') {
    items = posProductItems;
  } else {
    items = productItems;
  }
  return (
    <div className="container">
      <div className="text-center">
        <h3 className="py-3 py-lg-5">OUR PRODUCTS</h3>
      </div>
      <div className="d-md-flex flex-wrap justify-items-evenly">
        {items.map((product, index) => {
          return (
            <div className="col-12 col-md-4 text-center" key={product.about}>
              <Link href={`${product.link}`}>
                <a>
                  <Image src={product.image} alt="Bike Insurance" width="300" height="200" />
                  <p>{product.about}</p>
                </a>
              </Link>
            </div>
          );
        })}
      </div>
      {path === 'pos' ? (
        <>
          <div className="text-center">
            <h3>Reports</h3>
          </div>
          <Reports />
          <div className="text-center">
            <h6>Policy Reports</h6>
          </div>
          <Reports />
          <div className="text-center mt-3">
            <h6>Monthly Graphs</h6>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default withRouter(HomePage);

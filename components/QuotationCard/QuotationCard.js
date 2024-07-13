import React, { useEffect } from 'react';
import styles from './QuotationCard.module.scss';
import Image from 'next/image';
import { Button, Divider, Switch } from '@mui/material';
import { formatMoney } from 'helper/formatMoney';
import Badge from 'helper/badge';

const QuotationCard = ({ data, onSubmitHandler, handler, showAddons }) => {
  const displayAddonsPremium = (data) => {
    const filteredData = {};
    const filterAddons = ['s_pa_cover_owner_driver_premium', 's_electrical_accessories_premium', 's_non_electrical_accessories_premium', 's_legal_liability_pd_premium', 's_loss_accessories_premium', 's_pa_unnamed_passenger_premium', 's_side_car_premium', 's_anti_theif_premium', 's_lpg_cng_kit_premium', 's_limit_tppd_premium'];
    Object.keys(data).filter((addons) => {
      let filteredPremium = data[addons];
      if (filterAddons.includes(addons)) {
        if (filteredPremium > 0) {
          filteredData[addons] = filteredPremium;
        }
      }
    });
    return filteredData;
  };

  return (
    <div className={styles?.quotation_card}>
      <div className={styles?.logo_section}>
        <div className={styles?.logo}>
          <Image src={`/${data?.s_company_name}.png`} alt={data?.s_company_name} width={160} height={80} />
        </div>
      </div>
      <div className={styles.addons_section}>
        <p className={styles.idv}>
          IDV: <b>{formatMoney(data?.s_idv)}</b>
        </p>
        <p className={styles.addons}>Addons</p>
        <div className={styles.premium_badges}>
          {data && Object.keys(data).length > 0
            ? Object.keys(displayAddonsPremium(data)).map((value, index) => {
                return <Badge key={index} text={value.replaceAll('_', ' ').slice(1).replaceAll('premium', '')} value={Math.round(data[value]).toFixed(2)} />;
              })
            : null}
        </div>
      </div>
      <div className={styles.premium}>
        <Button variant="contained" size="small" onClick={(e) => onSubmitHandler(data)}>
          &#8377;{data?.s_net_premium}
        </Button>
        <p className={styles.gst}>&#8377;{formatMoney(Math.round(data?.s_gst_amount))} with GST</p>
        <Button variant="outlined" size="small" onClick={(data) => handler()}>
          More Info
        </Button>
      </div>
    </div>
  );
};

export default QuotationCard;

import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import styles from './Dailog.module.scss';
import { DialogContent } from '@mui/material';
import { FcViewDetails } from 'react-icons/fc';
import { ImCross } from 'react-icons/im';

const SummaryDetails = ({ data, handler }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={styles.full_screen_loading}>
      <Dialog open={true} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent className="p-0">
          <div className={styles.quotaionDetailsWrapper}>
            <div className={styles.quotationHeader}>
              <div className="d-flex justify-content-between align-items-baseline px-2">
                <h6>
                  <FcViewDetails size="1.5em" />
                  &nbsp; Details
                </h6>
                <div className={styles.closeDialog}>
                  <ImCross size="0.9em" title="close" onClick={handler} />
                </div>
              </div>
            </div>
            <div className={styles.details}>
              <div className={styles.details_list}>
                <p className={styles.details_list_key}>Vehicle</p>
                <p>:</p>
                <p className={styles.details_list_value}>
                  {data?.c_make},&nbsp;{data?.c_model},&nbsp;{data?.c_variant}
                </p>
              </div>
              <div className={styles.details_list}>
                <p className={styles.details_list_key}>Fuel&nbsp;Type</p>
                <p>:</p>
                <p className={styles.details_list_value}>{data?.c_fuel_type}</p>
              </div>
              <div className={styles.details_list}>
                <p className={styles.details_list_key}>Vehicle&nbsp;Registration&nbsp;Type</p>
                <p>:</p>
                <p className={styles.details_list_value}>{data?.c_customer_type === 'I' ? 'Individual' : 'Company'}</p>
              </div>
              <div className={styles.details_list}>
                <p className={styles.details_list_key}>Plan&nbsp;Type</p>
                <p>:</p>
                <p className={styles.details_list_value}>{data?.c_plan}</p>
              </div>
              <div className={styles.details_list}>
                <p className={styles.details_list_key}>Registration&nbsp;Date</p>
                <p>:</p>
                <p className={styles.details_list_value}>{new Date(data?.c_registration_date).toLocaleDateString('en-GB')}</p>
              </div>
              <div className={styles.details_list}>
                <p className={styles.details_list_key}>Manufacturing&nbsp;Date</p>
                <p>:</p>
                <p className={styles.details_list_value}>{new Date(data?.c_manufacture_year_month).toLocaleDateString('en-GB')}</p>
              </div>
              <div className={styles.details_list}>
                <p className={styles.details_list_key}>Vehicle&nbsp;Insurer&nbsp;Type</p>
                <p>:</p>
                <p className={styles.details_list_value}>{data?.c_rollover === true ? 'Renew' : 'New'}</p>
              </div>
              <div className={styles.details_list}>
                <p className={styles.details_list_key}>RTO</p>
                <p>:</p>
                <p className={styles.details_list_value}>{data?.c_place_of_registration.replace(' ', ', ')}</p>
              </div>
              <div className={styles.details_list}>
                <p className={styles.details_list_key}>Name</p>
                <p>:</p>
                <p className={styles.details_list_value}>{data?.c_full_name}</p>
              </div>
              <div className={styles.details_list}>
                <p className={styles.details_list_key}>Mobile</p>
                <p>:</p>
                <p className={styles.details_list_value}>{data?.c_mobile}</p>
              </div>
              <div className={styles.details_list}>
                <p className={styles.details_list_key}>Email</p>
                <p>:</p>
                <p className={styles.details_list_value}>{data?.c_email}</p>
              </div>
              <div className={styles.details_list}>
                <p className={styles.details_list_key}>Previous&nbsp;Insurer&nbsp;Name</p>
                <p>:</p>
                <p className={styles.details_list_value}>{data?.c_prev_insurer}</p>
              </div>
              <div className={styles.details_list}>
                <p className={styles.details_list_key}>Previous&nbsp;Policy&nbsp;Expire&nbsp;Date</p>
                <p>:</p>
                <p className={styles.details_list_value}>{new Date(data?.c_prev_policy_expire_date).toLocaleDateString('en-GB')}</p>
              </div>
              <div className={styles.details_list}>
                <p className={styles.details_list_key}>Claimed&nbsp;in&nbsp;past&nbsp;year</p>
                <p>:</p>
                <p className={styles.details_list_value}>{data?.c_claim_last_year === false ? 'No' : 'Yes'}</p>
              </div>
              <div className={styles.details_list}>
                <p className={styles.details_list_key}>Previous&nbsp;No&nbsp;Claim&nbsp;Bonus(NCB)</p>
                <p>:</p>
                <p className={styles.details_list_value}>{data?.c_ncb}&#37;</p>
              </div>
            </div>
            <div className="text-center mt-2 pb-2">
              <Button type="submit" variant="contained" color="primary" size="small" onClick={handler}>
                ok
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SummaryDetails;

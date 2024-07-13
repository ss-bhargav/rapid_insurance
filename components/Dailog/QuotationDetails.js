import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { CircularProgress } from '@mui/material';
import styles from './Dailog.module.scss';
import { DialogContent } from '@mui/material';
import { ImCross } from 'react-icons/im';
import QuatationPremiumDetails from 'containers/QuotationsPage/QuatationPremiumDetails';

const QuotationDetails = ({ data, handleClose }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <div className={styles.full_screen_loading}>
      <Dialog open={true} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent className="p-0">
          <div className={styles.quotaionDetailsWrapper}>
            <div className={styles.quotationHeader}>
              <div className="d-flex justify-content-between px-2">
                <h6>Premium Details</h6>
                <div className={styles.closeDialog}>
                  <ImCross size="0.8em" title="close" onClick={handleClose} />
                </div>
              </div>
            </div>
            <QuatationPremiumDetails details={data} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuotationDetails;

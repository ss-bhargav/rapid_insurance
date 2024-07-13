import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { CircularProgress } from '@mui/material';
import styles from './Dailog.module.scss'
import { DialogContent } from '@mui/material';


export default function FullScreenLoading() {
     const [open, setOpen] = React.useState(false);

     const handleClickOpen = () => {
          setOpen(true);
     };

     const handleClose = () => {
          setOpen(false);
     };

     return (
          <div className={styles.full_screen_loading}>
               <Dialog
                    open={true}
                    onClose={(event, reason) => {
                         if (reason !== 'backdropClick') {
                              handleClose()
                         }
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
               >
                    <DialogContent>
                         <div className={styles.loading_div}>
                              <CircularProgress />
                         </div>
                    </DialogContent>
               </Dialog>
          </div>
     );
}

import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { CircularProgress } from '@mui/material';
// import styles from './Dailog.module.scss';
import { DialogContent } from '@mui/material';
import { FiAlertCircle } from 'react-icons/fi';
import { ImCross } from 'react-icons/im';
import { fadeIn, routeAnimation } from '../../helper/animation';
import { motion } from 'framer-motion';

const Errors = ({ data, handleClose }) => {
  const [open, setOpen] = React.useState(false);
  const [errArr, setErrArr] = React.useState([...data]);
  let newArr = [];
  errArr.map((obj, index) => {
    if (obj.error === true) {
      newArr.push(obj);
    }
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <Dialog open={true} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent className="p-0">
          <div className="py-2 px-1 m-0 text-white d-flex justify-content-between align-items-baseline" style={{ backgroundColor: '#f44336' }}>
            <h5>
              <FiAlertCircle size="1.2em" />
              &nbsp;Alert
            </h5>
            <ImCross style={{ cursor: 'pointer' }} size="0.9em" onClick={handleClose} />
          </div>
          {newArr.map((obj, index) => {
            return (
              <>
                <p style={{ height: 'auto', padding: '10px 20px', margin: '0px' }}>
                  <span className="text-danger h6 text-uppercase">{obj.company}</span> : <span className="h6 text-black">{obj?.data || obj?.message}.</span>
                </p>
              </>
            );
          })}
          <div className="text-center pb-2">
            <Button type="submit" variant="contained" color="error" size="small" onClick={handleClose}>
              ok
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Errors;

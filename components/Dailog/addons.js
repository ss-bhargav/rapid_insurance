import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { DialogContent } from '@mui/material';
import styles from './Dailog.module.scss';
import { ImCross } from 'react-icons/im';
import { RadioButton } from 'helper/radioButton';
import Input from 'helper/inputBox';
import { options, unNamedPassengers, voluntryExcess } from 'helper/constants';
import { motion } from 'framer-motion';

const transactionAlertsVariants = {
  hidden: {
    opacity: 0,
    transition: {
      delay: 0.2,
      duration: 5,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.2,
      duration: 5,
      type: 'spring',
      stiffness: 30,
    },
  },
};

const Addons = ({ data, handler, closeDialogHandler, submitHandler, resetHandler, IDV }) => {
  const [open, setOpen] = React.useState(false);
  const [idv, setIDV] = React.useState(IDV);

  let minMaxIDV, minIDV, maxIDV;

  if (IDV) {
    minMaxIDV = Math.round(idv * 0.1);
    minIDV = IDV - minMaxIDV;
    maxIDV = IDV + minMaxIDV;
  }

  const onChangeHandler = (value, name) => {
    handler(value, name);
  };
  const onSubmitHandler = (e) => {
    submitHandler(e);
  };

  return (
    <motion.div variants={transactionAlertsVariants} initial="hidden" animate="visible">
      <Dialog open={true} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent>
          <div>
            {' '}
            <div className={styles.closeIcon} onClick={closeDialogHandler}>
              <ImCross title="close" size="0.9em" />
            </div>
            <form method="post" onSubmit={onSubmitHandler}>
              <Input type="numberc_anti_theifdv" label="Request IDV" handler={onChangeHandler} values={data} min={IDV > 0 ? minIDV : 0} max={IDV > 0 ? maxIDV : 0} />
              <RadioButton name="c_pa_cover_owner_driver" options={options} values={data} handler={onChangeHandler} label="Personal Accident Cover for owner driver" />
              {/* <RadioButton name="c_limit_tp_damage" options={options} values={data} handler={onChangeHandler} label="Do you want to limit the third party damage up to 6000 ?" /> */}
              <RadioButton name="c_pa_unnamed_passenger" options={unNamedPassengers} values={data} handler={onChangeHandler} label="Un-Named Passenger" />
              <RadioButton name="c_legal_liability_pd" options={options} values={data} handler={onChangeHandler} label="Liability to paid driver" />
              <div className="d-flex justify-content-between">
                {/* <Input type="number" name="c_electrical_accessories" label="Electrical Accessories" handler={onChangeHandler} values={data}  min="5000" max="50000"/> */}
                <Input type="number" name="c_non_electrical_accessories" label="Non Electrical Accessories" handler={onChangeHandler} values={data} min="5000" max="50000" />
              </div>
              {/* <RadioButton name="c_anti_theif_device" options={options} values={data} handler={onChangeHandler} label="Anti Theif Device" />
              <RadioButton name="c_voluntary_excess" options={voluntryExcess} values={data} handler={onChangeHandler} label="Voluntry Excess" /> */}
              <div className="text-center mr-3">
                <Button type="submit" variant="contained" color="warning" size="small">
                  Re-calculate
                </Button>
                &nbsp;
                <Button type="reset" onClick={() => resetHandler()} variant="contained" size="small">
                  Reset
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Addons;

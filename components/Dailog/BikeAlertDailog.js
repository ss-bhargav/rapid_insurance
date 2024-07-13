import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import styles from './Dailog.module.scss';
import { CircularProgress } from '@mui/material';
import { useState } from 'react';




const BikeAlertDialog = ({ closeHandler, state, data, }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const vehicleDetailsObj = {
    manufacturer: "",
    manufacturer_code: "",
    model: "",
    model_code: "",
  }
  const [vehicleDetails, setVehicleDetails] = useState(vehicleDetailsObj);
  const [isLoading, setIsLoading] = useState(false);
  const [vechileData, setVehicleData] = useState(data)
  const manufacturerHandler = (value) => {
    setIsLoading(true);
  }

  return (
    <div>
      <Dialog
        // fullScreen={fullScreen}
        open={state}
        onClose={closeHandler}
        aria-labelledby="responsive-dialog-title"
        maxWidth="sm"
      >
        <DialogTitle id="responsive-dialog-title">

        </DialogTitle>
        <DialogContent>
          <div className={styles.loading}>
            {
              isLoading ? <CircularProgress /> : <Vehiclemanufacturers data={vechileData} selectHandler={manufacturerHandler} />
            }
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={closeHandler}>
            Cancel
          </Button>
          <Button onClick={closeHandler} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default BikeAlertDialog;


const Vehiclemanufacturers = ({ data = [], selectHandler }) => {

  return (
    <div className={styles.manufacture_wrapper}>
      {
        data.map((vechile) => (<Button onClick={e => selectHandler(vechile)} key={vechile.manufacturer_code} variant="outlined">{vechile.manufacturer}</Button>))
      }
    </div>
  )
}

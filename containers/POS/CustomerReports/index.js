import React, { useState } from 'react';
import Table from '@mui/material/Table';
// import { makeStyles } from '@material-ui/styles';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { SearchBar } from 'components/helper-inputs/BasicInput';

const CustomerReports = () => {
  //   const useStyles = makeStyles({
  //     table: {
  //       minWidth: 650,
  //     },
  //   });
  //   const classes = useStyles();
  const data = [
    { customerName: 'Teja', mobile: 7702577123, email: 'teja@gmail.com', products: 'Bike' },
    { customerName: 'sai', mobile: 7702577124, email: 'sai@gmail.com', products: 'Bike' },
    { customerName: 'surendra', mobile: 7702577435, email: 'surendra@gmail.com', products: 'Car' },
    { customerName: 'Ravi', mobile: 7702578987, email: 'raviteja@gmail.com', products: 'Bike' },
  ];
  const [filteredData, setFilteredData] = useState(data);
  const onChangeSearchHandler = (value, name) => {
    const filteredSearchData = data.filter((customer) => {
      if (/^[A-Za-z]*$/.test(value)) {
        return customer?.customerName?.toLowerCase().includes(value.toLowerCase());
      } else if (/^[0-9]*$/.test(value)) {
        return customer?.mobile.toString()?.includes(value);
      }
    });
    setFilteredData(filteredSearchData);
  };

  const resetFilterHandler = () => {
    setFilteredData(data);
  };

  return (
    <div>
      <h4 className="text-center">Customer Reports</h4>
      <div className="d-flex justify-content-end mb-2">
        <SearchBar handler={onChangeSearchHandler} cancelHandler={resetFilterHandler} />
      </div>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S.no</TableCell>
                <TableCell>Customer&nbsp;Name</TableCell>
                <TableCell>Mobile&nbsp;Number</TableCell>
                <TableCell>Email&nbsp;Address</TableCell>
                <TableCell>Products</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData && filteredData.length > 0 ? (
                filteredData.map((customer, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{index + 1}.</TableCell>
                      <TableCell>{customer.customerName}</TableCell>
                      <TableCell>{customer.mobile}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.products}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No Data Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default CustomerReports;

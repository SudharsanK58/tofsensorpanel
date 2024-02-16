import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


const TxPowerSelect = ({ txPower, handleTxPowerChange }) => {
  return (
    <TableRow>
      <TableCell>
        <Typography variant="subtitle1">Tx Ble Power</Typography>
      </TableCell>
      <TableCell>
        <FormControl sx={{ width: '100%' }}>
          <InputLabel id="tx-power-label">Tx Power</InputLabel>
          <Select
            labelId="tx-power-label"
            id="tx-power-select"
            value={txPower}
            label="Tx Power"
            onChange={handleTxPowerChange}
            sx={{ '&:before': { borderBottom: '1px solid rgba(0, 0, 0, 0.42)' }, '&:after': { borderBottom: '1px solid #1976D2' } }}
          >
            <MenuItem value={-40}>-40</MenuItem>
            <MenuItem value={-20}>-20</MenuItem>
            <MenuItem value={-16}>-16</MenuItem>
            <MenuItem value={-8}>-8</MenuItem>
            <MenuItem value={-4}>-4</MenuItem>
            <MenuItem value={0}>0</MenuItem>
            <MenuItem value={4}>4</MenuItem>
          </Select>
        </FormControl>
      </TableCell>
    </TableRow>
  );
};

const MyComponent = () => {
  const [txPower, setTxPower] = React.useState('');
  const [feet, setFeet] = React.useState('');
  const [bleInterval, setBleInterval] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [deviceId, setDeviceId] = React.useState('');

  const handleDeviceIdChange = (event) => {
    setDeviceId(event.target.value);
  };

  const handleTxPowerChange = (event) => {
    setTxPower(event.target.value);
  };

  const handleFeetChange = (event) => {
    setFeet(event.target.value);
  };

  const handleBleIntervalChange = (event) => {
    setBleInterval(event.target.value);
  };

  const handleUploadClick = async () => {
    // Validate that the input values are not empty
    if (deviceId !== '' && txPower !== '' && feet !== '' && bleInterval !== '') {
      // Validate BLE interval
      const bleIntervalValue = parseInt(bleInterval);
      if (bleIntervalValue < 3) {
        setError('BLE Interval has to be above 3 seconds.');
        return;
      }
      const topic = `${deviceId}/react`;

      // Set loading state
      setLoading(true);

      // Construct message payload
      const message = `TOF#${txPower}#${feet}#${bleInterval * 1000}`;

      // Make POST request to the API
      try {
        const response = await fetch('http://54.89.246.64:8001/publish', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            topic: topic,
            message: message,
          }),
        });

        if (response.ok) {
          console.log('API Call successful');
          // Show success snackbar
          setOpenSnackbar(true);
        } else {
          console.error('API Call failed');
        }
      } catch (error) {
        console.error('Error while making API call', error);
      } finally {
        // Reset loading state
        setLoading(false);
      }

      // Reset error state
      setError('');
    } else {
      // Set error message
      setError('Please fill in all the fields before uploading.');
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={3}>
        TOF Sensor Calibration V1
      </Typography>
      <Paper elevation={3} sx={{ padding: '16px', width: '500px', textAlign: 'center' }}>
        <Table>
          <TableBody>
          <TableRow>
              <TableCell>
                <Typography variant="subtitle1">Device ID</Typography>
              </TableCell>
              <TableCell>
                <TextField label="Device ID" value={deviceId} onChange={handleDeviceIdChange} fullWidth />
              </TableCell>
            </TableRow>
            <TxPowerSelect txPower={txPower} handleTxPowerChange={handleTxPowerChange} />
            <TableRow>
              <TableCell>
                <Typography variant="subtitle1">Validation Feet</Typography>
              </TableCell>
              <TableCell>
                <TextField label="Feet" type="number" value={feet} onChange={handleFeetChange} fullWidth />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle1">Ble Interval</Typography>
              </TableCell>
              <TableCell>
                <TextField
                  label="BLE Interval"
                  type="number"
                  value={bleInterval}
                  onChange={handleBleIntervalChange}
                  fullWidth
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
      {error && (
        <Typography variant="body2" color="red" mt={2}>
          {error}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <FileUploadIcon />}
        sx={{ marginTop: '16px' }}
        onClick={handleUploadClick}
        disabled={loading}
      >
        Upload
      </Button>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert elevation={6} variant="filled" severity="success">
          Device has been updated
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default MyComponent;

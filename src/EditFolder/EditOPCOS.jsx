import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { BACKEND_DOMAIN } from '../api_host';

export default function EditOPCOS({ open, handleClose, tariff, refreshTable }) {
  const [localCall, setLocalCall] = useState('');
  const [rowMin, setRowMin] = useState('');
  const [mtnMin, setMtnMin] = useState('');
  const [backHome, setBackHome] = useState('');
  const [smsMo, setSmsMo] = useState('');
  const [satellite, setSatellite] = useState('');
  const [internationalCalls, setInternationalCalls] = useState('');
  const [receivingCalls, setReceivingCalls] = useState('');
  const [dataPrepaid, setDataPrepaid] = useState('');

  // Pre-fill form fields with existing data from the tariff object when the modal opens
  useEffect(() => {
    if (tariff && open) {
      setLocalCall(tariff.localCallsPrepaid || '');
      setRowMin(tariff.rowCallsPrepaid || '');
      setMtnMin(tariff.mtnCallsPrepaid || '');
      setBackHome(tariff.callbackHomePrepaid || '');
      setSmsMo(tariff.smsPrepaid || '');
      setSatellite(tariff.satellitePrepaid || '');
      setInternationalCalls(tariff.internationalCallsPrepaid || '');
      setReceivingCalls(tariff.receivingCallsPrepaid || '');
      setDataPrepaid(tariff.dataPrepaid || '');
    }
  }, [tariff, open]);

  const handleSubmit = async () => {
    const updatedTariff = {
      country: {
        countryId: tariff.countryId, // Keep the existing country ID
      },
      // callPrepaid: localCall,
      callbackHomePrepaid: backHome,
      smsPrepaid: smsMo,
      localCallsPrepaid: localCall,
      receivingCallsPrepaid: receivingCalls,
    };

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BACKEND_DOMAIN}/api/opco-tariffs/${tariff.opcoTariffId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedTariff)
      });
      const data = await response.json();
      if (data.success) {
        alert('Tariff updated successfully');
        handleClose();
        refreshTable(); // Trigger the table refresh after a successful update
      } else {
        alert('Error updating tariff: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating tariff:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Typography sx={{ whiteSpace: 'nowrap', mb: 2, fontWeight: 700, fontSize: 18 }}>
          Edit Tariffs for {tariff?.countryName}
        </Typography>

        <Box
          sx={{
            mt: 2,
            display: 'grid',
            width: '100%',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gridGap: '10px', // Reduce the gap between fields for better spacing
          }}
        >
          <TextField
            required
            margin="dense"
            id="localcall"
            name="localCall"
            label="Local Call/MIN"
            type="text"
            value={localCall}
            onChange={(e) => setLocalCall(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '0.875rem',
                padding: '8px 10px',
              },
              '& .MuiInputLabel-root': {
                fontSize: '0.875rem',
              },
            }}
          />
          {/* <TextField
            required
            margin="dense"
            id="rowmin"
            name="rowMin"
            label="ROW/MIN"
            type="text"
            value={rowMin}
            onChange={(e) => setRowMin(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '0.875rem',
                padding: '8px 10px',
              },
              '& .MuiInputLabel-root': {
                fontSize: '0.875rem',
              },
            }}
          /> */}
          {/* <TextField
            required
            margin="dense"
            id="mtnmin"
            name="mtnMin"
            label="MTN/MIN"
            type="text"
            value={mtnMin}
            onChange={(e) => setMtnMin(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '0.875rem',
                padding: '8px 10px',
              },
              '& .MuiInputLabel-root': {
                fontSize: '0.875rem',
              },
            }}
          /> */}
          <TextField
            required
            margin="dense"
            id="backhome"
            name="backHome"
            label="Back Home/MIN"
            type="text"
            value={backHome}
            onChange={(e) => setBackHome(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '0.875rem',
                padding: '8px 10px',
              },
              '& .MuiInputLabel-root': {
                fontSize: '0.875rem',
              },
            }}
          />
          <TextField
            required
            margin="dense"
            id="smsmo"
            name="smsMo"
            label="SMS"
            type="text"
            value={smsMo}
            onChange={(e) => setSmsMo(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '0.875rem',
                padding: '8px 10px',
              },
              '& .MuiInputLabel-root': {
                fontSize: '0.875rem',
              },
            }}
          />
          {/* <TextField
            required
            margin="dense"
            id="satellite"
            name="satellite"
            label="SATELLITE"
            type="text"
            value={satellite}
            onChange={(e) => setSatellite(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '0.875rem',
                padding: '8px 10px',
              },
              '& .MuiInputLabel-root': {
                fontSize: '0.875rem',
              },
            }}
          /> */}
          {/* <TextField
            required
            margin="dense"
            id="dataPrepaid"
            name="dataPrepaid"
            label="Data Prepaid"
            type="text"
            value={dataPrepaid}
            onChange={(e) => setDataPrepaid(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '0.875rem',
                padding: '8px 10px',
              },
              '& .MuiInputLabel-root': {
                fontSize: '0.875rem',
              },
            }}
          /> */}
          {/* <TextField
            required
            margin="dense"
            id="international"
            name="international"
            label="International Calls"
            type="text"
            value={internationalCalls}
            onChange={(e) => setInternationalCalls(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '0.875rem',
                padding: '8px 10px',
              },
              '& .MuiInputLabel-root': {
                fontSize: '0.875rem',
              },
            }}
          /> */}
          <TextField
            required
            margin="dense"
            id="receiving"
            name="receiving"
            label="Receiving Calls"
            type="text"
            value={receivingCalls}
            onChange={(e) => setReceivingCalls(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '0.875rem',
                padding: '8px 10px',
              },
              '& .MuiInputLabel-root': {
                fontSize: '0.875rem',
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Update Tariffs</Button>
      </DialogActions>
    </Dialog>
  );
}

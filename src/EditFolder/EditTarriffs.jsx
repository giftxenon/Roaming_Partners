import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { Box, FormControl, Autocomplete } from '@mui/material';
import { BACKEND_DOMAIN } from '../api_host';

export default function EditTariff({ open, handleClose, tariff, onTariffUpdated }) {
  const [selectedPartner, setSelectedPartner] = useState(null); // Store selected partner as an object
  const [partners, setPartners] = useState([]); // Store partner data
  const [localCall, setLocalCall] = useState('');
  const [receivingCalls, setReceivingCalls] = useState('');
  const [backHome, setBackHome] = useState('');
  const [smsMo, setSmsMo] = useState('');

  const tariffId = tariff?.tariffId;

  // Fetch partners when the dialog opens
  useEffect(() => {
    if (open) {
      fetchPartners();
      if (tariff) {
        // Populate form with tariff data
        setLocalCall(tariff.localCallsPrepaid || '');
        setReceivingCalls(tariff.receivingCallsPrepaid || '');
        setBackHome(tariff.callBackHomePrepaid || '');
        setSmsMo(tariff.sendingSmsPrepaid || '');
        setSelectedPartner(tariff.partner); // Pre-select the partner
      }
    }
  }, [open, tariff]);

  const fetchPartners = async () => {
    try {
      const token = localStorage.getItem('accessToken'); // Use token if necessary
      const response = await fetch(`${BACKEND_DOMAIN}/api/partners`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the token if required
        }
      });
      const data = await response.json();
      if (data.success) {
        setPartners(data.data); // Update partners state with the list of partners
      } else {
        console.error('Error fetching partners:', data.message);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  const handlePartnerChange = (event, newValue) => {
    setSelectedPartner(newValue); // Set selected partner object
  };

  const handleSubmit = async () => {
    if (!selectedPartner) {
      alert('Please select a partner.');
      return;
    }

    const updatedTariff = {
      partner: {
        partnerId: selectedPartner.partnerId // Use the selected partner's ID
      },
      country: {
        countryId: tariff?.country?.countryId // Use the existing countryId
      },
      callBackHomePrepaid: backHome,
      localCallsPrepaid: localCall,
      receivingCallsPrepaid: receivingCalls,
      sendingSmsPrepaid: smsMo,
    };

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BACKEND_DOMAIN}/api/tariffs/${tariffId}`, {
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
        onTariffUpdated(); // Refresh the tariff data in the parent component
        handleClose(); // Close the modal after successful update
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
        <Typography sx={{ whiteSpace: 'nowrap', mb: 12, fontWeight: 700, fontSize: 18 }}>
          Edit Tariffs for Partner
        </Typography>

        <Box
          sx={{
            mt: 7,
            display: 'grid',
            width: '100%',
            gridTemplateColumns: 'repeat(3, auto)',
            gridTemplateRows: 3,
            gridTemplateAreas: `
              "partnerSelect partnerSelect partnerSelect"
              "localcall rowmin mtnmin"
              "backhome smsmo satellite"
            `,
            gap: 1,
            my: 1,
            alignItems: 'center'
          }}
        >
          {/* Partner Select Dropdown */}
          <FormControl
            fullWidth
            required
            sx={{
              gridArea: 'partnerSelect',
              mb: 10,
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#ffc400',
                },
              },
              '& .MuiInputLabel-root': {
                '&.Mui-focused': {
                  color: 'grey',
                },
              },
            }}
          >
            <Autocomplete
              options={partners} // Use full partner objects as options
              getOptionLabel={(option) => option.partnerName} // Display partner names
              value={selectedPartner} // Pre-select partner
              onChange={handlePartnerChange} // Handle partner change
              renderInput={(params) => (
                <TextField {...params} label="Choose a Partner" variant="outlined" required />
              )}
              fullWidth
            />
          </FormControl>

          {/* Text Fields */}
          <TextField
            required
            margin="dense"
            id="localcall"
            name="localCall"
            label="Local Call/MIN"
            type="text"
            value={localCall}
            onChange={(e) => setLocalCall(e.target.value)}
            variant="outlined"
            sx={{
              gridArea: 'localcall',
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#ffc400',
                },
              },
              '& .MuiInputLabel-root': {
                '&.Mui-focused': {
                  color: 'grey',
                },
              },
            }}
          />
          <TextField
            required
            margin="dense"
            id="rowmin"
            name="rowMin"
            label="Receiving Calls /MIN"
            type="text"
            value={receivingCalls}
            onChange={(e) => setReceivingCalls(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              gridArea: 'rowmin',
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#ffc400',
                },
              },
              '& .MuiInputLabel-root': {
                '&.Mui-focused': {
                  color: 'grey',
                },
              },
            }}
          />
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
              gridArea: 'backhome',
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#ffc400',
                },
              },
              '& .MuiInputLabel-root': {
                '&.Mui-focused': {
                  color: 'grey',
                },
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
              gridArea: 'smsmo',
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#ffc400',
                },
              },
              '& .MuiInputLabel-root': {
                '&.Mui-focused': {
                  color: 'grey',
                },
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

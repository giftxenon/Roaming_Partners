import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { Box, FormControl } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { BACKEND_DOMAIN } from '../api_host';

export default function AddTariff({ open, handleClose }) {
  const [selectedPartner, setSelectedPartner] = useState('');
  const [partners, setPartners] = useState([]); // Store partner data
  const [localCall, setLocalCall] = useState('');
  const [receivingCalls, setReceivingCalls] = useState('');
  const [backHome, setBackHome] = useState('');
  const [smsMo, setSmsMo] = useState('');

  // Fetch partners from API when the dialog opens
  useEffect(() => {
    if (open) {
      fetchPartners();
    }
  }, [open]);

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
        const partnerNames = data.data.map((partner) => ({
          partnerId: partner.partnerId,
          partnerName: partner.partnerName
        }));
        setPartners(partnerNames); // Update partners state with partner names
      } else {
        console.error('Error fetching partners:', data.message);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  const handlePartnerChange = (event, newValue) => {
    const selected = partners.find(partner => partner.partnerName === newValue);
    setSelectedPartner(selected ? selected.partnerId : '');
  };

  const handleSubmit = async () => {
    const newTariff = {
      partner: {
        partnerId: selectedPartner
      },
      country: {
        countryId: 1 // Example, this should be dynamic if needed
      },
      callBackHomePrepaid: backHome,
      localCallsPrepaid: localCall,
      receivingCallsPrepaid: receivingCalls, // Default value or another input field if needed
      sendingSmsPrepaid: smsMo,
    };

    try {
      const token = localStorage.getItem('accessToken'); // Use token if necessary
      const response = await fetch(`${BACKEND_DOMAIN}/api/tariffs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTariff)
      });
      const data = await response.json();
      if (data.success) {
        alert('Tariff added successfully');
        handleClose();
      } else {
        alert('Error adding tariff: ' + data.message);
      }
    } catch (error) {
      console.error('Error adding tariff:', error);
    }
  };

  return (
    
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        {/* Title */}
        <Typography sx={{ whiteSpace: 'nowrap', mb: 12, fontWeight: 700, fontSize: 18 }}>
          Add Tariffs to Partner
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
                  borderColor: '#ffc400', // Change border color when focused
                },
              },
              '& .MuiInputLabel-root': {
                '&.Mui-focused': {
                  color: 'grey', // Change label color when focused
                },
              },
            }}
          >
            <Autocomplete
              options={partners.map((partner) => partner.partnerName)} // Use partner names as options
              value={selectedPartner.partnerName || ''}
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
              gridArea: 'mtnmin',
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
              gridArea: 'satellite',
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
          /> */}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add Tariffs</Button>
      </DialogActions>
    </Dialog>
  );
}

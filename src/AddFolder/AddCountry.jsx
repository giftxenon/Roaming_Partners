import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import CountrySelect from '../countrySelect';
import { countries } from '../countries'; 
import { BACKEND_DOMAIN } from '../api_host';

export default function AddCountry({ open, handleClose, refreshTable }) {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [category, setCategory] = useState('');

  const handleCountryChange = (newCountry) => {
    setSelectedCountry(newCountry || null);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      await submitCountryData(selectedCountry?.label || '', category);
      refreshTable(); // Refresh the table
      handleClose();  // Close the dialog
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const submitCountryData = async (countryName, category) => {
    let token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/countries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ countryName, category }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        alert("Country Added Successfully");
      }

      const data = await response.json();
      console.log('Data submitted successfully:', data);
    } catch (error) {
      console.error('Error submitting:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Box
          sx={{
            mt: 7,
            display: 'grid',
            width: '100%',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 2,
            my: 1,
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              gridColumn: 'span 2',
              whiteSpace: 'nowrap',
              my: 1,
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            Add Country
          </Typography>

          <FormControl
            fullWidth
            required
            variant="outlined"
            sx={{
              gridColumn: '1 / 2',
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
            <CountrySelect
              value={selectedCountry}
              onChange={handleCountryChange}
              countries={countries}
            />
          </FormControl>

          <FormControl
            variant="outlined"
            fullWidth
            required
            sx={{
              gridColumn: '2 / 3',
              mt: 0,
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
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              label="Category"
              value={category}
              onChange={handleCategoryChange}
            >
              <MenuItem value="america">America</MenuItem>
              <MenuItem value="africa">Rest of Africa</MenuItem>
              <MenuItem value="europe">Europe</MenuItem>
              <MenuItem value="asia">Asia</MenuItem>
              <MenuItem value="ona">ONA</MenuItem>
              <MenuItem value="mtn_opcos">MTN OPCOS</MenuItem>
              <MenuItem value="north_america">North America & Canada</MenuItem>
              <MenuItem value="south_america">South America</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add Country</Button>
      </DialogActions>
    </Dialog>
  );
}

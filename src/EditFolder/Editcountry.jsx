import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import CountrySelect from '../countrySelect';
import { countries } from '../countries'; 
import { BACKEND_DOMAIN } from '../api_host';

export default function EditCountry({ open, handleClose, country, refreshTable }) {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [category, setCategory] = useState('');

  // Populate modal fields when country prop changes
  useEffect(() => {
    if (country) {
      setSelectedCountry({ label: country.countryName, value: country.countryId });
      setCategory(country.category);
    }
  }, [country]);

  const handleCountryChange = (newCountry) => {
    if (newCountry) {
      setSelectedCountry(newCountry);
    } else {
      setSelectedCountry(null);
    }
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (selectedCountry) {
        // Submit updated country data
        await submitCountryData(selectedCountry.value, selectedCountry.label, category);
        handleClose();
        refreshTable(); // Refresh table after successful submission
      } else {
        alert('Please select a country.');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Failed to update country. Please try again.');
    }
  };

  const submitCountryData = async (countryId, countryName, category) => {
    const token = localStorage.getItem('accessToken');
    
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/countries/${countryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          countryName, 
          category,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      alert("Country Updated Successfully");
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
            Edit Country
          </Typography>

          {/* Country Dropdown */}
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

          {/* Category Dropdown */}
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
        <Button onClick={handleSubmit}>Update Country</Button>
      </DialogActions>
    </Dialog>
  );
}

EditCountry.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  country: PropTypes.shape({
    countryId: PropTypes.number,
    countryName: PropTypes.string,
    category: PropTypes.string,
  }),
  refreshTable: PropTypes.func.isRequired, // Ensure that the table is refreshed after an update
};

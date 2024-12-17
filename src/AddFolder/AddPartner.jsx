import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { Autocomplete, MenuItem, Select, InputLabel } from '@mui/material';
import CountrySelect from '../countrySelect';
import { countries as staticCountries } from '../countries'; // Import static countries list
import { BACKEND_DOMAIN } from '../api_host';

export default function AddPartner({ open, handleClose }) {
  const [partnerName, setPartnerName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [mcc, setMcc] = useState('');
  const [mnc, setMnc] = useState('');
  const [rdc, setRdc] = useState('');
  const [mechanism, setMechanism] = useState(''); // Track mechanism (SRDC, LBTR)
  const [networkType, setNetworkType] = useState(''); // Track networkType (F, P, N)
  const [filteredCountries, setFilteredCountries] = useState([]); // Store filtered countries
  const [selectedCategory, setSelectedCategory] = useState(''); // Track selected category
  const [loading, setLoading] = useState(true); // Manage loading state
  const [apiCountries, setApiCountries] = useState([]); // Store countries from the API

  // Fetch countries from API
  useEffect(() => {
    if (open) {
      fetchCountries();
    }
  }, [open]);

  const fetchCountries = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BACKEND_DOMAIN}/api/countries`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setApiCountries(data.data); // Store countries from API response
        setLoading(false); // Set loading to false once data is fetched
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  // Handle the category change to filter countries from API and match with staticCountries
  const handleCategoryChange = (event, newCategory) => {
    setSelectedCategory(newCategory?.value || '');

    // Filter countries from API based on the selected category
    const filteredApiCountries = apiCountries.filter(
      (country) => country.category.toLowerCase() === newCategory.value
    );

    // Map the filtered API countries to static countries by matching countryName
    const mappedCountries = filteredApiCountries
      .map((apiCountry) => {
        return staticCountries.find(
          (staticCountry) =>
            staticCountry.label.toLowerCase() === apiCountry.countryName.toLowerCase()
        );
      })
      .filter((country) => country); // Filter out undefined values if no match is found

    setFilteredCountries(mappedCountries);
  };

  // Get the correct countryId based on selectedCountry and apiCountries
  const getCountryId = () => {
    if (selectedCountry) {
      const foundCountry = apiCountries.find(
        (country) => country.countryName.toLowerCase() === selectedCountry.label.toLowerCase()
      );
      return foundCountry ? foundCountry.countryId : null;
    }
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const countryId = getCountryId();
    if (!countryId) {
      alert('Please select a valid country.');
      return;
    }

    const newPartner = {
      partnerName,
      country: {
        countryId: countryId,
      },
      mechanism,
      networkType: mechanism === 'LBTR' ? networkType : '', // Use networkType only for LBTR
      mcc,
      mnc,
      rdc: mechanism === 'SRDC' ? rdc : '', // Use rdc only for SRDC
    };

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BACKEND_DOMAIN}/api/partners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newPartner),
      });

      const result = await response.json();
      if (result.success) {
        alert('Partner created successfully!');
        handleClose();
      } else {
        alert('Error creating partner: ' + result.message);
      }
    } catch (error) {
      console.error('Error creating partner:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ component: 'form', onSubmit: handleSubmit }}>
      <DialogTitle>Add New Partner</DialogTitle>
      <DialogContent sx={{ overflow: 'hidden' }}>
        <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {/* Partner Name Field */}
          <TextField
            autoFocus
            required
            margin="dense"
            label="Partner Name"
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': { borderColor: '#ffc400' },
              },
              '& .MuiInputLabel-root': { '&.Mui-focused': { color: 'grey' } },
            }}
          />

          {/* Category Dropdown */}
          <Autocomplete
            options={[
              { label: 'America', value: 'america' },
              { label: 'Rest of Africa', value: 'africa' },
              { label: 'Europe', value: 'europe' },
              { label: 'Asia', value: 'asia' },
              { label: 'ONA', value: 'ona' },
              { label: 'MTN OPCOS', value: 'mtn_opcos' },
              { label: 'North America & Canada', value: 'north_america' },
              { label: 'South America', value: 'south_america' },
            ]}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => <TextField {...params} label="Category" variant="outlined" required />}
            onChange={handleCategoryChange} // Handle category change
            fullWidth
          />

          {/* Country Dropdown */}
          <FormControl fullWidth>
            <CountrySelect
              value={selectedCountry}
              onChange={setSelectedCountry}
              countries={filteredCountries} // Pass the filtered countries list
              loading={loading}
            />
          </FormControl>

          {/* Mechanism Dropdown */}
          <FormControl fullWidth required variant="outlined">
            <InputLabel id="mechanism-label">Mechanism</InputLabel>
            <Select
              labelId="mechanism-label"
              value={mechanism}
              onChange={(e) => setMechanism(e.target.value)}
              label="Mechanism"
            >
              <MenuItem value="SRDC">SRDC</MenuItem>
              <MenuItem value="LBTR">LBTR</MenuItem>
            </Select>
          </FormControl>

          {/* Display RDC field if SRDC is selected */}
          {mechanism === 'SRDC' && (
            <TextField
              required
              margin="dense"
              label="RDC"
              value={rdc}
              onChange={(e) => setRdc(e.target.value)}
              fullWidth
              variant="outlined"
            />
          )}

          {/* Display Network Type if LBTR is selected */}
          {mechanism === 'LBTR' && (
            <FormControl fullWidth required variant="outlined">
              <InputLabel id="networkType-label">Network Type</InputLabel>
              <Select
                labelId="networkType-label"
                value={networkType}
                onChange={(e) => setNetworkType(e.target.value)}
                label="Network Type"
              >
                <MenuItem value="F">F</MenuItem>
                <MenuItem value="P">P</MenuItem>
                <MenuItem value="N">N</MenuItem>
              </Select>
            </FormControl>
          )}

          {/* MCC and MNC Fields */}
          <TextField
            required
            margin="dense"
            label="MCC"
            value={mcc}
            onChange={(e) => setMcc(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <TextField
            required
            margin="dense"
            label="MNC"
            value={mnc}
            onChange={(e) => setMnc(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" color="primary">
          Add Partner
        </Button>
      </DialogActions>
    </Dialog>
  );
}

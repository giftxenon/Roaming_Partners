import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, FormControl, Select, MenuItem, InputLabel, Autocomplete } from '@mui/material';
import { BACKEND_DOMAIN } from '../api_host';
import CountrySelect from '../countrySelect';
import { countries as staticCountries } from '../countries'; // Import static countries list

export default function EditPartner({ open, handleClose, partnerId, onPartnerUpdated }) {
  const [partnerName, setPartnerName] = useState('');
  const [mcc, setMcc] = useState('');
  const [mnc, setMnc] = useState('');
  const [rdc, setRdc] = useState('');
  const [mechanism, setMechanism] = useState('');
  const [networkType, setNetworkType] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null); // Country object { label: '', value: '' }
  const [filteredCountries, setFilteredCountries] = useState([]); // Store filtered countries
  const [selectedCategory, setSelectedCategory] = useState(''); // Category value
  const [apiCountries, setApiCountries] = useState([]); // Store countries from the API
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && partnerId) {
      fetchPartnerDetails();
      fetchCountries();
    }
  }, [open, partnerId]);

  const fetchPartnerDetails = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BACKEND_DOMAIN}/api/partners/${partnerId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const partner = data.data;
        setPartnerName(partner.partnerName);
        setMcc(partner.mcc);
        setMnc(partner.mnc);
        setRdc(partner.rdc);
        setMechanism(partner.mechanism);
        setNetworkType(partner.networkType);
        
        // Set Category and Filter Countries
        const partnerCategory = partner.category || ''; // Fetch the category from partner details
        setSelectedCategory(partnerCategory);

        // Filter the countries by category and select the partner's country
        const filteredApiCountries = apiCountries.filter(
          (country) => country.category.toLowerCase() === partnerCategory.toLowerCase()
        );

        const partnerCountry = filteredApiCountries.find(
          (country) => country.countryId === partner.country.countryId
        );

        // Set selected country and filter country list
        const countryObject = {
          label: partnerCountry ? partnerCountry.countryName : 'Unknown',
          value: partnerCountry ? partnerCountry.countryId : null,
        };
        setSelectedCountry(countryObject);

        // Map filtered countries to static list for dropdown
        const mappedCountries = filteredApiCountries
          .map((apiCountry) => {
            return staticCountries.find(
              (staticCountry) =>
                staticCountry.label.toLowerCase() === apiCountry.countryName.toLowerCase()
            );
          })
          .filter((country) => country);

        setFilteredCountries(mappedCountries); // Update filtered countries for CountrySelect
      }
    } catch (error) {
      console.error('Error fetching partner details:', error);
    }
  };

  const fetchCountries = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BACKEND_DOMAIN}/api/countries`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setApiCountries(data.data); // Store countries from API response
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const handleCategoryChange = (event, newCategory) => {
    setSelectedCategory(newCategory?.value || '');

    const filteredApiCountries = apiCountries.filter(
      (country) => country.category.toLowerCase() === newCategory.value
    );

    const mappedCountries = filteredApiCountries
      .map((apiCountry) => {
        return staticCountries.find(
          (staticCountry) =>
            staticCountry.label.toLowerCase() === apiCountry.countryName.toLowerCase()
        );
      })
      .filter((country) => country);

    setFilteredCountries(mappedCountries);
    setSelectedCountry(null); // Reset the country when category changes
  };

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

    const updatedPartner = {
      partnerName,
      country: { countryId },
      mechanism,
      networkType: mechanism === 'LBTR' ? networkType : '',
      mcc,
      mnc,
      rdc: mechanism === 'SRDC' ? rdc : '',
    };

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BACKEND_DOMAIN}/api/partners/${partnerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPartner),
      });

      const result = await response.json();
      if (result.success) {
        handleClose();
        onPartnerUpdated(); // Callback to refresh data
      } else {
        alert('Error updating partner: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating partner:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ component: 'form', onSubmit: handleSubmit }}>
      <DialogTitle>Edit Partner</DialogTitle>
      <DialogContent sx={{ overflow: 'hidden' }}>
        <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <TextField
            required
            margin="dense"
            label="Partner Name"
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
            fullWidth
            variant="outlined"
          />

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
            value={selectedCategory ? { label: selectedCategory, value: selectedCategory.toLowerCase() } : null}
            onChange={handleCategoryChange}
            fullWidth
          />

          <FormControl fullWidth>
            <CountrySelect
              value={selectedCountry}
              onChange={setSelectedCountry}
              countries={filteredCountries} // Pass filtered countries list
              loading={loading}
            />
          </FormControl>

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

          {mechanism === 'LBTR' && (
            <FormControl fullWidth required>
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
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" color="primary">
          Update Partner
        </Button>
      </DialogActions>
    </Dialog>
  );
}

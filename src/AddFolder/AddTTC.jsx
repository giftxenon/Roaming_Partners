import { Button, TextField, Dialog, DialogActions, DialogContent, Typography, Box, Autocomplete } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { useState, useEffect } from 'react';
import { BACKEND_DOMAIN } from "../api_host";
import { countries as staticCountries } from "../countries"; // Import static countries list

export default function AddTariffToCountry({ open, handleClose, refreshTable }) {
  const [selectedCountry, setSelectedCountry] = useState(null); // Ensure this is an object, not just a string
  const [apiCountries, setApiCountries] = useState([]); // Store countries from the API
  const [filteredCountries, setFilteredCountries] = useState([]); // Store filtered countries
  const [selectedCategory, setSelectedCategory] = useState(''); // Track selected category
  const [localCall, setLocalCall] = useState('');
  const [rowMin, setRowMin] = useState('');
  const [mtnMin, setMtnMin] = useState('');
  const [backHomeMin, setBackHomeMin] = useState('');
  const [smsMo, setSmsMo] = useState('');
  const [satellite, setSatellite] = useState('');
  const [internationalCalls, setInternationalCalls] = useState('');
  const [receivingCalls, setReceivingCalls] = useState('');
  const [dataRoaming, setDataRoaming] = useState('');
  const [loading, setLoading] = useState(true); // Manage loading state

  // Fetch countries from API
  useEffect(() => {
    if (open) {
      fetchCountries();
    }
  }, [open]);

  const fetchCountries = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${BACKEND_DOMAIN}/api/countries`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token
        },
      });
      const data = await response.json();
      if (data.success) {
        setApiCountries(data.data); // Store countries from API response
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  // Handle the category change to filter countries from API and match with staticCountries
  const handleCategoryChange = (event, newCategory) => {
    setSelectedCategory(newCategory?.value || "");

    // Filter countries from API based on the selected category
    const filteredApiCountries = apiCountries.filter(
      (country) => country.category.toLowerCase() === newCategory.value
    );

    setFilteredCountries(filteredApiCountries); // Update the filtered countries list for CountrySelect
  };

  // Handle country selection and pass the whole object to `setSelectedCountry`
  const handleCountryChange = (event, newCountry) => {
    setSelectedCountry(newCountry); // newCountry will now be the selected country object
  };

  const handleSubmit = async () => {
    if (!selectedCountry || !localCall || !backHomeMin || !smsMo || !receivingCalls ) {
      alert("Please fill in all fields.");
      return;
    }
  
    const token = localStorage.getItem("accessToken");
    const payload = {
      country: {
        countryId: selectedCountry.countryId, // Pass the countryId for selected country
      },
      callbackHomePrepaid: backHomeMin,
      smsPrepaid: smsMo,
      localCallsPrepaid: localCall,
      receivingCallsPrepaid: receivingCalls,
    };
  
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/opco-tariffs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
  
      if (data.success) {
        alert("Tariffs added successfully!");
        handleClose(); // Close the dialog after submission
        refreshTable(); // Refresh the table after adding the tariff
      } else {
        alert(`Failed to add tariffs: ${data.message}`);
      }
    } catch (error) {
      console.error("Error adding tariffs:", error);
      alert("Error adding tariffs. Please try again.");
    }
  };
  
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Typography sx={{ whiteSpace: 'nowrap', mb: 12, fontWeight: 700, fontSize: 18 }}>
          Add Tariffs to Country
        </Typography>

        <Box
          sx={{
            mt: 7,
            display: 'grid',
            width: '100%',
            gridTemplateColumns: 'repeat(3, auto)',
            gridTemplateRows: 2,
            gridTemplateAreas: `
              "categorySelect countrySelect countrySelect"
              "localcall receiving mtnmin"
              "backhome smsmo satellite"
            `,
            gap: 3, // Add space between the grid items
            my: 3,
            alignItems: 'center'
          }}
        >
          {/* Autocomplete for Category Select */}
          <FormControl
            fullWidth
            required
            variant="outlined"
            sx={{
              gridArea: 'categorySelect', // Category select input
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
              renderInput={(params) => (
                <TextField {...params} label="Select Category" variant="outlined" required />
              )}
              isOptionEqualToValue={(option, value) => option.value === value}
              onChange={handleCategoryChange} // Handle category change
              fullWidth
            />
          </FormControl>

          <FormControl
            fullWidth
            required
            variant="outlined"
            sx={{
              gridArea: 'countrySelect', // Country select input
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
              options={filteredCountries}
              getOptionLabel={(option) => option.countryName} // Display country names in the dropdown
              renderInput={(params) => (
                <TextField {...params} label="Choose a country" variant="outlined" required />
              )}
              onChange={handleCountryChange} // Handle country selection
              isOptionEqualToValue={(option, value) => option.countryId === value.countryId}
              value={selectedCountry || null} // Ensure correct object is used
              fullWidth
            />
          </FormControl>

          {/* Tariff Input Fields */}
          <TextField
            label="Local Call/MIN"
            required
            sx={{ gridArea: 'localcall' }}
            value={localCall}
            onChange={(e) => setLocalCall(e.target.value)}
          />
          <TextField
            label="Receiving Calls/MIN"
            required
            sx={{ gridArea: 'receiving' }}
            value={receivingCalls}
            onChange={(e) => setReceivingCalls(e.target.value)}
          />
          <TextField
            label="Back Home/MIN"
            required
            sx={{ gridArea: 'backhome' }}
            value={backHomeMin}
            onChange={(e) => setBackHomeMin(e.target.value)}
          />
          <TextField
            label="SMS"
            required
            sx={{ gridArea: 'smsmo' }}
            value={smsMo}
            onChange={(e) => setSmsMo(e.target.value)}
          />
          
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" onClick={handleSubmit}>
          Add Tariffs
        </Button>
      </DialogActions>
    </Dialog>
  );
}

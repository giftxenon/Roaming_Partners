import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import PropTypes from 'prop-types'; // Import PropTypes for props validation

export default function CountrySelect({ value, onChange, countries }) {
  return (
    <Autocomplete
      id="country-select-demo"
      sx={{ width: 200 }}
      options={countries} // Use the passed countries prop
      autoHighlight
      getOptionLabel={(option) => option ? option.label : ''} // Safely return label
      value={value} // The selected country object or null
      onChange={(event, newValue) => {
        onChange(newValue); // Pass the entire object back to parent
      }}
      renderOption={(props, option) => (
        <Box
          component="li"nnk
          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <img
            loading="lazy"
            width="20"
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            alt=""
          />
          {option.label}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
        //sx={{ml: 0}}
          {...params}
          label="Choose a country"
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // Disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}

// Add prop types validation
CountrySelect.propTypes = {
  value: PropTypes.shape({
    label: PropTypes.string.isRequired, // Country label (e.g., country name)
    code: PropTypes.string.isRequired,  // Country code (e.g., 'US')
  }), // Object or null (optional)
  onChange: PropTypes.func.isRequired, // Callback function for when the value changes
  countries: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired, // Country label
      code: PropTypes.string.isRequired,  // Country code
    })
  ).isRequired, // Array of country objects
};

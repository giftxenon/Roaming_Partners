// src/components/SearchBar.jsx
//import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <TextField
      label="Search"
      variant="outlined"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      sx={{
        minWidth: 200,
        ml: 60,
        my: 2,
        "& .MuiOutlinedInput-root": {
          height: 35,
          "&.Mui-focused fieldset": {
            borderColor: "#ffc400",
          },
        },
        "& .MuiInputLabel-root": {
          "&.Mui-focused": {
            color: "grey",
          },
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" sx={{ color: "black" }} />
          </InputAdornment>
        ),
      }}
    />
  );
}

import { useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

// Example columns and data
const columns = [
  { field: "id", headerName: "ID", flex: 1 },
  { field: "partnerName", headerName: "Partner Name", flex: 1 },
  { field: "country", headerName: "Country", flex: 1 },
  { field: "category", headerName: "Category", flex: 1 },
];

const data = [
  { id: 1, partnerName: "Partner A", country: "USA", category: "North America" },
  { id: 2, partnerName: "Partner B", country: "Canada", category: "North America" },
  // More data...
];

export default function TableTest() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter data based on the search query
  const filteredData = data.filter((row) => {
    return (
      row.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <Paper sx={{ padding: 2 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
       <TextField
  label="Search"
  variant="outlined"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  sx={{
    minWidth: 200,  // Width of the search bar
    ml: 105,         // Left margin for alignment
    "& .MuiOutlinedInput-root": {
      height: 35,   // Height for the input field
      "& fieldset": {
        borderRadius: 1, // Optionally adjust border radius to match height
        borderColor: searchQuery ? "green" : "gray", // Green when there's text
        "&:hover": {
          borderColor: "orange", // Orange on hover
        },
        "&.Mui-focused": {
          borderColor: "yellow", // Yellow when focused
        },
      },
      "& input": {
        height: "100%", // Ensures input text aligns vertically in the middle
        padding: "0 14px", // Padding inside the input field
      },
    },
    "& .MuiInputLabel-root": {
      transition: "all 0.3s ease", // Smooth transition
      transform: "translate(14px, 20px) scale(1)", // Initial position
      color: searchQuery ? "green" : "text.primary", // Change color when there's text
      "&.Mui-focused": {
        transform: "translate(14px, -8px) scale(0.75)", // Position when focused
        color: "yellow", // Label color when focused
      },
    },
    "& .MuiInputBase-root:hover": {
      backgroundColor: "rgba(255, 165, 0, 0.1)", // Light orange background on hover
    },
  }}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <SearchIcon fontSize="small" />
      </InputAdornment>
    ),
  }}
/>

      </div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={filteredData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
        />
      </div>
    </Paper>
  );
}
{/*
    import { useState, useEffect, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Checkbox, IconButton, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeletePartnerModal from "../Modals/DeleteModal.jsx";
import EditPartnerModal from "../Modals/EditModal.jsx";
import ViewModal from "../Modals/ViewModal.jsx";

const columns = [
  { field: "id", headerName: "ID", flex: 1 },
  { field: "partnerName", headerName: "Partner Name", flex: 1 },
  { field: "country", headerName: "Country", flex: 1 },
  { field: "Category", headerName: "Category", flex: 1 },
  {
    field: "preferredPartner",
    headerName: "Preferred Partner",
    flex: 2,
    renderCell: (params) => (
      <Checkbox
        checked={params.value === 1}
        onChange={() => {
          console.log("Checkbox clicked for row:", params.row);
        }}
        size="small"
      />
    ),
  },
  {
    field: "actions",
    flex: 2,
    headerName: "Actions",
    renderCell: (data) => (
      <div>
        <ViewModal>
          <IconButton color="primary" aria-label="view" component="span">
            <VisibilityOutlinedIcon fontSize="small" />
          </IconButton>
        </ViewModal>

        <EditPartnerModal>
          <IconButton color="primary" aria-label="edit" component="span">
            <BorderColorIcon fontSize="small" />
          </IconButton>
        </EditPartnerModal>

        <DeletePartnerModal id={data.id}>
          <IconButton color="error" aria-label="delete" component="span">
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </DeletePartnerModal>
      </div>
    ),
  },
];

export default function DataTable() {
  const [data, setData] = useState([]); // State to store the data
  const [searchQuery, setSearchQuery] = useState("");
  const componentRef = useRef();

  // Fetch data from API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("YOUR_API_ENDPOINT"); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result); // Update state with the fetched data
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once on mount

  const filteredData = data.filter((row) => {
    return (
      row.partnerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.Category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <Paper
      sx={{
        padding: 1,
        marginTop: 100, // Adjust this value as needed
        maxWidth: 1100,  // Adjusts the width of the table
        margin: "auto", // Centers the table horizontally on the page
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            minWidth: 200,  // Width of the search bar
            ml: 100, 
            mt: 2,        // Top margin for alignment
            "& .MuiOutlinedInput-root": {
              height: 35,   // Height for the input field
              "& fieldset": {
                borderRadius: 1, // Optionally adjust border radius to match height
              },
              "& input": {
                height: "100%", // Ensures input text aligns vertically in the middle
                padding: "0 14px", // Padding inside the input field
              },
            },
            "& .MuiInputLabel-root": {
              transition: "all 0.3s ease", // Smooth transition
              transform: "translate(45px, 7px) scale(1)", // Initial position
              "&.Mui-focused": {
                transform: "translate(14px, -8px) scale(0.75)", // Position when focused
                color: "primary.main", // Optional: Change color when focused
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div style={{ height: 400, width: "100%", padding: 10 }} ref={componentRef}>
        <DataGrid
          rows={filteredData}
          columns={columns}
          pageSize={10}
          pageSizeOptions={[5, 10]}
          rowHeight={33}
          sx={{ border: 0 }}
        />
      </div>
    </Paper>
  );
}

    
    */}
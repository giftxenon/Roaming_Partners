import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import SearchBar from '../Search/SearchBar.jsx';
import AddIcon from "@mui/icons-material/Add";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from '@mui/icons-material/Delete'; 
import { amber } from "@mui/material/colors";
import { BACKEND_DOMAIN } from '../api_host.jsx';
import AddCountry from '../AddFolder/AddCountry.jsx'; 
import EditCountry from '../EditFolder/EditCountry.jsx';

export default function CountryCategoryTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [countryData, setCountryData] = useState([]); 
  const [openAddCountry, setOpenAddCountry] = useState(false);
  const [openEditCountry, setOpenEditCountry] = useState(false); 
  const [selectedCountry, setSelectedCountry] = useState(null); 
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); 
  const [countryToDelete, setCountryToDelete] = useState(null); 
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchCountryData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BACKEND_DOMAIN}/api/countries`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      if (result && Array.isArray(result.data)) {
        setCountryData(result.data);
      } else {
        setCountryData([]); 
      }
    } catch (error) {
      setCountryData([]); 
    }
  };

  useEffect(() => {
    fetchCountryData();
  }, []);

  const filteredData = countryData.filter((row) =>
    row.countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  const handleOpenAddCountry = () => {
    setOpenAddCountry(true);
  };

  const handleCloseAddCountry = () => {
    setOpenAddCountry(false);
  };

  const handleEdit = (country) => {
    setSelectedCountry(country); 
    setOpenEditCountry(true);   
  };

  const handleCloseEditCountry = () => {
    setOpenEditCountry(false);
    setSelectedCountry(null);  
  };

  const handleDeleteConfirmation = (country) => {
    setCountryToDelete(country);
    setOpenDeleteDialog(true); 
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCountryToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BACKEND_DOMAIN}/api/countries/${countryToDelete.countryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCountryData((prevData) => prevData.filter((country) => country.countryId !== countryToDelete.countryId));
        setOpenDeleteDialog(false);
      } else {
        console.error("Failed to delete the country");
      }
    } catch (error) {
      console.error("Error deleting the country:", error);
    }
  };

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", margin: "20px" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          className="add-country-btn"
          onClick={handleOpenAddCountry}
          sx={{
            mr: 33.5,
            backgroundColor: "#FFCB05", 
            color: "#000", 
            fontWeight: "bold",
            fontFamily: "'MTNBrighterSans', sans-serif",
            width: '168px',
            height: '35px',
            "&:hover": {
              backgroundColor: amber[400],
            },
            textTransform: "none",  
          }}
        >
          ADD OPCO
        </Button>
      </div>
    
      <TableContainer component={Paper} sx={{ maxWidth: 1000, margin: "auto", boxShadow: 4, borderRadius: 3 }}>
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 20px" }}>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
        
        <Table aria-label="country category table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', fontFamily: "'MTNBrighterSans', sans-serif", color: '#000' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', fontFamily: "'MTNBrighterSans', sans-serif", color: '#000' }}>Country</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '14px', fontFamily: "'MTNBrighterSans', sans-serif", color: '#000' }}>Category (Continent)</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '14px', fontFamily: "'MTNBrighterSans', sans-serif", color: '#000' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <TableRow 
                  key={row.countryId} 
                  hover 
                  sx={{
                    "&:hover": { backgroundColor: "#f9f9f9" },
                    transition: "background-color 0.3s ease",
                  }}
                >
                  <TableCell sx={{ fontFamily: "'MTNBrighterSans', sans-serif" }}>{row.countryId}</TableCell>
                  <TableCell sx={{ fontFamily: "'MTNBrighterSans', sans-serif" }}>{row.countryName}</TableCell>
                  <TableCell sx={{ fontFamily: "'MTNBrighterSans', sans-serif" }}>{row.category}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit Country" arrow>
                      <IconButton color="primary" onClick={() => handleEdit(row)}>
                        <BorderColorIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Country" arrow>
                      <IconButton color="error" onClick={() => handleDeleteConfirmation(row)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ fontFamily: "'MTNBrighterSans', sans-serif" }}>
                  No country data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <AddCountry open={openAddCountry} handleClose={handleCloseAddCountry} refreshTable={fetchCountryData} />
        <EditCountry open={openEditCountry} handleClose={handleCloseEditCountry} country={selectedCountry} refreshTable={fetchCountryData} />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete Country?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this country? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </TableContainer>
    </>
  );
}

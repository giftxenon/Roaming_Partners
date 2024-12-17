import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import SearchBar from '../Search/SearchBar.jsx';
import AddIcon from "@mui/icons-material/Add";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { amber } from "@mui/material/colors";
import EditOPCOS from '../EditFolder/EditOPCOS.jsx';
import AddTariffToCountry from "../AddFolder/AddTTC.jsx";
import DeleteOpcos from '../DeleteFolder/DeleteOPCOS.jsx';
import { BACKEND_DOMAIN } from '../api_host.jsx';

export default function TariffTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tariffData, setTariffData] = useState([]); // State to store tariff data
  const [openOPCOSCountry, setOpenOPCOSCountry] = useState(false); // Add OPCOS modal state
  const [openEditModal, setOpenEditModal] = useState(false); // Edit OPCOS modal state
  const [selectedTariff, setSelectedTariff] = useState(null); // Selected tariff for editing
  const [page, setPage] = useState(0); // Pagination page state
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page state

 
  const fetchTariffData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BACKEND_DOMAIN}/api/opco-tariffs`, {
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
        setTariffData(result.data);
      } else {
        console.error("Expected an object with an array but got:", result);
        setTariffData([]);
      }
    } catch (error) {
      console.error("Error fetching tariff data:", error);
      setTariffData([]);
    }
  };

  
  useEffect(() => {
    fetchTariffData();
  }, []);

  const filteredData = tariffData.filter((row) =>
    row.countryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const handleOpenOPCOSCountry = () => setOpenOPCOSCountry(true);
  const handleCloseOPCOSCountry = () => setOpenOPCOSCountry(false);


  const handleOpenEditModal = (tariff) => {
    setSelectedTariff(tariff);
    setOpenEditModal(true);
  };
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedTariff(null);
  };

  const refreshTable = () => {
    fetchTariffData();
  };


  const handleTariffDelete = (deletedId) => {
    setTariffData((prevData) => prevData.filter((tariff) => tariff.opcoTariffId !== deletedId));
  };

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", margin: "20px" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon sx={{ color: "black" }} />}
          sx={{
           // my: 1,
            mr: 19,
            color: "black",
            fontWeight: 'bold',
            backgroundColor: "#FFCB05",
            "&:hover": {
              backgroundColor: amber[400],
            },
            width: '168px',
            height: '35px',
            // fontSize: '0.75rem',
          }}
          onClick={handleOpenOPCOSCountry} // Open Add OPCOS modal
        >
          Add TARRIFS
        </Button>
      </div>

      <TableContainer component={Paper} sx={{
        padding: 2,
        marginTop: 20,
        maxWidth: 1200,
        margin: "auto",
        boxShadow: 3,
        borderRadius: 2,
        maxHeight: 500,
        overflowY: 'auto',
      }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        <Table stickyHeader aria-label="tariff table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold', color: '#616161', fontSize: '0.95rem' }}>OPCOS ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#616161', fontSize: '0.95rem' }}>Country Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#616161', fontSize: '0.95rem' }}>Local Call/MIN</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#616161', fontSize: '0.95rem' }}>Receiving Calls/MIN</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#616161', fontSize: '0.95rem' }}>Back Home/MIN</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#616161', fontSize: '0.95rem' }}>SMS</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#616161', fontSize: '0.95rem', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow key={row.opcoTariffId || index} hover sx={{
                  '&:hover': { backgroundColor: '#fafafa' },
                  transition: 'background-color 0.3s ease',
                }}>
                  <TableCell sx={{ fontSize: '0.875rem', color: '#424242' }}>{row.opcoTariffId}</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: '#424242' }}>{row.countryName}</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: '#424242' }}>{row.localCallsPrepaid}</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: '#424242' }}>{row.receivingCallsPrepaid}</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: '#424242' }}>{row.callbackHomePrepaid}</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: '#424242' }}>{row.smsPrepaid}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <IconButton color="primary" aria-label="edit" onClick={() => handleOpenEditModal(row)}>
                      <BorderColorIcon fontSize="small" />
                    </IconButton>
                    <DeleteOpcos id={row.opcoTariffId} onDelete={handleTariffDelete} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} align="center">No data available</TableCell>
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
          sx={{ borderTop: '1px solid #e0e0e0', margin: '20px 0' }}
        />

        <AddTariffToCountry open={openOPCOSCountry} handleClose={handleCloseOPCOSCountry} refreshTable={fetchTariffData} />

        <EditOPCOS 
          open={openEditModal} 
          handleClose={handleCloseEditModal} 
          tariff={selectedTariff} 
          refreshTable={fetchTariffData} // Pass the table refresh function here
        />

        
      </TableContainer>
    </>
  );
}

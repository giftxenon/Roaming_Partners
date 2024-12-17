import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination, Button } from '@mui/material';
import SearchBar from '../Search/SearchBar.jsx';
import AddIcon from "@mui/icons-material/Add";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { amber } from "@mui/material/colors";
import AddTariff from '../AddFolder/AddTariffs.jsx';
import EditTariff from '../EditFolder/EditTarriffs.jsx'; // Updated import
import { BACKEND_DOMAIN } from '../api_host.jsx';
import DeleteTariffs from '../DeleteFolder/DeleteTariffs.jsx'; // Import DeleteTariffs

export default function TariffTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tariffData, setTariffData] = useState([]);
  const [openAddTariff, setOpenAddTariff] = useState(false);
  const [openEditTariff, setOpenEditTariff] = useState(false);
  const [selectedTariff, setSelectedTariff] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Function to fetch tariff data
  const fetchTariffData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BACKEND_DOMAIN}/api/tariffs`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
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
    fetchTariffData(); // Fetch tariff data when component mounts
  }, []);

  const handleOpenAddTariff = () => setOpenAddTariff(true);
  const handleCloseAddTariff = () => setOpenAddTariff(false);

  const handleOpenEditTariff = (tariff) => {
    setSelectedTariff(tariff);
    setOpenEditTariff(true);
  };

  const handleCloseEditTariff = () => {
    setSelectedTariff(null);
    setOpenEditTariff(false);
  };

  // Function to update tariff data after editing
  const handleTariffUpdate = () => {
    fetchTariffData(); // Refetch the updated tariff data
    handleCloseEditTariff(); // Close the modal
  };

  // Function to handle tariff deletion
  const handleDeleteTariff = (tariffId) => {
    setTariffData(prevData => prevData.filter(tariff => tariff.tariffId !== tariffId));
  };

  const filteredData = tariffData.filter((row) =>
    row.partnerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
            mr: 20.5,
            color: "black",
            backgroundColor: "#FFCB05",
            "&:hover": {
              backgroundColor: amber[400],
            },
            width: '168px',
            height: '35px',
            // fontSize: '0.75rem',
            fontWeight: 'bold',
          }}
          onClick={handleOpenAddTariff}
        >
          Add Tariffs
        </Button>
      </div>

      <TableContainer component={Paper} sx={{
        padding: 2,
        marginTop: 2,
        maxWidth: 1200,
        margin: "auto",
        boxShadow: 4,
        borderRadius: 2,
        maxHeight: 450, // Make the table scrollable
        overflowY: 'auto'
      }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
        <Table stickyHeader aria-label="tariff table">
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Partner Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Country Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Local Call/MIN</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Recieving Call/MIN</TableCell>
              {/* <TableCell sx={{ fontWeight: 'bold' }}>ROW/MIN</TableCell> */}
              {/* <TableCell sx={{ fontWeight: 'bold' }}>MTN/MIN</TableCell> */}
              {/* <TableCell sx={{ fontWeight: 'bold' }}>International/MIN</TableCell> */}
              <TableCell sx={{ fontWeight: 'bold' }}>Back Home/MIN</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>SMS</TableCell>
              {/* <TableCell sx={{ fontWeight: 'bold' }}>Satellite</TableCell> */}
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <TableRow key={row.tariffId} hover sx={{
                  '&:hover': { backgroundColor: '#f9f9f9' },
                  transition: 'background-color 0.3s ease',
                }}>
                  <TableCell>{row.tariffId}</TableCell>
                  <TableCell>{row.partnerName}</TableCell>
                  <TableCell>{row.countryName}</TableCell>
                  <TableCell>{row.localCallsPrepaid}</TableCell>
                  <TableCell>{row.receivingCallsPrepaid}</TableCell>
                  {/* <TableCell>{row.dataRoamingPrepaid}</TableCell> */}
                  {/* <TableCell>{row.mtPrepaid}</TableCell> */}
                  {/* <TableCell>{row.internationalCallsPrepaid}</TableCell> */}
                  <TableCell>{row.callBackHomePrepaid}</TableCell>
                  <TableCell>{row.sendingSmsPrepaid}</TableCell>
                  {/* <TableCell>{row.satelitePrepaid}</TableCell> */}
                  <TableCell sx={{ textAlign: 'center' }}>
                    <IconButton color="primary" aria-label="edit" onClick={() => handleOpenEditTariff(row)}>
                      <BorderColorIcon fontSize="small" />
                    </IconButton>
                    <DeleteTariffs id={row.tariffId} onDelete={handleDeleteTariff} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} align="center">No tariff data available</TableCell>
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

        <AddTariff open={openAddTariff} handleClose={handleCloseAddTariff} />
        <EditTariff
          open={openEditTariff}
          handleClose={handleCloseEditTariff}
          tariff={selectedTariff}
          onTariffUpdated={handleTariffUpdate} // Refresh the table when tariff is updated
        />
      </TableContainer>
    </>
  );
}

import { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Button,
  TablePagination,
  Tooltip,
} from "@mui/material";
import SearchBar from '../Search/SearchBar.jsx';
import AddIcon from "@mui/icons-material/Add";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { amber } from "@mui/material/colors";
import EditPartner from '../EditFolder/EditPartner.jsx';
import AddPartner from "../AddFolder/AddPartner.jsx";
import DeletePartnerModal from '../AddFolder/DeleteModal.jsx';
import ViewModal from '../ViewFolder/ViewModal.jsx'; // Import ViewModal
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { BACKEND_DOMAIN } from '../api_host.jsx';

export default function PartnerTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [partnerData, setPartnerData] = useState([]); // State to store partner data
  const [openAddPartner, setOpenAddPartner] = useState(false); // Add Partner modal state
  const [openEditPartner, setOpenEditPartner] = useState(false); // Edit Partner modal state
  const [openViewModal, setOpenViewModal] = useState(false); // View modal state
  const [selectedPartner, setSelectedPartner] = useState(null); // Selected partner for editing or viewing
  const [page, setPage] = useState(0); // Pagination page state
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page state

  // Fetch the partner data from the backend
  const fetchPartnerData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const [partnerRes, countryRes] = await Promise.all([
        fetch(`${BACKEND_DOMAIN}/api/partners`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch(`${BACKEND_DOMAIN}/api/countries`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }),
      ]);

      if (!partnerRes.ok || !countryRes.ok) {
        throw new Error(`Failed to fetch data: ${partnerRes.statusText} ${countryRes.statusText}`);
      }

      const partners = await partnerRes.json();
      const countries = await countryRes.json();

      const mergedData = partners.data.map((partner) => {
        const country = countries.data.find(c =>
          c.partners.some(p => p.partnerId === partner.partnerId)
        );

        return {
          id: partner.partnerId,
          partnerName: partner.partnerName,
          countryName: country ? country.countryName : "Unknown",
          category: country ? country.category : "Unknown",
          networkType: partner.networkType,
          rdc: partner.rdc,
        };
      });

      setPartnerData(mergedData);
    } catch (error) {
      console.error("Error fetching partner data:", error);
      setPartnerData([]);
    }
  };

  // Fetch partner data on mount
  useEffect(() => {
    fetchPartnerData();
  }, []);

  // Filter the data based on search query
  const filteredData = partnerData.filter((row) =>
    row.partnerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle Add Partner modal
  const handleOpenAddPartner = () => setOpenAddPartner(true);
  const handleCloseAddPartner = () => {
    setOpenAddPartner(false);
    refreshTable(); // Refresh the table after adding
  };

  // Handle Edit Partner modal
  const handleOpenEditPartnerModal = (partner) => {
    setSelectedPartner(partner); // Set selected partner details (including id)
    setOpenEditPartner(true); // Open Edit Partner modal
  };
  const handleCloseEditPartnerModal = () => {
    // alert("Closing Edit Partner modal..."); // Debugging
    setOpenEditPartner(false);
    setSelectedPartner(null);
    refreshTable(); // Refresh the table after editing
  };

  // Handle View Partner modal
  const handleOpenViewPartnerModal = (partner) => {
    setSelectedPartner(partner); // Store the selected partner for viewing
    setOpenViewModal(true); // Open the modal
  };
  const handleCloseViewPartnerModal = () => {
    setOpenViewModal(false);
    setSelectedPartner(null);
  };

  // Refresh the table after editing or adding partners
  const refreshTable = () => {
    // alert("Refreshing table..."); // Debugging
    setOpenAddPartner(false);
    fetchPartnerData();
  };

  // Get the current rows to display based on pagination
  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", margin: "20px" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon sx={{ color: "black" }} />}
          sx={{
            mr: 19,
            color: "black",
            backgroundColor: "#FFCB05",
            "&:hover": {
              backgroundColor: amber[400],
            },
            width: '168px',
            height: '35px',
            fontWeight: 'bold',
            textTransform: 'none',
            fontFamily: "'MTNBrighterSans', sans-serif",
          }}
          onClick={handleOpenAddPartner} // Open Add Partner modal
        >
          ADD PARTNER
        </Button>
      </div>

      <TableContainer component={Paper} sx={{
        padding: 2,
        marginTop: 2,
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

        <Table stickyHeader aria-label="partner table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: '#FFCB05', fontWeight: 'bold', fontSize: '14px', fontFamily: "'MTNBrighterSans', sans-serif", }}>ID</TableCell>
              <TableCell sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: '#FFCB05', fontWeight: 'bold', fontSize: '14px', fontFamily: "'MTNBrighterSans', sans-serif", }}>Partner Name</TableCell>
              <TableCell sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: '#FFCB05', fontWeight: 'bold', fontSize: '14px', fontFamily: "'MTNBrighterSans', sans-serif", }}>Country</TableCell>
              <TableCell sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: '#FFCB05', fontWeight: 'bold', fontSize: '14px', fontFamily: "'MTNBrighterSans', sans-serif", }}>Category</TableCell>
              <TableCell sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: '#FFCB05', fontWeight: 'bold', fontSize: '14px', fontFamily: "'MTNBrighterSans', sans-serif", }}>Network Type</TableCell>
              <TableCell sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: '#FFCB05', fontWeight: 'bold', fontSize: '14px', fontFamily: "'MTNBrighterSans', sans-serif", }}>RDC Percentage</TableCell>
              <TableCell sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: '#FFCB05', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', fontFamily: "'MTNBrighterSans', sans-serif", }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow key={row.id || index} hover sx={{ '&:hover': { backgroundColor: '#fafafa' }, transition: 'background-color 0.3s ease', }}>
                  <TableCell sx={{ fontSize: '0.875rem', color: '#424242', fontFamily: "'MTNBrighterSans', sans-serif" }}>{row.id}</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: '#424242', fontFamily: "'MTNBrighterSans', sans-serif" }}>{row.partnerName}</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: '#424242', fontFamily: "'MTNBrighterSans', sans-serif" }}>{row.countryName}</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: '#424242', fontFamily: "'MTNBrighterSans', sans-serif" }}>{row.category}</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: '#424242', fontFamily: "'MTNBrighterSans', sans-serif" }}>{row.networkType}</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: '#424242', fontFamily: "'MTNBrighterSans', sans-serif" }}>{row.rdc}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Tooltip title="View">
                      <IconButton color="primary" aria-label="view" onClick={() => handleOpenViewPartnerModal(row)}>
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit">
                      <IconButton color="primary" aria-label="edit" onClick={() => handleOpenEditPartnerModal(row)}>
                        <BorderColorIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <DeletePartnerModal id={row.id} refreshTable={refreshTable} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ fontFamily: "'MTNBrighterSans', sans-serif" }}>No data available</TableCell>
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
          sx={{ borderTop: '1px solid #e0e0e0', margin: '20px 0', fontFamily: "'MTNBrighterSans', sans-serif" }}
        />

        {/* Modals for Adding, Editing, and Viewing Partners */}
        <AddPartner open={openAddPartner} handleClose={handleCloseAddPartner} refreshTable={refreshTable} />

        <EditPartner
          open={openEditPartner}
          handleClose={handleCloseEditPartnerModal}
          partnerId={selectedPartner?.id} // Pass the correct partnerId
          refreshTable={refreshTable}
        />

        <ViewModal
          open={openViewModal}
          handleClose={handleCloseViewPartnerModal}
          partnerId={selectedPartner?.id} // Pass the correct partnerId for viewing
        />
      </TableContainer>
    </>
  );
}

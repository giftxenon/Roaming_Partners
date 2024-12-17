import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AddCountry from './AddCountry'; // Import your component
import AddTariff from './AddTariffs'; // Import your component
import AddTariffToCountry from './AddTTC'; // Import your component
import AddIcon from "@mui/icons-material/Add";
import Dialog from '@mui/material/Dialog';
import { amber } from "@mui/material/colors";

export default function DropDownMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = (dialogType) => {
    setDialogOpen(dialogType);
    handleClose();
  };

  const handleCloseDialog = () => {
    setDialogOpen(null);
  };

  return (
    <div>
      {/* Button to trigger the dropdown menu */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon sx={{ color: "black" }} />}
        sx={{
          my:2,
          ml:5,
        
          color: "black",
          backgroundColor: "#FFCB05",
          "&:hover": {
            backgroundColor: amber[400],
          },
          width: '168px', 
          height: '35px', 
          fontSize: '0.75rem', 
        }}
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        Add Particulars
      </Button>

      {/* Dropdown menu */}
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleOpenDialog('country')}>
          Add Country
        </MenuItem>
        <MenuItem onClick={() => handleOpenDialog('tariff')}>
          Add Tariff To Partner
        </MenuItem>
        <MenuItem onClick={() => handleOpenDialog('tariffToCountry')}>
          Add Tariff To Country
        </MenuItem>
      </Menu>

      {/* Modals/Dialogs */}
      <Dialog open={dialogOpen === 'country'} onClose={handleCloseDialog}>
        <AddCountry open={dialogOpen === 'country'} handleClose={handleCloseDialog} />
      </Dialog>
      <Dialog open={dialogOpen === 'tariff'} onClose={handleCloseDialog}>
        <AddTariff open={dialogOpen === 'tariff'} handleClose={handleCloseDialog} />
      </Dialog>
      <Dialog open={dialogOpen === 'tariffToCountry'} onClose={handleCloseDialog}>
        <AddTariffToCountry open={dialogOpen === 'tariffToCountry'} handleClose={handleCloseDialog} />
      </Dialog>
    </div>
  );
}

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { IconButton, Tooltip } from "@mui/material";
import { BACKEND_DOMAIN } from '../api_host';

export default function DeletePartnerModal({ id, refreshTable }) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BACKEND_DOMAIN}/api/partners/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        refreshTable(); // Refresh the table after deletion
        handleClose(); // Close the dialog after successful deletion
      } else {
        alert("Cannot delete partner with tariff plans associated with it.");
      }
    } catch (error) {
      console.error('Error deleting partner:', error);
      alert('An error occurred while trying to delete the partner.');
    }
  };

  return (
    <React.Fragment>
      <Tooltip title="Delete" arrow>
        <IconButton
          sx={{ color: "#e57373" }}
          aria-label="delete"
          component="span"
          onClick={handleClick}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete this partner?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Once deleted, this action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete Partner
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

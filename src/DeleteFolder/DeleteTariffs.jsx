import { useState } from 'react';
import { IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { BACKEND_DOMAIN } from '../api_host';

export default function DeleteTariffs({ id, onDelete }) {
  const [open, setOpen] = useState(false); // State to control the confirmation dialog

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BACKEND_DOMAIN}/api/tariffs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        alert('Tariff deleted successfully');
        onDelete(id);  // Trigger the onDelete function to update the table
      } else {
        alert('Error deleting tariff: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting tariff:', error);
    } finally {
      handleClose();  // Close the confirmation dialog
    }
  };

  return (
    <>
      <IconButton aria-label="delete" color="error" onClick={handleClickOpen}>
        <DeleteIcon />
      </IconButton>

      {/* Confirmation Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-confirmation-dialog"
        aria-describedby="delete-confirmation-description"
      >
        <DialogTitle id="delete-confirmation-dialog">
          {"Delete Tariff?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-confirmation-description">
            Are you sure you want to delete this tariff? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

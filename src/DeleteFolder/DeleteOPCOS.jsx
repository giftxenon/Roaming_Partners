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

export default function DeleteOpcos({ id, onDelete }) { // Pass onDelete as a prop to update UI after delete
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('accessToken'); // Get token for authorization

      const response = await fetch(`${BACKEND_DOMAIN}/api/opco-tariffs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Add the token to headers
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('Delete successful:', await response.json());
        if (onDelete) {
          onDelete(id); // Call onDelete callback if provided to update the UI
        }
      } else {
        console.error('Delete failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting:', error);
    } finally {
      handleClose(); // Close the dialog after attempting delete
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
        <DialogTitle id="alert-dialog-title">Delete OPCOS tariffs?</DialogTitle>
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
            Delete OPCOS Tariffs
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

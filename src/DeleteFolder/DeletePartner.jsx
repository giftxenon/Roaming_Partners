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


export default function DeletePartner({ id }) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${BACKEND_DOMAIN}/api/partners${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Delete successful:', await response.json());
        // You can add any additional logic here, such as updating the UI or notifying the user
      } else {
        console.error('Delete failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting:', error);
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

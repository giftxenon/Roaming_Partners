import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Tooltip, IconButton, Divider, Typography, Grid } from '@mui/material';
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { BACKEND_DOMAIN } from '../api_host';

export default function ViewModal({ partnerId }) {
  const [open, setOpen] = useState(false);
  const [partnerDetails, setPartnerDetails] = useState(null); // Store fetched partner details

  const handleClickOpen = async () => {
    setOpen(true);
    // Fetch partner details when the modal opens
    if (partnerId) {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${BACKEND_DOMAIN}/api/partners/${partnerId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPartnerDetails(data.data); // Store partner data
      } catch (error) {
        console.error('Error fetching partner details:', error);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Tooltip title="view" arrow>
        <IconButton color="primary" aria-label="view" onClick={handleClickOpen}>
          <VisibilityOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
          Partner Details
        </DialogTitle>
        <DialogContent>
          {partnerDetails ? (
            <Box sx={{ padding: 2 }}>
              <Grid container spacing={2}>
                {/* Partner Name and Network Type */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Partner Name</Typography>
                  <Typography variant="h6" gutterBottom>{partnerDetails.partnerName}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Network Type</Typography>
                  <Typography variant="h6" gutterBottom>{partnerDetails.networkType}</Typography>
                </Grid>

                {/* Mechanism */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">Mechanism</Typography>
                  <Typography variant="h6" gutterBottom>{partnerDetails.mechanism}</Typography>
                </Grid>

                {/* MCC and MNC */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">MCC / MNC</Typography>
                  <Typography variant="h6" gutterBottom>{partnerDetails.mcc} / {partnerDetails.mnc}</Typography>
                </Grid>

                {/* Preferred Partner */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Preferred Partner</Typography>
                  <Typography variant="h6" gutterBottom>
                    {partnerDetails.networkType === 'P' ? "Yes" : "No"}
                  </Typography>
                </Grid>

                {/* Divider */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>

                {/* Additional Information */}
                
              </Grid>
            </Box>
          ) : (
            <Typography>Loading details...</Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

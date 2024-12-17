import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Box, Grid, Divider } from '@mui/material';
import { BACKEND_DOMAIN } from '../api_host';

export default function ViewModal({ open, handleClose, partnerId }) {
  const [partnerDetails, setPartnerDetails] = useState(null); // Store fetched partner details

  useEffect(() => {
    if (open && partnerId) {
      console.log("Fetching partner details for ID:", partnerId);
      const fetchPartnerDetails = async () => {
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
          console.log("Fetched partner details:", data.data);
          setPartnerDetails(data.data); // Store partner data
        } catch (error) {
          console.error('Error fetching partner details:', error);
        }
      };
      fetchPartnerDetails(); // Fetch data when modal is open
    }
  }, [open, partnerId]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
        Partner Details
      </DialogTitle>
      <DialogContent>
        {partnerDetails ? (
          <Box sx={{ padding: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">Partner Name</Typography>
                <Typography variant="h6" gutterBottom>{partnerDetails.partnerName}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">Network Type</Typography>
                <Typography variant="h6" gutterBottom>{partnerDetails.networkType}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">Mechanism</Typography>
                <Typography variant="h6" gutterBottom>{partnerDetails.mechanism}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">MCC / MNC</Typography>
                <Typography variant="h6" gutterBottom>{partnerDetails.mcc} / {partnerDetails.mnc}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">Preferred Partner</Typography>
                <Typography variant="h6" gutterBottom>
                  {partnerDetails.networkType === 'P' ? "Yes" : "No"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
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
  );
}

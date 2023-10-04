import React, { useState, useEffect } from "react";
import { Autocomplete, Box, Grid, Snackbar, IconButton } from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomButton } from "../../../Components/CustomButton";
import CustomerServices from "../../../services/CustomerService";
import LeadServices from "../../../services/LeadService";
import CustomTextField from "../../../Components/CustomTextField";

export const BulkCustomerAssign = (props) => {
  const { setOpenPopup, setOpenSnackbar } = props;
  const [open, setOpen] = useState(false);
  const [assignFrom, setAssignFrom] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [assigned, setAssigned] = useState([]);

  useEffect(() => {
    getLAssignedData();
  }, []);

  const getLAssignedData = async (id) => {
    try {
      setOpen(true);
      const res = await LeadServices.getAllAssignedUser();
      setAssigned(res.data);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const AssignBulkLead = async (e) => {
    try {
      setOpen(true);
      e.preventDefault();
      const req = {
        assign_from: assignFrom,
        assign_to: assignTo,
      };
      await CustomerServices.BulCustomerAssign(req);
      setOpenPopup(false);
      setOpen(false);
      // Show success snackbar
      setOpenSnackbar(true);
    } catch (err) {
      console.error(err);
      setOpen(false);
    }
  };

  return (
    <>
      <CustomLoader open={open} />

      <Box component="form" noValidate onSubmit={AssignBulkLead}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              fullWidth
              size="small"
              id="grouped-demo"
              onChange={(event, value) => setAssignFrom(value)}
              options={assigned.map((option) => option.email)}
              getOptionLabel={(option) => option}
              // sx={{ minWidth: 300 }}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label="Assign From"
                  error={assignFrom === assignTo}
                  helperText={
                    assignFrom === assignTo
                      ? "Assign From will not same as Assign To"
                      : ""
                  }
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              fullWidth
              size="small"
              id="grouped-demo"
              onChange={(event, value) => setAssignTo(value)}
              options={assigned.map((option) => option.email)}
              getOptionLabel={(option) => option}
              // sx={{ minWidth: 300 }}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label="Assign To"
                  error={assignFrom === assignTo}
                  helperText={
                    assignFrom === assignTo
                      ? "Assign From will not same as Assign To"
                      : ""
                  }
                />
              )}
            />
          </Grid>
        </Grid>
        <CustomButton
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          text={"Assign"}
        />
      </Box>
    </>
  );
};

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Paper,
  styled,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { CSVLink } from "react-csv";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import CustomSelect from "../../../Components/CustomSelect";

export const ViewMRFProduct = () => {
  const [open, setOpen] = useState(false);
  const [mrfData, setMRFData] = useState([]);

  const [filterByDays, setFilterByDays] = useState("today");
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleDownload = async () => {
    try {
      const data = await handleExport();
      setExportData(data);
      setTimeout(() => {
        csvLinkRef.current.link.click();
      });
      handleSuccess("CSV file downloaded successfully");
    } catch (error) {
      handleError(error);
      console.log("CSVLink Download error", error);
    }
  };

  const headers = [
    { label: "ID", key: "id" },
    { label: "DATE", key: "date" },
    { label: "PRODUCT", key: "product" },
    { label: "UNIT", key: "unit" },
    { label: "QUANTITY", key: "quantity" },
    { label: "BRANCH", key: "branch" },
  ];

  const handleExport = async () => {
    try {
      setOpen(true);
      const response = await InventoryServices.getAllMrfProducts(filterByDays);

      const data = response.data.map((row) => {
        return {
          id: row.id,
          date: row.date,
          product: row.product,
          unit: row.unit,
          quantity: row.quantity,
          branch: row.branch,
        };
      });
      setOpen(false);
      handleSuccess("Exported successfully");
      return data;
    } catch (err) {
      handleError(err);
    } finally {
      setOpen(false);
    }
  };

  const getAllMrfProducts = useCallback(async () => {
    try {
      setOpen(true);

      const response = await InventoryServices.getAllMrfProducts(filterByDays);

      setMRFData(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [filterByDays]);

  useEffect(() => {
    getAllMrfProducts();
  }, [filterByDays]);

  const cleardaysFilter = () => setFilterByDays("");

  const handleDaysFilter = (event) => {
    setFilterByDays(event.target.value);
  };

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2 }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              {/* Left Section: Filter and Search */}
              <Grid item xs={12} sm={3} display="flex" alignItems="center">
                <CustomSelect
                  label="Filter By Days"
                  options={filterDays}
                  value={filterByDays}
                  onChange={handleDaysFilter}
                  onClear={cleardaysFilter}
                />
              </Grid>
              <Grid item xs={12} sm={4} display="flex" justifyContent="center">
                <h3
                  style={{
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                >
                  MRF Products
                </h3>
              </Grid>

              {/* Center Section: Title */}

              {/* Right Section: Add and Download Buttons */}
              <Grid
                item
                xs={12}
                sm={3}
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                gap={2}
              >
                <Button variant="contained" onClick={handleDownload}>
                  Download CSV
                </Button>
                {exportData.length > 0 && (
                  <CSVLink
                    data={exportData}
                    headers={headers}
                    ref={csvLinkRef}
                    filename="MRF Products csv"
                    target="_blank"
                    style={{
                      textDecoration: "none",
                      outline: "none",
                      height: "5vh",
                    }}
                  />
                )}
              </Grid>
            </Grid>
          </Box>
          <TableContainer
            sx={{
              maxHeight: 400,
              "&::-webkit-scrollbar": {
                width: 15,
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f2f2f2",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#aaa9ac",
              },
            }}
          >
            <Table
              sx={{ minWidth: 1200 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center">ID</StyledTableCell>
                  <StyledTableCell align="center">Date</StyledTableCell>
                  <StyledTableCell align="center">Product</StyledTableCell>
                  <StyledTableCell align="center">Unit</StyledTableCell>
                  <StyledTableCell align="center">Quantity</StyledTableCell>
                  <StyledTableCell align="center">Branch</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {mrfData.map((mtnData) => (
                  <React.Fragment key={mtnData.id}>
                    <StyledTableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                      <StyledTableCell align="center">
                        {mtnData.id}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {mtnData.date}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {mtnData.product}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {mtnData.unit}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {mtnData.quantity}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {mtnData.branch}
                      </StyledTableCell>
                    </StyledTableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </>
  );
};

const filterDays = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Month", value: "this_month" },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: 0, // Remove padding from header cells
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: 0, // Remove padding from body cells
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

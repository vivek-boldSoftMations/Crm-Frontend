import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

import "../../CommonStyle.css";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  Button,
  Paper,
  Backdrop,
  CircularProgress,
  styled,
  Box,
  IconButton,
  TextField,
  TableFooter,
  TableContainer,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import AddIcon from "@mui/icons-material/Add";

import ProductService from "../../../services/ProductService";
import SearchIcon from "@mui/icons-material/Search";
import { Paginate } from "../../../Components/Pagination/Paginate";
import CustomAxios from "../../../services/api";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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

export const ViewRawMaterials = () => {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [nextPageUrl, setNextPageUrl] = useState("");
  const [prevPageUrl, setPrevPageUrl] = useState("");

  const getrawMaterials = async () => {
    try {
      setOpen(true);
      const response = await ProductService.getAllRawMaterials();
      setRawMaterials(response.data.results);
      setPrevPageUrl(response.data.previous);
      setNextPageUrl(response.data.next);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      if (!err.response) {
        setErrMsg(
          "“Sorry, You Are Not Allowed to Access This Page” Please contact to admin"
        );
      } else if (err.response.status === 400) {
        setErrMsg(
          err.response.data.errors.name
            ? err.response.data.errors.name
            : err.response.data.errors.non_field_errors
        );
      } else if (err.response.status === 401) {
        setErrMsg(err.response.data.errors.code);
      } else {
        setErrMsg("Server Error");
      }
      errRef.current.focus();
    }
  };

  useEffect(() => {
    getrawMaterials();
  }, []);

  const gotoNextPage = async () => {
    try {
      setOpen(true);
      let response = await CustomAxios.get(nextPageUrl);
      if (response) {
        setRawMaterials(response.data.results);
        setPrevPageUrl(response.data.previous);
        setNextPageUrl(response.data.next);
        setOpen(false);
      }
    } catch (err) {
      setOpen(false);
    }
  };

  const gotoPrevPage = async () => {
    try {
      setOpen(true);
      let response = await CustomAxios.get(prevPageUrl);
      if (response) {
        setRawMaterials(response.data.results);
        setPrevPageUrl(response.data.previous);
        setNextPageUrl(response.data.next);
        setOpen(false);
      }
    } catch (err) {
      console.log("error previous", err);
      setOpen(false);
    }
  };

  const getSearchData = async () => {
    try {
      setOpen(true);
      console.log("searchQuery", searchQuery);
      const response = await ProductService.getAllSearchRawMaterials(
        searchQuery
      );
      if (response) {
        setRawMaterials(response.data.results);
        setPrevPageUrl(response.data.previous);
        setNextPageUrl(response.data.next);
      } else {
        getrawMaterials();
      }
      setOpen(false);
    } catch (error) {
      console.log("error Search leads", error);
      setOpen(false);
    }
  };

  return (
    <>
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>

      <Grid item xs={12}>
        <p
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10,
            borderRadius: 4,
            backgroundColor: errMsg ? "red" : "offscreen",
            textAlign: "center",
            color: "white",
            textTransform: "capitalize",
          }}
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={0.9} align="left">
              <TextField
                onChange={(e) => setSearchQuery(e.target.value)}
                name="search"
                size="small"
                label="Search"
                variant="outlined"
                sx={{ backgroundColor: "#ffffff" }}
              />

              <IconButton
                onClick={getSearchData}
                size="small"
                variant="outlined"
              >
                <SearchIcon />
              </IconButton>
            </Box>
            <Box flexGrow={2} align="center">
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "1em",
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Raw Materials
              </h3>
            </Box>
            <Box flexGrow={0.5} align="right">
              <Button
                component={Link}
                to="/products/create-raw-materials"
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
          </Box>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table
              sx={{ minWidth: 700 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">ID</StyledTableCell>
                  <StyledTableCell align="center">
                    RAW MATERIALS
                  </StyledTableCell>

                  <StyledTableCell align="center">UNIT</StyledTableCell>

                  <StyledTableCell align="center">PRODUCT CODE</StyledTableCell>
                  <StyledTableCell align="center">DESCRIPTION</StyledTableCell>
                  <StyledTableCell align="center">HSN CODE</StyledTableCell>
                  <StyledTableCell align="center">GST%</StyledTableCell>
                  <StyledTableCell align="center">ACTION</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rawMaterials.map((row, i) => {
                  return (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">{row.id}</StyledTableCell>
                      <StyledTableCell align="center">
                        {row.name}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row.unit}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row.productcode}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.description ? row.description : "-"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.hsn_code ? row.hsn_code : ""}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.gst ? `${row.gst}%` : ""}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Link to={"/products/update-raw-materials/" + row.id}>
                          Edit
                        </Link>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TableFooter
            sx={{ display: "flex", justifyContent: "center", marginTop: "1em" }}
          >
            <Paginate
              prevPageUrl={prevPageUrl}
              nextPageUrl={nextPageUrl}
              gotoNextPage={gotoNextPage}
              gotoPrevPage={gotoPrevPage}
            />
          </TableFooter>
        </Paper>
      </Grid>
    </>
  );
};

import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  styled,
  TableCell,
  Button,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  tableCellClasses,
} from "@mui/material";
import { Popup } from "../../../Components/Popup";
import { ApplicantListCreate } from "./ApplicantListCreate";
import { CustomTable } from "../../../Components/CustomTable";
import { CustomPagination } from "../../../Components/CustomPagination";
import Hr from "./../../../services/Hr";
import { CustomLoader } from "../../../Components/CustomLoader";
import SearchComponent from "../../../Components/SearchComponent ";
import CandidateProfile from "./CandidateProfile";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomAxios from "../../../services/api";

export const ApplicantListView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [designations, setDesignations] = useState([]);
  const [department, setDepartment] = useState([]);
  const [filters, setFilters] = useState({
    designations: "",
    department: "",
    stage: "",
    status: "",
  });

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const response = await CustomAxios.get(
          "/api/hr/designation/?type=list"
        );
        console.log("API Response:", response.data);
        setDesignations(response.data);
      } catch (error) {
        console.error("Error fetching designations:", error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await CustomAxios.get("/api/hr/department/");
        const validDepartments = response.data.filter(
          (d) => d.department != null
        );
        setDepartment(validDepartments);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDesignations();
    fetchDepartments();
  }, []);
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenUpdatePopup(true);
  };

  const fetchApplicants = async () => {
    try {
      setIsLoading(true);
      const response = await Hr.getApplicants(
        currentPage,
        searchQuery,
        filters.designations,
        filters.department,
        filters.stage,
        filters.status
      );
      setApplicants(response.data.results);
      const total = response.data.count;
      setTotalPages(Math.ceil(total / 25));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [
    currentPage,
    searchQuery,
    filters.designations,
    filters.department,
    filters.stage,
    filters.status,
  ]);

  const filteredApplicants = applicants.filter((applicant) => {
    const name = applicant.name ? applicant.name.toLowerCase() : "";
    const job = applicant.job ? applicant.job.toLowerCase() : "";
    const email = applicant.email ? applicant.email.toLowerCase() : "";
    const searchLower = searchQuery.toLowerCase();

    return (
      job.includes(searchLower) ||
      email.includes(searchLower) ||
      name.includes(searchLower)
    );
  });

  const addNewApplicant = async (newApplicant) => {
    try {
      setIsLoading(true);
      await Hr.addApplicant(newApplicant);
      fetchApplicants();
      setOpenCreatePopup(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding applicant:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleApplicantAdded = () => {
    fetchApplicants();
    setOpenCreatePopup(false);
  };

  const TableData = filteredApplicants.map((applicant) => ({
    id: applicant.id,
    job: applicant.job,
    name: applicant.name,
    contact: applicant.contact,
    email: applicant.email,
    designation: applicant.designation,
    department: applicant.department,
    stage: applicant.stage,
    status: applicant.status,
    source: applicant.source,
  }));

  const handleFilterChange = (event, value, name) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };
  return (
    <>
      <CustomLoader open={isLoading} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={2}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>
              <Grid item xs={12} sm={10}>
                <Box display="flex" gap="2rem">
                  <CustomAutocomplete
                    fullWidth
                    name="designations"
                    size="small"
                    disablePortal
                    id="combo-box-stage"
                    onChange={(e, value) =>
                      handleFilterChange(e, value, "designations")
                    }
                    options={designations.map((option) => option.designation)}
                    getOptionLabel={(option) => option}
                    label="Filter By Designation"
                  />
                  <CustomAutocomplete
                    fullWidth
                    name="department"
                    size="small"
                    disablePortal
                    id="combo-box-status"
                    onChange={(e, value) =>
                      handleFilterChange(e, value, "department")
                    }
                    options={department.map((option) => option.department)}
                    getOptionLabel={(option) => option}
                    label="Filter By Department"
                  />
                  <CustomAutocomplete
                    fullWidth
                    name="stage"
                    size="small"
                    disablePortal
                    id="combo-box-status"
                    onChange={(e, value) =>
                      handleFilterChange(e, value, "stage")
                    }
                    options={shortList}
                    getOptionLabel={(option) => option}
                    label="Filter By Stage"
                  />
                  <CustomAutocomplete
                    fullWidth
                    name="status"
                    size="small"
                    disablePortal
                    id="combo-box-status"
                    onChange={(e, value) =>
                      handleFilterChange(e, value, "status")
                    }
                    options={status}
                    getOptionLabel={(option) => option}
                    label="Filter By Status"
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box display="flex" justifyContent="center" marginBottom="10px">
            <h3
              style={{
                marginBottom: "1em",
                fontSize: "24px",
                color: "rgb(34, 34, 34)",
                fontWeight: 800,
                textAlign: "center",
              }}
            >
              Candidate List
            </h3>
          </Box>

          <TableContainer
            sx={{
              maxHeight: 440,
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
                <TableRow>
                  <StyledTableCell align="center">Job ID</StyledTableCell>
                  <StyledTableCell align="center">
                    Candidate Name
                  </StyledTableCell>
                  <StyledTableCell align="center">Phone Number</StyledTableCell>
                  <StyledTableCell align="center">Email</StyledTableCell>
                  <StyledTableCell align="center">Designation</StyledTableCell>
                  <StyledTableCell align="center">Department</StyledTableCell>
                  <StyledTableCell align="center">Stage</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell align="center">Source</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applicants.map((row, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="center">{row.job}</StyledTableCell>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.contact}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.email}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.designation}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.department}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.stage}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.status}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.source}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <Button
                        variant="outlined"
                        color="info"
                        size="small"
                        onClick={() => openInPopup(row)}
                      >
                        View
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
          <Popup
            title="Add New Applicant"
            openPopup={openCreatePopup}
            setOpenPopup={setOpenCreatePopup}
          >
            <ApplicantListCreate
              addNewApplicant={addNewApplicant}
              onApplicantAdded={handleApplicantAdded}
            />
          </Popup>
          <Popup
            fullScreen={true}
            title="Candidate Details"
            openPopup={openUpdatePopup}
            setOpenPopup={setOpenUpdatePopup}
          >
            <CandidateProfile candidateData={recordForEdit} />
          </Popup>
        </Paper>
      </Grid>
    </>
  );
};

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

const shortList = ["Screening", "Round1", "Round2"];
const status = [
  "Shortlisted",
  "Selected",
  "Schedule",
  "Reschedule",
  "Rejected",
];

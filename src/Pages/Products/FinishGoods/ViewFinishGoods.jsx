import React, { useEffect, useRef, useState } from "react";
import "../../CommonStyle.css";
import { Grid, Button, Paper, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import ProductService from "../../../services/ProductService";
import { Popup } from "./../../../Components/Popup";
import { CreateFinishGoods } from "./CreateFinishGoods";
import { UpdateFinishGoods } from "./UpdateFinishGoods";
import { ErrorMessage } from "./../../../Components/ErrorMessage/ErrorMessage";
import { CustomSearch } from "./../../../Components/CustomSearch";
import { CustomLoader } from "./../../../Components/CustomLoader";
import { useDispatch } from "react-redux";
import {
  getBasicUnitData,
  getBrandData,
  getColourData,
  getPackingUnitData,
  getUnitData,
} from "../../../Redux/Action/Action";
import { getProductCodeData } from "./../../../Redux/Action/Action";
import { CustomPagination } from "./../../../Components/CustomPagination";
import { CustomTable } from "../../../Components/CustomTable";

export const ViewFinishGoods = () => {
  const dispatch = useDispatch();
  const [finishGood, setFinishGood] = useState([]);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);

  useEffect(() => {
    getPackingUnits();
  }, []);

  const getPackingUnits = async () => {
    try {
      const res = await ProductService.getAllPaginatePackingUnit("all");
      dispatch(getPackingUnitData(res.data));
    } catch (err) {
      console.log("error PackingUnit finishGoods", err);
    }
  };

  useEffect(() => {
    getBrandList();
  }, []);

  const getBrandList = async () => {
    try {
      const res = await ProductService.getAllPaginateBrand("all");
      dispatch(getBrandData(res.data));
    } catch (err) {
      console.log("error finishGoods :>> ", err);
    }
  };

  useEffect(() => {
    getColours();
  }, []);

  const getColours = async () => {
    try {
      const res = await ProductService.getAllPaginateColour("all");
      dispatch(getColourData(res.data));
    } catch (err) {
      console.log("err Colour FinishGoods :>> ", err);
    }
  };

  useEffect(() => {
    getproductCodes();
  }, []);

  const getproductCodes = async () => {
    try {
      const res = await ProductService.getAllPaginateProductCode("all");
      dispatch(getProductCodeData(res.data));
    } catch (err) {
      console.log("error ProductCode finishGoods", err);
    }
  };

  useEffect(() => {
    getUnits();
  }, []);

  const getUnits = async () => {
    try {
      const res = await ProductService.getAllPaginateUnit("all");
      dispatch(getUnitData(res.data));
    } catch (err) {
      console.log("error unit finishGoods", err);
    }
  };

  useEffect(() => {
    getBasicUnit();
  }, []);

  const getBasicUnit = async () => {
    try {
      const res = await ProductService.getAllPaginateBasicUnit("all");
      dispatch(getBasicUnitData(res.data));
    } catch (err) {
      console.log("error :>> ", err);
    }
  };

  const getFinishGoods = async () => {
    try {
      setOpen(true);
      if (currentPage) {
        const response = await ProductService.getFinishGoodsPaginate(
          currentPage
        );
        setFinishGood(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        const response = await ProductService.getAllFinishGoods();

        setFinishGood(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      }
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
    getFinishGoods();
  }, []);

  const handlePageChange = async (event, value) => {
    try {
      const page = value;
      setCurrentPage(page);
      setOpen(true);
      if (searchQuery) {
        const response = await ProductService.getFinishGoodsPaginateWithSearch(
          page,
          searchQuery
        );
        if (response) {
          setFinishGood(response.data.results);
          const total = response.data.count;
          setpageCount(Math.ceil(total / 25));
        } else {
          getFinishGoods();
          setSearchQuery("");
        }
      } else {
        const response = await ProductService.getFinishGoodsPaginate(page);
        setFinishGood(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      }
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    getSearchData(event.target.value);
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;

      const response = await ProductService.getAllSearchFinishGoods(
        filterSearch
      );
      if (response) {
        setFinishGood(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        getFinishGoods();
        setSearchQuery("");
      }

      setOpen(false);
    } catch (error) {
      console.log("error Search leads", error);
    } finally {
      setOpen(false);
    }
  };

  const getResetData = () => {
    setSearchQuery("");
    getFinishGoods();
  };

  const openInPopup = (item) => {
    setRecordForEdit(item.id);
    setOpenPopup(true);
  };

  const TableHeader = [
    "ID",
    "FINISH GOODS",
    "UNIT",
    "BRAND",
    "PRODUCT CODE",
    "DESCRIPTION",
    "HSN CODE",
    "GST%",
    "ACTION",
  ];

  const TableData = finishGood.map((value) => ({
    id: value.id,
    name: value.name,
    unit: value.unit,
    brand: value.brand,
    productcode: value.productcode,
    description: value.description,
    hsn_code: value.hsn_code,
    gst: value.gst,
  }));

  return (
    <>
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={0.9}>
              <CustomSearch
                filterSelectedQuery={searchQuery}
                handleInputChange={handleInputChange}
                getResetData={getResetData}
              />
            </Box>
            <Box flexGrow={2}>
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "1em",
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Finish Goods
              </h3>
            </Box>
            <Box flexGrow={0.5} align="right">
              <Button
                onClick={() => setOpenPopup2(true)}
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
          </Box>
          {/* CustomTable */}
          <CustomTable
            headers={TableHeader}
            data={TableData}
            openInPopup={openInPopup}
          />
          <CustomPagination
            pageCount={pageCount}
            handlePageClick={handlePageChange}
          />
        </Paper>
      </Grid>
      <Popup
        title={"Create FinishGoods"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateFinishGoods
          getFinishGoods={getFinishGoods}
          setOpenPopup={setOpenPopup2}
        />
      </Popup>
      <Popup
        title={"Update FinishGoods"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateFinishGoods
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenPopup}
          getFinishGoods={getFinishGoods}
        />
      </Popup>
    </>
  );
};

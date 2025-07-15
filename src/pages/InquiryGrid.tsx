import React, { useEffect, useRef, useState } from 'react';
import { DataGrid, GridCloseIcon, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Button, Stack, Box, Modal, Typography, DialogActions, DialogTitle, Dialog, DialogContent, DialogContentText, IconButton, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import api from '../context/AxiosContext';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from "html2canvas";
import html2pdf from 'html2pdf.js';
import { MotorMapping } from './InquiryForm';
import CircularProgress from '@mui/material/CircularProgress'; // MUI Loader component
import SectionHeader from './SectionHeader';
import marathon from '../assets/marathon.png';
import weg from '../assets/weg.png';




interface InquiryFormData {
  inquiryId: number;
  customerType: string;
  customerName: string;
  customerId: number;
  region: string;
  city: string;
  state: string;
  country: string;
  salutation: string;
  cpfirstName: string;
  cplastName: string;
  enquiryNo: string;
  enquiryDate: Date;
  rfqNo: string;
  rfqDate: Date;
  stdPaymentTerms: string;
  stdIncoTerms: string;
  listPrice: number;
  discount: number;
  netPriceWithoutGST: number;
  totalPackage: number;
  status: string;
  offerStatus: string;
  createdOn: Date;
  createdBy: string;
  updatedOn: Date;
  updatedBy: string;
  custPhoneNo: string;
  custAddress: string;
  custEmail: string;
  customerRfqno: string;
  lostReason: string;
  customerRfqdate: Date;
  offerDueDate: Date;
  technicaldetailsmappings: MotorMapping[];
  selectedCurrency: any,
}




const cellStyle: React.CSSProperties = {
  border: '1px solid black',
  padding: '4px 8px',
  textAlign: 'center',
  fontWeight: 'bold',
};

const cellStyleNew: React.CSSProperties = {
  border: '1px solid black',
  padding: '4px 8px',
  textAlign: 'center',
  fontWeight: 'bold',
};
const cellStyleHeader: React.CSSProperties = {
  border: '1px solid black',
  padding: '6px',
  fontWeight: 'bold',
  textAlign: 'left',
  verticalAlign: 'top',
};

const cellStyleValue: React.CSSProperties = {
  border: '1px solid black',
  padding: '6px',
  textAlign: 'left',
  verticalAlign: 'top'
};


const InquiryGrid = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<any[]>([]);
  const [rowsAll, setRowsAll] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedTechnicalDetails, setSelectedTechnicalDetails] = useState<any[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedInquiryId, setSelectedInquiryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [customerNameFilter, setCustomerNameFilter] = useState('');
  const [customerTypeFilter, setCustomerTypeFilter] = useState('');
  const statusOptions = ['Draft', 'Offer Sent'];
  const regionOptions = ['North', 'South', 'East', 'West'];
  const [customerNameOptions, setCustomerNameOptions] = useState<string[]>([]); // Use useState to store the options
  const [customerTypeOptions, setCustomerTypeOptions] = useState<string[]>([]); // Use useState to store the options
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });


  // const printRef = useRef<HTMLDivElement>(null);

  const imageList = [
    'marathon.png',
    'weg.png',
    'cemp.png',
    'bharatbijlee.jpg',
    'wolong.png',
    'offerImage.jpg',
    'wolongatb.png',
    'brookcromton.png',
    'General_Electric_logo.svg.png',
    'kirloskar.jpg',
    'hindustanelectric.jpeg',
    'schorch.jpeg',
  ];

  const [formDataAll, setFormDataAll] = useState<InquiryFormData>({
    inquiryId: 0,
    customerType: '',
    customerName: '',
    customerId: 0,
    region: '',
    city: '',
    state: '',
    country: '',
    salutation: '',
    cpfirstName: '',
    cplastName: '',
    enquiryNo: '',
    enquiryDate: new Date(),
    rfqNo: '',
    rfqDate: new Date(),
    stdPaymentTerms: '',
    stdIncoTerms: '',
    listPrice: 0,
    discount: 0,
    netPriceWithoutGST: 0,
    totalPackage: 0,
    status: 'Draft',
    offerStatus: '',
    createdOn: new Date(),
    createdBy: '',
    updatedOn: new Date(),
    updatedBy: '',
    custPhoneNo: '',
    custAddress: '',
    custEmail: '',
    customerRfqno: '',
    lostReason: '',
    customerRfqdate: new Date(),
    offerDueDate: new Date(),
    technicaldetailsmappings: [],
    selectedCurrency: "INR",
  });


  const [formData, setFormData] = useState<InquiryFormData>({
    inquiryId: 0,
    customerType: '',
    customerName: '',
    customerId: 0,
    region: '',
    city: '',
    state: '',
    country: '',
    salutation: '',
    cpfirstName: '',
    cplastName: '',
    enquiryNo: '',
    enquiryDate: new Date(),
    rfqNo: '',
    rfqDate: new Date(),
    stdPaymentTerms: '',
    stdIncoTerms: '',
    listPrice: 0,
    discount: 0,
    netPriceWithoutGST: 0,
    totalPackage: 0,
    status: 'Draft',
    offerStatus: '',
    createdOn: new Date(),
    createdBy: '',
    updatedOn: new Date(),
    updatedBy: '',
    custPhoneNo: '',
    custAddress: '',
    custEmail: '',
    customerRfqno: '',
    lostReason: '',
    customerRfqdate: new Date(),
    offerDueDate: new Date(),
    selectedCurrency: "INR",
    technicaldetailsmappings: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [statusFilter, regionFilter, customerNameFilter, customerTypeFilter, rowsAll]);


  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('Inquiry');
      // Use a type assertion to tell TypeScript that response.data is an array of objects
      const uniqueCustomerNames = [
        ...new Set((response.data as { customerName: string }[]).map((row) => row.customerName)),
      ];
      setCustomerNameOptions(uniqueCustomerNames); // Use setCustomerNameOptions to update the options
      const uniqueCustomerTypes = [
        ...new Set((response.data as { customerType: string }[]).map((row) => row.customerType)),
      ];
      setCustomerTypeOptions(uniqueCustomerTypes); // Use setCustomerNameOptions to update the options
      setRowsAll(response.data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    console.log('Edit Inquiry ID:', id);
    navigate('/inquiries/edit/' + id)
  };

  const applyFilters = () => {
    let filtered = [...rowsAll]; // Start with all rows.

    // Apply filters based on the selected criteria
    if (statusFilter) filtered = filtered.filter(r => r.status === statusFilter);
    if (regionFilter) filtered = filtered.filter(r => r.region === regionFilter);
    if (customerNameFilter) filtered = filtered.filter(r => r.customerName === customerNameFilter);
    if (customerTypeFilter) filtered = filtered.filter(r => r.customerType === customerTypeFilter);

    setRows(filtered); // Update the rows with the filtered data.
  };

  // Make sure to call applyFilters whenever a filter changes:
  const handleStatusChange = (e: SelectChangeEvent) => {
    setStatusFilter(e.target.value); // Update the filter value.
    applyFilters(); // Apply the filter immediately after changing the value.
  };

  const handleRegionChange = (e: SelectChangeEvent) => {
    setRegionFilter(e.target.value); // Update the filter value.
    applyFilters(); // Apply the filter immediately after changing the value.
  };

  const customerNameChange = (e: SelectChangeEvent) => {
    setCustomerNameFilter(e.target.value); // Update the filter value.
    applyFilters(); // Apply the filter immediately after changing the value.
  };

  const customerTypeChange = (e: SelectChangeEvent) => {
    setCustomerTypeFilter(e.target.value); // Update the filter value.
    applyFilters(); // Apply the filter immediately after changing the value.
  };


  const resetFilters = () => {
    setStatusFilter('');
    setRegionFilter('');
    setCustomerNameFilter('');
    setCustomerTypeFilter('');
    setRows(rowsAll); // reset table data to original
  };

  const handleDelete = async (id: number) => {
    setDeleteId(id);
    setConfirmDeleteOpen(true);
    try {
      await api.delete(`Inquiry/delete/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting inquiry:', error);
    }
  };

  // const handleDelete = async (id: number) => {
  //   const isConfirmed = window.confirm('Are you sure you want to delete this inquiry?');
  //   if (!isConfirmed) return;

  //   try {
  //     await api.delete(`Inquiry/delete/${id}`);
  //     fetchData();
  //   } catch (error) {
  //     console.error('Error deleting inquiry:', error);
  //   }
  // };

  const handleOpenTechnicalDetails = (technicalDetails: any[], row: any) => {
    console.log(technicalDetails);
    technicalDetails.forEach((item, index) => {
      item['totalAmount'] = item.amount * item.quantity;
      item['rowIndex'] = index + 1;  // Adding 1 to start row index from 1
    });
    setFormData(row)
    setSelectedTechnicalDetails(technicalDetails || []);
    setOpenModal(true);
  };


  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTechnicalDetails([]);
  };

  const handleOpenConfirmDialog = (id: number) => {
    setSelectedInquiryId(id);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setSelectedInquiryId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedInquiryId !== null) {
      handleDelete(selectedInquiryId);
      handleCloseConfirmDialog();
    }
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inquiries');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'inquiries.xlsx');
  };

  const handleDownload = async () => {
    try {

      setLoading(true); // Show the loader

      formData.technicaldetailsmappings = selectedTechnicalDetails;

      const formDataToSend = new FormData();
      formDataToSend.append("model", JSON.stringify(formData)); // Add only model data

      const response = await api.post(
        'Inquiry/downloadPdf',
        formDataToSend, // This is the actual request body, which is empty
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          responseType: 'blob', // This must go in the 3rd parameter (config), NOT in the body
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = formData.enquiryNo + '.pdf';
      document.body.appendChild(link); // Append to body to ensure it works in all browsers
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Clean up
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setLoading(false); // Hide the loader once the process is done (success or failure)
    }
  };




  const inquiryColumns: GridColDef[] = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      align: 'center',
      renderCell: (params: GridRenderCellParams<any>) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row.inquiryId)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            onClick={() => handleOpenConfirmDialog(params.row.inquiryId)}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            color="info"
            size="small"
            onClick={() => handleOpenTechnicalDetails(params.row.technicaldetailsmappings ?? [], params.row)}
          >
            <VisibilityIcon />
          </IconButton>
          {/* <IconButton
            color="info"
            size="small"
            onClick={handleExportExcel}
          >
            <FileDownloadIcon />
          </IconButton> */}

          {/* <IconButton
            color="info"
            size="small"
          // onClick={() => handleExportPDF(params.row, params.row.technicaldetailsmappings ?? [])}
          // onClick={() => handlePrintPDF}
          >
            <PictureAsPdfIcon />
          </IconButton> */}
        </Stack>
      ),
    },
    // { field: 'inquiryId', headerName: 'Inquiry ID', width: 120 },
    { field: 'customerType', headerName: 'Customer Type',align: 'center', width: 130 },
    { field: 'customerName', headerName: 'Customer Name',align: 'center', width: 150 },
    { field: 'enquiryNo', headerName: 'Enquiry No',align: 'center', width: 150 },
    {
      field: 'enquiryDate',
      headerName: 'Enquiry Date',
      width: 150,
      align: 'center',
      valueFormatter: (params) => {
        const date = new Date(params);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    { field: 'rfqNo', headerName: 'RFQ No',align: 'center', width: 150 },
    {
      field: 'rfqDate',
      headerName: 'RFQ Date',
      width: 150,
      align: 'center',
      valueFormatter: (params) => {
        const date = new Date(params);
        if (isNaN(date.getTime())) return ''; // handle invalid date
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    // {
    //   field: 'listPrice',
    //   headerName: 'List Price',
    //   width: 120,
    //   valueFormatter: (params) => {
    //     const value = Number(params);
    //     return isNaN(value)
    //       ? ''
    //       : value.toLocaleString('en-IN', {
    //         style: 'currency',
    //         currency: 'INR',
    //         minimumFractionDigits: 2,
    //       });
    //   },
    // },
    // { field: 'discount', headerName: 'Discount', width: 120 },
    {
      field: 'totalPackage',
      headerName: 'Total Package',
      width: 150,
      align: 'right',
      valueFormatter: (params: GridRenderCellParams<any>) => {
        const value = Number(params); // ✅ FIXED: get actual value
        const currency = params.row?.selectedCurrency || 'INR'; // use optional chaining just in case

        return isNaN(value)
          ? ''
          : value.toLocaleString(currency === 'INR' ? 'en-IN' : 'en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
          });
      },
    },
    { field: 'status', headerName: 'Status',align: 'center', width: 120 },
    { field: 'offerStatus', headerName: 'Offer Status',align: 'center', width: 120 }
  ];

  const getCurrencyByInquiryId = (id: number, data: any[]): string => {
    const record = data.find((row) => row.inquiryId === id);
    return record?.selectedCurrency || 'INR'; // default to INR if not found
  };

  const groupByBrand = (data: any[]): Record<string, any[]> => {
    return data.reduce((groups, item) => {
      const brand = item.brand || 'Unknown';
      if (!groups[brand]) {
        groups[brand] = [];
      }
      groups[brand].push(item);
      return groups;
    }, {} as Record<string, any[]>);
  };


  const technicalDetailsColumnsAll: GridColDef[] = [
    { field: 'motorType', headerName: 'Motor Type', width: 100, align: 'center', headerAlign: 'center' },
    { field: 'kw', headerName: 'KW', width: 100, align: 'center', headerAlign: 'center' },
    { field: 'pole', headerName: 'Pole', width: 100, align: 'center', headerAlign: 'center' },
    { field: 'frameSize', headerName: 'Frame Size', width: 100, align: 'center', headerAlign: 'center' },
    { field: 'efficiency', headerName: 'Efficiency', width: 100, align: 'center', headerAlign: 'center' },
    { field: 'voltage', headerName: 'Voltage', width: 100, align: 'center', headerAlign: 'center' },
    { field: 'frequency', headerName: 'Frequency', width: 100, align: 'center', headerAlign: 'center' },
    { field: 'narration', headerName: 'Product', width: 100, align: 'center', headerAlign: 'center' },
    {
      field: 'amount',
      headerName: 'Unit Price',
      width: 150,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (params: any) =>
        new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: formData.selectedCurrency || 'INR',
          minimumFractionDigits: 2,
        }).format(Number(params?.value) || 0),
    },
    { field: 'quantity', headerName: 'Quantity', width: 100, align: 'center', headerAlign: 'center' },
    {
      field: 'totalAmount',
      headerName: 'Total',
      width: 150,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (params: any) =>
        new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: formData.selectedCurrency || 'INR',
          minimumFractionDigits: 2,
        }).format(Number(params?.value) || 0),
    }
  ];


  return (
    <>
      {/* Full-screen Loader */}
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(255,255,255,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1300,
          }}
        >
          <CircularProgress size={70} thickness={4.5} color="primary" />
        </Box>
      )}

      {/* <Box mt={3} px={3}> */}
      {/* Top Action Bar */}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        flexWrap="wrap"
        alignItems="flex-start"
        justifyContent="space-start"
        gap={2}
        mb={2}
      >
        <Button variant="contained" color="primary" onClick={() => navigate('/inquiries/new')}>
          Add Inquiry
        </Button>

        <Box display="flex" gap={2} flexWrap="wrap">
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel shrink>Customer Type</InputLabel>
            <Select
              label="Customer Type"
              value={customerTypeFilter}
              onChange={customerTypeChange}
              displayEmpty
              renderValue={(selected) => (selected === '' ? 'All' : selected)}
            >
              <MenuItem value="">All</MenuItem>
              {customerTypeOptions.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel shrink>Region</InputLabel>
            <Select
              label="Region"
              value={regionFilter}
              onChange={handleRegionChange}
              displayEmpty
              renderValue={(selected) => (selected === '' ? 'All' : selected)}
            >
              <MenuItem value="">All</MenuItem>
              {regionOptions.map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel shrink>Customer Name</InputLabel>
            <Select
              label="Customer Name"
              value={customerNameFilter}
              onChange={customerNameChange}
              displayEmpty
              renderValue={(selected) => (selected === '' ? 'All' : selected)}
            >
              <MenuItem value="">All</MenuItem>
              {customerNameOptions.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel shrink>Status</InputLabel>
            <Select
              label="Status"
              value={statusFilter}
              onChange={handleStatusChange}
              displayEmpty
              renderValue={(selected) => (selected === '' ? 'All' : selected)}
            >
              <MenuItem value="">All</MenuItem>
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="outlined" color="secondary" onClick={resetFilters}>
            Reset Filters
          </Button>
        </Box>
        {/* </Box> */}

        {/* Data Table */}
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <Box sx={{ minWidth: 1200 }}>
            {/* <DataGrid
              rows={rows}
              columns={inquiryColumns}
              getRowId={(row) => row.inquiryId}
              paginationModel={{ pageSize: 10, page: 0 }}
              pageSizeOptions={[10, 20, 50]}
              loading={loading}
              autoHeight
              disableRowSelectionOnClick
              sx={{
                '& .MuiDataGrid-cell': {
                  whiteSpace: 'nowrap',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            /> */}


            <DataGrid
              rows={rows}
              columns={inquiryColumns}
              getRowId={(row) => row.inquiryId}
              paginationModel={paginationModel}
              onPaginationModelChange={(model) => setPaginationModel(model)}
              pageSizeOptions={[10, 20, 50]}
              loading={loading}
              autoHeight
              disableRowSelectionOnClick
              sx={{
                '& .MuiDataGrid-cell': {
                  whiteSpace: 'nowrap',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            />

          </Box>
        </Box>




        {/* Modal for Technical Details */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <SectionHeader title="Offer Details" />
            <IconButton
              onClick={handleCloseModal}
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              <GridCloseIcon />
            </IconButton>

            <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
              <img
                src="src/assets/offerImage.jpg"
                alt="Offer Preview"
                style={{ maxHeight: 150, borderRadius: 4 }}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDownload}
                startIcon={<PictureAsPdfIcon />}
              >
                Download PDF
              </Button>
            </Box>
            <Box mb={3} sx={{ fontFamily: 'Arial', fontSize: '14px' }}>

              <Box display="flex" justifyContent="space-between" alignItems="flex-start"></Box>
              {/* Ref and Date */}
              <Box textAlign="left" mb={2}>
                <Typography variant="body2" fontWeight="bold">
                  Ref No: {formData.enquiryNo || 'N/A'}
                </Typography>
                <Typography variant="body2" fontWeight="bold" mt={1}>
                  Date: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </Typography>
              </Box>

              {/* Address Section */}
              <Box mt={3}>
                <Typography><strong>To,</strong></Typography>
                <Typography>{formData.customerName}</Typography>
                <Typography>{formData.custAddress}</Typography>

                <Box mt={2}>
                  <Typography><strong>Kind Attn:</strong> {`${formData.salutation} ${formData.cpfirstName} ${formData.cplastName}`}</Typography>
                  <Typography><strong>RFQ No:</strong> {formData.customerRfqno || 'N/A'}</Typography>
                </Box>

                <Box mt={2}>
                  <Typography>Dear Sir,</Typography>
                  <Typography>
                    We are pleased to offer the following against your enquiry dated{' '}
                    <strong>{new Date(formData.enquiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>:
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* <Box mb={2}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={cellStyleHeader}>CUSTOMER NAME: {formData.customerName}</td>
                    <td style={cellStyleHeader}>SHIPPED TO: {formData.custAddress}</td>
                  </tr>
                  <tr>
                    <td style={cellStyleValue}>
                      ATTENTION: {`${formData.salutation} ${formData.cpfirstName} ${formData.cplastName}`}
                    </td>
                    <td style={cellStyleValue}>
                      INQUIRY DATE: {new Date(formData.enquiryDate).toLocaleDateString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Box> */}

            {/* DataGrid - Technical Summary */}
            {/* <Box sx={{ width: '100%', overflow: 'auto', mb: 4 }}>
              <DataGrid
                rows={selectedTechnicalDetails}
                columns={technicalDetailsColumns}
                getRowId={(row) => row.id || row.rowIndex}
                autoHeight
                hideFooter
                sx={{
                  border: '2px solid black',
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f5f5f5',
                    borderBottom: '2px solid black',
                  },
                  '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {
                    border: '1px solid black',
                    fontSize: '14px',
                    padding: '8px',
                  },
                }}
              />
            </Box> */}

            {/* Full Technical Table - Grouped by Brand */}
            <Box sx={{ width: '100%', overflow: 'hidden', mt: 3 }}>
              {Object.entries(groupByBrand(selectedTechnicalDetails)).map(([brand, rows]) => (
                <Box key={brand} mb={4}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#1a1a1a' }}>
                    Brand: {brand}
                  </Typography>
                  <DataGrid
                    rows={rows}
                    columns={technicalDetailsColumnsAll}
                    getRowId={(row) => row.id || row.rowIndex}
                    autoHeight
                    hideFooter
                    sx={{
                      border: '2px solid black',
                      '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#f5f5f5',
                        borderBottom: '2px solid black',
                      },
                      '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {
                        border: '1px solid black',
                        fontSize: '14px',
                        padding: '8px',
                      },
                    }}
                  />
                  <Box textAlign="right" mt={1}>
                    <Typography variant="body2" fontWeight="bold">
                      Brand Total:{" "}
                      {
                        new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: formData.selectedCurrency || 'INR'
                        }).format(
                          rows.reduce((sum, row) =>
                            sum + ((Number(row.amount) || 0) * (Number(row.quantity) || 0)), 0
                          )
                        )
                      }
                    </Typography>
                  </Box>

                </Box>
              ))}
            </Box>



            {/* Notes */}
            <Box mb={4}>
              {/* <Typography paragraph> */}
              {/* QUOTE INCLUDING SPECIAL OPTION "SPECIAL CABLE ENTRIES" ... */}
              {/* </Typography> */}
              <Typography variant="subtitle1"><strong>Note:</strong></Typography>
              <ul>
                {formData.customerType == 'Export' && (
                  <li>Taxes : Nill</li>
                )}
                {formData.customerType !== 'Export' && (
                  <li>Taxes : 18% GST Extra</li>
                )}
                <li>INCOTerms: {formData.stdIncoTerms}</li>
                <li>Payment Terms: {formData.stdPaymentTerms}</li>
                <li>Validity: {new Date(formData.offerDueDate).toLocaleDateString()}</li>
              </ul>
              {/* <Box */}
              {/* sx={{ */}
              {/* border: '2px solid black', */}
              {/* padding: 2, */}
              {/* mt: 2, */}
              {/* fontSize: '14px', */}
              {/* }} */}
              {/* > */}
              {/* <p><strong>SHIP METHOD:</strong> NA</p> */}
              {/* <p><strong>WARRANTY:</strong> 12 MONTHS...</p> */}
              {/* </Box> */}
            </Box>

            {/* Logos */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 2,
                mt: 4,
              }}
            >
              {imageList.map((file, index) => (
                <img
                  key={index}
                  src={`src/assets/${file}`}
                  alt={file}
                  style={{
                    width: 50,
                    height: 50,
                    objectFit: 'contain',
                    backgroundColor: '#f5f5f5',
                    padding: 4,
                    borderRadius: 4,
                  }}
                />
              ))}
            </Box>

            {/* Close Button */}
            <Box mt={3} textAlign="right">
              <Button variant="contained" onClick={handleCloseModal}>
                Close
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          open={confirmDialogOpen}
          title="Delete Inquiry"
          content="Are you sure you want to delete this inquiry?"
          onClose={handleCloseConfirmDialog}
          onConfirm={handleConfirmDelete}
        />
      </Box>
    </>
  );
};

export default InquiryGrid;

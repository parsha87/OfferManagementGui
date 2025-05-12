import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Button, Stack, Box, Modal, Typography, DialogActions, DialogTitle, Dialog, DialogContent, DialogContentText, IconButton, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import api from '../context/AxiosContext';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

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
  const statusOptions = ['Draft', 'Offer Sent', 'Approved', 'Closed'];
  const regionOptions = ['North', 'South', 'East', 'West'];
  const [customerNameOptions, setCustomerNameOptions] = useState<string[]>([]); // Use useState to store the options
  const [customerTypeOptions, setCustomerTypeOptions] = useState<string[]>([]); // Use useState to store the options



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

  const handleOpenTechnicalDetails = (technicalDetails: any[]) => {
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

  const handleExportPDF = (formData: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;

    // Add title
    doc.setFontSize(18);
    doc.text('Inquiry Details', pageWidth / 2, 15, { align: 'center' });

    // Add basic info
    doc.setFontSize(12);
    doc.text(`Enquiry No: ${formData.enquiryNo}`, margin, 30);
    doc.text(`Enquiry Date: ${formData.enquiryDate}`, margin, 40);
    doc.text(`Status: ${formData.status}`, margin, 50);

    // Add customer details section
    doc.setFontSize(14);
    doc.text('Customer Details', margin, 70);
    doc.setFontSize(12);

    let y = 80;
    doc.text(`Customer Name: ${formData.customerName}`, margin, y);
    y += 10;
    doc.text(`Customer Type: ${formData.customerType}`, margin, y);
    y += 10;
    doc.text(`Email: ${formData.email}`, margin, y);
    y += 10;
    doc.text(`Phone No: ${formData.phoneNo}`, margin, y);
    y += 10;
    doc.text(`Address: ${formData.address}`, margin, y);
    y += 10;
    doc.text(`Region: ${formData.region}`, margin, y);
    y += 10;
    doc.text(`City: ${formData.city}`, margin, y);

    // Add technical details table
    if (formData.techicalDetailsMapping.length > 0) {
      doc.addPage();
      doc.setFontSize(14);
      doc.text('Technical Details', margin, 20);

      const techColumns = [
        { header: 'Motor Type', dataKey: 'motorType' },
        { header: 'KW', dataKey: 'kw' },
        { header: 'HP', dataKey: 'hp' },
        { header: 'Phase', dataKey: 'phase' },
        { header: 'Pole', dataKey: 'pole' },
        { header: 'Qty', dataKey: 'quantity' },
        { header: 'Amount', dataKey: 'amount' }
      ];

      autoTable(doc, {
        startY: 30,
        head: [techColumns.map(col => col.header)],
        body: formData.techicalDetailsMapping.map((detail: any) =>
          techColumns.map(col => detail[col.dataKey])
        ),
        margin: { left: margin }
      });
    }

    // Add other details
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Other Details', margin, 20);
    doc.setFontSize(12);

    y = 30;
    doc.text(`Standard Payment Terms: ${formData.stdPaymentTerms}`, margin, y);
    y += 10;
    doc.text(`Standard Inco Terms: ${formData.stdIncoTerms}`, margin, y);
    y += 20;

    doc.text('Pricing Information', margin, y);
    y += 10;
    doc.text(`List Price: ${formData.listPrice}`, margin, y);
    y += 10;
    doc.text(`Discount: ${formData.discount}`, margin, y);
    y += 10;
    doc.text(`Net Price (without GST): ${formData.netPriceWithoutGST}`, margin, y);
    y += 10;
    doc.text(`Total Package: ${formData.totalPackage}`, margin, y);

    // Add RFQ details
    y += 20;
    doc.setFontSize(14);
    doc.text('RFQ Details', margin, y);
    doc.setFontSize(12);
    y += 10;
    doc.text(`RFQ No: ${formData.rfqNo}`, margin, y);
    y += 10;
    doc.text(`RFQ Date: ${formData.rfqDate}`, margin, y);

    // Save the PDF
    doc.save(`Inquiry_${formData.enquiryNo}.pdf`);
  };

  const inquiryColumns: GridColDef[] = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
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
            onClick={() => handleOpenTechnicalDetails(params.row.techicalDetailsMapping ?? [])}
          >
            <VisibilityIcon />
          </IconButton>
          {/* <IconButton
            color="info"
            size="small"
            onClick={handleExportExcel}
          >
            <FileDownloadIcon />
          </IconButton>

          <IconButton
            color="info"
            size="small"
            onClick={() => handleExportPDF(params.row)}
          >
            <PictureAsPdfIcon />
          </IconButton> */}
        </Stack>
      ),
    },
    // { field: 'inquiryId', headerName: 'Inquiry ID', width: 120 },
    { field: 'customerType', headerName: 'Customer Type', width: 150 },
    { field: 'customerName', headerName: 'Customer Name', width: 180 },
    { field: 'enquiryNo', headerName: 'Enquiry No', width: 150 },
    {
      field: 'enquiryDate',
      headerName: 'Enquiry Date',
      width: 150,
      valueFormatter: (params) => {
        const date = new Date(params);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    { field: 'rfqNo', headerName: 'RFQ No', width: 150 },
    {
      field: 'rfqDate',
      headerName: 'RFQ Date',
      width: 150,
      valueFormatter: (params) => {
        const date = new Date(params);
        if (isNaN(date.getTime())) return ''; // handle invalid date
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    {
      field: 'listPrice',
      headerName: 'List Price',
      width: 120,
      valueFormatter: (params) => {
        const value = Number(params);
        return isNaN(value)
          ? ''
          : value.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
          });
      },
    },
    { field: 'discount', headerName: 'Discount', width: 120 },
    {
      field: 'totalPackage',
      headerName: 'Total Package',
      width: 150,
      valueFormatter: (params) => {
        const value = Number(params);
        return isNaN(value)
          ? ''
          : value.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
          });
      },
    },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'offerStatus', headerName: 'Offer Status', width: 120 }
  ];

  const technicalDetailsColumns: GridColDef[] = [
    { field: 'motorType', headerName: 'Motor Type', width: 130 },
    { field: 'kw', headerName: 'KW', width: 80 },
    { field: 'hp', headerName: 'HP', width: 80 },
    { field: 'phase', headerName: 'Phase', width: 100 },
    { field: 'pole', headerName: 'Pole', width: 80 },
    { field: 'frameSize', headerName: 'Frame Size', width: 100 },
    { field: 'dop', headerName: 'DOP', width: 100 },
    { field: 'insulationClass', headerName: 'Insulation Class', width: 150 },
    { field: 'efficiency', headerName: 'Efficiency', width: 120 },
    { field: 'voltage', headerName: 'Voltage', width: 100 },
    { field: 'frequency', headerName: 'Frequency', width: 100 },
    { field: 'quantity', headerName: 'Quantity', width: 100 },
    { field: 'mounting', headerName: 'Mounting', width: 100 },
    { field: 'safeAreaHazardousArea', headerName: 'Safe Area/Hazardous', width: 180 },
    { field: 'brand', headerName: 'Brand', width: 100 },
    { field: 'application', headerName: 'Application', width: 150 },
    { field: 'segment', headerName: 'Segment', width: 120 },
    { field: 'narration', headerName: 'Narration', width: 200 },
    { field: 'amount', headerName: 'Amount', width: 100 },
  ];

  return (

    <Box mt={3}>
      {/* Top bar with Add button */}
      <Box display="flex" justifyContent="flex-start" mb={2}>
        {/* Add Button */}
        <Button variant="contained" color="primary" onClick={() => navigate('/inquiries/new')}
        >
          Add Inquiry
        </Button>

        <Box display="flex" flexWrap="wrap" alignItems="center" gap={2} ml={2}>
          {/* Filters */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel shrink>Customer Type</InputLabel>
            <Select
              value={regionFilter}
              onChange={customerTypeChange}
              displayEmpty
              renderValue={(selected) => selected === "" ? "All" : selected}             >
              <MenuItem value="">All</MenuItem>
              {customerTypeOptions.map((customerType) => (
                <MenuItem key={customerType} value={customerType}>
                  {customerType}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel shrink>Region</InputLabel>
            <Select
              value={regionFilter}
              onChange={handleRegionChange}
              displayEmpty
              renderValue={(selected) => selected === "" ? "All" : selected}             >
              <MenuItem value="">All</MenuItem>
              {regionOptions.map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel shrink>Customer Name</InputLabel>
            <Select
              value={customerNameFilter}
              onChange={customerNameChange}
              displayEmpty
              renderValue={(selected) => selected === "" ? "All" : selected}            >
              <MenuItem value="">All</MenuItem>
              {customerNameOptions.map((customerName) => (
                <MenuItem key={customerName} value={customerName}>
                  {customerName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel shrink>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={handleStatusChange}
              displayEmpty
              renderValue={(selected) => selected === "" ? "All" : selected}             >
              <MenuItem value="">All</MenuItem>
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box display="flex" flexWrap="wrap" alignItems="center" gap={2} ml={2}></Box>
        <Button variant="contained" color="primary" onClick={resetFilters}>
          Reset Filters
        </Button>
      </Box>
      {/* Scrollable wrapper for table */}
      <Box sx={{ overflowX: 'auto', width: '100%' }}>
        <Box sx={{ minWidth: 1200 }}>
          <DataGrid
            rows={rows}
            columns={inquiryColumns}
            getRowId={(row) => row.inquiryId}
            paginationModel={{ pageSize: 10, page: 0 }}
            pageSizeOptions={[10, 20, 50]}
            loading={loading} // 🔥 this enables the DataGrid's built-in loading UI
          />
        </Box>


      </Box>

      {/* Modal for Technical Details */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="technical-details-title"
        aria-describedby="technical-details-description"
      >
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
          <Typography id="technical-details-title" variant="h6" gutterBottom>
            Technical Details
          </Typography>

          {/* Scrollable technical table */}
          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ minWidth: 1000 }}>
              <DataGrid
                rows={selectedTechnicalDetails}
                columns={technicalDetailsColumns}
                getRowId={(row) => row.id}
                autoHeight
                hideFooter
              />
            </Box>
          </Box>

          <Box mt={2} textAlign="right">
            <Button variant="contained" onClick={handleCloseModal}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialogOpen}
        title="Delete Inquiry"
        content="Are you sure you want to delete this inquiry?"
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default InquiryGrid;

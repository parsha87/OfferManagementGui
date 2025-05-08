import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Button, Stack, Box, Modal, Typography, DialogActions, DialogTitle, Dialog, DialogContent, DialogContentText, IconButton } from '@mui/material';
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
  const [openModal, setOpenModal] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedTechnicalDetails, setSelectedTechnicalDetails] = useState<any[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedInquiryId, setSelectedInquiryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('Inquiry');
      setRows(response.data);
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
        body: formData.techicalDetailsMapping.map((detail:any) =>
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
      width: 250,
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

          <IconButton
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
          </IconButton>
        </Stack>
      ),
    },
    // { field: 'inquiryId', headerName: 'Inquiry ID', width: 120 },
    { field: 'customerType', headerName: 'Customer Type', width: 150 },
    { field: 'customerName', headerName: 'Customer Name', width: 180 },
    { field: 'region', headerName: 'Region', width: 120 },
    { field: 'city', headerName: 'City', width: 120 },
    { field: 'enquiryNo', headerName: 'Enquiry No', width: 150 },
    { field: 'enquiryDate', headerName: 'Enquiry Date', width: 150 },
    { field: 'rfqNo', headerName: 'RFQ No', width: 150 },
    { field: 'rfqDate', headerName: 'RFQ Date', width: 150 },
    { field: 'stdPaymentTerms', headerName: 'Payment Terms', width: 150 },
    { field: 'stdIncoTerms', headerName: 'Inco Terms', width: 150 },
    { field: 'listPrice', headerName: 'List Price', width: 120 },
    { field: 'discount', headerName: 'Discount', width: 120 },
    { field: 'netPriceWithoutGST', headerName: 'Net Price (no GST)', width: 150 },
    { field: 'totalPackage', headerName: 'Total Package', width: 150 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'createdBy', headerName: 'Created By', width: 150 },
    { field: 'createdOn', headerName: 'Created On', width: 150 },
    { field: 'updatedBy', headerName: 'Updated By', width: 150 },
    { field: 'updatedOn', headerName: 'Updated On', width: 150 },

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
        <Button variant="contained" color="primary" onClick={() => navigate('/inquiries/new')}
        >
          Add Inquiry
        </Button>
      </Box>
      {/* Scrollable wrapper for table */}
      <Box sx={{ overflowX: 'auto', width: '100%' }}>
        <Box sx={{ minWidth: 1200 }}>
          <DataGrid
            rows={rows}
            columns={inquiryColumns}
            getRowId={(row) => row.inquiryId}
            autoHeight
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

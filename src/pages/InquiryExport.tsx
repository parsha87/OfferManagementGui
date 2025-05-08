import React, { useEffect, useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import api from '../context/AxiosContext';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const InquiryExport = () => {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('Inquiry');
      setRows(response.data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
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

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      'Customer Name',
      'Region',
      'City',
      'Enquiry No',
      'Status',
      'Created On'
    ];
    const tableRows = rows.map(row => [
      row.customerName,
      row.region,
      row.city,
      row.enquiryNo,
      row.status,
      row.createdOn
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });

    doc.save('inquiries.pdf');
  };

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>
        Export Inquiries
      </Typography>
      <Box display="flex" gap={2} mb={2}>
        <Button variant="contained" color="primary" onClick={handleExportExcel}>
          Export to Excel
        </Button>
        <Button variant="contained" color="secondary" onClick={handleExportPDF}>
          Export to PDF
        </Button>
      </Box>
    </Box>
  );
};

export default InquiryExport;

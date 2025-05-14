import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import config from '../config';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Button, Stack, Box, Modal, Typography, DialogActions, DialogTitle, Dialog, DialogContent, DialogContentText, IconButton, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
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

const Dashboard = () => {
  const [statusData, setStatusData] = useState<{ name: string; value: number }[]>([]);
  const [customerTypeData, setCustomerTypeData] = useState<{ name: string; value: number }[]>([]);
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
  const [fromDateFilter, setFromDateFilter] = useState('');
  const [toDateFilter, setToDateFilter] = useState('');

  const statusOptions = ['Draft', 'Offer Sent', 'Approved', 'Closed'];
  const regionOptions = ['North', 'South', 'East', 'West'];
  const [customerNameOptions, setCustomerNameOptions] = useState<string[]>([]); // Use useState to store the options
  const [customerTypeOptions, setCustomerTypeOptions] = useState<string[]>([]); // Use useState to store the options

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [statusFilter, regionFilter, customerNameFilter, customerTypeFilter, fromDateFilter, toDateFilter, rowsAll]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('Inquiry');
      const inquiries = response.data;
      const uniqueCustomerNames = [
        ...new Set((inquiries as { customerName: string }[]).map((row) => row.customerName)),
      ];
      setCustomerNameOptions(uniqueCustomerNames); // Use setCustomerNameOptions to update the options
      const uniqueCustomerTypes = [
        ...new Set((inquiries as { customerType: string }[]).map((row) => row.customerType)),
      ];
      setCustomerTypeOptions(uniqueCustomerTypes); // Use setCustomerNameOptions to update the options
      setRowsAll(inquiries);

      // Group by status
      const statusCounts: Record<string, number> = {};
      const customerTypeCounts: Record<string, number> = {};

      for (const inquiry of inquiries) {
        const status = inquiry.status || 'Unknown';
        const customerType = inquiry.customerType || 'Unknown';

        statusCounts[status] = (statusCounts[status] || 0) + 1;
        customerTypeCounts[customerType] = (customerTypeCounts[customerType] || 0) + 1;
      }

      setStatusData(
        Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
      );
      setCustomerTypeData(
        Object.entries(customerTypeCounts).map(([name, value]) => ({ name, value }))
      );
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...rowsAll]; // Start with all rows.

    // Apply filters based on the selected criteria
    if (statusFilter) filtered = filtered.filter(r => r.status === statusFilter);
    if (regionFilter) filtered = filtered.filter(r => r.region === regionFilter);
    if (customerNameFilter) filtered = filtered.filter(r => r.customerName === customerNameFilter);
    if (fromDateFilter) filtered = filtered.filter(item => new Date(item.enquiryDate) >= new Date(fromDateFilter));
    if (toDateFilter) filtered = filtered.filter(item => new Date(item.enquiryDate) <= new Date(toDateFilter));

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

  const fromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDateFilter(e.target.value);
    applyFilters();
  };

  const toDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDateFilter(e.target.value);
    applyFilters();
  };


  const resetFilters = () => {
    setStatusFilter('');
    setRegionFilter('');
    setCustomerNameFilter('');
    setCustomerTypeFilter('');
    setFromDateFilter('');
    setToDateFilter('');
    setRows(rowsAll); // reset table data to original
  };


  const inquiryColumns: GridColDef[] = [
    // { field: 'inquiryId', headerName: 'Inquiry ID', width: 120 },
    { field: 'customerType', headerName: 'Customer Type', width: 150 },
    { field: 'customerName', headerName: 'Customer Name', width: 180 },
    { field: 'region', headerName: 'Region', width: 120 },
    { field: 'city', headerName: 'City', width: 120 },
    { field: 'enquiryNo', headerName: 'Enquiry No', width: 150 },
    { field: 'enquiryDate', headerName: 'Enquiry Date', width: 150 },
    { field: 'rfqNo', headerName: 'RFQ No', width: 150 },
    { field: 'rfqDate', headerName: 'RFQ Date', width: 150 },
    // { field: 'stdPaymentTerms', headerName: 'Payment Terms', width: 150 },
    // { field: 'stdIncoTerms', headerName: 'Inco Terms', width: 150 },
    // { field: 'listPrice', headerName: 'List Price', width: 120 },
    // { field: 'discount', headerName: 'Discount', width: 120 },
    // { field: 'netPriceWithoutGST', headerName: 'Net Price (no GST)', width: 150 },
    // { field: 'totalPackage', headerName: 'Total Package', width: 150 },
    { field: 'status', headerName: 'Status', width: 120 },
    // { field: 'createdBy', headerName: 'Created By', width: 150 },
    // { field: 'createdOn', headerName: 'Created On', width: 150 },
    // { field: 'updatedBy', headerName: 'Updated By', width: 150 },
    // { field: 'updatedOn', headerName: 'Updated On', width: 150 },

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
    { field: 'narration', headerName: 'Product Description', width: 200 },
    { field: 'amount', headerName: 'Amount', width: 100 },
  ];


  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTechnicalDetails([]);
  };
  // Create an Axios instance
  const api = axios.create({
    baseURL: config.apiUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Box mt={3}>
        {/* Top bar with Add button */}
        <Box display="flex" justifyContent="flex-start" mb={2}>
          {/* Add Button */}
          {/* <Button variant="contained" color="primary" onClick={() => navigate('/inquiries/new')}
          >
            Add Inquiry
          </Button> */}

          <Box display="flex" flexWrap="wrap" alignItems="center" gap={1} ml={1}>
            {/* Filters */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel shrink>Customer Type</InputLabel>
              <Select
                value={customerTypeFilter}
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

            <TextField
              label="From Date"
              type="date"
              size="small"
              value={fromDateFilter}
              onChange={fromDateChange}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="To Date"
              type="date"
              size="small"
              value={toDateFilter}
              onChange={toDateChange}
              InputLabelProps={{ shrink: true }}

            />
          </Box>

          <Box display="flex" flexWrap="wrap" alignItems="center" gap={2} ml={2}></Box>
          <Button variant="contained" color="primary" onClick={resetFilters}>
            Reset Filters
          </Button>
        </Box>
        {/* Scrollable wrapper for table */}
        <Box sx={{ overflowX: 'auto', width: '100%' }}>
          <Box sx={{ minWidth: 100 }}>
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

      </Box>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="shadow-lg p-4 rounded-xl bg-white">
          <h2 className="text-xl font-bold mb-4">Inquiry Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="shadow-lg p-4 rounded-xl bg-white">
          <h2 className="text-xl font-bold mb-4">Customer Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={customerTypeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
              >
                {customerTypeData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

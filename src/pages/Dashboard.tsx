import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import config from '../config';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Button, Stack, Box, Modal, Typography, DialogActions, DialogTitle, Dialog, DialogContent, DialogContentText, IconButton, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Grid, CardContent, Card } from '@mui/material';
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
import { TooltipProps } from 'recharts';


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
  const [offerStatusFilter, setOfferStatusFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [customerNameFilter, setCustomerNameFilter] = useState('');
  const [customerTypeFilter, setCustomerTypeFilter] = useState('');

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  const firstDay = new Date(currentYear, currentMonth - 2, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);

  // Format to YYYY-MM-DD in local time (not UTC!)
  const formatDate = (date: Date) =>
    new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];

  const [fromDateFilter, setFromDateFilter] = useState(formatDate(firstDay));
  const [toDateFilter, setToDateFilter] = useState(formatDate(lastDay));

  // const [fromDateFilter, setFromDateFilter] = useState('');
  // const [toDateFilter, setToDateFilter] = useState('');

  const statusOptions = ['Draft', 'Offer Sent', 'Approved', 'Closed'];
  const regionOptions = ['North', 'South', 'East', 'West'];
  const offerStatusOptions = ['Budgetary', "Live", 'Won', 'Lost', 'Hold'];
  const [customerNameOptions, setCustomerNameOptions] = useState<string[]>([]);
  const [customerTypeOptions, setCustomerTypeOptions] = useState<string[]>([]);
  // const [monthlyData, setMonthlyData] = useState<{ name: string; value: number }[]>([]);
  const [monthlyStatusData, setMonthlyStatusData] = useState<any[]>([]);
  const [monthlyOfferStatusData, setMonthlyOfferStatusData] = useState<any[]>([]);


  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [statusFilter, regionFilter, customerNameFilter, customerTypeFilter, fromDateFilter, toDateFilter, offerStatusFilter, rowsAll]);

  useEffect(() => {
    filterByDateOnly();
  }, [fromDateFilter, toDateFilter, rowsAll]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('Inquiry');
      const inquiries = response.data;
      const uniqueCustomerNames = [
        ...new Set((inquiries as { customerName: string }[]).map((row) => row.customerName)),
      ];
      setCustomerNameOptions(uniqueCustomerNames);
      const uniqueCustomerTypes = [
        ...new Set((inquiries as { customerType: string }[]).map((row) => row.customerType)),
      ];
      setCustomerTypeOptions(uniqueCustomerTypes);
      setRowsAll(inquiries);
      updateChartData(inquiries); // Initialize charts with all data
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateChartData = (data: any[]) => {
    // Group by status
    const statusCounts: Record<string, number> = {};
    const customerTypeCounts: Record<string, number> = {};

    for (const inquiry of data) {
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
  };

  const applyFilters = () => {
    let filtered = [...rowsAll];

    // Apply filters based on the selected criteria
    if (statusFilter) filtered = filtered.filter(r => r.status === statusFilter);
    if (offerStatusFilter) filtered = filtered.filter(r => r.offerStatus === offerStatusFilter);
    if (regionFilter) filtered = filtered.filter(r => r.region === regionFilter);
    if (customerNameFilter) filtered = filtered.filter(r => r.customerName === customerNameFilter);
    if (customerTypeFilter) filtered = filtered.filter(r => r.customerType === customerTypeFilter);
    if (fromDateFilter) filtered = filtered.filter(item => new Date(item.enquiryDate) >= new Date(fromDateFilter));
    if (toDateFilter) filtered = filtered.filter(item => new Date(item.enquiryDate) <= new Date(toDateFilter));

    setRows(filtered);
    updateChartData(filtered);
    updateMonthlyOfferStatusData(filtered);
    updateMonthlyStatusData(filtered);


  };

  const filterByDateOnly = () => {
    let filtered = [...rowsAll];

    if (fromDateFilter)
      filtered = filtered.filter(item => new Date(item.enquiryDate) >= new Date(fromDateFilter));

    if (toDateFilter)
      filtered = filtered.filter(item => new Date(item.enquiryDate) <= new Date(toDateFilter));

    updateChartData(filtered);
  };


  const handleStatusChange = (e: SelectChangeEvent) => {
    setStatusFilter(e.target.value);
  };

  const handleOfferStatusChange = (e: SelectChangeEvent) => {
    setOfferStatusFilter(e.target.value);
  };

  const handleRegionChange = (e: SelectChangeEvent) => {
    setRegionFilter(e.target.value);
  };

  const customerNameChange = (e: SelectChangeEvent) => {
    setCustomerNameFilter(e.target.value);
  };

  const customerTypeChange = (e: SelectChangeEvent) => {
    setCustomerTypeFilter(e.target.value);
  };

  const fromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDateFilter(e.target.value);
  };

  const toDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDateFilter(e.target.value);
  };

  const resetFilters = () => {
    setStatusFilter('');
    setOfferStatusFilter('');
    setRegionFilter('');
    setCustomerNameFilter('');
    setCustomerTypeFilter('');
    setFromDateFilter('');
    setToDateFilter('');
    setRows(rowsAll);
    updateChartData(rowsAll); // Reset charts to show all data
  };

  const inquiryColumns: GridColDef[] = [
    { field: 'customerType', headerName: 'Customer Type', width: 110 },
    { field: 'customerName', headerName: 'Customer Name', width: 150 },
    // { field: 'region', headerName: 'Region', width: 120 },
    // { field: 'city', headerName: 'City', width: 120 },
    { field: 'enquiryNo', headerName: 'Enquiry No', width: 150 },
    {
      field: 'enquiryDate', headerName: 'Enquiry Date', valueFormatter: (params) => {
        const date = new Date(params);
        if (isNaN(date.getTime())) return ''; // handle invalid date
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }, width: 150
    },
    { field: 'rfqNo', headerName: 'RFQ No', width: 150 },
    {
      field: 'rfqDate', headerName: 'RFQ Date', valueFormatter: (params) => {
        const date = new Date(params);
        if (isNaN(date.getTime())) return ''; // handle invalid date
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }, width: 150
    },
    {
      field: 'totalPackage', headerName: 'Total Package', valueFormatter: (params) => {
        const value = Number(params);
        return isNaN(value)
          ? ''
          : value.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
          });
      }, width: 150
    },
    { field: 'status', headerName: 'Inquiry Status', width: 100 },
    { field: 'offerStatus', headerName: 'Offer Status', width: 100 },
  ];



  const updateMonthlyStatusData = (data: any[]) => {
    // Create a map from month-year to status counts
    const monthlyMap: Record<string, Record<string, number>> = {};

    data.forEach(inquiry => {
      const date = new Date(inquiry.enquiryDate);
      if (!isNaN(date.getTime())) {
        const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!monthlyMap[monthYear]) {
          monthlyMap[monthYear] = {};
        }
        const status = inquiry.status || 'Unknown';
        monthlyMap[monthYear][status] = (monthlyMap[monthYear][status] || 0) + 1;

        const packageAmount = parseFloat(inquiry.totalPackage) || 0;
        // 💰 Sum `totalPackage` grouped by offerStatus
        monthlyMap[monthYear][status] = (monthlyMap[monthYear][status] || 0) + packageAmount;
      }
    });

    // Convert monthlyMap to array format
    // const result = Object.entries(monthlyMap).map(([monthYear, statusCounts]) => {
    //   return {
    //     name: monthYear,
    //     ...statusCounts,
    //   };
    // });
    // Convert map to chart-friendly array, and add total sum of all statuses
    const result = Object.entries(monthlyMap).map(([monthYear, statusSums]) => {
      const total = Object.values(statusSums).reduce((sum, val) => sum + val, 0);
      return {
        name: monthYear,
        ...statusSums,
        total,  // Add total package sum here
      };
    });

    // Sort by date ascending
    result.sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());


    setMonthlyStatusData(result);
  };

  const updateMonthlyOfferStatusData = (data: any[]) => {
    const monthlyMap: Record<string, Record<string, number>> = {};

    data.forEach(inquiry => {
      const date = new Date(inquiry.enquiryDate);
      if (!isNaN(date.getTime())) {
        const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!monthlyMap[monthYear]) {
          monthlyMap[monthYear] = {};
        }

        const status = inquiry.offerStatus || 'Unknown';
        const packageAmount = parseFloat(inquiry.totalPackage) || 0;

        // 💰 Sum `totalPackage` grouped by offerStatus
        monthlyMap[monthYear][status] = (monthlyMap[monthYear][status] || 0) + packageAmount;
      }
    });

    // Convert map to chart-friendly array, and add total sum of all statuses
    const result = Object.entries(monthlyMap).map(([monthYear, statusSums]) => {
      const total = Object.values(statusSums).reduce((sum, val) => sum + val, 0);
      return {
        name: monthYear,
        ...statusSums,
        total,  // Add total package sum here
      };
    });

    // Sort by month
    result.sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    setMonthlyOfferStatusData(result);
  };

  // Define the type for your tooltip component props:
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);

      return (
        <div style={{ backgroundColor: 'white', border: '1px solid #ccc', padding: 10 }}>
          <p><strong>{label}</strong></p>
          {payload.map((entry) => (
            <p key={entry.dataKey} style={{ color: entry.color, margin: 0 }}>
              {entry.dataKey}: ₹{entry.value?.toLocaleString()}
            </p>
          ))}
          <hr />
          <p><strong>Total: ₹{total.toLocaleString()}</strong></p>
        </div>
      );
    }

    return null;
  };



  return (
    <div>
      <Box mt={3}>
        {/* Top bar with Add button */}

        <Box display="flex" justifyContent="flex-start" mb={2}>
          <Card sx={{ mt: '6px' }}>
            <CardContent>
              <Box display="flex" flexWrap="nowrap" alignItems="center" gap={1}>
                {/* Filters */}
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel shrink>Customer Type</InputLabel>
                  <Select
                    value={customerTypeFilter}
                    onChange={customerTypeChange}
                    displayEmpty
                    label="Customer Type"
                    renderValue={(selected) => selected === "" ? "All" : selected}
                  >
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
                    label="Region"
                    renderValue={(selected) => selected === "" ? "All" : selected}
                  >
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
                    label="Customer Name"
                    renderValue={(selected) => selected === "" ? "All" : selected}
                  >
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
                    label="Inquiry Status"
                    renderValue={(selected) => selected === "" ? "All" : selected}
                  >
                    <MenuItem value="">All</MenuItem>
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel shrink>Offer Status</InputLabel>
                  <Select
                    value={offerStatusFilter}
                    onChange={handleOfferStatusChange}
                    displayEmpty
                    label="Offer Status"
                    renderValue={(selected) => selected === "" ? "All" : selected}
                  >
                    <MenuItem value="">All</MenuItem>
                    {offerStatusOptions.map((status) => (
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
                <Button variant="contained" color="primary" onClick={resetFilters}>Reset</Button>
              </Box>

              {/* <Box display="flex" flexWrap="wrap" alignItems="center" gap={2} ml={2}></Box> */}
              {/* <Button variant="contained" color="primary" onClick={resetFilters}>
                Reset Filters
              </Button> */}
            </CardContent>
          </Card>
        </Box>

        {/* Scrollable wrapper for table */}
        {/* <Box sx={{ overflowX: 'scroll', width: '90%' }}> */}
        <Card sx={{ mt: '6px' }}>
          <CardContent>
            <DataGrid
              rows={rows}
              columns={inquiryColumns}
              getRowId={(row) => row.inquiryId}
              paginationModel={{ pageSize: 5, page: 0 }}
              pageSizeOptions={[10, 20, 50]}
              loading={loading}
            />
          </CardContent>
        </Card>
        {/* </Box> */}
      </Box>
      <Grid container spacing={2}>

        {/* Inquiry Status */}
        <Grid size={{ xs: 12, sm: 6 }} >
          <Card sx={{ mt: '6px' }}>
            <CardContent>
              <div className="shadow-lg p-1 rounded-xl bg-white flex-1">
                <h2 className="text-xl font-bold mb-4">
                  Monthly Inquiry Status
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyStatusData} >
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {statusOptions.map((status, idx) => (
                      <Bar
                        key={status}
                        dataKey={status}
                        stackId="a" // ✅ stacked to show totalPackage with color-wise status
                        fill={COLORS[idx % COLORS.length]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </Grid>


        {/* Offer Status */}
        <Grid size={{ xs: 12, sm: 6 }} >
          <Card sx={{ mt: '6px' }}>
            <CardContent>
              <div className="shadow-lg p-1 rounded-xl bg-white flex-1">
                <h2 className="text-xl font-bold mb-4">Monthly Offer Status</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyOfferStatusData}>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {offerStatusOptions.map((status, idx) => (
                      <Bar
                        key={status}
                        dataKey={status}
                        stackId="a" // ✅ stacked to show totalPackage with color-wise status
                        fill={COLORS[idx % COLORS.length]}
                      />
                    ))}
                  </BarChart>

                </ResponsiveContainer>
              </div>
            </CardContent></Card>
        </Grid>
      </Grid>


      {/* Charts Section */}
      <div className="p-6 grid grid-cols-2 gap-6">
        <div className="shadow-lg p-4 rounded-xl bg-white">
          <h2 className="text-xl font-bold mb-4">Customer Type ({rows.length} records)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={customerTypeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {customerTypeData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip
                formatter={(value) => [`${value} records`, 'Count']}
                labelFormatter={(label) => `Customer Type: ${label}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
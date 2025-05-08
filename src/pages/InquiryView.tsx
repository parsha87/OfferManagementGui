import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { PictureAsPdf as PictureAsPdfIcon } from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface InquiryDetailViewProps {
  inquiryData: {
    enquiryNo: string;
    enquiryDate: string;
    customerName: string;
    customerType: string;
    email: string;
    phoneNo: string;
    address: string;
    region: string;
    city: string;
    status: string;
    stdPaymentTerms: string;
    stdIncoTerms: string;
    listPrice: number;
    discount: number;
    netPriceWithoutGST: number;
    totalPackage: number;
    rfqNo: string;
    rfqDate: string;
    techicalDetailsMapping: Array<{
      motorType: string;
      kw: string;
      hp: string;
      phase: string;
      pole: string;
      frameSize: string;
      quantity: number;
      brand: string;
      amount: number;
      [key: string]: any;
    }>;
  };
}

const InquiryDetailView: React.FC<InquiryDetailViewProps> = ({ inquiryData }) => {
  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(`Inquiry Details - ${inquiryData.enquiryNo}`, 105, 15, { align: 'center' });
    
    // Add basic info
    doc.setFontSize(12);
    let y = 30;
    
    doc.text(`Enquiry No: ${inquiryData.enquiryNo}`, 20, y);
    y += 10;
    doc.text(`Enquiry Date: ${new Date(inquiryData.enquiryDate).toLocaleDateString()}`, 20, y);
    y += 10;
    doc.text(`Status: ${inquiryData.status}`, 20, y);
    y += 20;
    
    // Customer details
    doc.setFontSize(14);
    doc.text('Customer Details', 20, y);
    doc.setFontSize(12);
    y += 10;
    
    doc.text(`Customer Name: ${inquiryData.customerName}`, 20, y);
    y += 10;
    doc.text(`Customer Type: ${inquiryData.customerType}`, 20, y);
    y += 10;
    doc.text(`Email: ${inquiryData.email}`, 20, y);
    y += 10;
    doc.text(`Phone No: ${inquiryData.phoneNo}`, 20, y);
    y += 10;
    doc.text(`Address: ${inquiryData.address}`, 20, y);
    y += 10;
    doc.text(`Region: ${inquiryData.region}`, 20, y);
    y += 10;
    doc.text(`City: ${inquiryData.city}`, 20, y);
    y += 20;
    
    // Technical details table if exists
    if (inquiryData.techicalDetailsMapping?.length > 0) {
      doc.setFontSize(14);
      doc.text('Technical Details', 20, y);
      y += 10;
      
      const columns = ['Motor Type', 'KW', 'HP', 'Phase', 'Pole', 'Qty', 'Amount'];
      const data = inquiryData.techicalDetailsMapping.map(detail => [
        detail.motorType,
        detail.kw,
        detail.hp,
        detail.phase,
        detail.pole,
        detail.quantity,
        detail.amount
      ]);
      
      (doc as any).autoTable({
        startY: y,
        head: [columns],
        body: data,
        margin: { left: 20 }
      });
    }
    
    doc.save(`Inquiry_${inquiryData.enquiryNo}.pdf`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Inquiry Details</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PictureAsPdfIcon />}
          onClick={handleExportPDF}
        >
          Export to PDF
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Basic Information</Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid size={{xs:12,sm:6,md:3}}>
              <Typography variant="subtitle2">Enquiry No</Typography>
              <Typography>{inquiryData.enquiryNo}</Typography>
            </Grid>
            <Grid size={{xs:12,sm:6,md:3}}>
              <Typography variant="subtitle2">Enquiry Date</Typography>
              <Typography>{new Date(inquiryData.enquiryDate).toLocaleDateString()}</Typography>
            </Grid>
            <Grid size={{xs:12,sm:6,md:3}}>
              <Typography variant="subtitle2">Status</Typography>
              <Typography>{inquiryData.status}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Customer Details</Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid size={{xs:12,sm:6,md:4}}>
              <Typography variant="subtitle2">Customer Name</Typography>
              <Typography>{inquiryData.customerName}</Typography>
            </Grid>
            <Grid size={{xs:12,sm:6,md:4}}>
              <Typography variant="subtitle2">Customer Type</Typography>
              <Typography>{inquiryData.customerType}</Typography>
            </Grid>
            <Grid size={{xs:12,sm:6,md:4}}>
              <Typography variant="subtitle2">Email</Typography>
              <Typography>{inquiryData.email}</Typography>
            </Grid>
            <Grid size={{xs:12,sm:6,md:4}}>
              <Typography variant="subtitle2">Phone No</Typography>
              <Typography>{inquiryData.phoneNo}</Typography>
            </Grid>
            <Grid size={{xs:12,sm:6,md:4}}>
              <Typography variant="subtitle2">Region</Typography>
              <Typography>{inquiryData.region}</Typography>
            </Grid>
            <Grid size={{xs:12,sm:6,md:4}}>
              <Typography variant="subtitle2">City</Typography>
              <Typography>{inquiryData.city}</Typography>
            </Grid>
            <Grid size={{xs:12}}>
              <Typography variant="subtitle2">Address</Typography>
              <Typography>{inquiryData.address}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {inquiryData.techicalDetailsMapping?.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Technical Details</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Motor Type</TableCell>
                    <TableCell>KW</TableCell>
                    <TableCell>HP</TableCell>
                    <TableCell>Phase</TableCell>
                    <TableCell>Pole</TableCell>
                    <TableCell>Frame Size</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inquiryData.techicalDetailsMapping.map((detail, index) => (
                    <TableRow key={index}>
                      <TableCell>{detail.motorType}</TableCell>
                      <TableCell>{detail.kw}</TableCell>
                      <TableCell>{detail.hp}</TableCell>
                      <TableCell>{detail.phase}</TableCell>
                      <TableCell>{detail.pole}</TableCell>
                      <TableCell>{detail.frameSize}</TableCell>
                      <TableCell>{detail.quantity}</TableCell>
                      <TableCell>{detail.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Commercial Details</Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid size={{xs:12,sm:6,md:3}}>
              <Typography variant="subtitle2">Standard Payment Terms</Typography>
              <Typography>{inquiryData.stdPaymentTerms}</Typography>
            </Grid>
            <Grid size={{xs:12,sm:6,md:3}}>
              <Typography variant="subtitle2">Standard Inco Terms</Typography>
              <Typography>{inquiryData.stdIncoTerms}</Typography>
            </Grid>
            <Grid size={{xs:12,sm:6,md:3}}>
              <Typography variant="subtitle2">List Price</Typography>
              <Typography>{inquiryData.listPrice}</Typography>
            </Grid>
            <Grid size={{xs:12,sm:6,md:3}}>
              <Typography variant="subtitle2">Discount</Typography>
              <Typography>{inquiryData.discount}</Typography>
            </Grid>
            <Grid size={{xs:12,sm:6,md:3}}>
              <Typography variant="subtitle2">Net Price (without GST)</Typography>
              <Typography>{inquiryData.netPriceWithoutGST}</Typography>
            </Grid>
            <Grid size={{xs:12,sm:6,md:3}}>
              <Typography variant="subtitle2">Total Package</Typography>
              <Typography>{inquiryData.totalPackage}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>RFQ Details</Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid size={{xs:12,sm:6,md:4}}>
              <Typography variant="subtitle2">RFQ No</Typography>
              <Typography>{inquiryData.rfqNo}</Typography>
            </Grid>
            <Grid size={{xs:12,sm:6,md:4}}>
              <Typography variant="subtitle2">RFQ Date</Typography>
              <Typography>{new Date(inquiryData.rfqDate).toLocaleDateString()}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InquiryDetailView;
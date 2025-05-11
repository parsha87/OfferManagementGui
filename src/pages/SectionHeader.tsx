import React from 'react';
import { Box, Typography } from '@mui/material';

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <Box
      sx={{
        mt: 3,
        mb: 1,
        p: 0.5,
        borderRadius: 1,
        background: 'linear-gradient(to right, #1976d2,rgb(145, 200, 245))',
        color: 'white',
        //width:250
      }}
    >
      <Typography variant="h6">{title}</Typography>
    </Box>
  );
};

export default SectionHeader;

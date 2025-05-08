// src/pages/UserGrid.tsx
import React, { useEffect, useState } from 'react';
import { Button, Chip, IconButton, Stack } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../context/AxiosContext';

const UserGrid = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('User/getall');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await api.delete(`User/delete/${id}`);
      fetchUsers();
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 220, hideable: true }, // hidden but accessible
    { field: 'userName', headerName: 'Username', width: 150 },
    { field: 'firstName', headerName: 'First Name', width: 150 },
    { field: 'lastName', headerName: 'Last Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phoneNumber', headerName: 'Phone', width: 150 },
    {
      field: 'isActive',
      headerName: 'Active',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      )
    },
    {
      field: 'roles',
      headerName: 'Roles',
      width: 200,
      renderCell: (params) => (
        <Chip label={params.value} size="small" /> // Join the roles array to display them
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const navigate = useNavigate();
        const handleDelete = () => {
          // deleteUser(params.row.id)
        };

        return (
          <Stack direction="row" spacing={1}>
            <IconButton onClick={() => navigate(`/users/edit/${params.row.id}`)}><Edit /></IconButton>
            <IconButton color="error" onClick={handleDelete}><Delete /></IconButton>
          </Stack>
        );
      }
    }
  ];

  return (
    <div style={{ height: 500, width: '100%' }}>
      <Button variant="contained" onClick={() => navigate('/users/new')} style={{ marginBottom: '10px' }}>
        Add User
      </Button>
      <DataGrid rows={users} columns={columns} getRowId={(row) => row.id} loading={loading}/>
    </div>
  );
};

export default UserGrid;

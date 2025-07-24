import { Button, TextField, Box, Typography, Paper } from '@mui/material';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../context/AxiosContext'; // Axios instance
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import config from '../config';
import { toast } from 'react-toastify';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');


  // const handleLogin = async (
  //   e: FormEvent<HTMLFormElement>
  // ): Promise<void> => {
  //   e.preventDefault();

  //   try {
  //     const response = await axios.post(`${config.apiUrl}Auth/login`, {
  //       email: username,
  //       password,
  //     });
  //     const { token, name } = response.data;

  //     // Save token to sessionStorage
  //     sessionStorage.setItem('token', token);

  //     // Set user in context
  //     login(name); // or username, based on your API response

  //     // Navigate to dashboard
  //     navigate('/dashboard');
  //     // const data = response.data; // Axios automatically parses JSON
  //     // if (data.authResult?.status === 'SUCCESS') {
  //     //     // Save token to sessionStorage
  //     //     sessionStorage.setItem('token', data.authResult.token);
  //     //     sessionStorage.setItem('user', JSON.stringify(data.authResult));
  //     //     navigate('/excel-data');
  //     // } else {
  //     //     setError('Invalid username or password');
  //     // }
  //   } catch (error) {
  //     setError('An error occurred. Please try again.');
  //   }
  // };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${config.apiUrl}Auth/login`, {
        email: username,
        password,
      });

      const { token, name, role } = response.data;

      // Save token to sessionStorage
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('username', name);
      sessionStorage.setItem('role', role);

      // Set user in context
      login(name);

      toast.success(`Welcome ${name}!`, {
        position: 'top-right',
        autoClose: 3000,
      });

      // Navigate to dashboard
      navigate('/dashboard');

    } catch (err: any) {
      if (err.response?.status === 500) {
        toast.error(err.response.data.message || 'Invalid credentials. Please try again.');
        setError(err.response.data.message || 'Invalid credentials. Please try again.');
      } else {
        toast.error('Something went wrong. Please try again later.');
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} sx={{ padding: 4, width: 300 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <TextField
            label="Username"
            fullWidth
            sx={{ mt: 2 }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            sx={{ mt: 2 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" fullWidth onClick={handleLogin} sx={{ mt: 3 }}>
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;

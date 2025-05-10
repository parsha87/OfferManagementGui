import React, { useEffect, useState } from 'react';
import { Button, TextField, Stack, FormControl, InputLabel, Select, MenuItem, FormHelperText, Switch, FormControlLabel, Grid, Card, CardContent, CardActions } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../context/AxiosContext';

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        userName: '',
        email: '',
        isActive: true,
        password: '',
        role: 'User',
    });

    const [errors, setErrors] = useState<any>({});

    // Fetch user data if updating
    useEffect(() => {
        if (id) {
            api.get(`User/get/${id}`).then(res => {
                setUser({
                    ...res.data,
                    password: '', // Keep the password field empty for security
                });
            });
        }
    }, [id]);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        setUser({ ...user, [e.target.name as string]: e.target.value });
    };

    // Handle toggle for active/inactive status
    const handleToggleActive = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, isActive: e.target.checked });
    };

    // Handle role change
    const handleRoleChange = (e: any) => {
        setUser({ ...user, role: e.target.value as string });
    };

    // Form validation
    const validate = () => {
        const errors: any = {};
        if (!user.firstName) errors.firstName = 'First name is required';
        if (!user.lastName) errors.lastName = 'Last name is required';
        if (!user.userName) errors.userName = 'Username is required';
        if (!user.email) errors.email = 'Email is required';
        if (!user.phoneNumber) errors.phoneNumber = 'Phone number is required';
        if (!user.password) errors.password = 'Password is required';
        if (!user.role) errors.role = 'Role is required';
        return errors;
    };

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    // Handle form submission
    const handleSubmit = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const requestBody = {
            ...user,
            isActive: user.isActive,
            role: user.role,
        };

        if (id) {
            await api.put(`User/update/${id}`, requestBody);
        } else {
            await api.post('User/create', requestBody);
        }
        navigate('/users');
    };

    return (
        <Card>
            <CardContent>
                {/* Header with Title and Back Button */}
                <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Grid>
                        <Button variant="outlined" onClick={handleBack}>Back</Button>
                    </Grid>
                    <Grid>
                        <h2 style={{ textAlign: 'center', margin: 8 }}>User</h2>
                    </Grid>
                    <Grid />
                </Grid>

                <Stack spacing={3}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 6, md: 6 }} >
                            <TextField
                                label="First Name"
                                name="firstName"
                                value={user.firstName}
                                onChange={handleChange}
                                fullWidth
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                            />
                        </Grid>
                        <Grid size={{ xs: 6, md: 6 }} >
                            <TextField
                                label="Last Name"
                                name="lastName"
                                value={user.lastName}
                                onChange={handleChange}
                                fullWidth
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                            />
                        </Grid>
                        <Grid size={{ xs: 6, md: 6 }} >
                            <TextField
                                label="Username"
                                name="userName"
                                value={user.userName}
                                onChange={handleChange}
                                fullWidth
                                error={!!errors.userName}
                                helperText={errors.userName}
                            />
                        </Grid>
                        <Grid size={{ xs: 6, md: 6 }} >
                            <TextField
                                label="Email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                fullWidth
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Grid>
                        <Grid size={{ xs: 6, md: 6 }} >
                            <TextField
                                label="Phone Number"
                                name="phoneNumber"
                                value={user.phoneNumber}
                                onChange={handleChange}
                                fullWidth
                                error={!!errors.phoneNumber}
                                helperText={errors.phoneNumber}
                            />
                        </Grid>
                        <Grid size={{ xs: 6, md: 6 }} >
                            <TextField
                                label="Password"
                                name="password"
                                type="password"
                                value={user.password}
                                onChange={handleChange}
                                fullWidth
                                error={!!errors.password}
                                helperText={errors.password}
                            />
                        </Grid>
                        <Grid size={{ xs: 6, md: 6 }} >
                            <FormControl fullWidth error={!!errors.role}>
                                <InputLabel>Role</InputLabel>
                                <Select
                                    name="role"
                                    value={user.role}
                                    onChange={handleRoleChange}
                                    fullWidth
                                >
                                    <MenuItem value="Admin">Admin</MenuItem>
                                    <MenuItem value="User">User</MenuItem>
                                    {/* <MenuItem value="SuperAdmin">SuperAdmin</MenuItem> */}
                                </Select>
                                {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 6, md: 6 }} >
                            <FormControlLabel
                                control={<Switch checked={user.isActive} onChange={handleToggleActive} />}
                                label={user.isActive ? 'Active' : 'Inactive'}
                            />
                        </Grid>
                    </Grid>
                </Stack>
            </CardContent>

            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button size="medium" variant="contained" onClick={handleSubmit} sx={{ width: 200 }}>
                    {id ? 'Update' : 'Add'} User
                </Button>
            </CardActions>
        </Card>

    );
};

export default UserForm;

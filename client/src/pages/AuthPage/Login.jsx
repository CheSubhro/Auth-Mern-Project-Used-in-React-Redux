import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { TextField, Button, Typography, Container, Grid, Snackbar } from '@mui/material';
import { useNavigate } from "react-router-dom";

const Login = () => {

    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:8000/api/v1/users/login', data, { withCredentials: true });
            if (response.status === 200) {
                console.log(response.data); // Handle success response
                setAccessToken(response.data.accessToken);
                setRefreshToken(response.data.refreshToken);
                setShowSuccessMessage(true);
                reset(); // Reset form fields after successful submission
                setTimeout(() => {
                    setShowSuccessMessage(false);
                    navigate("/profile"); // Redirect to Profile page after showing message
                }, 2000); // Hide message after 2 seconds
            } else {
                console.error('Login failed:', response.data); // Handle error
                setShowErrorMessage(true);
                // Display error message or perform other actions as needed
            }
        } catch (error) {
            console.error('Login failed:', error); // Handle error
            setShowErrorMessage(true);
            // Display error message or perform other actions as needed
        }
    };

    return (
        <>
            <Container maxWidth="sm">
                <Typography variant="h4" gutterBottom>Login</Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Email"
                                type="email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                                })}
                                error={!!errors.email}
                                helperText={errors.email && errors.email.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Password"
                                type="password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                })}
                                error={!!errors.password}
                                helperText={errors.password && errors.password.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
                        </Grid>
                    </Grid>
                </form>
                <Snackbar
                    open={showSuccessMessage}
                    autoHideDuration={2000}
                    onClose={() => setShowSuccessMessage(false)}
                    message="Login successful!"
                />
                <Snackbar
                    open={showErrorMessage}
                    autoHideDuration={2000}
                    onClose={() => setShowErrorMessage(false)}
                    message="Login failed. Please check your credentials and try again."
                />
                {accessToken && refreshToken && (
                    <Typography variant="body1" gutterBottom>
                        Access Token: {accessToken}
                        <br />
                        Refresh Token: {refreshToken}
                    </Typography>
                )}
            </Container>
        </>
    )
}

export default Login;

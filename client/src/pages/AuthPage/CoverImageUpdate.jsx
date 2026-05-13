
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Button, Container, Grid, Typography, Snackbar } from '@mui/material';
import { useNavigate } from "react-router-dom";

const CoverImageUpdate = () => {
    const { register, handleSubmit } = useForm();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:8000/api/v1/users/cover-image', data, { withCredentials: true });
            if (response.status === 200) {
                console.log(response.data); // Handle success response
                setShowSuccessMessage(true);
                setTimeout(() => {
                    setShowSuccessMessage(false);
                    navigate("/profile"); // Redirect to Profile page after showing message
                }, 2000); // Hide message after 2 seconds
            } else {
                console.error('Cover image update failed:', response.data); // Handle error
                setShowErrorMessage(true);
                // Display error message or perform other actions as needed
            }
        } catch (error) {
            console.error('Cover image update failed:', error); // Handle error
            setShowErrorMessage(true);
            // Display error message or perform other actions as needed
        }
    };

    return (
        <>
            <Container maxWidth="sm">
                <Typography variant="h4" gutterBottom>Update Cover Image</Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <input
                                type="file"
                                {...register('coverImage')}
                                accept="image/*"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>Update Cover Image</Button>
                        </Grid>
                    </Grid>
                </form>
                <Snackbar
                    open={showSuccessMessage}
                    autoHideDuration={2000}
                    onClose={() => setShowSuccessMessage(false)}
                    message="Cover image updated successfully!"
                />
                <Snackbar
                    open={showErrorMessage}
                    autoHideDuration={2000}
                    onClose={() => setShowErrorMessage(false)}
                    message="Cover image update failed. Please try again."
                />
            </Container>
        </>
    );
};

export default CoverImageUpdate;

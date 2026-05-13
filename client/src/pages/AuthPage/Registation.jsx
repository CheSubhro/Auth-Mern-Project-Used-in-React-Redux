
import React,{ useState } from 'react'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { TextField, Button, Typography, Container, Grid, Snackbar } from '@mui/material';
import { useNavigate } from "react-router-dom";


const Registation = () => {

	const { register, handleSubmit, formState: { errors }, reset } = useForm();
	const [showMessage, setShowMessage] = useState(false);
	const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {

			const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value instanceof FileList) {
                    Array.from(value).forEach((file) => {
                        formData.append(key, file);
                    });
                } else {
                    formData.append(key, value);
                }
            });
            const response = await axios.post('http://localhost:8000/api/v1/users/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
			console.log(response.data); // Handle success response
            setShowMessage(true);
            reset(); // Reset form fields after successful submission
            setTimeout(() => {
                setShowMessage(false);
				navigate("/login"); // Redirect to login page after showing message
            }, 2000); // Hide message after 2 seconds
        } catch (error) {
			console.error('Registration failed:', error); // Handle error
        }
    };

    return (
      	<>
			<Container maxWidth="sm">
            	<Typography variant="h4" gutterBottom>Register</Typography>
            		<form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                		<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									fullWidth
									variant="outlined"
									label="Username"
									{...register('username', { required: 'Username is required' })}
									error={!!errors.username}
									helperText={errors.username && errors.username.message}
								/>
							</Grid>
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
									label="Full Name"
									{...register('fullName', { required: 'Full Name is required' })}
									error={!!errors.fullName}
									helperText={errors.fullName && errors.fullName.message}
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
								<TextField
									fullWidth
									variant="outlined"
									type="file"
									label="Avatar"
									{...register('avatar')}
									error={!!errors.avatar}
									helperText={errors.avatar && errors.avatar.message}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									fullWidth
									variant="outlined"
									type="file"
									label="Cover Image"
									{...register('coverImage')}
									error={!!errors.coverImage}
									helperText={errors.coverImage && errors.coverImage.message}
								/>
							</Grid>
							<Grid item xs={12}>
								<Button type="submit" variant="contained" color="primary" fullWidth>Register</Button>
							</Grid>
                		</Grid>
            		</form>
					<Snackbar
						open={showMessage}
						autoHideDuration={2000}
						onClose={() => setShowMessage(false)}
						message="Registration successful!"
                	/>
        	</Container>
	  	</>
    )
}

export default Registation
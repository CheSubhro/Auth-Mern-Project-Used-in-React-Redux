import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Container, Typography, CircularProgress } from '@mui/material';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cookies] = useCookies(['accessToken']);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/users/current-user', {
                    headers: {
                        Authorization: `Bearer ${cookies.accessToken}`
                    }
                });
                console.log(response.data)
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [cookies.accessToken]);

    if (loading) {
        return (
            <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '50px' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                Profile
            </Typography>
            {user && (
                <>
                    <Typography variant="h6">Welcome, {user.username}!</Typography>
                    <Typography>Email: {user.email}</Typography>
                    {/* Add other user information */}
                </>
            )}
        </Container>
    );
};

export default Profile;

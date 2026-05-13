
import React from 'react'
import { Typography, Container } from '@mui/material';

const Footer = () => {
    return (
        <>
            <footer className="footer">
            <Container maxWidth="sm">
                <Typography variant="body1" align="center" color="textSecondary">
                &copy; 2024 Your Company Name. All rights reserved.
                </Typography>
            </Container>
            </footer>
        </>
    )
}

export default Footer
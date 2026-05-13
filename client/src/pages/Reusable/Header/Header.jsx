import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

const Header = ({ isAuthenticated }) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    My App
                </Typography>
                <Button color="inherit" component={Link} to="/">Home</Button>
                <Button color="inherit" component={Link} to="/about">About</Button>
                {!isAuthenticated && (
                    <>
                        <Button color="inherit" component={Link} to="/register">Register</Button>
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                    </>
                )}
                {isAuthenticated && (
                    <>
                        <Button color="inherit" component={Link} to="/profile">Profile</Button>
                        <Button color="inherit" component={Link} to="/avatar">Avatar</Button>
                        <Button color="inherit" component={Link} to="/cover-image">Cover</Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;

import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { useNavigate, Link } from "react-router-dom";
import { Box, TextField, Button, Typography, Container, keyframes } from "@mui/material";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (error) {
      setError("Invalid credentials");
    }
  };

  return (
    <Container maxWidth="xs"> {/* Change to "xs" for better responsiveness */}
      <Box
        sx={{
          marginTop: { xs: 4, sm: 8 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid #ccc",
          borderRadius: 2,
          padding: { xs: 2, md: 3 },
          boxShadow: 1,
          animation: `${fadeIn} 0.5s ease-out`,
          '&:hover': {
            boxShadow: 3,
            transition: 'box-shadow 0.3s ease-in-out'
          },
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            animation: `${fadeIn} 0.5s ease-out`,
            animationDelay: '0.1s'
          }}
        >
          Login
        </Typography>
        {error && (
          <Typography 
            color="error" 
            sx={{ 
              mb: 2,
              animation: `${fadeIn} 0.3s ease-out` 
            }}
          >
            {error}
          </Typography>
        )}
        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ 
            mt: 3, 
            width: "100%",
            '& .MuiTextField-root': {
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)'
              }
            }
          }}
        >
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            sx={{ 
              '& .MuiInputBase-root': { // Adjust input base for better scaling on hover
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }
            }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            sx={{ 
              '& .MuiInputBase-root': {
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ 
              mt: 3, 
              mb: 2, 
              py: 1.5,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: 2
              }
            }}
          >
            Login
          </Button>
          <Typography 
            variant="body2" 
            align="center"
            sx={{
              animation: `${fadeIn} 0.5s ease-out`,
              animationDelay: '0.2s'
            }}
          >
            Don't have an account?{" "}
            <Link 
              to="/register" 
              style={{ 
                textDecoration: "none", 
                color: "inherit",
                transition: 'color 0.2s ease-in-out',
              }}
            >
              Register here
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
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

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "public",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/register`, formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (error) {
      setError("Registration failed");
    }
  };

  return (
    <Container maxWidth="xs"> {/* Changed to "xs" for better responsiveness */}
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          animation: `${fadeIn} 0.5s ease-out`, // Added fade-in animation
        }}
      >
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            sx={{
              '& .MuiInputBase-root': { // Added hover effect
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              },
            }}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            sx={{
              '& .MuiInputBase-root': {
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              },
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
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, mb: 2, transition: 'all 0.3s ease' }}
          >
            Register
          </Button>
          <Typography variant="body2" align="center">
            Already have an account?{" "}
            <Link to="/login" style={{ textDecoration: "none", color: "inherit" }}>
              Login here
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
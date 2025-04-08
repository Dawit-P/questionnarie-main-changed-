// components/Profile.js
import React from "react";
import { Box, Typography } from "@mui/material";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Typography variant="body1">
        <strong>Username:</strong> {user?.username}
      </Typography>
      <Typography variant="body1">
        <strong>Email:</strong> {user?.email}
      </Typography>
      <Typography variant="body1">
        <strong>Role:</strong> {user?.role}
      </Typography>
    </Box>
  );
};

export default Profile;
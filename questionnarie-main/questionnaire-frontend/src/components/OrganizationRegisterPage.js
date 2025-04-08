import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { Container, Form, Button, Alert } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
const token = localStorage.getItem("token");
const OrganizationRegisterPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
//   const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/organizations/register`,
            {
              name,
              description,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`, // Include the token
              },
            }
          );

      if (response.status === 201) {
        setSuccess(true);
        setName("");
        setDescription("");
        setTimeout(() => {
        //   navigate("/answer-page"); // Redirect to the answer page or any other page
        }, 2000);
      }
    } catch (error) {
      console.error("Error registering organization:", error);
      setError(error.response?.data?.message || "Failed to register organization");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Register Organization</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Organization registered successfully!</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Organization Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter organization name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter organization description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register Organization"}
        </Button>
      </Form>
    </Container>
  );
};

export default OrganizationRegisterPage;
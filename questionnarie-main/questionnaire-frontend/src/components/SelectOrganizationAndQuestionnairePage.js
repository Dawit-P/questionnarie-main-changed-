import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/apiConfig";
import { Container, Form, Button, Spinner, Alert } from "react-bootstrap";

const SelectOrganizationAndQuestionnairePage = () => {
  const [organizations, setOrganizations] = useState([]);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // Fetch organizations and questionnaires
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch organizations
        const orgResponse = await axios.get(`${API_BASE_URL}/api/organizations`);
        setOrganizations(orgResponse.data);

        // Fetch questionnaires
        const questionnaireResponse = await axios.get(`${API_BASE_URL}/api/questionnaires`);
        setQuestionnaires(questionnaireResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedOrganization || !selectedQuestionnaire) {
      alert("Please select both an organization and a questionnaire.");
      return;
    }

    // Navigate to the desired page (e.g., ReportPage or AnswerPage)
    navigate(`/report/${selectedQuestionnaire}/organization/${selectedOrganization}`);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center mt-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Select Organization and Questionnaire</h1>
      <Form onSubmit={handleSubmit}>
        {/* Organization Dropdown */}
        <Form.Group className="mb-3">
          <Form.Label>Select Organization</Form.Label>
          <Form.Control
            as="select"
            value={selectedOrganization}
            onChange={(e) => setSelectedOrganization(e.target.value)}
            required
          >
            <option value="">Select an organization</option>
            {organizations.map((org) => (
              <option key={org._id} value={org._id}>
                {org.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {/* Questionnaire Dropdown */}
        <Form.Group className="mb-3">
          <Form.Label>Select Questionnaire</Form.Label>
          <Form.Control
            as="select"
            value={selectedQuestionnaire}
            onChange={(e) => setSelectedQuestionnaire(e.target.value)}
            required
          >
            <option value="">Select a questionnaire</option>
            {questionnaires.map((questionnaire) => (
              <option key={questionnaire._id} value={questionnaire._id}>
                {questionnaire.title}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {/* Submit Button */}
        <Button variant="primary" type="submit">
          Continue
        </Button>
      </Form>
    </Container>
  );
};

export default SelectOrganizationAndQuestionnairePage;
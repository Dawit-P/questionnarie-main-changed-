import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Alert, Spinner, Form } from "react-bootstrap";
import AnswerChart from "./AnswerChart";

const ReportPage = () => {
  const { questionnaireId, organizationId } = useParams();
  const [questionsWithAnswers, setQuestionsWithAnswers] = useState([]);
  const [organizationName, setOrganizationName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState("bar"); // State for global chart type
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(token);
        // Fetch organization details
        const orgResponse = await axios.get(
          `http://localhost:5000/api/organizations/${organizationId}`
        );
        setOrganizationName(orgResponse.data.name);

        // Fetch questions and answers for the specific questionnaire and organization
        const response = await axios.get(
          `http://localhost:5000/api/questions/${questionnaireId}/questions-answers`,
          { 
            params: { organizationId }
         }, 
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token
            },
          }
        );
        setQuestionsWithAnswers(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [questionnaireId, organizationId]);

  // Handle global chart type change
  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
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
      <h1 className="mb-4">Report for Organization: {organizationName}</h1>

      {/* Global Chart Type Selection Dropdown */}
      <Form.Group className="mb-4">
        <Form.Label>Select Chart Type for All Questions</Form.Label>
        <Form.Select value={chartType} onChange={handleChartTypeChange}>
          <option value="bar">Bar Chart</option>
          <option value="pie">Pie Chart</option>
          <option value="line">Line Chart</option>
        </Form.Select>
      </Form.Group>

      {questionsWithAnswers.length === 0 ? (
        <Alert variant="info">No questions or answers found for this questionnaire and organization.</Alert>
      ) : (
        questionsWithAnswers.map((question) => (
          <div key={question._id} className="mb-5">
            <h5>{question.questionText}</h5>

            {/* Render the selected chart type for all questions */}
            <AnswerChart
              questionText={question.questionText}
              answers={question.answers}
              chartType={chartType} // Use the global chart type
              size={{ width: "400px", height: "300px" }}
            />
          </div>
        ))
      )}
    </Container>
  );
};

export default ReportPage;
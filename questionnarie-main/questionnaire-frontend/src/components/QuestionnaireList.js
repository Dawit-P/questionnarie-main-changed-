import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, ListGroup, Button, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/apiConfig";
const QuestionnaireList = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/questions`);
        setQuestionnaires(response.data);
      } catch (error) {
        console.error("Error fetching questionnaires:", error);
        setError("Failed to fetch questionnaires. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestionnaires();
  }, []);

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
      <h1 className="mb-4">Questionnaires</h1>
      <ListGroup>
        {questionnaires.map((questionnaire) => (
          <ListGroup.Item key={questionnaire._id} className="d-flex justify-content-between align-items-center">
            <div>
              <h5>{questionnaire.title}</h5>
              <p className="mb-0">{questionnaire.description}</p>
            </div>
            <div>
              <Button
                as={Link}
                to={`/questionnaire/${questionnaire._id}`} // Link to QuestionnaireDetails
                variant="primary"
                className="me-2"
              >
                View Details
              </Button>
              <Button
                as={Link}
                to={`/answer/${questionnaire._id}`} // Link to AnswerPage
                variant="success"
              >
                Answer
              </Button>
            <Button
                as={Link}
                to={`/report/${questionnaire._id}`} // Link to ReportPage
                variant="info"
                className="ms-2"
                >
                View Report
                </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default QuestionnaireList;
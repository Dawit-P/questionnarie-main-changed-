import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import { Pencil } from "react-bootstrap-icons";
import API_BASE_URL from "../config/apiConfig";
const QuestionnaireDetails = () => {
  const { questionnaireId } = useParams();
  const navigate = useNavigate();
  const [questionnaire, setQuestionnaire] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestionnaireDetails = async () => {
      try {
        // Fetch the questionnaire
        const questionnaireResponse = await axios.get(
          `${API_BASE_URL}/api/questions/${questionnaireId}`
        );
        setQuestionnaire(questionnaireResponse.data);

        // Fetch questions for the questionnaire
        const questionsResponse = await axios.get(
          `${API_BASE_URL}/api/questions/${questionnaireId}/questions`
        );
        setQuestions(questionsResponse.data);
      } catch (error) {
        console.error("Error fetching questionnaire details:", error);
        setError("Failed to fetch questionnaire details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestionnaireDetails();
  }, [questionnaireId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <Alert variant="danger">{error}</Alert>
        <Button
          variant="primary"
          onClick={() => navigate("/list")}
          className="mt-3"
        >
          <i className="bi bi-arrow-left"></i> Back to List
        </Button>
      </div>
    );
  }

  if (!questionnaire) {
    return (
      <div className="container mt-4">
        <h6>Questionnaire not found.</h6>
        <Button
          variant="primary"
          onClick={() => navigate("/list")}
          className="mt-3"
        >
          <i className="bi bi-arrow-left"></i> Back to List
        </Button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <Button
        variant="outline-primary"
        onClick={() => navigate("/list")}
        className="mb-3"
      >
        <i className="bi bi-arrow-left"></i> Back to List
      </Button>
      <h1>{questionnaire.title}</h1>
      <p className="lead">{questionnaire.description}</p>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Question</th>
            <th>Type</th>
            <th>Choices</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question._id}>
              <td>{question.questionText}</td>
              <td>{question.questionType}</td>
              <td>{question.choices.join(", ")}</td>
              <td>
                <Button
                  variant="outline-primary"
                  onClick={() => navigate(`/edit/${question._id}`)}
                >
                  <Pencil /> Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default QuestionnaireDetails;
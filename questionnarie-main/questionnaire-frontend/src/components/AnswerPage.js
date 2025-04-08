import React, { useEffect, useState } from "react";
import API_BASE_URL from "../config/apiConfig";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Spinner, Alert, Form, Button } from "react-bootstrap";

const AnswerPage = () => {
  const { questionnaireId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log("API_BASE_URL", API_BASE_URL);
        const response = await axios.get(
          `${API_BASE_URL}/api/questions/${questionnaireId}/questions`
          
        );
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Failed to fetch questions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchOrganizations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/organizations`);
        setOrganizations(response.data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
        setError("Failed to fetch organizations. Please try again later.");
      }
    };

    fetchQuestions();
    fetchOrganizations();
  }, [questionnaireId]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const handleMultipleAnswerChange = (questionId, choice, isChecked) => {
    setAnswers((prevAnswers) => {
      const currentAnswers = prevAnswers[questionId] || [];
      if (isChecked) {
        return {
          ...prevAnswers,
          [questionId]: [...currentAnswers, choice],
        };
      } else {
        return {
          ...prevAnswers,
          [questionId]: currentAnswers.filter((c) => c !== choice),
        };
      }
    });
  };

  const handleOtherAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [`${questionId}-otherText`]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validate if all questions are answered and an organization is selected
      const unansweredQuestions = questions.filter((question) => {
        const answer = answers[question._id];
        return !answer || (Array.isArray(answer) && answer.length === 0);
      });

      if (unansweredQuestions.length > 0) {
        alert("Please answer all questions before submitting.");
        return;
      }

      if (!selectedOrganization) {
        alert("Please select an organization before submitting.");
        return;
      }

      // Prepare answers for submission
      const answersToSubmit = questions.map((question) => {
        const answerText = answers[question._id] || [];
        const otherAnswerText = answers[`${question._id}-otherText`] || "";

        return {
          questionId: question._id,
          userId: "user123", // Replace with actual user ID
          organizationId: selectedOrganization, // Include the selected organization ID
          answerText: Array.isArray(answerText) ? answerText : [answerText],
          otherAnswerText: otherAnswerText,
        };
      });

      // Submit answers
      for (const answer of answersToSubmit) {
        await axios.post(`${API_BASE_URL}/api/answers`, answer);
      }

      setSubmitted(true);
      alert("Answers submitted successfully!");
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert("Failed to submit answers. Please try again.");
    }
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

  if (submitted) {
    return (
      <Container className="mt-4">
        <Alert variant="success">Answers submitted successfully!</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Answer Questionnaire</h1>
      <Form>
        <Form.Group className="mb-4">
          <Form.Label>Select Organization</Form.Label>
          <Form.Control
            as="select"
            value={selectedOrganization}
            onChange={(e) => setSelectedOrganization(e.target.value)}
          >
            <option value="">Select an organization</option>
            {organizations.map((org) => (
              <option key={org._id} value={org._id}>
                {org.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {questions.map((question) => (
          <div key={question._id} className="mb-4">
            <h5>{question.questionText}</h5>
            {question.questionType === "MultipleChoice" ? (
              <Form.Group>
                {question.choices.map((choice, index) => (
                  <Form.Check
                    key={index}
                    type={question.allowMultipleAnswers ? "checkbox" : "radio"}
                    id={`${question._id}-${index}`}
                    label={choice}
                    value={choice}
                    checked={
                      question.allowMultipleAnswers
                        ? answers[question._id]?.includes(choice)
                        : answers[question._id] === choice
                    }
                    onChange={(e) =>
                      question.allowMultipleAnswers
                        ? handleMultipleAnswerChange(question._id, choice, e.target.checked)
                        : handleAnswerChange(question._id, e.target.value)
                    }
                  />
                ))}
                {question.otherOption?.enabled && (
                  <Form.Group>
                    <Form.Check
                      type={question.allowMultipleAnswers ? "checkbox" : "radio"}
                      id={`${question._id}-other`}
                      label="Other"
                      value="Other"
                      checked={
                        question.allowMultipleAnswers
                          ? answers[question._id]?.includes("Other")
                          : answers[question._id] === "Other"
                      }
                      onChange={(e) =>
                        question.allowMultipleAnswers
                          ? handleMultipleAnswerChange(question._id, "Other", e.target.checked)
                          : handleAnswerChange(question._id, e.target.value)
                      }
                    />
                    {/* Show description only if "Other" is selected */}
                    {(question.allowMultipleAnswers
                      ? answers[question._id]?.includes("Other")
                      : answers[question._id] === "Other") && (
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder={question.otherOption.description}
                        value={answers[`${question._id}-otherText`] || ""}
                        onChange={(e) =>
                          handleOtherAnswerChange(question._id, e.target.value)
                        }
                      />
                    )}
                  </Form.Group>
                )}
              </Form.Group>
            ) : (
              <Form.Group>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={answers[question._id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(question._id, e.target.value)
                  }
                />
              </Form.Group>
            )}
          </div>
        ))}
        <Button variant="primary" onClick={handleSubmit}>
          Submit Answers
        </Button>
      </Form>
    </Container>
  );
};

export default AnswerPage;
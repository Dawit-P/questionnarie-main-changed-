import React, { useState } from "react";
import API_BASE_URL from "../config/apiConfig";
import { Container, Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import axios from "axios";

const token = localStorage.getItem("token");

const QuestionnaireForm = ({ isEdit = false, initialData = null, onSubmit }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [questions, setQuestions] = useState(
    initialData?.questions || [
      {
        questionText: "",
        questionType: "MultipleChoice",
        choices: [""],
        allowMultipleAnswers: false,
        otherOption: { enabled: false, description: "" },
      },
    ]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        questionType: "MultipleChoice",
        choices: [""],
        allowMultipleAnswers: false,
        otherOption: { enabled: false, description: "" },
      },
    ]);
  };

  const handleAddChoice = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].choices.push("");
    setQuestions(updatedQuestions);
  };

  const handleQuestionChange = (questionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].questionText = value;
    setQuestions(updatedQuestions);
  };

  const handleChoiceChange = (questionIndex, choiceIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].choices[choiceIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleQuestionTypeChange = (questionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].questionType = value;
    // Reset choices if the question type is not MultipleChoice
    if (value !== "MultipleChoice") {
      updatedQuestions[questionIndex].choices = [];
    } else {
      updatedQuestions[questionIndex].choices = [""];
    }
    setQuestions(updatedQuestions);
  };

  const handleAllowMultipleAnswersChange = (questionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].allowMultipleAnswers = value;
    setQuestions(updatedQuestions);
  };

  const handleOtherOptionChange = (questionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].otherOption.enabled = value;
    setQuestions(updatedQuestions);
  };

  const handleOtherDescriptionChange = (questionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].otherOption.description = value;
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (questionIndex) => {
    const updatedQuestions = questions.filter((_, index) => index !== questionIndex);
    setQuestions(updatedQuestions);
  };

  const handleRemoveChoice = (questionIndex, choiceIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].choices = updatedQuestions[questionIndex].choices.filter((_, index) => index !== choiceIndex);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (
        !title ||
        !description ||
        questions.some((q) => !q.questionText || (q.questionType === "MultipleChoice" && q.choices.some((c) => !c)))
      ) {
        setError("Please fill out all required fields.");
        setLoading(false);
        return;
      }

      const questionnaireData = { title, description, questions };

      if (isEdit) {
        await onSubmit(questionnaireData); // Call the onSubmit prop for updates
      } else {
        await axios.post(`${API_BASE_URL}/api/questions`, questionnaireData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Questionnaire saved successfully!");
        setSubmitted(true);
        setTitle("");
        setDescription("");
        setQuestions([{ questionText: "", questionType: "MultipleChoice", choices: [""], allowMultipleAnswers: false, otherOption: { enabled: false, description: "" } }]);
      }
    } catch (error) {
      console.error("Error saving questionnaire:", error);
      setError("Failed to save questionnaire. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Container className="mt-4">
        <Alert variant="success">Questionnaire saved successfully!</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-4">{isEdit ? "Edit Questionnaire" : "Create Questionnaire"}</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter questionnaire title"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Enter questionnaire description"
          />
        </Form.Group>
        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="mb-4 border p-3 rounded">
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>{`Question ${questionIndex + 1}`}</Form.Label>
                  <Form.Control
                    type="text"
                    value={question.questionText}
                    onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                    required
                    placeholder="Enter question text"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Question Type</Form.Label>
                  <Form.Select
                    value={question.questionType}
                    onChange={(e) => handleQuestionTypeChange(questionIndex, e.target.value)}
                  >
                    <option value="MultipleChoice">Choice</option>
                    <option value="Text">Text</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col className="d-flex align-items-end">
                <Button
                  variant="danger"
                  onClick={() => handleRemoveQuestion(questionIndex)}
                >
                  Remove Question
                </Button>
              </Col>
            </Row>
            {question.questionType === "MultipleChoice" && (
              <>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Allow multiple answers"
                    checked={question.allowMultipleAnswers}
                    onChange={(e) => handleAllowMultipleAnswersChange(questionIndex, e.target.checked)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Enable 'Other' option"
                    checked={question.otherOption.enabled}
                    onChange={(e) => handleOtherOptionChange(questionIndex, e.target.checked)}
                  />
                </Form.Group>
                {question.otherOption.enabled && (
                  <Form.Group className="mb-3">
                    <Form.Label>Description for 'Other' option</Form.Label>
                    <Form.Control
                      type="text"
                      value={question.otherOption.description}
                      onChange={(e) => handleOtherDescriptionChange(questionIndex, e.target.value)}
                      placeholder="Enter description for 'Other' option"
                    />
                  </Form.Group>
                )}
                {question.choices.map((choice, choiceIndex) => (
                  <Row key={choiceIndex} className="mb-3">
                    <Col>
                      <Form.Group>
                        <Form.Label>{`Choice ${choiceIndex + 1}`}</Form.Label>
                        <Form.Control
                          type="text"
                          value={choice}
                          onChange={(e) => handleChoiceChange(questionIndex, choiceIndex, e.target.value)}
                          required
                          placeholder={`Enter choice ${choiceIndex + 1}`}
                        />
                      </Form.Group>
                    </Col>
                    <Col className="d-flex align-items-end">
                      <Button
                        variant="danger"
                        onClick={() => handleRemoveChoice(questionIndex, choiceIndex)}
                      >
                        Remove Choice
                      </Button>
                    </Col>
                  </Row>
                ))}
                <Button
                  variant="outline-secondary"
                  onClick={() => handleAddChoice(questionIndex)}
                  className="mb-3"
                >
                  Add Choice
                </Button>
              </>
            )}
          </div>
        ))}
        <Button
          variant="outline-primary"
          onClick={handleAddQuestion}
          className="mb-3"
        >
          Add Question
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="w-100"
        >
          {loading ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            isEdit ? "Update Questionnaire" : "Save Questionnaire"
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default QuestionnaireForm;
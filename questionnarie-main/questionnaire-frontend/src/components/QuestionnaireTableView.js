import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Table, Button, Modal, Form, 
  Spinner, Alert, Badge 
} from 'react-bootstrap';
import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';

const QuestionnaireTableView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questionnaire, setQuestionnaire] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const token = localStorage.getItem('token');
 
  // Fetch questionnaire data
  useEffect(() => {
    const fetchQuestionnaire = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/questionnaires/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuestionnaire(response.data);
        console.log(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch questionnaire');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionnaire();
  }, [id, token]);

  // Edit question handlers
  const handleEditQuestion = (question) => {
    setEditingQuestion({ ...question });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setEditingQuestion(prev => {
      if (name.startsWith('choices.')) {
        const index = parseInt(name.split('.')[1], 10);
        const newChoices = [...prev.choices];
        newChoices[index] = value;
        return { ...prev, choices: newChoices };
      }
      if (name.startsWith('otherOption.')) {
        const field = name.split('.')[1];
        return { 
          ...prev, 
          otherOption: { 
            ...prev.otherOption, 
            [field]: type === 'checkbox' ? checked : value 
          } 
        };
      }
      return { 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      };
    });
  };

  // Choice management
  const handleAddChoice = () => {
    setEditingQuestion(prev => ({
      ...prev,
      choices: [...prev.choices, '']
    }));
  };

  const handleRemoveChoice = (index) => {
    setEditingQuestion(prev => ({
      ...prev,
      choices: prev.choices.filter((_, i) => i !== index)
    }));
  };

  // Submit edited question
  const handleSubmitEdit = async () => {
    try {
      setEditLoading(true);
      setEditError(null);

      if (!editingQuestion.questionText.trim()) {
        throw new Error('Question text is required');
      }

      if (editingQuestion.questionType === 'MultipleChoice' && 
          editingQuestion.choices.some(c => !c.trim())) {
        throw new Error('All choices must have text');
      }

      await axios.put(
        `${API_BASE_URL}/api/questionnaires/questions/${editingQuestion._id}`,
        editingQuestion,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setQuestionnaire(prev => ({
        ...prev,
        questions: prev.questions.map(q => 
          q._id === editingQuestion._id ? editingQuestion : q
        )
      }));

      setShowEditModal(false);
    } catch (err) {
      setEditError(err.message || 'Failed to update question');
    } finally {
      setEditLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="danger" className="mt-4">
        {error}
      </Alert>
    );
  }

  // No questionnaire found
  if (!questionnaire) {
    return <div className="mt-4">Questionnaire not found</div>;
  }

  // Main render
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{questionnaire.title}</h2>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <p className="text-muted mb-4">{questionnaire.description}</p>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Question</th>
            <th>Type</th>
            <th>Required</th>
            <th>Choices</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questionnaire.questions.map((question, index) => (
            <tr key={question._id}>
              <td>{index + 1}</td>
              <td>{question.questionText}</td>
              <td>
                <Badge bg={question.questionType === 'MultipleChoice' ? 'primary' : 'info'}>
                  {question.questionType}
                </Badge>
                {question.allowMultipleAnswers && (
                  <Badge bg="warning" text="dark" className="ms-2">
                    Multiple
                  </Badge>
                )}
                {question.otherOption?.enabled && (
                  <Badge bg="secondary" className="ms-2">
                    Other
                  </Badge>
                )}
              </td>
              <td>
                <Badge bg={question.isRequired ? "danger" : "secondary"}>
                  {question.isRequired ? "Required" : "Optional"}
                </Badge>
              </td>
              <td>
                {question.questionType === 'MultipleChoice' ? (
                  <ul className="list-unstyled mb-0">
                    {question.choices.map((choice, i) => (
                      <li key={i}>
                        {choice}
                        {i === question.choices.length - 1 && question.otherOption?.enabled && (
                          <span className="text-muted"> (Other: {question.otherOption.description || 'None'})</span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-muted">Text answer</span>
                )}
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleEditQuestion(question)}
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editError && <Alert variant="danger">{editError}</Alert>}
          
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Question Text *</Form.Label>
              <Form.Control
                type="text"
                name="questionText"
                value={editingQuestion?.questionText || ''}
                onChange={handleEditChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Question Type</Form.Label>
              <Form.Select
                name="questionType"
                value={editingQuestion?.questionType || 'MultipleChoice'}
                onChange={handleEditChange}
              >
                <option value="MultipleChoice">Multiple Choice</option>
                <option value="Text">Text Answer</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Required question"
                name="isRequired"
                checked={editingQuestion?.isRequired || false}
                onChange={handleEditChange}
              />
            </Form.Group>

            {editingQuestion?.questionType === 'MultipleChoice' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Allow multiple answers"
                    name="allowMultipleAnswers"
                    checked={editingQuestion?.allowMultipleAnswers || false}
                    onChange={handleEditChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Enable 'Other' option"
                    name="otherOption.enabled"
                    checked={editingQuestion?.otherOption?.enabled || false}
                    onChange={handleEditChange}
                  />
                </Form.Group>

                {editingQuestion?.otherOption?.enabled && (
                  <Form.Group className="mb-3">
                    <Form.Label>'Other' option description</Form.Label>
                    <Form.Control
                      type="text"
                      name="otherOption.description"
                      value={editingQuestion?.otherOption?.description || ''}
                      onChange={handleEditChange}
                    />
                  </Form.Group>
                )}

                <h5>Choices</h5>
                {editingQuestion?.choices?.map((choice, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <Form.Control
                      type="text"
                      name={`choices.${index}`}
                      value={choice}
                      onChange={handleEditChange}
                      className="me-2"
                      required
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveChoice(index)}
                      disabled={editingQuestion.choices.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleAddChoice}
                  className="mt-2"
                >
                  Add Choice
                </Button>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitEdit} disabled={editLoading}>
            {editLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default QuestionnaireTableView;
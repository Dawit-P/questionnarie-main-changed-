import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

const QuestionTable = () => {
  const { questionnaireId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null); // Track which question is being edited
  const [editedQuestion, setEditedQuestion] = useState({}); // Store edited values

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/questions/${questionnaireId}/questions`
        );
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, [questionnaireId]);

  const handleEdit = (question) => {
    setEditingId(question._id);
    setEditedQuestion({ ...question });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/questions/${editingId}`, editedQuestion);
      setQuestions((prev) =>
        prev.map((q) => (q._id === editingId ? { ...q, ...editedQuestion } : q))
      );
      setEditingId(null); // Exit edit mode
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null); // Exit edit mode
  };

  const handleChange = (field, value) => {
    setEditedQuestion({ ...editedQuestion, [field]: value });
  };

  const handleChoiceChange = (index, value) => {
    const updatedChoices = [...editedQuestion.choices];
    updatedChoices[index] = value;
    setEditedQuestion({ ...editedQuestion, choices: updatedChoices });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Question</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Choices</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map((question) => (
            <TableRow key={question._id}>
              <TableCell>
                {editingId === question._id ? (
                  <TextField
                    value={editedQuestion.questionText}
                    onChange={(e) => handleChange("questionText", e.target.value)}
                    fullWidth
                  />
                ) : (
                  question.questionText
                )}
              </TableCell>
              <TableCell>
                {editingId === question._id ? (
                  <TextField
                    value={editedQuestion.questionType}
                    onChange={(e) => handleChange("questionType", e.target.value)}
                    fullWidth
                  />
                ) : (
                  question.questionType
                )}
              </TableCell>
              <TableCell>
                {editingId === question._id ? (
                  editedQuestion.choices.map((choice, index) => (
                    <TextField
                      key={index}
                      value={choice}
                      onChange={(e) => handleChoiceChange(index, e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                  ))
                ) : (
                  question.choices.join(", ")
                )}
              </TableCell>
              <TableCell>
                {editingId === question._id ? (
                  <>
                    <IconButton onClick={handleSave}>
                      <SaveIcon />
                    </IconButton>
                    <IconButton onClick={handleCancel}>
                      <CancelIcon />
                    </IconButton>
                  </>
                ) : (
                  <IconButton onClick={() => handleEdit(question)}>
                    <EditIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default QuestionTable;
import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, Radio, RadioGroup, FormControlLabel } from "@mui/material";

const EditQuestion = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("MultipleChoice");
  const [choices, setChoices] = useState([""]);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/questions/${questionId}`);
        if (response.data) {
          setQuestionText(response.data.questionText);
          setQuestionType(response.data.questionType);
          setChoices(response.data.choices.map((choice) => choice.choiceText));
        } else {
          console.error("Question not found");
        }
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };
    fetchQuestion();
  }, [questionId]);

  const handleAddChoice = () => {
    setChoices([...choices, ""]);
  };

  const handleChoiceChange = (index, value) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = value;
    setChoices(updatedChoices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/questions/${questionId}`, {
        questionText,
        questionType,
        choices,
      });
      alert("Question updated successfully!");
      navigate("/list"); // Redirect to the questionnaire list
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Edit Question
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Question Text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <RadioGroup
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
        >
          <FormControlLabel value="MultipleChoice" control={<Radio />} label="Multiple Choice" />
          <FormControlLabel value="Text" control={<Radio />} label="Text" />
        </RadioGroup>
        {questionType === "MultipleChoice" && (
          <>
            {choices.map((choice, index) => (
              <TextField
                key={index}
                label={`Choice ${index + 1}`}
                value={choice}
                onChange={(e) => handleChoiceChange(index, e.target.value)}
                fullWidth
                margin="normal"
                required
              />
            ))}
            <Button variant="outlined" onClick={handleAddChoice} sx={{ marginTop: 1 }}>
              Add Choice
            </Button>
          </>
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
          Update Question
        </Button>
      </form>
    </Box>
  );
};

export default EditQuestion;
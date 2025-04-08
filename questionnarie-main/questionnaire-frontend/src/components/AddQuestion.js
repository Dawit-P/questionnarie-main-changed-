// components/AddQuestion.js
import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { useParams } from "react-router-dom";

const AddQuestion = () => {
    const { id } = useParams();
    const [questionText, setQuestionText] = useState("");
    const [questionType, setQuestionType] = useState("MultipleChoice");
    const [choices, setChoices] = useState([""]);

    const handleAddChoice = () => {
        setChoices([...choices, ""]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/api/questionnaires/${id}/questions`, {
                questionText,
                questionType,
                choices,
            });
            // Clear form after submission
            setQuestionText("");
            setChoices([""]);
        } catch (error) {
            console.error("Error adding question", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Question Text"
                required
            />
            <select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
                <option value="MultipleChoice">Multiple Choice</option>
                <option value="Text">Text Answer</option>
            </select>
            {questionType === "MultipleChoice" && (
                <div>
                    {choices.map((choice, index) => (
                        <input
                            key={index}
                            type="text"
                            value={choice}
                            onChange={(e) => {
                                const newChoices = [...choices];
                                newChoices[index] = e.target.value;
                                setChoices(newChoices);
                            }}
                            placeholder={`Choice ${index + 1}`}
                            required
                        />
                    ))}
                    <button type="button" onClick={handleAddChoice}>Add Choice</button>
                </div>
            )}
            <button type="submit">Add Question</button>
        </form>
    );
};

export default AddQuestion;
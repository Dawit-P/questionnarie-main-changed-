import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { useParams, useNavigate } from "react-router-dom";
import QuestionnaireForm from "./QuestionnaireForm"; // Reuse the form component

const EditQuestionnaire = () => {
  const { questionnaireId } = useParams(); // Get the questionnaire ID from the URL
  const navigate = useNavigate();
  const [questionnaire, setQuestionnaire] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the questionnaire data
  useEffect(() => {
    const fetchQuestionnaire = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/questions/${questionnaireId}`);
        setQuestionnaire(response.data);
      } catch (error) {
        console.error("Error fetching questionnaire:", error);
        setError("Failed to load questionnaire.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestionnaire();
  }, [questionnaireId]);

  const handleSubmit = async (updatedData) => {
    try {
      await axios.put(`http://localhost:5000/api/questions/${questionnaireId}`, updatedData);
      alert("Questionnaire updated successfully!");
      navigate("/"); // Redirect to the home page after updating
    } catch (error) {
      console.error("Error updating questionnaire:", error);
      setError("Failed to update questionnaire. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!questionnaire) {
    return <div>Questionnaire not found.</div>;
  }

  return (
    <QuestionnaireForm
      isEdit={true} // Pass isEdit prop to enable edit mode
      initialData={questionnaire} // Pass the fetched data to pre-fill the form
      onSubmit={handleSubmit} // Pass the submit handler for updates
    />
  );
};

export default EditQuestionnaire;
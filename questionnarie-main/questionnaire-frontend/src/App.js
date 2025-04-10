import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./components/Header";
import Footer from "./components/Footer";
import QuestionnaireForm from "./components/QuestionnaireForm";
import QuestionnaireList from "./components/QuestionnaireList";
import AnswerPage from "./components/AnswerPage";
import EditQuestion from "./components/EditQuestion";
import ReportPage from "./components/ReportPage";
import QuestionnaireDetails from "./components/QuestionnaireDetails";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "./components/AdminDashboard";
import EditQuestionnaire from "./components/EditQuestionnaire";
import QuestionnaireListOne from "./components/QuestionnaireListOne";
import OrganizationRegisterPage from "./components/OrganizationRegisterPage";
import SelectOrganizationAndQuestionnairePage from "./components/SelectOrganizationAndQuestionnairePage";
import QuestionnaireTableView from "./components/QuestionnaireTableView";
import "bootstrap/dist/css/bootstrap.min.css";
import { socket as Socket } from "./socket";

function App() {
  const [isConnected, setIsConnected] = useState(Socket.connected);

  useEffect(() => {
    Socket.connect();

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    Socket.on("connect", onConnect);
    Socket.on("disconnect", onDisconnect);

    return () => {
      Socket.off("connect", onConnect);
      Socket.off("disconnect", onDisconnect);
      Socket.disconnect();
    };
  }, []);

  return (
    <Router>
      <Header />
      <Box sx={{ minHeight: "80vh" }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<QuestionnaireList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/organization/register" element={<OrganizationRegisterPage />} />
          <Route path="/questionnaire/:id" element={<QuestionnaireDetails />} />
          <Route path="/answer/:id" element={<AnswerPage />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/questionnaire/edit/:id"
            element={
              <ProtectedRoute roles={["admin"]}>
                <EditQuestionnaire />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/questionnaire/create"
            element={
              <ProtectedRoute roles={["admin"]}>
                <QuestionnaireForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute roles={["admin"]}>
                <ReportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/questionnaire/table"
            element={
              <ProtectedRoute roles={["admin"]}>
                <QuestionnaireTableView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/questionnaire/edit-question/:id"
            element={
              <ProtectedRoute roles={["admin"]}>
                <EditQuestion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/select-organization"
            element={
              <ProtectedRoute>
                <SelectOrganizationAndQuestionnairePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>
      <Footer />
    </Router>
  );
}

export default App;
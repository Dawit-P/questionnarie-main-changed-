import React from "react";
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
import Login from "./components/Login"; // Add Login component
import Register from "./components/Register"; // Add Register component
import Profile from "./components/Profile"; // Add Profile component
import ProtectedRoute from "./ProtectedRoute"; // Add ProtectedRoute component
import AdminDashboard from "./components/AdminDashboard";
import EditQuestionnaire from "./components/EditQuestionnaire";
import QuestionnaireListOne from "./components/QuestionnaireListOne";
import OrganizationRegisterPage from "./components/OrganizationRegisterPage";
import SelectOrganizationAndQuestionnairePage from "./components/SelectOrganizationAndQuestionnairePage"; 
import QuestionnaireTableView from "./components/QuestionnaireTableView";
import "bootstrap/dist/css/bootstrap.min.css";
// src/App.js
import React, { useEffect, useState } from 'react';
import { socket } from './socket';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    // Connect to the server
    socket.connect();

    // Event listeners
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // Cleanup on unmount
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>{isConnected ? 'Connected' : 'Disconnected'}</h1>
      {/* Your component code */}
    </div>
  );
}

export default App;


function App() {
  return (
    <Router>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/questionnaires/view/:id" element={<QuestionnaireTableView />} />

          
        {/* Add other routes here */}
     

            <Route path="/list-one/:questionnaireId" element={<QuestionnaireListOne />} />

            
           


            {/* Protected Routes */}
             
            <Route 
            path="/"
             element={
              <ProtectedRoute roles={["admin"]}>  
             <AdminDashboard/>
              </ProtectedRoute>
             } 
             />

            <Route
             path="/select-organization-questionnaire"
             element={
              <ProtectedRoute roles={["admin"]}>
             <SelectOrganizationAndQuestionnairePage />
              </ProtectedRoute>
            }
               />

            <Route
             path="/report/:questionnaireId/organization/:organizationId"
             element={
              <ProtectedRoute roles={["admin"]}>
             <ReportPage />
             </ProtectedRoute>
            }
            />
            <Route 
            path="/register-organization" 
            element={
              <ProtectedRoute roles={["admin"]}>
            <OrganizationRegisterPage />
            </ProtectedRoute>
            } 
            />


            <Route
              path="/create-questionnaire"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <QuestionnaireForm />
                </ProtectedRoute>
              }
            />
             <Route
              path="/edit-questionnaire/:questionnaireId"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <EditQuestionnaire />
                </ProtectedRoute>
              }
            />
         
            <Route
              path="/answer/:questionnaireId"
              element={// <ProtectedRoute roles={["admin","public"]}>
                  <AnswerPage />
               // </ProtectedRoute>
              }
            />
            <Route
              path="/edit/:questionId"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <EditQuestion />
                </ProtectedRoute>
              }
            />
             {/* <Route 
                path="/register-organization" 
                element={
                  <ProtectedRoute roles={["admin"]}>
                <OrganizationRegisterPage />
                </ProtectedRoute>
                } 
            /> */}
            <Route
              path="/list"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <QuestionnaireList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report/:questionnaireId"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <ReportPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/questionnaire/:questionnaireId"
              element={
                <ProtectedRoute roles={["admin", "public"]}>
                  <QuestionnaireDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute roles={["admin", "public"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
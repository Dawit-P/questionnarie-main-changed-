import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { 
  FiPlus, FiUsers, FiFileText, FiActivity, FiSettings, 
  FiBarChart2, FiDatabase, FiArrowRight 
} from "react-icons/fi";
import "./AdminDashboard.css"; // Create this CSS file for custom styles

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Sample data for demonstration
  const stats = [
    { title: "Total Users", value: "2,845", icon: <FiUsers />, color: "#4e73df" },
    { title: "Active Surveys", value: "18", icon: <FiFileText />, color: "#1cc88a" },
    { title: "Responses Today", value: "1,234", icon: <FiActivity />, color: "#f6c23e" },
    { title: "Storage Used", value: "65%", icon: <FiDatabase />, color: "#e74a3b" }
  ];

  const recentActivities = [
    { id: 1, action: "New questionnaire created", time: "5m ago" },
    { id: 2, action: "User 'John Doe' registered", time: "2h ago" },
    { id: 3, action: "Survey response rate increased by 15%", time: "4h ago" }
  ];

  return (
    <Container fluid className="admin-dashboard">
      {/* Header Section */}
      <header className="dashboard-header">
        <h1>Admin Dashboard <Badge bg="primary">Analytics</Badge></h1>
        <div className="header-controls">
          <Button variant="outline-secondary" size="sm">
            <FiSettings className="me-2" />Settings
          </Button>
        </div>
      </header>

      {/* Stats Overview */}
      <Row className="stats-row">
        {stats.map((stat, index) => (
          <Col xl={3} md={6} key={index}>
            <Card className="stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
              <Card.Body>
                <div className="stat-icon" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="stat-content">
                  <h6>{stat.title}</h6>
                  <h3>{stat.value}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main Content Section */}
      <Row className="main-content">
        {/* Actions Section */}
        <Col xl={8} className="mb-4">
          <Card className="action-card">
            <Card.Body>
              <h5 className="card-title mb-4">Quick Actions</h5>
              <Row>
                <Col md={6} lg={4} className="mb-4">
                  <div className="dashboard-action" onClick={() => navigate("/create-questionnaire")}>
                    <div className="action-icon bg-primary">
                      <FiPlus size={24} />
                    </div>
                    <h6>Create Questionnaire</h6>
                    <p>Design a new survey form</p>
                    <Button variant="link" className="action-link">
                      Start Now <FiArrowRight />
                    </Button>
                  </div>
                </Col>
                <Col md={6} lg={4} className="mb-4">
                  <div className="dashboard-action" onClick={() => navigate("/register-organization")}>
                    <div className="action-icon bg-primary">
                      <FiPlus size={24} />
                    </div>
                    <h6>Create Organization</h6>
                    <p>survey form Organization</p>
                    <Button variant="link" className="action-link">
                      Start Now <FiArrowRight />
                    </Button>
                  </div>
                </Col>
                <Col md={6} lg={4} className="mb-4">
                  <div className="dashboard-action" onClick={() => navigate("/profile")}>
                    <div className="action-icon bg-info">
                      <FiUsers size={24} />
                    </div>
                    <h6>Manage Users</h6>
                    <p>User permissions & roles</p>
                    <Button variant="link" className="action-link">
                      Manage <FiArrowRight />
                    </Button>
                  </div>
                </Col>

                <Col md={6} lg={4} className="mb-4">
                  <div className="dashboard-action" onClick={() => navigate("/list")}>
                    <div className="action-icon bg-success">
                      <FiFileText size={24} />
                    </div>
                    <h6>Questionnaires</h6>
                    <p>View all survey forms</p>
                    <Button variant="link" className="action-link">
                      Browse <FiArrowRight />
                    </Button>
                  </div>
                </Col>

                <Col md={6} lg={4} className="mb-4">
                  <div className="dashboard-action" onClick={() => navigate("/select-organization-questionnaire")}>
                    <div className="action-icon bg-success">
                      <FiFileText size={24} />
                    </div>
                    <h6>Report</h6>
                    <p>View report of Organization</p>
                    <Button variant="link" className="action-link">
                      Browse <FiArrowRight />
                    </Button>
                  </div>
                </Col>
                
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Activity Section */}
        <Col xl={4} className="mb-4">
          <Card className="activity-card">
            <Card.Body>
              <h5 className="card-title mb-4">Recent Activity</h5>
              <div className="activity-list">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-dot"></div>
                    <div className="activity-content">
                      <p className="mb-0">{activity.action}</p>
                      <small className="text-muted">{activity.time}</small>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Analytics Section */}
      <Row>
        <Col xl={8} className="mb-4">
          <Card className="analytics-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title">Response Analytics</h5>
                <Button variant="outline-secondary" size="sm">
                  <FiBarChart2 className="me-2" />View Report
                </Button>
              </div>
              {/* Placeholder for Chart */}
              <div className="chart-placeholder">
                <p className="text-muted">Chart Component Here</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
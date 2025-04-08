import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 py-4">
      <Container>
        <Row>
          <Col md={6} className="text-center text-md-start">
           
            <p>© 2025 INSA Questionnaire App. All rights reserved.</p>
          </Col>
          
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
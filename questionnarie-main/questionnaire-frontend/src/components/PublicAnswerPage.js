import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

const PublicAnswerPage = () => {
  return (
    <Container fluid className="p-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-4">Answer Questionnaire</Card.Title>
              <Form>
                {/* Question 1 */}
                <Form.Group className="mb-3">
                  <Form.Label>Question 1: What is your favorite color?</Form.Label>
                  <Form.Control as="select">
                    <option>Red</option>
                    <option>Blue</option>
                    <option>Green</option>
                    <option>Yellow</option>
                  </Form.Control>
                </Form.Group>

                {/* Question 2 */}
                <Form.Group className="mb-3">
                  <Form.Label>Question 2: What is your favorite food?</Form.Label>
                  <Form.Control as="textarea" rows={3} />
                </Form.Group>

                {/* Submit Button */}
                <div className="d-grid">
                  <Button variant="primary" type="submit">
                    Submit Answers
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PublicAnswerPage;
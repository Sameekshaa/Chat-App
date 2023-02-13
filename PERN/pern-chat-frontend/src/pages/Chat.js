import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import MessageForm from "../components/MessageForm";
import Sidebar from "../components/Sidebar";

function Chat() {
  return (
    <Container>
      <Row>
        {/* First column in the row, with md (medium screen size) width of 4 */}
        <Col md={4}>
          {/* Render the Sidebar component */}
          <Sidebar />
        </Col>
        {/* Second column in the row, with md (medium screen size) width of 8 */}
        <Col md={8}>
          {/* Render the MessageForm component */}
          <MessageForm />
        </Col>
      </Row>
    </Container>
  );
}

export default Chat;

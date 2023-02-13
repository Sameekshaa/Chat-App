import "./Home.css";

import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";

// Home component
function Home() {
  // Retrieve the user data from the global state using the useSelector hook
  const user = useSelector((state) => state.user);

  // Render the Home component
  return (
    <Row>
      <Col
        md={6}
        className="d-flex flex-direction-column align-items-center justify-content-center"
      >
        <div>
          <h1>Join our Network</h1>
          <p>And connect with people around the world</p>{" "}
          {!user && (
            <LinkContainer to="/login">
              <Button variant="success">
                Get Started
                {/* Icon */}
                <i className="fas fa-comments home-message-icon"></i>
              </Button>
            </LinkContainer>
          )}
        </div>
      </Col>
      <Col md={6} className="home__bg"></Col>
    </Row>
  );
}

// Export the Home component as the default export
export default Home;

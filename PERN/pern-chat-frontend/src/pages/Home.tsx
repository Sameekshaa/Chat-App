import "./Home.css";

import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { SliceState } from "../features/userSlice";
import { useSelector } from "react-redux";

// Home component
const Home: React.FC = () => {
  // Retrieve the user data from the global state using the useSelector hook
  const user = useSelector((state: SliceState) => state.user);
  console.log("user", user);

  // Render the Home component
  return (
    <Row>
      <Col
        xs={12}
        md={6}
        lg={6}
        className="d-flex flex-direction-column align-items-center justify-content-center"
      >
        <div className="home_wrapper">
          <div className="home_text">
            <h1>Join our Network</h1>
            <p>And connect with people around the world</p>{" "}
          </div>
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
      <Col xs={12} md={6} lg={6} className="home__bg"></Col>
    </Row>
  );
};

// Export the Home component as the default export
export default Home;

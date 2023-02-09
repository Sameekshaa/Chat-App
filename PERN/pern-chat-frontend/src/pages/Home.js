import React from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";

function Home() {
  const user = useSelector((state) => state.user);
  return (
    <div className="center">
      <h1>Welcome to our Chat Application !!!</h1>
      <p>Let's connect with the world today.</p>
      {!user && (
        <LinkContainer to="/login">
          <Button variant="success">
            Get Started<i className="home-message-icon"></i>
          </Button>
        </LinkContainer>
      )}
    </div>
  );
}

export default Home;

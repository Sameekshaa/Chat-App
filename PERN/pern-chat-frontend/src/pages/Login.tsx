import "./Login.css";

import React, { ReactNode, useContext, useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { AppContext } from "../context/appContext";
import { useLoginUserMutation } from "../services/appApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";

// Login component
const Login: React.FC = () => {
  // State to store email entered by the user
  const [email, setEmail] = useState<string>("");
  // State to store password entered by the user
  const [password, setPassword] = useState<string>("");

  // Hook for navigation
  const navigate = useNavigate();

  // Context to access the socket object from the AppContext
  const { socket } = useContext(AppContext);

  // User mutation hook to login the user
  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  interface LoginResult {
    data?: any;
    error?: FetchBaseQueryError | SerializedError;
  }

  // Function to handle login form submission
  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    // Prevent default form submit behavior
    e.preventDefault();
    // login logic
    // Call the loginUser mutation with the email and password entered by the user
    loginUser({ email, password }).then((result: LoginResult) => {
      if (result.data) {
        // socket work
        // Emit a "new-user" event to the socket
        socket.emit("new-user");
        // Navigate to the chat page
        navigate("/chat");
      }
    });
  }

  return (
    <Container>
      <Row>
        {/* Background column */}
        <Col md={5} className="login__bg"></Col>

        {/* Login form column */}
        <Col
          md={7}
          className="d-flex align-items-center justify-content-center flex-direction-column"
        >
          <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleLogin}>
            {/* Email form group */}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              {/* Display error, if any */}
              {error && <p className="alert alert-danger">{'data' in error && error.data as ReactNode}</p>}
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.{" "}
              </Form.Text>
            </Form.Group>

            {/* Password form group */}
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </Form.Group>

            {/* Login button */}
            <Button variant="primary" type="submit">
              {isLoading ? <Spinner animation="grow" /> : "Login"}
            </Button>

            <div className="py-4">
              <p className="text-center">
                Don't have an account ? <Link to="/signup">Signup</Link>
              </p>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;

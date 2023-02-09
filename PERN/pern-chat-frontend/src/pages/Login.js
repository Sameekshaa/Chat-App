import React, { useContext, useState } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { AppContext } from "../context/appContext";
import { useLoginUserMutation } from "../services/appApi";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { socket } = useContext(AppContext);
  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  function handleLogin(e) {
    e.preventDefault();
    // login logic
    loginUser({ email, password }).then(({ data }) => {
      if (data) {
        // socket work
        socket.emit("new-user");
        // navigate to the chat
        navigate("/chat");
      }
    });
  }

  return (
    <Container className="center">
      <h1>Login</h1>
      <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleLogin}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          {error && <p className="alert alert-danger">{error.data}</p>}
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
        <Button variant="primary" type="submit">
          {isLoading ? <Spinner animation="grow" /> : "Login"}
        </Button>
        <div className="py-4">
          <p className="text-center">
            Don't have an account ? <Link to="/signup">Signup</Link>
          </p>
        </div>
      </Form>
    </Container>
  );
}

export default Login;

import React from "react";
import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useLogoutUserMutation } from "../services/appApi";

// Navigation component
function Navigation() {
  // Use the 'user' state from the Redux store
  const user = useSelector((state) => state.user);
  // Use the 'useLogoutUserMutation' hook for logging out the user
  const [logoutUser] = useLogoutUserMutation();
  // Use the 'useNavigate' hook
  const navigate = useNavigate();

  // Function to handle logout action by calling the logoutUser function
  async function handleLogout(e) {
    e.preventDefault();
    await logoutUser({ id: user.id });
    // Redirect to home page
    navigate("/");
  }

  return (
    // Render the navigation bar using react-bootstrap components
    <Navbar bg="light" expand="lg">
      <Container>
        {/* Link to the home page */}
        <LinkContainer to="/">
          <Navbar.Brand>
            {/* Display the logo */}
            <img src={logo} style={{ width: 50, height: 50 }} alt="logo" />
          </Navbar.Brand>
        </LinkContainer>

        {/* Toggle button for the navigation links */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Show the Login link only if the user is not authenticated */}
            {!user && (
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            )}

            {/* Show the user profile and Logout button only if the user is authenticated */}
            {user && (
              <NavDropdown
                title={
                  <>
                    {/* Display the user's profile picture */}
                    <img
                      src={user.picture || ""}
                      style={{
                        width: 30,
                        height: 30,
                        marginRight: 10,
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                      alt="user profile"
                    />
                    {/* Display the user's name */}
                    {user.name || ""}
                  </>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item>
                  {/* Logout button */}
                  <Button variant="danger" onClick={handleLogout}>
                    Logout
                  </Button>
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;

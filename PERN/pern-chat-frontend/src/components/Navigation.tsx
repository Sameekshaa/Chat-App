import React from "react";
import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { SliceState } from "../features/userSlice";
import { useLogoutUserMutation } from "../services/appApi";

// Navigation component
const Navigation: React.FC = () => {
  // Use the 'user' state from the Redux store
  const user = useSelector((state: SliceState) => state.user);
  // Use the 'useLogoutUserMutation' hook for logging out the user
  const [logoutUser] = useLogoutUserMutation();
  // Use the 'useNavigate' hook
  const navigate = useNavigate();
  // Function to handle logout action by calling the logoutUser function
  async function handleLogout(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (!user) {
      return;
    }
    await logoutUser({ id: user.id });
    // Redirect to home page
    navigate("/");
  }

  return (
    //Navbar
    <Navbar bg="light" expand="lg">
      <Container>
        {/* Link to the home page */}
        <LinkContainer to="/">
          <Navbar.Brand>
            {/* Display the logo */}
            <img src={logo} style={{ width: 50, height: 50 }} alt="logo" />
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* if user is not logged in login link is displayed*/}
            {!user && (
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            )}
            {/* if user is logged in users name and id is displayed  */}
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
                //Navigation dropdown to logout user
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
};

export default Navigation;

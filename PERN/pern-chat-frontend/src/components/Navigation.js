import React from "react";
import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useLogoutUserMutation } from "../services/appApi";

function Navigation() {
  const user = useSelector((state) => state.user);
  const [logoutUser] = useLogoutUserMutation();
  const navigate = useNavigate();
  async function handleLogout(e) {
    e.preventDefault();
    await logoutUser({ id: user.id });
    // redirect to home page
    navigate("/");
  }

  return (
    //Navbar 
    <Navbar bg="light" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>
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
                    {user.name || ""}
                  </>
                }
                //Navigation dropdown to logout user
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item>
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

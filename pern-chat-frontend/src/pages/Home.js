import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import "./Home.css";
function Home() {
    const user = useSelector((state) => state.user);
    return (
        <Row>
            <Col md={6} className="d-flex flex-direction-column align-items-center justify-content-center">
                <div>
                    <h1>Join our Network</h1>
                    <p>And connect with people around the world</p>
                    {
                        !user && (<LinkContainer to="/login">
                            <Button variant="success">
                                Get Started  <i className="fas fa-comments home-message-icon"></i>
                            </Button>
                        </LinkContainer>)}
                </div>
            </Col>
            <Col md={6} className="home__bg"></Col>
        </Row>
    );
}

export default Home;
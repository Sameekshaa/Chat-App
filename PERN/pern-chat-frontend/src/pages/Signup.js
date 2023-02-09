import React, {useState} from "react";
import {Button, Container, Form} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";

import botImg from "../assets/bot.jpeg";
import {useSignupUserMutation} from "../services/appApi";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [signupUser, {isLoading, error}] = useSignupUserMutation();
  const navigate = useNavigate();
  // image upload states
  const [image, setImage] = useState(null);
  const [upladingImg, setUploadingImg] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  function validateImg(e) {
    const file = e.target.files[0];
    if (file.size >= 1048576) {
      return alert("Max file size is 1mb");
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function uploadImage() {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "hcuhbvf7");
    try {
      setUploadingImg(true);
      let res = await fetch(
          "https://api.cloudinary.com/v1_1/db4z3pbzl/image/upload", {
            method : "post",
            body : data,
          });
      const urlData = await res.json();
      setUploadingImg(false);
      return urlData.url;
    } catch (error) {
      setUploadingImg(false);
      console.log(error);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    if (!image)
      return alert("Please upload your profile picture");
    const url = await uploadImage(image);
    console.log(url);
    // signup the user
    signupUser({name, email, password, picture : url}).then(({data}) => {
      if (data) {
        console.log(data);
        navigate("/chat");
      }
    });
  }

  return (
    <Container className="center">
      <Form style={
    { width: "80%", maxWidth: 500 }} onSubmit={handleSignup}>
        <h1 className="text-center">Create account</h1>
        <p className="text-center">Please upload profile pic before signup.</p>
        <div className="signup-profile-pic__container">
          <img
  src = {imagePreview || botImg} className = "signup-profile-pic"
  alt = "profile-pic" / >
        <label htmlFor = "image-upload" className = "image-upload-label">
        <i className = "fas fa-plus-circle add-picture-icon">
        </i>
          </label>< input
  type = "file"
  id = "image-upload"
  hidden
  accept = "image/png, image/jpeg"
  onChange = { validateImg } />
        </div > {" "} {error && <p className="alert alert-danger">{error.data}</p>}
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          {upladingImg || isLoading ? "Signing you up..." : "Signup"}
        </Button>
        <div className="py-4">
          <p className="text-center">
            Already have an account ? <Link to="/login">Login</Link>
          </p>
        </div>
      </Form>
    </Container>
  );
}

export default Signup;

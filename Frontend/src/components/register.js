import React, { Component } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import { signupData } from "../Sources/Auth";

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      name: "",
      password: "",
    };
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.responseGoogle = this.responseGoogle.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  responseGoogle = (response) => {
    this.setState({ email: response.profileObj.email });
    this.setState({ password: response.profileObj.googleId });
    return;
  };

  onChangeEmail(event) {
    this.setState({ email: event.target.value });
  }
  onChangeName(event) {
    this.setState({ name: event.target.value });
  }
  onChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      password: this.state.password,
      email: this.state.email,
    };

    console.log(newUser);
    signupData(newUser);
    // print(newUser)
    // axios.post("http://localhost:4000/user/signup", JSON.stringify(newUser),{
    //   headers:{
    //       'Content-Type': 'application/json',
    //       // 'Access-Control-Allow-Origin': '*'
    //    }
    // }
    // ).then(res => {
    //   console.log("Adding: \n");
    //   console.log(res.data);
    //   if(res.data.success === false)
    //     alert("This email-id has already been taken! Try with a different email-id");
    //   else
    //   {
    //     localStorage.removeItem("currentUser");
    //     localStorage.setItem('currentUser',JSON.stringify(res.data.email));
    //     var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    //     console.log("setting local storage as: \n");
    //     console.log(currentUser.email);
    //     this.props.history.push("/sessionsList");
    //   }
    // });

    this.setState({
      email: "",
      password: "",
      name: "",
    });
  }

  render() {
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/login" className="nav-link">
                Sign In
              </Link>
              <Link to="/register" className="navbar-brand">
                Sign Up
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <br />
        <br />
        <Form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Full Name: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.name}
              onChange={this.onChangeName}
            />
          </div>
          {/* <div className="form-group">
            <label>Username: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.username}
              onChange={this.onChangeUsername}
            />
          </div> */}
          <div className="form-group">
            <label>Email: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.email}
              onChange={this.onChangeEmail}
            />
          </div>
          <div className="form-group">
            <label>Password: </label>
            <input
              type="password"
              className="form-control"
              value={this.state.password}
              onChange={this.onChangePassword}
            />
          </div>
          {/* <Form.Group
            controlId="exampleForm.ControlSelect1"
            value={this.state.type}
            onChange={this.onChangeType}
            inputRef={el => (this.inputEl = el)}
          >
            <Form.Label>Type</Form.Label>
            <Form.Control as="select">
              <option value="applicant">Applicant</option>
              <option value="recruitor">Recruitor</option>
            </Form.Control>
          </Form.Group> */}
          <div className="form-group">
            <input type="submit" value="SignUp" className="btn btn-primary" />
          </div>
          <div>
            <GoogleLogin
              clientId="758385782295-9bpcpv513gbbkpio10bqkve1931jbh0n.apps.googleusercontent.com"
              buttonText="SignUp Through Google"
              onSuccess={this.responseGoogle}
              onFailure={this.responseGoogle}
              // cookiePolicy={'single-host-origin'}
            />
          </div>
        </Form>
      </div>
    );
  }
}

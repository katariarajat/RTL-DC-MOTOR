import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import Register from "./register";
import Login from "./login";

export default class Home extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    localStorage.clear();
  }

  render() {
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Link to="/" className="navbar-brand">
                Home
              </Link>
              <Link to="/login" className="nav-link">
                Sign In
              </Link>
              <Link to="/register" className="nav-link">
                Sign Up
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <br />
        <br />
        <div
          style={{
            backgroundColor: "skyblue",
            padding: 100,
            textAlign: "center",
          }}
        >
          <h1>ESW Team 22 - RTL - DC motor speed control project</h1>
        </div>
      </div>
    );
  }
}

import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from 'react-bootstrap/Navbar';
import axios from "axios";
import { GoogleLogin } from 'react-google-login';
import { signupData } from "../Sources/Auth"
export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    // this.responseGoogle = this.responseGoogle.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  // responseGoogle=(response)=>
  // {
  //   // console.log(response);
  //   console.log(response.profileObj);
    
  //   this.setState({email: response.profileObj.email});
  //   this.setState({ password: response.profileObj.googleId});

  //   const newUser = {
  //     email: this.state.email,
  //     password: this.state.password
  //   };

    // console.log(newUser);

    // axios.post("http://localhost:4000/user/signin", newUser).then(res => {
    //   console.log(res)
    //   if (res.data.success === true) {
    //     localStorage.setItem("currentUser",JSON.stringify(res.data.email));
    //     var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    //     console.log("loginid = "+ currentUser.email);
    //     // this.props.history.push("/UserHome");
    //   }
    //   else
    //   {
    //     alert(res.data.res);
    //   }
    // });

    // this.props.history.push("/sessionsList");




  // }

  onChangeEmail(event) {
    this.setState({ email: event.target.value });
  }
  onChangePassword(event) {
    this.setState({ password: event.target.value });
  }
  onSubmit(e) {
    e.preventDefault();

    const newUser = {
        email: this.state.email,
        password: this.state.password
    };

    console.log(newUser);

    axios.post("http://localhost:4000/user/signin", newUser).then(res => {
      if (res.data.success === true) {
        localStorage.setItem("currentUser",JSON.stringify(res.data));
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.props.history.push("/sessionsList");
      }
      else
      {
        alert(res.data.res);
      }
    });

    
  }

  render() {
    return (
      
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
          <Link to="/" className="nav-link">Home</Link>
          {/* <Link to="/allusers" className="nav-link">Users</Link> */}
          <Link to="/login" className="navbar-brand">Sign In</Link>
          <Link to="/register" className="nav-link">Sign Up</Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
        <br/>
        <br/>
        <form onSubmit={this.onSubmit}>
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
              id="password"
              type="password"
              name="password"
              className="form-control"
              value={this.state.password}
              onChange={this.onChangePassword}
            />
          </div>
          <div className="form-group">
            <input type="submit" value="LOGIN" className="btn btn-primary" />
          </div>
        </form>

        <GoogleLogin
          clientId="758385782295-9bpcpv513gbbkpio10bqkve1931jbh0n.apps.googleusercontent.com"
          buttonText="Login through Google"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
          // cookiePolicy={'single-host-origin'}
          />

        
      </div>
    );
  }
}

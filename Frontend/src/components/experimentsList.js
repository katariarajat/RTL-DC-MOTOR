import React, { Component } from "react";
import axios from "axios";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
// import { Alert } from 'react-native';
import {
  GetExperimentList,
  CreateNewExperiment,
  DeleteExperimentById,
  checkedLogged,
} from "../Sources/Auth";
export default class ExperimentsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      experiments: [],
      sessionId: "",
      description: "",
    };
    // this.onCreateExperiment= this.onCreateExperiment.bind(this);
    this.onClickLink = this.onClickLink.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.deleteExperiment = this.deleteExperiment.bind(this);
  }

  async componentDidMount() {
    var user_email = await checkedLogged();
    if (user_email == "") return;
    this.setState({
      email: user_email,
    });
    var sess_id = this.props.location.state.id;
    this.setState({ sessionId: sess_id });
    // var user_email = JSON.parse(localStorage.getItem('currentUser'));
    console.log("sessID = " + sess_id);
    console.log("going to get sessions");
    var req = {
      session_id: sess_id,
      userEmail: user_email,
    };
    this.setState({ experiments: await GetExperimentList(req) });
  }

  async onSubmit(e) {
    e.preventDefault();
    console.log("onononn");

    var exp = {
      email: this.state.email,
      session_Id: this.state.sessionId,
    };

    var data = await CreateNewExperiment(exp);
    console.log(data);
    this.props.history.push({
      pathname: "/session",
      state: {
        experiment_id: data,
        running: this.props.location.state.running,
      },
    });
  }

  onClickLink(e) {
    // e.preventDefault();
    this.props.history.push({
      pathname: "/experiment",
      // state: { experiment_id : e.target.id.value }
      state: { experiment_id: e, running: this.props.location.state.running },
    });
  }

  deleteExperiment(e) {
    // e.preventDefault();
    var sess_id = this.props.location.state.id;
    var req = {
      //   experiment_id : e.target.id.value,
      experiment_id: e,
      session_id: sess_id,
    };

    DeleteExperimentById(req);
  }

  CreateExperimentOrNot() {
    // console.log("Print");
    console.log(this.props.location.state.running);
    if (this.props.location.state.running) {
      return (
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <input
              type="submit"
              value="Create Experiment"
              className="btn btn-primary"
            />
          </div>
        </form>
      );
    }
  }

  render() {
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/sessionsList">Back to Sessions List </Nav.Link>
              {/* <Nav.Link href="/session">Create Experiment   </Nav.Link> */}
              {/* <Navbar.Brand href="/startSession">Start Session    </Navbar.Brand> */}
            </Nav>
            <Nav>
              <Nav.Link href="/">Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <br />
        {/* <form onSubmit={this.onCreateExperiment}>
                <button className='btn-primary' type="submit">Create Experiment</button>
            </form> */}

        {this.CreateExperimentOrNot()}

        {/* <form onSubmit={this.onSubmit}>
                <div className="form-group">
                    <input type="submit" value="Create Experiment" className="btn btn-primary" />
                </div>
            </form> */}

        <br />

        <h1>Experiments: </h1>
        <br />
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Experiment No.</th>
              <th>Experiment Id</th>
              {/* <th>Experiment Name</th> */}
              <th>Link</th>
              <th>Delete Experiment</th>
            </tr>
          </thead>
          <tbody>
            {this.state.experiments.map((j, i) => {
              return (
                <tr>
                  <td>{i + 1}</td>
                  <td>{j.ExperimentId}</td>
                  {/* <td>{j.sessionStartTime}</td> */}
                  <td>
                    <button
                      class="btn-primary"
                      onClick={() => this.onClickLink(j.ExperimentId)}
                    >
                      Enter
                    </button>
                    {/* <form onSubmit={this.onClickLink}>
                            <div className="form-group">
                                <input type="submit" name="id" value={j.ExperimentId} className="btn btn-primary" />
                            </div>
                        </form> */}

                    {/* <button onClick={this.viewExperiments(j.sessionId)}>{j.sessionId}</button> */}
                    {/* <Button className="btn btn-primary" value={j.sessionId} /> */}
                  </td>
                  <td>
                    <button
                      class="btn-danger"
                      onClick={() => this.deleteExperiment(j.ExperimentId)}
                    >
                      Delete
                    </button>
                    {/* <form onSubmit={this.deleteExperiment}>
                            <div className="form-group">
                                <input type="submit" name="id" value={j.ExperimentId} className="btn btn-danger" />
                            </div>
                        </form> */}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

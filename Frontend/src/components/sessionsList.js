import React, { Component } from "react";
import axios from "axios";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Moment from "react-moment";
import moment from "moment";
import {
  GetBookedSession,
  DeleteSession,
  checkedLogged,
} from "../Sources/Auth";
export default class SessionsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessions: [],
      sessionsToShow: [],
      sessionDate: "",
      userEmail: "",
    };
    this.viewExperiments = this.viewExperiments.bind(this);
    this.deleteSession = this.deleteSession.bind(this);
    this.onChangeSessionDate = this.onChangeSessionDate.bind(this);
    this.showAll = this.showAll.bind(this);
  }

  showAll() {
    console.log(this.state.sessions);
    this.setState({
      sessionsToShow: this.state.sessions,
    });
  }

  async onChangeSessionDate(momentDate) {
    console.log("value:\n");
    // var date = "ALL";
    var date = momentDate ? moment(momentDate).format("YYYY-MM-DD") : undefined;
    console.log(date);
    this.setState({ sessionDate: momentDate });
    var NewSessions = [];
    // console.log(this.state.sessions);
    var OldSessions = this.state.sessions;
    console.log(OldSessions);
    for (let index = 0; index < OldSessions.length; index++) {
      console.log(OldSessions[index].sessionDate);
      if (OldSessions[index].sessionDate == date) {
        NewSessions.push(OldSessions[index]);
      }
    }
    console.log(NewSessions);
    this.setState({
      sessionsToShow: NewSessions,
    });
  }

  async componentDidMount() {
    var userEmail = await checkedLogged();
    console.log(userEmail);
    if (userEmail == "") return;
    this.setState({ userEmail: userEmail });
    console.log("going to get sessions");
    /**
     * Function to get sessiondata
     */
    var request = {
      userEmail: this.state.userEmail,
    };
    console.log(request);
    var session = await GetBookedSession(request);
    var array = [1, 2, 3, 4];
    array.sort((a, b) => {
      return b - a;
    });
    console.log(array);
    session.sort((a, b) => {
      // 2021-11-17 71-11-1202
      // 2021-11-29 92-11-1202
      if (a.sessionDate == b.sessionDate) {
        if (a.sessionStartTime < b.sessionStartTime) return 1;
        else return -1;
      }
      // console.log(b.sessionDate-a.sessionDate);
      if (b.sessionDate > a.sessionDate) return 1;
      else return -1;
      // return   b.sessionDate-a.sessionDate;
    });

    this.setState({
      sessions: session,
      // sessiondate : "ALL",
      sessionsToShow: session,
    });
  }

  viewExperiments(e, isRunning) {
    // e.preventDefault();
    //    localStorage.setItem("current_session_id",JSON.stringify(e));
    console.log(e);
    this.props.history.push({
      pathname: "/experimentsList",
      state: { id: e, running: isRunning },
    });
  }

  async deleteSession(e) {
    //    localStorage.setItem("current_session_id",JSON.stringify(e));
    //  console.log("vvvvvvvvv=== " + e);
    var request = {
      session_id: e,
      userEmail: this.state.userEmail,
    };
    await DeleteSession(request);
  }

  CheckRunning(a, b) {
    var today = new Date();
    console.log(a, b);
    console.log(today.getDate());
    if (
      today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        (String(today.getDate()).length == 1 ? "0" : "") +
        today.getDate() ==
        b &&
      today.getHours() == a.substring(0, 2)
    ) {
      return true;
    }
    return false;
  }
  render() {
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/requestSession">Request Session </Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link href="/">Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <h1>Sessions: </h1>
        <div>
          PickByDate:
          <DatePicker
            selected={this.state.sessionDate}
            // onSelect={this.state.sessionDate} //when day is clicked
            onChange={this.onChangeSessionDate} //only when value has changed
          />
          <button class="btn-primary" onClick={this.showAll}>
            Show All
          </button>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Session No.</th>
              <th>Date(YYYY-MM-DD)</th>
              <th>Time(HH:MM)</th>
              <th>Experiments Link</th>
              <th>Delete Session</th>
            </tr>
          </thead>
          <tbody>
            {this.state.sessionsToShow.map((j, i) => {
              return (
                <tr>
                  <td>
                    {i + 1}
                    {this.CheckRunning(j.sessionStartTime, j.sessionDate) && (
                      <span style={{ color: "Green" }}> Running</span>
                    )}
                  </td>
                  <td>{j.sessionDate}</td>
                  <td>{j.sessionStartTime}</td>
                  <td>
                    <button
                      class="btn-success"
                      onClick={() =>
                        this.viewExperiments(
                          j.sessionId,
                          this.CheckRunning(j.sessionStartTime, j.sessionDate)
                        )
                      }
                    >
                      Enter
                    </button>
                  </td>
                  <td>
                    <button
                      class="btn-danger"
                      onClick={() => this.deleteSession(j.sessionId)}
                    >
                      Delete
                    </button>
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

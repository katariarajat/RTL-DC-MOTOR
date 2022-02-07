import React, { Component } from "react";
import axios from "axios";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";
import DateTimePicker from "react-datetime-picker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Moment from "react-moment";
import moment from "moment";
import {
  GetUnBookedSessions,
  BookSession,
  checkedLogged,
} from "../Sources/Auth";
export default class RequestSession extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      sessionDate: "",
      StartDate: "",
      availableSlots: [],
      sessionTime: "01:00",
      userEmail: "",
    };

    this.onChangeSessionDate = this.onChangeSessionDate.bind(this);
    this.onChangeSessionTime = this.onChangeSessionTime.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async componentDidMount() {
    console.log("print");
    var userEmail = await checkedLogged();
    if (userEmail == "") return;
    this.setState({ userEmail: userEmail });
  }

  onChangeSessionTime(sessionTime) {
    console.log("value:\n");
    console.log(sessionTime.target.value);
    this.setState({ sessionTime: sessionTime.target.value });
  }
  async onChangeSessionDate(momentDate) {
    console.log("value:\n");
    var date = momentDate ? moment(momentDate).format("YYYY-MM-DD") : undefined;
    var todayDate = moment(new Date()).format("YYYY-MM-DD");
    if (date < todayDate) {
      alert("Please select today's or upcomming date");
      return;
    }

    this.setState({ sessionDate: momentDate });
    this.setState({ StartDate: date });
    var Data = { date: String(date) };

    /*
         Calling function for get unbooked session in auth.js 
         */
    var result = await GetUnBookedSessions(Data);
    this.setState({ availableSlots: result, sessionTime: result[0] });
  }

  onSubmit(e) {
    e.preventDefault();
    // add session to db
    // and redirect to homepage
    console.log("Submitting");
    let session = {
      date: this.state.StartDate,
      starttime: this.state.sessionTime,
      userEmail: this.state.userEmail,
    };
    console.log(session);

    /** Function to send data for booking*/
    BookSession(session);
  }

  render() {
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/sessionsList">Back to sessions list </Nav.Link>
            </Nav>
            {/* <Nav>
                        <Nav.Link href="/">Logout</Nav.Link>
                    </Nav> */}
          </Navbar.Collapse>
        </Navbar>

        <br />
        <br />

        <Form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Date : </label>
            <DatePicker
              // selected = {this.state.sessionDate}
              // dateFormat="YYYY/MM/dd"
              onSelect={this.onChangeSessionDate}
              selected={this.state.sessionDate}
            />
          </div>
          <div className="form-group">
            <label>Time : </label>
            <select onChange={this.onChangeSessionTime}>
              {this.state.availableSlots.map((slot) => {
                return <option value={slot}> {slot} </option>;
              })}
            </select>
          </div>

          <div className="form-group">
            <input
              type="submit"
              value="Add Session"
              className="btn btn-primary"
            />
          </div>
        </Form>
      </div>
    );
  }
}

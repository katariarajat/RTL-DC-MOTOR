import React, { Component } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { GetExperimentDataById } from "../Sources/Auth";
var data = [
  {
    RPM: 4000,
    Voltage: 2400,
    Avg_Current: 2400,
    TheoriticalRpm: 1000,
  },
  {
    name: "Page B",
    RPM: 3000,
    Voltage: 1398,
    Avg_Current: 2210,
    TheoriticalRpm: 1000,
  },
  {
    name: "Page C",
    RPM: 2000,
    Voltage: 9800,
    Avg_Current: 2290,
    TheoriticalRpm: 1000,
  },
  // name: "Page A",
  {
    name: "Page D",
    RPM: 2780,
    Voltage: 3908,
    Avg_Current: 2000,
    TheoriticalRpm: 1000,
  },
  {
    name: "Page E",
    RPM: 1890,
    Voltage: 4800,
    Avg_Current: 2181,
    TheoriticalRpm: 1000,
  },
  {
    name: "Page F",
    RPM: 2390,
    Voltage: 3800,
    Avg_Current: 2500,
    TheoriticalRpm: 1000,
  },
  {
    name: "Page G",
    RPM: 3490,
    Voltage: 4300,
    Avg_Current: 2100,
    TheoriticalRpm: 1000,
  },
];

export default class Experiment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      data: "",
      graphData: [],
      summary: "",
      minRPM: 0,
      maxRPM: 1000,
      minCur: 0,
      maxCur: 2,
    };
  }

  async componentDidMount() {
    var exp_id = this.props.location.state.experiment_id;
    console.log("exp_id", exp_id);
    var req = {
      experiment_id: exp_id,
    };
    var ExperimentData = await GetExperimentDataById(req);
    console.log("received data : ", ExperimentData);
    var temp = ExperimentData.experimentData;
    // temp.sort((a,b) => (parseFloat(a.Voltage) > parseFloat(b.Voltage)) ? 1 : ((parseFloat(b.Voltage) > parseFloat(a.Voltage)) ? -1 : 0));

    // console.log("sorted data : ", temp);
    this.setState({ graphData: temp });
    // this.setState({minRPM : temp[0].RPM-20});
    // this.setState({maxRPM : temp[0].RPM+20});
    this.setState({ summary: ExperimentData.description });
    console.log("expdata", this.state.graphData);
  }

  // onSubmit(e)
  // {
  //   e.preventDefault();
  // }

  render() {
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/requestSession">Request Session </Nav.Link>
              <Nav.Link href="/sessionsList">Back to sessions list </Nav.Link>
              {/* <Nav.Link href="/sessionHistory">Session History    </Nav.Link> */}
              {/* <Navbar.Brand href="/startSession">Start Session    </Navbar.Brand> */}
            </Nav>
            <Nav>
              <Nav.Link href="/">Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <br />
        <br />
        <h1>Experiment Analysis{this.state.data.name}</h1>
        <br />
        <br />
        <div class="container">
          <p>{this.state.summary}</p>
        </div>
        <br />
        <br />
        <div class="graph">
          {/* <LineChart width={600} height={400} data={data}>
                   <CartesianGrid strokeDasharray="3 3"/>
                   <XAxis dataKey="Voltage" />
                   <YAxis yAxisId="left-axis" />
                   <YAxis yAxisId="right-axis" orientation="right" />
                   <Tooltip />
                   <Legend />
                   <Line yAxisId="left-axis" type="monotone" dataKey="RPM"
                   stroke="green"/>
                   <Line yAxisId="right-axis" type="monotone" dataKey="Avg_Current"
                   stroke="red" />
                 </LineChart> */}
          {/* RPM (theo and obs) vs voltage */}

          <LineChart width={600} height={400} data={this.state.graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Voltage" />
            <YAxis yAxisId="left-axis" />
            <YAxis yAxisId="right-axis" orientation="right" />
            <Tooltip />
            <Legend wrapperStyle={{ top: -20, left: 25 }} />
            <Line
              yAxisId="left-axis"
              type="monotone"
              dataKey="RPM"
              stroke="green"
            />
            <Line
              yAxisId="left-axis"
              type="monotone"
              dataKey="TheoriticalRpm"
              stroke="blue"
            />
            <Line
              yAxisId="right-axis"
              type="monotone"
              dataKey="Avg_Current"
              stroke="red"
            />
          </LineChart>

          <br />

          <LineChart width={600} height={400} data={this.state.graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Voltage" />
            <YAxis yAxisId="left-axis" />
            <Tooltip />
            <Legend wrapperStyle={{ top: -20, left: 25 }} />
            <Line
              yAxisId="left-axis"
              type="monotone"
              dataKey="RPM"
              stroke="green"
            />
            <Line
              yAxisId="left-axis"
              type="monotone"
              dataKey="TheoriticalRpm"
              stroke="blue"
            />
          </LineChart>

          <br />

          <LineChart width={600} height={400} data={this.state.graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Voltage" />
            <YAxis yAxisId="right-axis" />
            <Tooltip />
            <Legend wrapperStyle={{ top: -20, left: 25 }} />
            <Line
              yAxisId="right-axis"
              type="monotone"
              dataKey="Avg_Current"
              stroke="red"
            />
          </LineChart>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>S no.</th>
              <th>Voltage(V)</th>
              <th>Theoretical RPM</th>
              <th>Observed RPM</th>
              <th>Average Current(A)</th>
            </tr>
          </thead>
          <tbody>
            {this.state.graphData.map((j, i) => {
              return (
                <tr>
                  <td>{i + 1}</td>
                  <td>{j.Voltage}</td>
                  <td>{j.TheoriticalRpm}</td>
                  <td>{j.RPM}</td>
                  <td>{j.Avg_Current}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

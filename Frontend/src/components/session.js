import React, { Component } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import ReactPlayer from "react-player";
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
import { checkedLogged, SaveExperimentData } from "../Sources/Auth";
var ExampleData = [
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

export default class Session extends Component {
  constructor() {
    super();
    this.state = {
      videos: [],
      vcc: "",
      graphData: [],
      savedTime: "",
      summary: "",
      isDisabled: false,
      experimentId: "",
      graphDataPerVolt: [],
    };
    this.onChangevcc = this.onChangevcc.bind(this);
    this.onSubmitvcc = this.onSubmitvcc.bind(this);
    this.onChangesummary = this.onChangesummary.bind(this);
  }

  async GetLatestData() {
    try {
      // var destination = 'http://127.0.0.1:8080/~/in-cse/in-name/AE-RTL-MOTOR/' + this.props.location.state.experiment_id + '/la';

      var receivedData = {};
      var data = {
        expid: this.state.experimentId,
      };
      await axios
        .get("http://localhost:4000/getDataFromOneM2M", { params: data })
        .then((res) => {
          receivedData = res.data;
        });

      var response = receivedData;
      console.log("response=", response);
      // const val_array = response.split(' ');
      /**
       * Rotations of the motor
       */
      var Rotations = 150;
      var formattedData = [];
      response.forEach((element) => {
        var tempFormattedData = {
          RPM: parseFloat(element.RPM),
          Voltage: parseFloat(element.Voltage),
          Avg_Current: parseFloat(element.Avg_Current),
          TheoriticalRpm: (parseFloat(this.state.vcc) / 12) * Rotations,
        };

        formattedData.push(tempFormattedData);
      });

      console.log("Formatted Data = ", formattedData);

      var tempGraphDataPerVolt = this.state.graphDataPerVolt;

      tempGraphDataPerVolt.push({
        // Input_Voltage : this.state.vcc,
        Voltage: parseFloat(this.state.vcc),
        RPM:
          (formattedData[0].RPM +
            formattedData[1].RPM +
            formattedData[2].RPM +
            formattedData[3].RPM +
            formattedData[4].RPM) /
          5,
        // Voltage : (formattedData[0].Voltage + formattedData[1].Voltage + formattedData[2].Voltage + formattedData[3].Voltage + formattedData[4].Voltage)/5,
        Avg_Current:
          (formattedData[0].Avg_Current +
            formattedData[1].Avg_Current +
            formattedData[2].Avg_Current +
            formattedData[3].Avg_Current +
            formattedData[4].Avg_Current) /
          5,
        TheoriticalRpm: (parseFloat(this.state.vcc) / 12) * Rotations,
      });

      console.log("Temp Graph Data Per Volt= ", tempGraphDataPerVolt);
      this.setState({ graphData: formattedData });
      this.setState({ graphDataPerVolt: tempGraphDataPerVolt });

      console.log("hahaha");

      console.log("Final Graph Data Per Volt= ", this.state.graphDataPerVolt);
    } catch (error) {
      console.log(error);
    }
  }

  async componentDidMount() {
    this.setState({ graphData: [] });
    this.setState({ graphDataPerVolt: [] });
    var userEmail = await checkedLogged();
    this.setState({ experimentId: this.props.location.state.experiment_id });
    if (userEmail == "") return;
    this.setState({
      userEmail: userEmail,
    });
  }
  onChangevcc(e) {
    console.log("get", e.target.value);
    this.setState({ vcc: e.target.value });
  }
  onChangesummary(e) {
    console.log("get", e.target.value);
    this.setState({ summary: e.target.value });
  }

  onSubmitvcc(e) {
    e.preventDefault();
    console.log("voltage is " + this.state.vcc);
    console.log(process.env.ESP32_IP);
    axios
      .get("http://192.168.1.2/voltage", {
        params: {
          voltage: this.state.vcc,
          experiment_id: this.props.location.state.experiment_id,
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status == 200) {
          alert("Value sent");
        } else {
          alert("Send value again");
        }
      });
    this.setState({
      isDisabled: true,
    });

    // **** here's the timeout ****
    setTimeout(() => {
      this.setState({ isDisabled: false });
      this.GetLatestData();
    }, 25000);
  }

  async StopSession() {
    var today = new Date();
    var request = {
      expId: this.props.location.state.experiment_id,
      LastSavedtime:
        today.getHours() +
        ":" +
        (today.getMonth() + 1) +
        ":" +
        today.getSeconds(),
      graphData: this.state.graphData,
      description: this.state.summary,
    };
    if (await SaveExperimentData(request)) {
      this.props.history.push({
        pathname: "/experiment",
        state: { id: this.props.location.state.experiment_id },
      });
    } else {
      alert("Sesstion could not be saved.Please stop again");
    }
  }

  async SaveSession() {
    var today = new Date();

    var request = {
      expId: this.props.location.state.experiment_id,
      LastSavedtime:
        today.getHours() +
        ":" +
        (today.getMonth() + 1) +
        ":" +
        today.getSeconds(),
      graphData: this.state.graphDataPerVolt,
      description: this.state.summary,
    };
    await SaveExperimentData(request);
  }

  ExperimentRunningOrNot() {
    if (this.props.location.state.running) {
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

        <div class="container">
          <div class="row">
            {/* {this.state.videos.map(video =>
                        <div className="col-md-4" key={video.id}>
                            <Link to={`/player/${video.id}`}>
                                <div className="card border-0">
                                    <img src={`http://localhost:4000${video.poster}`} alt={video.name} />
                                    <div className="card-body">
                                        <p>{video.name}</p>
                                        <p>{video.duration}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        )} */}
            <iframe title="twitchStream" src="https://player.twitch.tv/?channel=nitinchandak&parent=localhost" frameborder="0" scrolling="no" height="378" width="620" muted="true"></iframe>
          </div>
          <br />
          <button class="btn-danger" onClick={() => this.StopSession()}>
            Stop Experiment
          </button>
          &nbsp; &nbsp; &nbsp; &nbsp;
          <button class="btn-success" onClick={() => this.SaveSession()}>
            Save Experiment
          </button>
        </div>
        <br />
        <br />
        <div>
          {!this.state.isDisabled && this.ExperimentRunningOrNot() && (
            <form onSubmit={this.onSubmitvcc}>
              <div className="form-group">
                <label>VCC : </label>
                <input
                  type="text"
                  className="form-control"
                  name="vcc"
                  value={this.state.vcc}
                  onChange={this.onChangevcc}
                />
              </div>

              <div className="form-group">
                <input
                  type="submit"
                  value="submit"
                  className="btn btn-primary"
                />
              </div>
            </form>
          )}
          {this.state.isDisabled && (
            <div>
              Please wait for 25 seconds while the experiment is running...
            </div>
          )}
          <br />
          Add Experiment Summary:
          <br />
          {this.ExperimentRunningOrNot() && (
            <textarea
              value={this.state.summary}
              onChange={this.onChangesummary}
            />
          )}
        </div>
        <br />
        <br />
        <br />
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

          <LineChart
            label="Voltage(V) vs Avg Current(A) vs Observerd RPM vs Theoretical RPM"
            width={600}
            height={400}
            data={this.state.graphData}
          >
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
          <br />

          <LineChart
            label="Voltage(V) vs RPM vs Theoretical RPM"
            width={600}
            height={400}
            data={this.state.graphData}
          >
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
          <br />

          <LineChart
            label="Voltage(V) vs Avg Current(A)"
            width={600}
            height={400}
            data={this.state.graphData}
          >
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

          <br />
          <br />

          {/* <LineChart width={600} height={400} data={this.state.graphDataPerVolt}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="Voltage" />
                    <YAxis yAxisId="left-axis" />
                    <YAxis yAxisId="right-axis" orientation="right" />
                    <Tooltip />
                    <Legend wrapperStyle={{top: -20, left: 25}}/>
                    <Line yAxisId="left-axis" type="monotone" dataKey="RPM" 
                    stroke="green"/>
                    <Line yAxisId="left-axis" type="monotone" dataKey="TheoriticalRpm" 
                    stroke="blue"/>
                    <Line yAxisId="right-axis" type="monotone" dataKey="Avg_Current" 
                    stroke="red" />
                    
                  </LineChart> */}
        </div>
      </div>
    );
  }
}

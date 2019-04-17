import React, { Component } from "react";
import { FilePond } from "react-filepond";
import Dropdown from "react-dropdown";
import "filepond/dist/filepond.min.css";
import "react-dropdown/style.css";
import "./App.css";
// const uploadEndpoint = "http://ec2-18-188-52-63.us-east-2.compute.amazonaws.com:4000/fileupload"
const uploadEndpoint = "http://localhost:9000/fileupload";
const langOptions = [
  { value: null, label: "-Select a Language-" },
  { value: "as", label: "Assamese" },
  { value: "bn", label: "Bengali" },
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "mr", label: "Marathi" },
  { value: "sa", label: "Sanskrit" },
  { value: "ta", label: "Tamil" },
  { value: "ur", label: "Urdu" }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { responseText: [], selectedOption: langOptions[0] };
    this.handleResponse = this.handleResponse.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFormData = this.handleFormData.bind(this);
  }
  handleResponse = (error, file) => {
    if (!file.serverId) {
      return null;
    }
    this.setState({
      responseText: [
        ...this.state.responseText,
        JSON.parse(file.serverId).resData
      ]
    });
  };

  handleChange = selOpt => {
    this.setState({ selectedOption: selOpt });
  };

  handleFormData = formData => {
    formData.append("lang", this.state.selectedOption.value);
    return formData;
  };

  render() {
    const { selectedOption } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Upload File</h1>
        </header>
        <div className="lang-Dropdown">
          <Dropdown
            options={langOptions}
            onChange={this.handleChange}
            value={selectedOption}
          />
        </div>
        {this.state.selectedOption.value !== null ? (
          <div className="filepond-box">
            <FilePond
              server={{
                url: uploadEndpoint,
                timeout: 10000,
                process: {
                  method: "POST",
                  onload: response => response,
                  onerror: response => response.data,
                  ondata: this.handleFormData
                }
              }}
              allowMultiple={true}
              name="filename"
              lang={this.state.selectedOption.value}
              onprocessfile={this.handleResponse}
            />
          </div>
        ) : null}
        <div className="response-box">
          {this.state.responseText.map((el, indx) => (
            <div className="response-box-item" key={indx}>
              {el}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;

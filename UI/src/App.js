import React, { Component } from 'react';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import './App.css';
// const uploadEndpoint = "http://ec2-18-188-52-63.us-east-2.compute.amazonaws.com:4000/fileupload"
const uploadEndpoint = "http://localhost:9000/fileupload"

class App extends Component {
	constructor(props){
		super(props);
		this.state = { responseText: []}
		this.handleResponse = this.handleResponse.bind(this);
	}
	handleResponse(newResponse){
		return (
			this.state.responseText 
			+ 
			<div>newResponse</div>
		);
	}
	render() {
		return (
		  <div className="App">
			<header className="App-header">          
			  <h1 className="App-title">Upload File</h1>       
			</header>
			<div className="filepond-box">
				<FilePond 
					allowMultiple={true} 
					server={uploadEndpoint} 
					name="filename" 
					onprocessfile={(error,file) => {
						this.setState(
							{
								responseText: [
									...this.state.responseText, 
									JSON.parse(file.serverId).resData
								]
							}		);
										
					}} />
			</div>
			<div className="response-box">
				{this.state.responseText.map((el,indx) => (<div className="response-box-item" key={indx}>{el}</div>))}
			</div>
		  </div>
		);
	}
}

export default App;

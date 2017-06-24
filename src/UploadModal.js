import React from 'react';
import axios from './axios';
import {Button, Form, Image, FormGroup, ControlLabel, FormControl, Modal} from 'react-bootstrap';
import {Router, Route, Link, IndexRoute, hashHistory } from 'react-router';

export default class UploadModal extends React.Component{
  constructor(props) {
    super(props);
    this.state ={}

    this.handleImgSubmit = this.handleImgSubmit.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChangeUpload = this.handleChangeUpload.bind(this);
  }
  closeModal() {
    this.props.closeModal();
  }
  handleChangeUpload(e) {
    this.setState({
      [e.target.name] : e.target.files[0]
    });
  }
  handleImgSubmit(e){
    var formData = new FormData();
    formData.append('file', this.state.file);
    axios.post('/userInsertProfilePic', formData).then((res) => {

      let newProfilePic = res.data.file;
      console.log(newProfilePic, "thie is the new profile pic");
      return this.props.setImg(newProfilePic);
    });
  }
  render(){
    return (
      <div id="modal-layer">
        <div id="upload-modal">
          <h1> Upload a Profile Pic</h1>
            <div id="upload-form">
            <label htmlFor="hidden-file">Choose a file </label>
            <input id="hidden-file" type="file" name="file" onChange={this.handleChangeUpload}/>
              <Button id="btn-upload" onClick={this.handleImgSubmit}>Upload</Button>
              <Button id="btn-close" onClick={this.closeModal}>Close</Button>
            </div>
        </div>
      </div>
    )
  }
}
// <Modal onHide={this.closeModal}>

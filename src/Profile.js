import React from 'react';
import axios from './axios';
import EditBio from './EditBio';
import WallContainer from './Wall/WallContainer';
import OnlineFriends from './Friends/OnlineFriends';
import {Button, Form, Image, FormGroup, ControlLabel, FormControl, Checkbox} from 'react-bootstrap';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state ={isModalOpen: false}

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.setBio = this.setBio.bind(this);

  }

  openModal() {
    this.setState({ isModalOpen: true })
  }
  closeModal() {
    this.setState({isModalOpen:false})
  }
  componentDidMount() {
    axios.get('/userBio').then((res) => {
      let profileBio;
      if (res.data.results.bio == null) {

        profileBio= "Edit your Bio"
      } else {
        profileBio = res.data.results.bio;
      }
      this.setState({
        profileBio: profileBio,
      });
    });
  }
  setBio(newProfileBio){
    this.setState({
      profileBio: newProfileBio,
      isModalOpen: false,
    });
  }

  render() {
    return (
      <div id="layer-profile">
        <div id="profile-cnt">
          <div id="profile-user-info">
            <Image src={this.props.profilePicUrl} responsive/>
            <p>{this.props.firstName} {this.props.lastName} </p>
            <div id="bio">
              <p>{this.state.profileBio}</p><Image src="/static/imgs/edit-icon.png" onClick={this.openModal} responsive/>
            </div>
            {this.state.isModalOpen && <EditBio closeModal={this.closeModal} setBio={this.setBio}/>}
          </div>
        </div>
        <WallContainer/>
        <OnlineFriends/>
      </div>
    )
  }
}

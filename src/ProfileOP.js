import React from 'react';
import axios from './axios';
import WallContainer from './Wall/WallContainer';
import FriendsButton from './Friends/FriendsButton';
import {Button, Form, Image, FormGroup, ControlLabel, FormControl, Checkbox} from 'react-bootstrap';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';

export default class ProfileOP extends React.Component {
  constructor(props) {
    super(props);
    this.state ={}
    this.setComment=this.setComment.bind(this);

  }
  componentDidMount() {

    axios.get(`/user/${this.id || this.props.params.id}/data`).then((res) => {
          if (res.data.redirect){
            return browserHistory.push('/');
          }
      let profilePicUrl;
      if (res.data.results.profilePicUrl == null) {

        profilePicUrl = '/static/imgs/profilepic.png'
      } else {
        profilePicUrl = res.data.results.profilePicUrl;
      }

      let profileBio;
      if (res.data.results.bio == null) {

        profileBio= "No bio available"
      } else {
        profileBio = res.data.results.bio;
      }
      this.setState({
        firstName: res.data.results.firstName,
        lastName: res.data.results.lastName,
        profilePicUrl: res.data.results.profilePicUrl,
        bio: res.data.results.bio,
        profileBio: profileBio
      });
    });
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.params.id != this.props.params.id) {
      this.state = {};
      this.id = this.props.params.id;
      this.componentDidMount();
    }

  }
  setComment(newComment){
    this.setState({
      comment: newComment
    });
}
  render() {
    return (
      <div id="layer-profile">
        <div id="profile-cnt">
          <div id="profile-user-info">
            <Image src={this.state.profilePicUrl} responsive/>
            <p>{this.state.firstName} {this.state.lastName} </p>
            <div id="bio">
              <p>{this.state.profileBio}</p>
            </div>
            <FriendsButton friendId={this.props.params.id}/>
            </div>
        </div>
        <WallContainer commentedId ={this.props.params.id} setComment={this.setComment}/>
      </div>
    )
  }
}

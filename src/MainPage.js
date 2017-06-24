import React from 'react';
import axios from './axios';
import UploadModal from './UploadModal';
import Profile from './Profile';
import ProfileOP from './ProfileOP';
import {Button, Form, Image, FormGroup, ControlLabel, FormControl, Modal} from 'react-bootstrap';
import {Router, Route, Link, IndexRoute, hashHistory, browserHistory,IndexLink } from 'react-router';
//change name to App?
export default class MainPage extends React.Component{
  constructor(props) {
    super(props);
    this.state ={
      date: new Date(),
      isModalOpen: false,
        }
    this.showNav = this.showNav.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.setImg = this.setImg.bind(this);
  }

  openModal() {
    this.setState({ isModalOpen: true })
  }
  closeModal() {
    this.setState({isModalOpen:false})
  }

  showNav() {
    this.setState({
      navIsVisible: !this.state.navIsVisible
    });
  }
  componentDidMount() {
      axios.get('/userProfileInfo').then((res) => {
        let profilePicUrl;
      if (res.data.results.profilePicUrl === null) {

        profilePicUrl = '/static/imgs/profilepic.png'
      } else {
        profilePicUrl = res.data.results.profilePicUrl;
      }
      this.setState({
        id: res.data.results.id,
        firstName: res.data.results.firstName,
        lastName: res.data.results.lastName,
        profilePicUrl: profilePicUrl,
      });
    });
    this.timerId = setInterval(
      () => this.tick(),
      1000
    );
  }
  setImg(url){
    this.setState({
      profilePicUrl: url,
      isModalOpen: false
    });
  }
  componentWillUnmount() {
      clearInterval(this.timerID);
    }

  tick() {
    this.setState({
      date: new Date()
    });
  }
  render() {
    const children = React.cloneElement(this.props.children, {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      profilePicUrl: this.state.profilePicUrl,
      bio: this.state.bio
    });
    //create a nav constructor???
      const nav = (
      <div id="main-nav">
        <div id="mySidenav">
          <IndexLink to="/" activeClassName='active'>Profile</IndexLink>
          <Link to="/friends" activeClassName='active'>Friends</Link>
          <Link to="/chatRoom" activeClassName='active'>Chat Room</Link>
          <a href="/logout">Log out</a>
        </div>
      </div>

    );
    return (
      <div id="main-cnt">
      <div id="header">
      <Image src="/static/imgs/hamburgerMenu.png" responsive onClick={this.showNav}/>
      {this.state.navIsVisible && nav}
      <div id="profile-data">
      <div id="name-clock">
      <p id="user-info">{this.state.firstName}     {this.state.lastName}</p>
      <div id="clock">
      {this.state.date.toLocaleTimeString()}
      </div>
      </div>
      <div id="profile-pic">
      <Image src={this.state.profilePicUrl} onClick={this.openModal} responsive/>
      </div>
      </div>
      </div>
      {this.state.isModalOpen && <UploadModal closeModal={this.closeModal} setImg={this.setImg}/>}
      {children}
      </div>
    );
  }
}

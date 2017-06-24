import React from 'react';
import axios from '../axios';
import {Button} from 'react-bootstrap';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';

export default class FriendsButton extends React.Component {
  constructor(props) {
    super(props);
    this.state ={};
    this.handleBtnClick = this.handleBtnClick.bind(this);
  }
  componentDidMount(){
    const location = browserHistory.getCurrentLocation();

    axios.get(`/getFrienshipStatus/${this.props.friendId}/friendship`).then((results) => {
      const {friendshipStatusInfo} = results.data;
      let currentStatus;
      if (friendshipStatusInfo === null){
        currentStatus = null;
      } else {
        currentStatus = friendshipStatusInfo.status;
      }
      this.setState({ friendshipStatus: currentStatus }, function(){
        this.changeBtnMsg(this.state.friendshipStatus);
      });
    });
  }
  changeBtnMsg(newMsg) {
    const {friendshipStatus} = this.state;
    let buttonText;
    if (friendshipStatus === null || friendshipStatus == "terminated" || friendshipStatus == "cancelled") {
      buttonText = 'Send Friend Request';
    } else if (friendshipStatus == "pending") {
      buttonText = 'Accept Friend Request';
    } else if (friendshipStatus == "accepted") {
      buttonText = 'Finish Friendship';
    }
    this.setState({ buttonText });
  }
  changeFriendshipStatus(friendshipStatus) {
    this.setState({friendshipStatus}, function(){
      this.changeBtnMsg();
    });
  }
  handleBtnClick(){
    const {friendshipStatus} = this.state;
    const {friendId} = this.props;
    if (friendshipStatus === null || friendshipStatus == "terminated" || friendshipStatus == "canceled") {
      axios.post(`/userAddFriend/${friendId}/addFriends`).then((results) => {
        this.changeFriendshipStatus(results.data.status);
      });
    } else if (friendshipStatus == "pending") {
      axios.post(`/userAcceptFriend/${friendId}/acceptFriendship`).then((results) => {
        this.changeFriendshipStatus(results.data.status);
      });
    } else if (friendshipStatus == "accepted") {
      axios.post(`/userEndFriendship/${friendId}/endFriendship`).then((results) => {
        this.changeFriendshipStatus(results.data.status);
      });
    }
  }
  render() {
    return (

      <div id="btnfriends-cnt">
      <Button value="friend-request" id="friend-request" onClick={this.handleBtnClick}> {this.state.buttonText} </Button>
      </div>
    );
  }
}

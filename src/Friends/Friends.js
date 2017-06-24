import React from 'react';
import axios from '../axios';
import Friend from './Friend';
import FriendRequest from './FriendRequest';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';

export default class FriendsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state ={ friends: [], requests: []}
    this.renderFriends = this.renderFriends.bind(this);
    this.renderRequest = this.renderRequest.bind(this);

}
componentDidMount() {
  axios.get(`/getAllFriendsAndPendingRequest`).then((results) => {
    this.setState({
      friends: results.data.friends,
      requests: results.data.requests
     })
  });
}

renderFriends(){
  return this.state.friends.map((friend)=> {
    return (
      <Friend friend = {friend}/>
    )
  });

}
renderRequest(){
  // requests.map is comming from the axios get
  return this.state.requests.map((friendRequest)=> {
    return (
      // friendRequest is teh name we gave to use the data in FriendRequest
      <FriendRequest friendRequest = {friendRequest}/>
    )
  });

}
render() {
  return (
    <div id="friends-cnt">
      <p> Your Friends </p>
      <div id="single-friend"> {this.renderFriends()} </div>
      <p> Requests Penging to Accept </p>
      <div id="single-friend"> {this.renderRequest()} </div>

    </div>
  );
}
}

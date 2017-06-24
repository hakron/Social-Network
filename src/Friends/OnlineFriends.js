import React from 'react';
import axios from '../axios';
import OnlineFriend from './OnlineFriend';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';

export default class OnlineFriends extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      onlineUsersInfo: [],
      msg: "no users online"
    }

    this.renderOnlineFriends = this.renderOnlineFriends.bind(this);
}
componentDidMount() {
  axios.get('/onlineUsers').then((results) => {
    console.log("OnlineFriends users", results.data);
    this.setState({
      onlineUsersInfo: results.data.onlineUsersInfo,
     })
  });
}

renderOnlineFriends(){
  console.log("inside of renderOnlineFriends, this is the state", this.state);
  if(this.state.onlineUsersInfo){
    return this.state.onlineUsersInfo.map((onlineFriend)=> {
      return (
        <OnlineFriend onlineFriend = {onlineFriend}/>
      )
    });
  } else {
console.log("this.state.onlineUsersInfo is empty");
  }

}
render() {
  return (
    <div id="online-friends-cnt">
      <p> Online Friends </p>
      <div>
      {this.state.errorFields}
      </div>
      <div id="single-online-friend"> {this.renderOnlineFriends()} </div>
    </div>
  );
}
}

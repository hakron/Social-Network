import React from 'react';
import ReactDOM from 'react-dom';
import RegisterForm from './RegisterForm';
import LoginForm from './Login';
import MainPage from './MainPage';
import Profile from './Profile';
import ProfileOP from './ProfileOP';
import Friends from './Friends/Friends';
// import ChatRoom from './ChatRoom';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';
import * as io from 'socket.io-client';
import axios from './axios';

const userIsLoggedIn = location.pathname !='/welcome';
const main =   document.querySelector('main')

console.log(location.pathname, userIsLoggedIn);

const notLoggedInRouter = (
  <Router history = {hashHistory}>
    <Route path='/' component = {Welcome}>
      <IndexRoute component = {RegisterForm}/>
      <Route path='/login' component = {LoginForm}/>
    </Route>
  </Router>
  )
const loggedInRouter =(
  <Router history = {browserHistory}>
    <Route path='/' component = {MainPage}>
      <IndexRoute component = {Profile}/>
      <Route path='user/:id' component = {ProfileOP}/>
      <Route path='friends' component = {Friends}/>
    </Route>
  </Router>
)

var elem = location.pathname === '/welcome' ? notLoggedInRouter : loggedInRouter;

ReactDOM.render(elem, main);
//react component, always start with Capital
function Welcome(props) {
  return (
    <div id="welcome">
      {props.children}
    </div>
  );
}
if(location.pathname !='/welcome') {
  let socket = io.connect();
  socket.on('connect', function() {
    axios.get(`/connected/${socket.id}`);
  });
}
// here we can start to do io function
//dont cange props name create a var thats equal to props

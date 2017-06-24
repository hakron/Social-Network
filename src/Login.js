import React from 'react';
import axios from './axios';
import {Button, Form, Image, FormGroup, ControlLabel, FormControl, Checkbox} from 'react-bootstrap';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      validationState: null
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e){
    this.setState({
      [e.target.name] : e.target.value
    });
  }

  handleSubmit(e){
    const {email, password} = this.state;
    e.preventDefault();
    axios.post('/loginUser', {
      email, password
    })
    .then((res) => {
      var validationState;
      console.log(res.data, "userInfo");
      if(!res.data.success){
        validationState = 'error',
        this.setState({
          validationState: validationState,
          errorFields: res.data.notExists ? 'Email does not exists' : res.data.error ? 'Wrong Password' : 'Complete all the fields to continue'
        });
      } else {
        console.log("submit works");
        location.replace('/');
      }
    }).catch(function (err) {
      console.log("there was a problem with handleSubmit", err);
    });
  }
  render(){
    return (
      <div id="login-cnt">
      <Image src="/static/imgs/logo.png" responsive/>
      <Form id="login-cnt" horizontal>
      <FormGroup controlId="formHorizontalEmail" validationState={this.state.validationState}>
      <FormControl type="email" name="email" onChange={this.handleChange} placeholder="Email" />
      </FormGroup>
      <FormGroup controlId="formHorizontalPassword" validationState={this.state.validationState}>
      <FormControl type="password" name="password" onChange={this.handleChange} placeholder="Password" />
      </FormGroup>
        <div id="errors">
        {this.state.errorFields}
        </div>
        <FormGroup>
        <Button type="submit"  onClick={this.handleSubmit}>
        Log in
        </Button>
        </FormGroup>
        <p> Not a member? <a href='/welcome'>Register</a></p>
        </Form>
        </div>
      );
    }
  }

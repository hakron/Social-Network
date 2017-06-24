import React from 'react';
import axios from './axios';
import {Button, Form, Image, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';

export default class EditProfile extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      lastname:"",
      city:"",
      country:"",
      age:"",
      email: "",
      password: "",
      validationState: null
    }

  }
  render() {
    return (
      <div id="form-cnt">
          <Form id="form-cnt" horizontal>
          <FormGroup controlId="formHorizontalFirstnName" validationState={this.state.validationState} >
            <FormControl  type="text"  name="name"  onChange={this.handleChangeFields} placeholder="First Name" />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="formHorizontalLastName" validationState={this.state.validationState}>
            <FormControl type="text" name="lastname"  onChange={this.handleChangeFields} placeholder="Last Name" />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="formHorizontalCity" validationState={this.state.validationState}>
            <FormControl type="text" name="city"  onChange={this.handleChangeFields} placeholder="City" />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="formHorizontalCountry" validationState={this.state.validationState}>
            <FormControl type="text" name="country"  onChange={this.handleChangeFields} placeholder="Country" />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="formHorizontalAge" validationState={this.state.validationState}>
            <FormControl type="text" name="age"  onChange={this.handleChangeFields} placeholder="Age" />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="formHorizontalEmail" validationState={this.state.validationState}>
            <FormControl type="email" name="email" onChange={this.handleChangeFields}  placeholder="Email" />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="formHorizontalPassword" validationState={this.state.validationState}>
            <FormControl type="password" name="password" onChange={this.handleChangeFields} placeholder="Password" />
            <FormControl.Feedback />
          </FormGroup>
      <div id="errors">
      {this.state.errorFields}
      </div>
          <FormGroup>
            <Button type="submit" onClick={this.handleSubmit} >
              Save Changes
            </Button>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

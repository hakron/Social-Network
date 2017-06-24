import React from 'react';
import axios from '../axios';
import WallUpdates from './WallUpdates';
import Comment from './Comment';
import {Button, Form, Image, FormGroup, ControlLabel, FormControl, Checkbox} from 'react-bootstrap';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';

export default class WallForm extends React.Component {
  constructor(props) {
    super(props);
    this.state ={}

    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    this.handleChangeComment = this.handleChangeComment.bind(this);
  }
  handleChangeComment(e) {
      this.setState({
      [e.target.name] : e.target.value
    });
  }
  handleCommentSubmit(e){
    const { comment } = this.state;
    e.preventDefault();
    console.log(this.props.commentedId);
    axios.post(`/insertComment/${ this.props.commentedId }`,{ comment })
    .then((res) => {
      let newComment = res.data.comment;
      this.props.setComment(newComment);
    });
  }
  render() {
    // console.log("inside wall form render", this.props.setComment);

    return (

      <div id="wallform-cnt">
      <form >
      <textarea placeholder="Write a comment ......" name="comment" onChange={this.handleChangeComment}></textarea>
      <Button value='Post' id='wall-post' onClick={this.handleCommentSubmit}> Post! </Button>
      </form>
      </div>
    );
  }
}

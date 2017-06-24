import React from 'react';
import {Image} from 'react-bootstrap';
export default function Comment(props) {

    return (
      <div id="single-comment">
      <div id="user-info-data">
      <Image src={props.comment.img_url} responsive/>
      <p>{props.comment.first_name} {props.comment.last_name} </p>
      </div>
      <div id="comment">
      <p> {props.comment.comments} </p>
      </div>
      </div>
    );

}

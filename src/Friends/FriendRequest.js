import React from 'react';
import {Image} from 'react-bootstrap';
export default function FriendRequest(props) {

    return (
      <div id="single-friend-request">
        <div id="userData">
          <Image src={props.friendRequest.img_url} responsive/>
          <p>{props.friendRequest.first_name} {props.friendRequest.last_name} </p>
        </div>
      </div>
    );

}

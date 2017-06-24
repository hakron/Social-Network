import React from 'react';
import {Image} from 'react-bootstrap';
export default function Friend(props) {

    return (
      <div id="single-friend">
        <div id="userData">
          <Image src={props.friend.img_url} responsive/>
          <p>{props.friend.first_name} {props.friend.last_name} </p>
        </div>
      </div>
    );

}

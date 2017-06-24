import React from 'react';
import {Image} from 'react-bootstrap';
export default function OnlineFriend(props) {

    return (
      <div id="user-online-data">
        <Image src={props.onlineFriend.img_url} responsive/>
        <p>{props.onlineFriend.first_name} {props.onlineFriend.last_name} </p>
      </div>
    );

}

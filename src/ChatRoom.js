import React from 'react';
 import axios from './axios';
 import {Link} from 'react-router';

 export class Chat extends React.Component {
     constructor(props) {
         super(props);
         this.state = {};

         this.handleChatRoomPost = this.handleChatRoomPost.bind(this);
         this.handleChangeChatMsg = this.handleChangeChatMsg.bind(this);
     }

     handleChatRoomPost(){

     }
     handleChangeChatMsg(e){
       this.setState({
         [e.target.name]: e.target.value
       });
     }
     render(){
       return (
         <div id="chatroom-cnt">
         <form >
         <textarea placeholder="What is in your mind......?" name="chatMsg" onChange={this.handleChangeChatMsg}></textarea>
         <Button value='Post' id='chatroom-post' onClick={this.handleChatRoomPost}> Post! </Button>
         </form>
         </div>
       )
     }
   }

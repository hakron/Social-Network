import React from 'react';
import WallForm from './WallForm';
import WallUpdates from './WallUpdates';

export default class WallContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state ={}

  }

  render() {
    // console.log("inside wall cnt render", this.props.setComment);
    return (

      <div id="wall-cnt">
      <WallForm commentedId ={this.props.commentedId} setComment={this.props.setComment}/>
      <WallUpdates commentedId ={this.props.commentedId}/>
      </div>
    );
  }
}

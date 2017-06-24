import React from 'react';
import axios from '../axios';
import Comment from './Comment';


export default class WallUpdates extends React.Component {
  constructor(props) {
    super(props);
    this.state ={ comments : [] }
    this.renderComments=this.renderComments.bind(this);

  }

  componentDidMount() {
    axios.get(`/getUserComment/${this.props.commentedId}/comments`).then((results) => {

      this.setState({ comments: results.data.comments }, function(){

      });
    });
  }

  renderComments(){
    return this.state.comments.map((comment)=> {
      return (
        <Comment comment = {comment}/>
      )
    });

  }

  render() {
    return (
      <div id="wallupdates-cnt">
      <div className="single-comments"> {this.renderComments()} </div>
      </div>
    );
  }
}

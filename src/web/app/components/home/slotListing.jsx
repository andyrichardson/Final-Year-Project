const RB = require('react-bootstrap');
const React = require('react');
const Link = require('react-router').Link;
const Moment = require('moment');

const Api = require('../../includes/api');

class AddSlot extends React.Component{
  /* GET USER */
  getUser(){
    let user;

    // Get friend
    this.props.user.friends.forEach((friend) => {
      if(friend.username == this.props.username){
        user = friend;
      }
    });

    if(user === undefined){
      return (<div></div>)
    }

    return <Link to={`/user/${this.props.username}`}>{`${user.firstName} ${user.lastName}`}</Link>
  }

  /* GET BUTTONS */
  getButtons(){
    let button = <RB.Button onClick={() => this.respondToSlot()}>Respond</RB.Button>;

    // If already responded
    if (this.props.user.slotRequests != undefined) {
      this.props.user.slotRequests.forEach((sl)=>{
        if(sl.id == this.props.id){
          button = <RB.Button>Responded</RB.Button>;
        }
      })
    }

    // If viewing own slot
    if (this.props.user.username == this.props.username){
      button = <div></div>;
    }

    return button;
  }

  /* SLOT RESPONSE CLICK */
  respondToSlot() {
    const data = {
      slotId: this.props.id,
      accessToken: this.props.accessToken
    };

    return Api.respondSlot(data)
    .then(function(data){
      if(data.status != 200){
        return alert(data.message);
      }

      return alert("Slot response sent.");
    })
  }

  /* RENDER */
  render(){
    if(this.props.user === undefined){
      return null;
    }

    return(
      <div>
        Start: {Moment.unix(this.props.start).calendar()}
        Finish: {Moment.unix(this.props.finish).calendar()}
        User: {this.getUser()}
        {this.getButtons()}
      </div>
    );
  }
}

module.exports = AddSlot;

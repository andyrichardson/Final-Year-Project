const React = require("react");
const Link = require('react-router').Link;
const RB = require('react-bootstrap');
const Moment = require('moment');

const Api = require("../../includes/api");

class SlotResponse extends React.Component {
  /* CONFIRM MEETING */
  confirmMeeting(){
    const data = {
      accessToken: this.props.accessToken,
      username: this.props.notification.username,
      slotId: this.props.notification.slotId
    };

    return Api.confirmMeeting(data)
    .then(function(data){
      alert(data.message);
    });
  }

  /* DECLINE MEETING */
  declineMeeting(){
    const data = {
      accessToken: this.props.accessToken,
      username: this.props.notification.username,
      slotId: this.props.notification.slotId
    };

    return Api.declineMeeting(data)
    .then(function(data){
      alert(data.message);
    });
  }

  /* RENDER */
  render(){
    let requester, slot;

    // Get friend
    this.props.user.friends.forEach((friend) => {
      if(friend.username == this.props.notification.username){
        requester = friend;
      }
    });

    if(this.props.user.slots !== undefined){
      this.props.user.slots.forEach((nslot) => {
        if(nslot.id == this.props.notification.slotId){
          slot = nslot
        }
      });
    }

    if(slot !== undefined){
      return(
        <div>
          You have a meeting request from {' '}
          <Link to={`/user/${requester.username}`}>{`${requester.firstName} ${requester.lastName}`}</Link>
          {' '} for your slot on {Moment(slot.start).calendar()}

          <RB.Button onClick={()=>this.confirmMeeting()}>Confirm</RB.Button>
          <RB.Button onClick={()=>this.declineMeeting()}>Decline</RB.Button>
        </div>
      )
    }

    return (<div key={this.props.notification.id}></div>);
  }
}

module.exports = SlotResponse;

const React = require("react");
const Link = require('react-router').Link;
const RB = require('react-bootstrap');
const Moment = require('moment');

const Api = require("../includes/api");

class Notifications extends React.Component {

  /* SLOT RESPONSE */
  slotResponse(notification){
    let requester, slot;

    // Get friend
    this.props.user.friends.forEach((friend) => {
      if(friend.username == notification.username){
        requester = friend;
      }
    });

    // Get slot
    this.props.user.slots.forEach((nslot) => {
      if(nslot.id == notification.slotId){
        slot = nslot
      }
    });

    return(
      <div>
        You have a meeting request from {' '}
        <Link to={`/user/${requester.username}`}>{`${requester.firstName} ${requester.lastName}`}</Link>
        {' '} for your slot on {Moment(slot.start).format("MMM Do [at] HH:mm")}
      </div>
    )
  }

  /* GENERATE NOTIFICATIONS */
  generateNotifications(){
    if(this.props.user == undefined || this.props.user.notifications === undefined){
      return (<h1>No notifications</h1>);
    }

    const data = this.props.user.notifications.map((not) =>{
      switch (not.type) {
        case "slot response":
          return this.slotResponse(not);
          break;
        default:
          return (<div>noooope</div>)
      }
    })

    return (<div>{data}</div>);
  }

  /* RENDER */
  render(){
    // <div>{JSON.stringify(this.props.user.notifications)}</div>
    return(
      <div>{this.generateNotifications()}</div>
    );
  }
}

module.exports = Notifications;

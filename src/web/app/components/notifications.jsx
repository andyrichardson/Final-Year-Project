const React = require("react");
const Link = require('react-router').Link;
const RB = require('react-bootstrap');
const Moment = require('moment');

const SlotResponse = require('./notifications/slotResponse.jsx');

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

    if(this.props.user.slots !== undefined){
      this.props.user.slots.forEach((nslot) => {
        if(nslot.id == notification.slotId){
          slot = nslot
        }
      });
    }

    if(slot !== undefined){
      return(
        <div key={notification.id}>
          You have a meeting request from {' '}
          <Link to={`/user/${requester.username}`}>{`${requester.firstName} ${requester.lastName}`}</Link>
          {' '} for your slot on {slot.start} {Moment.unix(slot.start).calendar()}
          <RB.Button>Confirm</RB.Button> <RB.Button>Reject</RB.Button>
        </div>
      )
    }

    return (<div key={notification.id}></div>);
  }

  /* GENERATE NOTIFICATIONS */
  generateNotifications(){
    if(this.props.user == undefined || this.props.user.notifications === undefined){
      return (<h1>No notifications</h1>);
    }

    const data = this.props.user.notifications.map((not) =>{
      switch (not.type) {
        case "slot response":
          return (<SlotResponse key={not.id} user={this.props.user} notification={not} accessToken={this.props.accessToken}/>);
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

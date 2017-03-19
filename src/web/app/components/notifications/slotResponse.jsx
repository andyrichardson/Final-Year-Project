const React = require('react');
const Link = require('react-router').Link;
const RB = require('react-bootstrap');
const Moment = require('moment');

const Api = require('../../includes/api');

class SlotResponse extends React.Component {
  /* CONFIRM MEETING */
  confirmMeeting() {
    const data = {
      accessToken: this.props.accessToken,
      username: this.props.notification.username,
      slotId: this.props.notification.slotId,
    };

    return Api.confirmMeeting(data)
    .then(function (data) {
      alert(data.message);
    });
  }

  /* DECLINE MEETING */
  declineMeeting() {
    const data = {
      accessToken: this.props.accessToken,
      username: this.props.notification.username,
      slotId: this.props.notification.slotId,
    };

    return Api.declineMeeting(data)
    .then(function (data) {
      alert(data.message);
    });
  }

  /* GET TIME OF NOTIFICATION */
  getNotificationTime() {
    const start = Moment.unix(this.props.notification.created);
    const finish = Moment();

    return Moment.duration(finish.diff(start)).humanize() + ' ago';
  }

  /* RENDER */
  render() {
    let requester;
    let slot;

    // Get friend
    this.props.user.friends.forEach((friend) => {
      if (friend.username == this.props.notification.username) {
        requester = friend;
      }
    });

    if (this.props.user.slots !== undefined) {
      this.props.user.slots.forEach((nslot) => {
        if (nslot.id == this.props.notification.slotId) {
          slot = nslot;
        }
      });
    }

    if (slot !== undefined) {
      return (
        <RB.Row className="notification">
          <RB.Col xs={2}>
            <Link to={`/user/${requester.username}`}>
              <img
                className="img-responsive userImage selfImage"
                src={`/res/img/users/${requester.username}.jpg`}
              />
            </Link>
          </RB.Col>

          <RB.Col xs={10}>
            <RB.Row>
              <RB.Col xs={9}>
                You have a meeting request from {' '}
                <Link to={`/user/${requester.username}`}>
                  {`${requester.firstName} ${requester.lastName}`}
                </Link>
                {' '} for your slot on {Moment.unix(slot.start).calendar()}
              </RB.Col>

              <RB.Col xs={3}>
                <span className="pull-right time-ago">{this.getNotificationTime()}</span>
              </RB.Col>
            </RB.Row>
            <RB.Row>
              <RB.Button className="pull-right" onClick={()=>this.confirmMeeting()}>
                Confirm
              </RB.Button>
              
              <RB.Button className="pull-right" onClick={()=>this.declineMeeting()}>
                Decline
              </RB.Button>
            </RB.Row>
          </RB.Col>

        </RB.Row>
      );
    }

    return (<div key={this.props.notification.id}></div>);
  }
}

module.exports = SlotResponse;

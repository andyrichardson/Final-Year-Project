const React = require('react');
const Link = require('react-router').Link;
const RB = require('react-bootstrap');
const Moment = require('moment');

class Meeting extends React.Component {
  /* GET TITLE STRING */
  getTitle() {
    return Moment.unix(this.props.start).calendar(null, { sameElse: 'DD/MM/YYYY hh:mm A' });
  }

  /* GET DURATION STRING */
  getDuration() {
    const start = Moment.unix(this.props.start);
    const finish = Moment.unix(this.props.finish);

    return Moment.duration(finish.diff(start)).humanize();
  }

  render(){
    let requester;
    let slot;

    // Get friend
    this.props.user.friends.forEach((friend) => {
      if (friend.username == this.props.username) {
        requester = friend;
      }
    });

    return(
      <RB.Row className="meeting">
        <RB.Col xs={2}>
          <Link to={`/user/${this.props.username}`}>
            <img
              className="img-responsive userImage selfImage"
              src={`/res/img/users/${this.props.username}.jpg`}
            />
          <h4>{`${requester.firstName} ${requester.lastName}`}</h4>
          </Link>
        </RB.Col>
        <RB.Col md={9} xs={10}>
          <h2>{this.getTitle()}</h2>
          <p>{this.getDuration()}</p>
        </RB.Col>
      </RB.Row>
    );
  }
}

module.exports = Meeting;

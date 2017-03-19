const React = require('react');
const Link = require('react-router').Link;
const RB = require('react-bootstrap');
const Moment = require('moment');

const Api = require('../includes/api');
const Meeting = require('./meetings/meeting.jsx');

class Meetings extends React.Component {
  /* CREATE FULL NAME LINK FROM USERNAME */
  usernameLink(username) {
    let name;

    this.props.user.friends.forEach(el => {
      if (el.username = username) {
        name = `${el.firstName} ${el.lastName}`;
      }
    });

    return (<Link to={`/user/${username}`}>{name}</Link>);
  }

  /* GENERATE MEETINGS */
  generateMeetings() {
    if (this.props.user == undefined || this.props.user.meetings === undefined) {
      return (<h1>No meetings</h1>);
    }

    const data = this.props.user.meetings.map((meeting) =>
        <div key={meeting.id}>
          <Meeting
            start={meeting.start}
            finish={meeting.finish}
            username={meeting.username}
            user={this.props.user}
          />
        </div>
    );

    return (<div>{data}</div>);
  }

  /* RENDER */
  render() {
    return (
      <div>{this.generateMeetings()}</div>
    );
  }
}

module.exports = Meetings;

const RB = require('react-bootstrap');
const React = require('react');
const Link = require('react-router').Link;
const Moment = require('moment');

const Api = require('../../includes/api');

class AddSlot extends React.Component{
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

  /* GET BUTTON */
  getButtons() {
    let button = <RB.Button
      bsStyle="primary"
      className="pull-right"
      onClick={() => this.props.respond(this.props.id)}
    >
      Respond
    </RB.Button>;

    // Prevent respond to self
    if (this.props.user.username === this.props.slotUser.username) {
      return <div></div>;
    }

    // Prevent repeat responses
    if (this.props.user.slotRequests != undefined) {
      this.props.user.slotRequests.forEach(sl => {
        if (sl.id == this.props.id) {
          button = <RB.Button
            className="pull-right"
            bsStyle="secondary"
          >
          Response Sent
          </RB.Button>;
        }
      });
    }

    return button;
  }

  /* RENDER */
  render() {
    return (
      <RB.Row className="userSlot">
        <RB.Col xs={12}>
          <h2>{this.getTitle()}</h2>
          <h3>{this.getDuration()}</h3>
          <div>
            {this.getButtons()}
          </div>
        </RB.Col>
      </RB.Row>
    );
  }
}

module.exports = AddSlot;

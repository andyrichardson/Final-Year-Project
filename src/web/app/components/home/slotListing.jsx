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

  /* GET TITLE STRING */
  getTitle(){
    return Moment.unix(this.props.start).calendar(null, {sameElse: "DD/MM/YYYY hh:mm A"});
  }

  /* GET DURATION STRING */
  getDuration(){
    const start = Moment.unix(this.props.start);
    const finish = Moment.unix(this.props.finish);

    return Moment.duration(finish.diff(start)).humanize();
  }

  /* GET TOOLBAR */
  getToolbar(){
    let button = (
      <div className={"clickable"} onClick={() => this.respondToSlot()}>
        <RB.Glyphicon glyph="glyphicon glyphicon-arrow-left"/> Respond
      </div>
    );

    // If already responded
    if (this.props.user.slotRequests != undefined) {
      this.props.user.slotRequests.forEach((sl)=>{
        if(sl.id == this.props.id){
          button = (
            <div>
              <RB.Glyphicon glyph="glyphicon glyphicon-ok-circle"/> Responded
            </div>
          );
        }
      });
    }

    // If viewing own slot
    if (this.props.user.username == this.props.username){
      button = <div></div>;
    }

    return button;
  }

  /* RENDER */
  render(){
    if(this.props.user === undefined){
      return null;
    }

    return(
      <RB.Row className="slotListing">
        <RB.Row>
          <RB.Col md={3} xs={2}>
            <img className="img-responsive" src={`/res/img/users/${this.props.username}.jpg`}/>
          </RB.Col>
          <RB.Col md={9} xs={10}>
            <h2>{this.getTitle()}</h2>
            <p>{this.getDuration()}</p>
          </RB.Col>
        </RB.Row>
        <RB.Row className="slotListingToolbar">
          <RB.Col mdOffset={3} md={9} xsOffset={2} xs={10}>
            {this.getToolbar()}
          </RB.Col>
        </RB.Row>
      </RB.Row>
    );
  }
}

module.exports = AddSlot;

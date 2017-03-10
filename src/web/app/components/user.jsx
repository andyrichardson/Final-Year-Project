const React = require("react");
const Link = require('react-router').Link;
const RB = require('react-bootstrap');
const Moment = require('moment');

const Api = require("../includes/api");

const UploadPhotoModal = require('./user/uploadPhoto.jsx');

class User extends React.Component {
  /* CONSTRUCTOR */
  constructor(props) {
    super(props);
    this.state = {user: null, modal: false};
    this.getInfo();
  }

  /* ON LOAD */
  componentWillReceiveProps(props){
    return this.getInfo(props.params.username)
    .then((data) => {
      this.render();
    })
  }

  /* FETCH USER INFO */
  getInfo(username) {
    if(username === undefined){
      username = this.props.params.username;
    }

    const data = {
      username: username,
      accessToken: this.props.accessToken
    };

    return Api.getUserAuthenticated(data)
    .then((data) => {
      this.setState({user: data.message});
    });
  }

  /* ADD FRIEND BUTTON CLICK */
  addFriend() {
    const data = {
      username: this.state.user.username,
      accessToken: this.props.accessToken
    };

    return Api.addUser(data)
    .then((data) => {
      if(data.status != 200){
        return alert(data.message);
      }

      alert("Friend added")
    });
  }

  /* GET FRIENDS DIV */
  getFriends() {
    let friends = this.state.user.friends.map(function(el){
      return (
        <div>
          <Link to={"/user/" + el.username} key={el.username}>{el.firstName + " " + el.lastName}</Link>
        </div>
      );
    });

    return(
      <div>
        <h1>Friends</h1>
        {friends}
      </div>
    )
  }

  /* GET SLOTS DIV */
  getSlots() {
    if(this.state.user.slots === undefined){
      return <div></div>;
    }

    // For each slot
    const slots = this.state.user.slots.map((el, index) => {
      const start = Moment.unix(el.start);
      const finish = Moment.unix(el.finish);
      let button = <RB.Button onClick={() => this.respondToSlot(el.id)}>Respond</RB.Button>;

      // If already responded
      if (this.props.user.slotRequests != undefined) {
        this.props.user.slotRequests.forEach(function(sl){
          if(sl.id == el.id){
            button = <RB.Button>Responded</RB.Button>;
          }
        })
      }

      // If viewing own profile
      if (this.props.user.username == this.props.params.username){
        button = <div></div>;
      }

      return(
        <div style={{border: "solid 1px black"}} key={index}>
          <label>Start:</label> {start.calendar()}

          <br/>
          <label>Finish:</label> {finish.calendar()}
          {button}
        </div>
      );
    });

    return(
      <div>
        <h1>Slots</h1>
        {slots}
      </div>
    )
  }

  /* GET IMAGE */
  getImage() {
    if(this.props.user.username == this.props.params.username){
      return (
        <div>
          <img onClick={()=>this.showPhotoModal()} className="img-responsive userImage selfImage" src="https://scontent.flcy1-1.fna.fbcdn.net/v/t1.0-9/14089025_1217198911634007_3545650935448468708_n.jpg?oh=793665c7cf361f2407649ba95a145354&oe=596819BF"/>
          <UploadPhotoModal visible={this.state.modal} close={()=>this.hidePhotoModal()}/>
        </div>
      );
    }

    return <div></div>
  }

  showPhotoModal() {
    this.setState({modal: true});
  }

  hidePhotoModal() {
    this.setState({modal: false});
  }

  /* SLOT RESPONSE CLICK */
  respondToSlot(id) {
    const data = {
      slotId: id,
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
    if(this.state.user == null){
      return null;
    }

    if(this.state.user.status == 500){
      return (<h1>{this.props.params.username} does not exist.</h1>);
    }

    return (
      <RB.Row className={"userPage"}>
        <RB.Row>
          <RB.Col xs={12} md={2}>
            {this.getImage()}
          </RB.Col>

          <RB.Col xs={12} md={8}>
            <h1>{this.state.user.firstName} {this.state.user.lastName}</h1>
            <h2>{this.state.user.username}</h2>
            <RB.Button onClick={() => this.addFriend()}>Add Friend</RB.Button>
          </RB.Col>
        </RB.Row>

        <RB.Row>
          <RB.Col xs={12}>
            {this.getFriends()}
          </RB.Col>

          <RB.Col xs={12}>
            {this.getSlots()}
          </RB.Col>
        </RB.Row>
      </RB.Row>
    );
  }
}

module.exports = User;

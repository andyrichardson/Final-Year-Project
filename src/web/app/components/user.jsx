const React = require('react');
const Link = require('react-router').Link;
const RB = require('react-bootstrap');
const Moment = require('moment');

const Api = require('../includes/api');

const UploadPhotoModal = require('./user/uploadPhoto.jsx');
const Slot = require('./user/slot.jsx');

class User extends React.Component {
  /* CONSTRUCTOR */
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      modal: false,
      userImage: '/',
    };
    this.getInfo();
  }

  /* ON LOAD */
  componentWillReceiveProps(props) {
    return this.getInfo(props.params.username)
    .then((data) => {
      this.render();
    });
  }

  /* FETCH USER INFO */
  getInfo(username) {
    if (username === undefined) {
      username = this.props.params.username;
    }

    const data = {
      username: username,
      accessToken: this.props.accessToken,
    };

    return Api.getUserAuthenticated(data)
    .then((data) => {
      this.setState({ user: data.message });
      this.setState({
        userImage: `/res/img/users/${this.props.params.username}.jpg?${new Date().getTime()}`,
      });
    });
  }

  /* ADD FRIEND BUTTON CLICK */
  addFriend() {
    const data = {
      username: this.state.user.username,
      accessToken: this.props.accessToken,
    };

    return Api.addUser(data)
    .then((data) => {
      if (data.status != 200) {
        return alert(data.message);
      }

      alert('Friend added');
    });
  }

  /* GET FRIENDS DIV */
  getFriends() {
    let friends = this.state.user.friends.map(el => <div>
      <Link to={'/user/' + el.username} key={el.username}>
        {el.firstName + ' ' + el.lastName}
      </Link>
    </div>);

    return (
      <div>
        <h1>Friends</h1>
        {friends}
      </div>
    );
  }

  /* GET SLOTS DIV */
  getSlots() {
    if (this.state.user.slots === undefined) {
      return <div></div>;
    }

    const btnClass = 'btn-primary pull-right';

    // For each slot
    const slots = this.state.user.slots.map((el, index) =>
      <div key={index}>
        <Slot
          id={el.id}
          start={el.start}
          finish={el.finish}
          user={this.props.user}
          slotUser={this.state.user}
          respond={(id) => this.respondToSlot(id)}
        />
      </div>
    );

    return (
      <div>
        <h1>Slots</h1>
        {slots}
      </div>
    );
  }

  /* GET USER IMAGE */
  getImage() {
    if (this.props.user.username == this.props.params.username) {
      return (
        <div>
          <img
            onClick={()=>this.showPhotoModal()}
            className="img-responsive userImage selfImage"
            src={this.state.userImage}
          />

          <UploadPhotoModal
            visible={this.state.modal}
            close={()=>this.hidePhotoModal()}
            accessToken={this.props.accessToken}
            update={()=>this.getInfo()}
          />
        </div>
      );
    }

    return <img className="img-responsive userImage selfImage" src={this.state.userImage} />;
  }

  /* GET BUTTONS */
  getButtons() {
    if (this.props.user.username == this.props.params.username) {
      return (
        <RB.Button onClick={() => this.showPhotoModal()}>Change Photo</RB.Button>
      );
    }

    return (
      <RB.Button onClick={() => this.addFriend()}>Add Friend</RB.Button>
    );

  }

  /* UPDATE PHOTO MODAL */
  showPhotoModal() {
    this.setState({ modal: true });
  }

  /* HIDE PHOTO MODAL */
  hidePhotoModal() {
    this.setState({ modal: false });
  }

  /* SLOT RESPONSE CLICK */
  respondToSlot(id) {
    const data = {
      slotId: id,
      accessToken: this.props.accessToken,
    };

    return Api.respondSlot(data)
    .then(data => {
      if (data.status != 200) {
        return alert(data.message);
      }

      return alert('Slot response sent.');
    });
  }

  /* RENDER */
  render() {
    if (this.state.user == null) {
      return null;
    }

    if (this.state.user.status == 500) {
      return (<h1>{this.props.params.username} does not exist.</h1>);
    }

    return (
      <RB.Row className={'userPage'}>
        <RB.Row>
          <RB.Col xs={12} md={2}>
            {this.getImage()}
          </RB.Col>

          <RB.Col xs={12} md={8}>
            <h1>{this.state.user.firstName} {this.state.user.lastName}</h1>
            <h2>{this.state.user.username}</h2>
            {this.getButtons()}
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

const React = require("react");
const Link = require('react-router').Link;
const RB = require('react-bootstrap');

const Api = require("../includes/api");

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user: null};
    this.getInfo();
  }

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

    return Api.getUser(username)
    .then((data) => {
      this.setState({user: data});
    })
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
    var friends = this.state.user.friends.map(function(el){
      return (
        <Link to={"/user/" + el.username}>{el.firstName + " " + el.lastName}</Link>
      );
    })

    return(
      <div>
        <h1>Friends</h1>
        {friends}
      </div>
    )
  }

  render(){
    if(this.state.user == null){
      return null;
    }

    if(this.state.user.status == 500){
      return (<h1>{this.props.params.username} does not exist.</h1>);
    }

    return (
      <div>
        <h1>{this.state.user.firstName} {this.state.user.lastName}</h1>
        <RB.Button onClick={() => this.addFriend()}>Add Friend</RB.Button>
        {this.getFriends()}
      </div>
    );
  }
}

module.exports = User;

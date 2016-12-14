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

  getInfo(username) {
    if(username === undefined){
      username = this.props.params.username;
    }

    return Api.getUser(username)
    .then((data) => {
      console.log(data);
      this.setState({user: data});
    })
  }

  addFriend() {
    return this.props.addFriend(this.state.user.username)
    .then(function(data){
      alert("Friend added");
    })
    .catch(function(err){
      alert(err);
    })
  }

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

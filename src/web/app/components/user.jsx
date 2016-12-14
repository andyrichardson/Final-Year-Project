const React = require("react");
const RB = require('react-bootstrap');

const Api = require("../includes/api");

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user: null};
    this.getInfo();
  }

  getInfo() {
    return Api.getUser(this.props.params.username)
    .then((data) => {
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
  
  render(){
    console.log(this.props);
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
      </div>
    );
  }
}

module.exports = User;

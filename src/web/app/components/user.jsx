const React = require("react");
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
  render(){
    if(this.state.user == null){
      return null;
    }

    if(this.state.user.status == 500){
      return (<h1>{this.props.params.username} does not exist.</h1>);
    }

    return (
      <h1>{this.state.user.firstName} {this.state.user.lastName}</h1>
    );
  }
}

module.exports = User;

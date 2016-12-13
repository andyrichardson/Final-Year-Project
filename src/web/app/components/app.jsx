const React = require('react');
const ReactDOM = require('react-dom');
const Cookie = require('../includes/cookie');
const Api = require('./../includes/api');

/* COMPONENTS */
const Navbar = require('./navbar.jsx');
let AppInstance;

/* APP COMPONENT */
class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {accessToken: Cookie.get("accessToken")};
    AppInstance = this;
  }

  login(username, password) {
    return Api.login({username: username, password: password})
    .then((data) => {
      if(data.status != 200){
        throw new Error(data.message);
      }

      AppInstance.setState({accessToken: data.accessToken});
      Cookie.set("accessToken", data.accessToken);
    });
  }

  isAuthenticated(){
    return this.state.accessToken != "";
  }

  renderChildren(){
    return React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {login: this.login});
    })
  }

  render(){
    return(
      <div>
        <Navbar auth={this.isAuthenticated()}/>
        {this.renderChildren()}
      </div>
    );
  }
}

module.exports = App;

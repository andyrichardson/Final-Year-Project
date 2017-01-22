const React = require('react');
const ReactDOM = require('react-dom');
const Cookie = require('../includes/cookie');
const Api = require('./../includes/api');

/* COMPONENTS */
const Navbar = require('./navbar.jsx');

/* APP COMPONENT */
class App extends React.Component {
  /* CONSTRUCTOR */
  constructor(props){
    super(props);
    this.state = {accessToken: Cookie.get("accessToken")};
  }

  /* LOGIN */
  login(state) {
    return Api.login(state)
    .then((data) => {
      if(data.status != 200){
        throw new Error(data.message);
      }

      this.setState({accessToken: data.accessToken});
      Cookie.set("accessToken", data.accessToken);
    });
  }

  /* LOGOUT */
  logout() {
    Cookie.delete('accessToken');
    this.setState({accessToken: ""});
  }

  /* USER HAS ACCESS TOKEN */
  isAuthenticated(){
    return this.state.accessToken != "";
  }

  /* PASSING PROPS TO CHILDREN */
  renderChildren(){
    return React.Children.map(this.props.children, (child) => {
      switch (child.type.name) {
        case "SignInForm":
          return React.cloneElement(child, {login: (state) => this.login(state)});

        case "User":
          return React.cloneElement(child, {accessToken: this.state.accessToken});

        case "Home":
          return React.cloneElement(child, {accessToken: this.state.accessToken});

        default:
          return child;
      };
    });
  }

  /* RENDER */
  render(){
    return(
      <div>
        <Navbar auth={this.isAuthenticated()} logout={() => this.logout()}/>
        {this.renderChildren()}
      </div>
    );
  }
}

module.exports = App;

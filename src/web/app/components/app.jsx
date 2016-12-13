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

  login(state) {
    return Api.login(state)
    .then((data) => {
      if(data.status != 200){
        throw new Error(data.message);
      }

      AppInstance.setState({accessToken: data.accessToken});
      Cookie.set("accessToken", data.accessToken);
    });
  }

  logout() {
    Cookie.delete('accessToken');
    AppInstance.setState({accessToken: ""});
  }

  register(state){
    return Api.register(state)
    .then(function(data){
      if(data.status != 200){
        throw new Error(data.message);
      }
    });
  }

  isAuthenticated(){
    return this.state.accessToken != "";
  }

  renderChildren(){
    return React.Children.map(this.props.children, (child) => {
      switch (child.type.name) {
        case "SignInForm":
          return React.cloneElement(child, {login: this.login});

        case "SignUpForm":
          return React.cloneElement(child, {register: this.register});
      }
    });
  }

  render(){
    return(
      <div>
        <Navbar auth={this.isAuthenticated()} logout={this.logout}/>
        {this.renderChildren()}
      </div>
    );
  }
}

module.exports = App;

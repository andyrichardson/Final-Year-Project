const React = require('react');
const ReactDOM = require('react-dom');
const Cookie = require('../includes/cookie');
const Api = require('./../includes/api');

/* COMPONENTS */
const Navbar = require('./navbar.jsx');

/* APP COMPONENT */
class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {accessToken: Cookie.get("accessToken")};
  }

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

  logout() {
    Cookie.delete('accessToken');
    this.setState({accessToken: ""});
  }

  register(state){
    return Api.register(state)
    .then(function(data){
      if(data.status != 200){
        throw new Error(data.message);
      }
    });
  }

  addFriend(username){
    const state = {
      username: username,
      accessToken: this.state.accessToken
    };

    return Api.addUser(state)
    .then((data) => {
      console.log(data);
      if(data.status != 200){
        throw new Error(data.message);
      }
    })
  }

  createSlot(state){
    const data = {
      start: state.start,
      finish: state.finish,
      accessToken: this.state.accessToken
    }

    return Api.createSlot(data)
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
          return React.cloneElement(child, {login: (state) => this.login(state)});

        case "SignUpForm":
          return React.cloneElement(child, {register: (state) => this.register(state)});

        case "User":
          return React.cloneElement(child, {addFriend: (state) => this.addFriend(state)});

        case "Home":
          return React.cloneElement(child, {createSlot: (state) => this.createSlot(state)});

        default:
          return child;
      };
    });
  }

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

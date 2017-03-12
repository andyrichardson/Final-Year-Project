const React = require('react');
const ReactDOM = require('react-dom');
const RB = require('react-bootstrap');
const Cookie = require('../includes/cookie');
const Api = require('./../includes/api');

/* COMPONENTS */
const Navbar = require('./navbar.jsx');
const SideNav = require('./sidenav.jsx');

/* APP COMPONENT */
class App extends React.Component {
  /* CONSTRUCTOR */
  constructor(props){
    super(props);
    this.state = {
      accessToken: Cookie.get("accessToken")
    };
  }

  /* UPDATE SELF TIMER */
  componentDidMount(){
    if(this.state.accessToken !== ""){
      this.updateSelf();
      setInterval(() => {
        this.updateSelf();
      }, 3000)
    }
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
      window.location.href = "/home";
    });
  }

  /* LOGOUT */
  logout() {
    Cookie.delete('accessToken');
    this.setState({accessToken: ""});
    window.location.href = "/";
  }

  /* UPDATE SELF */
  updateSelf() {
    return Api.getUserAuthenticated({accessToken: this.state.accessToken})
    .then((data) => {
      this.setState({user: data.message});
    });
  }

  /* USER HAS ACCESS TOKEN */
  isAuthenticated(){
    return this.state.user !== undefined;
  }

  /* PASSING PROPS TO CHILDREN */
  renderChildren(){
    return React.Children.map(this.props.children, (child) => {
      switch (child.type.name) {
        case "SignInForm":
          return React.cloneElement(child, {login: (state) => this.login(state)});

        default:
          return React.cloneElement(child, {user: this.state.user, accessToken: this.state.accessToken});
      };
    });
  }

  /* RENDER */
  render(){
    return(
      <div>
        <Navbar auth={this.isAuthenticated()} user={this.state.user} logout={() => this.logout()}/>
        <SideNav auth={this.isAuthenticated()}/>
        <RB.Col id={"content"} xs={12} lg={(this.isAuthenticated()) ? 10 : 12}>
          {this.renderChildren()}
        </RB.Col>
      </div>
    );
  }
}

module.exports = App;

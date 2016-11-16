const React = require('react');
const Link = require('react-router').Link;
const ReactDOM = require('react-dom');
const Auth = require('../includes/auth');

// Components
const ReactBootstrap = require('react-bootstrap');
const BSNavbar = ReactBootstrap.Navbar;
const Nav = ReactBootstrap.Nav;
const NavItem = ReactBootstrap.NavItem;

const SignIn = require('./signIn.jsx');
const SignUp = require('./signUp.jsx');

/* AUTHENTICATED USER NAVIGATION */
class AuthNav extends React.Component{
  logout(){
    console.log('logging out');
    Auth.logout();
  }

  render(){
    return(
      <Nav pullRight={true}>
        <li>
          <Link to={"/"}>Home</Link>
        </li>
        <li>
          <Link onClick={this.logout}>Logout</Link>
        </li>
      </Nav>
    );
  }
}

/* UNAUTHENTICATED USER NAVIGATION */
class UnauthNav extends React.Component{
  render(){
    return(
      <Nav pullRight={true}>
        <li>
          <Link to={"/login"}>Login</Link>
        </li>
        <li>
          <Link to={"/register"}>Register</Link>
        </li>
      </Nav>
    )
  }
}

/* NAVBAR */
class Navbar extends React.Component {
  constructor(props){
    super(props);
    console.log(this.props);
  }

  getNavItems(){
    if(this.props.auth){
      return AuthNav;
    }

    return UnauthNav;
  }

  render(){
    const NavItems = this.getNavItems();

    return(
      <BSNavbar>
        <NavItems/>
      </BSNavbar>
    );
  }
}

module.exports = Navbar;

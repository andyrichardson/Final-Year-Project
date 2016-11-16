const React = require('react');
const Link = require('react-router').Link;
const ReactDOM = require('react-dom');
const Auth = require('../includes/auth');

// Components
const RB = require('react-bootstrap');
const BSNavbar = RB.Navbar;
const Nav = RB.Nav;
const NavItem = RB.NavItem;
const FormGroup = RB.NavItem;

const SignIn = require('./signIn.jsx');
const SignUp = require('./signUp.jsx');
const FormInput = require('./formInput.jsx');

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
      <RB.Nav pullRight={true}>
        <li>
          <Link to={"/login"}>Login</Link>
        </li>
        <li>
          <Link to={"/register"}>Register</Link>
        </li>
      </RB.Nav>
    )
  }
}

class SearchBar extends React.Component{
  render(){
    return(
      <RB.Navbar.Form pullRight={true}>
        <RB.FormGroup>
          <RB.FormControl type="text" placeholder="Search" />
        </RB.FormGroup>
        <RB.Button type="submit">Submit</RB.Button>
      </RB.Navbar.Form>
    );
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

  getSearchBar(){
    if(this.props.auth){
      return SearchBar;
    }

    return null;
  }

  render(){
    const NavItems = this.getNavItems();
    const SearchBar = this.getSearchBar();

    return(
      <RB.Navbar>
        <SearchBar/>
        <NavItems/>
      </RB.Navbar>
    );
  }
}

module.exports = Navbar;

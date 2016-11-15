const React = require('react');
const Link = require('react-router').Link;
const ReactDOM = require('react-dom');

// Components
const ReactBootstrap = require('react-bootstrap');
const BSNavbar = ReactBootstrap.Navbar;
const Nav = ReactBootstrap.Nav;
const NavItem = ReactBootstrap.NavItem;

const SignIn = require('./signIn.jsx');
const SignUp = require('./signUp.jsx');


class Navbar extends React.Component {
  render(){
    return(
      <BSNavbar>
        <Nav pullRight={true}>
          <li>
              <Link to={"/login"}>Login</Link>
          </li>
        </Nav>
      </BSNavbar>
    );
  }
}

//
// <NavItem to={"/login"}>
//   hello
// </NavItem>
// <NavItem>
//   <Link to={"/register"}>Register</Link>
// </NavItem>
module.exports = Navbar;

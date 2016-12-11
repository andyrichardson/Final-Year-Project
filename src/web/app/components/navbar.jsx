const React = require('react');
const Link = require('react-router').Link;
const ReactDOM = require('react-dom');
const Auth = require('../includes/auth');
const Api = require('../includes/api');

// Components
const RB = require('react-bootstrap');
const Select = require('react-select');

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
      <RB.Nav pullRight={true}>
        <li>
          <Link to={"/"}>Home</Link>
        </li>
        <li>
          <Link onClick={this.logout}>Logout</Link>
        </li>
      </RB.Nav>
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

/* USER SEARCH BAR */
class SearchBar extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      searchResults: [
        { value: 'one', label: 'Option A' },
        { value: 'two', label: 'Option B' }
      ]
    }
  }

  changeHandler(value){
    if(value == ""){
      return this.setState({"searchResults": []});
    }

    Api.search(value)
    .then((data) => {
      this.setState({"searchResults": data});
    });
  }

  render(){
    if(!this.props.visible){
      return null;
    }

    return(
      <RB.Navbar.Form pullLeft={true}>
        <RB.FormGroup>
          <Select multiple onInputChange={(e) => this.changeHandler(e)} options={this.state.searchResults} noResultsText=""/>
        </RB.FormGroup>
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

  render(){
    const NavItems = this.getNavItems();

    return(
      <RB.Navbar>
        <SearchBar visible={this.props.auth}/>
        <NavItems/>
      </RB.Navbar>
    );
  }
}

module.exports = Navbar;

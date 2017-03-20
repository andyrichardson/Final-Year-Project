const React = require('react');
const Link = require('react-router').Link;
const History = require('react-router').browserHistory;
const ReactDOM = require('react-dom');
const Api = require('../includes/api');

// Components
const RB = require('react-bootstrap');
const Select = require('react-select');

const SignIn = require('./signIn.jsx');
const SignUp = require('./signUp.jsx');
const FormInput = require('./formInput.jsx');

/* AUTHENTICATED USER NAVIGATION */
class AuthNav extends React.Component{
  render() {
    return (
      <RB.Nav pullRight={true}>
        <li>
          <Link to={'/user/' + this.props.user.username}>
            {this.props.user.firstName + ' ' + this.props.user.lastName}
          </Link>
        </li>
        <li>
          <Link to={'#'} onClick={this.props.logout}>Logout</Link>
        </li>
      </RB.Nav>
    );
  }
}

/* UNAUTHENTICATED USER NAVIGATION */
class UnauthNav extends React.Component{
  render() {
    return (
      <RB.Nav pullRight={true}>
        <li>
          <Link to={'/login'}>Login</Link>
        </li>
        <li>
          <Link to={'/register'}>Register</Link>
        </li>
      </RB.Nav>
    );
  }
}

/* USER SEARCH BAR */
class SearchBar extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
    };
  }

  changeHandler(value) {
    if (value == '') {
      return this.setState({ searchResults: [] });
    }

    Api.search(value)
    .then((data) => {
      this.setState({ searchResults: data });
    });
  }

  clickHandler(obj) {
    History.push('/user/' + obj.value);
  }

  render() {
    if (!this.props.visible) {
      return null;
    }

    return (
      <RB.Navbar.Form pullLeft={true}>
        <RB.FormGroup>
          <Select
            multiple
            onInputChange={(e) => this.changeHandler(e)}
            onChange={(v) => this.clickHandler(v)}
            options={this.state.searchResults}
            autosize={false}
            noResultsText=""
            />
        </RB.FormGroup>
      </RB.Navbar.Form>
    );
  }
}

/* NAVBAR */
class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  getNavItems() {
    if (this.props.auth) {
      return (<AuthNav user={this.props.user} logout={this.props.logout}/>);
    }

    return (<UnauthNav/>);
  }

  render() {
    const navItems = this.getNavItems();

    return (
      <RB.Navbar>
        <RB.Button onClick={() => this.props.toggleSidenav()}>Toggle</RB.Button>
        <SearchBar visible={this.props.auth}/>
        {navItems}
      </RB.Navbar>
    );
  }
}

module.exports = Navbar;

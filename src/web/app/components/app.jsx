const React = require('react');
const ReactDOM = require('react-dom');
const Cookie = require('../includes/cookie');

/* COMPONENTS */
const Navbar = require('./navbar.jsx');

/* APP COMPONENT */
class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {accessToken: Cookie.get("accessToken")};
  }

  isAuthenticated(){
    return this.state.accessToken != "";
  }

  render(){
    return(
      <div>
        <Navbar auth={this.isAuthenticated()}/>
        {this.props.children}
      </div>
    );
  }
}

module.exports = App;

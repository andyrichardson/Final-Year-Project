const React = require('react');
const ReactDOM = require('react-dom');

class Navbar extends React.Component {
  constructor() {
    super();
  }

  render(){
    return(
      <div>
        <a onClick={(e) => this.signIn()}>Sign in</a>
        <a>Sign up</a>
      </div>
    );
  }

  signIn(){

  }
}

module.exports = Navbar;

const React = require('react');
const ReactDOM = require('react-dom');

const SignIn = require('./signIn.jsx');
const SignUp = require('./signUp.jsx');

class Navbar extends React.Component {
  render(){
    return(
      <div>
        <SignIn/>
        <SignUp/>
      </div>
    );
  }
}

module.exports = Navbar;

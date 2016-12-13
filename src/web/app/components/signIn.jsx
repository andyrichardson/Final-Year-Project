const React = require('react');
const ReactDOM = require('react-dom');
const Modal = require('react-modal');

// Middleware
const Validate = require('./../includes/validator');
const Api = require('./../includes/api');
const Auth = require('./../includes/auth');
const Cookie = require('./../includes/cookie');

// Components
const FormInput = require('./formInput.jsx');

class SignInForm extends React.Component {
  handleSubmit(e) {
    e.preventDefault(e);

    this.props.login(this.state)
    .then(function(data){
      alert("Sign in successful");
    })
    .catch(function(err){
        alert("Sign in error: " + err.message);
    });
  }

  render(){
    return(
      <div>
        <h1>Sign In</h1>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          Username
          <FormInput name="username" type="text" parent={this}></FormInput>

          Password
          <FormInput name="password" type="password" parent={this}></FormInput>

          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

module.exports = SignInForm;

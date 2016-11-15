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
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false
    };
  }

  showModal() {
    this.setState({modalOpen: true})
  }

  hideModal() {
    this.setState({modalOpen: false})
  }

  handleSubmit(e) {
    e.preventDefault(e);

    return Auth.login(this.state)
    .then(function(data){
      console.log(data);
      console.log('error');
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

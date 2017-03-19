const React = require('react');
const ReactDOM = require('react-dom');
const Modal = require('react-modal');
const Validate = require('./../includes/validator');
const Api = require('./../includes/api');
const FormInput = require('./formInput.jsx');

class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(e) {
    e.preventDefault(e);

    return Api.register(this.state)
    .then(data => {
      if (data.status != 200) {
        return alert('Unable to register: ' + data.message);
      }

      alert('Registration successful.');
    });
  }

  render() {
    return (
      <div>
        <h1>Sign Up</h1>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          Username
          <FormInput name="username" type="text" validate={Validate.username} parent={this}/>

          Password
          <FormInput name="password" type="password" validate={Validate.password} parent={this}/>

          Email
          <FormInput name="email" type="text" validate={Validate.email} parent={this}/>

          First Name
          <FormInput name="firstName" type="text" validate={Validate.firstName} parent={this}/>

          Last Name
          <FormInput name="lastName" type="text" validate={Validate.lastName} parent={this}/>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

module.exports = SignUpForm;

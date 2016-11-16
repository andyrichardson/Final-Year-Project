const React = require('react');
const ReactDOM = require('react-dom');
const Modal = require('react-modal');
const Validate = require('./../includes/validator');
const Api = require('./../includes/api');
const Auth = require('./../includes/auth');
const FormInput = require('./formInput.jsx');

class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false
    }
  }

  showModal() {
    this.setState({modalOpen: true})
  }

  hideModal() {
    this.setState({modalOpen: false})
  }

  prepareData() {
    return {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email,
      firstName: this.state.first,
      lastName: this.state.last
    };
  }

  handleSubmit(e){
    e.preventDefault(e);
    const data = this.prepareData();

    return Auth.signUp(data)
    .then(function(status){
      alert("Registration successful");
    })
    .catch(function(err){
      console.log(err);
      alert("Unable to register: " + err.message);
    })
  }

  render(){
    return(
      <div>
            <h1>Sign Up</h1>
            <form onSubmit={(e) => this.handleSubmit(e)}>
              Username
              <FormInput name="username" type="text" validate={Validate.username} parent={this}></FormInput>

              Password
              <FormInput name="password" type="password" validate={Validate.password} parent={this}></FormInput>

              Email
              <FormInput name="email" type="text" validate={Validate.email} parent={this}></FormInput>

              First Name
              <FormInput name="first" type="text" validate={Validate.firstName} parent={this}></FormInput>

              Last Name
              <FormInput name="last" type="text" validate={Validate.lastName} parent={this}></FormInput>
              <input type="submit" value="Submit" />
            </form>
      </div>
    );
  }
}

module.exports = SignUpForm;

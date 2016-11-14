const React = require('react');
const ReactDOM = require('react-dom');
const Modal = require('react-modal');

// Middleware
const Validate = require('./../includes/validator');
const Api = require('./../includes/api');
const Auth = require('./../includes/auth');

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

    return Api.login(this.state)
    .then(function(data){
      if(data.statusCode == 200){
        Auth.saveToken(data.body);
        console.log(data.body);
        alert("login successful");
      }
      else{
        alert("Unable to login: " + data.body);
      }
    })
    .catch(function(err){
      console.log(err);
    })
  }

  render(){
    return(
      <div>
        <a onClick={(e) => this.showModal()}>Sign In</a>
        <Modal isOpen={this.state.modalOpen} onRequestClose={(e) => this.hideModal()}>
          <h1>Sign In</h1>
          <form onSubmit={(e) => this.handleSubmit(e)}>
            Username
            <FormInput name="username" type="text" parent={this}></FormInput>

            Password
            <FormInput name="password" type="password" parent={this}></FormInput>

            <input type="submit" value="Submit" />
          </form>
        </Modal>
      </div>
    );
  }
}

module.exports = SignInForm;

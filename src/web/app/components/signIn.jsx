const React = require('react');
const ReactDOM = require('react-dom');
const Modal = require('react-modal');

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

  render(){
    return(
      <div>
        <a onClick={(e) => this.showModal()}>Sign In</a>
        <Modal
          isOpen={this.state.modalOpen}
          onRequestClose={(e) => this.hideModal()}
          >
          hello
        </Modal>
      </div>
    );
  }
}

module.exports = SignInForm;

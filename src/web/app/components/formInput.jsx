const React = require("react");
const ReactDOM = require("react-dom");

class FormInput extends React.Component{
  constructor(props) {
    super(props);
  }

  validate(value) {
    if (this.props.value === undefined) {
      return true;
    }

    return this.props.validate(value);
  }

  handleChange(e) {
    const name = this.props.name;
    const value = e.target.value;

    this.validate(value);

    const state = {};
    state[name] = value;
    this.props.parent.setState(state);
  }

  render() {
    return (
      <input type={this.props.type} onChange={(e) => this.handleChange(e)}></input>
    );
  }
}

module.exports = FormInput;

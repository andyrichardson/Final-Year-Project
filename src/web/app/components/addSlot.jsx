const RB = require('react-bootstrap');
const React = require('react');
const ReactDOM = require('react-dom');
const DatePicker = require('react-datepicker');
const Moment = require('moment');

class AddSlot extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      start: Moment(),
      finish: Moment().add(1, 'd')
    };
  }

  setStart(date){
    this.setState({start: date});
  }

  setFinish(date){
    this.setState({finish: date});
  }

  render(){
    return(
      <div>
        <h1>Add Slot</h1>
        <div>
          <RB.Col md={6}><DatePicker selected={this.state.start} onChange={(d)=>this.setStart(d)}/></RB.Col>
          <RB.Col md={6}><DatePicker selected={this.state.finish} onChange={(d)=>this.setFinish(d)}/></RB.Col>
          <RB.Button bsClass="btn pull-right">Add</RB.Button>
        </div>
      </div>
    );
  }
}

module.exports = AddSlot;

const RB = require('react-bootstrap');
const React = require('react');
const ReactDOM = require('react-dom');
const AddSlot = require('./addSlot.jsx');

class Home extends React.Component{
  render(){
    return(
      <RB.Col md={8} mdOffset={2}>
        <AddSlot/>
      </RB.Col>
    );
  }
}

module.exports = Home;
